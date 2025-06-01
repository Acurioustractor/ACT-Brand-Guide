# 📸 Smart Photo Positioning System

The ACT Brand Guide photo gallery now includes intelligent face-centered cropping and positioning to ensure portraits display beautifully with faces properly centered in the frame.

## 🎯 Features

- **Automatic Orientation Detection**: Analyzes image aspect ratios to determine portrait, landscape, or square layouts
- **Smart Face Positioning**: Uses optimal object positioning for portraits to center faces in the visible area
- **Visual Indicators**: Subtle color-coded dots show positioning type (development aid)
- **Hover Previews**: Long hover shows full image preview for quality checking
- **Manual Overrides**: Custom positioning can be set via metadata

## 🌱 How It Works

### Automatic Detection

When photos load, the system automatically:

1. **Analyzes Aspect Ratio**: Determines if image is portrait, landscape, or square
2. **Applies Smart Positioning**: 
   - **Portrait** (< 0.8 ratio): `object-position: center 20%` - keeps faces in upper third
   - **Very Tall Portrait** (< 0.6 ratio): `center 25%` - optimal for close-up face shots
   - **Landscape** (> 1.2 ratio): `object-position: center center` - standard centering
   - **Square** (0.8-1.2 ratio): `object-position: center center` - balanced centering

3. **Adds Visual Indicators**: Small colored dots appear on hover
   - 🟢 **Green**: Portrait orientation
   - 🔵 **Blue**: Landscape orientation  
   - 🟠 **Orange**: Square orientation
   - 🔴 **Red**: Face-focused positioning

### Manual Positioning Override

You can override automatic positioning by adding a `positioning` field to your photo metadata:

```json
{
  "url": "/galleries/photos/portrait-elder.jpg",
  "title": "Elder Wisdom Session",
  "description": "Knowledge keeper sharing traditional practices",
  "positioning": "face-top"
}
```

## 🎨 Available Positioning Classes

### Standard Orientations
- `portrait` - For tall images (faces in upper third)
- `landscape` - For wide images (center positioning)
- `square` - For square images (center positioning)

### Face-Focused Options
- `face-focus` - General face optimization (`center 25%`)
- `face-top` - When faces are very high (`center 15%`)
- `face-center` - When faces are more centered (`center 40%`)

## 🔧 Implementation Guide

### Adding Photos with Custom Positioning

**Method 1: Via Metadata File**
Create/edit `public/galleries/photos/metadata.json`:

```json
[
  {
    "url": "/galleries/photos/elder-portrait.jpg",
    "title": "Traditional Knowledge Keeper",
    "description": "Elder sharing wisdom about regenerative practices",
    "positioning": "face-focus"
  },
  {
    "url": "/galleries/photos/group-photo.jpg", 
    "title": "Community Gathering",
    "description": "Seeds of collaboration taking root",
    "positioning": "landscape"
  }
]
```

**Method 2: Via File System**
Simply drop images in `public/galleries/photos/` and the system will:
- Auto-detect orientation
- Apply appropriate positioning
- Generate titles from filenames
- Use ACT-voiced descriptions

### Custom CSS Classes

You can also create custom positioning by adding CSS:

```css
.photo-item.custom-position img {
    object-position: center 30%; /* Your custom position */
}
```

Then apply via metadata:
```json
{
  "positioning": "custom-position"
}
```

## 🌿 ACT Brand Voice Integration

The system generates descriptions that reflect ACT's authentic voice:

- **Default Description**: "A moment from the field where community wisdom takes root"
- **Agricultural Metaphors**: Seeds, roots, growth, cultivation
- **Community Focus**: Emphasizes collective wisdom and connection
- **Regenerative Language**: Healing, renewal, transformation

## 📱 Responsive Behavior

### Mobile Optimization
- Portrait images get extra face-focusing on small screens
- Preview functionality adapts to touch interfaces
- Grid layouts adjust for optimal viewing

### Performance Features
- **Lazy Loading**: Images load as they come into view
- **Hover Delays**: Previews only show after 800ms hover (prevents accidental triggers)
- **Efficient Detection**: Orientation detection happens only once per image

## 🎯 Best Practices

### For Portrait Photos with Faces

1. **Ideal Composition**: Frame subjects with some headroom but not excessive sky
2. **Face Positioning**: Faces work best when naturally in the upper 1/3 of the image
3. **Quality**: Higher resolution allows better cropping flexibility

### For Community Events

1. **Group Photos**: Use landscape orientation when possible
2. **Action Shots**: Consider where key action/faces are positioned
3. **Documentation**: Include context while keeping people prominent

### For Traditional Knowledge Sessions

1. **Respect**: Frame elders with dignity and appropriate context
2. **Setting**: Include relevant background (tools, plants, country) when possible
3. **Stories**: Let the environment tell part of the story

## 🔍 Testing Your Photos

### Visual Indicators

When you hover over photos, you'll see colored dots indicating positioning:

- **Green**: Portrait - good for individual shots, interviews
- **Blue**: Landscape - good for group shots, wide scenes  
- **Orange**: Square - balanced for social media, close-ups
- **Red**: Face-focused - optimized specifically for face prominence

### Preview Function

- **Long Hover**: Hold cursor over image for 800ms to see full preview
- **Quality Check**: Verify faces are well-positioned before publishing
- **Mobile Test**: Check how images appear on different screen sizes

## 🚀 Advanced Features

### Metadata Enhancement

Future features could include:
- **Face Detection API**: Automatic face recognition for perfect positioning
- **EXIF Integration**: Use camera metadata for smarter positioning
- **AI Description**: Auto-generate ACT-voiced descriptions from image content

### Integration with Descript

- **Video Thumbnails**: Apply same positioning logic to video preview frames
- **Story Correlation**: Link photo positioning with video content themes

## 📞 Support

**Photo Issues**: 
- Check image resolution (minimum 600px width recommended)
- Verify file formats (JPG, PNG, WebP supported)
- Test positioning with different browser zoom levels

**Positioning Problems**:
- Use browser dev tools to test custom `object-position` values
- Check metadata.json syntax for custom positioning
- Verify CSS class names match available options

**Performance Concerns**:
- Optimize image file sizes (aim for < 500KB per photo)
- Use modern formats (WebP) when possible
- Monitor loading times on slower connections

---

*"Every photo tells a story. Every story plants a seed. Every seed grows into wisdom shared."* 📸🌱 