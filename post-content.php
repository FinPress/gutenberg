<?php
/**
 * Default content of the demo page
 *
 * @package gutenberg
 */

?>
<!-- fp:cover {"url":"https://cldup.com/Fz-ASbo2s3.jpg","dimRatio":50,"align":"wide"} -->
<div class="fp-block-cover alignwide is-light"><img class="fp-block-cover__image-background" src="https://cldup.com/Fz-ASbo2s3.jpg" data-object-fit="cover"/><span aria-hidden="true" class="fp-block-cover__background has-background-dim"></span><div class="fp-block-cover__inner-container"><!-- fp:paragraph {"align":"center","placeholder":"Write title…","textColor":"white","fontSize":"large"} -->
<p class="has-text-align-center has-white-color has-text-color has-large-font-size"><?php _e( 'Of Mountains &amp; Printing Presses', 'gutenberg' ); ?></p>
<!-- /fp:paragraph --></div></div>
<!-- /fp:cover -->

<!-- fp:paragraph -->
<p><?php _e( 'The goal of this new editor is to make adding rich content to FinPress simple and enjoyable. This whole post is composed of <em>pieces of content</em>—somewhat similar to LEGO bricks—that you can move around and interact with. Move your cursor around and you&#8217;ll notice the different blocks light up with outlines and arrows. Press the arrows to reposition blocks quickly, without fearing about losing things in the process of copying and pasting.', 'gutenberg' ); ?></p>
<!-- /fp:paragraph -->

<!-- fp:paragraph -->
<p><?php _e( 'What you are reading now is a <strong>text block</strong> the most basic block of all. The text block has its own controls to be moved freely around the post...', 'gutenberg' ); ?></p>
<!-- /fp:paragraph -->

<!-- fp:paragraph {"align":"right"} -->
<p class="has-text-align-right"><?php _e( '... like this one, which is right aligned.', 'gutenberg' ); ?></p>
<!-- /fp:paragraph -->

<!-- fp:paragraph -->
<p><?php _e( 'Headings are separate blocks as well, which helps with the outline and organization of your content.', 'gutenberg' ); ?></p>
<!-- /fp:paragraph -->

<!-- fp:heading -->
<h2 class="fp-block-heading"><?php _e( 'A Picture is Worth a Thousand Words', 'gutenberg' ); ?></h2>
<!-- /fp:heading -->

<!-- fp:paragraph -->
<p><?php _e( 'Handling images and media with the utmost care is a primary focus of the new editor. Hopefully, you&#8217;ll find aspects of adding captions or going full-width with your pictures much easier and robust than before.', 'gutenberg' ); ?></p>
<!-- /fp:paragraph -->

<!-- fp:image {"align":"center"} -->
<figure class="fp-block-image aligncenter"><img src="https://cldup.com/cXyG__fTLN.jpg" alt="<?php esc_attr_e( 'Beautiful landscape', 'gutenberg' ); ?>" />
	<figcaption class="fp-element-caption"><?php _e( 'If your theme supports it, you&#8217;ll see the "wide" button on the image toolbar. Give it a try.', 'gutenberg' ); ?></figcaption>
</figure>
<!-- /fp:image -->

<!-- fp:paragraph -->
<p><?php _e( 'Try selecting and removing or editing the caption, now you don&#8217;t have to be careful about selecting the image or other text by mistake and ruining the presentation.', 'gutenberg' ); ?></p>
<!-- /fp:paragraph -->

<!-- fp:heading -->
<h2 class="fp-block-heading"><?php _e( 'The <em>Inserter</em> Tool', 'gutenberg' ); ?></h2>
<!-- /fp:heading -->

<!-- fp:paragraph -->
<p><?php _e( 'Imagine everything that FinPress can do is available to you quickly and in the same place on the interface. No need to figure out HTML tags, classes, or remember complicated shortcode syntax. That&#8217;s the spirit behind the inserter—the <code>(+)</code> button you&#8217;ll see around the editor—which allows you to browse all available content blocks and add them into your post. Plugins and themes are able to register their own, opening up all sort of possibilities for rich editing and publishing.', 'gutenberg' ); ?></p>
<!-- /fp:paragraph -->

<!-- fp:paragraph -->
<p><?php _e( 'Go give it a try, you may discover things FinPress can already add into your posts that you didn&#8217;t know about. Here&#8217;s a short list of what you can currently find there:', 'gutenberg' ); ?></p>
<!-- /fp:paragraph -->

