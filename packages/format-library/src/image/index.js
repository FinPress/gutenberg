/**
 * WordPress dependencies
 */
import {
	Path,
	SVG,
	Popover,
	Button,
	ExternalLink,
	__experimentalHStack as HStack,
	__experimentalVStack as VStack,
	__experimentalNumberControl as NumberControl,
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOptionIcon as ToggleGroupControlOptionIcon,
	TextareaControl,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import {
	justifyTop,
	justifyCenterVertical,
	justifyBottom,
} from '@wordpress/icons';
import { useState } from '@wordpress/element';
import { insertObject, useAnchor } from '@wordpress/rich-text';
import {
	MediaUpload,
	RichTextToolbarButton,
	MediaUploadCheck,
} from '@wordpress/block-editor';

const ALLOWED_MEDIA_TYPES = [ 'image' ];

const name = 'core/image';
const title = __( 'Inline image' );

/**
 * Extracts vertical alignment from the style attribute.
 *
 * @param {string} style The style attribute string.
 * @return {string} The vertical alignment value or 'center' as default.
 */
function getVerticalAlignment( style ) {
	if ( ! style ) {
		return 'center';
	}

	const match = style.match( /vertical-align:\s*([^;]+)/ );
	const alignment = match ? match[ 1 ].trim() : 'center';

	// Convert 'middle' to 'center' for consistency with BlockVerticalAlignmentControl
	return alignment === 'middle' ? 'center' : alignment;
}

/**
 * Extracts the image ID from the className attribute.
 *
 * @param {Object} activeObjectAttributes The attributes of the active object.
 * @return {number|undefined} The extracted image ID or undefined if not found.
 */
function getCurrentImageId( activeObjectAttributes ) {
	if ( ! activeObjectAttributes?.className ) {
		return undefined;
	}

	const [ , id ] =
		activeObjectAttributes.className.match( /wp-image-(\d+)/ ) ?? [];

	return id ? parseInt( id, 10 ) : undefined;
}

export const image = {
	name,
	title,
	keywords: [ __( 'photo' ), __( 'media' ) ],
	object: true,
	tagName: 'img',
	className: null,
	attributes: {
		className: 'class',
		style: 'style',
		url: 'src',
		alt: 'alt',
	},
	edit: Edit,
};

function InlineUI( { value, onChange, activeObjectAttributes, contentRef } ) {
	const { style, alt } = activeObjectAttributes;
	const width = style?.replace( /\D/g, '' );
	const verticalAlign = getVerticalAlignment( style );

	const [ editedWidth, setEditedWidth ] = useState( width );
	const [ editedAlt, setEditedAlt ] = useState( alt );
	const [ editedAlignment, setEditedAlignment ] = useState( verticalAlign );

	const hasChanged =
		editedWidth !== width ||
		editedAlt !== alt ||
		editedAlignment !== verticalAlign;
	const popoverAnchor = useAnchor( {
		editableContentElement: contentRef.current,
		settings: image,
	} );

	return (
		<Popover
			placement="bottom"
			focusOnMount={ false }
			anchor={ popoverAnchor }
			className="block-editor-format-toolbar__image-popover"
		>
			<form
				className="block-editor-format-toolbar__image-container-content"
				onSubmit={ ( event ) => {
					const newReplacements = value.replacements.slice();

					// Build style string with width and vertical alignment
					let newStyle = '';
					if ( editedWidth ) {
						newStyle += `width: ${ editedWidth }px;`;
					}
					if ( editedAlignment ) {
						// Convert 'center' back to 'middle' for CSS compatibility
						const cssAlignment =
							editedAlignment === 'center'
								? 'middle'
								: editedAlignment;
						newStyle += ` vertical-align: ${ cssAlignment };`;
					}

					newReplacements[ value.start ] = {
						type: name,
						attributes: {
							...activeObjectAttributes,
							style: newStyle,
							alt: editedAlt,
						},
					};

					onChange( {
						...value,
						replacements: newReplacements,
					} );

					event.preventDefault();
				} }
			>
				<VStack spacing={ 4 }>
					<NumberControl
						__next40pxDefaultSize
						label={ __( 'Width' ) }
						value={ editedWidth }
						min={ 1 }
						onChange={ ( newWidth ) => {
							setEditedWidth( newWidth );
						} }
					/>
					<ToggleGroupControl
						__next40pxDefaultSize
						__nextHasNoMarginBottom
						isBlock
						label="Vertical Alignment"
						value={ editedAlignment }
						onChange={ ( newAlignment ) => {
							setEditedAlignment( newAlignment );
						} }
					>
						<ToggleGroupControlOptionIcon
							icon={ justifyTop }
							label={ __( 'Align top' ) }
							value="top"
						/>
						<ToggleGroupControlOptionIcon
							icon={ justifyCenterVertical }
							label={ __( 'Align center' ) }
							value="center"
						/>
						<ToggleGroupControlOptionIcon
							icon={ justifyBottom }
							label={ __( 'Align bottom' ) }
							value="bottom"
						/>
					</ToggleGroupControl>
					<TextareaControl
						label={ __( 'Alternative text' ) }
						__nextHasNoMarginBottom
						value={ editedAlt }
						onChange={ ( newAlt ) => {
							setEditedAlt( newAlt );
						} }
						help={
							<>
								<ExternalLink
									href={
										// translators: Localized tutorial, if one exists. W3C Web Accessibility Initiative link has list of existing translations.
										__(
											'https://www.w3.org/WAI/tutorials/images/decision-tree/'
										)
									}
								>
									{ __(
										'Describe the purpose of the image.'
									) }
								</ExternalLink>
								<br />
								{ __( 'Leave empty if decorative.' ) }
							</>
						}
					/>
					<HStack justify="right">
						<Button
							disabled={ ! hasChanged }
							accessibleWhenDisabled
							variant="primary"
							type="submit"
							size="compact"
						>
							{ __( 'Apply' ) }
						</Button>
					</HStack>
				</VStack>
			</form>
		</Popover>
	);
}

function Edit( {
	value,
	onChange,
	onFocus,
	isObjectActive,
	activeObjectAttributes,
	contentRef,
} ) {
	return (
		<MediaUploadCheck>
			<MediaUpload
				allowedTypes={ ALLOWED_MEDIA_TYPES }
				value={ getCurrentImageId( activeObjectAttributes ) }
				onSelect={ ( { id, url, alt, width: imgWidth } ) => {
					onChange(
						insertObject( value, {
							type: name,
							attributes: {
								className: `wp-image-${ id }`,
								style: `width: ${ Math.min(
									imgWidth,
									150
								) }px; vertical-align: middle;`,
								url,
								alt,
							},
						} )
					);
					onFocus();
				} }
				render={ ( { open } ) => (
					<RichTextToolbarButton
						icon={
							<SVG
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 24 24"
							>
								<Path d="M4 18.5h16V17H4v1.5zM16 13v1.5h4V13h-4zM5.1 15h7.8c.6 0 1.1-.5 1.1-1.1V6.1c0-.6-.5-1.1-1.1-1.1H5.1C4.5 5 4 5.5 4 6.1v7.8c0 .6.5 1.1 1.1 1.1zm.4-8.5h7V10l-1-1c-.3-.3-.8-.3-1 0l-1.6 1.5-1.2-.7c-.3-.2-.6-.2-.9 0l-1.3 1V6.5zm0 6.1l1.8-1.3 1.3.8c.3.2.7.2.9-.1l1.5-1.4 1.5 1.4v1.5h-7v-.9z" />
							</SVG>
						}
						title={ isObjectActive ? __( 'Replace image' ) : title }
						onClick={ open }
						isActive={ isObjectActive }
					/>
				) }
			/>
			{ isObjectActive && (
				<InlineUI
					value={ value }
					onChange={ onChange }
					activeObjectAttributes={ activeObjectAttributes }
					contentRef={ contentRef }
				/>
			) }
		</MediaUploadCheck>
	);
}
