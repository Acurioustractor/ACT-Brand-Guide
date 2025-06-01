const { createVideoObject } = require('./utils/video-helper');

// Your Descript video
const newVideo = createVideoObject({
    url: 'https://share.descript.com/view/1yBN4l3yaRL',
    title: 'Your Video Title Here',
    description: 'A compelling description that reflects ACT\'s voice - what story does this video tell about community-led innovation?',
    duration: '3:45', // Update with actual duration
    date: 'December 2024'
});

console.log('Add this to your data/videos.json file:');
console.log(JSON.stringify(newVideo, null, 4));

// Example of how it would look in the full videos.json:
const fs = require('fs');
const path = require('path');

// Read existing videos
const videosFile = path.join(__dirname, 'data', 'videos.json');
let existingVideos = [];

if (fs.existsSync(videosFile)) {
    existingVideos = JSON.parse(fs.readFileSync(videosFile, 'utf8'));
}

// Add new video
existingVideos.push(newVideo);

// Write back to file
fs.writeFileSync(videosFile, JSON.stringify(existingVideos, null, 2));

console.log('\n✅ Video added to videos.json!');
console.log('🌐 Visit http://localhost:3000/galleries to see it in action'); 