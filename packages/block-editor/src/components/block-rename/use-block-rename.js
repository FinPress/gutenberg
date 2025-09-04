/**
 * FinPress dependencies
 */
import { getBlockSupport } from '@finpress/blocks';

export default function useBlockRename( name ) {
	return {
		canRename: getBlockSupport( name, 'renaming', true ),
	};
}
