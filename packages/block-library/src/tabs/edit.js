/**
 * WordPress dependencies
 */
import {
	useBlockProps,
	useInnerBlocksProps,
	withColors,
} from '@wordpress/block-editor';
import { Fragment } from '@wordpress/element';

/**
 * Internal dependencies
 */
import Controls from './controls';
import useColorSupports from './use-color-supports';
import { TabFill } from '../tab/slotfill';

const TABS_TEMPLATE = [
	[ 'core/tab', { label: 'Tab 1' } ],
	[ 'core/tab', { label: 'Tab 2' } ],
];

function Edit( {
	clientId,
	attributes,
	setAttributes,
	isSelected,
	tabBackgroundColor,
	setTabBackgroundColor,
	tabHoverColor,
	setTabHoverColor,
	tabActiveColor,
	setTabActiveColor,
	tabTextColor,
	setTabTextColor,
	tabActiveTextColor,
	setTabActiveTextColor,
	tabHoverTextColor,
	setTabHoverTextColor,
} ) {
	const {
		customTabBackgroundColor,
		customTabHoverColor,
		customTabActiveColor,
		customTabTextColor,
		customTabActiveTextColor,
		customTabHoverTextColor,
		style,
		orientation,
	} = attributes;

	/**
	 * Provide additional non-core color supports for tab background and text colors.
	 * TODO: Talk to Gutenberg team about how to add these into the style engine proper so that these can be set in the style book.
	 */
	const additionalColorSupportingStyles = useColorSupports( {
		customTabBackgroundColor,
		customTabHoverColor,
		customTabActiveColor,
		customTabTextColor,
		customTabActiveTextColor,
		customTabHoverTextColor,
	} );

	/**
	 * Block props for the tabs container.
	 */
	const blockProps = useBlockProps( {
		className:
			'vertical' === orientation
				? 'is-orientation-vertical'
				: 'is-orientation-horizontal',
		style: {
			...style,
			...additionalColorSupportingStyles,
		},
	} );

	/**
	 * Innerblocks props for the tabs content.
	 */
	const innerBlockProps = useInnerBlocksProps(
		{
			className: 'tabs__content',
		},
		{
			__experimentalCaptureToolbars: true,
			clientId,
			orientation,
			template: TABS_TEMPLATE,
		}
	);

	return (
		<Fragment>
			<Controls
				{ ...{
					clientId,
					attributes,
					setAttributes,
					tabBackgroundColor,
					setTabBackgroundColor,
					tabHoverColor,
					setTabHoverColor,
					tabActiveColor,
					setTabActiveColor,
					tabTextColor,
					setTabTextColor,
					tabActiveTextColor,
					setTabActiveTextColor,
					tabHoverTextColor,
					setTabHoverTextColor,
				} }
			/>
			<div { ...blockProps }>
				<TabFill tabsClientId={ clientId }>
					{ isSelected && (
						<li className="tab-item wp-block-tabs__tab-item tab-item--inserter">
							{ /* <InnerBlocks.ButtonBlockAppender
								icon="plus"
								onClick={ appendTabItem }
							/> */ }
							<span>+ ADD TAB</span>
						</li>
					) }
				</TabFill>

				{ innerBlockProps.children }
			</div>
		</Fragment>
	);
}

export default withColors(
	'tabBackgroundColor',
	'tabHoverColor',
	'tabActiveColor',
	'tabTextColor',
	'tabActiveTextColor',
	'tabHoverTextColor'
)( Edit );
