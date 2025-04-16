/**
 * External dependencies
 */
import clsx from 'clsx';
import {
	useFloating,
	autoUpdate,
	offset as offsetMiddleware,
} from '@floating-ui/react-dom';

/**
 * WordPress dependencies
 */
import { useState, RawHTML, useRef, useEffect } from '@wordpress/element';
import {
	__experimentalHStack as HStack,
	__experimentalVStack as VStack,
	__experimentalConfirmDialog as ConfirmDialog,
	Button,
	DropdownMenu,
	Tooltip,
} from '@wordpress/components';
import { Icon, check, published, moreVertical } from '@wordpress/icons';
import { __, _x, sprintf } from '@wordpress/i18n';
import { useDispatch, useSelect } from '@wordpress/data';
import {
	store as blockEditorStore,
	privateApis as blockEditorPrivateApis,
} from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import CommentAuthorInfo from './comment-author-info';
import CommentForm from './comment-form';
import { unlock } from '../../lock-unlock';
import { AddComment } from './add-comment';

const { useBlockElementRef } = unlock( blockEditorPrivateApis );

/**
 * Renders the Comments component.
 *
 * @param {Object}   props                  - The component props.
 * @param {Array}    props.threads          - The array of comment threads.
 * @param {Function} props.onEditComment    - The function to handle comment editing.
 * @param {Function} props.onAddReply       - The function to add a reply to a comment.
 * @param {Function} props.onCommentDelete  - The function to delete a comment.
 * @param {Function} props.onCommentResolve - The function to mark a comment as resolved.
 * @param {boolean}  props.activeComment    - Active comment board id.
 * @param {Function} props.setActiveComment - The function to set the active comment.
 * @param {boolean}  props.canvasSidebar    - Whether is this canvas sidebar or not.
 * @param {Function} props.setIsNewComment  - The function to set the new comment board visibility.
 * @param {boolean}  props.isNewComment     - Whether to show the new comment board.
 * @return {React.ReactNode} The rendered Comments component.
 */
export function Comments( {
	threads,
	onEditComment,
	onAddReply,
	onCommentDelete,
	onCommentResolve,
	activeComment,
	setActiveComment,
	canvasSidebar,
	isNewComment,
	setIsNewComment,
} ) {
	const [ heights, setHeights ] = useState( {} );

	const updateHeight = ( id, newHeight ) => {
		setHeights( ( prev ) => {
			if ( prev[ id ] !== newHeight ) {
				return { ...prev, [ id ]: newHeight };
			}
			return prev;
		} );
	};

	const { blockCommentId, selectedBlockClientId } = useSelect( ( select ) => {
		const { getBlockAttributes, getSelectedBlockClientId } =
			select( blockEditorStore );
		const _clientId = getSelectedBlockClientId();

		return {
			blockCommentId: _clientId
				? getBlockAttributes( _clientId )?.blockCommentId
				: null,
			selectedBlockClientId: _clientId,
		};
	}, [] );

	// Object to store offsets for each board.
	const offsetsRef = useRef( {} );

	const updateOffsets = ( id, offset ) => {
		offsetsRef.current[ id ] = offset;
	};

	const clearThreadFocus = () => {
		setActiveComment( null );
	};

	const ParentWrapper = canvasSidebar ? ThreadWrapper : VStack;

	const { selectBlock } = useDispatch( blockEditorStore );
	const handleThreadClick = ( thread ) => {
		if ( thread?.clientId ) {
			selectBlock( thread.clientId ); // Use the action to select the block
		}
		setActiveComment( thread.id );
	};

	return (
		<>
			{
				// If there are no comments, show a message indicating no comments are available.
				( ! Array.isArray( threads ) || threads.length === 0 ) && (
					<VStack
						alignment="left"
						className="editor-collab-sidebar-panel__thread"
						justify="flex-start"
						spacing="3"
					>
						{
							// translators: message displayed when there are no comments available
							__( 'No comments available' )
						}
					</VStack>
				)
			}
			{ isNewComment && (
				<ParentWrapper
					thread={ {
						id: 'new-comment',
						clientId: selectedBlockClientId,
					} }
					spacing="3"
					className={ clsx( 'editor-collab-sidebar-panel__thread', {
						'editor-collab-sidebar-panel__active-thread': true,
						'editor-collab-sidebar-panel__focus-thread': true,
					} ) }
					offsetsRef={ offsetsRef }
					updateOffsets={ updateOffsets }
					updateHeight={ updateHeight }
					heights={ heights }
				>
					<AddComment
						onSubmit={ onAddReply }
						setIsNewComment={ setIsNewComment }
					/>
				</ParentWrapper>
			) }
			{ Array.isArray( threads ) &&
				threads.length > 0 &&
				threads.map( ( thread, index ) => (
					<ParentWrapper
						key={ thread.id }
						id={ thread.id }
						thread={ thread }
						spacing="3"
						className={ clsx(
							'editor-collab-sidebar-panel__thread',
							{
								'editor-collab-sidebar-panel__active-thread':
									blockCommentId &&
									blockCommentId === thread.id,
								'editor-collab-sidebar-panel__focus-thread':
									activeComment &&
									activeComment === thread.id,
							}
						) }
						onClick={ () => handleThreadClick( thread ) }
						offsetsRef={ offsetsRef }
						updateOffsets={ updateOffsets }
						previousThreadId={ threads[ index - 1 ]?.id }
						updateHeight={ updateHeight }
						heights={ heights }
					>
						<Thread
							thread={ thread }
							onAddReply={ onAddReply }
							onCommentDelete={ onCommentDelete }
							onCommentResolve={ onCommentResolve }
							onEditComment={ onEditComment }
							isFocused={ activeComment === thread.id }
							clearThreadFocus={ clearThreadFocus }
						/>
					</ParentWrapper>
				) ) }
		</>
	);
}

