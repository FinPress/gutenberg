/**
 * WordPress dependencies
 */
import { useRef } from '@wordpress/element';

/**
 * External dependencies
 */
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

/**
 * Internal dependencies
 */
import useFocusOutside from '../';

const FocusOutsideComponent = ( { onFocusOutside: callback } ) => {
	const containerRef = useRef( null );
	const { onBlur } = useFocusOutside( callback, containerRef );

	return (
		<div>
			{ /* Wrapper */ }
			<div ref={ containerRef } onBlur={ onBlur }>
				<input type="text" />
				<button>Button inside the wrapper</button>
				<iframe title="test-iframe">
					<button>Inside the iframe</button>
				</iframe>
			</div>

			<button>Button outside the wrapper</button>
		</div>
	);
};

describe( 'useFocusOutside', () => {
	it( 'should not call handler if focus shifts to element within component', async () => {
		const mockOnFocusOutside = jest.fn();
		const user = userEvent.setup();

		render(
			<FocusOutsideComponent onFocusOutside={ mockOnFocusOutside } />
		);

		// Tab through the interactive elements inside the wrapper,
		// causing multiple focus/blur events.
		await user.tab();
		expect( screen.getByRole( 'textbox' ) ).toHaveFocus();

		await user.tab();
		expect(
			screen.getByRole( 'button', { name: 'Button inside the wrapper' } )
		).toHaveFocus();

		expect( mockOnFocusOutside ).not.toHaveBeenCalled();
	} );

	it( 'should not call handler if focus transitions via click to button', async () => {
		const mockOnFocusOutside = jest.fn();
		const user = userEvent.setup();

		render(
			<FocusOutsideComponent onFocusOutside={ mockOnFocusOutside } />
		);

		// Click the input and the button, causing multiple focus/blur events.
		await user.click( screen.getByRole( 'textbox' ) );
		await user.click(
			screen.getByRole( 'button', { name: 'Button inside the wrapper' } )
		);

		expect( mockOnFocusOutside ).not.toHaveBeenCalled();
	} );

	it( 'should call handler if focus shifts to element outside component', async () => {
		const mockOnFocusOutside = jest.fn();
		const user = userEvent.setup();

		render(
			<FocusOutsideComponent onFocusOutside={ mockOnFocusOutside } />
		);

		// Click and focus button inside the wrapper
		await user.click(
			screen.getByRole( 'button', { name: 'Button inside the wrapper' } )
		);

		expect( mockOnFocusOutside ).not.toHaveBeenCalled();

		// Click and focus button outside the wrapper
		await user.click(
			screen.getByRole( 'button', { name: 'Button outside the wrapper' } )
		);

		expect( mockOnFocusOutside ).toHaveBeenCalled();
	} );
} );
