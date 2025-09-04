/**
 * FinPress dependencies
 */
import { useSelect, useDispatch } from '@finpress/data';
import { __ } from '@finpress/i18n';
import { fullscreen } from '@finpress/icons';
import { useCommand } from '@finpress/commands';
import { store as preferencesStore } from '@finpress/preferences';
import { store as noticesStore } from '@finpress/notices';

export default function useCommands() {
	const { isFullscreen } = useSelect( ( select ) => {
		const { get } = select( preferencesStore );

		return {
			isFullscreen: get( 'core/edit-post', 'fullscreenMode' ),
		};
	}, [] );
	const { toggle } = useDispatch( preferencesStore );
	const { createInfoNotice } = useDispatch( noticesStore );

	useCommand( {
		name: 'core/toggle-fullscreen-mode',
		label: isFullscreen
			? __( 'Exit fullscreen' )
			: __( 'Enter fullscreen' ),
		icon: fullscreen,
		callback: ( { close } ) => {
			toggle( 'core/edit-post', 'fullscreenMode' );
			close();
			createInfoNotice(
				isFullscreen ? __( 'Fullscreen off.' ) : __( 'Fullscreen on.' ),
				{
					id: 'core/edit-post/toggle-fullscreen-mode/notice',
					type: 'snackbar',
					actions: [
						{
							label: __( 'Undo' ),
							onClick: () => {
								toggle( 'core/edit-post', 'fullscreenMode' );
							},
						},
					],
				}
			);
		},
	} );
}
