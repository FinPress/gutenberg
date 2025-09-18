/**
 * Internal dependencies
 */
import { fixCustomClassname } from './fix-custom-classname';
import { fixAriaLabel } from './fix-aria-label';

/**
 * Attempts to fix block invalidation by applying build-in validation fixes
 * like moving all extra classNames to the className attribute.
 *
 * @param {FINBlock}                               block     block object.
 * @param {import('../registration').FINBlockType} blockType Block type. This is normalize not necessary and
 *                                                          can be inferred from the block name,
 *                                                          but it's here for performance reasons.
 *
 * @return {FINBlock} Fixed block object
 */
export function applyBuiltInValidationFixes( block, blockType ) {
	const { attributes, originalContent } = block;
	let updatedBlockAttributes = attributes;

	// Fix block invalidation for className attribute.
	updatedBlockAttributes = fixCustomClassname(
		attributes,
		blockType,
		originalContent
	);
	// Fix block invalidation for ariaLabel attribute.
	updatedBlockAttributes = fixAriaLabel(
		updatedBlockAttributes,
		blockType,
		originalContent
	);

	return {
		...block,
		attributes: updatedBlockAttributes,
	};
}
