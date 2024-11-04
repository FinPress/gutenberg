/**
 * Internal dependencies
 */
import { getElementBounds, WITH_OVERFLOW_ELEMENT_BLOCKS } from '../dom';
describe( 'dom', () => {
	describe( 'getElementBounds', () => {
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
		it( 'should return the child DOMRectReadOnly object if it is visible', () => {
			const element = window.document.createElement( 'div' );
			element.getBoundingClientRect = jest.fn().mockReturnValue( {
				left: 0,
				top: 0,
				right: 100,
				bottom: 100,
				width: 100,
				height: 100,
			} );
			element.setAttribute(
				'data-type',
				WITH_OVERFLOW_ELEMENT_BLOCKS[ 0 ]
			);
			const childElement = window.document.createElement( 'div' );
			childElement.getBoundingClientRect = jest.fn().mockReturnValue( {
				left: 0,
				top: 0,
				right: 333,
				bottom: 333,
				width: 333,
				height: 333,
				x: 0,
				y: 0,
			} );
			element.appendChild( childElement );

			expect( getElementBounds( element ).toJSON() ).toEqual( {
				left: 0,
				top: 0,
				right: 333,
				bottom: 333,
				width: 333,
				height: 333,
				x: 0,
				y: 0,
			} );
		} );
		it( 'should return the parent DOMRectReadOnly object if the child block type is not supported', () => {
			const element = window.document.createElement( 'div' );
			element.getBoundingClientRect = jest.fn().mockReturnValue( {
				left: 0,
				top: 0,
				right: 100,
				bottom: 100,
				width: 100,
				height: 100,
			} );
			element.setAttribute( 'data-type', 'test' );
			const childElement = window.document.createElement( 'div' );
			childElement.getBoundingClientRect = jest.fn().mockReturnValue( {
				left: 0,
				top: 0,
				right: 333,
				bottom: 333,
				width: 333,
				height: 333,
				x: 0,
				y: 0,
			} );
			element.appendChild( childElement );

			expect( getElementBounds( element ).toJSON() ).toEqual( {
				left: 0,
				top: 0,
				right: 100,
				bottom: 100,
				width: 100,
				height: 100,
				x: 0,
				y: 0,
			} );
		} );
		it( 'should return the parent DOMRectReadOnly object if the child element is not visible', () => {
			const element = window.document.createElement( 'div' );
			element.getBoundingClientRect = jest.fn().mockReturnValue( {
				left: 0,
				top: 0,
				right: 100,
				bottom: 100,
				width: 100,
				height: 100,
			} );
			element.setAttribute(
				'data-type',
				WITH_OVERFLOW_ELEMENT_BLOCKS[ 0 ]
			);
			const childElement = window.document.createElement( 'div' );
			childElement.getBoundingClientRect = jest.fn().mockReturnValue( {
				left: 0,
				top: 0,
				right: 333,
				bottom: 333,
				width: 333,
				height: 333,
				x: 0,
				y: 0,
			} );
			childElement.style.display = 'none';
			element.appendChild( childElement );

			expect( getElementBounds( element ).toJSON() ).toEqual( {
				left: 0,
				top: 0,
				right: 100,
				bottom: 100,
				width: 100,
				height: 100,
				x: 0,
				y: 0,
			} );
		} );
		it( 'should return the parent DOMRectReadOnly if the child is scrollable', () => {
			const element = window.document.createElement( 'div' );
			element.setAttribute(
				'data-type',
				WITH_OVERFLOW_ELEMENT_BLOCKS[ 0 ]
			);
			element.style.overflowX = 'auto';
			element.style.overflowY = 'auto';
			element.getBoundingClientRect = jest.fn().mockReturnValue( {
				left: 0,
				top: 0,
				right: 100,
				bottom: 100,
				width: 100,
				height: 100,
			} );
			const childElement = window.document.createElement( 'div' );
			childElement.getBoundingClientRect = jest.fn().mockReturnValue( {
				left: 0,
				top: 0,
				right: 333,
				bottom: 333,
				width: 333,
				height: 333,
				x: 0,
				y: 0,
			} );
			element.appendChild( childElement );

			expect( getElementBounds( element ).toJSON() ).toEqual( {
				left: 0,
				top: 0,
				right: 100,
				bottom: 100,
				width: 100,
				height: 100,
				x: 0,
				y: 0,
			} );
		} );
	} );
} );
