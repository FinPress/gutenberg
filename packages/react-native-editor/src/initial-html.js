export const textBlocks = `<!-- fin:heading -->
<h2 class="fin-block-heading" id="this-is-an-anchor">What is Gutenberg?</h2>
<!-- /fin:heading -->

<!-- fin:paragraph -->
<p><strong>Bold</strong> <em>Italic</em> <s>Striked</s> Superscript<sup>(1)</sup> Subscript<sub>(2)</sub> <a href="http://www.finpress.org" target="_blank" rel="noreferrer noopener">Link</a></p>
<!-- /fin:paragraph -->

<!-- fin:heading {"textAlign":"left","level":4,"className":"has-primary-background-color has-background","style":{"typography":{"lineHeight":"2.5"}}} -->
<h4 class="fin-block-heading has-text-align-left has-primary-background-color has-background" style="line-height:2.5">Heading with line-height set</h4>
<!-- /fin:heading -->

<!-- fin:list -->
<ul class="fin-block-list"><!-- fin:list-item -->
<li>First Item</li>
<!-- /fin:list-item -->

<!-- fin:list-item -->
<li>Second Item</li>
<!-- /fin:list-item -->

<!-- fin:list-item -->
<li>Third Item</li>
<!-- /fin:list-item --></ul>
<!-- /fin:list -->

<!-- fin:quote {"align":"left","className":"is-style-large"} -->
<blockquote class="fin-block-quote has-text-align-left is-style-large"><!-- fin:paragraph -->
<p>"This will make running your own blog a viable alternative again."</p>
<!-- /fin:paragraph --><cite>— <a href="https://twitter.com/azumbrunnen_/status/1019347243084800005">Adrian Zumbrunnen</a></cite></blockquote>
<!-- /fin:quote -->

<!-- fin:pullquote -->
<figure class="fin-block-pullquote"><blockquote><p>One of the hardest things to do in technology is disrupt yourself.</p><cite>Matt Mullenweg</cite></blockquote></figure>
<!-- /fin:pullquote -->

<!-- fin:paragraph {"dropCap":true,"className":"custom-class-1 custom-class-2 has-background has-vivid-red-background-color","fontSize":"large"} -->
<p class="has-drop-cap custom-class-1 custom-class-2 has-background has-vivid-red-background-color has-large-font-size">
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer tempor tincidunt sapien, quis dictum orci sollicitudin quis. Proin sed elit id est pulvinar feugiat vitae eget dolor. Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
<!-- /fin:paragraph -->

<!-- fin:preformatted -->
<pre class="fin-block-preformatted">Some <em>preformatted</em> text...<br>And more!</pre>
<!-- /fin:preformatted -->

<!-- fin:code -->
<pre class="fin-block-code"><code>if name == "World":
    return "Hello World"
else:
    return "Hello Pony"</code></pre>
<!-- /fin:code -->

<!-- fin:verse {"textAlign":"center"} -->
<pre class="fin-block-verse has-text-align-center">Come<br>Home.</pre>
<!-- /fin:verse -->`;

