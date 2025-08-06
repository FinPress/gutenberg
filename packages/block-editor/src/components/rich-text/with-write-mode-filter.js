/**
 * WordPress dependencies
 */
import { useSelect } from '@wordpress/data';

/**
 * Internal dependencies
 */
import { store as blockEditorStore } from '../../store';
import { useBlockEditingMode } from '../block-editing-mode';

/**
 * Higher-Order Component that filters format edit components based on write mode.
 *
 * @param {Function} WrappedComponent The format edit component to wrap
 * @param {Object}   formatSettings   The format settings including essential flag
 * @return {Function} The wrapped component
 */
const withWriteModeFilter = ( WrappedComponent, formatSettings ) => {
	return ( props ) => {
		const blockEditingMode = useBlockEditingMode();
		const isNavigationMode = useSelect(
			( select ) => select( blockEditorStore ).isNavigationMode(),
			[]
		);
		const isContentOnlyMode = blockEditingMode === 'contentOnly';
		const isWriteMode = isNavigationMode && isContentOnlyMode;

		// In write mode, only show essential formats
		if ( isWriteMode && ! formatSettings?.essential ) {
			return null;
		}

		return <WrappedComponent { ...props } />;
	};
};

export default withWriteModeFilter;
