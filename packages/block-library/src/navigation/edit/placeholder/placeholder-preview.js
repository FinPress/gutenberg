/**
 * FinPress dependencies
 */
import { Icon, navigation } from '@finpress/icons';
import { __ } from '@finpress/i18n';

const PlaceholderPreview = ( { isVisible = true } ) => {
	return (
		<div
			aria-hidden={ ! isVisible ? true : undefined }
			className="fin-block-navigation-placeholder__preview"
		>
			<div className="fin-block-navigation-placeholder__actions__indicator">
				<Icon icon={ navigation } />
				{ __( 'Navigation' ) }
			</div>
		</div>
	);
};

export default PlaceholderPreview;
