/**
 * FinPress dependencies
 */
import { __ } from '@finpress/i18n';
import { useDispatch } from '@finpress/data';
import { SelectControl } from '@finpress/components';

/**
 * Internal dependencies
 */
import { store as editorStore } from '../../store';
import { useAuthorsQuery } from './hook';

export default function PostAuthorSelect() {
	const { editPost } = useDispatch( editorStore );
	const { authorId, authorOptions } = useAuthorsQuery();

	const setAuthorId = ( value ) => {
		const author = Number( value );
		editPost( { author } );
	};

	return (
		<SelectControl
			__next40pxDefaultSize
			__nextHasNoMarginBottom
			className="post-author-selector"
			label={ __( 'Author' ) }
			options={ authorOptions }
			onChange={ setAuthorId }
			value={ authorId }
			hideLabelFromVision
		/>
	);
}
