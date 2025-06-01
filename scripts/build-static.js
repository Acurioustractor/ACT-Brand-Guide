const express = require('express');
const fs = require('fs');
const path = require('path');
const ejs = require('ejs');

console.log('🏗️  Building static site for GitHub Pages...');

// Create dist directory
const distDir = path.join(__dirname, '..', 'dist');
if (fs.existsSync(distDir)) {
    fs.rmSync(distDir, { recursive: true });
}
fs.mkdirSync(distDir, { recursive: true });

// Copy static assets
console.log('📁 Copying static assets...');
const staticDirs = ['public', 'assets'];
staticDirs.forEach(dir => {
    const srcDir = path.join(__dirname, '..', dir);
    const destDir = path.join(distDir, dir);
    
    if (fs.existsSync(srcDir)) {
        copyDir(srcDir, destDir);
        console.log(`   ✅ Copied ${dir}/`);
    }
});

// Sample data for static build (since we won't have Notion in GitHub Pages)
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
            projects: sampleProjects,
            source: 'static'
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

// Generate 404 page
try {
    const view404Path = path.join(viewsDir, '404.ejs');
    const html404 = ejs.render(fs.readFileSync(view404Path, 'utf8'), {
        title: 'Page Not Found - A Curious Tractor',
        page: '404'
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
    projects: sampleProjects,
    source: 'static',
    total: sampleProjects.length,
    timestamp: new Date().toISOString()
}, null, 2));

// Health API
fs.writeFileSync(path.join(apiDir, 'health.json'), JSON.stringify({
    status: 'healthy',
    notion_connected: false,
    timestamp: new Date().toISOString()
}, null, 2));

console.log('   ✅ Generated API endpoints');

// Create .nojekyll file for GitHub Pages
fs.writeFileSync(path.join(distDir, '.nojekyll'), '');
console.log('   ✅ Created .nojekyll file');

console.log('🎉 Static site built successfully!');
console.log(`📁 Output directory: ${distDir}`);

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