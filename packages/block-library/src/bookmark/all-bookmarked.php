<?php
/**
 * Block Template: All Bookmarked Posts Page.
 */
ob_start();
include get_query_template( 'page' ) ?: get_query_template( 'index' );
$theme_content = ob_get_clean();

$custom_content  = '<div class="is-layout-constrained">';
$custom_content .= '<h1>Your Liked Posts</h1>';

if ( is_user_logged_in() ) {

    // Fetch user's liked posts.
    $current_user_id = get_current_user_id();
    $liked_posts    = get_user_meta( $current_user_id, 'liked_posts', true ) ?: [];
    $paged = get_query_var( 'paged' ) ? get_query_var( 'paged' ) : 1;

    $query = new WP_Query( array(
        'post_type'      => 'any',
        'post__in'       => ! empty( $liked_posts ) ? array_map( 'intval', $liked_posts ) : [0],
        'orderby'        => 'post__in',
        'posts_per_page' => 10,
        'paged'          => $paged,
    ) );

    if ( $query->have_posts() ) {
        $custom_content .= '<ul class="favorites-list">';
        while ( $query->have_posts() ) {
            $query->the_post();
            $custom_content .= '<li><h2><a href="' . get_permalink() . '">' . get_the_title() . '</a></h2></li>';
        }
        $custom_content .= '</ul>';

        $custom_content .= '<div class="pagination">';

        $big = 999999999; // Need an unlikely integer for pagination base.
        $custom_content .= paginate_links(
            array(
                'base'      => str_replace( $big, '%#%', esc_url( get_pagenum_link( $big ) ) ),
                'format'    => '?paged=%#%',
                'current'   => max( 1, $paged ),
                'total'     => $query->max_num_pages,
                'prev_text' => '« Previous',
                'next_text' => 'Next »',
            )
        );
        $custom_content .= '</div>';

        wp_reset_postdata();
    } else {
        $custom_content .= '<p>No liked posts found.</p>';
    }
} else {
    // Needed to inject liked posts using js when user is not logged in.
    $custom_content .= '<ul id="liked-posts" class="liked-posts"></ul>';
}

$custom_content .= '</div>';

// Inject custom content before `</main>` tag (assuming the theme follows standard structure).
$theme_content = preg_replace( '/(<\/main>)/i', $custom_content . '$1', $theme_content, 1 );

echo $theme_content;
