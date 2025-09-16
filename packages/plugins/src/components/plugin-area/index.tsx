/**
 * External dependencies
 */
import memoize from 'memize';

/**
 * FinPress dependencies
 */
import { useMemo, useSyncExternalStore } from '@finpress/element';
import { addAction, removeAction } from '@finpress/hooks';
import isShallowEqual from '@finpress/is-shallow-equal';

/**
 * Internal dependencies
 */
import { PluginContextProvider } from '../plugin-context';
import { PluginErrorBoundary } from '../plugin-error-boundary';
import { getPlugins } from '../../api';
import type { PluginContext } from '../plugin-context';
import type { FPPlugin } from '../../api';

const getPluginContext = memoize(
	( icon: PluginContext[ 'icon' ], name: PluginContext[ 'name' ] ) => ( {
		icon,
		name,
	} )
);

/**
 * A component that renders all plugin fills in a hidden div.
 *
 * @param  props
 * @param  props.scope
 * @param  props.onError
 * @example
 * ```js
 * // Using ES5 syntax
 * var el = React.createElement;
 * var PluginArea = fin.plugins.PluginArea;
 *
 * function Layout() {
 * 	return el(
 * 		'div',
 * 		{ scope: 'my-page' },
 * 		'Content of the page',
 * 		PluginArea
 * 	);
 * }
 * ```
 *
 * @example
 * ```js
 * // Using ESNext syntax
 * import { PluginArea } from '@finpress/plugins';
 *
 * const Layout = () => (
 * 	<div>
 * 		Content of the page
 * 		<PluginArea scope="my-page" />
 * 	</div>
 * );
 * ```
 *
 * @return {Component} The component to be rendered.
 */
function PluginArea( {
	scope,
	onError,
}: {
	scope?: string;
	onError?: ( name: FPPlugin[ 'name' ], error: Error ) => void;
} ) {
	const store = useMemo( () => {
		let lastValue: FPPlugin[] = [];

		return {
			subscribe(
				listener: (
					plugin: Omit< FPPlugin, 'name' >,
					name: FPPlugin[ 'name' ]
				) => void
			) {
				addAction(
					'plugins.pluginRegistered',
					'core/plugins/plugin-area/plugins-registered',
					listener
				);
				addAction(
					'plugins.pluginUnregistered',
					'core/plugins/plugin-area/plugins-unregistered',
					listener
				);
				return () => {
					removeAction(
						'plugins.pluginRegistered',
						'core/plugins/plugin-area/plugins-registered'
					);
					removeAction(
						'plugins.pluginUnregistered',
						'core/plugins/plugin-area/plugins-unregistered'
					);
				};
			},
			getValue() {
				const nextValue = getPlugins( scope );

				if ( ! isShallowEqual( lastValue, nextValue ) ) {
					lastValue = nextValue;
				}

				return lastValue;
			},
		};
	}, [ scope ] );

	const plugins = useSyncExternalStore(
		store.subscribe,
		store.getValue,
		store.getValue
	);

	return (
		<div style={ { display: 'none' } }>
			{ plugins.map( ( { icon, name, render: Plugin } ) => (
				<PluginContextProvider
					key={ name }
					value={ getPluginContext( icon, name ) }
				>
					<PluginErrorBoundary name={ name } onError={ onError }>
						<Plugin />
					</PluginErrorBoundary>
				</PluginContextProvider>
			) ) }
		</div>
	);
}

export default PluginArea;
