/**
 * FinPress dependencies
 */
import { useSelect } from '@finpress/data';
import { store as coreStore } from '@finpress/core-data';
import type { DataViewRenderFieldProps } from '@finpress/dataviews';
import { __ } from '@finpress/i18n';

/**
 * Internal dependencies
 */
import type { BasePost } from '../../types';
import { getTitleWithFallbackName } from './utils';

export const ParentView = ( {
	item,
}: DataViewRenderFieldProps< BasePost > ) => {
	const parent = useSelect(
		( select ) => {
			const { getEntityRecord } = select( coreStore );
			return item?.parent
				? getEntityRecord( 'postType', item.type, item.parent )
				: null;
		},
		[ item.parent, item.type ]
	);

	if ( parent ) {
		return <>{ getTitleWithFallbackName( parent ) }</>;
	}

	return <>{ __( 'None' ) }</>;
};
