/**
 * WordPress dependencies
 */
import {
	useBlockProps,
	InspectorControls,
	RichText,
	ColorPalette,
} from '@wordpress/block-editor';
import {
	PanelBody,
	CheckboxControl,
	Button,
	TextControl,
	ToggleControl,
	Tooltip,
	PanelRow,
	SelectControl,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { useEntityProp } from '@wordpress/core-data';

export default function TodoEdit( { attributes, setAttributes, context } ) {
	const postId = context.postId;
	const { allowedRoles, isGlobal } = attributes;
	const [ newTodo, setNewTodo ] = useState( '' );
	const [ meta, setMeta ] = useEntityProp(
		'postType',
		context.postType,
		'meta',
		postId
	);
	const todos = meta?.global_todos || [];

	const roles = [
		{ slug: 'all', name: __( 'All Users' ) },
		{ slug: 'administrator', name: __( 'Administrator' ) },
		{ slug: 'editor', name: __( 'Editor' ) },
		{ slug: 'author', name: __( 'Author' ) },
		{ slug: 'contributor', name: __( 'Contributor' ) },
		{ slug: 'subscriber', name: __( 'Subscriber' ) },
	];

	const sizeOptions = [
		{ label: __( 'X-Small' ), value: '12px' },
		{ label: __( 'Small' ), value: '14px' },
		{ label: __( 'Medium' ), value: '16px' },
		{ label: __( 'Large' ), value: '20px' },
		{ label: __( 'X-Large' ), value: '24px' },
	];

	const checkboxSize = attributes.checkboxSize;

	const setisGlobal = () => {
		if ( ! isGlobal ) {
			const updated = allowedRoles.filter( ( r ) => r !== 'subscriber' );
			setAttributes( { allowedRoles: updated } );
		}
		setAttributes( { isGlobal: ! isGlobal } );
	};

	const addTodo = () => {
		if ( newTodo.trim() === '' ) {
			return;
		}
		setAttributes( {
			todos: [ ...todos, { text: newTodo, completed: false } ],
		} );
		const newTodos = [ ...todos, { text: newTodo, completed: false } ];
		setMeta( { ...( meta || {} ), global_todos: newTodos } );
		setNewTodo( '' );
	};

	const updateTodo = ( index, updatedTodo ) => {
		const updatedTodos = [ ...todos ];
		updatedTodos[ index ] = updatedTodo;
		setAttributes( { todos: updatedTodos } );
		setMeta( { ...( meta || {} ), global_todos: updatedTodos } );
	};

	const removeTodo = ( index ) => {
		const updatedTodos = todos.filter( ( _, i ) => i !== index );
		setAttributes( { todos: updatedTodos } );
		setMeta( { ...( meta || {} ), global_todos: updatedTodos } );
	};

	const moveTodo = ( fromIndex, toIndex ) => {
		const updatedTodos = [ ...todos ];
		const [ movedTodo ] = updatedTodos.splice( fromIndex, 1 );
		updatedTodos.splice( toIndex, 0, movedTodo );
		setAttributes( { todos: updatedTodos } );
		setMeta( { ...( meta || {} ), global_todos: updatedTodos } );
	};

	const toggleRole = ( role ) => {
		let updated;
		if ( role === 'all' ) {
			const allRoles = roles.map( ( r ) => r.slug );
			const isAllSelected = allowedRoles.includes( 'all' );
			updated = isAllSelected ? [] : allRoles;
		} else {
			const newRoles = allowedRoles.includes( role )
				? allowedRoles.filter( ( r ) => r !== role )
				: [ ...allowedRoles, role ];

			const allIndividual = roles
				.map( ( r ) => r.slug )
				.filter( ( slug ) => slug !== 'all' );

			const areAllSelected = allIndividual.every( ( r ) =>
				newRoles.includes( r )
			);

			updated = areAllSelected
				? allIndividual
				: newRoles.filter( ( r ) => r !== 'all' );
		}
		if ( isGlobal ) {
			updated = updated.filter( ( r ) => r !== 'subscriber' );
		}
		setAttributes( { allowedRoles: updated } );
	};

	const controls = (
		<InspectorControls>
			<PanelBody title={ __( 'Settings' ) } initialOpen>
				<PanelRow>
					<strong>
						{ __( 'Roles that can check or uncheck todos' ) }
					</strong>
				</PanelRow>
				{ roles.map( ( role ) => (
					<CheckboxControl
						key={ role.slug }
						label={ role.name }
						checked={ allowedRoles.includes( role.slug ) }
						onChange={ () => toggleRole( role.slug ) }
						help={
							role.slug === 'all'
								? __( 'Includes custom roles' )
								: ''
						}
						disabled={ isGlobal && role.slug === 'subscriber' }
						__nextHasNoMarginBottom
					/>
				) ) }
				<PanelRow>
					<strong>{ __( 'Todo Syncing' ) }</strong>
				</PanelRow>
				<Tooltip
					text={
						isGlobal
							? __(
									'When disabled, checkboxes are saved privately for each user.'
							  )
							: __(
									'When enabled, checkbox states are synced across all users. Only users who can edit this post can modify them.'
							  )
					}
				>
					<div>
						<ToggleControl
							checked={ isGlobal }
							onChange={ setisGlobal }
							label={ __( 'Sync globally' ) }
							__nextHasNoMarginBottom
							help={ __(
								'Changing this after publishing may result in loss of progress.'
							) }
						/>
					</div>
				</Tooltip>
				<PanelRow>
					<strong>{ __( 'Checkbox Color' ) }</strong>
				</PanelRow>
				<PanelRow>
					<ColorPalette
						value={ attributes.checkboxColor }
						onChange={ ( color ) =>
							setAttributes( { checkboxColor: color } )
						}
					/>
				</PanelRow>
				<SelectControl
					label={ __( 'Checkbox Size' ) }
					value={ attributes.checkboxSize }
					options={ sizeOptions }
					onChange={ ( value ) =>
						setAttributes( { checkboxSize: value } )
					}
					__next40pxDefaultSize
					__nextHasNoMarginBottom
					size="__unstable-large"
				/>
			</PanelBody>
		</InspectorControls>
	);

	return (
		<>
			{ controls }
			<div { ...useBlockProps() }>
				<div className="todo-list">
					{ todos.map( ( todo, index ) => (
						<div key={ index }>
							<input
								className="todo-checkbox"
								type="checkbox"
								checked={ todo.completed }
								onChange={ () =>
									updateTodo( index, {
										...todo,
										completed: ! todo.completed,
									} )
								}
								style={ {
									accentColor: attributes.checkboxColor,
									width: checkboxSize,
									height: checkboxSize,
								} }
							/>
							<RichText
								tagName="span"
								className="todo-text"
								value={ todo.text }
								onChange={ ( text ) =>
									updateTodo( index, {
										...todo,
										text,
									} )
								}
								placeholder={ __( 'Write todo…' ) }
								aria-label={ __( 'Todo text' ) }
							/>
							<Button
								onClick={ () => moveTodo( index, index - 1 ) }
								disabled={ index === 0 }
								className="move-todo"
								accessibleWhenDisabled
								__next40pxDefaultSize
							>
								↑
							</Button>
							<Button
								onClick={ () => moveTodo( index, index + 1 ) }
								disabled={ index === todos.length - 1 }
								className="move-todo"
								accessibleWhenDisabled
								__next40pxDefaultSize
							>
								↓
							</Button>
							<Button
								onClick={ () => removeTodo( index ) }
								className="remove-todo"
								isDestructive
								__next40pxDefaultSize
							>
								×
							</Button>
						</div>
					) ) }
				</div>
				<div className="add-todo">
					<TextControl
						value={ newTodo }
						onChange={ setNewTodo }
						placeholder={ __( 'New todo' ) }
						__nextHasNoMarginBottom
						__next40pxDefaultSize
					/>
					<Button
						onClick={ addTodo }
						variant="primary"
						__next40pxDefaultSize
						accessibleWhenDisabled
					>
						{ __( 'Add' ) }
					</Button>
				</div>
			</div>
		</>
	);
}
