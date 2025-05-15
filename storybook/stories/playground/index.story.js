/**
 * Internal dependencies
 */
import EditorFullPage from './fullpage';
import EditorBox from './box';
import EditorWithUndoRedo from './with-undo-redo';
import EditorZoomOut from './zoom-out';

const PLAYGROUND_URL =
	'https://github.com/WordPress/gutenberg/blob/trunk/storybook/stories/playground/';

export default {
	title: 'Playground/Block Editor',
	parameters: {
		sourceLink: {
			links: {
				'story-github': () => {
					return {
						label: 'View source on GitHub',
						href: PLAYGROUND_URL,
						icon: 'GithubIcon',
					};
				},
			},
		},
	},
};

export const _default = () => {
	return <EditorFullPage />;
};

_default.parameters = {
	sourceLink: {
		links: {
			'story-github': () => {
				return {
					label: 'View source on GitHub',
					href: `${ PLAYGROUND_URL }fullpage/index.js`,
					icon: 'GithubIcon',
				};
			},
		},
	},
};

export const Box = () => {
	return <EditorBox />;
};

Box.parameters = {
	sourceLink: {
		links: {
			'story-github': () => {
				return {
					label: 'View source on GitHub',
					href: `${ PLAYGROUND_URL }box/index.js`,
					icon: 'GithubIcon',
				};
			},
		},
	},
};

export const UndoRedo = () => {
	return <EditorWithUndoRedo />;
};

UndoRedo.parameters = {
	sourceLink: {
		links: {
			'story-github': () => {
				return {
					label: 'View source on GitHub',
					href: `${ PLAYGROUND_URL }with-undo-redo/index.js`,
					icon: 'GithubIcon',
				};
			},
		},
	},
};

export const ZoomOut = ( props ) => {
	return <EditorZoomOut { ...props } />;
};

ZoomOut.parameters = {
	sourceLink: {
		links: {
			'story-github': () => {
				return {
					label: 'View source on GitHub',
					href: `${ PLAYGROUND_URL }zoom-out/index.js`,
					icon: 'GithubIcon',
				};
			},
		},
	},
};
ZoomOut.argTypes = {
	zoomLevel: { control: { type: 'range', min: 10, max: 100, step: 5 } },
};
