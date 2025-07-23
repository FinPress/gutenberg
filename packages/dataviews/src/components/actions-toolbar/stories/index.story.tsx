/**
 * External dependencies
 */
import type { Meta, StoryFn } from '@storybook/react';

/**
 * WordPress dependencies
 */
import {
	Button,
	__experimentalVStack as VStack,
	__experimentalHStack as HStack,
	__experimentalText as Text,
} from '@wordpress/components';
import { useState } from '@wordpress/element';
import { trash, edit, copy, seen, backup } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import ActionsToolbar from '../index';
import type { Action } from '../../../types';

import './style.story.css';

const meta = {
	title: 'DataViews/ActionsToolbar',
	component: ActionsToolbar,
	parameters: {
		docs: {
			description: {
				component: `
ActionsToolbar is a standalone component that renders a row of action buttons.
It allows you to reuse DataViews actions outside of the DataViews component itself.

**Key Features:**
- Handles both callback and modal-based actions
- Filters actions based on item eligibility
- Works with any DataViews Action objects
				`,
			},
		},
	},
	argTypes: {
		className: {
			control: 'text',
			description: 'Additional CSS class name',
		},
		showLabels: {
			control: 'boolean',
			description: 'Whether to show text labels instead of icons',
		},
	},
} as Meta< typeof ActionsToolbar >;

export default meta;

// Sample data types
interface Post {
	id: number;
	title: string;
	status: 'published' | 'draft' | 'trash';
	author: string;
	canEdit: boolean;
}

interface SpaceObject {
	id: number;
	title: string;
	description: string;
	type: string;
	isPlanet: boolean;
	satellites: number;
}

// Sample data
const samplePosts: Post[] = [
	{
		id: 1,
		title: 'Hello World',
		status: 'published',
		author: 'admin',
		canEdit: true,
	},
	{
		id: 2,
		title: 'Draft Post',
		status: 'draft',
		author: 'editor',
		canEdit: true,
	},
	{
		id: 3,
		title: 'Trashed Post',
		status: 'trash',
		author: 'admin',
		canEdit: false,
	},
];

const sampleSpaceObjects: SpaceObject[] = [
	{
		id: 1,
		title: 'Moon',
		description: "Earth's satellite",
		type: 'Satellite',
		isPlanet: false,
		satellites: 0,
	},
	{
		id: 2,
		title: 'Neptune',
		description: 'Ice giant in the Solar system',
		type: 'Ice giant',
		isPlanet: true,
		satellites: 16,
	},
];

// Sample actions for posts
const postActions: Action< Post >[] = [
	{
		id: 'view',
		label: 'View',
		icon: seen,
		callback: ( items ) => {
			// eslint-disable-next-line no-alert
			alert( `Viewing: ${ items.map( ( p ) => p.title ).join( ', ' ) }` );
		},
		isEligible: ( item ) => item.status === 'published',
	},
	{
		id: 'edit',
		label: 'Edit',
		icon: edit,
		isPrimary: true,
		callback: ( items ) => {
			// eslint-disable-next-line no-alert
			alert( `Editing: ${ items.map( ( p ) => p.title ).join( ', ' ) }` );
		},
		isEligible: ( item ) => item.canEdit,
	},
	{
		id: 'duplicate',
		label: 'Duplicate',
		icon: copy,
		callback: ( items ) => {
			// eslint-disable-next-line no-alert
			alert(
				`Duplicating: ${ items.map( ( p ) => p.title ).join( ', ' ) }`
			);
		},
		isEligible: ( item ) => item.status !== 'trash',
	},
	{
		id: 'delete',
		label: 'Move to Trash',
		icon: trash,
		isDestructive: true,
		hideModalHeader: true,
		RenderModal: ( { items, closeModal } ) => {
			return (
				<VStack spacing="5">
					<Text>
						{ items.length === 1
							? `Are you sure you want to delete "${ items[ 0 ].title }"?`
							: `Are you sure you want to delete ${ items.length } posts?` }
					</Text>
					<HStack justify="right">
						<Button variant="tertiary" onClick={ closeModal }>
							Cancel
						</Button>
						<Button
							variant="primary"
							isDestructive
							onClick={ () => {
								// eslint-disable-next-line no-alert
								alert(
									`Deleted: ${ items
										.map( ( p ) => p.title )
										.join( ', ' ) }`
								);
								closeModal?.();
							} }
						>
							Delete
						</Button>
					</HStack>
				</VStack>
			);
		},
		isEligible: ( item ) => item.status !== 'trash',
	},
	{
		id: 'restore',
		label: 'Restore',
		icon: backup,
		callback: ( items ) => {
			// eslint-disable-next-line no-alert
			alert(
				`Restoring: ${ items.map( ( p ) => p.title ).join( ', ' ) }`
			);
		},
		isEligible: ( item ) => item.status === 'trash',
	},
];

