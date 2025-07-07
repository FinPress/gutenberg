/**
 * WordPress dependencies
 */
import { useDispatch } from '@wordpress/data';
import { useInstanceId } from '@wordpress/compose';
import { useEffect, useCallback } from '@wordpress/element';
import {
	InspectorControls,
	useBlockProps,
	store as blockEditorStore,
	useInnerBlocksProps,
	privateApis as blockEditorPrivateApis,
} from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { unlock } from '../lock-unlock';
import TermsQueryInspectorControls from './inspector-controls';

const { HTMLElementControl } = unlock( blockEditorPrivateApis );

const TEMPLATE = [ [ 'core/terms-template' ] ];

export default function TermsQueryContent( {
	attributes,
	setAttributes,
	clientId,
	name,
} ) {
	const { queryId, tagName: TagName = 'div' } = attributes;

	const { __unstableMarkNextChangeAsNotPersistent } =
		useDispatch( blockEditorStore );
	const instanceId = useInstanceId( TermsQueryContent );
	const blockProps = useBlockProps();
	const innerBlocksProps = useInnerBlocksProps( blockProps, {
		template: TEMPLATE,
	} );

	useEffect( () => {
		if ( ! queryId ) {
			__unstableMarkNextChangeAsNotPersistent();
			setAttributes( { queryId: instanceId } );
		}
	}, [
		queryId,
		instanceId,
		setAttributes,
		__unstableMarkNextChangeAsNotPersistent,
	] );

	const updateQuery = useCallback(
		( newQuery ) =>
			setAttributes( ( prevAttributes ) => ( {
				query: { ...prevAttributes.query, ...newQuery },
			} ) ),
		[ setAttributes ]
	);

	return (
		<>
			<InspectorControls>
				<TermsQueryInspectorControls
					name={ name }
					attributes={ attributes }
					setQuery={ updateQuery }
					setAttributes={ setAttributes }
					clientId={ clientId }
				/>
			</InspectorControls>
			<InspectorControls group="advanced">
				<HTMLElementControl
					tagName={ TagName }
					onChange={ ( value ) =>
						setAttributes( { tagName: value } )
					}
					clientId={ clientId }
					options={ [
						{ label: __( 'Default (<div>)' ), value: 'div' },
						{ label: '<main>', value: 'main' },
						{ label: '<section>', value: 'section' },
						{ label: '<aside>', value: 'aside' },
					] }
				/>
			</InspectorControls>
			<TagName { ...innerBlocksProps } />
		</>
	);
}
