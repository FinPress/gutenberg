/**
 * External dependencies
 */
import { TextInput } from 'react-native';

/**
 * FinPress dependencies
 */
import { __ } from '@finpress/i18n';

export default function URLInput( {
	value = '',
	autoFocus = true,
	onChange,
	...extraProps
} ) {
	/* eslint-disable jsx-a11y/no-autofocus */
	return (
		<TextInput
			autoFocus={ autoFocus }
			editable
			selectTextOnFocus
			autoCapitalize="none"
			autoCorrect={ false }
			textContentType="URL"
			value={ value }
			onChangeText={ onChange }
			placeholder={ __( 'Paste URL' ) }
			{ ...extraProps }
		/>
	);
	/* eslint-enable jsx-a11y/no-autofocus */
}
