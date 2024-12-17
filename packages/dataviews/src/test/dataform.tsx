/**
 * External dependencies
 */
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

/**
 * Internal dependencies
 */
import Dataform from '../components/dataform/index';

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

describe( 'DataForm component', () => {
	describe( 'in regular mode', () => {
		it( 'should display fields', () => {
			const { container } = render(
				<Dataform
					onChange={ () => void 0 }
					fields={ fields }
					form={ form }
					data={ data }
				/>
			);

			expect(
				// It is used here to test the number of fields.
				// eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
				container.getElementsByClassName(
					'dataforms-layouts-regular__field'
				)
			).toHaveLength( 3 );
		} );

		it( 'should trigger onChange', async () => {
			const onChange = jest.fn();
			render(
				<Dataform
					onChange={ onChange }
					fields={ fields }
					form={ form }
					data={ { ...data, title: '' } }
				/>
			);

			const titleInput = screen.getByRole( 'textbox', {
				name: 'Title',
			} );
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
					onChange={ () => void 0 }
					fields={ fields }
					form={ { ...form, labelPosition: 'side' } }
					data={ data }
				/>
			);

			expect(
				// It is used here to ensure that the fields are wrapped in HStack. This happens when the labelPosition is set to side.
				// eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
				container.querySelectorAll( "[data-wp-component='HStack']" )
			).toHaveLength( 3 );
		} );

		it( 'should render combineField correctly', async () => {
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
					onChange={ () => void 0 }
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
		it( 'should display fields', () => {
			const { container } = render(
				<Dataform
					onChange={ () => void 0 }
					fields={ fields }
					form={ { ...form, type: 'panel' } }
					data={ data }
				/>
			);

			expect(
				// It is used here to test the number of fields.
				// eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
				container.getElementsByClassName(
					'dataforms-layouts-panel__field'
				)
			).toHaveLength( 3 );
		} );

		it( 'should trigger onChange', async () => {
			const onChange = jest.fn();
			render(
				<Dataform
					onChange={ onChange }
					fields={ fields }
					form={ form }
					data={ { ...data, title: '' } }
				/>
			);

			const titleInput = screen.getByRole( 'textbox', {
				name: 'Title',
			} );
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
					onChange={ () => void 0 }
					fields={ fields }
					form={ { ...form, labelPosition: 'side' } }
					data={ data }
				/>
			);

			expect(
				// eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
				container.querySelectorAll( "[data-wp-component='HStack']" )
			).toHaveLength( 3 );
		} );

		it( 'should render combineField correctly', async () => {
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
					onChange={ () => void 0 }
					fields={ fields }
					form={ formWithCombinedFields }
					data={ data }
				/>
			);

			expect(
				screen.getByText( "Title and author's name" )
			).toBeInTheDocument();
		} );

		it( 'should render view components', async () => {
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
					onChange={ () => void 0 }
					fields={ fieldsWithCustomRenderFunction }
					form={ { ...form, type: 'panel' } }
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

		it( 'should edit component when click on render component', async () => {
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
					onChange={ () => void 0 }
					fields={ fieldsWithCustomRenderFunction }
					form={ { ...form, type: 'panel' } }
					data={ data }
				/>
			);

			const titleField = screen.getByText( 'This is the title field' );
			const noInputElement = screen.queryByRole( 'textbox' );
			await expect( noInputElement ).not.toBeInTheDocument();
			const user = await userEvent.setup();
			await user.click( titleField );
			const inputElement = screen.getByRole( 'textbox' );
			expect( inputElement ).toBeVisible();
		} );
	} );
} );
