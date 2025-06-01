# 🗃️ **ACT Brand Guide: Notion Database Setup**

This guide helps you set up your Notion database for optimal website integration.

## 📋 **Required Database Properties**

Set up your projects database with these properties:

### **Core Properties**
- **Name** (Title) - The project name
- **Description** (Text) - Brief project description
- **Status** (Select) - Options: `Planning`, `Active`, `Complete`, `Hidden`
- **Emoji** (Text) - Single emoji for the project
- **Website Display** (Checkbox) - ✅ = Show on website, ❌ = Keep private

### **Optional Enhanced Properties**
- **Priority** (Number) - Lower numbers show first (1, 2, 3...)
- **Featured** (Checkbox) - Mark important projects
- **Location** (Text) - Where the project is based
- **Partner** (Text) - Partner organization/community
- **Tags** (Multi-select) - Project categories
- **Impact** (Text) - Impact description
- **Website** (URL) - Project website
- **GitHub** (URL) - Code repository
- **Documentation** (URL) - Project docs

## 🎯 **Website Display Logic**

Projects appear on your website ONLY if:
1. **Website Display** = ✅ (checked)
2. **Status** ≠ "Hidden"

## 📊 **Sorting & Priority**

Projects are sorted by:
1. **Priority** (ascending) - Lower numbers first
2. **Status** (Planning → Active → Complete)

## 🔧 **Setup Steps**

### 1. **Create/Update Database Properties**
Go to your Notion database and add these properties if missing:

```
Name: Title (already exists)
Description: Text
Status: Select (Planning, Active, Complete, Hidden)
Website Display: Checkbox
Priority: Number
Featured: Checkbox
Emoji: Text
Location: Text
Partner: Text
Tags: Multi-select
Impact: Text
Website: URL
GitHub: URL
Documentation: URL
```

### 2. **Configure Your Integration**
1. Share your database with your integration
2. Make sure the integration has read permissions
3. Update your `.env` file with the correct database ID

### 3. **Add Sample Data**
Create a few test projects with:
- **Website Display** ✅ checked
- **Status** = "Active"
- **Priority** = 1, 2, 3 (to test sorting)

## ✅ **Testing Your Setup**

After setup, test with:
```bash
npm start
```

Visit `http://localhost:3000/projects` to see your real Notion data!

## 🎨 **Pro Tips**

1. **Use Priority wisely** - Featured projects should have Priority 1-3
2. **Website Display checkbox** gives you complete control over what's public
3. **Status = "Hidden"** for projects you never want on the website
4. **Featured checkbox** can be used for special highlighting (future feature)
5. **Multiple URLs** - Website, GitHub, Documentation all create different buttons

## 🔄 **Workflow**

1. Create project in Notion
2. Set **Website Display** = ❌ (private by default)
3. Work on project details
4. When ready for website: **Website Display** = ✅
5. Set **Priority** if you want it featured prominently 