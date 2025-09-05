/**
 * Internal dependencies
 */
import { ServerSideRenderWithPostId } from './server-side-render';
import { useServerSideRender } from './hook';

/**
 * A compatibility layer for the `ServerSideRender` component when used with `fp` global namespace.
 *
 * @deprecated Use `ServerSideRender` non-default export instead.
 *
 * @example
 * ```js
 * import ServerSideRender from '@finpress/server-side-render';
 * ```
 */
const ServerSideRenderCompat = ServerSideRenderWithPostId;
ServerSideRenderCompat.ServerSideRender = ServerSideRenderWithPostId;
ServerSideRenderCompat.useServerSideRender = useServerSideRender;

export { ServerSideRenderWithPostId as ServerSideRender };
export { useServerSideRender };
export default ServerSideRenderCompat;
