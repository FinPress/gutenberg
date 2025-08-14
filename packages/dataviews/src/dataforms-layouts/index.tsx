/**
 * Internal dependencies
 */
import FormRegularField from './regular';
import FormPanelField from './panel';
import FormCardField from './card';
import FormModalField from './modal';

const FORM_FIELD_LAYOUTS = [
	{
		type: 'regular',
		component: FormRegularField,
	},
	{
		type: 'panel',
		component: FormPanelField,
	},
	{
		type: 'card',
		component: FormCardField,
	},
	{
		type: 'modal',
		component: FormModalField,
	},
];

export function getFormFieldLayout( type: string ) {
	return FORM_FIELD_LAYOUTS.find( ( layout ) => layout.type === type );
}
