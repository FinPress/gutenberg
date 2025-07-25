document.addEventListener( 'DOMContentLoaded', () => {
	const checkboxes = document.querySelectorAll(
		'[data-todo-list] input[type="checkbox"]'
	);
	const todos = window.todoData.todos;
	checkboxes.forEach( ( checkbox ) => {
		checkbox.addEventListener( 'change', () => {
			const index = checkbox.dataset.index;
			todos[ index ].completed = checkbox.checked;
			window.wp.data
				.dispatch( window.wp.coreData.store )
				.saveEntityRecord( 'postType', window.todoData.postType, {
					id: window.todoData.postId,
					meta: { global_todos: todos },
				} );
		} );
	} );
} );
