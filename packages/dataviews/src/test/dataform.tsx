/**
 * External dependencies
 */
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

/**
 * Internal dependencies
 */
import Dataform from '../components/dataform/index';

const noop = () => {};

const fields = [
	{
		id: 'title',
		label: 'Title',
		type: 'text' as const,
	},
	{
		id: 'order',
		label: 'Order',
		type: 'integer' as const,
	},
	{
		id: 'author',
		label: 'Author',
		type: 'integer' as const,
		elements: [
			{ value: 1, label: 'Jane' },
			{ value: 2, label: 'John' },
		],
	},
];

const form = {
	fields: [ 'title', 'order', 'author' ],
};

const data = {
	title: 'Hello World',
	author: 1,
	order: 1,
};

const fieldsSelector = {
	title: {
		view: () =>
			screen.getByRole( 'button', {
				name: /edit title/i,
			} ),
		edit: () =>
			screen.getByRole( 'textbox', {
				name: /title/i,
			} ),
	},
	author: {
		view: () =>
			screen.getByRole( 'button', {
				name: /edit author/i,
			} ),
		edit: () =>
			screen.queryByRole( 'combobox', {
				name: /author/i,
			} ),
	},
	order: {
		view: () =>
			screen.getByRole( 'button', {
				name: /edit order/i,
			} ),
		edit: () =>
			screen.getByRole( 'spinbutton', {
				name: /order/i,
			} ),
	},
};

const modalFieldsSelector = {
	title: {
		view: () =>
			screen.getByRole( 'button', {
				name: data.title,
			} ),
		edit: () =>
			screen.getByRole( 'textbox', {
				name: /title/i,
			} ),
	},
	author: {
		view: () =>
			screen.getByRole( 'button', {
				name: data.author === 1 ? 'Jane' : 'John',
			} ),
		edit: () =>
			screen.queryByRole( 'combobox', {
				name: /author/i,
			} ),
	},
	order: {
		view: () =>
			screen.getByRole( 'button', {
				name: data.order.toString(),
			} ),
		edit: () =>
			screen.getByRole( 'spinbutton', {
				name: /order/i,
			} ),
	},
};

// For modal tests, we need to add render functions to the fields
const fieldsWithRender = fields.map( ( field ) => ( {
	...field,
	render: () => {
		if ( field.id === 'author' ) {
			return <span>{ data.author === 1 ? 'Jane' : 'John' }</span>;
		}
		return <span>{ data[ field.id as keyof typeof data ] }</span>;
	},
} ) );

