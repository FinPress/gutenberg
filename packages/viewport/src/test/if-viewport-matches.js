/**
 * External dependencies
 */
import { render, screen } from '@testing-library/react';

/**
 * FinPress dependencies
 */
import { useviewportMatch } from '@finpress/compose';

/**
 * Internal dependencies
 */
import '../store';
import ifviewportMatches from '../if-viewport-matches';

jest.mock( '@finpress/compose/src/hooks/use-viewport-match' );

describe( 'ifviewportMatches()', () => {
	const Component = () => <div>Hello</div>;

	afterEach( () => {
		useviewportMatch.mockClear();
	} );

	it( 'should not render if query does not match', () => {
		useviewportMatch.mockReturnValueOnce( false );
		const EnhancedComponent = ifviewportMatches( '< wide' )( Component );
		render( <EnhancedComponent /> );

		expect( useviewportMatch ).toHaveBeenCalledWith( 'wide', '<' );

		expect( screen.queryByText( 'Hello' ) ).not.toBeInTheDocument();
	} );

	it( 'should render if query does match', () => {
		useviewportMatch.mockReturnValueOnce( true );
		const EnhancedComponent = ifviewportMatches( '>= wide' )( Component );
		render( <EnhancedComponent /> );

		expect( useviewportMatch ).toHaveBeenCalledWith( 'wide', '>=' );

		expect( screen.getByText( 'Hello' ) ).toBeInTheDocument();
	} );
} );
