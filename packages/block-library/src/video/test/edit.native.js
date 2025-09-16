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
<!-- fin:video -->
<figure class="fin-block-video"></figure>
<!-- /fin:video -->
		`,
		} );
		const addVideoButton = screen.queryByText( 'Add video' );
		expect( addVideoButton ).toBeVisible();
	} );

	it( 'should not render empty state when video source is present', async () => {
		await initializeEditor( {
			initialHtml: `
<!-- fin:video {"id":1234} -->
<figure class="fin-block-video"><video controls src="https://VIDEO_URL.mp4"></video></figure>
<!-- /fin:video -->
		`,
		} );
		const addVideoButton = screen.queryByText( 'Add video' );
		expect( addVideoButton ).toBeNull();
	} );
} );
