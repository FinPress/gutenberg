/**
 * External dependencies
 */
import {
	format,
	isSameDay,
	subMonths,
	addMonths,
	startOfDay,
	isEqual,
	addDays,
	subWeeks,
	addWeeks,
	isSameMonth,
	startOfWeek,
	endOfWeek,
	setMonth,
	set,
} from 'date-fns';
import type { KeyboardEventHandler } from 'react';

/**
 * WordPress dependencies
 */
import { __, _n, sprintf, isRTL } from '@wordpress/i18n';
import { arrowLeft, arrowRight } from '@wordpress/icons';
import { dateI18n, getSettings } from '@wordpress/date';
import { useState, useRef, useEffect, useMemo } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { useLilius } from './use-lilius';
import type { DatePickerProps } from '../types';
import {
	Wrapper,
	Navigator,
	NavigatorHeading,
	Calendar,
	DayOfWeek,
	DayButton,
	DayInput,
	MonthSelectWrapper,
	YearInput,
	Fieldset,
} from './styles';
import {
	buildPadInputStateReducer,
	inputToDate,
	validateInputElementTarget,
} from '../utils';
import Button from '../../button';
import { TIMEZONELESS_FORMAT } from '../constants';
import SelectControl from '../../select-control';
import { VisuallyHidden } from '../../visually-hidden';
import { HStack } from '../../h-stack';
import type { InputChangeCallback } from '../../input-control/types';

/**
 * DatePicker is a React component that renders a calendar for date selection.
 *
 * ```jsx
 * import { DatePicker } from '@wordpress/components';
 * import { useState } from '@wordpress/element';
 *
 * const MyDatePicker = () => {
 *   const [ date, setDate ] = useState( new Date() );
 *
 *   return (
 *     <DatePicker
 *       currentDate={ date }
 *       onChange={ ( newDate ) => setDate( newDate ) }
 *       showDateInputs
 *     />
 *   );
 * };
 * ```
 */
