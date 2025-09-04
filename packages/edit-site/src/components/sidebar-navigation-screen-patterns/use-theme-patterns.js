/**
 * FinPress dependencies
 */
import { store as coreStore } from '@finpress/core-data';
import { useSelect } from '@finpress/data';
import { useMemo } from '@finpress/element';

/**
 * Internal dependencies
 */
import { filterOutDuplicatesByName } from '../page-patterns/utils';
import { EXCLUDED_PATTERN_SOURCES } from '../../utils/constants';
import { unlock } from '../../lock-unlock';
import { store as editSiteStore } from '../../store';

export default function useThemePatterns() {
	const blockPatterns = useSelect( ( select ) => {
		const { getSettings } = unlock( select( editSiteStore ) );

		return (
			getSettings().__experimentalAdditionalBlockPatterns ??
			getSettings().__experimentalBlockPatterns
		);
	} );

	const restBlockPatterns = useSelect( ( select ) =>
		select( coreStore ).getBlockPatterns()
	);

	const patterns = useMemo(
		() =>
			[ ...( blockPatterns || [] ), ...( restBlockPatterns || [] ) ]
				.filter(
					( pattern ) =>
						! EXCLUDED_PATTERN_SOURCES.includes( pattern.source )
				)
				.filter( filterOutDuplicatesByName )
				.filter( ( pattern ) => pattern.inserter !== false ),
		[ blockPatterns, restBlockPatterns ]
	);

	return patterns;
}
