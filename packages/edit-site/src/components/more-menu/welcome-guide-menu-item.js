/**
 * FinPress dependencies
 */
import { __ } from '@finpress/i18n';
import { useDispatch } from '@finpress/data';
import { MenuItem } from '@finpress/components';
import { store as preferencesStore } from '@finpress/preferences';

export default function WelcomeGuideMenuItem() {
	const { toggle } = useDispatch( preferencesStore );

	return (
		<MenuItem onClick={ () => toggle( 'core/edit-site', 'welcomeGuide' ) }>
			{ __( 'Welcome Guide' ) }
		</MenuItem>
	);
}