export function DatePicker( {
	currentDate,
	onChange,
	events = [],
	isInvalidDate,
	onMonthPreviewed,
	startOfWeek: weekStartsOn = 0,
	showDateInputs = false,
	dateOrder: dateOrderProp,
}: DatePickerProps ) {
	const date = currentDate ? inputToDate( currentDate ) : new Date();

	const {
		calendar,
		viewing,
		setSelected,
		setViewing,
		isSelected,
		viewPreviousMonth,
		viewNextMonth,
	} = useLilius( {
		selected: [ startOfDay( date ) ],
		viewing: startOfDay( date ),
		weekStartsOn,
	} );

	// Used to implement a roving tab index. Tracks the day that receives focus
	// when the user tabs into the calendar.
	const [ focusable, setFocusable ] = useState( startOfDay( date ) );

	// Allows us to only programmatically focus() a day when focus was already
	// within the calendar. This stops us stealing focus from e.g. a TimePicker
	// input.
	const [ isFocusWithinCalendar, setIsFocusWithinCalendar ] =
		useState( false );

	// Update internal state when currentDate prop changes.
	const [ prevCurrentDate, setPrevCurrentDate ] = useState( currentDate );
	if ( currentDate !== prevCurrentDate ) {
		setPrevCurrentDate( currentDate );
		setSelected( [ startOfDay( date ) ] );
		setViewing( startOfDay( date ) );
		setFocusable( startOfDay( date ) );
	}

	const [ inputDate, setInputDate ] = useState( () => date );

	useEffect( () => {
		setInputDate( date );
	}, [ currentDate ] );

	const { day, month, year } = useMemo(
		() => ( {
			day: format( inputDate, 'dd' ),
			month: format( inputDate, 'MM' ),
			year: format( inputDate, 'yyyy' ),
		} ),
		[ inputDate ]
	);

	const monthOptions = [
		{ value: '01', label: __( 'January' ) },
		{ value: '02', label: __( 'February' ) },
		{ value: '03', label: __( 'March' ) },
		{ value: '04', label: __( 'April' ) },
		{ value: '05', label: __( 'May' ) },
		{ value: '06', label: __( 'June' ) },
		{ value: '07', label: __( 'July' ) },
		{ value: '08', label: __( 'August' ) },
		{ value: '09', label: __( 'September' ) },
		{ value: '10', label: __( 'October' ) },
		{ value: '11', label: __( 'November' ) },
		{ value: '12', label: __( 'December' ) },
	];

	const buildNumberControlChangeCallback = ( method: 'date' | 'year' ) => {
		const callback: InputChangeCallback = ( value, { event } ) => {
			if ( ! validateInputElementTarget( event ) ) {
				return;
			}

			const numberValue = Number( value );

			const newDate = set( inputDate, { [ method ]: numberValue } );
			setInputDate( newDate );
			onChange?.( format( newDate, TIMEZONELESS_FORMAT ) );
			setViewing( newDate );
			setSelected( [ startOfDay( newDate ) ] );
			setFocusable( startOfDay( newDate ) );
		};

		return callback;
	};

	const dayField = (
		<DayInput
			key="day"
			className="components-datetime__date-field components-datetime__date-field-day"
			label={ __( 'Day' ) }
			hideLabelFromVision
			__next40pxDefaultSize
			value={ day }
			step={ 1 }
			min={ 1 }
			max={ 31 }
			required
			spinControls="none"
			isPressEnterToChange
			isDragEnabled={ false }
			isShiftStepEnabled={ false }
			onChange={ buildNumberControlChangeCallback( 'date' ) }
		/>
	);

	const monthField = (
		<MonthSelectWrapper key="month">
			<SelectControl
				className="components-datetime__date-field components-datetime__date-field-month"
				label={ __( 'Month' ) }
				hideLabelFromVision
				__next40pxDefaultSize
				__nextHasNoMarginBottom
				value={ month }
				options={ monthOptions }
				onChange={ ( value ) => {
					const newDate = setMonth( inputDate, Number( value ) - 1 );
					setInputDate( newDate );
					onChange?.( format( newDate, TIMEZONELESS_FORMAT ) );
					setViewing( newDate );
					setSelected( [ startOfDay( newDate ) ] );
					setFocusable( startOfDay( newDate ) );
				} }
			/>
		</MonthSelectWrapper>
	);

	const yearField = (
		<YearInput
			key="year"
			className="components-datetime__date-field components-datetime__date-field-year"
			label={ __( 'Year' ) }
			hideLabelFromVision
			__next40pxDefaultSize
			value={ year }
			step={ 1 }
			min={ 1 }
			max={ 9999 }
			required
			spinControls="none"
			isPressEnterToChange
			isDragEnabled={ false }
			isShiftStepEnabled={ false }
			onChange={ buildNumberControlChangeCallback( 'year' ) }
			__unstableStateReducer={ buildPadInputStateReducer( 4 ) }
		/>
	);

	const defaultDateOrder = 'dmy';
	const dateOrder =
		dateOrderProp && [ 'dmy', 'mdy', 'ymd' ].includes( dateOrderProp )
			? dateOrderProp
			: defaultDateOrder;

	const fields = dateOrder.split( '' ).map( ( field ) => {
		switch ( field ) {
			case 'd':
				return dayField;
			case 'm':
				return monthField;
			case 'y':
				return yearField;
			default:
				return null;
		}
	} );

	return (
		<Wrapper
			className="components-datetime__date"
			role="application"
			aria-label={ __( 'Calendar' ) }
		>
			{ showDateInputs && (
				<Fieldset>
					<VisuallyHidden as="legend">
						{ __( 'Date' ) }
					</VisuallyHidden>
					<HStack className="components-datetime__date-wrapper">
						{ fields }
					</HStack>
				</Fieldset>
			) }

			<Navigator>
				<Button
					icon={ isRTL() ? arrowRight : arrowLeft }
					variant="tertiary"
					aria-label={ __( 'View previous month' ) }
					onClick={ () => {
						viewPreviousMonth();
						setFocusable( subMonths( focusable, 1 ) );
						onMonthPreviewed?.(
							format(
								subMonths( viewing, 1 ),
								TIMEZONELESS_FORMAT
							)
						);
					} }
					size="compact"
				/>
				<NavigatorHeading level={ 3 }>
					<strong>
						{ dateI18n(
							'F',
							viewing,
							-viewing.getTimezoneOffset()
						) }
					</strong>{ ' ' }
					{ dateI18n( 'Y', viewing, -viewing.getTimezoneOffset() ) }
				</NavigatorHeading>
				<Button
					icon={ isRTL() ? arrowLeft : arrowRight }
					variant="tertiary"
					aria-label={ __( 'View next month' ) }
					onClick={ () => {
						viewNextMonth();
						setFocusable( addMonths( focusable, 1 ) );
						onMonthPreviewed?.(
							format(
								addMonths( viewing, 1 ),
								TIMEZONELESS_FORMAT
							)
						);
					} }
					size="compact"
				/>
			</Navigator>
			<Calendar
				onFocus={ () => setIsFocusWithinCalendar( true ) }
				onBlur={ () => setIsFocusWithinCalendar( false ) }
			>
				{ calendar[ 0 ][ 0 ].map( ( days ) => (
					<DayOfWeek key={ days.toString() }>
						{ dateI18n( 'D', days, -days.getTimezoneOffset() ) }
					</DayOfWeek>
				) ) }
				{ calendar[ 0 ].map( ( week ) =>
					week.map( ( days, index ) => {
						if ( ! isSameMonth( days, viewing ) ) {
							return null;
						}
						return (
							<Day
								key={ days.toString() }
								day={ days }
								column={ index + 1 }
								isSelected={ isSelected( days ) }
								isFocusable={ isEqual( days, focusable ) }
								isFocusAllowed={ isFocusWithinCalendar }
								isToday={ isSameDay( days, new Date() ) }
								isInvalid={
									isInvalidDate
										? isInvalidDate( days )
										: false
								}
								numEvents={
									events.filter( ( event ) =>
										isSameDay( event.date, days )
									).length
								}
								onClick={ () => {
									setSelected( [ days ] );
									setFocusable( days );
									setInputDate(
										new Date(
											days.getFullYear(),
											days.getMonth(),
											days.getDate(),
											date.getHours(),
											date.getMinutes(),
											date.getSeconds(),
											date.getMilliseconds()
										)
									);
									onChange?.(
										format(
											// Don't change the selected date's time fields.
											new Date(
												days.getFullYear(),
												days.getMonth(),
												days.getDate(),
												date.getHours(),
												date.getMinutes(),
												date.getSeconds(),
												date.getMilliseconds()
											),
											TIMEZONELESS_FORMAT
										)
									);
								} }
								onKeyDown={ ( event ) => {
									let nextFocusable;
									if ( event.key === 'ArrowLeft' ) {
										nextFocusable = addDays(
											day,
											isRTL() ? 1 : -1
										);
									}
									if ( event.key === 'ArrowRight' ) {
										nextFocusable = addDays(
											day,
											isRTL() ? -1 : 1
										);
									}
									if ( event.key === 'ArrowUp' ) {
										nextFocusable = subWeeks( day, 1 );
									}
									if ( event.key === 'ArrowDown' ) {
										nextFocusable = addWeeks( day, 1 );
									}
									if ( event.key === 'PageUp' ) {
										nextFocusable = subMonths( day, 1 );
									}
									if ( event.key === 'PageDown' ) {
										nextFocusable = addMonths( day, 1 );
									}
									if ( event.key === 'Home' ) {
										nextFocusable = startOfWeek( day );
									}
									if ( event.key === 'End' ) {
										nextFocusable = startOfDay(
											endOfWeek( day )
										);
									}
									if ( nextFocusable ) {
										event.preventDefault();
										setFocusable( nextFocusable );
										if (
											! isSameMonth(
												nextFocusable,
												viewing
											)
										) {
											setViewing( nextFocusable );
											onMonthPreviewed?.(
												format(
													nextFocusable,
													TIMEZONELESS_FORMAT
												)
											);
										}
									}
								} }
							/>
						);
					} )
				) }
			</Calendar>
		</Wrapper>
	);
}

