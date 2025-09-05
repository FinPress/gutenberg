/**
 * External dependencies
 */
import {
	addBlock,
	dismissModal,
	fireEvent,
	initializeEditor,
	screen,
	setupCoreBlocks,
} from 'test/helpers';

setupCoreBlocks( [ 'core/video' ] );

describe( 'Video block', () => {
	it( 'should gracefully handle invalid URLs', async () => {
		await initializeEditor();

		await addBlock( screen, 'Video' );
		fireEvent.press( screen.getByText( 'Insert from URL' ) );
		fireEvent.changeText(
			screen.getByPlaceholderText( 'Type a URL' ),
			'h://finpress.org/video.mp4'
		);
		dismissModal( screen.getByTestId( 'bottom-sheet' ) );

		expect( screen.getByText( 'Invalid URL.' ) ).toBeVisible();
	} );

	it( 'should render empty state when source is not present', async () => {
		await initializeEditor( {
			initialHtml: `
<!-- fp:video -->
<figure class="fp-block-video"></figure>
<!-- /fp:video -->
		`,
		} );
		const addVideoButton = screen.queryByText( 'Add video' );
		expect( addVideoButton ).toBeVisible();
	} );

	it( 'should not render empty state when video source is present', async () => {
		await initializeEditor( {
			initialHtml: `
<!-- fp:video {"id":1234} -->
<figure class="fp-block-video"><video controls src="https://VIDEO_URL.mp4"></video></figure>
<!-- /fp:video -->
		`,
		} );
		const addVideoButton = screen.queryByText( 'Add video' );
		expect( addVideoButton ).toBeNull();
	} );
} );