describe( 'DataForm component', () => {
	describe( 'in regular mode', () => {
		it( 'should display fields', () => {
			render(
				<Dataform
					onChange={ noop }
					fields={ fields }
					form={ form }
					data={ data }
				/>
			);

			expect( fieldsSelector.title.edit() ).toBeInTheDocument();
			expect( fieldsSelector.order.edit() ).toBeInTheDocument();
			expect( fieldsSelector.author.edit() ).toBeInTheDocument();
		} );

		it( 'should render custom Edit component', () => {
			const fieldsWithCustomEditComponent = fields.map( ( field ) => {
				if ( field.id === 'title' ) {
					return {
						...field,
						Edit: () => {
							return <span>This is the Title Field</span>;
						},
					};
				}
				return field;
			} );

			render(
				<Dataform
					onChange={ noop }
					fields={ fieldsWithCustomEditComponent }
					form={ form }
					data={ data }
				/>
			);

			const titleField = screen.getByText( 'This is the Title Field' );
			expect( titleField ).toBeInTheDocument();
		} );

		it( 'should call onChange with the correct value for each typed character', async () => {
			const onChange = jest.fn();
			render(
				<Dataform
					onChange={ onChange }
					fields={ fields }
					form={ form }
					data={ { ...data, title: '' } }
				/>
			);

			const titleInput = fieldsSelector.title.edit();
			const user = userEvent.setup();
			await user.clear( titleInput );
			expect( titleInput ).toHaveValue( '' );
			const newValue = 'Hello folks!';
			await user.type( titleInput, newValue );
			expect( onChange ).toHaveBeenCalledTimes( newValue.length );
			for ( let i = 0; i < newValue.length; i++ ) {
				expect( onChange ).toHaveBeenNthCalledWith( i + 1, {
					title: newValue[ i ],
				} );
			}
		} );

		it( 'should wrap fields in HStack when labelPosition is set to side', async () => {
			const { container } = render(
				<Dataform
					onChange={ noop }
					fields={ fields }
					form={ {
						...form,
						layout: { type: 'regular', labelPosition: 'side' },
					} }
					data={ data }
				/>
			);

			expect(
				// It is used here to ensure that the fields are wrapped in HStack. This happens when the labelPosition is set to side.
				// eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
				container.querySelectorAll( "[data-wp-component='HStack']" )
			).toHaveLength( 3 );
		} );

		it( 'should render combined fields correctly', async () => {
			const formWithCombinedFields = {
				fields: [
					'order',
					{
						id: 'title',
						children: [ 'title', 'author' ],
						label: "Title and author's name",
					},
				],
			};

			render(
				<Dataform
					onChange={ noop }
					fields={ fields }
					form={ formWithCombinedFields }
					data={ data }
				/>
			);

			expect(
				screen.getByText( "Title and author's name" )
			).toBeInTheDocument();
		} );
	} );

	describe( 'in panel mode', () => {
		const formPanelMode = {
			...form,
			layout: {
				type: 'panel',
				labelPosition: 'side',
			} as const,
		};
		it( 'should display fields', async () => {
			render(
				<Dataform
					onChange={ noop }
					fields={ fields }
					form={ formPanelMode }
					data={ data }
				/>
			);

			const user = await userEvent.setup();

			for ( const field of Object.values( fieldsSelector ) ) {
				const button = field.view();
				await user.click( button );
				expect( field.edit() ).toBeInTheDocument();
			}
		} );

		it( 'should call onChange with the correct value for each typed character', async () => {
			const onChange = jest.fn();
			render(
				<Dataform
					onChange={ onChange }
					fields={ fields }
					form={ formPanelMode }
					data={ { ...data, title: '' } }
				/>
			);

			const titleButton = fieldsSelector.title.view();
			const user = await userEvent.setup();
			await user.click( titleButton );
			const input = fieldsSelector.title.edit();
			expect( input ).toHaveValue( '' );
			const newValue = 'Hello folks!';
			await user.type( input, newValue );
			expect( onChange ).toHaveBeenCalledTimes( newValue.length );
			for ( let i = 0; i < newValue.length; i++ ) {
				expect( onChange ).toHaveBeenNthCalledWith( i + 1, {
					title: newValue[ i ],
				} );
			}
		} );

		it( 'should wrap fields in HStack when labelPosition is set to side', async () => {
			const { container } = render(
				<Dataform
					onChange={ noop }
					fields={ fields }
					form={ {
						...formPanelMode,
						layout: { type: 'panel', labelPosition: 'side' },
					} }
					data={ data }
				/>
			);

			expect(
				// eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
				container.querySelectorAll( "[data-wp-component='HStack']" )
			).toHaveLength( 3 );
		} );

		it( 'should render combined fields correctly', async () => {
			const formWithCombinedFields = {
				...formPanelMode,
				fields: [
					'order',
					{
						id: 'title',
						children: [ 'title', 'author' ],
						label: "Title and author's name",
					},
				],
			};

			render(
				<Dataform
					onChange={ noop }
					fields={ fields }
					form={ formWithCombinedFields }
					data={ data }
				/>
			);

			const button = screen.getByRole( 'button', {
				name: /edit title and author's name/i,
			} );
			const user = await userEvent.setup();
			await user.click( button );
			expect( fieldsSelector.title.edit() ).toBeInTheDocument();
			expect( fieldsSelector.author.edit() ).toBeInTheDocument();
		} );

		it( 'should render custom render component', async () => {
			const fieldsWithCustomRenderFunction = fields.map( ( field ) => {
				return {
					...field,
					render: () => {
						return <span>This is the { field.id } field</span>;
					},
				};
			} );

			render(
				<Dataform
					onChange={ noop }
					fields={ fieldsWithCustomRenderFunction }
					form={ formPanelMode }
					data={ data }
				/>
			);

			const titleField = screen.getByText( 'This is the title field' );
			const orderField = screen.getByText( 'This is the order field' );
			const authorField = screen.getByText( 'This is the author field' );
			expect( titleField ).toBeInTheDocument();
			expect( orderField ).toBeInTheDocument();
			expect( authorField ).toBeInTheDocument();
		} );

		it( 'should render custom Edit component', async () => {
			const fieldsWithTitleCustomEditComponent = fields.map(
				( field ) => {
					if ( field.id === 'title' ) {
						return {
							...field,
							Edit: () => {
								return <span>This is the Title Field</span>;
							},
						};
					}
					return field;
				}
			);

			render(
				<Dataform
					onChange={ noop }
					fields={ fieldsWithTitleCustomEditComponent }
					form={ formPanelMode }
					data={ data }
				/>
			);

			const titleField = screen.getByText( data.title );
			const user = await userEvent.setup();
			await user.click( titleField );
			const titleEditField = screen.getByText(
				'This is the Title Field'
			);
			expect( titleEditField ).toBeInTheDocument();
		} );
	} );

	describe( 'in modal mode', () => {
		const formModalMode = {
			...form,
			type: 'modal' as const,
		};
		it( 'should display fields', async () => {
			render(
				<Dataform
					onChange={ noop }
					fields={ fieldsWithRender }
					form={ formModalMode }
					data={ data }
				/>
			);

			// In modal mode, the fields are displayed as buttons
			expect(
				screen.getByRole( 'button', { name: 'Hello World' } )
			).toBeInTheDocument();
			expect(
				screen.getByRole( 'button', { name: '1' } )
			).toBeInTheDocument();
			expect(
				screen.getByRole( 'button', { name: 'Jane' } )
			).toBeInTheDocument();
		} );

		it( 'should call onChange with final value when Apply is clicked', async () => {
			const onChange = jest.fn();
			render(
				<Dataform
					onChange={ onChange }
					fields={ fieldsWithRender }
					form={ formModalMode }
					data={ { ...data, title: '' } }
				/>
			);

			const titleButton = modalFieldsSelector.title.view();
			const user = await userEvent.setup();
			await user.click( titleButton );
			const input = modalFieldsSelector.title.edit();
			expect( input ).toHaveValue( '' );

			// Type a new value
			const newValue = 'Hello folks!';
			await user.type( input, newValue );

			// onChange should not be called during typing (local state only)
			expect( onChange ).not.toHaveBeenCalled();

			// Click Apply to persist changes
			const applyButton = screen.getByRole( 'button', {
				name: /apply/i,
			} );
			await user.click( applyButton );

			// onChange should be called once with the final data (all fields)
			expect( onChange ).toHaveBeenCalledTimes( 1 );
			expect( onChange ).toHaveBeenCalledWith( {
				...data,
				title: newValue,
			} );
		} );

		it( 'should wrap fields in HStack when labelPosition is set to side', async () => {
			const { container } = render(
				<Dataform
					onChange={ noop }
					fields={ fieldsWithRender }
					form={ { ...formModalMode, labelPosition: 'side' } }
					data={ data }
				/>
			);

			expect(
				// eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
				container.querySelectorAll( "[data-wp-component='HStack']" )
			).toHaveLength( 3 );
		} );

		it( 'should render combined fields correctly', async () => {
			const formWithCombinedFields = {
				...formModalMode,
				fields: [
					'order',
					{
						id: 'title',
						children: [ 'title', 'author' ],
						label: "Title and author's name",
					},
				],
			};

			render(
				<Dataform
					onChange={ noop }
					fields={ fieldsWithRender }
					form={ formWithCombinedFields }
					data={ data }
				/>
			);

			const button = screen.getByRole( 'button', {
				name: 'Hello World',
			} );
			const user = await userEvent.setup();
			await user.click( button );
			expect( modalFieldsSelector.title.edit() ).toBeInTheDocument();
			expect( modalFieldsSelector.author.edit() ).toBeInTheDocument();
		} );

		it( 'should render custom render component', async () => {
			const fieldsWithCustomRenderFunction = fields.map( ( field ) => {
				return {
					...field,
					render: () => {
						return <span>This is the { field.id } field</span>;
					},
				};
			} );

			render(
				<Dataform
					onChange={ noop }
					fields={ fieldsWithCustomRenderFunction }
					form={ formModalMode }
					data={ data }
				/>
			);

			const titleField = screen.getByText( 'This is the title field' );
			const orderField = screen.getByText( 'This is the order field' );
			const authorField = screen.getByText( 'This is the author field' );
			expect( titleField ).toBeInTheDocument();
			expect( orderField ).toBeInTheDocument();
			expect( authorField ).toBeInTheDocument();
		} );

		it( 'should render custom Edit component', async () => {
			const fieldsWithTitleCustomEditComponent = fields.map(
				( field ) => {
					if ( field.id === 'title' ) {
						return {
							...field,
							Edit: () => {
								return <span>This is the Title Field</span>;
							},
						};
					}
					return field;
				}
			);

			render(
				<Dataform
					onChange={ noop }
					fields={ fieldsWithTitleCustomEditComponent }
					form={ formModalMode }
					data={ data }
				/>
			);

			// In modal mode, the custom Edit component is rendered inside the modal
			const titleButton = screen.getByRole( 'button', {
				name: 'Hello World',
			} );
			const user = await userEvent.setup();
			await user.click( titleButton );

			// The modal should open and show the custom Edit component
			const titleEditField = screen.getByText(
				'This is the Title Field'
			);
			expect( titleEditField ).toBeInTheDocument();
		} );

		it( 'should close modal when Done button is clicked', async () => {
			render(
				<Dataform
					onChange={ noop }
					fields={ fieldsWithRender }
					form={ formModalMode }
					data={ data }
				/>
			);

			const user = await userEvent.setup();
			const titleButton = modalFieldsSelector.title.view();
			await user.click( titleButton );

			// Modal should be open - check for modal content
			expect( screen.getByRole( 'dialog' ) ).toBeInTheDocument();

			// Click Apply button
			const applyButton = screen.getByRole( 'button', {
				name: /apply/i,
			} );
			await user.click( applyButton );

			// Modal should be closed - check that dialog is not in document
			expect( screen.queryByRole( 'dialog' ) ).not.toBeInTheDocument();
		} );

		it( 'should close modal and cancel changes when Close button is clicked', async () => {
			const onChange = jest.fn();
			render(
				<Dataform
					onChange={ onChange }
					fields={ fieldsWithRender }
					form={ formModalMode }
					data={ data }
				/>
			);

			const user = await userEvent.setup();
			const titleButton = modalFieldsSelector.title.view();
			await user.click( titleButton );

			// Modal should be open - check for modal content
			expect( screen.getByRole( 'dialog' ) ).toBeInTheDocument();

			// Make a change in the modal
			const titleInput = screen.getByRole( 'textbox', {
				name: /title/i,
			} );
			await user.clear( titleInput );
			await user.type( titleInput, 'Modified Title' );

			// Click Close button (use the one in the modal header)
			const closeButtons = screen.getAllByRole( 'button', {
				name: 'Close',
			} );
			// Use the first close button (the one in the modal header)
			await user.click( closeButtons[ 0 ] );

			// Modal should be closed - check that dialog is not in document
			expect( screen.queryByRole( 'dialog' ) ).not.toBeInTheDocument();

			// onChange should not have been called (changes were discarded)
			expect( onChange ).not.toHaveBeenCalled();
		} );

		it( 'should discard changes when Cancel button is clicked', async () => {
			const onChange = jest.fn();
			render(
				<Dataform
					onChange={ onChange }
					fields={ fieldsWithRender }
					form={ formModalMode }
					data={ data }
				/>
			);

			const user = await userEvent.setup();
			const titleButton = modalFieldsSelector.title.view();
			await user.click( titleButton );

			// Modal should be open
			expect( screen.getByRole( 'dialog' ) ).toBeInTheDocument();

			// Make a change in the modal
			const titleInput = screen.getByRole( 'textbox', {
				name: /title/i,
			} );
			await user.clear( titleInput );
			await user.type( titleInput, 'Modified Title' );

			// Click Cancel button
			const cancelButton = screen.getByRole( 'button', {
				name: /cancel/i,
			} );
			await user.click( cancelButton );

			// Modal should be closed
			expect( screen.queryByRole( 'dialog' ) ).not.toBeInTheDocument();

			// onChange should not have been called (changes were discarded)
			expect( onChange ).not.toHaveBeenCalled();
		} );
	} );
} );
