/**
 * WordPress dependencies
 */
import {
	__experimentalHStack as HStack,
	__experimentalVStack as VStack,
} from '@wordpress/components';
import { useContext } from '@wordpress/element';

/**
 * Internal dependencies
 */
import DataViewsContext from '../dataviews-context';
import type { EmptyViewProps } from '../../types';

function DataViewsEmptyContent( {
	heading,
	description,
	illustration,
	actions,
}: EmptyViewProps ) {
	if ( ! description && ! illustration && ! actions ) {
		return heading;
	}

	const illustrationElement =
		typeof illustration === 'string' ? (
			<img
				className="dataviews-empty__illustration"
				src={ illustration }
				alt=""
			/>
		) : (
			illustration
		);

	return (
		<VStack spacing={ 6 } alignment="center" className="dataviews-empty">
			{ illustration && illustrationElement }
			<VStack spacing={ 0 } alignment="center">
				<div className="dataviews-empty__heading">{ heading }</div>
				{ description && (
					<div className="dataviews-empty__description">
						{ description }
					</div>
				) }
			</VStack>
			{ actions && (
				<HStack spacing={ 2 } justify="center">
					{ actions }
				</HStack>
			) }
		</VStack>
	);
}

export function DataViewsEmpty() {
	const { empty } = useContext( DataViewsContext );
	return <DataViewsEmptyContent { ...empty } />;
}
