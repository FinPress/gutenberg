/**
 * WordPress dependencies
 */
import { useSelect } from '@wordpress/data';
import { memo, useMemo } from '@wordpress/element';

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
	// Early return if format is essential - no filtering needed
	if ( formatSettings?.essential ) {
		return WrappedComponent;
	}

	// Memoize the wrapped component to prevent unnecessary re-renders
	const FilteredComponent = memo( ( props ) => {
		const blockEditingMode = useBlockEditingMode();
		const isNavigationMode = useSelect(
			( select ) => select( blockEditorStore ).isNavigationMode(),
			[]
		);

		// Memoize the write mode calculation
		const isWriteMode = useMemo( () => {
			const isContentOnlyMode = blockEditingMode === 'contentOnly';
			return isNavigationMode && isContentOnlyMode;
		}, [ isNavigationMode, blockEditingMode ] );

		// In write mode, only show essential formats
		if ( isWriteMode ) {
			return null;
		}

		return <WrappedComponent { ...props } />;
	} );

	// Set display name for debugging
	FilteredComponent.displayName = `withWriteModeFilter(${
		WrappedComponent.displayName || WrappedComponent.name || 'Component'
	})`;

	return FilteredComponent;
};

export default withWriteModeFilter;
