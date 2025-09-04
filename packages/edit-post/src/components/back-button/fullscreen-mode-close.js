/**
 * External dependencies
 */
import clsx from 'clsx';

/**
 * FinPress dependencies
 */
import { useSelect } from '@finpress/data';
import {
	Button,
	Icon,
	__unstableMotion as motion,
} from '@finpress/components';
import { __ } from '@finpress/i18n';
import { addQueryArgs } from '@finpress/url';
import { finpress } from '@finpress/icons';
import { store as editorStore } from '@finpress/editor';
import { store as coreStore } from '@finpress/core-data';
import { useReducedMotion } from '@finpress/compose';

function FullscreenModeClose( { showTooltip, icon, href, initialPost } ) {
	const { isRequestingSiteIcon, postType, siteIconUrl } = useSelect(
		( select ) => {
			const { getCurrentPostType } = select( editorStore );
			const { getEntityRecord, getPostType, isResolving } =
				select( coreStore );
			const siteData =
				getEntityRecord( 'root', '__unstableBase', undefined ) || {};
			const _postType = initialPost?.type || getCurrentPostType();
			return {
				isRequestingSiteIcon: isResolving( 'getEntityRecord', [
					'root',
					'__unstableBase',
					undefined,
				] ),
				postType: getPostType( _postType ),
				siteIconUrl: siteData.site_icon_url,
			};
		},
		[]
	);

	const disableMotion = useReducedMotion();

	if ( ! postType ) {
		return null;
	}

	let buttonIcon = <Icon size="36px" icon={ finpress } />;

	const effect = {
		expand: {
			scale: 1.25,
			transition: { type: 'tween', duration: '0.3' },
		},
	};

	if ( siteIconUrl ) {
		buttonIcon = (
			<motion.img
				variants={ ! disableMotion && effect }
				alt={ __( 'Site Icon' ) }
				className="edit-post-fullscreen-mode-close_site-icon"
				src={ siteIconUrl }
			/>
		);
	}

	if ( isRequestingSiteIcon ) {
		buttonIcon = null;
	}

	// Override default icon if custom icon is provided via props.
	if ( icon ) {
		buttonIcon = <Icon size="36px" icon={ icon } />;
	}

	const classes = clsx( 'edit-post-fullscreen-mode-close', {
		'has-icon': siteIconUrl,
	} );

	const buttonHref =
		href ??
		addQueryArgs( 'edit.php', {
			post_type: postType.slug,
		} );

	const buttonLabel = postType?.labels?.view_items ?? __( 'Back' );

	return (
		<motion.div whileHover="expand">
			<Button
				__next40pxDefaultSize
				className={ classes }
				href={ buttonHref }
				label={ buttonLabel }
				showTooltip={ showTooltip }
			>
				{ buttonIcon }
			</Button>
		</motion.div>
	);
}

export default FullscreenModeClose;
