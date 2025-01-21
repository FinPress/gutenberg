import { Button } from '@wordpress/components';
import { useState } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';

function AIPanel() {
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchRecommendations = async () => {
        setLoading(true);
        const content = wp.data.select('core/editor').getEditedPostContent();
        try {
            const response = await apiFetch({
                path: '/gutenberg/v1/ai-recommendations',
                method: 'POST',
                data: { content },
            });
            const blocks = response.split('\n').filter(Boolean);
            setRecommendations(blocks);
        } catch (error) {
            console.error('Failed to fetch AI recommendations:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="ai-panel">
            <h3>AI Recommendations</h3>
            <Button isPrimary onClick={fetchRecommendations} disabled={loading}>
                {loading ? 'Fetching...' : 'Get Recommendations'}
            </Button>
            <ul>
                {recommendations.map((block, index) => (
                    <li key={index}>{block}</li>
                ))}
            </ul>
        </div>
    );
}

export default AIPanel;
