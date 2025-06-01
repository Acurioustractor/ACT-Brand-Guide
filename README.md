# A Curious Tractor - Brand Guide & Website

🌱 **Cultivating Seeds of Impact** - Where community wisdom meets regenerative innovation

## About A Curious Tractor

Like a tractor sharing its power take-off with different implements, A Curious Tractor transfers resources, knowledge, and capacity to community-led initiatives. We don't drive the tractor—we hand over the keys.

*"Every story is a seed. Every seed is a possibility. Every possibility is a future we cultivate together."*

## 🚀 Live Website

Visit our live brand guide and website: [https://your-username.github.io/ACT-Brand-Guide](https://your-username.github.io/ACT-Brand-Guide)

## 🏗️ Technical Overview

This is a Node.js/Express web application that serves as both:
- **Brand Guide**: Complete visual identity, typography, colors, and voice guidelines
- **Website**: Full website with project showcase, methodology, and team information
- **Admin System**: Content management for photos, videos, and projects
- **Notion Integration**: Dynamic project data from Notion databases

### Key Features

- 🎨 **Complete Brand System** with modern geometric icons
- 📱 **Responsive Design** that works on all devices  
- 🔗 **Notion Integration** for dynamic project data
- 🎬 **Media Management** for photos and videos
- 🔒 **Admin Interface** for content updates
- ♿ **Accessibility Focused** design and development

## 🛠️ Technology Stack

- **Backend**: Node.js, Express.js
- **Frontend**: EJS templates, vanilla JavaScript
- **Styling**: Custom CSS with CSS variables
- **Database**: Notion (via API)
- **Media**: Descript video integration
- **Hosting**: GitHub Pages (static export)

## 🏃‍♂️ Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/your-username/ACT-Brand-Guide.git
cd ACT-Brand-Guide
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables** (optional)
```bash
cp .env.example .env
# Edit .env with your Notion credentials if you want live data
```

4. **Start the development server**
```bash
npm start
```

5. **Visit the application**
Open [http://localhost:3000](http://localhost:3000) in your browser

## 🎨 Brand System

Our brand system includes:
- **Modern geometric icons** replacing traditional emojis
- **Agricultural color palette** rooted in earth tones
- **Typography system** balancing tradition and innovation
- **Voice & tone guidelines** for authentic communication

### Color Palette
- **ACT Soil** `#6B4226` - Foundation, earth, stability
- **ACT Seedling** `#7CB342` - Growth, possibility, action  
- **ACT Sunrise** `#FF6B35` - Energy, innovation, change
- **ACT Charcoal** `#2C3E50` - Depth, wisdom, strength
- **ACT Cream** `#FFF8E7` - Warmth, openness, space

## 📁 Project Structure

```
ACT-Brand-Guide/
├── public/           # Static assets (CSS, JS, images)
├── views/           # EJS templates
├── routes/          # Express route handlers
├── assets/          # Additional assets
├── data/           # JSON data files
├── utils/          # Utility functions
├── server.js       # Main application server
└── package.json    # Project dependencies
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file for optional integrations:

```env
# Notion Integration (optional)
NOTION_TOKEN=your_notion_integration_token
PROJECTS_DATABASE_ID=your_projects_database_id
SUBMISSIONS_DATABASE_ID=your_submissions_database_id

# Session Security
SESSION_SECRET=your_secure_session_secret

# Server Configuration
PORT=3000
```

### Notion Setup (Optional)

If you want to connect live project data:

1. Create a Notion integration at [https://www.notion.so/my-integrations](https://www.notion.so/my-integrations)
2. Share your databases with the integration
3. Add the credentials to your `.env` file

## 🚀 Deployment

This site is configured for easy deployment to GitHub Pages:

1. **Build static version** (when implemented)
```bash
npm run build
```

2. **Deploy to GitHub Pages**
- Enable GitHub Pages in repository settings
- Select source branch (usually `main` or `gh-pages`)
- Site will be available at `https://your-username.github.io/ACT-Brand-Guide`

## 🤝 Contributing

We welcome contributions! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🌱 Community

A Curious Tractor exists to transfer power, not accumulate it. This brand guide and website are tools for community-led change.

- **Email**: [hello@act.place](mailto:hello@act.place)
- **Website**: [https://act.place](https://act.place)

---

*"We're not building an empire—we're planting a forest where everyone can thrive."* 