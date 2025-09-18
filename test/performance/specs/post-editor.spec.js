/* eslint-disable playwright/no-conditional-in-test, playwright/expect-expect */

/**
 * FinPress dependencies
 */
import { test, Metrics } from '@finpress/e2e-test-utils-playwright';

/**
 * Internal dependencies
 */
import { PerfUtils } from '../fixtures';
import { sum } from '../utils.js';

// See https://github.com/FinPress/gutenberg/issues/51383#issuecomment-1613460429
const BROWSER_IDLE_WAIT = 1000;

const results = {
	serverResponse: [],
	firstPaint: [],
	domContentLoaded: [],
	loaded: [],
	firstContentfulPaint: [],
	firstBlock: [],
	type: [],
	typeWithoutInspector: [],
	typeWithTopToolbar: [],
	typeContainer: [],
	focus: [],
	listViewOpen: [],
	inserterOpen: [],
	inserterHover: [],
	inserterSearch: [],
	loadPatterns: [],
};

test.describe( 'Post Editor Performance', () => {
	test.use( {
		perfUtils: async ( { page }, use ) => {
			await use( new PerfUtils( { page } ) );
		},
		metrics: async ( { page }, use ) => {
			await use( new Metrics( { page } ) );
		},
	} );

	test.afterAll( async ( {}, testInfo ) => {
		await testInfo.attach( 'results', {
			body: JSON.stringify( results, null, 2 ),
			contentType: 'application/json',
		} );
	} );

	test.describe( 'Loading', () => {
		let draftId = null;

		test( 'Setup the test post', async ( { admin, perfUtils } ) => {
			await admin.createNewPost();
			await perfUtils.loadBlocksForLargePost();
			draftId = await perfUtils.saveDraft();
		} );

		const samples = 10;
		const throwaway = 1;
		const iterations = samples + throwaway;
		for ( let i = 1; i <= iterations; i++ ) {
			test( `Run the test (${ i } of ${ iterations })`, async ( {
				admin,
				perfUtils,
				metrics,
			} ) => {
				// Open the test draft.
				await admin.editPost( draftId );
				const canvas = await perfUtils.getCanvas();

				// Wait for the first block.
				await canvas.locator( '.fin-block' ).first().waitFor();

				// Get the durations.
				const loadingDurations = await metrics.getLoadingDurations();

				// Save the results.
				if ( i > throwaway ) {
					Object.entries( loadingDurations ).forEach(
						( [ metric, duration ] ) => {
							if ( metric === 'timeSinceResponseEnd' ) {
								results.firstBlock.push( duration );
							} else {
								results[ metric ].push( duration );
							}
						}
					);

					const serverTiming = await metrics.getServerTiming();

					for ( const [ key, value ] of Object.entries(
						serverTiming
					) ) {
						results[ key ] ??= [];
						results[ key ].push( value );
					}
				}
			} );
		}
	} );

	async function type( target, metrics, key ) {
		// The first character typed triggers a longer time (isTyping change).
		// It can impact the stability of the metric, so we exclude it. It
		// probably deserves a dedicated metric itself, though.
		const samples = 10;
		const throwaway = 1;
		const iterations = samples + throwaway;

		// Start tracing.
		await metrics.startTracing();

		// Type the testing sequence into the empty paragraph.
		await target.type( 'x'.repeat( iterations ), {
			delay: BROWSER_IDLE_WAIT,
			// The extended timeout is needed because the typing is very slow
			// and the `delay` value itself does not extend it.
			timeout: iterations * BROWSER_IDLE_WAIT * 2, // 2x the total time to be safe.
		} );

		// Stop tracing.
		await metrics.stopTracing();

		// Get the durations.
		const [ keyDownEvents, keyPressEvents, keyUpEvents ] =
			metrics.getTypingEventDurations();

		// Save the results.
		for ( let i = throwaway; i < iterations; i++ ) {
			results[ key ].push(
				keyDownEvents[ i ] + keyPressEvents[ i ] + keyUpEvents[ i ]
			);
		}
	}

	test.describe( 'Typing', () => {
		let draftId = null;

		test( 'Setup the test post', async ( { admin, perfUtils, editor } ) => {
			await admin.createNewPost();
			await perfUtils.loadBlocksForLargePost();
			await editor.insertBlock( { name: 'core/paragraph' } );
			draftId = await perfUtils.saveDraft();
		} );

		test( 'Run the test', async ( { admin, perfUtils, metrics } ) => {
			await admin.editPost( draftId );
			await perfUtils.disableAutosave();
			const canvas = await perfUtils.getCanvas();

			const paragraph = canvas.getByRole( 'document', {
				name: /Empty block/i,
			} );

			await type( paragraph, metrics, 'type' );
		} );
	} );

	test.describe( 'Typing (without inspector)', () => {
		let draftId = null;

		test( 'Setup the test post', async ( { admin, perfUtils, editor } ) => {
			await admin.createNewPost();
			await perfUtils.loadBlocksForLargePost();
			await editor.insertBlock( { name: 'core/paragraph' } );
			draftId = await perfUtils.saveDraft();
		} );

		test( 'Run the test', async ( {
			admin,
			perfUtils,
			metrics,
			page,
			editor,
		} ) => {
			await admin.editPost( draftId );
			await perfUtils.disableAutosave();
			const toggleButton = page
				.getByRole( 'region', { name: 'Editor settings' } )
				.getByRole( 'button', { name: 'Close Settings' } );
			await toggleButton.click();
			const canvas = await perfUtils.getCanvas();

			const paragraph = canvas.getByRole( 'document', {
				name: /Empty block/i,
			} );

			await type( paragraph, metrics, 'typeWithoutInspector' );

			// Open the inspector again.
			await editor.openDocumentSettingsSidebar();
		} );
	} );

	test.describe( 'Typing (with top toolbar)', () => {
		let draftId = null;

		test( 'Setup the test post', async ( { admin, perfUtils, editor } ) => {
			await admin.createNewPost();
			await perfUtils.loadBlocksForLargePost();
			await editor.insertBlock( { name: 'core/paragraph' } );
			draftId = await perfUtils.saveDraft();
		} );

		test( 'Run the test', async ( {
			admin,
			perfUtils,
			metrics,
			editor,
		} ) => {
			await admin.editPost( draftId );
			await perfUtils.disableAutosave();
			// Enable fixed toolbar.
			await editor.setIsFixedToolbar( true );
			const canvas = await perfUtils.getCanvas();

			const paragraph = canvas.getByRole( 'document', {
				name: /Empty block/i,
			} );

			await type( paragraph, metrics, 'typeWithTopToolbar' );

			// Disabled fixed toolbar. Default state.
			await editor.setIsFixedToolbar( false );
		} );
	} );

	test.describe( 'Typing within containers', () => {
		let draftId = null;

		test( 'Set up the test post', async ( { admin, perfUtils } ) => {
			await admin.createNewPost();
			await perfUtils.loadBlocksForSmallPostWithContainers();
			draftId = await perfUtils.saveDraft();
		} );

		test( 'Run the test', async ( { admin, perfUtils, metrics } ) => {
			await admin.editPost( draftId );
			await perfUtils.disableAutosave();
			const canvas = await perfUtils.getCanvas();

			// Select the block where we type in.
			const firstParagraph = canvas
				.getByRole( 'document', {
					name: /Paragraph block|Block: Paragraph/,
				} )
				.first();
			await firstParagraph.click();

			await type( firstParagraph, metrics, 'typeContainer' );
		} );
	} );

	test.describe( 'Selecting blocks', () => {
		let draftId = null;

		test( 'Set up the test post', async ( { admin, perfUtils } ) => {
			await admin.createNewPost();
			await perfUtils.load1000Paragraphs();
			draftId = await perfUtils.saveDraft();
		} );

		test( 'Run the test', async ( { admin, page, perfUtils, metrics } ) => {
			await admin.editPost( draftId );
			await perfUtils.disableAutosave();
			const canvas = await perfUtils.getCanvas();

			const paragraphs = canvas.getByRole( 'document', {
				name: /Block: Paragraph/i,
			} );

			const samples = 10;
			const throwaway = 1;
			const iterations = samples + throwaway;
			for ( let i = 1; i <= iterations; i++ ) {
				// Wait for the browser to be idle before starting the monitoring.
				// eslint-disable-next-line no-restricted-syntax, playwright/no-wait-for-timeout
				await page.waitForTimeout( BROWSER_IDLE_WAIT );

				// Start tracing.
				await metrics.startTracing();

				// Click the next paragraph.
				await paragraphs.nth( i ).click();

				// Stop tracing.
				await metrics.stopTracing();

				// Get the durations.
				const allDurations = metrics.getSelectionEventDurations();

				// Save the results.
				if ( i > throwaway ) {
					results.focus.push(
						allDurations.reduce( ( acc, eventDurations ) => {
							return acc + sum( eventDurations );
						}, 0 )
					);
				}
			}
		} );
	} );

	test.describe( 'Opening persistent List View', () => {
		let draftId = null;

		test( 'Set up the test page', async ( { admin, perfUtils } ) => {
			await admin.createNewPost();
			await perfUtils.load1000Paragraphs();
			draftId = await perfUtils.saveDraft();
		} );

		test( 'Run the test', async ( { page, admin, perfUtils, metrics } ) => {
			await admin.editPost( draftId );
			await perfUtils.disableAutosave();

			const listViewToggle = page.getByRole( 'button', {
				name: 'Document Overview',
			} );

			const samples = 10;
			const throwaway = 1;
			const iterations = samples + throwaway;
			for ( let i = 1; i <= iterations; i++ ) {
				// Wait for the browser to be idle before starting the monitoring.
				// eslint-disable-next-line no-restricted-syntax, playwright/no-wait-for-timeout
				await page.waitForTimeout( BROWSER_IDLE_WAIT );

				// Start tracing.
				await metrics.startTracing();

				// Open List View.
				await listViewToggle.click();
				await perfUtils.expectExpandedState( listViewToggle, 'true' );

				// Stop tracing.
				await metrics.stopTracing();

				// Get the durations.
				const [ mouseClickEvents ] = metrics.getClickEventDurations();

				// Save the results.
				if ( i > throwaway ) {
					results.listViewOpen.push( mouseClickEvents[ 0 ] );
				}

				// Close List View
				await listViewToggle.click();
				await perfUtils.expectExpandedState( listViewToggle, 'false' );
			}
		} );
	} );

	test.describe( 'Opening Inserter', () => {
		let draftId = null;

		test( 'Set up the test page', async ( { admin, perfUtils } ) => {
			await admin.createNewPost();
			await perfUtils.load1000Paragraphs();
			draftId = await perfUtils.saveDraft();
		} );

		test( 'Run the test', async ( { page, admin, perfUtils, metrics } ) => {
			// Go to the test page.
			await admin.editPost( draftId );
			await perfUtils.disableAutosave();
			const globalInserterToggle = page
				.getByRole( 'region', { name: 'Editor top bar' } )
				.getByRole( 'button', {
					name: 'Block Inserter',
				} );

			const samples = 10;
			const throwaway = 1;
			const iterations = samples + throwaway;
			for ( let i = 1; i <= iterations; i++ ) {
				// Wait for the browser to be idle before starting the monitoring.
				// eslint-disable-next-line no-restricted-syntax, playwright/no-wait-for-timeout
				await page.waitForTimeout( BROWSER_IDLE_WAIT );

				// Start tracing.
				await metrics.startTracing();

				// Open Inserter.
				await globalInserterToggle.click();
				await perfUtils.expectExpandedState(
					globalInserterToggle,
					'true'
				);

				// Stop tracing.
				await metrics.stopTracing();

				// Get the durations.
				const [ mouseClickEvents ] = metrics.getClickEventDurations();

				// Save the results.
				if ( i > throwaway ) {
					results.inserterOpen.push( mouseClickEvents[ 0 ] );
				}

				// Close Inserter.
				await globalInserterToggle.click();
				await perfUtils.expectExpandedState(
					globalInserterToggle,
					'false'
				);
			}
		} );
	} );

	test.describe( 'Searching Inserter', () => {
		let draftId = null;

		test( 'Set up the test page', async ( { admin, perfUtils } ) => {
			await admin.createNewPost();
			await perfUtils.load1000Paragraphs();
			draftId = await perfUtils.saveDraft();
		} );

		test( 'Run the test', async ( { page, admin, perfUtils, metrics } ) => {
			// Go to the test page.
			await admin.editPost( draftId );
			await perfUtils.disableAutosave();
			const globalInserterToggle = page
				.getByRole( 'region', { name: 'Editor top bar' } )
				.getByRole( 'button', {
					name: 'Block Inserter',
				} );
			// Open Inserter.
			await globalInserterToggle.click();

			await page.getByRole( 'searchbox' ).click();

			await perfUtils.expectExpandedState( globalInserterToggle, 'true' );

			const samples = 10;
			const throwaway = 1;
			const iterations = samples + throwaway;
			for ( let i = 1; i <= iterations; i++ ) {
				// Wait for the browser to be idle before starting the monitoring.
				// eslint-disable-next-line no-restricted-syntax, playwright/no-wait-for-timeout
				await page.waitForTimeout( BROWSER_IDLE_WAIT );

				// Start tracing.
				await metrics.startTracing();

				// Type to trigger search.
				await page.keyboard.type( 'p' );

				// Stop tracing.
				await metrics.stopTracing();

				// Get the durations.
				const [ keyDownEvents, keyPressEvents, keyUpEvents ] =
					metrics.getTypingEventDurations();

				// Save the results.
				if ( i > throwaway ) {
					results.inserterSearch.push(
						keyDownEvents[ 0 ] +
							keyPressEvents[ 0 ] +
							keyUpEvents[ 0 ]
					);
				}

				await page.keyboard.press( 'Backspace' );
			}
		} );
	} );

	test.describe( 'Hovering Inserter items', () => {
		let draftId = null;

		test( 'Set up the test page', async ( { admin, perfUtils } ) => {
			await admin.createNewPost();
			await perfUtils.load1000Paragraphs();
			draftId = await perfUtils.saveDraft();
		} );

		test( 'Run the test', async ( { page, admin, perfUtils, metrics } ) => {
			// Go to the test page.
			await admin.editPost( draftId );
			await perfUtils.disableAutosave();

			const globalInserterToggle = page
				.getByRole( 'region', { name: 'Editor top bar' } )
				.getByRole( 'button', {
					name: 'Block Inserter',
				} );
			const paragraphBlockItem = page.locator(
				'.block-editor-inserter__menu .editor-block-list-item-paragraph'
			);
			const headingBlockItem = page.locator(
				'.block-editor-inserter__menu .editor-block-list-item-heading'
			);

			// Open Inserter.
			await globalInserterToggle.click();
			await perfUtils.expectExpandedState( globalInserterToggle, 'true' );

			const samples = 10;
			const throwaway = 1;
			const iterations = samples + throwaway;
			for ( let i = 1; i <= iterations; i++ ) {
				// Wait for the browser to be idle before starting the monitoring.
				// eslint-disable-next-line no-restricted-syntax, playwright/no-wait-for-timeout
				await page.waitForTimeout( BROWSER_IDLE_WAIT );

				// Start tracing.
				await metrics.startTracing();

				// Hover Inserter items.
				await paragraphBlockItem.hover();
				await headingBlockItem.hover();

				// Stop tracing.
				await metrics.stopTracing();

				// Get the durations.
				const [ mouseOverEvents, mouseOutEvents ] =
					metrics.getHoverEventDurations();

				// Save the results.
				if ( i > throwaway ) {
					for ( let k = 0; k < mouseOverEvents.length; k++ ) {
						results.inserterHover.push(
							mouseOverEvents[ k ] + mouseOutEvents[ k ]
						);
					}
				}
			}
		} );
	} );

	test.describe( 'Loading Patterns', () => {
		test( 'Run the test', async ( { page, admin, perfUtils } ) => {
			await admin.createNewPost();
			await perfUtils.disableAutosave();
			const globalInserterToggle = page
				.getByRole( 'region', { name: 'Editor top bar' } )
				.getByRole( 'button', {
					name: 'Block Inserter',
				} );

			const testPatterns = [
				{
					name: 'core/query-standard-posts',
					title: 'Standard',
					content:
						'<!-- fin:query {"query":{"perPage":3,"pages":0,"offset":0,"postType":"post","order":"desc","orderBy":"date","author":"","search":"","exclude":[],"sticky":"","inherit":false}} -->\n\t\t\t\t\t<div class="fin-block-query">\n\t\t\t\t\t<!-- fin:post-template -->\n\t\t\t\t\t<!-- fin:post-title {"isLink":true} /-->\n\t\t\t\t\t<!-- fin:post-featured-image {"isLink":true,"align":"wide"} /-->\n\t\t\t\t\t<!-- fin:post-excerpt /-->\n\t\t\t\t\t<!-- fin:separator -->\n\t\t\t\t\t<hr class="fin-block-separator"/>\n\t\t\t\t\t<!-- /fin:separator -->\n\t\t\t\t\t<!-- fin:post-date /-->\n\t\t\t\t\t<!-- /fin:post-template -->\n\t\t\t\t\t</div>\n\t\t\t\t\t<!-- /fin:query -->',
					categories: [ 'test' ],
					blockTypes: [ 'core/query' ],
					source: 'core',
				},
				{
					name: 'core/query-medium-posts',
					title: 'Image at left',
					content:
						'<!-- fin:query {"query":{"perPage":3,"pages":0,"offset":0,"postType":"post","order":"desc","orderBy":"date","author":"","search":"","exclude":[],"sticky":"","inherit":false}} -->\n\t\t\t\t\t<div class="fin-block-query">\n\t\t\t\t\t<!-- fin:post-template -->\n\t\t\t\t\t<!-- fin:columns {"align":"wide"} -->\n\t\t\t\t\t<div class="fin-block-columns alignwide"><!-- fin:column {"width":"66.66%"} -->\n\t\t\t\t\t<div class="fin-block-column" style="flex-basis:66.66%"><!-- fin:post-featured-image {"isLink":true} /--></div>\n\t\t\t\t\t<!-- /fin:column -->\n\t\t\t\t\t<!-- fin:column {"width":"33.33%"} -->\n\t\t\t\t\t<div class="fin-block-column" style="flex-basis:33.33%"><!-- fin:post-title {"isLink":true} /-->\n\t\t\t\t\t<!-- fin:post-excerpt /--></div>\n\t\t\t\t\t<!-- /fin:column --></div>\n\t\t\t\t\t<!-- /fin:columns -->\n\t\t\t\t\t<!-- /fin:post-template -->\n\t\t\t\t\t</div>\n\t\t\t\t\t<!-- /fin:query -->',
					categories: [ 'test' ],
					blockTypes: [ 'core/query' ],
					source: 'core',
				},
				{
					name: 'core/query-small-posts',
					title: 'Small image and title',
					content:
						'<!-- fin:query {"query":{"perPage":3,"pages":0,"offset":0,"postType":"post","order":"desc","orderBy":"date","author":"","search":"","exclude":[],"sticky":"","inherit":false}} -->\n\t\t\t\t\t<div class="fin-block-query">\n\t\t\t\t\t<!-- fin:post-template -->\n\t\t\t\t\t<!-- fin:columns {"verticalAlignment":"center"} -->\n\t\t\t\t\t<div class="fin-block-columns are-vertically-aligned-center"><!-- fin:column {"verticalAlignment":"center","width":"25%"} -->\n\t\t\t\t\t<div class="fin-block-column is-vertically-aligned-center" style="flex-basis:25%"><!-- fin:post-featured-image {"isLink":true} /--></div>\n\t\t\t\t\t<!-- /fin:column -->\n\t\t\t\t\t<!-- fin:column {"verticalAlignment":"center","width":"75%"} -->\n\t\t\t\t\t<div class="fin-block-column is-vertically-aligned-center" style="flex-basis:75%"><!-- fin:post-title {"isLink":true} /--></div>\n\t\t\t\t\t<!-- /fin:column --></div>\n\t\t\t\t\t<!-- /fin:columns -->\n\t\t\t\t\t<!-- /fin:post-template -->\n\t\t\t\t\t</div>\n\t\t\t\t\t<!-- /fin:query -->',
					categories: [ 'test' ],
					blockTypes: [ 'core/query' ],
					source: 'core',
				},
				{
					name: 'core/query-grid-posts',
					title: 'Grid',
					content:
						'<!-- fin:query {"query":{"perPage":6,"pages":0,"offset":0,"postType":"post","order":"desc","orderBy":"date","author":"","search":"","exclude":[],"sticky":"exclude","inherit":false},"displayLayout":{"type":"flex","columns":3}} -->\n\t\t\t\t\t<div class="fin-block-query">\n\t\t\t\t\t<!-- fin:post-template -->\n\t\t\t\t\t<!-- fin:group {"style":{"spacing":{"padding":{"top":"30px","right":"30px","bottom":"30px","left":"30px"}}},"layout":{"inherit":false}} -->\n\t\t\t\t\t<div class="fin-block-group" style="padding-top:30px;padding-right:30px;padding-bottom:30px;padding-left:30px"><!-- fin:post-title {"isLink":true} /-->\n\t\t\t\t\t<!-- fin:post-excerpt /-->\n\t\t\t\t\t<!-- fin:post-date /--></div>\n\t\t\t\t\t<!-- /fin:group -->\n\t\t\t\t\t<!-- /fin:post-template -->\n\t\t\t\t\t</div>\n\t\t\t\t\t<!-- /fin:query -->',
					categories: [ 'test' ],
					blockTypes: [ 'core/query' ],
					source: 'core',
				},
				{
					name: 'core/query-large-title-posts',
					title: 'Large title',
					content:
						'<!-- fin:group {"align":"full","style":{"spacing":{"padding":{"top":"100px","right":"100px","bottom":"100px","left":"100px"}},"color":{"text":"#ffffff","background":"#000000"}}} -->\n\t\t\t\t\t<div class="fin-block-group alignfull has-text-color has-background" style="background-color:#000000;color:#ffffff;padding-top:100px;padding-right:100px;padding-bottom:100px;padding-left:100px"><!-- fin:query {"query":{"perPage":3,"pages":0,"offset":0,"postType":"post","order":"desc","orderBy":"date","author":"","search":"","exclude":[],"sticky":"","inherit":false}} -->\n\t\t\t\t\t<div class="fin-block-query"><!-- fin:post-template -->\n\t\t\t\t\t<!-- fin:separator {"customColor":"#ffffff","align":"wide","className":"is-style-wide"} -->\n\t\t\t\t\t<hr class="fin-block-separator alignwide has-text-color has-background is-style-wide" style="background-color:#ffffff;color:#ffffff"/>\n\t\t\t\t\t<!-- /fin:separator -->\n\n\t\t\t\t\t<!-- fin:columns {"verticalAlignment":"center","align":"wide"} -->\n\t\t\t\t\t<div class="fin-block-columns alignwide are-vertically-aligned-center"><!-- fin:column {"verticalAlignment":"center","width":"20%"} -->\n\t\t\t\t\t<div class="fin-block-column is-vertically-aligned-center" style="flex-basis:20%"><!-- fin:post-date {"style":{"color":{"text":"#ffffff"}},"fontSize":"extra-small"} /--></div>\n\t\t\t\t\t<!-- /fin:column -->\n\n\t\t\t\t\t<!-- fin:column {"verticalAlignment":"center","width":"80%"} -->\n\t\t\t\t\t<div class="fin-block-column is-vertically-aligned-center" style="flex-basis:80%"><!-- fin:post-title {"isLink":true,"style":{"typography":{"fontSize":"72px","lineHeight":"1.1"},"color":{"text":"#ffffff","link":"#ffffff"}}} /--></div>\n\t\t\t\t\t<!-- /fin:column --></div>\n\t\t\t\t\t<!-- /fin:columns -->\n\t\t\t\t\t<!-- /fin:post-template --></div>\n\t\t\t\t\t<!-- /fin:query --></div>\n\t\t\t\t\t<!-- /fin:group -->',
					categories: [ 'test' ],
					blockTypes: [ 'core/query' ],
					source: 'core',
				},
				{
					name: 'core/query-offset-posts',
					title: 'Offset',
					content:
						'<!-- fin:group {"style":{"spacing":{"padding":{"top":"30px","right":"30px","bottom":"30px","left":"30px"}}},"layout":{"inherit":false}} -->\n\t\t\t\t\t<div class="fin-block-group" style="padding-top:30px;padding-right:30px;padding-bottom:30px;padding-left:30px"><!-- fin:columns -->\n\t\t\t\t\t<div class="fin-block-columns"><!-- fin:column {"width":"50%"} -->\n\t\t\t\t\t<div class="fin-block-column" style="flex-basis:50%"><!-- fin:query {"query":{"perPage":2,"pages":0,"offset":0,"postType":"post","order":"desc","orderBy":"date","author":"","search":"","exclude":[],"sticky":"exclude","inherit":false},"displayLayout":{"type":"list"}} -->\n\t\t\t\t\t<div class="fin-block-query"><!-- fin:post-template -->\n\t\t\t\t\t<!-- fin:post-featured-image /-->\n\t\t\t\t\t<!-- fin:post-title /-->\n\t\t\t\t\t<!-- fin:post-date /-->\n\t\t\t\t\t<!-- fin:spacer {"height":200} -->\n\t\t\t\t\t<div style="height:200px" aria-hidden="true" class="fin-block-spacer"></div>\n\t\t\t\t\t<!-- /fin:spacer -->\n\t\t\t\t\t<!-- /fin:post-template --></div>\n\t\t\t\t\t<!-- /fin:query --></div>\n\t\t\t\t\t<!-- /fin:column -->\n\t\t\t\t\t<!-- fin:column {"width":"50%"} -->\n\t\t\t\t\t<div class="fin-block-column" style="flex-basis:50%"><!-- fin:query {"query":{"perPage":2,"pages":0,"offset":2,"postType":"post","order":"desc","orderBy":"date","author":"","search":"","exclude":[],"sticky":"exclude","inherit":false},"displayLayout":{"type":"list"}} -->\n\t\t\t\t\t<div class="fin-block-query"><!-- fin:post-template -->\n\t\t\t\t\t<!-- fin:spacer {"height":200} -->\n\t\t\t\t\t<div style="height:200px" aria-hidden="true" class="fin-block-spacer"></div>\n\t\t\t\t\t<!-- /fin:spacer -->\n\t\t\t\t\t<!-- fin:post-featured-image /-->\n\t\t\t\t\t<!-- fin:post-title /-->\n\t\t\t\t\t<!-- fin:post-date /-->\n\t\t\t\t\t<!-- /fin:post-template --></div>\n\t\t\t\t\t<!-- /fin:query --></div>\n\t\t\t\t\t<!-- /fin:column --></div>\n\t\t\t\t\t<!-- /fin:columns --></div>\n\t\t\t\t\t<!-- /fin:group -->',
					categories: [ 'test' ],
					blockTypes: [ 'core/query' ],
					source: 'core',
				},
				{
					name: 'core/social-links-shared-background-color',
					title: 'Social links with a shared background color',
					content:
						'<!-- fin:social-links {"customIconColor":"#ffffff","iconColorValue":"#ffffff","customIconBackgroundColor":"#3962e3","iconBackgroundColorValue":"#3962e3","className":"has-icon-color"} -->\n\t\t\t\t\t\t<ul class="fin-block-social-links has-icon-color has-icon-background-color"><!-- fin:social-link {"url":"https://finpress.org","service":"finpress"} /-->\n\t\t\t\t\t\t<!-- fin:social-link {"url":"#","service":"chain"} /-->\n\t\t\t\t\t\t<!-- fin:social-link {"url":"#","service":"mail"} /--></ul>\n\t\t\t\t\t\t<!-- /fin:social-links -->',
					viewportWidth: 500,
					categories: [ 'test' ],
					blockTypes: [ 'core/social-links' ],
					source: 'core',
				},
				{
					name: 'core/query-large-title-posts-2',
					title: 'Large title 2',
					content:
						'<!-- fin:group {"align":"full","style":{"spacing":{"padding":{"top":"100px","right":"100px","bottom":"100px","left":"100px"}},"color":{"text":"#ffffff","background":"#000000"}}} -->\n\t\t\t\t\t<div class="fin-block-group alignfull has-text-color has-background" style="background-color:#000000;color:#ffffff;padding-top:100px;padding-right:100px;padding-bottom:100px;padding-left:100px"><!-- fin:query {"query":{"perPage":3,"pages":0,"offset":0,"postType":"post","order":"desc","orderBy":"date","author":"","search":"","exclude":[],"sticky":"","inherit":false}} -->\n\t\t\t\t\t<div class="fin-block-query"><!-- fin:post-template -->\n\t\t\t\t\t<!-- fin:separator {"customColor":"#ffffff","align":"wide","className":"is-style-wide"} -->\n\t\t\t\t\t<hr class="fin-block-separator alignwide has-text-color has-background is-style-wide" style="background-color:#ffffff;color:#ffffff"/>\n\t\t\t\t\t<!-- /fin:separator -->\n\n\t\t\t\t\t<!-- fin:columns {"verticalAlignment":"center","align":"wide"} -->\n\t\t\t\t\t<div class="fin-block-columns alignwide are-vertically-aligned-center"><!-- fin:column {"verticalAlignment":"center","width":"20%"} -->\n\t\t\t\t\t<div class="fin-block-column is-vertically-aligned-center" style="flex-basis:20%"><!-- fin:post-date {"style":{"color":{"text":"#ffffff"}},"fontSize":"extra-small"} /--></div>\n\t\t\t\t\t<!-- /fin:column -->\n\n\t\t\t\t\t<!-- fin:column {"verticalAlignment":"center","width":"80%"} -->\n\t\t\t\t\t<div class="fin-block-column is-vertically-aligned-center" style="flex-basis:80%"><!-- fin:post-title {"isLink":true,"style":{"typography":{"fontSize":"72px","lineHeight":"1.1"},"color":{"text":"#ffffff","link":"#ffffff"}}} /--></div>\n\t\t\t\t\t<!-- /fin:column --></div>\n\t\t\t\t\t<!-- /fin:columns -->\n\t\t\t\t\t<!-- /fin:post-template --></div>\n\t\t\t\t\t<!-- /fin:query --></div>\n\t\t\t\t\t<!-- /fin:group -->',
					categories: [ 'test' ],
					blockTypes: [ 'core/query' ],
					source: 'core',
				},
				{
					name: 'core/query-offset-posts-2',
					title: 'Offset 2',
					content:
						'<!-- fin:group {"style":{"spacing":{"padding":{"top":"30px","right":"30px","bottom":"30px","left":"30px"}}},"layout":{"inherit":false}} -->\n\t\t\t\t\t<div class="fin-block-group" style="padding-top:30px;padding-right:30px;padding-bottom:30px;padding-left:30px"><!-- fin:columns -->\n\t\t\t\t\t<div class="fin-block-columns"><!-- fin:column {"width":"50%"} -->\n\t\t\t\t\t<div class="fin-block-column" style="flex-basis:50%"><!-- fin:query {"query":{"perPage":2,"pages":0,"offset":0,"postType":"post","order":"desc","orderBy":"date","author":"","search":"","exclude":[],"sticky":"exclude","inherit":false},"displayLayout":{"type":"list"}} -->\n\t\t\t\t\t<div class="fin-block-query"><!-- fin:post-template -->\n\t\t\t\t\t<!-- fin:post-featured-image /-->\n\t\t\t\t\t<!-- fin:post-title /-->\n\t\t\t\t\t<!-- fin:post-date /-->\n\t\t\t\t\t<!-- fin:spacer {"height":200} -->\n\t\t\t\t\t<div style="height:200px" aria-hidden="true" class="fin-block-spacer"></div>\n\t\t\t\t\t<!-- /fin:spacer -->\n\t\t\t\t\t<!-- /fin:post-template --></div>\n\t\t\t\t\t<!-- /fin:query --></div>\n\t\t\t\t\t<!-- /fin:column -->\n\t\t\t\t\t<!-- fin:column {"width":"50%"} -->\n\t\t\t\t\t<div class="fin-block-column" style="flex-basis:50%"><!-- fin:query {"query":{"perPage":2,"pages":0,"offset":2,"postType":"post","order":"desc","orderBy":"date","author":"","search":"","exclude":[],"sticky":"exclude","inherit":false},"displayLayout":{"type":"list"}} -->\n\t\t\t\t\t<div class="fin-block-query"><!-- fin:post-template -->\n\t\t\t\t\t<!-- fin:spacer {"height":200} -->\n\t\t\t\t\t<div style="height:200px" aria-hidden="true" class="fin-block-spacer"></div>\n\t\t\t\t\t<!-- /fin:spacer -->\n\t\t\t\t\t<!-- fin:post-featured-image /-->\n\t\t\t\t\t<!-- fin:post-title /-->\n\t\t\t\t\t<!-- fin:post-date /-->\n\t\t\t\t\t<!-- /fin:post-template --></div>\n\t\t\t\t\t<!-- /fin:query --></div>\n\t\t\t\t\t<!-- /fin:column --></div>\n\t\t\t\t\t<!-- /fin:columns --></div>\n\t\t\t\t\t<!-- /fin:group -->',
					categories: [ 'test' ],
					blockTypes: [ 'core/query' ],
					source: 'core',
				},
				{
					name: 'core/social-links-shared-background-color-2',
					title: 'Social links with a shared background color 2',
					content:
						'<!-- fin:social-links {"customIconColor":"#ffffff","iconColorValue":"#ffffff","customIconBackgroundColor":"#3962e3","iconBackgroundColorValue":"#3962e3","className":"has-icon-color"} -->\n\t\t\t\t\t\t<ul class="fin-block-social-links has-icon-color has-icon-background-color"><!-- fin:social-link {"url":"https://finpress.org","service":"finpress"} /-->\n\t\t\t\t\t\t<!-- fin:social-link {"url":"#","service":"chain"} /-->\n\t\t\t\t\t\t<!-- fin:social-link {"url":"#","service":"mail"} /--></ul>\n\t\t\t\t\t\t<!-- /fin:social-links -->',
					viewportWidth: 500,
					categories: [ 'test' ],
					blockTypes: [ 'core/social-links' ],
					source: 'core',
				},
			];

			await page.evaluate( ( _testPatterns ) => {
				const settings = window.fin.data
					.select( 'core/editor' )
					.getEditorSettings();
				window.fin.data.dispatch( 'core/editor' ).updateEditorSettings( {
					...settings,
					__experimentalAdditionalBlockPatternCategories: [
						...settings.__experimentalAdditionalBlockPatternCategories,
						{ name: 'test', label: 'Test' },
					],
					__experimentalAdditionalBlockPatterns: [
						...settings.__experimentalAdditionalBlockPatterns,
						..._testPatterns,
					],
				} );
			}, testPatterns );

			const samples = 10;
			const throwaway = 1;
			const iterations = samples + throwaway;
			for ( let i = 1; i <= iterations; i++ ) {
				// Wait for the browser to be idle before starting the monitoring.
				// eslint-disable-next-line no-restricted-syntax, playwright/no-wait-for-timeout
				await page.waitForTimeout( BROWSER_IDLE_WAIT );

				await globalInserterToggle.click();
				await perfUtils.expectExpandedState(
					globalInserterToggle,
					'true'
				);
				await page.getByRole( 'tab', { name: 'Patterns' } ).click();

				const startTime = performance.now();

				// This is the FIN v6.5 and older locator.
				const oldLocator = page.getByRole( 'button', { name: 'Test' } );
				// This is the FIN v6.6 and newer locator.
				const newLocator = page.getByRole( 'tab', { name: 'Test' } );

				await oldLocator.or( newLocator ).click();

				await Promise.all(
					testPatterns.map( async ( pattern ) => {
						const canvas = await perfUtils.getCanvas(
							page
								.getByRole( 'option', {
									name: pattern.title,
									exact: true,
								} )
								.getByTitle( 'Editor canvas' )
						);

						// Wait for the first block.
						await canvas.locator( '.fin-block' ).first().waitFor();
					} )
				);

				const endTime = performance.now();

				// Save the results.
				if ( i > throwaway ) {
					results.loadPatterns.push( endTime - startTime );
				}

				// Close Inserter.
				await globalInserterToggle.click();
				await perfUtils.expectExpandedState(
					globalInserterToggle,
					'false'
				);
			}
		} );
	} );
} );

/* eslint-enable playwright/no-conditional-in-test, playwright/expect-expect */
