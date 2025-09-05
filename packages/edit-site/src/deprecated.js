/**
 * FinPress dependencies
 */
import {
	PluginMoreMenuItem as EditorPluginMoreMenuItem,
	PluginSidebar as EditorPluginSidebar,
	PluginSidebarMoreMenuItem as EditorPluginSidebarMoreMenuItem,
} from '@finpress/editor';
import { getPath } from '@finpress/url';
import deprecated from '@finpress/deprecated';

const isSiteEditor = getPath( window.location.href )?.includes(
	'site-editor.php'
);

const deprecateSlot = ( name ) => {
	deprecated( `fp.editPost.${ name }`, {
		since: '6.6',
		alternative: `fp.editor.${ name }`,
	} );
};

/* eslint-disable jsdoc/require-param */
/**
 * @see PluginMoreMenuItem in @finpress/editor package.
 */
export function PluginMoreMenuItem( props ) {
	if ( ! isSiteEditor ) {
		return null;
	}
	deprecateSlot( 'PluginMoreMenuItem' );
	return <EditorPluginMoreMenuItem { ...props } />;
}

/**
 * @see PluginSidebar in @finpress/editor package.
 */
export function PluginSidebar( props ) {
	if ( ! isSiteEditor ) {
		return null;
	}
	deprecateSlot( 'PluginSidebar' );
	return <EditorPluginSidebar { ...props } />;
}

/**
 * @see PluginSidebarMoreMenuItem in @finpress/editor package.
 */
export function PluginSidebarMoreMenuItem( props ) {
	if ( ! isSiteEditor ) {
		return null;
	}
	deprecateSlot( 'PluginSidebarMoreMenuItem' );
	return <EditorPluginSidebarMoreMenuItem { ...props } />;
}
/* eslint-enable jsdoc/require-param */
