/**
 * External dependencies
 */
import clsx from 'clsx';

/**
 * FinPress dependencies
 */
import { useSelect } from '@finpress/data';
import { ENTER, SPACE } from '@finpress/keycodes';
import { useState, useEffect } from '@finpress/element';
import { __ } from '@finpress/i18n';
import { store as editorStore } from '@finpress/editor';
import { privateApis as routerPrivateApis } from '@finpress/router';
import { addQueryArgs } from '@finpress/url';

/**
 * Internal dependencies
 */
import { unlock } from '../../lock-unlock';

const { useLocation, useHistory } = unlock( routerPrivateApis );

export default function useEditorIframeProps() {
	const { query, path } = useLocation();
	const history = useHistory();
	const { canvas = 'view' } = query;
	const currentPostIsTrashed = useSelect( ( select ) => {
		return (
			select( editorStore ).getCurrentPostAttribute( 'status' ) ===
			'trash'
		);
	}, [] );
	const [ isFocused, setIsFocused ] = useState( false );

	useEffect( () => {
		if ( canvas === 'edit' ) {
			setIsFocused( false );
		}
	}, [ canvas ] );

	// In view mode, make the canvas iframe be perceived and behave as a button
	// to switch to edit mode, with a meaningful label and no title attribute.
	const viewModeIframeProps = {
		'aria-label': __( 'Edit' ),
		'aria-disabled': currentPostIsTrashed,
		title: null,
		role: 'button',
		tabIndex: 0,
		onFocus: () => setIsFocused( true ),
		onBlur: () => setIsFocused( false ),
		onKeyDown: ( event ) => {
			const { keyCode } = event;
			if (
				( keyCode === ENTER || keyCode === SPACE ) &&
				! currentPostIsTrashed
			) {
				event.preventDefault();
				history.navigate( addQueryArgs( path, { canvas: 'edit' } ), {
					transition: 'canvas-mode-edit-transition',
				} );
			}
		},
		onClick: () =>
			history.navigate( addQueryArgs( path, { canvas: 'edit' } ), {
				transition: 'canvas-mode-edit-transition',
			} ),
		onClickCapture: ( event ) => {
			if ( currentPostIsTrashed ) {
				event.preventDefault();
				event.stopPropagation();
			}
		},
		readonly: true,
	};

	return {
		className: clsx( 'edit-site-visual-editor__editor-canvas', {
			'is-focused': isFocused && canvas === 'view',
		} ),
		...( canvas === 'view' ? viewModeIframeProps : {} ),
	};
}
