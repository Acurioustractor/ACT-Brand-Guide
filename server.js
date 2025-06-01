const express = require('express');
const session = require('express-session');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet({
    contentSecurityPolicy: false, // Allow inline styles for now
    crossOriginEmbedderPolicy: false
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET || 'act_regenerative_seeds_growing_2024_wisdom_cultivation',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // Set to true in production with HTTPS
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // For form data
app.use(express.static('public'));
app.use(express.static('assets'));

// Set EJS as templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Disable EJS cache in development
if (process.env.NODE_ENV !== 'production') {
    app.set('view cache', false);
}

// Admin routes
const adminRoutes = require('./routes/admin');
app.use('/admin', adminRoutes);

// Notion client setup
const { Client } = require('@notionhq/client');
let notionClient = null;
let notionConnected = false;

if (process.env.NOTION_TOKEN && process.env.PROJECTS_DATABASE_ID) {
    try {
        notionClient = new Client({
            auth: process.env.NOTION_TOKEN,
        });
        notionConnected = true;
        console.log('✅ Notion client initialized');
    } catch (error) {
        console.error('❌ Error initializing Notion client:', error.message);
    }
} else {
    console.log('⚠️  Notion not configured - using sample data');
}

// Sample data for when Notion isn't configured
const sampleProjects = [
    {
        id: 'sample-1',
        name: 'Dad.Lab',
        description: 'A health and wellbeing initiative focusing on creativity.',
        status: 'Active',
        emoji: '◯',
        location: 'Australia',
        partner: 'Community Partner',
        tags: ['Health and wellbeing', 'Creativity'],
        impact: 'Easy to replicate community impact',
        website: '#',
        theme: 'Health and wellbeing',
        coreValues: 'Creativity',
        forkabilityScore: 'Easy to replicate',
        links: [
            { text: 'Learn More', url: '#', type: 'primary' }
        ]
    },
    {
        id: 'sample-2',
        name: 'Project Her Self design',
        description: 'A storytelling initiative in partnership with Project Her Self based in Queensland, focusing on truth-telling.',
        status: 'Active',
        emoji: '◎',
        location: 'Queensland',
        partner: 'Project Her Self',
        tags: ['Storytelling', 'Truth-Telling', 'Queensland'],
        impact: 'Not forkable community impact',
        website: '#',
        theme: 'Storytelling',
        coreValues: 'Truth-Telling',
        forkabilityScore: 'Not forkable',
        links: [
            { text: 'Learn More', url: '#', type: 'primary' }
        ]
    },
    {
        id: 'sample-3',
        name: 'Wilya Janta Communications',
        description: 'An indigenous initiative in partnership with Wilya Janta based in Northern Territory, focusing on truth-telling.',
        status: 'Growing',
        emoji: '◈',
        location: 'Northern Territory',
        partner: 'Wilya Janta',
        tags: ['Indigenous', 'Truth-Telling', 'Northern Territory'],
        impact: 'Needs support community impact',
        website: '#',
        theme: 'Indigenous',
        coreValues: 'Truth-Telling',
        forkabilityScore: 'Needs support',
        links: [
            { text: 'Learn More', url: '#', type: 'primary' }
        ]
    },
    {
        id: 'sample-4',
        name: 'Maningrida - Justice Reinvestment',
        description: 'A youth justice initiative based in Northern Territory, focusing on decentralised power.',
        status: 'Thriving',
        emoji: '◊',
        location: 'Northern Territory',
        partner: 'Community Partner',
        tags: ['Youth Justice', 'Decentralised Power', 'Northern Territory'],
        impact: 'Easy to replicate community impact',
        website: '#',
        theme: 'Youth Justice',
        coreValues: 'Decentralised Power',
        forkabilityScore: 'Easy to replicate',
        links: [
            { text: 'Learn More', url: '#', type: 'primary' }
        ]
    }
];

// Helper function to fetch projects from Notion
async function fetchProjectsFromNotion() {
    if (!notionClient || !process.env.PROJECTS_DATABASE_ID) {
        return { projects: sampleProjects, source: 'sample' };
    }

    try {
        const response = await notionClient.databases.query({
            database_id: process.env.PROJECTS_DATABASE_ID,
            filter: {
                property: 'Website Display',
                checkbox: {
                    equals: true
                }
            },
            sorts: [
                {
                    property: 'Name',
                    direction: 'ascending'
                }
            ]
        });

        const projects = response.results.map(page => {
            const properties = page.properties;
            
            // Extract rich text safely
            const getRichText = (property) => {
                return property?.rich_text?.[0]?.plain_text || '';
            };
            
            // Extract title safely
            const getTitle = (property) => {
                return property?.title?.[0]?.plain_text || 'Untitled Project';
            };
            
            // Extract select safely
            const getSelect = (property) => {
                return property?.select?.name || '';
            };
            
            // Extract multi-select safely
            const getMultiSelect = (property) => {
                return property?.multi_select?.map(tag => tag.name) || [];
            };
            
            // Extract URL safely
            const getUrl = (property) => {
                return property?.url || '';
            };
            
            // Extract checkbox safely
            const getCheckbox = (property) => {
                return property?.checkbox || false;
            };
            
            // Map themes to emojis
            const themeEmojiMap = {
                'Health and wellbeing': '◯',
                'Storytelling': '◎',
                'Youth Justice': '◊',
                'Indigenous': '◈',
                'Economic Freedom': '◆',
                'Community Building': '◐',
                'Education': '○',
                'Technology': '⬢'
            };
            
            const theme = getSelect(properties.Theme);
            const coreValues = getSelect(properties['Core Values']);
            const state = getSelect(properties.State);
            const partner = getSelect(properties.Partner);
            const forkabilityScore = getSelect(properties['Forkability Score']);
            
            // Create status based on forkability score
            let status = 'Active';
            if (forkabilityScore === 'Not forkable') status = 'Planning';
            else if (forkabilityScore === 'Needs support') status = 'Growing';
            else if (forkabilityScore === 'Easy to replicate') status = 'Thriving';
            
            // Create description from available data
            const description = `${theme ? `A ${theme.toLowerCase()} initiative` : 'Community-led project'} ${partner ? `in partnership with ${partner}` : ''} ${state ? `based in ${state}` : ''}${coreValues ? `, focusing on ${coreValues.toLowerCase()}` : ''}.`;
            
            // Create tags from theme and core values
            const tags = [theme, coreValues, state].filter(Boolean);
            
            // Create links - for now just placeholder
            const links = [
                { text: 'Learn More', url: '#', type: 'primary' }
            ];
            
            return {
                id: page.id,
                name: getTitle(properties.Name),
                description: description,
                status: status,
                emoji: themeEmojiMap[theme] || '◆',
                location: state || 'Australia',
                partner: partner || 'Community Partner',
                tags: tags,
                impact: `${forkabilityScore || 'Growing'} community impact`,
                website: '#',
                featured: false,
                theme: theme,
                coreValues: coreValues,
                forkabilityScore: forkabilityScore,
                links: links
            };
        });

        return { projects, source: 'notion' };
    } catch (error) {
        console.error('Error fetching from Notion:', error.message);
        return { projects: sampleProjects, source: 'sample_fallback' };
    }
}

// Routes
app.get('/', (req, res) => {
    res.render('index', { 
        title: 'A Curious Tractor',
        page: 'home',
        basePath: ''
    });
});

app.get('/methodology', (req, res) => {
    res.render('methodology', { 
        title: 'How We Work - A Curious Tractor',
        page: 'methodology',
        basePath: ''
    });
});

app.get('/platforms', (req, res) => {
    res.render('platforms', { 
        title: 'Flagship Platforms - A Curious Tractor',
        page: 'platforms',
        basePath: ''
    });
});

app.get('/projects', async (req, res) => {
    const projectData = await fetchProjectsFromNotion();
    res.render('projects', { 
        title: 'Current Projects - A Curious Tractor',
        page: 'projects',
        projects: projectData.projects,
        source: projectData.source,
        basePath: ''
    });
});

app.get('/brand', (req, res) => {
    res.render('brand', { 
        title: 'Brand Guide - A Curious Tractor',
        page: 'brand',
        basePath: ''
    });
});

app.get('/about', (req, res) => {
    res.render('about', { 
        title: 'About - A Curious Tractor',
        page: 'about',
        basePath: ''
    });
});

app.get('/galleries', (req, res) => {
    res.render('galleries', { 
        title: 'Galleries - A Curious Tractor',
        page: 'galleries',
        basePath: ''
    });
});

// API Routes
app.get('/api/health', (req, res) => {
    res.json({
        status: 'healthy',
        notion_connected: notionConnected,
        timestamp: new Date().toISOString()
    });
});

app.get('/api/projects', async (req, res) => {
    try {
        const projectData = await fetchProjectsFromNotion();
        res.json({
            ...projectData,
            total: projectData.projects.length,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('API Error:', error);
        res.status(500).json({
            error: 'Failed to fetch projects',
            projects: sampleProjects,
            source: 'error_fallback'
        });
    }
});

// API endpoint for photos
app.get('/api/photos', (req, res) => {
    const fs = require('fs');
    const path = require('path');
    
    try {
        const photosDir = path.join(__dirname, 'public', 'galleries', 'photos');
        
        // Create directory if it doesn't exist
        if (!fs.existsSync(photosDir)) {
            fs.mkdirSync(photosDir, { recursive: true });
            return res.json([]);
        }
        
        // Read photos metadata file if it exists
        const metadataFile = path.join(photosDir, 'metadata.json');
        if (fs.existsSync(metadataFile)) {
            const metadata = JSON.parse(fs.readFileSync(metadataFile, 'utf8'));
            return res.json(metadata);
        }
        
        // If no metadata file, scan directory for images
        const files = fs.readdirSync(photosDir)
            .filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file))
            .map(file => ({
                url: `/galleries/photos/${file}`,
                title: file.replace(/\.[^/.]+$/, "").replace(/[-_]/g, ' '),
                description: 'A moment from the field where community wisdom takes root'
            }));
        
        res.json(files);
    } catch (error) {
        console.error('Error loading photos:', error);
        res.json([]);
    }
});

// API endpoint for videos
app.get('/api/videos', (req, res) => {
    const fs = require('fs');
    const path = require('path');
    
    try {
        const videosFile = path.join(__dirname, 'data', 'videos.json');
        
        // Create directory and file if it doesn't exist
        const dataDir = path.join(__dirname, 'data');
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
        }
        
        if (!fs.existsSync(videosFile)) {
            const sampleVideos = [];
            fs.writeFileSync(videosFile, JSON.stringify(sampleVideos, null, 2));
            return res.json({ videos: sampleVideos });
        }
        
        const videos = JSON.parse(fs.readFileSync(videosFile, 'utf8'));
        res.json({ videos });
    } catch (error) {
        console.error('Error loading videos:', error);
        res.json({ videos: [] });
    }
});

// API endpoint to fetch Descript video metadata and add to gallery
app.post('/api/descript-metadata', async (req, res) => {
    const fs = require('fs');
    const path = require('path');
    
    try {
        const { url, title: customTitle, description: customDescription } = req.body;
        
        if (!url) {
            return res.status(400).json({ error: 'URL is required' });
        }

        if (!url.includes('share.descript.com')) {
            return res.status(400).json({ error: 'URL must be a Descript share URL' });
        }

        const { fetchDescriptVideoMetadata } = require('./utils/video-helper');
        const metadata = await fetchDescriptVideoMetadata(url);
        
        // Override with custom values if provided
        if (customTitle) metadata.title = customTitle;
        if (customDescription) metadata.description = customDescription;
        
        // Load existing videos
        const videosFile = path.join(__dirname, 'data', 'videos.json');
        let videos = [];
        
        if (fs.existsSync(videosFile)) {
            videos = JSON.parse(fs.readFileSync(videosFile, 'utf8'));
        }
        
        // Check if video already exists
        const projectId = url.match(/view\/([^\/\n?#]+)/)?.[1];
        const existingVideo = videos.find(v => 
            v.embedCode && v.embedCode.includes(projectId)
        );
        
        if (existingVideo) {
            return res.status(409).json({ 
                error: 'Video already exists in gallery',
                existing: existingVideo.title
            });
        }
        
        // Add new video
        videos.push(metadata);
        
        // Save updated videos
        fs.writeFileSync(videosFile, JSON.stringify(videos, null, 2));
        
        res.json({
            success: true,
            metadata,
            message: 'Video added to gallery successfully'
        });

    } catch (error) {
        console.error('Error processing Descript video:', error);
        res.status(500).json({ 
            error: 'Failed to process video',
            details: error.message 
        });
    }
});

// API endpoint for submitting project ideas
app.post('/api/submit-idea', async (req, res) => {
    try {
        const { name, email, project, description } = req.body;
        
        if (!name || !email || !project) {
            return res.status(400).json({
                success: false,
                error: 'Name, email, and project name are required'
            });
        }

        // If Notion is configured and submissions database exists, save there
        if (notionClient && process.env.SUBMISSIONS_DATABASE_ID) {
            try {
                await notionClient.pages.create({
                    parent: { database_id: process.env.SUBMISSIONS_DATABASE_ID },
                    properties: {
                        Name: { title: [{ text: { content: name } }] },
                        Email: { email: email },
                        Project: { rich_text: [{ text: { content: project } }] },
                        Description: { rich_text: [{ text: { content: description || '' } }] },
                        Status: { select: { name: 'New' } },
                        'Submitted Date': { date: { start: new Date().toISOString() } }
                    }
                });
                
                res.json({ success: true, message: 'Idea submitted successfully!' });
            } catch (notionError) {
                console.error('Notion submission error:', notionError);
                // Fall back to console log
                console.log('PROJECT IDEA SUBMITTED:', { name, email, project, description });
                res.json({ success: true, message: 'Idea received! We\'ll be in touch soon.' });
            }
        } else {
            // Log to console if no Notion database configured
            console.log('PROJECT IDEA SUBMITTED:', { name, email, project, description });
            res.json({ success: true, message: 'Idea received! We\'ll be in touch soon.' });
        }
    } catch (error) {
        console.error('Submission error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error. Please try again or contact us directly.'
        });
    }
});

// 404 handler
app.use((req, res) => {
    res.status(404).render('404', { 
        title: 'Page Not Found - A Curious Tractor',
        page: '404'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`ACT Brand Guide server running at http://localhost:${PORT}`);
    console.log(`Notion Integration: ${notionConnected ? 'Configured' : 'Not configured'}`);
}); 