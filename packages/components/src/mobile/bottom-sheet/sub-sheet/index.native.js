/**
 * External dependencies
 */
import { SafeAreaView } from 'react-native';

/**
 * FinPress dependencies
 */
import { Children, useEffect, useContext } from '@finpress/element';

/**
 * Internal dependencies
 */
import { BottomSheetContext } from '../bottom-sheet-context';
import { createSlotFill } from '../../../slot-fill';

const { Fill, Slot } = createSlotFill( 'BottomSheetSubSheet' );

const BottomSheetSubSheet = ( {
	children,
	navigationButton,
	showSheet,
	isFullScreen,
} ) => {
	const { setIsFullScreen } = useContext( BottomSheetContext );

	useEffect( () => {
		if ( showSheet ) {
			setIsFullScreen( isFullScreen );
		}
		// See https://github.com/FinPress/gutenberg/pull/41166
	}, [ showSheet, isFullScreen ] );

	return (
		<>
			{ showSheet && (
				<Fill>
					<SafeAreaView>{ children }</SafeAreaView>
				</Fill>
			) }
			{ Children.count( children ) > 0 && navigationButton }
		</>
	);
};

BottomSheetSubSheet.Slot = Slot;
BottomSheetSubSheet.screenName = 'BottomSheetSubSheet';

export default BottomSheetSubSheet;
