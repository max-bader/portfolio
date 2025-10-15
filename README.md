# Personal Portfolio

A modern, responsive portfolio website built with React and Vite. Showcase your projects, skills, and experience with a clean and professional design.

## 🚀 Features

- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Modern UI/UX**: Clean and professional design with smooth animations
- **Component-Based Architecture**: Modular React components for easy maintenance
- **Performance Optimized**: Built with Vite for fast development and production builds
- **SEO Friendly**: Proper meta tags and semantic HTML structure
- **Contact Form**: Functional contact form (ready for backend integration)
- **Project Showcase**: Display your projects with filtering capabilities
- **Skills Section**: Visual representation of your technical skills
- **Social Links**: Easy integration with your social media profiles

## 📁 Project Structure

```
src/
├── assets/
│   ├── images/          # Project images and assets
│   ├── icons/           # Icon files
│   └── styles/          # CSS files for components
├── components/          # Reusable React components
│   ├── Header.jsx       # Navigation header
│   ├── Hero.jsx         # Landing section
│   ├── About.jsx        # About section
│   ├── Skills.jsx       # Skills showcase
│   ├── Projects.jsx     # Projects section
│   ├── ProjectCard.jsx  # Individual project card
│   ├── Contact.jsx      # Contact form
│   └── Footer.jsx       # Footer section
├── data/                # Static data files
│   ├── projects.js      # Project information
│   ├── skills.js        # Skills data
│   └── socialLinks.js   # Social media links
├── pages/               # Page components
│   ├── HomePage.jsx     # Main homepage
│   └── NotFound.jsx     # 404 page
├── hooks/               # Custom React hooks
├── utils/               # Utility functions
├── App.jsx              # Main app component
└── main.jsx            # Entry point
```

## 🛠️ Technologies Used

- **React 18** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **CSS3** - Custom styling with CSS variables
- **Font Awesome** - Icons
- **Google Fonts** - Typography

## 🚀 Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd portfolio
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## 📝 Customization

### Personal Information

1. **Update personal details** in the components:
   - `src/components/Hero.jsx` - Your name and title
   - `src/components/About.jsx` - About text and stats
   - `src/components/Contact.jsx` - Contact information

2. **Update social links** in `src/data/socialLinks.js`

3. **Update projects** in `src/data/projects.js`

4. **Update skills** in `src/data/skills.js`

### Styling

- **Colors**: Update CSS variables in `src/assets/styles/global.css`
- **Typography**: Change fonts in the HTML head or CSS
- **Layout**: Modify component CSS files in `src/assets/styles/`

### Adding Images

1. Place your images in `src/assets/images/`
2. Import and use them in your components
3. Update project images in the projects data

## 📦 Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory, ready for deployment.

## 🌐 Deployment

### Netlify
1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `dist`

### Vercel
1. Import your repository
2. Vercel will automatically detect Vite settings

### GitHub Pages
1. Add `"homepage": "https://yourusername.github.io/portfolio"` to package.json
2. Install gh-pages: `npm install --save-dev gh-pages`
3. Add deploy script: `"deploy": "gh-pages -d dist"`
4. Run: `npm run build && npm run deploy`

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 📱 Responsive Design

The portfolio is fully responsive and optimized for:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (320px - 767px)

## 🎨 Design Features

- **Smooth Scrolling**: Navigation with smooth scroll behavior
- **Hover Effects**: Interactive elements with hover animations
- **Loading Animations**: Fade-in effects for better UX
- **Mobile Menu**: Hamburger menu for mobile devices
- **Project Filtering**: Filter projects by category
- **Skill Progress Bars**: Visual skill level indicators

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 📞 Support

If you have any questions or need help customizing your portfolio, feel free to open an issue or reach out!

---

**Happy coding! 🚀**
