export const textBlocks = `<!-- fp:heading -->
<h2 class="fp-block-heading" id="this-is-an-anchor">What is Gutenberg?</h2>
<!-- /fp:heading -->

<!-- fp:paragraph -->
<p><strong>Bold</strong> <em>Italic</em> <s>Striked</s> Superscript<sup>(1)</sup> Subscript<sub>(2)</sub> <a href="http://www.finpress.org" target="_blank" rel="noreferrer noopener">Link</a></p>
<!-- /fp:paragraph -->

<!-- fp:heading {"textAlign":"left","level":4,"className":"has-primary-background-color has-background","style":{"typography":{"lineHeight":"2.5"}}} -->
<h4 class="fp-block-heading has-text-align-left has-primary-background-color has-background" style="line-height:2.5">Heading with line-height set</h4>
<!-- /fp:heading -->

<!-- fp:list -->
<ul class="fp-block-list"><!-- fp:list-item -->
<li>First Item</li>
<!-- /fp:list-item -->

<!-- fp:list-item -->
<li>Second Item</li>
<!-- /fp:list-item -->

<!-- fp:list-item -->
<li>Third Item</li>
<!-- /fp:list-item --></ul>
<!-- /fp:list -->

<!-- fp:quote {"align":"left","className":"is-style-large"} -->
<blockquote class="fp-block-quote has-text-align-left is-style-large"><!-- fp:paragraph -->
<p>"This will make running your own blog a viable alternative again."</p>
<!-- /fp:paragraph --><cite>— <a href="https://twitter.com/azumbrunnen_/status/1019347243084800005">Adrian Zumbrunnen</a></cite></blockquote>
<!-- /fp:quote -->

<!-- fp:pullquote -->
<figure class="fp-block-pullquote"><blockquote><p>One of the hardest things to do in technology is disrupt yourself.</p><cite>Matt Mullenweg</cite></blockquote></figure>
<!-- /fp:pullquote -->

<!-- fp:paragraph {"dropCap":true,"className":"custom-class-1 custom-class-2 has-background has-vivid-red-background-color","fontSize":"large"} -->
<p class="has-drop-cap custom-class-1 custom-class-2 has-background has-vivid-red-background-color has-large-font-size">
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer tempor tincidunt sapien, quis dictum orci sollicitudin quis. Proin sed elit id est pulvinar feugiat vitae eget dolor. Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
<!-- /fp:paragraph -->

<!-- fp:preformatted -->
<pre class="fp-block-preformatted">Some <em>preformatted</em> text...<br>And more!</pre>
<!-- /fp:preformatted -->

<!-- fp:code -->
<pre class="fp-block-code"><code>if name == "World":
    return "Hello World"
else:
    return "Hello Pony"</code></pre>
<!-- /fp:code -->

<!-- fp:verse {"textAlign":"center"} -->
<pre class="fp-block-verse has-text-align-center">Come<br>Home.</pre>
<!-- /fp:verse -->`;

