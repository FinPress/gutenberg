/**
 * Internal dependencies
 */
import { getElementBounds } from '../dom';

describe( 'dom', () => {
	describe( 'getElementBounds', () => {
		const mockIsScrollable = jest.fn();
		const mockIsElementVisible = jest.fn();
		const mockRectUnion = jest.fn();
		jest.mock( '../dom', () => ( {
			isScrollable: mockIsScrollable,
			isElementVisible: ( el ) => mockIsElementVisible( el ),
			rectUnion: ( rect1, rect2 ) => mockRectUnion( rect1, rect2 ),
		} ) );
		afterEach( () => {
			jest.clearAllMocks();
		} );

		it( 'should return a DOMRectReadOnly object if the viewport is not available', () => {
			const element = {
				ownerDocument: {
					defaultView: null,
				},
			};
			expect( getElementBounds( element ) ).toEqual(
				new window.DOMRectReadOnly()
			);
		} );
		it( 'should return a DOMRectReadOnly object if the viewport is available', () => {
			const element = {
				ownerDocument: {
					defaultView: {
						getComputedStyle: () => ( {
							display: 'block',
							visibility: 'visible',
							opacity: '1',
						} ),
					},
				},
				getBoundingClientRect: () => ( {
					left: 0,
					top: 0,
					right: 100,
					bottom: 100,
					width: 100,
					height: 100,
				} ),
				getAttribute: ( x ) => x,
			};
			expect( getElementBounds( element ) ).toEqual(
				new window.DOMRectReadOnly( 0, 0, 100, 100 )
			);
		} );
	} );
} );
