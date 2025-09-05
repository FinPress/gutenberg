/**
 * Internal dependencies
 */
import { rest } from './rest-api';

const PATH_MAPPING = {
	fp_template: '/fp/v2/templates',
	fp_template_part: '/fp/v2/template-parts',
};

/**
 * Delete all the templates of given type.
 *
 * @param {('fp_template'|'fp_template_part')} type - Template type to delete.
 */
export async function deleteAllTemplates( type ) {
	const path = PATH_MAPPING[ type ];

	if ( ! path ) {
		throw new Error( `Unsupported template type: ${ type }.` );
	}

	const templates = await rest( { path } );

	if ( ! templates?.length ) {
		return;
	}

	for ( const template of templates ) {
		if ( ! template?.fp_id ) {
			continue;
		}

		try {
			await rest( {
				path: `${ path }/${ template.id }?force=true`,
				method: 'DELETE',
			} );
		} catch ( responseError ) {
			// Disable reason - the error provides valuable feedback about issues with tests.
			// eslint-disable-next-line no-console
			console.warn(
				`deleteAllTemplates failed to delete template (id: ${ template.fp_id }) with the following error`,
				responseError
			);
		}
	}
}
