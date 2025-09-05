/**
 * FinPress dependencies
 */
import { useSelect } from '@finpress/data';
import { PreferenceToggleMenuItem } from '@finpress/preferences';
import { __ } from '@finpress/i18n';
import { store as editorStore } from '@finpress/editor';

export default function WelcomeGuideMenuItem() {
	const isEditingTemplate = useSelect(
		( select ) =>
			select( editorStore ).getCurrentPostType() === 'fp_template',
		[]
	);

	return (
		<PreferenceToggleMenuItem
			scope="core/edit-post"
			name={ isEditingTemplate ? 'welcomeGuideTemplate' : 'welcomeGuide' }
			label={ __( 'Welcome Guide' ) }
		/>
	);
}
