const express = require('express');
const fs = require('fs');
const path = require('path');
const ejs = require('ejs');

console.log('🏗️  Building static site for GitHub Pages...');

// Load environment variables
require('dotenv').config();

// GitHub Pages base path (repository name)
const basePath = process.env.NODE_ENV === 'production' ? '/ACT-Brand-Guide' : '';

// Create dist directory
const distDir = path.join(__dirname, '..', 'dist');
if (fs.existsSync(distDir)) {
    fs.rmSync(distDir, { recursive: true });
}
fs.mkdirSync(distDir, { recursive: true });

// Copy static assets
console.log('📁 Copying static assets...');

// Copy public directory contents to root of dist (not to dist/public)
const publicDir = path.join(__dirname, '..', 'public');
if (fs.existsSync(publicDir)) {
    const publicEntries = fs.readdirSync(publicDir, { withFileTypes: true });
    for (const entry of publicEntries) {
        const srcPath = path.join(publicDir, entry.name);
        const destPath = path.join(distDir, entry.name);
        
        if (entry.isDirectory()) {
            copyDir(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    }
    console.log(`   ✅ Copied public/ contents to root`);
}

// Copy assets directory
const assetsDir = path.join(__dirname, '..', 'assets');
if (fs.existsSync(assetsDir)) {
    copyDir(assetsDir, path.join(distDir, 'assets'));
    console.log(`   ✅ Copied assets/`);
    
    // Also copy logo to root for easier access
    const logoSrcDir = path.join(assetsDir, 'logo');
    const logoDestDir = path.join(distDir, 'logo');
    if (fs.existsSync(logoSrcDir)) {
        copyDir(logoSrcDir, logoDestDir);
        console.log(`   ✅ Copied logo to root`);
    }
}

// Function to fetch projects from Notion (same as server.js)
async function fetchProjectsFromNotion() {
    if (!process.env.NOTION_TOKEN || !process.env.PROJECTS_DATABASE_ID) {
        console.log('⚠️  No Notion credentials found, using sample data');
        return getSampleProjects();
    }

    try {
        const { Client } = require('@notionhq/client');
        const notion = new Client({ auth: process.env.NOTION_TOKEN });

        console.log('🔗 Fetching projects from Notion...');
        
        const response = await notion.databases.query({
            database_id: process.env.PROJECTS_DATABASE_ID,
            filter: {
                and: [
                    {
                        property: 'Website Display',
                        checkbox: {
                            equals: true
                        }
                    },
                    {
                        property: 'Status',
                        select: {
                            does_not_equal: 'Hidden'
                        }
                    }
                ]
            },
            sorts: [
                {
                    property: 'Name',
                    direction: 'ascending'
                }
            ]
        });

        const projects = response.results.map(page => {
            const props = page.properties;
            
            return {
                id: page.id,
                name: props.Name?.title?.[0]?.text?.content || 'Untitled',
                description: props.Description?.rich_text?.[0]?.text?.content || '',
                status: props.Status?.select?.name || 'Unknown',
                emoji: getProjectEmoji(props.Theme?.select?.name, props['Core Values']?.select?.name),
                location: props.Location?.rich_text?.[0]?.text?.content || '',
                partner: props.Partner?.rich_text?.[0]?.text?.content || '',
                tags: props.Tags?.multi_select?.map(tag => tag.name) || [],
                impact: props['Forkability Score']?.select?.name || '',
                website: props.Website?.url || '#',
                theme: props.Theme?.select?.name || '',
                coreValues: props['Core Values']?.select?.name || '',
                forkabilityScore: props['Forkability Score']?.select?.name || '',
                links: parseLinksField(props.Links?.rich_text?.[0]?.text?.content)
            };
        });

        console.log(`✅ Fetched ${projects.length} projects from Notion`);
        return projects;
        
    } catch (error) {
        console.error('❌ Error fetching from Notion:', error.message);
        console.log('📦 Using sample data instead');
        return getSampleProjects();
    }
}

// Helper functions (same as server.js)
function getProjectEmoji(theme, coreValues) {
    const emojiMap = {
        'Health and wellbeing': '◯',
        'Storytelling': '◎', 
        'Indigenous': '◈',
        'Youth Justice': '◊',
        'Community': '◐',
        'Technology': '△',
        'Environment': '◆',
        'Education': '▲'
    };
    
    return emojiMap[theme] || emojiMap[coreValues] || '◯';
}

function parseLinksField(linksText) {
    if (!linksText) return [{ text: 'Learn More', url: '#', type: 'primary' }];
    
    try {
        return JSON.parse(linksText);
    } catch {
        return [{ text: 'Learn More', url: linksText, type: 'primary' }];
    }
}

// Sample data fallback
function getSampleProjects() {
    return [
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
            links: [{ text: 'Learn More', url: '#', type: 'primary' }]
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
            links: [{ text: 'Learn More', url: '#', type: 'primary' }]
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
            links: [{ text: 'Learn More', url: '#', type: 'primary' }]
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
            links: [{ text: 'Learn More', url: '#', type: 'primary' }]
        }
    ];
}

// Pages to generate
const pages = [
    { route: '/', view: 'index', title: 'A Curious Tractor', filename: 'index.html' },
    { route: '/about', view: 'about', title: 'About - A Curious Tractor', filename: 'about.html' },
    { route: '/methodology', view: 'methodology', title: 'How We Work - A Curious Tractor', filename: 'methodology.html' },
    { route: '/platforms', view: 'platforms', title: 'Flagship Platforms - A Curious Tractor', filename: 'platforms.html' },
    { route: '/projects', view: 'projects', title: 'Current Projects - A Curious Tractor', filename: 'projects.html' },
    { route: '/brand', view: 'brand', title: 'Brand Guide - A Curious Tractor', filename: 'brand.html' },
    { route: '/galleries', view: 'galleries', title: 'Galleries - A Curious Tractor', filename: 'galleries.html' },
];

// Main build function
async function buildSite() {
    // Fetch real projects from Notion
    const projects = await fetchProjectsFromNotion();
    const source = process.env.NOTION_TOKEN ? 'notion' : 'static';
    
    console.log('📄 Generating HTML pages...');

    // Set up EJS
    const viewsDir = path.join(__dirname, '..', 'views');
    ejs.renderFile = ejs.renderFile;

    // Generate each page
    pages.forEach(page => {
        try {
            const viewPath = path.join(viewsDir, `${page.view}.ejs`);
            
            // Prepare template data
            const templateData = {
                title: page.title,
                page: page.view,
                projects: projects,
                source: source,
                basePath: basePath // Add basePath for GitHub Pages
            };
            
            // Render the EJS template
            const html = ejs.render(fs.readFileSync(viewPath, 'utf8'), templateData, {
                filename: viewPath,
                views: [viewsDir, path.join(viewsDir, 'partials')]
            });
            
            // Write to dist directory
            const outputPath = path.join(distDir, page.filename);
            fs.writeFileSync(outputPath, html);
            
            console.log(`   ✅ Generated ${page.filename}`);
        } catch (error) {
            console.error(`   ❌ Error generating ${page.filename}:`, error.message);
        }
    });

    return projects;
}

// Run the build
buildSite().then(projects => {
    const source = process.env.NOTION_TOKEN ? 'notion' : 'static';
    const viewsDir = path.join(__dirname, '..', 'views');
    
    // Generate 404 page
    try {
        const view404Path = path.join(viewsDir, '404.ejs');
        const html404 = ejs.render(fs.readFileSync(view404Path, 'utf8'), {
            title: 'Page Not Found - A Curious Tractor',
            page: '404',
            basePath: basePath
        }, {
            filename: view404Path,
            views: [viewsDir, path.join(viewsDir, 'partials')]
        });
        
        fs.writeFileSync(path.join(distDir, '404.html'), html404);
        console.log('   ✅ Generated 404.html');
    } catch (error) {
        console.error('   ❌ Error generating 404.html:', error.message);
    }

    // Create API endpoints as JSON files
    console.log('🔌 Creating API endpoints...');
    const apiDir = path.join(distDir, 'api');
    fs.mkdirSync(apiDir, { recursive: true });

    // Projects API
    fs.writeFileSync(path.join(apiDir, 'projects.json'), JSON.stringify({
        projects: projects,
        source: source,
        total: projects.length,
        timestamp: new Date().toISOString()
    }, null, 2));

    // Videos API
    const videosPath = path.join(__dirname, '..', 'data', 'videos.json');
    if (fs.existsSync(videosPath)) {
        try {
            const videosContent = fs.readFileSync(videosPath, 'utf8');
            const videos = JSON.parse(videosContent);
            fs.writeFileSync(path.join(apiDir, 'videos.json'), JSON.stringify({
                videos: videos,
                total: videos.length,
                timestamp: new Date().toISOString()
            }, null, 2));
            console.log('   ✅ Generated videos API');
        } catch (error) {
            console.warn('   ⚠️  Could not create videos API:', error.message);
        }
    }

    // Photos API will be generated after fixing paths

    // Health API
    fs.writeFileSync(path.join(apiDir, 'health.json'), JSON.stringify({
        status: 'healthy',
        notion_connected: !!process.env.NOTION_TOKEN,
        timestamp: new Date().toISOString()
    }, null, 2));

    console.log('   ✅ Generated API endpoints');

    // Create .nojekyll file for GitHub Pages
    fs.writeFileSync(path.join(distDir, '.nojekyll'), '');
    console.log('   ✅ Created .nojekyll file');

    // Fix photo paths in metadata for GitHub Pages
    const metadataPath = path.join(distDir, 'galleries', 'photos', 'metadata.json');
    if (fs.existsSync(metadataPath)) {
        try {
            const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
            const updatedMetadata = metadata.map(photo => ({
                ...photo,
                url: `${basePath}${photo.url}`
            }));
            fs.writeFileSync(metadataPath, JSON.stringify(updatedMetadata, null, 2));
            console.log('   ✅ Updated photo paths for GitHub Pages');

            // Now create the photos API with updated paths
            fs.writeFileSync(path.join(apiDir, 'photos.json'), JSON.stringify(updatedMetadata, null, 2));
            console.log('   ✅ Updated photos API with correct paths');
        } catch (error) {
            console.warn('   ⚠️  Could not update photo metadata:', error.message);
        }
    }

    console.log('🎉 Static site built successfully!');
    console.log(`📁 Output directory: ${distDir}`);
    console.log(`🔗 Data source: ${source}`);
    console.log(`📊 Projects included: ${projects.length}`);
    console.log(`🌐 Base path: ${basePath || '(root)'}`);
}).catch(error => {
    console.error('❌ Build failed:', error);
    process.exit(1);
});

// Helper function to recursively copy directories
function copyDir(src, dest) {
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
    }
    
    const entries = fs.readdirSync(src, { withFileTypes: true });
    
    for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);
        
        if (entry.isDirectory()) {
            copyDir(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    }
} 