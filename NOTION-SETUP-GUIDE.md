# 🔗 Notion API Integration Guide for ACT Brand Guide

## Quick Start Checklist

- [ ] Create Notion integration
- [ ] Set up ACT Projects database  
- [ ] Configure environment variables
- [ ] Test the connection
- [ ] Import sample data (optional)

---

## Step 1: Create Notion Integration

### 1.1 Create the Integration
1. Go to [notion.so/my-integrations](https://www.notion.so/my-integrations)
2. Click **"+ New integration"**
3. Fill out the form:
   - **Name**: `ACT Brand Guide`
   - **Associated workspace**: Select your workspace
   - **Type**: Internal integration
4. Click **"Submit"**
5. **Copy the Integration Token** (starts with `secret_`) - you'll need this!

### 1.2 Save Your Token
```bash
# Copy your token - it looks like this:
secret_1A2B3C4D5E6F7G8H9I0J1K2L3M4N5O6P7Q8R9S0T1U2V3W4X5Y6Z
```

---

## Step 2: Create ACT Projects Database

### 2.1 Create a New Database
1. In Notion, create a new page
2. Add a **Database - Table**
3. Name it: **"ACT Projects"**

### 2.2 Set Up Database Properties

**Required Properties** (exact names):

| Property Name | Type | Description | Settings |
|---------------|------|-------------|----------|
| `Name` | Title | Project name | Default title field |
| `Status` | Select | Current status | Options: Active, Growing, Research, Pilot, Concept, Complete, On Hold |
| `Description` | Text | Project description | Rich text enabled |
| `Impact` | Text | Impact metrics/story | Rich text enabled |
| `Emoji` | Text | Project emoji | Single character |
| `Location` | Text | Where project operates | Rich text enabled |
| `Start Date` | Date | Project start date | Date only |
| `Website` | URL | Project website | URL format |
| `Partner` | Text | Key partners | Rich text enabled |
| `Tags` | Multi-select | Project categories | Add relevant tags |
| `Links` | Text | JSON array of links | Rich text enabled |

### 2.3 Configure Status Options
Click on the **Status** property and add these options:

```
✅ Active    (Green)
🌱 Growing   (Yellow) 
🔍 Research  (Blue)
🧪 Pilot     (Purple)
💡 Concept   (Gray)
🎯 Complete  (Green)
⏸️ On Hold   (Red)
```

### 2.4 Configure Tags
Add these suggested tags (add more as needed):

```
- Storytelling
- Policy  
- Community Wisdom
- Food Security
- Sustainability
- Community
- Justice Reform
- Youth Voice
- Advocacy
- Mutual Aid
- Art
- Community Care
- Library
- Tools
- Technology
- Open Source
- Accessibility
```

---

## Step 3: Share Database with Integration

### 3.1 Connect Your Integration
1. In your **ACT Projects** database, click the **"..."** menu (top right)
2. Select **"Add connections"**
3. Find and select **"ACT Brand Guide"** (your integration)
4. Click **"Confirm"**

### 3.2 Get Database ID
1. Copy the database URL from your browser
2. Extract the database ID (32-character string):
```
https://notion.so/workspace/DATABASE_ID?v=VIEW_ID
                         ^^^^^^^^^^^^ This part
```

---

## Step 4: Configure Environment Variables

### 4.1 Create .env File
```bash
# Copy env.example to .env
cp env.example .env
```

### 4.2 Update .env File
```env
# Required for Notion integration
NOTION_TOKEN=secret_your_actual_token_here
NOTION_DATABASE_ID=your_32_character_database_id

# Optional
PORT=3000
NODE_ENV=development
```

### 4.3 Example Configuration
```env
NOTION_TOKEN=secret_1A2B3C4D5E6F7G8H9I0J1K2L3M4N5O6P7Q8R9S0T1U2V3W4X5Y6Z
NOTION_DATABASE_ID=12345678901234567890123456789012
PORT=3000
```

---

## Step 5: Import Sample Data (Optional)

### 5.1 Manual Import
Use the CSV template to add sample projects:

1. Open `notion-template.csv` 
2. Copy each row as a new database entry
3. Paste the JSON for Links field as-is

### 5.2 CSV Import Method
1. In Notion database, click **"..."** → **"Import"**
2. Select **"CSV"**
3. Upload `notion-template.csv`
4. Map fields correctly
5. Import data

### 5.3 Sample Links Format
The Links field should contain JSON like this:
```json
[
  {
    "text": "Learn More", 
    "url": "https://empathy.ledger", 
    "type": "primary"
  },
  {
    "text": "Contribute Story", 
    "url": "https://empathy.ledger/share", 
    "type": "secondary"
  }
]
```

---

## Step 6: Test Your Connection

### 6.1 Start the Server
```bash
npm start
```

### 6.2 Check Connection Status
Visit: http://localhost:3000/api/health

Should show:
```json
{
  "status": "healthy",
  "timestamp": "2024-12-19T...",
  "notion_connected": true
}
```

### 6.3 Test Projects API
Visit: http://localhost:3000/api/projects

Should return your Notion data in JSON format.

---

## Step 7: Advanced Database Setup

### 7.1 Add Custom Properties
Consider adding these for enhanced functionality:

| Property | Type | Purpose |
|----------|------|---------|
| `Priority` | Select | High, Medium, Low |
| `Budget` | Number | Project budget |
| `Team Size` | Number | People involved |
| `Last Updated` | Date | Tracking changes |
| `Gallery` | Files & media | Project images |
| `Documents` | Files & media | Related docs |
| `Contact` | Person | Project lead |
| `Next Actions` | Text | Current priorities |

### 7.2 Create Database Views
Set up different views for different needs:

- **🎯 Active Projects**: Filter by Status = Active
- **📊 Dashboard**: Group by Status
- **📅 Timeline**: Sort by Start Date
- **🏷️ By Category**: Group by Tags
- **📍 By Location**: Group by Location

### 7.3 Database Templates
Create page templates for consistent project entries:

1. In database, click **"New"** dropdown
2. Select **"+ New template"**
3. Create template with standard sections:
   - Project Overview
   - Goals & Objectives  
   - Timeline & Milestones
   - Resources & Partners
   - Impact Metrics
   - Next Steps

---

## Troubleshooting

### Common Issues

**❌ "Notion not configured" error**
- Check your `.env` file exists
- Verify `NOTION_TOKEN` is set correctly
- Restart the server after changing `.env`

**❌ "Failed to fetch projects" error**  
- Verify database ID is correct (32 characters)
- Ensure integration has access to database
- Check database exists and isn't deleted

**❌ Missing data in API response**
- Property names must match exactly (case-sensitive)
- Check property types are correct
- Verify database has data

**❌ Links not parsing correctly**
- Links field must contain valid JSON
- Use double quotes, not single quotes
- Test JSON validity at jsonlint.com

### Debug Mode
Enable detailed logging:
```bash
NODE_ENV=development npm start
```

### Reset Everything
If you need to start over:
1. Delete `.env` file
2. Run setup script: `npm run setup`
3. Follow prompts to reconfigure

---

## Production Deployment

When deploying to production:

1. **Set environment variables** in your hosting platform
2. **Keep tokens secure** - never commit to git
3. **Set up monitoring** for API health
4. **Configure CORS** if needed for domain restrictions
5. **Set up backup** of your Notion database

### Platform-Specific Setup

**Vercel:**
```bash
vercel env add NOTION_TOKEN
vercel env add NOTION_DATABASE_ID
```

**Railway:**
```bash
railway variables set NOTION_TOKEN=your_token
railway variables set NOTION_DATABASE_ID=your_database_id
```

**Heroku:**
```bash
heroku config:set NOTION_TOKEN=your_token
heroku config:set NOTION_DATABASE_ID=your_database_id
```

---

## What You Get

With this setup, your brand guide will:

✅ **Live project data** from Notion
✅ **Real-time updates** when you change Notion
✅ **Fallback to sample data** if Notion unavailable  
✅ **Rich project information** with tags, links, partners
✅ **Easy content management** through familiar Notion interface
✅ **Scalable structure** for growing project portfolio

## Need Help?

- 📖 [Notion API Documentation](https://developers.notion.com)
- 🔧 [Integration Settings](https://notion.so/my-integrations)  
- 💬 Check server logs for detailed error messages
- 🐛 Test individual API endpoints for debugging

---

*This integration transforms your brand guide from static to dynamic, making it a living document that grows with your work! 🚜✨* 