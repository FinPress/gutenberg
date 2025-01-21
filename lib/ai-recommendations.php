<?php
/**
 * AI Recommendations API Endpoint for Gutenberg.
 */

// Register the REST API route.
add_action( 'rest_api_init', function () {
    register_rest_route( 'gutenberg/v1', '/ai-recommendations', array(
        'methods'  => 'POST',
        'callback' => 'get_ai_recommendations',
        'permission_callback' => '__return_true',
    ) );
} );

/**
 * Callback function to fetch AI recommendations.
 *
 * @param WP_REST_Request $request The request object.
 * @return WP_REST_Response|WP_Error The response object or an error.
 */
function get_ai_recommendations( $request ) {
    $content = $request->get_param( 'content' );

    // Ensure content is provided.
    if ( empty( $content ) ) {
        return new WP_Error( 'missing_content', 'Content parameter is required.', array( 'status' => 400 ) );
    }

    // Make a request to an AI service like OpenAI.
    $response = wp_remote_post( 'https://api.openai.com/v1/completions', array(
        'headers' => array(
            'Authorization' => 'Bearer YOUR_API_KEY', // Replace with your API key.
            'Content-Type'  => 'application/json',
        ),
        'body' => json_encode( array(
            'model'       => 'text-davinci-003',
            'prompt'      => 'Suggest Gutenberg blocks based on the following content: ' . $content,
            'max_tokens'  => 100,
        ) ),
    ) );

    // Handle API errors.
    if ( is_wp_error( $response ) ) {
        return new WP_Error( 'ai_request_failed', 'Failed to fetch AI recommendations.', array( 'status' => 500 ) );
    }

    $body = json_decode( wp_remote_retrieve_body( $response ), true );

    // Return the AI recommendations.
    return rest_ensure_response( $body['choices'][0]['text'] );
}
