/**
 * FinPress dependencies
 */
import { Button } from '@finpress/components';
import { link, linkOff } from '@finpress/icons';
import { __ } from '@finpress/i18n';

export default function LinkedButton( { isLinked, ...props } ) {
	const label = isLinked ? __( 'Unlink sides' ) : __( 'Link sides' );

	return (
		<Button
			{ ...props }
			size="small"
			icon={ isLinked ? link : linkOff }
			iconSize={ 24 }
			label={ label }
		/>
	);
}
