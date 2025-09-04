/**
 * FinPress dependencies
 */
import { Button, __experimentalGrid as Grid } from '@finpress/components';
import { useSelect } from '@finpress/data';
import { useCallback, useRef } from '@finpress/element';
// @ts-ignore
import { MediaUpload } from '@finpress/media-utils';
import { lineSolid } from '@finpress/icons';
import { store as coreStore } from '@finpress/core-data';
import type { DataFormControlProps } from '@finpress/dataviews';
import { __ } from '@finpress/i18n';

/**
 * Internal dependencies
 */
import type { BasePost } from '../../types';

export const FeaturedImageEdit = ( {
	data,
	field,
	onChange,
}: DataFormControlProps< BasePost > ) => {
	const { id } = field;

	const value = field.getValue( { item: data } );

	const media = useSelect(
		( select ) => {
			const { getEntityRecord } = select( coreStore );
			return getEntityRecord( 'postType', 'attachment', value );
		},
		[ value ]
	);

	const onChangeControl = useCallback(
		( newValue: number ) =>
			onChange( {
				[ id ]: newValue,
			} ),
		[ id, onChange ]
	);

	const url = media?.source_url;
	const title = media?.title?.rendered;
	const ref = useRef( null );

	return (
		<fieldset className="fields-controls__featured-image">
			<div className="fields-controls__featured-image-container">
				<MediaUpload
					onSelect={ ( selectedMedia: { id: number } ) => {
						onChangeControl( selectedMedia.id );
					} }
					allowedTypes={ [ 'image' ] }
					render={ ( { open }: { open: () => void } ) => {
						return (
							<div
								ref={ ref }
								role="button"
								tabIndex={ -1 }
								onClick={ () => {
									open();
								} }
								onKeyDown={ open }
							>
								<Grid
									rowGap={ 0 }
									columnGap={ 8 }
									templateColumns="24px 1fr 24px"
								>
									{ url && (
										<>
											<img
												className="fields-controls__featured-image-image"
												alt=""
												width={ 24 }
												height={ 24 }
												src={ url }
											/>
											<span className="fields-controls__featured-image-title">
												{ title }
											</span>
										</>
									) }
									{ ! url && (
										<>
											<span
												className="fields-controls__featured-image-placeholder"
												style={ {
													width: '24px',
													height: '24px',
												} }
											/>
											<span className="fields-controls__featured-image-title">
												{ __( 'Choose an image…' ) }
											</span>
										</>
									) }
									{ url && (
										<>
											<Button
												size="small"
												className="fields-controls__featured-image-remove-button"
												icon={ lineSolid }
												onClick={ (
													event: React.MouseEvent< HTMLButtonElement >
												) => {
													event.stopPropagation();
													onChangeControl( 0 );
												} }
											/>
										</>
									) }
								</Grid>
							</div>
						);
					} }
				/>
			</div>
		</fieldset>
	);
};
