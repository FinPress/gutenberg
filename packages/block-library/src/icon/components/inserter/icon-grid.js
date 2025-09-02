/**
 * External dependencies
 */
import clsx from 'clsx';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Icon, blockDefault } from '@wordpress/icons';
import { Button } from '@wordpress/components';

/**
 * Internal dependencies
 */
import { parseIcon } from './../../utils';

export default function IconGrid( props ) {
	const { shownIcons, iconSize, updateIconAtts, attributes } = props;

	const noResults = (
		<div className="block-editor-inserter__no-results">
			<Icon
				icon={ blockDefault }
				className="block-editor-inserter__no-results-icon"
			/>
			<p>{ __( 'No results found.' ) }</p>
		</div>
	);

	const searchResults = (
		<div className="icons-list">
			{ shownIcons.map( ( icon ) => {
				let renderedIcon = icon.icon;

				// Icons provided by third-parties are generally strings.
				if ( typeof renderedIcon === 'string' ) {
					renderedIcon = parseIcon( renderedIcon );
				}

				return (
					<Button
						key={ `icon-${ icon.name }` }
						className={ clsx(
							'icons-list__item',
							'block-editor-block-types-list__item',
							{
								'is-active': icon.name === attributes?.iconName,
								'has-no-icon-fill': icon?.hasNoIconFill,
							}
						) }
						onClick={ () =>
							updateIconAtts( icon.name, icon?.hasNoIconFill )
						}
						__next40pxDefaultSize
					>
						<span className="icons-list__item-icon">
							<Icon icon={ renderedIcon } size={ iconSize } />
						</span>
						<span className="icons-list__item-title">
							{ icon?.title ?? icon.name }
						</span>
					</Button>
				);
			} ) }
		</div>
	);

	return (
		<div className="icon-inserter__content-grid">
			{ shownIcons.length === 0 ? noResults : searchResults }
		</div>
	);
}