function Thread( {
	thread,
	onEditComment,
	onAddReply,
	onCommentDelete,
	onCommentResolve,
	isFocused,
	clearThreadFocus,
} ) {
	return (
		<>
			<CommentBoard
				thread={ thread }
				onResolve={ onCommentResolve }
				onEdit={ onEditComment }
				onDelete={ onCommentDelete }
				status={ thread.status }
			/>
			{ 0 < thread?.reply?.length && (
				<>
					{ ! isFocused && (
						<VStack className="editor-collab-sidebar-panel__show-more-reply">
							{ sprintf(
								// translators: 1: number of replies.
								_x(
									'%s more replies..',
									'Show replies button'
								),
								thread?.reply?.length
							) }
						</VStack>
					) }

					{ isFocused &&
						thread.reply.map( ( reply ) => (
							<VStack
								key={ reply.id }
								className="editor-collab-sidebar-panel__child-thread"
								id={ reply.id }
								spacing="2"
							>
								{ 'approved' !== thread.status && (
									<CommentBoard
										thread={ reply }
										onEdit={ onEditComment }
										onDelete={ onCommentDelete }
									/>
								) }
								{ 'approved' === thread.status && (
									<CommentBoard thread={ reply } />
								) }
							</VStack>
						) ) }
				</>
			) }
			{ 'approved' !== thread.status && isFocused && (
				<VStack
					className="editor-collab-sidebar-panel__child-thread"
					spacing="2"
				>
					<HStack alignment="left" spacing="3" justify="flex-start">
						<CommentAuthorInfo />
					</HStack>
					<VStack
						spacing="3"
						className="editor-collab-sidebar-panel__comment-field"
					>
						<CommentForm
							onSubmit={ ( inputComment ) => {
								onAddReply( inputComment, thread.id );
							} }
							onCancel={ ( event ) => {
								event.stopPropagation(); // Prevent the parent onClick from being triggered
								clearThreadFocus();
							} }
							submitButtonText={ _x(
								'Reply',
								'Add reply comment'
							) }
						/>
					</VStack>
				</VStack>
			) }
		</>
	);
}

