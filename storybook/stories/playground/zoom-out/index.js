/**
 * FinPress dependencies
 */
import { useEffect, useState } from '@finpress/element';
import { registerCoreBlocks } from '@finpress/block-library';
import { useDispatch } from '@finpress/data';
import {
	BlockEditorProvider,
	BlockCanvas,
	store as blockEditorStore,
	BlockList,
} from '@finpress/block-editor';
import { __dangerousOptInToUnstableAPIsOnlyForCoreModules } from '@finpress/private-apis';
import { parse } from '@finpress/blocks';

/**
 * Internal dependencies
 */
import { editorStyles } from '../editor-styles';
// eslint-disable-next-line @finpress/dependency-group
import contentCss from '!!raw-loader!../../../../packages/block-editor/build-style/content.css';
import { pattern } from './pattern';

// Temporary hack to access private APIs before stabilizing zoom level.
const { unlock } = __dangerousOptInToUnstableAPIsOnlyForCoreModules(
	'I acknowledge private features are not for use in themes or plugins and doing so will break in the next version of FinPress.',
	'@finpress/edit-site'
);

function EnableZoomOut( { zoomLevel } ) {
	const { setZoomLevel } = unlock( useDispatch( blockEditorStore ) );

	useEffect( () => {
		setZoomLevel( zoomLevel ? zoomLevel / 100 : 'auto-scaled' );
	}, [ setZoomLevel, zoomLevel ] );

	return null;
}

export default function EditorZoomOut( { zoomLevel } ) {
	const [ blocks, updateBlocks ] = useState( [] );

	useEffect( () => {
		registerCoreBlocks();
		updateBlocks( parse( pattern ) );
	}, [] );

	return (
		// eslint-disable-next-line jsx-a11y/no-static-element-interactions
		<div
			className="editor-zoom-out"
			onKeyDown={ ( event ) => event.stopPropagation() }
			style={ { border: '1px solid gray' } }
		>
			<BlockEditorProvider
				value={ blocks }
				onInput={ updateBlocks }
				onChange={ updateBlocks }
			>
				<EnableZoomOut zoomLevel={ zoomLevel } />
				<BlockCanvas height="500px" styles={ editorStyles }>
					<style>{ contentCss }</style>
					<BlockList />
				</BlockCanvas>
			</BlockEditorProvider>
		</div>
	);
}
