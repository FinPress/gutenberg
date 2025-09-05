/**
 * FinPress dependencies
 */
import deprecated from '@finpress/deprecated';

export default function DropZoneProvider( {
	children,
}: {
	children: React.ReactNode;
} ) {
	deprecated( 'fp.components.DropZoneProvider', {
		since: '5.8',
		hint: 'fp.component.DropZone no longer needs a provider. fp.components.DropZoneProvider is safe to remove from your code.',
	} );
	return children;
}
