#!/usr/bin/env node

/**
 * Test Notion Integration
 * Run this script to verify your Notion setup is working correctly
 */

require('dotenv').config();
const { Client } = require('@notionhq/client');

// Initialize Notion client
const notion = new Client({
    auth: process.env.NOTION_TOKEN,
});

async function testNotionConnection() {
    console.log('🔧 Testing Notion Integration...\n');
    
    // Check environment variables
    console.log('📋 Environment Variables:');
    console.log(`NOTION_TOKEN: ${process.env.NOTION_TOKEN ? '✅ Set' : '❌ Missing'}`);
    console.log(`PROJECTS_DATABASE_ID: ${process.env.PROJECTS_DATABASE_ID ? '✅ Set' : '❌ Missing'}`);
    console.log(`SUBMISSIONS_DATABASE_ID: ${process.env.SUBMISSIONS_DATABASE_ID ? '✅ Set' : '❌ Missing'}\n`);
    
    if (!process.env.NOTION_TOKEN) {
        console.log('❌ NOTION_TOKEN is required. Please check your .env file.');
        return;
    }
    
    if (!process.env.PROJECTS_DATABASE_ID) {
        console.log('❌ PROJECTS_DATABASE_ID is required. Please check your .env file.');
        return;
    }
    
    try {
        // Test database access
        console.log('🗃️ Testing database access...');
        const response = await notion.databases.query({
            database_id: process.env.PROJECTS_DATABASE_ID,
            page_size: 1
        });
        
        console.log('✅ Successfully connected to projects database!');
        console.log(`📊 Found ${response.results.length > 0 ? 'at least 1' : '0'} entries\n`);
        
        // Show database structure
        if (response.results.length > 0) {
            console.log('🏗️ Database Structure:');
            const properties = Object.keys(response.results[0].properties);
            properties.forEach(prop => {
                const type = response.results[0].properties[prop].type;
                console.log(`   • ${prop} (${type})`);
            });
            console.log('');
        }
        
        // Test with website filters
        console.log('🎯 Testing website display filter...');
        const filteredResponse = await notion.databases.query({
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
            }
        });
        
        console.log(`✅ Found ${filteredResponse.results.length} projects for website display\n`);
        
        // Show projects that will appear on website
        if (filteredResponse.results.length > 0) {
            console.log('🌟 Projects that will appear on website:');
            filteredResponse.results.forEach((project, index) => {
                const name = project.properties.Name?.title?.[0]?.plain_text || 'Untitled';
                const status = project.properties.Status?.select?.name || 'No status';
                const theme = project.properties.Theme?.select?.name || 'No theme';
                console.log(`   ${index + 1}. ${name} (${status}, Theme: ${theme})`);
            });
        } else {
            console.log('💡 No projects are set to display on website.');
            console.log('   To show projects, make sure they have:');
            console.log('   • "Website Display" checkbox ✅ checked');
            console.log('   • "Status" not set to "Hidden"');
        }
        
        console.log('\n🎉 Notion integration test completed successfully!');
        
    } catch (error) {
        console.log('❌ Error testing Notion connection:');
        console.log(`   ${error.message}\n`);
        
        if (error.code === 'unauthorized') {
            console.log('💡 Troubleshooting tips:');
            console.log('   1. Check your NOTION_TOKEN in .env file');
            console.log('   2. Make sure your integration has access to the database');
            console.log('   3. Share the database with your integration in Notion');
        } else if (error.code === 'object_not_found') {
            console.log('💡 Troubleshooting tips:');
            console.log('   1. Check your PROJECTS_DATABASE_ID in .env file');
            console.log('   2. Make sure the database ID is correct');
            console.log('   3. Ensure the database is shared with your integration');
        }
    }
}

// Run the test
testNotionConnection().catch(console.error); 