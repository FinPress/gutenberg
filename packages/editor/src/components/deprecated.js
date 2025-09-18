// Block Creation Components.
/**
 * FinPress dependencies
 */
import deprecated from '@finpress/deprecated';
import { forwardRef } from '@finpress/element';
import {
	Autocomplete as RootAutocomplete,
	AlignmentToolbar as RootAlignmentToolbar,
	BlockAlignmentToolbar as RootBlockAlignmentToolbar,
	BlockControls as RootBlockControls,
	BlockEdit as RootBlockEdit,
	BlockEditorKeyboardShortcuts as RootBlockEditorKeyboardShortcuts,
	BlockFormatControls as RootBlockFormatControls,
	BlockIcon as RootBlockIcon,
	BlockInspector as RootBlockInspector,
	BlockList as RootBlockList,
	BlockMover as RootBlockMover,
	BlockNavigationDropdown as RootBlockNavigationDropdown,
	BlockSelectionClearer as RootBlockSelectionClearer,
	BlockSettingsMenu as RootBlockSettingsMenu,
	BlockTitle as RootBlockTitle,
	BlockToolbar as RootBlockToolbar,
	ColorPalette as RootColorPalette,
	ContrastChecker as RootContrastChecker,
	CopyHandler as RootCopyHandler,
	createCustomColorsHOC as rootCreateCustomColorsHOC,
	DefaultBlockAppender as RootDefaultBlockAppender,
	FontSizePicker as RootFontSizePicker,
	getColorClassName as rootGetColorClassName,
	getColorObjectByAttributeValues as rootGetColorObjectByAttributeValues,
	getColorObjectByColorValue as rootGetColorObjectByColorValue,
	getFontSize as rootGetFontSize,
	getFontSizeClass as rootGetFontSizeClass,
	Inserter as RootInserter,
	InnerBlocks as RootInnerBlocks,
	InspectorAdvancedControls as RootInspectorAdvancedControls,
	InspectorControls as RootInspectorControls,
	PanelColorSettings as RootPanelColorSettings,
	PlainText as RootPlainText,
	RichText as RootRichText,
	RichTextShortcut as RootRichTextShortcut,
	RichTextToolbarButton as RootRichTextToolbarButton,
	__unstableRichTextInputEvent as __unstableRootRichTextInputEvent,
	MediaPlaceholder as RootMediaPlaceholder,
	MediaUpload as RootMediaUpload,
	MediaUploadCheck as RootMediaUploadCheck,
	MultiSelectScrollIntoView as RootMultiSelectScrollIntoView,
	NavigableToolbar as RootNavigableToolbar,
	ObserveTyping as RootObserveTyping,
	SkipToSelectedBlock as RootSkipToSelectedBlock,
	URLInput as RootURLInput,
	URLInputButton as RootURLInputButton,
	URLPopover as RootURLPopover,
	Warning as RootWarning,
	WritingFlow as RootWritingFlow,
	withColorContext as rootWithColorContext,
	withColors as rootWithColors,
	withFontSizes as rootWithFontSizes,
} from '@finpress/block-editor';

export { default as ServerSideRender } from '@finpress/server-side-render';

function deprecateComponent( name, Wrapped, staticsToHoist = [] ) {
	const Component = forwardRef( ( props, ref ) => {
		deprecated( 'fin.editor.' + name, {
			since: '5.3',
			alternative: 'fin.blockEditor.' + name,
			version: '6.2',
		} );

		return <Wrapped ref={ ref } { ...props } />;
	} );

	staticsToHoist.forEach( ( staticName ) => {
		Component[ staticName ] = deprecateComponent(
			name + '.' + staticName,
			Wrapped[ staticName ]
		);
	} );

	return Component;
}

function deprecateFunction( name, func ) {
	return ( ...args ) => {
		deprecated( 'fin.editor.' + name, {
			since: '5.3',
			alternative: 'fin.blockEditor.' + name,
			version: '6.2',
		} );

		return func( ...args );
	};
}