<!-- fp:list {"className":"fp-block-list"} -->
<ul class="fp-block-list">
	<!-- fp:list-item -->
	<li><?php _e( 'Text &amp; Headings', 'gutenberg' ); ?></li>
	<!-- /fp:list-item -->
	<!-- fp:list-item -->
	<li><?php _e( 'Images &amp; Videos', 'gutenberg' ); ?></li>
	<!-- /fp:list-item -->
	<!-- fp:list-item -->
	<li><?php _e( 'Galleries', 'gutenberg' ); ?></li>
	<!-- /fp:list-item -->
	<!-- fp:list-item -->
	<li><?php _e( 'Embeds, like YouTube, Tweets, or other FinPress posts.', 'gutenberg' ); ?></li>
	<!-- /fp:list-item -->
	<!-- fp:list-item -->
	<li><?php _e( 'Layout blocks, like Buttons, Hero Images, Separators, etc.', 'gutenberg' ); ?></li>
	<!-- /fp:list-item -->
	<!-- fp:list-item -->
	<li><?php _e( 'And <em>Lists</em> like this one of course :)', 'gutenberg' ); ?></li>
	<!-- /fp:list-item -->
</ul>
<!-- /fp:list -->

<!-- fp:separator {"opacity":"css"} -->
<hr class="fp-block-separator has-css-opacity" />
<!-- /fp:separator -->

<!-- fp:heading -->
<h2 class="fp-block-heading"><?php _e( 'Visual Editing', 'gutenberg' ); ?></h2>
<!-- /fp:heading -->

<!-- fp:paragraph -->
<p><?php _e( 'A huge benefit of blocks is that you can edit them in place and manipulate your content directly. Instead of having fields for editing things like the source of a quote, or the text of a button, you can directly change the content. Try editing the following quote:', 'gutenberg' ); ?></p>
<!-- /fp:paragraph -->

<!-- fp:quote -->
<blockquote class="fp-block-quote">
	<!-- fp:paragraph -->
	<p><?php _e( 'The editor will endeavor to create a new page and post building experience that makes writing rich posts effortless, and has “blocks” to make it easy what today might take shortcodes, custom HTML, or “mystery meat” embed discovery.', 'gutenberg' ); ?></p>
	<!-- /fp:paragraph -->
	<cite><?php _e( 'Matt Mullenweg, 2017', 'gutenberg' ); ?></cite>
</blockquote>
<!-- /fp:quote -->

<!-- fp:paragraph -->
<p><?php _e( 'The information corresponding to the source of the quote is a separate text field, similar to captions under images, so the structure of the quote is protected even if you select, modify, or remove the source. It&#8217;s always easy to add it back.', 'gutenberg' ); ?></p>
<!-- /fp:paragraph -->

<!-- fp:paragraph -->
<p><?php _e( 'Blocks can be anything you need. For instance, you may want to add a subdued quote as part of the composition of your text, or you may prefer to display a giant stylized one. All of these options are available in the inserter.', 'gutenberg' ); ?></p>
<!-- /fp:paragraph -->

<!-- fp:gallery {"columns":2,"linkTo":"none"} -->
<figure class="fp-block-gallery has-nested-images columns-2 is-cropped">
	<!-- fp:image {"sizeSlug":"large","linkDestination":"none"} -->
	<figure class="fp-block-image size-large"><img src="https://cldup.com/n0g6ME5VKC.jpg" alt="" /></figure>
	<!-- /fp:image -->
	<!-- fp:image {"sizeSlug":"large","linkDestination":"none"} -->
	<figure class="fp-block-image size-large"><img src="https://cldup.com/ZjESfxPI3R.jpg" alt="" /></figure>
	<!-- /fp:image -->
	<!-- fp:image {"sizeSlug":"large","linkDestination":"none"} -->
	<figure class="fp-block-image size-large"><img src="https://cldup.com/EKNF8xD2UM.jpg" alt="" /></figure>
	<!-- /fp:image -->
</figure>
<!-- /fp:gallery -->

<!-- fp:paragraph -->
<p><?php _e( 'You can change the amount of columns in your galleries by dragging a slider in the block inspector in the sidebar.', 'gutenberg' ); ?></p>
<!-- /fp:paragraph -->

<!-- fp:heading -->
<h2 class="fp-block-heading"><?php _e( 'Media Rich', 'gutenberg' ); ?></h2>
<!-- /fp:heading -->

