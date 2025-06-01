# 📝 **ACT Brand Guide: Submissions Database Setup**

This database captures project ideas submitted through your website.

## 📋 **Required Database Properties**

Create a new database called "Project Submissions" with these properties:

### **Core Properties**
- **Name** (Title) - Person's name
- **Email** (Email) - Contact email
- **Project** (Text) - Project/initiative name
- **Description** (Text) - Project description
- **Status** (Select) - Options: `New`, `Reviewing`, `Contacted`, `In Discussion`, `Archived`
- **Submitted Date** (Date) - Auto-filled when submitted

### **Optional Tracking Properties**
- **Priority** (Select) - Options: `High`, `Medium`, `Low`
- **Follow Up Date** (Date) - When to follow up
- **Notes** (Text) - Internal notes
- **Tags** (Multi-select) - Categorize submissions
- **Contact Attempted** (Checkbox) - Track outreach

## 🔧 **Setup Steps**

### 1. **Create New Database**
1. In Notion, create a new database
2. Name it "Project Submissions" or similar
3. Add all the properties listed above

### 2. **Share with Integration**
1. Click "Share" on your database
2. Add your "ACT Brand Guide Website" integration
3. Give it "Can edit" permissions

### 3. **Get Database ID**
1. Copy the database URL
2. Extract the ID (32-character string)
3. Add to your `.env` file as `SUBMISSIONS_DATABASE_ID`

### 4. **Test Form Submission**
1. Start your server: `npm start`
2. Go to `/projects` page
3. Fill out the "Share Your Initiative" form
4. Check your Notion database for the submission!

## 📋 **Sample Database Setup**

Here's a quick template for your database:

```
Name: [Title]
Email: [Email]
Project: [Text]
Description: [Text]
Status: [Select] New, Reviewing, Contacted, In Discussion, Archived
Submitted Date: [Date]
Priority: [Select] High, Medium, Low  
Follow Up Date: [Date]
Notes: [Text]
Tags: [Multi-select] 
Contact Attempted: [Checkbox]
```

## ✅ **Testing Your Setup**

After setup:
1. Visit your website's `/projects` page
2. Fill out the form at the bottom
3. Check your Notion submissions database
4. You should see the new entry appear automatically!

This gives you a complete workflow for managing community project submissions directly in Notion. 