type DayProps = {
	day: Date;
	column: number;
	isSelected: boolean;
	isFocusable: boolean;
	isFocusAllowed: boolean;
	isToday: boolean;
	numEvents: number;
	isInvalid: boolean;
	onClick: () => void;
	onKeyDown: KeyboardEventHandler;
};

function Day( {
	day,
	column,
	isSelected,
	isFocusable,
	isFocusAllowed,
	isToday,
	isInvalid,
	numEvents,
	onClick,
	onKeyDown,
}: DayProps ) {
	const ref = useRef< HTMLButtonElement >();

	// Focus the day when it becomes focusable, e.g. because an arrow key is
	// pressed. Only do this if focus is allowed - this stops us stealing focus
	// from e.g. a TimePicker input.
	useEffect( () => {
		if ( ref.current && isFocusable && isFocusAllowed ) {
			ref.current.focus();
		}
		// isFocusAllowed is not a dep as there is no point calling focus() on
		// an already focused element.
	}, [ isFocusable ] );

	return (
		<DayButton
			__next40pxDefaultSize
			ref={ ref }
			className="components-datetime__date__day" // Unused, for backwards compatibility.
			disabled={ isInvalid }
			tabIndex={ isFocusable ? 0 : -1 }
			aria-label={ getDayLabel( day, isSelected, numEvents ) }
			column={ column }
			isSelected={ isSelected }
			isToday={ isToday }
			hasEvents={ numEvents > 0 }
			onClick={ onClick }
			onKeyDown={ onKeyDown }
		>
			{ dateI18n( 'j', day, -day.getTimezoneOffset() ) }
		</DayButton>
	);
}

function getDayLabel( date: Date, isSelected: boolean, numEvents: number ) {
	const { formats } = getSettings();
	const localizedDate = dateI18n(
		formats.date,
		date,
		-date.getTimezoneOffset()
	);
	if ( isSelected && numEvents > 0 ) {
		return sprintf(
			// translators: 1: The calendar date. 2: Number of events on the calendar date.
			_n(
				'%1$s. Selected. There is %2$d event',
				'%1$s. Selected. There are %2$d events',
				numEvents
			),
			localizedDate,
			numEvents
		);
	} else if ( isSelected ) {
		return sprintf(
			// translators: 1: The calendar date.
			__( '%1$s. Selected' ),
			localizedDate
		);
	} else if ( numEvents > 0 ) {
		return sprintf(
			// translators: 1: The calendar date. 2: Number of events on the calendar date.
			_n(
				'%1$s. There is %2$d event',
				'%1$s. There are %2$d events',
				numEvents
			),
			localizedDate,
			numEvents
		);
	}
	return localizedDate;
}

export default DatePicker;