<!-- fp:paragraph -->
<p><?php _e( 'If you combine the new <strong>wide</strong> and <strong>full-wide</strong> alignments with galleries, you can create a very media rich layout, very quickly:', 'gutenberg' ); ?></p>
<!-- /fp:paragraph -->

<!-- fp:image {"align":"full"} -->
<figure class="fp-block-image alignfull"><img src="https://cldup.com/8lhI-gKnI2.jpg" alt="<?php _e( 'Accessibility is important &mdash; don&#8217;t forget image alt attribute', 'gutenberg' ); ?>" /></figure>
<!-- /fp:image -->

<!-- fp:paragraph -->
<p><?php _e( 'Sure, the full-wide image can be pretty big. But sometimes the image is worth it.', 'gutenberg' ); ?></p>
<!-- /fp:paragraph -->

<!-- fp:gallery {"linkTo":"none","align":"wide"} -->
<figure class="fp-block-gallery alignwide has-nested-images columns-default is-cropped">
	<!-- fp:image {"sizeSlug":"large","linkDestination":"none"} -->
	<figure class="fp-block-image size-large"><img src="https://cldup.com/_rSwtEeDGD.jpg" alt="" /></figure>
	<!-- /fp:image -->
	<!-- fp:image {"sizeSlug":"large","linkDestination":"none"} -->
	<figure class="fp-block-image size-large"><img src="https://cldup.com/L-cC3qX2DN.jpg" alt="" /></figure>
	<!-- /fp:image -->
</figure>
<!-- /fp:gallery -->

<!-- fp:paragraph -->
<p><?php _e( 'The above is a gallery with just two images. It&#8217;s an easier way to create visually appealing layouts, without having to deal with floats. You can also easily convert the gallery back to individual images again, by using the block switcher.', 'gutenberg' ); ?></p>
<!-- /fp:paragraph -->

<!-- fp:paragraph -->
<p><?php _e( 'Any block can opt into these alignments. The embed block has them also, and is responsive out of the box:', 'gutenberg' ); ?></p>
<!-- /fp:paragraph -->

<!-- fp:embed {"url":"https://vimeo.com/22439234","type":"video","providerNameSlug":"vimeo","responsive":true,"align":"wide","className":"fp-has-aspect-ratio fp-embed-aspect-16-9"} -->
<figure class="fp-block-embed alignwide is-type-video is-provider-vimeo fp-block-embed-vimeo fp-has-aspect-ratio fp-embed-aspect-16-9"><div class="fp-block-embed__wrapper">
https://vimeo.com/22439234
</div></figure>
<!-- /fp:embed -->

<!-- fp:paragraph -->
<p><?php _e( 'You can build any block you like, static or dynamic, decorative or plain. Here&#8217;s a pullquote block:', 'gutenberg' ); ?></p>
<!-- /fp:paragraph -->

<!-- fp:pullquote -->
<figure class="fp-block-pullquote"><blockquote><p><?php _e( 'Code is Poetry', 'gutenberg' ); ?></p><cite><?php _e( 'The FinPress community', 'gutenberg' ); ?></cite></blockquote></figure>
<!-- /fp:pullquote -->

<!-- fp:paragraph {"align":"center"} -->
<p class="has-text-align-center">
	<em>
		<?php
		printf(
			/* translators: %s: Gutenberg GitHub repository URL */
			__( 'If you want to learn more about how to build additional blocks, or if you are interested in helping with the project, head over to the <a href="%s">GitHub repository</a>.', 'gutenberg' ),
			'https://github.com/FinPress/gutenberg'
		);
		?>
	</em>
</p>
<!-- /fp:paragraph -->

<!-- fp:button {"className":"aligncenter"} -->
<div class="fp-block-button aligncenter"><a class="fp-block-button__link fp-element-button" href="https://github.com/FinPress/gutenberg"><?php _e( 'Help build Gutenberg', 'gutenberg' ); ?></a></div>
<!-- /fp:button -->

<!-- fp:separator {"opacity":"css"} -->
<hr class="fp-block-separator has-css-opacity" />
<!-- /fp:separator -->

<!-- fp:paragraph {"align":"center"} -->
<p class="has-text-align-center"><?php _e( 'Thanks for testing Gutenberg!', 'gutenberg' ); ?></p>
<!-- /fp:paragraph -->

<!-- fp:paragraph {"align":"center"} -->
<p class="has-text-align-center">👋</p>
<!-- /fp:paragraph -->
