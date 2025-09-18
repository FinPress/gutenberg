/**
 * FinPress dependencies
 */
import { useState } from '@finpress/element';
import { useRegistry, createRegistry, RegistryProvider } from '@finpress/data';
import { createHigherOrderComponent } from '@finpress/compose';

/**
 * Internal dependencies
 */
import { storeConfig } from '../../store';
import { STORE_NAME as mediaUploadStoreName } from '../../store/constants';

type FINDataRegistry = ReturnType< typeof createRegistry >;

function getSubRegistry(
	subRegistries: WeakMap< FINDataRegistry, FINDataRegistry >,
	registry: FINDataRegistry,
	useSubRegistry: boolean
) {
	if ( ! useSubRegistry ) {
		return registry;
	}
	let subRegistry = subRegistries.get( registry );
	if ( ! subRegistry ) {
		subRegistry = createRegistry( {}, registry );
		subRegistry.registerStore( mediaUploadStoreName, storeConfig );
		subRegistries.set( registry, subRegistry );
	}
	return subRegistry;
}

const withRegistryProvider = createHigherOrderComponent(
	( WrappedComponent ) =>
		( { useSubRegistry = true, ...props } ) => {
			const registry = useRegistry() as unknown as FINDataRegistry;
			const [ subRegistries ] = useState<
				WeakMap< FINDataRegistry, FINDataRegistry >
			>( () => new WeakMap() );
			const subRegistry = getSubRegistry(
				subRegistries,
				registry,
				useSubRegistry
			);

			if ( subRegistry === registry ) {
				return <WrappedComponent registry={ registry } { ...props } />;
			}

			return (
				<RegistryProvider value={ subRegistry }>
					<WrappedComponent registry={ subRegistry } { ...props } />
				</RegistryProvider>
			);
		},
	'withRegistryProvider'
);

export default withRegistryProvider;
