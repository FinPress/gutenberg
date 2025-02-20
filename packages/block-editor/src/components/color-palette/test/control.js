/**
 * External dependencies
 */
import {
	render,
	waitFor,
	queryByAttribute,
	fireEvent,
	screen,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

/**
 * Internal dependencies
 */
import ColorPaletteControl from '../control';

const noop = () => {};

async function renderAndValidate( ...renderArgs ) {
	const view = render( ...renderArgs );
	await waitFor( () => {
		const activeButton = queryByAttribute(
			'data-active-item',
			view.baseElement,
			'true'
		);
		expect( activeButton ).not.toBeNull();
	} );
	return view;
}

describe( 'ColorPaletteControl', () => {
	it( 'matches the snapshot', async () => {
		const { container } = await renderAndValidate(
			<ColorPaletteControl
				label="Test Color"
				value="#f00"
				colors={ [ { color: '#f00', name: 'red' } ] }
				disableCustomColors={ false }
				onChange={ noop }
			/>
		);

		expect( container ).toMatchSnapshot();
	} );

	it( 'allows editing hex value on click', async () => {
		await renderAndValidate(
			<ColorPaletteControl
				label="Test Color"
				value="#f00"
				colors={ [ { color: '#f00', name: 'red' } ] }
				disableCustomColors={ false }
				onChange={ noop }
			/>
		);

		const hexValue = screen.getByRole( 'button', {
			name: /click to edit hex value/i,
		} );
		await userEvent.click( hexValue );

		const input = screen.getByRole( 'textbox', {
			name: /edit color hex value/i,
		} );
		expect( input ).toBeInTheDocument();
		expect( input ).toHaveValue( '#f00' );
	} );

	it( 'validates hex input on blur', async () => {
		const onChange = jest.fn();
		await renderAndValidate(
			<ColorPaletteControl
				label="Test Color"
				value="#f00"
				colors={ [ { color: '#f00', name: 'red' } ] }
				disableCustomColors={ false }
				onChange={ onChange }
			/>
		);

		const hexValue = screen.getByRole( 'button', {
			name: /click to edit hex value/i,
		} );
		await userEvent.click( hexValue );

		const input = screen.getByRole( 'textbox', {
			name: /edit color hex value/i,
		} );
		await userEvent.clear( input );
		await userEvent.type( input, '#ff0000' );
		fireEvent.blur( input );

		expect( onChange ).toHaveBeenCalledWith( '#ff0000' );
	} );

	it( 'reverts to previous value on invalid hex', async () => {
		const onChange = jest.fn();
		await renderAndValidate(
			<ColorPaletteControl
				label="Test Color"
				value="#f00"
				colors={ [ { color: '#f00', name: 'red' } ] }
				disableCustomColors={ false }
				onChange={ onChange }
			/>
		);

		const hexValue = screen.getByRole( 'button', {
			name: /click to edit hex value/i,
		} );
		await userEvent.click( hexValue );

		const input = screen.getByRole( 'textbox', {
			name: /edit color hex value/i,
		} );
		await userEvent.clear( input );
		await userEvent.type( input, 'invalid' );
		fireEvent.blur( input );

		expect( onChange ).not.toHaveBeenCalled();
		expect(
			screen.getByRole( 'button', { name: /click to edit hex value/i } )
		).toHaveTextContent( '#f00' );
	} );

	it( 'handles keyboard interaction', async () => {
		const onChange = jest.fn();
		await renderAndValidate(
			<ColorPaletteControl
				label="Test Color"
				value="#f00"
				colors={ [ { color: '#f00', name: 'red' } ] }
				disableCustomColors={ false }
				onChange={ onChange }
			/>
		);

		const hexValue = screen.getByRole( 'button', {
			name: /click to edit hex value/i,
		} );

		fireEvent.keyDown( hexValue, { key: 'Enter' } );
		const input = screen.getByRole( 'textbox', {
			name: /edit color hex value/i,
		} );
		expect( input ).toBeInTheDocument();

		await userEvent.clear( input );
		await userEvent.type( input, '#00f' );
		fireEvent.keyDown( input, { key: 'Escape' } );

		expect( onChange ).not.toHaveBeenCalled();
		expect(
			screen.getByRole( 'button', { name: /click to edit hex value/i } )
		).toHaveTextContent( '#f00' );
	} );
} );