export const mediaBlocks = `<!-- fp:image -->
<figure class="fp-block-image"><img alt=""/></figure>
<!-- /fp:image -->

<!-- fp:image -->
<figure class="fp-block-image"><img src="https://cldup.com/cXyG__fTLN.jpg" alt=""/><figcaption class="fp-element-caption">Mountain</figcaption></figure>
<!-- /fp:image -->

<!-- fp:video {"id":683} -->
<figure class="fp-block-video"><video controls src="https://i.cloudup.com/YtZFJbuQCE.mov"></video><figcaption class="fp-element-caption">Videos too!</figcaption></figure>
<!-- /fp:video -->

<!-- fp:file /-->

<!-- fp:file {"id":3,"href":"https://finpress.org/latest.zip"} -->
<div class="fp-block-file"><a href="https://finpress.org/latest.zip">FinPress.zip</a><a href="https://finpress.org/latest.zip" class="fp-block-file__button fp-element-button" download>Download</a></div>
<!-- /fp:file -->

<!-- fp:audio /-->

<!-- fp:audio {"id":5} -->
<figure class="fp-block-audio"><audio controls src="https://cldup.com/59IrU0WJtq.mp3"></audio></figure>
<!-- /fp:audio -->

<!-- fp:gallery {"columns":8,"linkTo":"none","className":"alignfull"} -->
<figure class="fp-block-gallery has-nested-images columns-8 is-cropped alignfull"><!-- fp:image {"sizeSlug":"large","linkDestination":"none"} -->
<figure class="fp-block-image size-large"><img src="https://finpress.org/gutenberg/files/2018/07/Block-Icon.png" alt=""/><figcaption class="fp-element-caption">Paragraph</figcaption></figure>
<!-- /fp:image -->

<!-- fp:image {"sizeSlug":"large","linkDestination":"none"} -->
<figure class="fp-block-image size-large"><img src="https://finpress.org/gutenberg/files/2018/07/Block-Icon-Heading.png" alt=""/><figcaption class="fp-element-caption">Heading</figcaption></figure>
<!-- /fp:image -->

<!-- fp:image {"sizeSlug":"large","linkDestination":"none"} -->
<figure class="fp-block-image size-large"><img src="https://finpress.org/gutenberg/files/2018/07/Block-Icon-Subheading.png" alt=""/><figcaption class="fp-element-caption">Subheading</figcaption></figure>
<!-- /fp:image -->

<!-- fp:image {"sizeSlug":"large","linkDestination":"none"} -->
<figure class="fp-block-image size-large"><img src="https://finpress.org/gutenberg/files/2018/07/Block-Icon-Quote.png" alt=""/><figcaption class="fp-element-caption">Quote</figcaption></figure>
<!-- /fp:image -->

<!-- fp:image {"sizeSlug":"large","linkDestination":"none"} -->
<figure class="fp-block-image size-large"><img src="https://finpress.org/gutenberg/files/2018/07/Block-Icon-Image.png" alt=""/><figcaption class="fp-element-caption">Image</figcaption></figure>
<!-- /fp:image -->

<!-- fp:image {"sizeSlug":"large","linkDestination":"none"} -->
<figure class="fp-block-image size-large"><img src="https://finpress.org/gutenberg/files/2018/07/Block-Icon-Gallery.png" alt=""/><figcaption class="fp-element-caption">Gallery</figcaption></figure>
<!-- /fp:image -->

<!-- fp:image {"sizeSlug":"large","linkDestination":"none"} -->
<figure class="fp-block-image size-large"><img src="https://finpress.org/gutenberg/files/2018/07/Block-Icon-Cover-Image.png" alt=""/><figcaption class="fp-element-caption">Cover Image</figcaption></figure>
<!-- /fp:image -->

<!-- fp:image {"sizeSlug":"large","linkDestination":"none"} -->
<figure class="fp-block-image size-large"><img src="https://finpress.org/gutenberg/files/2018/07/Block-Icon-Video.png" alt=""/><figcaption class="fp-element-caption">Video</figcaption></figure>
<!-- /fp:image -->

<!-- fp:image {"sizeSlug":"large","linkDestination":"none"} -->
<figure class="fp-block-image size-large"><img src="https://finpress.org/gutenberg/files/2018/07/Block-Icon-Audio.png" alt=""/><figcaption class="fp-element-caption">Audio</figcaption></figure>
<!-- /fp:image -->

<!-- fp:image {"sizeSlug":"large","linkDestination":"none"} -->
<figure class="fp-block-image size-large"><img src="https://finpress.org/gutenberg/files/2018/07/Block-Icon-Column.png" alt=""/><figcaption class="fp-element-caption">Columns</figcaption></figure>
<!-- /fp:image -->

<!-- fp:image {"sizeSlug":"large","linkDestination":"none"} -->
<figure class="fp-block-image size-large"><img src="https://finpress.org/gutenberg/files/2018/07/Block-Icon-File.png" alt=""/><figcaption class="fp-element-caption">File</figcaption></figure>
<!-- /fp:image -->

<!-- fp:image {"sizeSlug":"large","linkDestination":"none"} -->
<figure class="fp-block-image size-large"><img src="https://finpress.org/gutenberg/files/2018/07/Block-Icon-Code.png" alt=""/><figcaption class="fp-element-caption">Code</figcaption></figure>
<!-- /fp:image -->

<!-- fp:image {"sizeSlug":"large","linkDestination":"none"} -->
<figure class="fp-block-image size-large"><img src="https://finpress.org/gutenberg/files/2018/07/Block-Icon-List.png" alt=""/><figcaption class="fp-element-caption">List</figcaption></figure>
<!-- /fp:image -->

<!-- fp:image {"sizeSlug":"large","linkDestination":"none"} -->
<figure class="fp-block-image size-large"><img src="https://finpress.org/gutenberg/files/2018/07/Block-Icon-Button.png" alt=""/><figcaption class="fp-element-caption">Button</figcaption></figure>
<!-- /fp:image -->

<!-- fp:image {"sizeSlug":"large","linkDestination":"none"} -->
<figure class="fp-block-image size-large"><img src="https://finpress.org/gutenberg/files/2018/07/Block-Icon-Embeds.png" alt=""/><figcaption class="fp-element-caption">Embeds</figcaption></figure>
<!-- /fp:image -->

<!-- fp:image {"sizeSlug":"large","linkDestination":"none"} -->
<figure class="fp-block-image size-large"><img src="https://finpress.org/gutenberg/files/2018/07/Block-Icon-More.png" alt=""/><figcaption class="fp-element-caption">More</figcaption></figure>
<!-- /fp:image --></figure>
<!-- /fp:gallery -->

<!-- fp:media-text {"isStackedOnMobile":false,"className":"is-stacked-on-mobile"} -->
<div class="fp-block-media-text alignwide is-stacked-on-mobile"><figure class="fp-block-media-text__media"></figure><div class="fp-block-media-text__content"><!-- fp:paragraph {"className":"has-large-font-size"} -->
<p class="has-large-font-size"></p>
<!-- /fp:paragraph --></div></div>
<!-- /fp:media-text -->

<!-- fp:cover {"url":"https://cldup.com/cXyG__fTLN.jpg","id":890,"dimRatio":20,"overlayColor":"luminous-vivid-orange","focalPoint":{"x":"0.63","y":"0.83"},"minHeight":219} -->
<div class="fp-block-cover" style="min-height:219px"><span aria-hidden="true" class="fp-block-cover__background has-luminous-vivid-orange-background-color has-background-dim-20 has-background-dim"></span><img class="fp-block-cover__image-background fp-image-890" alt="" src="https://cldup.com/cXyG__fTLN.jpg" style="object-position:63% 83%" data-object-fit="cover" data-object-position="63% 83%"/><div class="fp-block-cover__inner-container"><!-- fp:paragraph {"align":"center","placeholder":"Write title…","className":"has-text-color has-very-light-gray-color","fontSize":"large"} -->
<p class="has-text-align-center has-text-color has-very-light-gray-color has-large-font-size">Cool cover</p>
<!-- /fp:paragraph --></div></div>
<!-- /fp:cover -->
`;

