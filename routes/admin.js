const express = require('express');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');
const router = express.Router();

// Load configurations
const adminConfig = require('../admin-config.json');
const contentData = require('../data/content.json');

// Middleware to check if user is authenticated
function requireAuth(req, res, next) {
    if (req.session && req.session.isAdmin) {
        return next();
    } else {
        return res.status(401).json({ error: 'Authentication required' });
    }
}

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|webp|pdf/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only images and PDFs are allowed'));
        }
    }
});

// Root admin route - redirect to login
router.get('/', (req, res) => {
    if (req.session && req.session.isAdmin) {
        return res.redirect('/admin/dashboard');
    }
    return res.redirect('/admin/login');
});

// Admin login page
router.get('/login', (req, res) => {
    if (req.session && req.session.isAdmin) {
        return res.redirect('/admin/dashboard');
    }
    res.render('admin/login', { 
        title: 'Admin Login | ACT Brand Guide',
        error: req.query.error 
    });
});

// Handle login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        // Simple authentication (in production, use proper password hashing)
        if (username === adminConfig.admin.username && password === adminConfig.admin.password) {
            req.session.isAdmin = true;
            req.session.username = username;
            res.redirect('/admin/dashboard');
        } else {
            res.redirect('/admin/login?error=Invalid credentials');
        }
    } catch (error) {
        console.error('Login error:', error);
        res.redirect('/admin/login?error=Login failed');
    }
});

// Admin dashboard
router.get('/dashboard', requireAuth, (req, res) => {
    res.render('admin/dashboard', {
        title: 'Admin Dashboard | ACT Brand Guide',
        username: req.session.username,
        pages: Object.keys(adminConfig.content.editablePages)
    });
});

// Content management page
router.get('/content/:page', requireAuth, (req, res) => {
    const page = req.params.page;
    const pageConfig = adminConfig.content.editablePages[page];
    
    if (!pageConfig) {
        return res.status(404).render('admin/error', { 
            title: 'Page Not Found',
            message: 'Content page not found' 
        });
    }
    
    res.render('admin/content', {
        title: `Edit ${pageConfig.title} | ACT Admin`,
        page: page,
        pageConfig: pageConfig,
        content: contentData[page] || {}
    });
});

// Update content
router.post('/content/:page', requireAuth, async (req, res) => {
    try {
        const page = req.params.page;
        const pageConfig = adminConfig.content.editablePages[page];
        
        if (!pageConfig) {
            return res.status(404).json({ error: 'Page not found' });
        }
        
        // Update content data
        if (!contentData[page]) {
            contentData[page] = {};
        }
        
        // Process each field
        for (const field of pageConfig.fields) {
            if (req.body[field.id] !== undefined) {
                contentData[page][field.id] = req.body[field.id];
            }
        }
        
        // Save content data
        await fs.writeFile(
            path.join(__dirname, '../data/content.json'),
            JSON.stringify(contentData, null, 2)
        );
        
        res.json({ success: true, message: 'Content updated successfully' });
    } catch (error) {
        console.error('Content update error:', error);
        res.status(500).json({ error: 'Failed to update content' });
    }
});

// Photo management page
router.get('/photos', requireAuth, async (req, res) => {
    try {
        // Get existing photos
        const photosDir = path.join(__dirname, '../public/galleries/photos');
        const metadataPath = path.join(photosDir, 'metadata.json');
        
        let photos = [];
        try {
            const metadataContent = await fs.readFile(metadataPath, 'utf8');
            photos = JSON.parse(metadataContent);
        } catch (error) {
            // No metadata file exists yet
        }
        
        res.render('admin/photos', {
            title: 'Photo Management | ACT Admin',
            photos: photos
        });
    } catch (error) {
        console.error('Photo management error:', error);
        res.render('admin/error', { 
            title: 'Error',
            message: 'Failed to load photos' 
        });
    }
});

