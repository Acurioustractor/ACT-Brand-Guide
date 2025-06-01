/**
 * Video Helper Utility
 * Converts video URLs to embed codes for the galleries
 * Includes automatic metadata fetching for Descript videos
 */

const { getDescriptMetadata } = require('./descript-metadata');

/**
 * Convert a YouTube URL to embed code
 * @param {string} url - YouTube URL (e.g., https://www.youtube.com/watch?v=VIDEO_ID)
 * @param {string} title - Video title
 * @returns {string} - Embed code HTML
 */
function youtubeToEmbed(url, title = "Video") {
    // Extract video ID from various YouTube URL formats
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    
    if (!match) {
        throw new Error('Invalid YouTube URL');
    }
    
    const videoId = match[1];
    return `<iframe src="https://www.youtube.com/embed/${videoId}" title="${title}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
}

/**
 * Convert a Vimeo URL to embed code
 * @param {string} url - Vimeo URL (e.g., https://vimeo.com/VIDEO_ID)
 * @param {string} title - Video title
 * @returns {string} - Embed code HTML
 */
function vimeoToEmbed(url, title = "Video") {
    // Extract video ID from Vimeo URL
    const regex = /vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|)(\d+)(?:$|\/|\?)/;
    const match = url.match(regex);
    
    if (!match) {
        throw new Error('Invalid Vimeo URL');
    }
    
    const videoId = match[3];
    return `<iframe src="https://player.vimeo.com/video/${videoId}" title="${title}" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>`;
}

/**
 * Convert a Descript share URL to embed code
 * @param {string} url - Descript share URL (e.g., https://share.descript.com/view/VIDEO_ID)
 * @param {string} title - Video title
 * @returns {string} - Embed code HTML
 */
function descriptToEmbed(url, title = "Video") {
    // Extract video ID from Descript share URL
    const regex = /share\.descript\.com\/view\/([a-zA-Z0-9]+)/;
    const match = url.match(regex);
    
    if (!match) {
        throw new Error('Invalid Descript share URL');
    }
    
    const videoId = match[1];
    return `<iframe src="https://share.descript.com/embed/${videoId}" title="${title}" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen style="width: 100%; height: 100%;"></iframe>`;
}

/**
 * Auto-detect video platform and convert URL to embed code
 * @param {string} url - Video URL
 * @param {string} title - Video title
 * @returns {string} - Embed code HTML
 */
function urlToEmbed(url, title = "Video") {
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
        return youtubeToEmbed(url, title);
    } else if (url.includes('vimeo.com')) {
        return vimeoToEmbed(url, title);
    } else if (url.includes('share.descript.com')) {
        return descriptToEmbed(url, title);
    } else {
        throw new Error('Unsupported video platform. Currently supports YouTube, Vimeo, and Descript.');
    }
}

/**
 * Auto-fetch metadata for Descript videos
 * @param {string} url - Descript share URL
 * @returns {Promise<Object>} - Video metadata including title, description, transcript
 */
async function fetchDescriptVideoMetadata(url) {
    if (!url.includes('share.descript.com')) {
        throw new Error('URL is not a Descript share URL');
    }

    try {
        const metadata = await getDescriptMetadata(url);
        return {
            title: metadata.title,
            description: metadata.description,
            duration: metadata.duration || '',
            transcript: metadata.transcript || '',
            embedCode: descriptToEmbed(url, metadata.title),
            date: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
            source: 'auto-fetched-descript',
            fetchedAt: metadata.extractedAt
        };
    } catch (error) {
        console.warn('Failed to fetch Descript metadata:', error.message);
        throw error;
    }
}

/**
 * Create a complete video object for the videos.json file
 * @param {Object} videoData - Video information
 * @param {string} videoData.url - Video URL
 * @param {string} videoData.title - Video title (optional for Descript URLs - will auto-fetch)
 * @param {string} videoData.description - Video description (optional for Descript URLs - will auto-fetch)
 * @param {string} [videoData.duration] - Video duration (optional)
 * @param {string} [videoData.date] - Video date (optional)
 * @param {boolean} [videoData.autoFetch] - Whether to auto-fetch metadata for Descript URLs (default: true)
 * @returns {Promise<Object>} - Complete video object
 */
async function createVideoObject(videoData) {
    const { url, title, description, duration, date, autoFetch = true } = videoData;
    
    if (!url) {
        throw new Error('URL is required');
    }

    // Auto-fetch metadata for Descript URLs
    if (url.includes('share.descript.com') && autoFetch && (!title || !description)) {
        try {
            console.log('Auto-fetching Descript metadata for:', url);
            const metadata = await fetchDescriptVideoMetadata(url);
            return {
                ...metadata,
                // Override with manually provided values if available
                title: title || metadata.title,
                description: description || metadata.description,
                duration: duration || metadata.duration,
                date: date || metadata.date
            };
        } catch (error) {
            console.warn('Auto-fetch failed, falling back to manual entry');
            // Fall through to manual creation
        }
    }
    
    // Manual creation (fallback or non-Descript URLs)
    if (!title || !description) {
        throw new Error('Title and description are required when not auto-fetching');
    }
    
    return {
        title,
        description,
        embedCode: urlToEmbed(url, title),
        duration: duration || '',
        date: date || new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
        source: 'manual-entry'
    };
}

module.exports = {
    youtubeToEmbed,
    vimeoToEmbed,
    descriptToEmbed,
    urlToEmbed,
    createVideoObject,
    fetchDescriptVideoMetadata
};

// Example usage:
/*
const { createVideoObject } = require('./utils/video-helper');

// Create a video object from a YouTube URL
const video = createVideoObject({
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    title: 'Community Voices',
    description: 'Stories from our regenerative farming initiative',
    duration: '5:42',
    date: 'March 2024'
});

console.log(JSON.stringify(video, null, 2));
*/ 