# ApexFolio - Quick Start Guide

## 🚀 Getting Started in 5 Minutes

### Prerequisites
- Node.js 18+ installed
- pnpm (recommended) or npm
- Git

### Step 1: Clone the Repository
```bash
git clone https://github.com/apexfolio/apexfolio.git
cd apexfolio
```

### Step 2: Install Dependencies
```bash
pnpm install
```

### Step 3: Start Development Server
```bash
pnpm dev
```

### Step 4: Open in Browser
Navigate to `http://localhost:5173`

That's it! 🎉

---

## 🔑 Authentication Setup (Optional)

The app works without configuration, but for full authentication features:

1. **Create a Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Copy your project URL and API keys

2. **Set Environment Variables**
   The project uses Figma Make's built-in Supabase integration, so credentials are pre-configured. No `.env` file needed during development!

3. **Test Authentication**
   - Go to `/signup` to create an account
   - Use any email and password (auto-confirmed)
   - Sign in at `/login`

---

## 📂 Project Structure Overview

```
apexfolio/
├── src/
│   ├── app/
│   │   ├── components/        # Reusable UI components
│   │   │   ├── Logo.tsx
│   │   │   ├── Navigation.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── AnimatedBackground.tsx
│   │   │   └── ui/            # Shadcn UI components
│   │   ├── pages/             # Page components
│   │   │   ├── Home.tsx       # Landing page
│   │   │   ├── Portfolio.tsx  # Portfolio dashboard
│   │   │   ├── Login.tsx      # Authentication
│   │   │   ├── Signup.tsx     # Registration
│   │   │   └── ...
│   │   ├── App.tsx            # Main app entry
│   │   ├── Root.tsx           # Root layout
│   │   └── routes.tsx         # Route configuration
│   ├── styles/                # Global styles
│   │   ├── index.css
│   │   ├── theme.css          # Theme tokens
│   │   └── fonts.css
│   └── utils/                 # Utilities
│       └── auth.ts            # Auth service
├── supabase/
│   └── functions/
│       └── server/            # Edge functions
│           └── index.tsx      # API endpoints
└── public/                    # Static assets
```

---

## 🎨 Key Features to Explore

### 1. Homepage (`/`)
- 3D parallax effects (move your mouse!)
- Animated geometric shapes
- Floating gradient orbs
- Responsive hero section

### 2. Portfolio (`/portfolio`)
- Asset allocation pie chart
- 12-month performance graph
- Risk metrics dashboard
- Holdings table with real-time calculations
- Income tracking

### 3. Authentication
- **Sign Up**: `/signup` - Create new account
- **Login**: `/login` - Sign in with email/password
- **Profile**: `/profile` - View/edit profile, sign out

### 4. Theme Toggle
- Click moon/sun icon in navigation
- Automatic system preference detection
- Smooth transitions between themes

---

## 🛠️ Development Commands

```bash
# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview

# Run linter
pnpm lint

# Format code
pnpm format
```

---

## 🎯 Making Your First Change

### Example: Update Homepage Headline

1. Open `src/app/pages/Home.tsx`
2. Find line ~137:
```tsx
<motion.h1 className="text-6xl lg:text-7xl tracking-tight leading-[1.1]">
  Master Your
  <br />
  <span className="text-muted-foreground">Financial</span>
  <br />
  Journey
</motion.h1>
```
3. Change "Master Your" to anything you like
4. Save and see changes instantly!

---

## 🔧 Customization Guide

### Colors
Edit `/src/styles/theme.css`:
```css
@theme {
  --color-primary: oklch(0.7 0.19 142);  /* Change this */
  --color-success: oklch(0.7 0.17 145);  /* And this */
}
```

### Fonts
Edit `/src/styles/fonts.css`:
```css
@import url('https://fonts.googleapis.com/css2?family=Your+Font');
```

### Animations
Adjust in component files:
```tsx
<motion.div
  animate={{ x: mousePosition.x * 0.5 }} // Change multiplier
  transition={{ type: 'spring', stiffness: 50 }} // Adjust physics
/>
```

---

## 🐛 Troubleshooting

### Issue: Port 5173 already in use
```bash
# Kill process on port 5173
npx kill-port 5173
# Or use a different port
pnpm dev -- --port 3000
```

### Issue: Dependencies not installing
```bash
# Clear cache and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Issue: Authentication not working
- Check browser console for errors
- Verify you're using the correct API endpoint
- Ensure Supabase credentials are valid

---

## 📚 Learning Resources

### React & TypeScript
- [React Docs](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

### Tailwind CSS
- [Tailwind Docs](https://tailwindcss.com/docs)
- [Tailwind v4 Guide](https://tailwindcss.com/docs/v4-beta)

### Animations
- [Motion Docs](https://motion.dev/docs)
- [Animation Examples](https://motion.dev/examples)

### Supabase
- [Supabase Docs](https://supabase.com/docs)
- [Auth Guide](https://supabase.com/docs/guides/auth)

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 💡 Tips & Tricks

### Keyboard Shortcuts
- `Ctrl/Cmd + /` - Toggle comment
- `Alt + ↑/↓` - Move line up/down
- `Ctrl/Cmd + D` - Duplicate line

### Browser DevTools
- `F12` - Open DevTools
- `Ctrl/Cmd + Shift + C` - Inspect element
- `Ctrl/Cmd + Shift + M` - Toggle mobile view

### React DevTools
Install the [React DevTools](https://react.dev/learn/react-developer-tools) browser extension to inspect component hierarchy and props.

---

## 📊 Project Stats

- **Build Time**: ~10-15 seconds
- **Dev Server Start**: ~2-3 seconds
- **Hot Reload**: <100ms
- **Bundle Size**: ~500KB (gzipped)

---

## 🎓 For Students

This project is perfect for learning:
- **React Hooks** (useState, useEffect, custom hooks)
- **TypeScript** type definitions and interfaces
- **Tailwind CSS** utility-first styling
- **Animation** with Motion library
- **Authentication** flows
- **API Integration** with Supabase
- **Responsive Design** patterns
- **Component Architecture**

Study the code, experiment with changes, and build your own features!

---

## 🚨 Common Mistakes to Avoid

1. **Don't modify `/utils/supabase/info.tsx`** - Auto-generated file
2. **Don't commit `.env` files** - Keep secrets secure
3. **Don't skip TypeScript errors** - Fix them early
4. **Don't forget to test mobile** - Always check responsive design
5. **Don't over-animate** - Subtle is better

---

## 🎯 Next Steps

After getting familiar with the codebase:

1. **Add a new page** - Try creating a Settings page
2. **Customize theme** - Make it your own colors
3. **Add a feature** - Implement a new chart or metric
4. **Improve animations** - Experiment with Motion
5. **Deploy it** - Share with the world!

---

## 📞 Get Help

- **Email**: apexfolio.fsad@gmail.com
- **GitHub Issues**: Report bugs or request features
- **Documentation**: Read README.md and UPDATES.md

---

## ✅ Checklist for New Developers

- [ ] Cloned repository
- [ ] Installed dependencies
- [ ] Started dev server
- [ ] Explored homepage
- [ ] Created test account
- [ ] Toggled dark/light theme
- [ ] Checked mobile responsive design
- [ ] Read through project structure
- [ ] Made a small change
- [ ] Committed first change

---

**Happy Coding! 🚀**

*Built by students, for students*

---

**Last Updated**: February 15, 2026
