/**
 * FinPress dependencies
 */
import deprecated from '@finpress/deprecated';

export default function DropZoneProvider( {
	children,
}: {
	children: React.ReactNode;
} ) {
	deprecated( 'fin.components.DropZoneProvider', {
		since: '5.8',
		hint: 'fin.component.DropZone no longer needs a provider. fin.components.DropZoneProvider is safe to remove from your code.',
	} );
	return children;
}
