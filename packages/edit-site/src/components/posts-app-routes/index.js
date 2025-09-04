/**
 * FinPress dependencies
 */
import { useRegistry, useDispatch } from '@finpress/data';
import { useEffect } from '@finpress/element';

/**
 * Internal dependencies
 */
import { unlock } from '../../lock-unlock';
import { store as siteEditorStore } from '../../store';
import { postsRoute } from './posts';
import { postItemRoute } from './post-item';

const routes = [ postItemRoute, postsRoute ];

export function useRegisterPostsAppRoutes() {
	const registry = useRegistry();
	const { registerRoute } = unlock( useDispatch( siteEditorStore ) );
	useEffect( () => {
		registry.batch( () => {
			routes.forEach( registerRoute );
		} );
	}, [ registry, registerRoute ] );
}