// Upload photo
router.post('/photos/upload', requireAuth, upload.single('photo'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        
        const { title, description, positioning } = req.body;
        const filename = `${Date.now()}-${req.file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
        const filepath = path.join(__dirname, '../public/galleries/photos', filename);
        
        // Process image with sharp (resize if too large)
        let processedImage = sharp(req.file.buffer);
        const metadata = await processedImage.metadata();
        
        // Resize if width > 1200px
        if (metadata.width > 1200) {
            processedImage = processedImage.resize(1200, null, {
                withoutEnlargement: true
            });
        }
        
        // Save the processed image
        await processedImage.jpeg({ quality: 85 }).toFile(filepath);
        
        // Update metadata
        const metadataPath = path.join(__dirname, '../public/galleries/photos/metadata.json');
        let photos = [];
        
        try {
            const metadataContent = await fs.readFile(metadataPath, 'utf8');
            photos = JSON.parse(metadataContent);
        } catch (error) {
            // No metadata file exists yet
        }
        
        // Add new photo
        const newPhoto = {
            url: `/galleries/photos/${filename}`,
            title: title || 'Community Wisdom in Action',
            description: description || 'A moment from the field where community wisdom takes root',
            positioning: positioning || 'auto',
            uploadDate: new Date().toISOString()
        };
        
        photos.push(newPhoto);
        
        // Save metadata
        await fs.writeFile(metadataPath, JSON.stringify(photos, null, 2));
        
        res.json({ 
            success: true, 
            message: 'Photo uploaded successfully',
            photo: newPhoto
        });
        
    } catch (error) {
        console.error('Photo upload error:', error);
        res.status(500).json({ error: 'Failed to upload photo' });
    }
});

// Delete photo
router.delete('/photos/:index', requireAuth, async (req, res) => {
    try {
        const photoIndex = parseInt(req.params.index);
        const metadataPath = path.join(__dirname, '../public/galleries/photos/metadata.json');
        
        let photos = [];
        try {
            const metadataContent = await fs.readFile(metadataPath, 'utf8');
            photos = JSON.parse(metadataContent);
        } catch (error) {
            return res.status(404).json({ error: 'No photos found' });
        }
        
        if (photoIndex < 0 || photoIndex >= photos.length) {
            return res.status(404).json({ error: 'Photo not found' });
        }
        
        const photo = photos[photoIndex];
        
        // Delete physical file
        const filename = path.basename(photo.url);
        const filepath = path.join(__dirname, '../public/galleries/photos', filename);
        
        try {
            await fs.unlink(filepath);
        } catch (error) {
            console.log('Photo file already deleted or not found');
        }
        
        // Remove from metadata
        photos.splice(photoIndex, 1);
        
        // Save updated metadata
        await fs.writeFile(metadataPath, JSON.stringify(photos, null, 2));
        
        res.json({ success: true, message: 'Photo deleted successfully' });
        
    } catch (error) {
        console.error('Photo delete error:', error);
        res.status(500).json({ error: 'Failed to delete photo' });
    }
});

// Video management page
router.get('/videos', requireAuth, async (req, res) => {
    try {
        // Get existing videos
        const videosPath = path.join(__dirname, '../data/videos.json');
        
        let videos = [];
        try {
            const videosContent = await fs.readFile(videosPath, 'utf8');
            videos = JSON.parse(videosContent);
        } catch (error) {
            // No videos file exists yet
        }
        
        res.render('admin/videos', {
            title: 'Video Management | ACT Admin',
            videos: videos
        });
    } catch (error) {
        console.error('Video management error:', error);
        res.render('admin/error', { 
            title: 'Error',
            message: 'Failed to load videos' 
        });
    }
});

// Add video
router.post('/videos/add', requireAuth, async (req, res) => {
    try {
        const { title, description, embedCode, duration, date, source } = req.body;
        
        if (!title || !embedCode) {
            return res.status(400).json({ error: 'Title and embed code are required' });
        }
        
        const videosPath = path.join(__dirname, '../data/videos.json');
        
        let videos = [];
        try {
            const videosContent = await fs.readFile(videosPath, 'utf8');
            videos = JSON.parse(videosContent);
        } catch (error) {
            // No videos file exists yet
        }
        
        // Add new video
        const newVideo = {
            id: Date.now().toString(),
            title: title,
            description: description || 'Stories from the field sharing wisdom and vision',
            embedCode: embedCode,
            duration: duration || '',
            date: date || new Date().toISOString().split('T')[0],
            source: source || 'manual',
            addedDate: new Date().toISOString()
        };
        
        videos.push(newVideo);
        
        // Save videos
        await fs.writeFile(videosPath, JSON.stringify(videos, null, 2));
        
        res.json({ 
            success: true, 
            message: 'Video added successfully',
            video: newVideo
        });
        
    } catch (error) {
        console.error('Video add error:', error);
        res.status(500).json({ error: 'Failed to add video' });
    }
});

// Update video
router.post('/videos/update/:id', requireAuth, async (req, res) => {
    try {
        const videoId = req.params.id;
        const { title, description, duration, date } = req.body;
        const videosPath = path.join(__dirname, '../data/videos.json');
        
        let videos = [];
        try {
            const videosContent = await fs.readFile(videosPath, 'utf8');
            videos = JSON.parse(videosContent);
        } catch (error) {
            return res.status(404).json({ error: 'No videos found' });
        }
        
        const videoIndex = videos.findIndex(video => video.id === videoId);
        
        if (videoIndex === -1) {
            return res.status(404).json({ error: 'Video not found' });
        }
        
        // Update video
        videos[videoIndex].title = title;
        videos[videoIndex].description = description;
        if (duration) videos[videoIndex].duration = duration;
        if (date) videos[videoIndex].date = date;
        videos[videoIndex].lastModified = new Date().toISOString();
        
        // Save updated videos
        await fs.writeFile(videosPath, JSON.stringify(videos, null, 2));
        
        res.json({ 
            success: true, 
            message: 'Video updated successfully',
            video: videos[videoIndex]
        });
        
    } catch (error) {
        console.error('Video update error:', error);
        res.status(500).json({ error: 'Failed to update video' });
    }
});

// Delete video
router.delete('/videos/:id', requireAuth, async (req, res) => {
    try {
        const videoId = req.params.id;
        const videosPath = path.join(__dirname, '../data/videos.json');
        
        let videos = [];
        try {
            const videosContent = await fs.readFile(videosPath, 'utf8');
            videos = JSON.parse(videosContent);
        } catch (error) {
            return res.status(404).json({ error: 'No videos found' });
        }
        
        const videoIndex = videos.findIndex(video => video.id === videoId);
        
        if (videoIndex === -1) {
            return res.status(404).json({ error: 'Video not found' });
        }
        
        // Remove video
        videos.splice(videoIndex, 1);
        
        // Save updated videos
        await fs.writeFile(videosPath, JSON.stringify(videos, null, 2));
        
        res.json({ success: true, message: 'Video deleted successfully' });
        
    } catch (error) {
        console.error('Video delete error:', error);
        res.status(500).json({ error: 'Failed to delete video' });
    }
});

// Update photo metadata
router.post('/photos/update/:index', requireAuth, async (req, res) => {
    try {
        const photoIndex = parseInt(req.params.index);
        const { title, description, positioning } = req.body;
        const metadataPath = path.join(__dirname, '../public/galleries/photos/metadata.json');
        
        let photos = [];
        try {
            const metadataContent = await fs.readFile(metadataPath, 'utf8');
            photos = JSON.parse(metadataContent);
        } catch (error) {
            return res.status(404).json({ error: 'No photos found' });
        }
        
        if (photoIndex < 0 || photoIndex >= photos.length) {
            return res.status(404).json({ error: 'Photo not found' });
        }
        
        // Update photo
        photos[photoIndex].title = title;
        photos[photoIndex].description = description;
        photos[photoIndex].positioning = positioning;
        photos[photoIndex].lastModified = new Date().toISOString();
        
        // Save updated metadata
        await fs.writeFile(metadataPath, JSON.stringify(photos, null, 2));
        
        res.json({ 
            success: true, 
            message: 'Photo updated successfully',
            photo: photos[photoIndex]
        });
        
    } catch (error) {
        console.error('Photo update error:', error);
        res.status(500).json({ error: 'Failed to update photo' });
    }
});

// Get content data for API
router.get('/api/content/:page', requireAuth, (req, res) => {
    const page = req.params.page;
    res.json(contentData[page] || {});
});

// Logout
router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Logout error:', err);
        }
        res.redirect('/admin/login');
    });
});

module.exports = router; 