// Sample actions for space objects
const spaceObjectActions: Action< SpaceObject >[] = [
	{
		id: 'edit-object',
		label: 'Edit Details',
		icon: edit,
		isPrimary: true,
		callback: ( items ) => {
			// eslint-disable-next-line no-alert
			alert(
				`Editing: ${ items.map( ( obj ) => obj.title ).join( ', ' ) }`
			);
		},
	},
	{
		id: 'track-orbit',
		label: 'Track Orbit',
		icon: seen,
		callback: ( items ) => {
			// eslint-disable-next-line no-alert
			alert(
				`Tracking orbit of: ${ items
					.map( ( obj ) => obj.title )
					.join( ', ' ) }`
			);
		},
	},
];

// Story: Basic usage
export const Basic: StoryFn< typeof ActionsToolbar > = () => (
	<ActionsToolbar actions={ postActions } item={ samplePosts[ 0 ] } />
);
Basic.parameters = {
	docs: {
		description: {
			story: 'Basic usage with a published post showing available actions.',
		},
	},
};

// Story: Space object actions
export const SpaceObjectActions: StoryFn< typeof ActionsToolbar > = () => (
	<ActionsToolbar
		actions={ spaceObjectActions }
		item={ sampleSpaceObjects[ 0 ] }
	/>
);
SpaceObjectActions.parameters = {
	docs: {
		description: {
			story: 'Example with different data type (space objects) showing how the component works with any Action objects.',
		},
	},
};

// Story: No eligible actions
export const NoEligibleActions: StoryFn< typeof ActionsToolbar > = () => (
	<ActionsToolbar
		actions={ [
			{
				id: 'admin-only',
				label: 'Admin Only Action',
				icon: edit,
				callback: () => {},
				isEligible: () => false, // Never eligible
			},
		] }
		item={ samplePosts[ 0 ] }
	/>
);
NoEligibleActions.parameters = {
	docs: {
		description: {
			story: 'When no actions are eligible for the given items, the component renders nothing.',
		},
	},
};

// Story: With text labels instead of icons
export const WithLabels: StoryFn< typeof ActionsToolbar > = () => (
	<ActionsToolbar
		actions={ postActions.slice( 0, 3 ) }
		item={ samplePosts[ 0 ] }
		showLabels
	/>
);
WithLabels.parameters = {
	docs: {
		description: {
			story: 'Shows text labels instead of icons. Useful when you want more descriptive buttons.',
		},
	},
};

// Story showing how actions change based on item eligibility
export const ActionEligibility: StoryFn< typeof ActionsToolbar > = () => {
	const [ selectedPost, setSelectedPost ] = useState< Post >(
		samplePosts[ 0 ]
	);

	return (
		<VStack spacing={ 4 }>
			<div>
				<strong>Select a post to see available actions:</strong>
				<HStack spacing={ 2 }>
					{ samplePosts.map( ( post ) => (
						<Button
							key={ post.id }
							variant={
								selectedPost.id === post.id
									? 'primary'
									: 'secondary'
							}
							size="compact"
							onClick={ () => setSelectedPost( post ) }
						>
							{ post.title } ({ post.status })
						</Button>
					) ) }
				</HStack>
			</div>

			<div>
				<strong>Available Actions:</strong>
				<ActionsToolbar actions={ postActions } item={ selectedPost } />
			</div>
		</VStack>
	);
};
ActionEligibility.parameters = {
	docs: {
		description: {
			story: 'Interactive example showing how available actions change based on item eligibility. Try switching between published, draft, and trashed posts to see different eligible actions.',
		},
	},
};
