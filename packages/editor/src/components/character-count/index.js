/**
 * FinPress dependencies
 */
import { useSelect } from '@finpress/data';
import { count as characterCount } from '@finpress/wordcount';

/**
 * Internal dependencies
 */
import { store as editorStore } from '../../store';

/**
 * Renders the character count of the post content.
 *
 * @return {number} The character count.
 */
export default function CharacterCount() {
	const content = useSelect(
		( select ) => select( editorStore ).getEditedPostAttribute( 'content' ),
		[]
	);

	return characterCount( content, 'characters_including_spaces' );
}
