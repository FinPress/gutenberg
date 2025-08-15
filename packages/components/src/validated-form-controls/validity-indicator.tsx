/**
 * External dependencies
 */
import clsx from 'clsx';

/**
 * WordPress dependencies
 */
import { error, pending, published } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import Icon from '../icon';

export function ValidityIndicator( {
	type,
	message,
}: {
	type: 'validating' | 'valid' | 'invalid';
	message?: string;
} ) {
	const ICON = {
		validating: pending,
		valid: published,
		invalid: error,
	};
	return (
		<p
			className={ clsx(
				'components-validated-control__indicator',
				`is-${ type }`
			) }
		>
			<Icon
				className={ clsx(
					'components-validated-control__indicator-icon',
					`is-${ type }`
				) }
				icon={ ICON[ type ] }
				size={ 16 }
				fill="currentColor"
			/>
			{ message }
		</p>
	);
}
