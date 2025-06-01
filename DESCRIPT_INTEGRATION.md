# 🎥 Descript Video Integration

The ACT Brand Guide website now includes automatic integration with Descript videos, allowing you to easily add video content with auto-fetched metadata including titles, descriptions, and transcripts.

## 🌱 Features

- **Automatic Metadata Extraction**: Fetches title, description, duration, and transcript data from Descript share URLs
- **Multiple Addition Methods**: Web interface, command-line tool, or direct API calls
- **Brand Voice Integration**: Automatically applies ACT's authentic voice to video descriptions when auto-generating
- **Duplicate Prevention**: Checks for existing videos to avoid duplicates
- **Fallback Support**: Graceful handling when metadata can't be fetched

## 🚜 Quick Start

### Method 1: Web Interface (Easiest)

1. Visit `/galleries` on your website
2. Press `Ctrl+Shift+A` to reveal the admin panel
3. Double-click the green seed icon (🌱) that appears
4. Paste your Descript share URL (e.g., `https://share.descript.com/view/1yBN4l3yaRL`)
5. Optionally override the title/description
6. Click "🚜 Plant Video"

### Method 2: Command Line Tool

```bash
# Basic usage - auto-fetch everything
node scripts/add-descript-video.js https://share.descript.com/view/1yBN4l3yaRL

# With custom title and description
node scripts/add-descript-video.js https://share.descript.com/view/1yBN4l3yaRL \
  --title "Community Voices from the Field" \
  --description "Stories of regenerative farming wisdom shared by our community partners"
```

### Method 3: API Integration

```javascript
// POST to /api/descript-metadata
const response = await fetch('/api/descript-metadata', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    url: 'https://share.descript.com/view/1yBN4l3yaRL',
    title: 'Optional custom title',
    description: 'Optional custom description'
  })
});

const result = await response.json();
console.log(result.metadata);
```

## 📋 Supported Data Fields

The integration automatically extracts and formats:

- **Title**: Video title from Descript project
- **Description**: Project description (with ACT voice if auto-generated)
- **Duration**: Video length in human-readable format
- **Transcript**: Full transcript text (when available)
- **Embed Code**: Properly formatted HTML for display
- **Date**: Current date in "Month Year" format
- **Source**: Indicates auto-fetched vs manual entry

## 🛠️ Technical Details

### How It Works

1. **URL Parsing**: Extracts project ID from Descript share URLs
2. **Metadata Scraping**: Attempts to fetch public metadata from the Descript page
3. **Fallback Generation**: Creates meaningful defaults when data isn't available
4. **Brand Voice**: Applies ACT's authentic voice to auto-generated descriptions
5. **Storage**: Saves to `data/videos.json` with proper formatting

### API Limitations

Currently, Descript's public API (docs.descriptapi.com) focuses on Enterprise Overdub features and doesn't provide public endpoints for video metadata. Our integration uses web scraping with graceful fallbacks.

**Future Enhancement**: When Descript releases public video metadata APIs, the system will automatically use those for better reliability.

### Error Handling

- **Invalid URLs**: Clear error messages for non-Descript URLs
- **Network Issues**: Fallback to manually entered data
- **Duplicate Videos**: Prevents adding the same video twice
- **Missing Data**: Generates appropriate defaults with ACT's voice

## 🌿 ACT Brand Voice Integration

When auto-generating video descriptions, the system applies ACT's authentic voice:

- **Core Philosophy**: "Every story is a seed. Every seed is a possibility."
- **Voice Attributes**: Grounded yet Visionary, Humble yet Confident
- **Agricultural Metaphors**: Uses regenerative farming language
- **Community Focus**: Emphasizes collective ownership and wisdom

Example auto-generated description:
> "A compelling story shared through Descript's video platform, cultivating seeds of wisdom from our community partners in the field."

## 📁 File Structure

```
├── utils/
│   ├── descript-metadata.js    # Core metadata fetching logic
│   └── video-helper.js         # Video processing utilities
├── scripts/
│   └── add-descript-video.js   # Command-line tool
├── data/
│   └── videos.json             # Video storage (auto-created)
└── views/
    └── galleries.ejs           # Web interface with admin panel
```

## 🔧 Troubleshooting

### Common Issues

**"Invalid Descript share URL"**
- Ensure URL starts with `https://share.descript.com/view/`
- Check that the video is publicly accessible

**"Failed to fetch video metadata"**
- Video might be private or require authentication
- Use custom title/description as fallback
- Check internet connection

**"Video already exists in gallery"**
- The system prevents duplicate videos
- Edit `data/videos.json` manually if needed

### Advanced Configuration

**Environment Variables**:
- `DESCRIPT_API_KEY`: For future official API integration
- `USER_AGENT`: Custom user agent for requests (default: ACT-Brand-Guide-Bot/1.0)

**Custom Metadata Sources**:
Edit `utils/descript-metadata.js` to add additional metadata extraction patterns.

## 🚀 Usage Examples

### Community Story Integration

```bash
# Add a farmer's testimonial
node scripts/add-descript-video.js https://share.descript.com/view/abc123 \
  --title "Regenerative Wisdom from Maria's Farm" \
  --description "Maria shares how community-supported agriculture transformed her relationship with the land"

# Add project documentation
node scripts/add-descript-video.js https://share.descript.com/view/def456 \
  --title "Seed Library Launch Event" \
  --description "Celebrating the opening of our community seed library where heritage varieties find new homes"
```

### Batch Processing

```bash
# Process multiple videos with a simple script
for url in \
  "https://share.descript.com/view/video1" \
  "https://share.descript.com/view/video2" \
  "https://share.descript.com/view/video3"
do
  node scripts/add-descript-video.js "$url"
done
```

## 📞 Support

- **Web Interface Issues**: Check browser console for errors
- **Command Line Problems**: Run with Node.js 16+ 
- **API Integration**: See `/api/health` endpoint for system status
- **General Questions**: Contact the ACT team at hello@act.place

---

*"We don't drive the tractor—we hand over the keys. Every video story shared becomes a seed for community wisdom to grow."* 🌱 