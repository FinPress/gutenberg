# Block Lock

The `Block Lock` module provides UI components and hooks for managing block locking in the WordPress editor. This includes locking block movement, editing, and removal.

## Components

### `BlockLockMenuItem`
A menu item component that allows users to lock or unlock a block via a modal.

#### Props
- `clientId` (string): The unique identifier of the block.

### `BlockLockModal`
A modal component that provides detailed lock options for a block.

#### Props
- `clientId` (string): The unique identifier of the block.
- `onClose` (function): Callback function triggered when the modal is closed.

### `BlockLockToolbar`
A toolbar button component that provides a lock/unlock button for a block.

#### Props
- `clientId` (string): The unique identifier of the block.

## Hook

### `useBlockLock`
A custom hook that returns lock status and permissions for a given block.

#### Parameters
- `clientId` (string): The unique identifier of the block.

#### Returns
An object containing:
- `canEdit` (boolean): Whether the block can be edited.
- `canMove` (boolean): Whether the block can be moved.
- `canRemove` (boolean): Whether the block can be removed.
- `canLock` (boolean): Whether the block can be locked.
- `isContentLocked` (boolean): Whether the block's content is locked.
- `isLocked` (boolean): Whether the block is fully locked.

## Usage

```jsx
import { BlockLockMenuItem, BlockLockToolbar } from 'path-to-block-lock';

function MyBlockControls( { clientId } ) {
    return (
        <>
            <BlockLockToolbar clientId={ clientId } />
            <BlockLockMenuItem clientId={ clientId } />
        </>
    );
}
```

## Implementation Details
- The `BlockLockMenuItem` and `BlockLockToolbar` components toggle the `BlockLockModal`.
- The modal allows users to specify which lock features to apply.
- The `useBlockLock` hook determines the lock state and permissions based on the block's settings and editor state.

This module enhances block editing control by allowing users to enforce restrictions on movement, editing, and removal.

