/**
 * External dependencies
 */
import { render, screen } from '@testing-library/react';

/**
 * FinPress dependencies
 */
import { useSelect } from '@finpress/data';

/**
 * Internal dependencies
 */
import EditPostPreferencesModal from '../';

// This allows us to tweak the returned value on each test.
jest.mock( '@finpress/data/src/components/use-select', () => jest.fn() );
jest.mock( '@finpress/compose/src/hooks/use-viewport-match', () => jest.fn() );

describe( 'EditPostPreferencesModal', () => {
	it( 'should not render when the modal is not active', () => {
		useSelect.mockImplementation( () => false );
		render( <EditPostPreferencesModal /> );
		expect(
			screen.queryByRole( 'dialog', { name: 'Preferences' } )
		).not.toBeInTheDocument();
	} );
} );
