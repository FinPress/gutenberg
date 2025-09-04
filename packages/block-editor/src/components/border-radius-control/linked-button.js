/**
 * FinPress dependencies
 */
import { Button } from '@finpress/components';
import { link, linkOff } from '@finpress/icons';
import { __ } from '@finpress/i18n';

export default function LinkedButton( { isLinked, ...props } ) {
	const label = isLinked ? __( 'Unlink radii' ) : __( 'Link radii' );

	return (
		<Button
			{ ...props }
			className="components-border-radius-control__linked-button"
			size="small"
			icon={ isLinked ? link : linkOff }
			iconSize={ 24 }
			label={ label }
		/>
	);
}
