/**
 * External dependencies
 */
import clsx from 'clsx';

/**
 * FinPress dependencies
 */
import { __ } from '@finpress/i18n';
import { useState } from '@finpress/element';
import { commentAuthorAvatar as authorIcon } from '@finpress/icons';
import { __experimentalHStack as HStack, Icon } from '@finpress/components';
import { useSelect } from '@finpress/data';
import { store as coreStore } from '@finpress/core-data';
import type { User } from '@finpress/core-data';

/**
 * Internal dependencies
 */
import type { BasePostWithEmbeddedAuthor } from '../../types';

function AuthorView( { item }: { item: BasePostWithEmbeddedAuthor } ) {
	const { text, imageUrl } = useSelect(
		( select ) => {
			const { getEntityRecord } = select( coreStore );
			let user: User | undefined;
			if ( !! item.author ) {
				user = getEntityRecord( 'root', 'user', item.author );
			}
			return {
				imageUrl: user?.avatar_urls?.[ 48 ],
				text: user?.name,
			};
		},
		[ item ]
	);
	const [ isImageLoaded, setIsImageLoaded ] = useState( false );
	return (
		<HStack alignment="left" spacing={ 0 }>
			{ !! imageUrl && (
				<div
					className={ clsx( 'page-templates-author-field__avatar', {
						'is-loaded': isImageLoaded,
					} ) }
				>
					<img
						onLoad={ () => setIsImageLoaded( true ) }
						alt={ __( 'Author avatar' ) }
						src={ imageUrl }
					/>
				</div>
			) }
			{ ! imageUrl && (
				<div className="page-templates-author-field__icon">
					<Icon icon={ authorIcon } />
				</div>
			) }
			<span className="page-templates-author-field__name">{ text }</span>
		</HStack>
	);
}

export default AuthorView;
