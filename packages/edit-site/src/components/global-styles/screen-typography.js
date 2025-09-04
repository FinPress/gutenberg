/**
 * FinPress dependencies
 */
import { __ } from '@finpress/i18n';
import { __experimentalVStack as VStack } from '@finpress/components';
import { useSelect } from '@finpress/data';
import { store as editorStore } from '@finpress/editor';

/**
 * Internal dependencies
 */
import TypographyElements from './typography-elements';
import ScreenHeader from './header';
import TypographyVariations from './variations/variations-typography';
import FontSizesCount from './font-sizes/font-sizes-count';
import FontFamilies from './font-families';

function ScreenTypography() {
	const fontLibraryEnabled = useSelect(
		( select ) =>
			select( editorStore ).getEditorSettings().fontLibraryEnabled,
		[]
	);

	return (
		<>
			<ScreenHeader
				title={ __( 'Typography' ) }
				description={ __(
					'Available fonts, typographic styles, and the application of those styles.'
				) }
			/>
			<div className="edit-site-global-styles-screen">
				<VStack spacing={ 7 }>
					<TypographyVariations title={ __( 'Typesets' ) } />
					{ fontLibraryEnabled && <FontFamilies /> }
					<TypographyElements />
					<FontSizesCount />
				</VStack>
			</div>
		</>
	);
}

export default ScreenTypography;
