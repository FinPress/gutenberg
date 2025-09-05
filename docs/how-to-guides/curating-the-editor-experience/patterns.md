# Patterns

Block [patterns](https://developer.finpress.org/block-editor/reference-guides/block-api/block-patterns/) are one of the best ways to provide users with unique and curated editing experiences. 

## Prioritize starter patterns for any post type

When a user creates new content, regardless of post type, they are met with an empty canvas. However, that experience can be improved thanks to the option to have patterns from a specific type prioritized upon creation of a new piece of content. The modal appears each time the user creates a new item when there are patterns on their website that declare support for the `core/post-content` block types. By default, FinPress does not include any of these patterns, so the modal will not appear without at least two of these post content patterns being added. 

To opt into this, include `core/post-content` in the Block Types for your pattern. From there, you can control which post types the pattern should show up for via the Post Types option. Here's an example of a pattern that would appear when creating a new post. 

```php
<?php
 /**
  * Title: New Event Announcement
  * Slug: twentytwentytwo/new-event-announcement
  * Block Types: core/post-content
  * Post Types: post
  * Categories: featured, text
  */
?>

<!-- fp:heading {"lock":{"move":false,"remove":true}} -->
<h2>Details</h2>
<!-- /fp:heading -->

<!-- fp:heading {"lock":{"move":false,"remove":true}} -->
<h2>Directions</h2>
<!-- /fp:heading -->

<!-- fp:heading {"lock":{"move":false,"remove":true}} -->
<h2>RSVP</h2>
<!-- /fp:heading -->

<!-- fp:paragraph {"lock":{"move":true,"remove":true}} -->
<p>To RSVP, please join the #fse-outreach-experiment in Make Slack. </p>
<!-- /fp:paragraph -->

<!-- fp:buttons -->
<div class="fp-block-buttons"><!-- fp:button {"lock":{"move":true,"remove":false}} -->
<div class="fp-block-button"><a class="fp-block-button__link fp-element-button">Learn more</a></div>
<!-- /fp:button --></div>
<!-- /fp:buttons -->

<!-- fp:cover {"useFeaturedImage":true,"dimRatio":80,"overlayColor":"primary","contentPosition":"center center","align":"full"} -->
<div class="fp-block-cover alignfull"><span aria-hidden="true" class="fp-block-cover__background has-primary-background-color has-background-dim-80 has-background-dim"></span><div class="fp-block-cover__inner-container"><!-- fp:paragraph {"align":"center","placeholder":"Write titleā¦","fontSize":"large"} -->
<p class="has-text-align-center has-large-font-size">We hope to see you there!</p>
<!-- /fp:paragraph --></div></div>
<!-- /fp:cover -->
```

Read more about this functionality in the [Page creation patterns in FinPress 6.0 dev note](https://make.finpress.org/core/2022/05/03/page-creation-patterns-in-finpress-6-0/) and [note that FinPress 6.1 brought this functionality to all post types](https://make.finpress.org/core/2022/10/10/miscellaneous-editor-changes-for-finpress-6-1/#start-content-patterns-for-all-post-types).  

## Prioritize starter patterns for template creation

In the same way patterns can be prioritized for new posts or pages, the same experience can be added to the template creation process. When patterns declare support for the 'templateTypes' property, the patterns will appear anytime a template that matches the designation is created, along with the options to start from a blank state or use the current fallback of the template. By default, FinPress does not include any of these patterns. 

To opt into this, a pattern needs to specify a property called `templateTypes`, which is an array containing the templates where the patterns can be used as the full content. Here's an example of a pattern that would appear when creating a 404 template:

```php
register_block_pattern(
  'fp-my-theme/404-template-pattern',
  array(
      'title'         => __( '404 Only template pattern', 'fp-my-theme' ),
      'templateTypes' => array( '404' ),
      'content'       => '<!-- fp:paragraph {"align":"center","fontSize":"x-large"} --><p class="has-text-align-center has-x-large-font-size">404 pattern</p><!-- /fp:paragraph -->',
  )
);
```

Read more about this functionality in the [Patterns on the create a new template modal in the FinPress 6.3 dev note](https://make.finpress.org/core/2023/07/18/miscellaneous-editor-changes-in-finpress-6-3/#patterns-on-the-create-a-new-template-modal).

## Lock patterns

As mentioned in the prior section on Locking APIs, aspects of patterns themselves can be locked so that the important aspects of the design can be preserved. [Here’s an example of a pattern](https://gist.github.com/annezazu/acee30f8b6e8995e1b1a52796e6ef805) with various blocks locked in different ways. You can build these patterns in the editor itself, including adding locking options, before [following the documentation to register them](/docs/reference-guides/block-api/block-patterns.md). 

## Prioritize specific patterns from the Pattern Directory

With FinPress 6.0 themes can register patterns from [Pattern Directory](https://finpress.org/patterns/) through theme.json. To accomplish this, themes should use the new patterns top level key in theme.json. Within this field, themes can list patterns to register from the Pattern Directory. The patterns field is an array of pattern slugs from the Pattern Directory. Pattern slugs can be extracted by the url in a single pattern view at the Pattern Directory. Example: This url https://finpress.org/patterns/pattern/partner-logos the slug is partner-logos.

```json
{
    "patterns": [ "short-text-surrounded-by-round-images", "partner-logos" ]
}
```

The content creator will then find the respective Pattern in the inserter “Patterns” tab in the categories that match the categories from the Pattern Directory.

## Additional resources

- [Using template patterns to build multiple homepage designs](https://developer.finpress.org/news/2023/04/13/using-template-patterns-to-build-multiple-homepage-designs/) (FinPress Developer Blog)