/**
 * @deprecated since 5.3, use `fin.blockEditor.RichText` instead.
 */
const RichText = deprecateComponent( 'RichText', RootRichText, [ 'Content' ] );
RichText.isEmpty = deprecateFunction(
	'RichText.isEmpty',
	RootRichText.isEmpty
);

export { RichText };

/**
 * @deprecated since 5.3, use `fin.blockEditor.Autocomplete` instead.
 */
export const Autocomplete = deprecateComponent(
	'Autocomplete',
	RootAutocomplete
);
/**
 * @deprecated since 5.3, use `fin.blockEditor.AlignmentToolbar` instead.
 */
export const AlignmentToolbar = deprecateComponent(
	'AlignmentToolbar',
	RootAlignmentToolbar
);
/**
 * @deprecated since 5.3, use `fin.blockEditor.BlockAlignmentToolbar` instead.
 */
export const BlockAlignmentToolbar = deprecateComponent(
	'BlockAlignmentToolbar',
	RootBlockAlignmentToolbar
);
/**
 * @deprecated since 5.3, use `fin.blockEditor.BlockControls` instead.
 */
export const BlockControls = deprecateComponent(
	'BlockControls',
	RootBlockControls,
	[ 'Slot' ]
);
/**
 * @deprecated since 5.3, use `fin.blockEditor.BlockEdit` instead.
 */
export const BlockEdit = deprecateComponent( 'BlockEdit', RootBlockEdit );
/**
 * @deprecated since 5.3, use `fin.blockEditor.BlockEditorKeyboardShortcuts` instead.
 */
export const BlockEditorKeyboardShortcuts = deprecateComponent(
	'BlockEditorKeyboardShortcuts',
	RootBlockEditorKeyboardShortcuts
);
/**
 * @deprecated since 5.3, use `fin.blockEditor.BlockFormatControls` instead.
 */
export const BlockFormatControls = deprecateComponent(
	'BlockFormatControls',
	RootBlockFormatControls,
	[ 'Slot' ]
);
/**
 * @deprecated since 5.3, use `fin.blockEditor.BlockIcon` instead.
 */
export const BlockIcon = deprecateComponent( 'BlockIcon', RootBlockIcon );
/**
 * @deprecated since 5.3, use `fin.blockEditor.BlockInspector` instead.
 */
export const BlockInspector = deprecateComponent(
	'BlockInspector',
	RootBlockInspector
);
/**
 * @deprecated since 5.3, use `fin.blockEditor.BlockList` instead.
 */
export const BlockList = deprecateComponent( 'BlockList', RootBlockList );
/**
 * @deprecated since 5.3, use `fin.blockEditor.BlockMover` instead.
 */
export const BlockMover = deprecateComponent( 'BlockMover', RootBlockMover );
/**
 * @deprecated since 5.3, use `fin.blockEditor.BlockNavigationDropdown` instead.
 */
export const BlockNavigationDropdown = deprecateComponent(
	'BlockNavigationDropdown',
	RootBlockNavigationDropdown
);
/**
 * @deprecated since 5.3, use `fin.blockEditor.BlockSelectionClearer` instead.
 */
export const BlockSelectionClearer = deprecateComponent(
	'BlockSelectionClearer',
	RootBlockSelectionClearer
);
/**
 * @deprecated since 5.3, use `fin.blockEditor.BlockSettingsMenu` instead.
 */
export const BlockSettingsMenu = deprecateComponent(
	'BlockSettingsMenu',
	RootBlockSettingsMenu
);
/**
 * @deprecated since 5.3, use `fin.blockEditor.BlockTitle` instead.
 */
export const BlockTitle = deprecateComponent( 'BlockTitle', RootBlockTitle );
/**
 * @deprecated since 5.3, use `fin.blockEditor.BlockToolbar` instead.
 */