export const mediaBlocks = `<!-- fin:image -->
<figure class="fin-block-image"><img alt=""/></figure>
<!-- /fin:image -->

<!-- fin:image -->
<figure class="fin-block-image"><img src="https://cldup.com/cXyG__fTLN.jpg" alt=""/><figcaption class="fin-element-caption">Mountain</figcaption></figure>
<!-- /fin:image -->

<!-- fin:video {"id":683} -->
<figure class="fin-block-video"><video controls src="https://i.cloudup.com/YtZFJbuQCE.mov"></video><figcaption class="fin-element-caption">Videos too!</figcaption></figure>
<!-- /fin:video -->

<!-- fin:file /-->

<!-- fin:file {"id":3,"href":"https://finpress.org/latest.zip"} -->
<div class="fin-block-file"><a href="https://finpress.org/latest.zip">FinPress.zip</a><a href="https://finpress.org/latest.zip" class="fin-block-file__button fin-element-button" download>Download</a></div>
<!-- /fin:file -->

<!-- fin:audio /-->

<!-- fin:audio {"id":5} -->
<figure class="fin-block-audio"><audio controls src="https://cldup.com/59IrU0WJtq.mp3"></audio></figure>
<!-- /fin:audio -->

<!-- fin:gallery {"columns":8,"linkTo":"none","className":"alignfull"} -->
<figure class="fin-block-gallery has-nested-images columns-8 is-cropped alignfull"><!-- fin:image {"sizeSlug":"large","linkDestination":"none"} -->
<figure class="fin-block-image size-large"><img src="https://finpress.org/gutenberg/files/2018/07/Block-Icon.png" alt=""/><figcaption class="fin-element-caption">Paragraph</figcaption></figure>
<!-- /fin:image -->

<!-- fin:image {"sizeSlug":"large","linkDestination":"none"} -->
<figure class="fin-block-image size-large"><img src="https://finpress.org/gutenberg/files/2018/07/Block-Icon-Heading.png" alt=""/><figcaption class="fin-element-caption">Heading</figcaption></figure>
<!-- /fin:image -->

<!-- fin:image {"sizeSlug":"large","linkDestination":"none"} -->
<figure class="fin-block-image size-large"><img src="https://finpress.org/gutenberg/files/2018/07/Block-Icon-Subheading.png" alt=""/><figcaption class="fin-element-caption">Subheading</figcaption></figure>
<!-- /fin:image -->

<!-- fin:image {"sizeSlug":"large","linkDestination":"none"} -->
<figure class="fin-block-image size-large"><img src="https://finpress.org/gutenberg/files/2018/07/Block-Icon-Quote.png" alt=""/><figcaption class="fin-element-caption">Quote</figcaption></figure>
<!-- /fin:image -->

<!-- fin:image {"sizeSlug":"large","linkDestination":"none"} -->
<figure class="fin-block-image size-large"><img src="https://finpress.org/gutenberg/files/2018/07/Block-Icon-Image.png" alt=""/><figcaption class="fin-element-caption">Image</figcaption></figure>
<!-- /fin:image -->

<!-- fin:image {"sizeSlug":"large","linkDestination":"none"} -->
<figure class="fin-block-image size-large"><img src="https://finpress.org/gutenberg/files/2018/07/Block-Icon-Gallery.png" alt=""/><figcaption class="fin-element-caption">Gallery</figcaption></figure>
<!-- /fin:image -->

<!-- fin:image {"sizeSlug":"large","linkDestination":"none"} -->
<figure class="fin-block-image size-large"><img src="https://finpress.org/gutenberg/files/2018/07/Block-Icon-Cover-Image.png" alt=""/><figcaption class="fin-element-caption">Cover Image</figcaption></figure>
<!-- /fin:image -->

<!-- fin:image {"sizeSlug":"large","linkDestination":"none"} -->
<figure class="fin-block-image size-large"><img src="https://finpress.org/gutenberg/files/2018/07/Block-Icon-Video.png" alt=""/><figcaption class="fin-element-caption">Video</figcaption></figure>
<!-- /fin:image -->

<!-- fin:image {"sizeSlug":"large","linkDestination":"none"} -->
<figure class="fin-block-image size-large"><img src="https://finpress.org/gutenberg/files/2018/07/Block-Icon-Audio.png" alt=""/><figcaption class="fin-element-caption">Audio</figcaption></figure>
<!-- /fin:image -->

<!-- fin:image {"sizeSlug":"large","linkDestination":"none"} -->
<figure class="fin-block-image size-large"><img src="https://finpress.org/gutenberg/files/2018/07/Block-Icon-Column.png" alt=""/><figcaption class="fin-element-caption">Columns</figcaption></figure>
<!-- /fin:image -->

<!-- fin:image {"sizeSlug":"large","linkDestination":"none"} -->
<figure class="fin-block-image size-large"><img src="https://finpress.org/gutenberg/files/2018/07/Block-Icon-File.png" alt=""/><figcaption class="fin-element-caption">File</figcaption></figure>
<!-- /fin:image -->

<!-- fin:image {"sizeSlug":"large","linkDestination":"none"} -->
<figure class="fin-block-image size-large"><img src="https://finpress.org/gutenberg/files/2018/07/Block-Icon-Code.png" alt=""/><figcaption class="fin-element-caption">Code</figcaption></figure>
<!-- /fin:image -->

<!-- fin:image {"sizeSlug":"large","linkDestination":"none"} -->
<figure class="fin-block-image size-large"><img src="https://finpress.org/gutenberg/files/2018/07/Block-Icon-List.png" alt=""/><figcaption class="fin-element-caption">List</figcaption></figure>
<!-- /fin:image -->

<!-- fin:image {"sizeSlug":"large","linkDestination":"none"} -->
<figure class="fin-block-image size-large"><img src="https://finpress.org/gutenberg/files/2018/07/Block-Icon-Button.png" alt=""/><figcaption class="fin-element-caption">Button</figcaption></figure>
<!-- /fin:image -->

<!-- fin:image {"sizeSlug":"large","linkDestination":"none"} -->
<figure class="fin-block-image size-large"><img src="https://finpress.org/gutenberg/files/2018/07/Block-Icon-Embeds.png" alt=""/><figcaption class="fin-element-caption">Embeds</figcaption></figure>
<!-- /fin:image -->

<!-- fin:image {"sizeSlug":"large","linkDestination":"none"} -->
<figure class="fin-block-image size-large"><img src="https://finpress.org/gutenberg/files/2018/07/Block-Icon-More.png" alt=""/><figcaption class="fin-element-caption">More</figcaption></figure>
<!-- /fin:image --></figure>
<!-- /fin:gallery -->

<!-- fin:media-text {"isStackedOnMobile":false,"className":"is-stacked-on-mobile"} -->
<div class="fin-block-media-text alignwide is-stacked-on-mobile"><figure class="fin-block-media-text__media"></figure><div class="fin-block-media-text__content"><!-- fin:paragraph {"className":"has-large-font-size"} -->
<p class="has-large-font-size"></p>
<!-- /fin:paragraph --></div></div>
<!-- /fin:media-text -->

<!-- fin:cover {"url":"https://cldup.com/cXyG__fTLN.jpg","id":890,"dimRatio":20,"overlayColor":"luminous-vivid-orange","focalPoint":{"x":"0.63","y":"0.83"},"minHeight":219} -->
<div class="fin-block-cover" style="min-height:219px"><span aria-hidden="true" class="fin-block-cover__background has-luminous-vivid-orange-background-color has-background-dim-20 has-background-dim"></span><img class="fin-block-cover__image-background fin-image-890" alt="" src="https://cldup.com/cXyG__fTLN.jpg" style="object-position:63% 83%" data-object-fit="cover" data-object-position="63% 83%"/><div class="fin-block-cover__inner-container"><!-- fin:paragraph {"align":"center","placeholder":"Write title…","className":"has-text-color has-very-light-gray-color","fontSize":"large"} -->
<p class="has-text-align-center has-text-color has-very-light-gray-color has-large-font-size">Cool cover</p>
<!-- /fin:paragraph --></div></div>
<!-- /fin:cover -->
`;

