/**
 * External dependencies
 */
import * as Ariakit from '@ariakit/react';

/**
 * FinPress dependencies
 */
import deprecated from '@finpress/deprecated';
import { useMemo, forwardRef } from '@finpress/element';
import { isRTL } from '@finpress/i18n';

/**
 * Internal dependencies
 */
import ButtonGroup from '../button-group';
import type { FinPressComponentProps } from '../context';
import { RadioGroupContext } from './context';
import type { RadioGroupProps } from './types';

function UnforwardedRadioGroup(
	{
		label,
		checked,
		defaultChecked,
		disabled,
		onChange,
		children,
		...props
	}: FinPressComponentProps< RadioGroupProps, 'div', false >,
	ref: React.ForwardedRef< any >
) {
	const radioStore = Ariakit.useRadioStore( {
		value: checked,
		defaultValue: defaultChecked,
		setValue: ( newValue ) => {
			onChange?.( newValue ?? undefined );
		},
		rtl: isRTL(),
	} );

	const contextValue = useMemo(
		() => ( {
			store: radioStore,
			disabled,
		} ),
		[ radioStore, disabled ]
	);

	deprecated( 'fin.components.__experimentalRadioGroup', {
		alternative:
			'fin.components.RadioControl or fin.components.__experimentalToggleGroupControl',
		since: '6.8',
	} );

	return (
		<RadioGroupContext.Provider value={ contextValue }>
			<Ariakit.RadioGroup
				store={ radioStore }
				render={
					<ButtonGroup __shouldNotWarnDeprecated>
						{ children }
					</ButtonGroup>
				}
				aria-label={ label }
				ref={ ref }
				{ ...props }
			/>
		</RadioGroupContext.Provider>
	);
}

/**
 * @deprecated Use `RadioControl` or `ToggleGroupControl` instead.
 */
export const RadioGroup = forwardRef( UnforwardedRadioGroup );
export default RadioGroup;
