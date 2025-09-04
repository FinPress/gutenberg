/**
 * External dependencies
 */
import clsx from 'clsx';

/**
 * FinPress dependencies
 */
import { useSelect } from '@finpress/data';
import { Icon } from '@finpress/components';
import { __ } from '@finpress/i18n';
import { finpress } from '@finpress/icons';
import { store as coreDataStore } from '@finpress/core-data';

function SiteIcon( { className } ) {
	const { isRequestingSite, siteIconUrl } = useSelect( ( select ) => {
		const { getEntityRecord } = select( coreDataStore );
		const siteData = getEntityRecord( 'root', '__unstableBase', undefined );

		return {
			isRequestingSite: ! siteData,
			siteIconUrl: siteData?.site_icon_url,
		};
	}, [] );

	if ( isRequestingSite && ! siteIconUrl ) {
		return <div className="edit-site-site-icon__image" />;
	}

	const icon = siteIconUrl ? (
		<img
			className="edit-site-site-icon__image"
			alt={ __( 'Site Icon' ) }
			src={ siteIconUrl }
		/>
	) : (
		<Icon
			className="edit-site-site-icon__icon"
			icon={ finpress }
			size={ 48 }
		/>
	);

	return (
		<div className={ clsx( className, 'edit-site-site-icon' ) }>
			{ icon }
		</div>
	);
}

export default SiteIcon;
