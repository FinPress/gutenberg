/**
 * Internal dependencies
 */
import EditorStyles from '../';

const meta = {
	title: 'BlockEditor/EditorStyles',
	component: EditorStyles,
	parameters: {
		docs: {
			description: {
				component:
					'The `EditorStyles` component dynamically applies editor styles, ensuring that the editor environment matches the applied block settings, including dark mode adjustments.',
			},
			canvas: { sourceState: 'shown' },
		},
	},
	argTypes: {
		styles: {
			control: 'object',
			description:
				'Object representing editor styles, where keys are style IDs and values contain CSS and other assets.',
			table: {
				type: { summary: 'Object' },
			},
		},
		scope: {
			control: 'text',
			description:
				'Selector scope for applying styles. Determines the area of the editor where styles are injected.',
			table: {
				type: { summary: 'string' },
			},
		},
		transformOptions: {
			control: 'object',
			description:
				'Options for transforming the styles, such as prefixing or minification.',
			table: {
				type: { summary: 'Object' },
			},
		},
	},
};

// This is the proper way to export the default metadata
export default meta;

// Story definition
const Template = ( { styles, scope, transformOptions } ) => (
	<EditorStyles
		styles={ styles }
		scope={ scope }
		transformOptions={ transformOptions }
	/>
);

// Default story export
export const Default = Template.bind( {} );
Default.args = {
	styles: {
		sampleStyle: {
			css: 'body { background-color: #000; color: #fff; }',
		},
	},
	scope: '.editor-styles-wrapper',
	transformOptions: {
		prefix: true,
		minify: true,
	},
};