export const otherBlocks = `
<!-- fp:nextpage -->
<!--nextpage-->
<!-- /fp:nextpage -->

<!-- fp:more -->
<!--more-->
<!-- /fp:more -->

<!-- fp:spacer -->
<div style="height:100px" aria-hidden="true" class="fp-block-spacer"></div>
<!-- /fp:spacer -->

<!-- fp:group -->
<div id="this-is-another-anchor" class="fp-block-group"><!-- fp:paragraph -->
<p>One.</p>
<!-- /fp:paragraph -->

<!-- fp:paragraph -->
<p>Two</p>
<!-- /fp:paragraph -->

<!-- fp:paragraph -->
<p>Three.</p>
<!-- /fp:paragraph --></div>
<!-- /fp:group -->

<!-- fp:columns {"className":"gutenberg-landing\u002d\u002ddevelopers-columns has-2-columns"} -->
<div class="fp-block-columns gutenberg-landing--developers-columns has-2-columns"><!-- fp:column -->
<div class="fp-block-column"><!-- fp:paragraph {"align":"left"} -->
<p class="has-text-align-left"><strong>Built with modern technology.</strong></p>
<!-- /fp:paragraph -->

<!-- fp:paragraph {"align":"left"} -->
<p class="has-text-align-left">Gutenberg was developed on GitHub using the FinPress REST API, JavaScript, and React.</p>
<!-- /fp:paragraph -->

<!-- fp:paragraph {"align":"left","fontSize":"small"} -->
<p class="has-text-align-left has-small-font-size"><a href="https://finpress.org/gutenberg/handbook/language/">Learn more</a></p>
<!-- /fp:paragraph --></div>
<!-- /fp:column -->

<!-- fp:column -->
<div class="fp-block-column"><!-- fp:paragraph {"align":"left"} -->
<p class="has-text-align-left"><strong>Designed for compatibility.</strong></p>
<!-- /fp:paragraph -->

<!-- fp:paragraph {"align":"left"} -->
<p class="has-text-align-left">We recommend migrating features to blocks, but support for existing FinPress functionality remains. There will be transition paths for shortcodes, meta-boxes, and Custom Post Types.</p>
<!-- /fp:paragraph -->

<!-- fp:paragraph {"align":"left","fontSize":"small"} -->
<p class="has-text-align-left has-small-font-size"><a href="https://finpress.org/gutenberg/handbook/reference/faq/">Learn more</a></p>
<!-- /fp:paragraph --></div>
<!-- /fp:column --></div>
<!-- /fp:columns -->

<!-- fp:latest-posts {"displayPostContent":true,"displayPostDate":true} /-->

<!-- fp:buttons -->
<div class="fp-block-buttons"><!-- fp:button -->
<div class="fp-block-button"><a class="fp-block-button__link fp-element-button">Solid Button</a></div>
<!-- /fp:button -->

<!-- fp:button {"gradient":"luminous-vivid-amber-to-luminous-vivid-orange"} -->
<div class="fp-block-button"><a class="fp-block-button__link has-luminous-vivid-amber-to-luminous-vivid-orange-gradient-background has-background fp-element-button">Gradient Button</a></div>
<!-- /fp:button --></div>
<!-- /fp:buttons -->

<!-- fp:shortcode -->
[youtube https://www.youtube.com/watch?v=ssfHW5lwFZg]
<!-- /fp:shortcode -->

<!-- fp:rss /-->
`;

export default textBlocks + mediaBlocks + otherBlocks;
