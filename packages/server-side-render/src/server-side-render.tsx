/**
 * External dependencies
 */
import fastDeepEqual from 'fast-deep-equal/es6';
import type { ReactNode } from 'react';

/**
 * WordPress dependencies
 */
import { useDebounce, usePrevious } from '@wordpress/compose';
import {
	RawHTML,
	useCallback,
	useEffect,
	useLayoutEffect,
	useRef,
	useState,
} from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';
import { Placeholder, Spinner } from '@wordpress/components';

// Temporarily define this type since we don't have access to @wordpress/blocks types
type ExperimentalSanitizeBlockAttributes = (
	block: string,
	attributes: Record< string, unknown >
) => Record< string, unknown >;

// Mock implementation for __experimentalSanitizeBlockAttributes
const __experimentalSanitizeBlockAttributes: ExperimentalSanitizeBlockAttributes =
	( block: string, attributes: Record< string, unknown > ) => attributes;

interface UrlQueryArgs {
	[ key: string ]: unknown;
}

interface BlockAttributes {
	[ key: string ]: unknown;
	style?: {
		border?: unknown;
		color?: unknown;
		elements?: unknown;
		spacing?: unknown;
		typography?: unknown;
		[ key: string ]: unknown;
	};
	backgroundColor?: unknown;
	borderColor?: unknown;
	fontFamily?: unknown;
	fontSize?: unknown;
	gradient?: unknown;
	textColor?: unknown;
	className?: unknown;
}

interface ErrorResponse {
	error: boolean;
	errorMsg: string;
}

interface ServerSideRenderProps {
	block: string;
	attributes?: BlockAttributes;
	urlQueryArgs?: UrlQueryArgs;
	className?: string;
	httpMethod?: 'GET' | 'POST';
	skipBlockSupportAttributes?: boolean;
	EmptyResponsePlaceholder?: React.ComponentType< EmptyResponsePlaceholderProps >;
	ErrorResponsePlaceholder?: React.ComponentType< ErrorResponsePlaceholderProps >;
	LoadingResponsePlaceholder?: React.ComponentType< LoadingResponsePlaceholderProps >;
	[ key: string ]: unknown;
}

interface EmptyResponsePlaceholderProps {
	className?: string;
	[ key: string ]: unknown;
}

interface ErrorResponsePlaceholderProps {
	response: ErrorResponse;
	className?: string;
	[ key: string ]: unknown;
}

interface LoadingResponsePlaceholderProps {
	children?: ReactNode;
	[ key: string ]: unknown;
}

const EMPTY_OBJECT = {};

export function rendererPath(
	block: string,
	attributes: unknown = null,
	urlQueryArgs: UrlQueryArgs = {}
): string {
	return addQueryArgs( `/wp/v2/block-renderer/${ block }`, {
		context: 'edit',
		...( null !== attributes ? { attributes } : {} ),
		...urlQueryArgs,
	} );
}

export function removeBlockSupportAttributes(
	attributes: BlockAttributes
): BlockAttributes {
	const {
		backgroundColor,
		borderColor,
		fontFamily,
		fontSize,
		gradient,
		textColor,
		className,
		...restAttributes
	} = attributes;

	const style = attributes?.style || EMPTY_OBJECT;
	// Using type assertions to handle potentially missing properties
	const restStyles: Record< string, unknown > = {};

	// Copy all properties except the ones we want to exclude
	Object.keys( style ).forEach( ( key ) => {
		if (
			! [
				'border',
				'color',
				'elements',
				'spacing',
				'typography',
			].includes( key )
		) {
			restStyles[ key ] = style[ key as keyof typeof style ];
		}
	} );

	return {
		...restAttributes,
		style: Object.keys( restStyles ).length ? restStyles : undefined,
	};
}

function DefaultEmptyResponsePlaceholder( {
	className,
}: EmptyResponsePlaceholderProps ): JSX.Element {
	return (
		<Placeholder className={ className }>
			{ __( 'Block rendered as empty.' ) }
		</Placeholder>
	);
}

function DefaultErrorResponsePlaceholder( {
	response,
	className,
}: ErrorResponsePlaceholderProps ): JSX.Element {
	const errorMessage = sprintf(
		// translators: %s: error message describing the problem
		__( 'Error loading block: %s' ),
		response.errorMsg
	);
	return <Placeholder className={ className }>{ errorMessage }</Placeholder>;
}

function DefaultLoadingResponsePlaceholder( {
	children,
}: LoadingResponsePlaceholderProps ): JSX.Element {
	const [ showLoader, setShowLoader ] = useState( false );

	useEffect( () => {
		// Schedule showing the Spinner after 1 second.
		const timeout = setTimeout( () => {
			setShowLoader( true );
		}, 1000 );
		return () => clearTimeout( timeout );
	}, [] );

	return (
		<div style={ { position: 'relative' } }>
			{ showLoader && (
				<div
					style={ {
						position: 'absolute',
						top: '50%',
						left: '50%',
						marginTop: '-9px',
						marginLeft: '-9px',
					} }
				>
					<Spinner />
				</div>
			) }
			<div style={ { opacity: showLoader ? '0.3' : 1 } }>
				{ children }
			</div>
		</div>
	);
}

