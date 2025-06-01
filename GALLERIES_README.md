# ACT Galleries - Adding Photos and Videos

The Galleries page features a toggle between **Photo Harvest** and **Video Stories**, showcasing the beautiful work happening in ACT's community-led initiatives.

## 📸 Adding Photos

### Method 1: Simple File Upload (Recommended for most photos)

1. **Add your photos** to the `public/galleries/photos/` folder
   - Supported formats: `.jpg`, `.jpeg`, `.png`, `.gif`, `.webp`
   - Recommended size: 1200px wide or smaller for web optimization
   - File naming: Use descriptive names like `community-workshop-2024.jpg`

2. **Photos will appear automatically** with:
   - Title: Generated from filename (removes extension, replaces dashes/underscores with spaces)
   - Description: Default ACT-branded description

### Method 2: Custom Metadata (Recommended for curated galleries)

1. **Add your photos** to the `public/galleries/photos/` folder

2. **Create/edit** `public/galleries/photos/metadata.json` with custom titles and descriptions:

```json
[
    {
        "url": "/galleries/photos/your-photo.jpg",
        "title": "Community Wisdom in Action",
        "description": "Elder Mary shares traditional ecological knowledge with young gardeners at Black Cockatoo Valley"
    },
    {
        "url": "/galleries/photos/harvest-celebration.jpg",
        "title": "First Harvest Celebration", 
        "description": "The community celebrates their first harvest - proof that seeds of change can grow into forests of possibility"
    }
]
```

## 🎥 Adding Videos

Videos are managed through the `data/videos.json` file. You have several options:

### Option 1: Using the Video Helper Utility (Easiest)

```javascript
const { createVideoObject } = require('./utils/video-helper');

// Create video object from YouTube URL
const video = createVideoObject({
    url: 'https://www.youtube.com/watch?v=YOUR_VIDEO_ID',
    title: 'Voices from the Field',
    description: 'Community members share their experiences with regenerative innovation',
    duration: '5:42',
    date: 'March 2024'
});

// Add to your videos.json file
```

### Option 2: Direct URL Conversion

**For YouTube videos:**
- Take any YouTube URL: `https://www.youtube.com/watch?v=dQw4w9WgXcQ`
- Convert to embed: `https://www.youtube.com/embed/dQw4w9WgXcQ`

**For Vimeo videos:**
- Take any Vimeo URL: `https://vimeo.com/123456789`
- Convert to embed: `https://player.vimeo.com/video/123456789`

### Option 3: Manual Entry in videos.json

Edit `data/videos.json` directly:

```json
[
    {
        "title": "Your Video Title",
        "description": "A compelling description that reflects ACT's voice and mission",
        "embedCode": "<iframe src=\"https://www.youtube.com/embed/VIDEO_ID\" title=\"Your Video Title\" frameborder=\"0\" allow=\"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture\" allowfullscreen></iframe>",
        "duration": "5:42",
        "date": "March 2024"
    }
]
```

## 🎨 Brand Voice Guidelines for Galleries

### Photo Descriptions
- Focus on community ownership and leadership
- Use agricultural metaphors sparingly but authentically
- Highlight regenerative innovation in action
- Show respect for Indigenous knowledge and practices

**Good examples:**
- "Community members tend to their shared garden, demonstrating how collective care yields abundant harvest"
- "Elders share traditional ecological knowledge with the next generation of land stewards"
- "Celebrating the first fruits of community-led regenerative agriculture"

### Video Descriptions
- Position community members as the experts and leaders
- Frame ACT as facilitator, not hero
- Use authentic voice attributes: Grounded yet Visionary, Humble yet Confident
- Include the impact of the story being shared

**Good examples:**
- "Local innovators demonstrate how waste becomes wealth through community-owned circular manufacturing"
- "First Nations elders teach us how caring for Country creates healing for both land and people"
- "Young entrepreneurs share how the Empathy Ledger is returning storytelling power to their communities"

## 🔧 Technical Details

### Photo Features
- **Responsive grid layout** that adapts to screen size
- **Click to enlarge** - photos open in a modal for detailed viewing
- **Lazy loading** for performance
- **Hover effects** with smooth transitions

### Video Features
- **Responsive iframe embeds** that work on all devices
- **Support for YouTube and Vimeo** (easily extensible)
- **Metadata display** showing duration and date
- **Consistent styling** across platforms

### Performance Optimization
- Photos are lazy-loaded as user scrolls
- Videos only load when the Videos tab is selected
- Responsive images adapt to device capabilities
- Smooth transitions and hover effects

## 📁 File Structure

```
public/galleries/photos/
├── metadata.json          # Optional: Custom photo metadata
├── your-photo-1.jpg      # Your photos go here
├── your-photo-2.jpg
└── another-photo.png

data/
└── videos.json           # Video metadata and embed codes

utils/
└── video-helper.js       # Utility for converting URLs to embeds
```

## 🚀 Quick Start

1. **Add some photos** to `public/galleries/photos/`
2. **Add a video** to `data/videos.json` using the helper utility
3. **Visit** `/galleries` to see your content
4. **Customize** metadata files for better titles and descriptions

The galleries will show "coming soon" messages if no content is found, so you can deploy the page immediately and add content over time.

## 🌱 Content Suggestions

### Photo Categories
- Community workshops and knowledge sharing
- Land restoration and regenerative practices
- Harvest celebrations and community gatherings
- Innovation labs and maker spaces
- Cultural ceremonies and traditional practices
- Before/after transformation shots

### Video Categories
- Community member testimonials
- Behind-the-scenes of projects
- Educational content about regenerative practices
- Cultural storytelling and wisdom sharing
- Innovation showcases
- Partnership announcements

Remember: Every image and video should tell a story of community-led change and regenerative innovation. We're not the heroes of these stories—we're honored to help amplify them. 