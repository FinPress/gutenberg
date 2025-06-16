/**
 * Internal dependencies
 */
import type { RequestUtils } from './index';
import type { RestOptions } from './rest';

type TemplateType = 'wp_template' | 'wp_template_part';

interface Template {
	wp_id: number;
	id: string;
}

interface CreateTemplatePayload {
	slug: string;
	title?: string;
	content?: string;
	description?: string;
}

const PATH_MAPPING = {
	wp_template: '/wp/v2/templates',
	wp_template_part: '/wp/v2/template-parts',
};

/**
 * Delete all the templates of given type.
 *
 * @param this
 * @param type        - Template type to delete.
 * @param restOptions Optional REST options to override default settings.
 */
async function deleteAllTemplates(
	this: RequestUtils,
	type: TemplateType,
	restOptions?: Partial< RestOptions >
) {
	const path = PATH_MAPPING[ type ];

	if ( ! path ) {
		throw new Error( `Unsupported template type: ${ type }.` );
	}

	const templates = await this.rest< Template[] >( { ...restOptions, path } );

	for ( const template of templates ) {
		if ( ! template?.id || ! template?.wp_id ) {
			continue;
		}

		try {
			await this.rest( {
				...restOptions,
				method: 'DELETE',
				path: `${ path }/${ template.id }`,
				params: { force: true },
			} );
		} catch ( responseError ) {
			// Disable reason - the error provides valuable feedback about issues with tests.
			// eslint-disable-next-line no-console
			console.warn(
				`deleteAllTemplates failed to delete template (id: ${ template.wp_id }) with the following error`,
				responseError
			);
		}
	}
}

/**
 * Creates a new template using the REST API.
 *
 * @param this
 * @param type        Template type to delete.
 * @param payload     Template attributes.
 * @param restOptions Optional REST options to override default settings.
 */
async function createTemplate(
	this: RequestUtils,
	type: TemplateType,
	payload: CreateTemplatePayload,
	restOptions?: Partial< RestOptions >
) {
	const template = await this.rest< Template >( {
		...restOptions,
		method: 'POST',
		path: PATH_MAPPING[ type ],
		params: { ...payload, type, status: 'publish', is_wp_suggestion: true },
	} );

	return template;
}

export { deleteAllTemplates, createTemplate };