const CommentBoard = ( { thread, onResolve, onEdit, onDelete, status } ) => {
	const [ actionState, setActionState ] = useState( false );
	const [ showConfirmDialog, setShowConfirmDialog ] = useState( false );

	const handleConfirmDelete = () => {
		onDelete( thread.id );
		setActionState( false );
		setShowConfirmDialog( false );
	};

	const handleConfirmResolve = () => {
		onResolve( thread.id );
		setActionState( false );
		setShowConfirmDialog( false );
	};

	const handleCancel = () => {
		setActionState( false );
		setShowConfirmDialog( false );
	};

	const actions = [
		onEdit && {
			title: _x( 'Edit', 'Edit comment' ),
			onClick: () => {
				setActionState( 'edit' );
			},
		},
		onDelete && {
			title: _x( 'Delete', 'Delete comment' ),
			onClick: () => {
				setActionState( 'delete' );
				setShowConfirmDialog( true );
			},
		},
	];

	const moreActions = actions.filter( ( item ) => item?.onClick );

	return (
		<>
			<HStack alignment="left" spacing="3" justify="flex-start">
				<CommentAuthorInfo
					avatar={ thread?.author_avatar_urls?.[ 48 ] }
					name={ thread?.author_name }
					date={ thread?.date }
				/>
				<span className="editor-collab-sidebar-panel__comment-status">
					{ status !== 'approved' && (
						<HStack
							alignment="right"
							justify="flex-end"
							spacing="0"
						>
							{ 0 === thread?.parent && onResolve && (
								<Button
									label={ _x(
										'Resolve',
										'Mark comment as resolved'
									) }
									__next40pxDefaultSize
									icon={ published }
									onClick={ () => {
										setActionState( 'resolve' );
										setShowConfirmDialog( true );
									} }
									showTooltip
								/>
							) }
							{ 0 < moreActions.length && (
								<DropdownMenu
									icon={ moreVertical }
									label={ _x(
										'Select an action',
										'Select comment action'
									) }
									className="editor-collab-sidebar-panel__comment-dropdown-menu"
									controls={ moreActions }
								/>
							) }
						</HStack>
					) }
					{ status === 'approved' && (
						// translators: tooltip for resolved comment
						<Tooltip text={ __( 'Resolved' ) }>
							<Icon icon={ check } />
						</Tooltip>
					) }
				</span>
			</HStack>
			<HStack
				alignment="left"
				spacing="3"
				justify="flex-start"
				className="editor-collab-sidebar-panel__user-comment"
			>
				<VStack
					spacing="3"
					className="editor-collab-sidebar-panel__comment-field"
				>
					{ 'edit' === actionState && (
						<CommentForm
							onSubmit={ ( value ) => {
								onEdit( thread.id, value );
								setActionState( false );
							} }
							onCancel={ () => handleCancel() }
							thread={ thread }
							submitButtonText={ _x( 'Update', 'verb' ) }
						/>
					) }
					{ 'edit' !== actionState && (
						<RawHTML>{ thread?.content?.raw }</RawHTML>
					) }
				</VStack>
			</HStack>
			{ 'resolve' === actionState && (
				<ConfirmDialog
					isOpen={ showConfirmDialog }
					onConfirm={ handleConfirmResolve }
					onCancel={ handleCancel }
					confirmButtonText="Yes"
					cancelButtonText="No"
				>
					{
						// translators: message displayed when confirming an action
						__(
							'Are you sure you want to mark this comment as resolved?'
						)
					}
				</ConfirmDialog>
			) }
			{ 'delete' === actionState && (
				<ConfirmDialog
					isOpen={ showConfirmDialog }
					onConfirm={ handleConfirmDelete }
					onCancel={ handleCancel }
					confirmButtonText="Yes"
					cancelButtonText="No"
				>
					{
						// translators: message displayed when confirming an action
						__( 'Are you sure you want to delete this comment?' )
					}
				</ConfirmDialog>
			) }
		</>
	);
};

const ThreadWrapper = ( {
	children,
	thread,
	className,
	onClick,
	offsetsRef,
	updateOffsets,
	previousThreadId,
	updateHeight,
	heights,
} ) => {
	const blockRef = useRef();
	useBlockElementRef( thread.clientId, blockRef );

	const selectedBlockElementRect = blockRef.current?.getBoundingClientRect();

	const initialOffsetTop = selectedBlockElementRect?.top;

	const previousOffset = previousThreadId
		? offsetsRef.current[ previousThreadId ]
		: 0;

	const previousBoardHeight = heights[ previousThreadId ];

	const calculateOffset = () => {
		if (
			previousOffset &&
			initialOffsetTop < previousOffset + previousBoardHeight
		) {
			return previousOffset - initialOffsetTop + previousBoardHeight + 20;
		}
		return 0;
	};

	const { y, refs } = useFloating( {
		placement: 'right-start',
		middleware: [
			offsetMiddleware( {
				crossAxis: calculateOffset(),
			} ),
		],
		whileElementsMounted: autoUpdate,
	} );

	useEffect( () => {
		if ( blockRef.current ) {
			refs.setReference( blockRef.current ); // Bind reference element
		}
	}, [ blockRef, refs ] );

	useEffect( () => {
		if ( y !== null && y !== 0 ) {
			updateOffsets( thread.id, y, refs.floating?.current?.clientHeight ); // Pass the offset to the parent
		}
	}, [ y, updateOffsets ] );

	useEffect( () => {
		if ( refs.floating?.current ) {
			const newHeight = refs.floating?.current.scrollHeight;
			updateHeight( thread.id, newHeight );
		}
	}, [ thread.id, updateHeight ] );

	return (
		<VStack
			ref={ refs.setFloating }
			className={ className }
			spacing="3"
			onClick={ onClick }
			style={ {
				top: y,
			} }
		>
			{ children }
		</VStack>
	);
};
