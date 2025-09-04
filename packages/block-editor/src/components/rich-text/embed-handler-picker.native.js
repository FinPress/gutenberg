/**
 * FinPress dependencies
 */
import {
	forwardRef,
	useRef,
	useImperativeHandle,
	memo,
	useCallback,
} from '@finpress/element';
import { Picker } from '@finpress/components';
import { __ } from '@finpress/i18n';

const noop = () => {};

const DEFAULT_PICKER_OPTIONS = [
	{
		id: 'createEmbed',
		label: __( 'Create embed' ),
		value: 'createEmbed',
		onSelect: noop,
	},
	{
		id: 'createLink',
		label: __( 'Create link' ),
		value: 'createLink',
		onSelect: noop,
	},
];

const EmbedHandlerPicker = forwardRef( ( {}, ref ) => {
	const pickerRef = useRef();
	const pickerOptions = useRef( DEFAULT_PICKER_OPTIONS ).current;

	const onPickerSelect = useCallback(
		( value ) => {
			const selectedItem = pickerOptions.find(
				( item ) => item.value === value
			);
			selectedItem.onSelect();
		},
		[ pickerOptions ]
	);

	useImperativeHandle( ref, () => ( {
		presentPicker: ( { createEmbed, createLink } ) => {
			pickerOptions[ 0 ].onSelect = createEmbed;
			pickerOptions[ 1 ].onSelect = createLink;
			pickerRef.current?.presentPicker();
		},
	} ) );

	return (
		<Picker
			ref={ pickerRef }
			options={ pickerOptions }
			onChange={ onPickerSelect }
			testID="embed-handler-picker"
			hideCancelButton
			leftAlign
		/>
	);
} );

export default memo( EmbedHandlerPicker );
