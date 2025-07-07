/**
 * Internal dependencies
 */
import type { RenderModalProps } from '../../../types';
/**
 * WordPress dependencies
 */
import {
	Button,
	__experimentalText as Text,
	__experimentalHStack as HStack,
	__experimentalVStack as VStack,
} from '@wordpress/components';

export type SpaceObject = {
	id: number;
	title: string;
	description: string;
	image: string;
	type: string;
	isPlanet: boolean;
	categories: string[];
	satellites: number;
	date: string;
	email: string;
};

const ActionModal = ( {
	items,
	closeModal,
}: RenderModalProps< SpaceObject > ) => {
	return (
		<VStack spacing="5">
			<Text>
				{ `Are you sure you want to delete "${ items[ 0 ].title }"?` }
			</Text>
			<HStack justify="right">
				<Button
					__next40pxDefaultSize
					variant="tertiary"
					onClick={ closeModal }
				>
					Cancel
				</Button>
				<Button
					__next40pxDefaultSize
					variant="primary"
					onClick={ closeModal }
				>
					Delete
				</Button>
			</HStack>
		</VStack>
	);
};

export default ActionModal;