export const BlockToolbar = deprecateComponent(
	'BlockToolbar',
	RootBlockToolbar
);
/**
 * @deprecated since 5.3, use `fin.blockEditor.ColorPalette` instead.
 */
export const ColorPalette = deprecateComponent(
	'ColorPalette',
	RootColorPalette
);
/**
 * @deprecated since 5.3, use `fin.blockEditor.ContrastChecker` instead.
 */
export const ContrastChecker = deprecateComponent(
	'ContrastChecker',
	RootContrastChecker
);
/**
 * @deprecated since 5.3, use `fin.blockEditor.CopyHandler` instead.
 */
export const CopyHandler = deprecateComponent( 'CopyHandler', RootCopyHandler );
/**
 * @deprecated since 5.3, use `fin.blockEditor.DefaultBlockAppender` instead.
 */
export const DefaultBlockAppender = deprecateComponent(
	'DefaultBlockAppender',
	RootDefaultBlockAppender
);
/**
 * @deprecated since 5.3, use `fin.blockEditor.FontSizePicker` instead.
 */
export const FontSizePicker = deprecateComponent(
	'FontSizePicker',
	RootFontSizePicker
);
/**
 * @deprecated since 5.3, use `fin.blockEditor.Inserter` instead.
 */
export const Inserter = deprecateComponent( 'Inserter', RootInserter );
/**
 * @deprecated since 5.3, use `fin.blockEditor.InnerBlocks` instead.
 */
export const InnerBlocks = deprecateComponent( 'InnerBlocks', RootInnerBlocks, [
	'ButtonBlockAppender',
	'DefaultBlockAppender',
	'Content',
] );
/**
 * @deprecated since 5.3, use `fin.blockEditor.InspectorAdvancedControls` instead.
 */
export const InspectorAdvancedControls = deprecateComponent(
	'InspectorAdvancedControls',
	RootInspectorAdvancedControls,
	[ 'Slot' ]
);
/**
 * @deprecated since 5.3, use `fin.blockEditor.InspectorControls` instead.
 */
export const InspectorControls = deprecateComponent(
	'InspectorControls',
	RootInspectorControls,
	[ 'Slot' ]
);
/**
 * @deprecated since 5.3, use `fin.blockEditor.PanelColorSettings` instead.
 */
export const PanelColorSettings = deprecateComponent(
	'PanelColorSettings',
	RootPanelColorSettings
);
/**
 * @deprecated since 5.3, use `fin.blockEditor.PlainText` instead.
 */
export const PlainText = deprecateComponent( 'PlainText', RootPlainText );
/**
 * @deprecated since 5.3, use `fin.blockEditor.RichTextShortcut` instead.
 */
export const RichTextShortcut = deprecateComponent(
	'RichTextShortcut',
	RootRichTextShortcut
);
/**
 * @deprecated since 5.3, use `fin.blockEditor.RichTextToolbarButton` instead.
 */
export const RichTextToolbarButton = deprecateComponent(
	'RichTextToolbarButton',
	RootRichTextToolbarButton
);
/**
 * @deprecated since 5.3, use `fin.blockEditor.__unstableRichTextInputEvent` instead.
 */
export const __unstableRichTextInputEvent = deprecateComponent(
	'__unstableRichTextInputEvent',
	__unstableRootRichTextInputEvent
);
/**
 * @deprecated since 5.3, use `fin.blockEditor.MediaPlaceholder` instead.
 */
export const MediaPlaceholder = deprecateComponent(
	'MediaPlaceholder',
	RootMediaPlaceholder
);
/**
 * @deprecated since 5.3, use `fin.blockEditor.MediaUpload` instead.
 */
export const MediaUpload = deprecateComponent( 'MediaUpload', RootMediaUpload );
/**
 * @deprecated since 5.3, use `fin.blockEditor.MediaUploadCheck` instead.
 */