export default function ServerSideRender(
	props: ServerSideRenderProps
): JSX.Element {
	const {
		className,
		EmptyResponsePlaceholder = DefaultEmptyResponsePlaceholder,
		ErrorResponsePlaceholder = DefaultErrorResponsePlaceholder,
		LoadingResponsePlaceholder = DefaultLoadingResponsePlaceholder,
	} = props;

	const isMountedRef = useRef( false );
	const fetchRequestRef = useRef< Promise< unknown > >();
	const [ response, setResponse ] = useState< string | ErrorResponse | null >(
		null
	);
	const prevProps = usePrevious( props );
	const [ isLoading, setIsLoading ] = useState( false );
	const latestPropsRef = useRef( props );

	useLayoutEffect( () => {
		latestPropsRef.current = props;
	}, [ props ] );

	const fetchData = useCallback( () => {
		if ( ! isMountedRef.current ) {
			return;
		}

		const {
			attributes,
			block,
			skipBlockSupportAttributes = false,
			httpMethod = 'GET',
			urlQueryArgs,
		} = latestPropsRef.current;

		setIsLoading( true );

		let sanitizedAttributes: BlockAttributes | undefined | null =
			attributes &&
			__experimentalSanitizeBlockAttributes(
				block,
				attributes as Record< string, unknown >
			);

		if ( skipBlockSupportAttributes && sanitizedAttributes ) {
			sanitizedAttributes =
				removeBlockSupportAttributes( sanitizedAttributes );
		}

		// If httpMethod is 'POST', send the attributes in the request body instead of the URL.
		// This allows sending a larger attributes object than in a GET request, where the attributes are in the URL.
		const isPostRequest = 'POST' === httpMethod;
		const urlAttributes = isPostRequest
			? null
			: sanitizedAttributes ?? null;
		const path = rendererPath(
			block,
			urlAttributes,
			urlQueryArgs as UrlQueryArgs
		);
		const data = isPostRequest
			? { attributes: sanitizedAttributes ?? null }
			: null;

		// Store the latest fetch request so that when we process it, we can
		// check if it is the current request, to avoid race conditions on slow networks.
		const fetchRequest = ( fetchRequestRef.current = apiFetch( {
			path,
			data,
			method: isPostRequest ? 'POST' : 'GET',
		} )
			.then( ( fetchResponse ) => {
				if (
					isMountedRef.current &&
					fetchRequest === fetchRequestRef.current &&
					fetchResponse
				) {
					setResponse(
						( fetchResponse as { rendered: string } ).rendered
					);
				}
			} )
			.catch( ( error: { message: string } ) => {
				if (
					isMountedRef.current &&
					fetchRequest === fetchRequestRef.current
				) {
					setResponse( {
						error: true,
						errorMsg: error.message,
					} );
				}
			} )
			.finally( () => {
				if (
					isMountedRef.current &&
					fetchRequest === fetchRequestRef.current
				) {
					setIsLoading( false );
				}
			} ) ) as Promise< unknown >;

		return fetchRequest;
	}, [] );

	const debouncedFetchData = useDebounce( fetchData, 500 );

	// When the component unmounts, set isMountedRef to false. This will
	// let the async fetch callbacks know when to stop.
	useEffect( () => {
		isMountedRef.current = true;
		return () => {
			isMountedRef.current = false;
		};
	}, [] );

	useEffect( () => {
		// Don't debounce the first fetch. This ensures that the first render
		// shows data as soon as possible.
		if ( prevProps === undefined ) {
			fetchData();
		} else if ( ! fastDeepEqual( prevProps, props ) ) {
			debouncedFetchData();
		}
	} );

	const hasResponse = !! response;
	const hasEmptyResponse = response === '';
	const hasError = !! ( response as ErrorResponse )?.error;

	if ( isLoading ) {
		return (
			<LoadingResponsePlaceholder { ...props }>
				{ hasResponse && ! hasError && (
					<RawHTML className={ className }>
						{ response as string }
					</RawHTML>
				) }
			</LoadingResponsePlaceholder>
		);
	}

	if ( hasEmptyResponse || ! hasResponse ) {
		return <EmptyResponsePlaceholder { ...props } />;
	}

	if ( hasError ) {
		return (
			<ErrorResponsePlaceholder
				response={ response as ErrorResponse }
				{ ...props }
			/>
		);
	}

	return <RawHTML className={ className }>{ response as string }</RawHTML>;
}
