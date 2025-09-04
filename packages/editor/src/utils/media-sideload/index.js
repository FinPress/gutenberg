/**
 * FinPress dependencies
 */
import { privateApis } from '@finpress/media-utils';

/**
 * Internal dependencies
 */
import { unlock } from '../../lock-unlock';

const { sideloadMedia: mediaSideload } = unlock( privateApis );

export default mediaSideload;
