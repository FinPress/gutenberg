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

		it( 'should use dropdown panel type by default', async () => {
			render(
				<Dataform
					onChange={ noop }
					fields={ fields }
					form={ formPanelMode }
					data={ data }
				/>
			);

			const user = await userEvent.setup();
			const titleButton = fieldsSelector.title.view();
			await user.click( titleButton );

			// Should show dropdown content (not modal)
			expect(
				screen.getByRole( 'textbox', { name: /title/i } )
			).toBeInTheDocument();
			// Should not have modal dialog
			expect( screen.queryByRole( 'dialog' ) ).not.toBeInTheDocument();
			// Should not have modal buttons (Cancel/Apply)
			expect(
				screen.queryByRole( 'button', { name: /cancel/i } )
			).not.toBeInTheDocument();
			expect(
				screen.queryByRole( 'button', { name: /apply/i } )
			).not.toBeInTheDocument();
		} );

		it( 'should use dropdown panel type when explicitly set', async () => {
			const formWithDropdownPanel = {
				...form,
				layout: {
					type: 'panel',
					labelPosition: 'side',
					openAs: 'dropdown',
				} as const,
			};

			render(
				<Dataform
					onChange={ noop }
					fields={ fields }
					form={ formWithDropdownPanel }
					data={ data }
				/>
			);

			const user = await userEvent.setup();
			const titleButton = fieldsSelector.title.view();
			await user.click( titleButton );

			// Should show dropdown content
			expect(
				screen.getByRole( 'textbox', { name: /title/i } )
			).toBeInTheDocument();
		} );

		it( 'should use modal panel type when set', async () => {
			const formWithModalPanel = {
				...form,
				layout: {
					type: 'panel',
					labelPosition: 'side',
					openAs: 'modal',
				} as const,
			};

			render(
				<Dataform
					onChange={ noop }
					fields={ fields }
					form={ formWithModalPanel }
					data={ data }
				/>
			);

			const user = await userEvent.setup();
			const titleButton = fieldsSelector.title.view();
			await user.click( titleButton );

			// Should show modal content
			expect( screen.getByRole( 'dialog' ) ).toBeInTheDocument();
			expect(
				screen.getByRole( 'textbox', { name: /title/i } )
			).toBeInTheDocument();
		} );

		it( 'should close modal when cancel button is clicked', async () => {
			const formWithModalPanel = {
				...form,
				layout: {
					type: 'panel',
					labelPosition: 'side',
					openAs: 'modal',
				} as const,
			};

			render(
				<Dataform
					onChange={ noop }
					fields={ fields }
					form={ formWithModalPanel }
					data={ data }
				/>
			);

			const user = await userEvent.setup();
			const titleButton = fieldsSelector.title.view();
			await user.click( titleButton );

			// Modal should be open
			expect( screen.getByRole( 'dialog' ) ).toBeInTheDocument();

			// Click cancel button
			const cancelButton = screen.getByRole( 'button', {
				name: /cancel/i,
			} );
			await user.click( cancelButton );

			// Modal should be closed
			expect( screen.queryByRole( 'dialog' ) ).not.toBeInTheDocument();
		} );

		it( 'should apply changes and close modal when apply button is clicked', async () => {
			const onChange = jest.fn();
			const formWithModalPanel = {
				...form,
				layout: {
					type: 'panel',
					labelPosition: 'side',
					openAs: 'modal',
				} as const,
			};

			render(
				<Dataform
					onChange={ onChange }
					fields={ fields }
					form={ formWithModalPanel }
					data={ data }
				/>
			);

			const user = await userEvent.setup();
			const titleButton = fieldsSelector.title.view();
			await user.click( titleButton );

			// Modal should be open
			expect( screen.getByRole( 'dialog' ) ).toBeInTheDocument();

			// Type in the input
			const titleInput = screen.getByRole( 'textbox', {
				name: /title/i,
			} );
			await user.clear( titleInput );
			await user.type( titleInput, 'New Title' );

			// Click apply button
			const applyButton = screen.getByRole( 'button', {
				name: /apply/i,
			} );
			await user.click( applyButton );

			// Modal should be closed and onChange should be called
			expect( screen.queryByRole( 'dialog' ) ).not.toBeInTheDocument();
			expect( onChange ).toHaveBeenCalledWith( { title: 'New Title' } );
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

		it( 'should handle getValue functions correctly in modal mode', async () => {
			const onChange = jest.fn();

			render(
				<Dataform
					// Data with nested structure
					data={ {
						user: {
							profile: {
								email: 'user@example.com',
							},
						},
						settings: {
							status: 'active',
						},
					} }
					// Fields with getValue functions - text and select types
					fields={ [
						{
							id: 'user/email',
							label: 'User Email',
							type: 'text',
							getValue: ( { item } ) => item.user.profile.email,
						},
						{
							id: 'settings/status',
							label: 'Status',
							type: 'integer',
							elements: [
								{ value: 'active', label: 'Active' },
								{ value: 'inactive', label: 'Inactive' },
							],
							getValue: ( { item } ) => item.settings.status,
						},
					] }
					form={ {
						fields: [
							{
								id: 'user-settings',
								children: [ 'user/email', 'settings/status' ],
								label: 'User Settings',
							},
						],
						layout: {
							type: 'panel',
							openAs: 'modal',
						},
					} }
					onChange={ onChange }
				/>
			);

			const user = userEvent.setup();

			// Open the modal
			const settingsButton = screen.getByRole( 'button', {
				name: /edit user settings/i,
			} );
			await user.click( settingsButton );

			// Modal should be open
			expect( screen.getByRole( 'dialog' ) ).toBeInTheDocument();

			// Find the inputs in the modal
			const emailInput = screen.getByRole( 'textbox', {
				name: /user email/i,
			} );
			const statusSelect = screen.getByRole( 'combobox', {
				name: /status/i,
			} );

			// Check if inputs show correct extracted values
			expect( emailInput ).toHaveValue( 'user@example.com' );
			expect( statusSelect ).toHaveValue( 'active' );

			// Edit both inputs
			await user.clear( emailInput );
			await user.type( emailInput, 'new@example.com' );
			await user.selectOptions( statusSelect, 'inactive' );

			// Inputs should show the new values
			expect( emailInput ).toHaveValue( 'new@example.com' );
			expect( statusSelect ).toHaveValue( 'inactive' );

			// Click apply button
			const applyButton = screen.getByRole( 'button', {
				name: /apply/i,
			} );
			await user.click( applyButton );

			// Modal should be closed
			expect( screen.queryByRole( 'dialog' ) ).not.toBeInTheDocument();

			// onChange should be called with flat structure
			expect( onChange ).toHaveBeenCalledWith(
				{
					'user/email': 'new@example.com',
					'settings/status': 'inactive',
				},
				{ isValid: true }
			);
		} );

		it( 'should handle cancel button correctly in modal with getValue functions', async () => {
			const onChange = jest.fn();

			render(
				<Dataform
					data={ {
						billing: {
							email: 'billing@example.com',
						},
					} }
					fields={ [
						{
							id: 'billing/email',
							label: 'Billing Email',
							type: 'text',
							getValue: ( { item } ) => item.billing.email,
						},
					] }
					form={ {
						fields: [ 'billing/email' ],
						layout: {
							type: 'panel',
							openAs: 'modal',
						},
					} }
					onChange={ onChange }
				/>
			);

			const user = userEvent.setup();

			const editButton = screen.getByRole( 'button', {
				name: /edit billing email/i,
			} );
			await user.click( editButton );

			// Modal should be open
			expect( screen.getByRole( 'dialog' ) ).toBeInTheDocument();

			const emailInput = screen.getByRole( 'textbox', {
				name: /billing email/i,
			} );

			// Check initial value
			expect( emailInput ).toHaveValue( 'billing@example.com' );

			// Edit the input
			await user.clear( emailInput );
			await user.type( emailInput, 'changed@example.com' );
			expect( emailInput ).toHaveValue( 'changed@example.com' );

			// Click cancel button
			const cancelButton = screen.getByRole( 'button', {
				name: /cancel/i,
			} );
			await user.click( cancelButton );

			// Modal should be closed
			expect( screen.queryByRole( 'dialog' ) ).not.toBeInTheDocument();

			// onChange should NOT have been called
			expect( onChange ).not.toHaveBeenCalled();
		} );
	} );
} );
