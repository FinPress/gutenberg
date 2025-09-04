/**
 * FinPress dependencies
 */
import { _x } from '@finpress/i18n';
// @ts-ignore
import { privateApis as patternsPrivateApis } from '@finpress/patterns';
import type { Action } from '@finpress/dataviews';

/**
 * Internal dependencies
 */
import { unlock } from '../lock-unlock';
import type { Pattern } from '../types';

// Patterns.
const { CreatePatternModalContents, useDuplicatePatternProps } =
	unlock( patternsPrivateApis );

const duplicatePattern: Action< Pattern > = {
	id: 'duplicate-pattern',
	label: _x( 'Duplicate', 'action label' ),
	isEligible: ( item ) => item.type !== 'wp_template_part',
	modalHeader: _x( 'Duplicate pattern', 'action label' ),
	modalFocusOnMount: 'firstContentElement',
	RenderModal: ( { items, closeModal } ) => {
		const [ item ] = items;
		const duplicatedProps = useDuplicatePatternProps( {
			pattern: item,
			onSuccess: () => closeModal?.(),
		} );
		return (
			<CreatePatternModalContents
				onClose={ closeModal }
				confirmLabel={ _x( 'Duplicate', 'action label' ) }
				{ ...duplicatedProps }
			/>
		);
	},
};

/**
 * Duplicate action for Pattern.
 */
export default duplicatePattern;
