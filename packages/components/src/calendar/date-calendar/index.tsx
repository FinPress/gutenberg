/**
 * External dependencies
 */
import { DayPicker } from 'react-day-picker';
import { enUS } from 'react-day-picker/locale';
/**
 * Internal dependencies
 */
import { COMMON_PROPS } from '../utils/constants';
import { clampNumberOfMonths } from '../utils/misc';
import { useControlledValue } from '../../utils/hooks';
import { useLocalizationProps } from '../utils/use-localization-props';
import type { DateCalendarProps } from '../types';

/**
 * `DateCalendar` is a React component that provides a customizable calendar
 * interface for **single date** selection.
 *
 * The component is built with accessibility in mind and follows ARIA best
 * practices for calendar widgets. It provides keyboard navigation, screen reader
 * support, and customizable labels for internationalization.
 */
export const DateCalendar = ( {
	defaultSelected,
	selected: selectedProp,
	onSelect,
	numberOfMonths = 1,
	locale = enUS,
	timeZone,
	...props
}: DateCalendarProps ) => {
	const localizationProps = useLocalizationProps( {
		locale,
		timeZone,
		mode: 'single',
	} );

	const [ selected, setSelected ] = useControlledValue<
		Date | undefined | null
	>( {
		defaultValue: defaultSelected,
		value: selectedProp,
		// @ts-ignore: The onChange parameter type expected by useControlledValue differs from the type provided by onSelect. Here, onSelect only receives DateRange | undefined.
		onChange: onSelect,
	} );

	return (
		<DayPicker
			{ ...COMMON_PROPS }
			{ ...localizationProps }
			{ ...props }
			mode="single"
			numberOfMonths={ clampNumberOfMonths( numberOfMonths ) }
			selected={ selected ?? undefined }
			onSelect={ setSelected }
		/>
	);
};
