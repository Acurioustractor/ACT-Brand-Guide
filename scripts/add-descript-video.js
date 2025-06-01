#!/usr/bin/env node

/**
 * Add Descript Video Script
 * Automatically fetches metadata and adds Descript videos to the galleries
 * 
 * Usage:
 *   node scripts/add-descript-video.js https://share.descript.com/view/1yBN4l3yaRL
 *   node scripts/add-descript-video.js https://share.descript.com/view/1yBN4l3yaRL --title "Custom Title" --description "Custom Description"
 */

const fs = require('fs');
const path = require('path');
const { fetchDescriptVideoMetadata } = require('../utils/video-helper');

// Parse command line arguments
const args = process.argv.slice(2);
const url = args[0];

// Parse optional flags
const titleIndex = args.indexOf('--title');
const descriptionIndex = args.indexOf('--description');
const customTitle = titleIndex !== -1 ? args[titleIndex + 1] : null;
const customDescription = descriptionIndex !== -1 ? args[descriptionIndex + 1] : null;

if (!url) {
    console.error('Usage: node scripts/add-descript-video.js <descript-url> [--title "Custom Title"] [--description "Custom Description"]');
    console.error('Example: node scripts/add-descript-video.js https://share.descript.com/view/1yBN4l3yaRL');
    process.exit(1);
}

if (!url.includes('share.descript.com')) {
    console.error('Error: URL must be a Descript share URL');
    process.exit(1);
}

async function addDescriptVideo() {
    try {
        console.log('🌱 Fetching video metadata from Descript...');
        console.log('📹 URL:', url);
        
        // Fetch metadata
        const metadata = await fetchDescriptVideoMetadata(url);
        
        // Override with custom values if provided
        if (customTitle) metadata.title = customTitle;
        if (customDescription) metadata.description = customDescription;
        
        console.log('\n📋 Video Metadata:');
        console.log('  Title:', metadata.title);
        console.log('  Description:', metadata.description);
        console.log('  Duration:', metadata.duration || 'Not available');
        console.log('  Has Transcript:', metadata.transcript ? 'Yes' : 'No');
        console.log('  Source:', metadata.source);
        
        // Load existing videos
        const videosPath = path.join(__dirname, '..', 'data', 'videos.json');
        let videos = [];
        
        if (fs.existsSync(videosPath)) {
            videos = JSON.parse(fs.readFileSync(videosPath, 'utf8'));
        } else {
            // Create data directory if it doesn't exist
            const dataDir = path.dirname(videosPath);
            if (!fs.existsSync(dataDir)) {
                fs.mkdirSync(dataDir, { recursive: true });
            }
        }
        
        // Check if video already exists
        const existingVideo = videos.find(v => 
            v.embedCode && v.embedCode.includes(metadata.embedCode.match(/embed\/([^"]+)/)?.[1])
        );
        
        if (existingVideo) {
            console.log('\n⚠️  Video already exists in galleries');
            console.log('   Existing title:', existingVideo.title);
            process.exit(0);
        }
        
        // Add new video
        videos.push(metadata);
        
        // Save updated videos
        fs.writeFileSync(videosPath, JSON.stringify(videos, null, 2));
        
        console.log('\n✅ Video added successfully!');
        console.log('🌿 Your video seed has been planted in the galleries');
        console.log('🚀 Start the server (npm start) and visit /galleries to see it grow');
        
        // Show transcript preview if available
        if (metadata.transcript) {
            const preview = metadata.transcript.substring(0, 200);
            console.log('\n📝 Transcript Preview:');
            console.log(`   "${preview}${metadata.transcript.length > 200 ? '...' : ''}"`);
        }
        
    } catch (error) {
        console.error('\n❌ Error adding video:', error.message);
        console.error('\n🔧 Troubleshooting:');
        console.error('   • Make sure the Descript URL is publicly accessible');
        console.error('   • Check your internet connection');
        console.error('   • Try running the server and using the web interface instead');
        console.error('   • If the issue persists, you can manually add the video to data/videos.json');
        process.exit(1);
    }
}

// Add some ACT-style branding to the output
console.log('🚜 A Curious Tractor - Video Planting Tool');
console.log('   Cultivating digital stories from Descript seeds\n');

addDescriptVideo(); 