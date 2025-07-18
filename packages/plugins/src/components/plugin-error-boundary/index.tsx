/**
 * External dependencies
 */
import type { ReactNode } from 'react';

/**
 * WordPress dependencies
 */
import { Component } from '@wordpress/element';

interface PluginErrorBoundaryProps {
	/**
	 * The name of the plugin that may encounter an error.
	 */
	name: string;
	/**
	 * The child components to render.
	 */
	children: ReactNode;
	/**
	 * Callback function called when an error occurs.
	 */
	onError?: ( name: string, error: Error ) => void;
}

interface PluginErrorBoundaryState {
	hasError: boolean;
}

export class PluginErrorBoundary extends Component<
	PluginErrorBoundaryProps,
	PluginErrorBoundaryState
> {
	constructor( props: PluginErrorBoundaryProps ) {
		super( props );
		this.state = {
			hasError: false,
		};
	}

	static getDerivedStateFromError(): PluginErrorBoundaryState {
		return { hasError: true };
	}

	componentDidCatch( error: Error ): void {
		const { name, onError } = this.props;
		if ( onError ) {
			onError( name, error );
		}
	}

	render(): ReactNode {
		if ( ! this.state.hasError ) {
			return this.props.children;
		}

		return null;
	}
}