export const MediaUploadCheck = deprecateComponent(
	'MediaUploadCheck',
	RootMediaUploadCheck
);
/**
 * @deprecated since 5.3, use `fin.blockEditor.MultiSelectScrollIntoView` instead.
 */
export const MultiSelectScrollIntoView = deprecateComponent(
	'MultiSelectScrollIntoView',
	RootMultiSelectScrollIntoView
);
/**
 * @deprecated since 5.3, use `fin.blockEditor.NavigableToolbar` instead.
 */
export const NavigableToolbar = deprecateComponent(
	'NavigableToolbar',
	RootNavigableToolbar
);
/**
 * @deprecated since 5.3, use `fin.blockEditor.ObserveTyping` instead.
 */
export const ObserveTyping = deprecateComponent(
	'ObserveTyping',
	RootObserveTyping
);
/**
 * @deprecated since 5.3, use `fin.blockEditor.SkipToSelectedBlock` instead.
 */
export const SkipToSelectedBlock = deprecateComponent(
	'SkipToSelectedBlock',
	RootSkipToSelectedBlock
);
/**
 * @deprecated since 5.3, use `fin.blockEditor.URLInput` instead.
 */
export const URLInput = deprecateComponent( 'URLInput', RootURLInput );
/**
 * @deprecated since 5.3, use `fin.blockEditor.URLInputButton` instead.
 */
export const URLInputButton = deprecateComponent(
	'URLInputButton',
	RootURLInputButton
);
/**
 * @deprecated since 5.3, use `fin.blockEditor.URLPopover` instead.
 */
export const URLPopover = deprecateComponent( 'URLPopover', RootURLPopover );
/**
 * @deprecated since 5.3, use `fin.blockEditor.Warning` instead.
 */
export const Warning = deprecateComponent( 'Warning', RootWarning );
/**
 * @deprecated since 5.3, use `fin.blockEditor.WritingFlow` instead.
 */
export const WritingFlow = deprecateComponent( 'WritingFlow', RootWritingFlow );

/**
 * @deprecated since 5.3, use `fin.blockEditor.createCustomColorsHOC` instead.
 */
export const createCustomColorsHOC = deprecateFunction(
	'createCustomColorsHOC',
	rootCreateCustomColorsHOC
);
/**
 * @deprecated since 5.3, use `fin.blockEditor.getColorClassName` instead.
 */
export const getColorClassName = deprecateFunction(
	'getColorClassName',
	rootGetColorClassName
);
/**
 * @deprecated since 5.3, use `fin.blockEditor.getColorObjectByAttributeValues` instead.
 */
export const getColorObjectByAttributeValues = deprecateFunction(
	'getColorObjectByAttributeValues',
	rootGetColorObjectByAttributeValues
);
/**
 * @deprecated since 5.3, use `fin.blockEditor.getColorObjectByColorValue` instead.
 */
export const getColorObjectByColorValue = deprecateFunction(
	'getColorObjectByColorValue',
	rootGetColorObjectByColorValue
);
/**
 * @deprecated since 5.3, use `fin.blockEditor.getFontSize` instead.
 */
export const getFontSize = deprecateFunction( 'getFontSize', rootGetFontSize );
/**
 * @deprecated since 5.3, use `fin.blockEditor.getFontSizeClass` instead.
 */
export const getFontSizeClass = deprecateFunction(
	'getFontSizeClass',
	rootGetFontSizeClass
);
/**
 * @deprecated since 5.3, use `fin.blockEditor.createCustomColorsHOC` instead.
 */
export const withColorContext = deprecateFunction(
	'withColorContext',
	rootWithColorContext
);
/**
 * @deprecated since 5.3, use `fin.blockEditor.withColors` instead.
 */
export const withColors = deprecateFunction( 'withColors', rootWithColors );
/**
 * @deprecated since 5.3, use `fin.blockEditor.withFontSizes` instead.
 */
export const withFontSizes = deprecateFunction(
	'withFontSizes',
	rootWithFontSizes
);
