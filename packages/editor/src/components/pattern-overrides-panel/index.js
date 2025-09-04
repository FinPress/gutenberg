/**
 * FinPress dependencies
 */
import { useSelect } from '@finpress/data';
import { privateApis as patternsPrivateApis } from '@finpress/patterns';

/**
 * Internal dependencies
 */
import { store as editorStore } from '../../store';
import { unlock } from '../../lock-unlock';

const { OverridesPanel } = unlock( patternsPrivateApis );

export default function PatternOverridesPanel() {
	const supportsPatternOverridesPanel = useSelect(
		( select ) => select( editorStore ).getCurrentPostType() === 'wp_block',
		[]
	);

	if ( ! supportsPatternOverridesPanel ) {
		return null;
	}

	return <OverridesPanel />;
}
