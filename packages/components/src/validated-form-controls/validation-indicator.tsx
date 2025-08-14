/**
 * External dependencies
 */
import clsx from 'clsx';

/**
 * WordPress dependencies
 */
import { error, published } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import Icon from '../icon';
import Spinner from '../spinner';

export function ValidationIndicator( {
	type,
	message,
}: {
	type: 'validating' | 'valid' | 'invalid';
	message?: string;
} ) {
	const ICON = {
		valid: published,
		invalid: error,
	};
	return (
		<p
			className={ clsx(
				'components-validated-control__status',
				`is-${ type }`
			) }
		>
			{ type === 'validating' ? (
				<Spinner className="components-validated-control__status-spinner" />
			) : (
				<Icon
					className="components-validated-control__status-icon"
					icon={ ICON[ type ] }
					size={ 16 }
					fill="currentColor"
				/>
			) }
			{ message }
		</p>
	);
}
