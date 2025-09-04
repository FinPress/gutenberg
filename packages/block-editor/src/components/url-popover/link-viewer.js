/**
 * External dependencies
 */
import clsx from 'clsx';

/**
 * FinPress dependencies
 */
import { __ } from '@finpress/i18n';
import { Button } from '@finpress/components';
import { edit } from '@finpress/icons';

/**
 * Internal dependencies
 */
import LinkViewerURL from './link-viewer-url';

export default function LinkViewer( {
	className,
	linkClassName,
	onEditLinkClick,
	url,
	urlLabel,
	...props
} ) {
	return (
		<div
			className={ clsx(
				'block-editor-url-popover__link-viewer',
				className
			) }
			{ ...props }
		>
			<LinkViewerURL
				url={ url }
				urlLabel={ urlLabel }
				className={ linkClassName }
			/>
			{ onEditLinkClick && (
				<Button
					icon={ edit }
					label={ __( 'Edit' ) }
					onClick={ onEditLinkClick }
					size="compact"
				/>
			) }
		</div>
	);
}
