# 🚀 **Complete Notion Integration Setup Guide**

This guide walks you through setting up Notion integration for your ACT Brand Guide website from start to finish.

## 🎯 **What You'll Achieve**

- Real project data from Notion appears on your website
- Complete control over what projects are public vs. private
- Form submissions automatically saved to Notion
- Professional project management workflow

## 📋 **Step-by-Step Setup**

### **Step 1: Create Your Notion Integration**

1. **Go to Notion Integrations**: https://www.notion.so/my-integrations
2. **Click "New Integration"**
3. **Fill out the form**:
   - Name: `ACT Brand Guide Website`
   - Associated workspace: Your workspace
   - Type: Internal
   - Capabilities: ✅ Read content, ✅ Update content, ✅ Insert content
4. **Click "Submit"**
5. **Copy the "Internal Integration Token"** - you'll need this for your `.env` file

### **Step 2: Set Up Your Environment Variables**

1. **Create a `.env` file** in your project root:
```bash
# Required for Notion integration
NOTION_TOKEN=your_integration_token_here
PROJECTS_DATABASE_ID=177ebcf981cf80dd9514f1ec32f3314c
SUBMISSIONS_DATABASE_ID=your_submissions_database_id_here

# Server settings
PORT=3000
NODE_ENV=development
```

2. **Replace `your_integration_token_here`** with the token from Step 1

### **Step 3: Set Up Your Projects Database**

Your existing database needs these properties for best results:

#### **Required Properties**
- ✅ **Name** (Title) - Already exists
- ✅ **Description** (Text) - Project description
- ✅ **Status** (Select) - Options: `Planning`, `Active`, `Complete`, `Hidden`
- ✅ **Website Display** (Checkbox) - Controls website visibility
- ✅ **Emoji** (Text) - Single emoji for visual appeal

#### **Recommended Properties**
- **Priority** (Number) - Lower numbers show first (1, 2, 3...)
- **Featured** (Checkbox) - Mark special projects
- **Location** (Text) - Where project is based
- **Partner** (Text) - Partner organization
- **Tags** (Multi-select) - Categories like "Justice Reform", "Land Rights"
- **Impact** (Text) - Impact description
- **Website** (URL) - Project website
- **GitHub** (URL) - Code repository
- **Documentation** (URL) - Project documentation

#### **Set Up Database Sharing**
1. **Open your projects database in Notion**
2. **Click "Share" (top right)**
3. **Click "Invite"**
4. **Search for "ACT Brand Guide Website"** (your integration)
5. **Select "Can edit"**
6. **Click "Invite"**

### **Step 4: Create Submissions Database** (Optional but Recommended)

1. **Create a new database** in Notion called "Project Submissions"
2. **Add these properties**:
   - **Name** (Title) - Submitter's name
   - **Email** (Email) - Contact email
   - **Project** (Text) - Project name
   - **Description** (Text) - Project description
   - **Status** (Select) - Options: `New`, `Reviewing`, `Contacted`, `In Discussion`, `Archived`
   - **Submitted Date** (Date) - When submitted
   - **Priority** (Select) - `High`, `Medium`, `Low`
   - **Notes** (Text) - Internal notes

3. **Share with integration** (same process as Step 3)
4. **Copy database URL** and extract the ID (32-character string)
5. **Add to `.env`** as `SUBMISSIONS_DATABASE_ID`

### **Step 5: Test Your Setup**

1. **Run the test script**:
```bash
npm run test-notion
```

2. **If successful**, you should see:
   - ✅ Environment variables confirmed
   - ✅ Database connection working
   - 📊 Database structure displayed
   - 🌟 Projects ready for website

3. **If errors occur**, the script will guide you through fixes

### **Step 6: Go Live!**

1. **Start your server**:
```bash
npm start
```

2. **Visit your website**: http://localhost:3000
3. **Check the projects page**: http://localhost:3000/projects
4. **Your real Notion data should now appear!**

## 🎨 **Content Control Workflow**

### **Making Projects Public/Private**

**To show a project on your website:**
1. ✅ Check "Website Display" 
2. Set Status to anything except "Hidden"

**To hide a project:**
1. ❌ Uncheck "Website Display", OR
2. Set Status to "Hidden"

### **Project Priority**

- **Priority 1-3**: Featured prominently
- **Priority 4-10**: Standard display
- **No Priority**: Appears last

### **Project Status Flow**

```
Planning → Active → Complete
              ↓
           Hidden (never shows)
```

## 🔧 **Troubleshooting**

### **Common Issues**

1. **"API token is invalid"**
   - Check your `NOTION_TOKEN` in `.env`
   - Make sure integration exists and token is correct

2. **"Object not found"**
   - Check your database ID in `.env`
   - Make sure database is shared with integration

3. **"No projects showing"**
   - Check if any projects have "Website Display" ✅ checked
   - Make sure Status is not "Hidden"

4. **"Properties missing"**
   - Run `npm run test-notion` to see current structure
   - Add missing properties to your Notion database

### **Getting Help**

- Run `npm run test-notion` for detailed diagnostics
- Check server logs when running `npm start`
- Review the setup guide files in your project

## ✅ **Success Checklist**

- [ ] Integration created and token copied
- [ ] `.env` file configured
- [ ] Projects database shared with integration
- [ ] Database has required properties
- [ ] Test script runs successfully
- [ ] Website shows real Notion data
- [ ] Form submissions work (if submissions database set up)

## 🎉 **You're Done!**

Your website now has a professional content management system powered by Notion, giving you complete control over what appears publicly while maintaining a smooth workflow for managing projects and submissions. 