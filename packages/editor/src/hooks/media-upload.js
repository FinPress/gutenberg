/**
 * WordPress dependencies
 */
import { Component } from '@wordpress/element';
import { addFilter } from '@wordpress/hooks';
import { MediaUpload } from '@wordpress/media-utils';
import { store as coreStore } from '@wordpress/core-data';
import { dispatch } from '@wordpress/data';

class MediaUploadWithCacheInvalidation extends Component {
	render() {
		const { onClose: originalOnClose, ...rest } = this.props;

		const onClose = ( ...onCloseArgs ) => {
			dispatch( coreStore ).invalidateResolutionForStoreSelector(
				'getMediaItems'
			);
			originalOnClose?.( ...onCloseArgs );
		};
		return <MediaUpload onClose={ onClose } { ...rest } />;
	}
}

addFilter(
	'editor.MediaUpload',
	'core/editor/components/media-upload',
	() => MediaUploadWithCacheInvalidation
);