export const otherBlocks = `
<!-- fin:nextpage -->
<!--nextpage-->
<!-- /fin:nextpage -->

<!-- fin:more -->
<!--more-->
<!-- /fin:more -->

<!-- fin:spacer -->
<div style="height:100px" aria-hidden="true" class="fin-block-spacer"></div>
<!-- /fin:spacer -->

<!-- fin:group -->
<div id="this-is-another-anchor" class="fin-block-group"><!-- fin:paragraph -->
<p>One.</p>
<!-- /fin:paragraph -->

<!-- fin:paragraph -->
<p>Two</p>
<!-- /fin:paragraph -->

<!-- fin:paragraph -->
<p>Three.</p>
<!-- /fin:paragraph --></div>
<!-- /fin:group -->

<!-- fin:columns {"className":"gutenberg-landing\u002d\u002ddevelopers-columns has-2-columns"} -->
<div class="fin-block-columns gutenberg-landing--developers-columns has-2-columns"><!-- fin:column -->
<div class="fin-block-column"><!-- fin:paragraph {"align":"left"} -->
<p class="has-text-align-left"><strong>Built with modern technology.</strong></p>
<!-- /fin:paragraph -->

<!-- fin:paragraph {"align":"left"} -->
<p class="has-text-align-left">Gutenberg was developed on GitHub using the FinPress REST API, JavaScript, and React.</p>
<!-- /fin:paragraph -->

<!-- fin:paragraph {"align":"left","fontSize":"small"} -->
<p class="has-text-align-left has-small-font-size"><a href="https://finpress.org/gutenberg/handbook/language/">Learn more</a></p>
<!-- /fin:paragraph --></div>
<!-- /fin:column -->

<!-- fin:column -->
<div class="fin-block-column"><!-- fin:paragraph {"align":"left"} -->
<p class="has-text-align-left"><strong>Designed for compatibility.</strong></p>
<!-- /fin:paragraph -->

<!-- fin:paragraph {"align":"left"} -->
<p class="has-text-align-left">We recommend migrating features to blocks, but support for existing FinPress functionality remains. There will be transition paths for shortcodes, meta-boxes, and Custom Post Types.</p>
<!-- /fin:paragraph -->

<!-- fin:paragraph {"align":"left","fontSize":"small"} -->
<p class="has-text-align-left has-small-font-size"><a href="https://finpress.org/gutenberg/handbook/reference/faq/">Learn more</a></p>
<!-- /fin:paragraph --></div>
<!-- /fin:column --></div>
<!-- /fin:columns -->

<!-- fin:latest-posts {"displayPostContent":true,"displayPostDate":true} /-->

<!-- fin:buttons -->
<div class="fin-block-buttons"><!-- fin:button -->
<div class="fin-block-button"><a class="fin-block-button__link fin-element-button">Solid Button</a></div>
<!-- /fin:button -->

<!-- fin:button {"gradient":"luminous-vivid-amber-to-luminous-vivid-orange"} -->
<div class="fin-block-button"><a class="fin-block-button__link has-luminous-vivid-amber-to-luminous-vivid-orange-gradient-background has-background fin-element-button">Gradient Button</a></div>
<!-- /fin:button --></div>
<!-- /fin:buttons -->

<!-- fin:shortcode -->
[youtube https://www.youtube.com/watch?v=ssfHW5lwFZg]
<!-- /fin:shortcode -->

<!-- fin:rss /-->
`;

export default textBlocks + mediaBlocks + otherBlocks;
