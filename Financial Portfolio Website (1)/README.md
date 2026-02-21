# ApexFolio

A modern, full-stack financial portfolio management platform built with React, TypeScript, and Supabase.

## 🎓 About This Project

ApexFolio is a **Full Stack Application Development (FSAD) course project** created in 2026 by three students passionate about fintech and modern web development. What started as a class assignment evolved into a fully functional portfolio management application with real authentication, database integration, and advanced UI interactions.

## 👥 Team

- **Rohan Das** - Backend architecture, database design, and API development
- **Tarun Muddana** - Frontend development, UI/UX design, and user experience
- **Kridhaay** - Integration, testing, and deployment infrastructure

## ✨ Features

### Portfolio Management
- **Real-time tracking** of stocks, bonds, cash, and alternative assets
- **Asset allocation** visualization with interactive charts
- **Performance analytics** including CAGR and XIRR calculations
- **Holdings management** with detailed transaction history

### Financial Analytics
- **Risk metrics** - Volatility, Beta, Max Drawdown, and Sharpe Ratio
- **Returns analysis** - Absolute, time-weighted, and money-weighted returns
- **Income tracking** - Dividends, interest, and coupon payments
- **12-month performance** charts and trends

### Goal Management
- Set and track **short-term and long-term financial goals**
- Visual progress indicators
- Smart reminders for goal milestones
- Goal-specific allocation tracking

### User Experience
- **Light/Dark theme** toggle with system preference detection
- **3D parallax effects** and subtle background animations
- **Responsive design** for desktop and mobile
- **Monochromatic color scheme** with editorial-style layouts

### Authentication & Security
- **Supabase authentication** with email/password
- Secure session management
- Protected routes and API endpoints
- Profile management with ID verification

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS v4** - Styling
- **Motion (Framer Motion)** - Animations
- **React Router 7** - Navigation
- **Recharts** - Data visualization
- **Lucide React** - Icons

### Backend
- **Supabase** - Database, authentication, and storage
- **Hono** - Edge function web framework
- **Deno** - Server runtime

### Development
- **Vite** - Build tool
- **pnpm** - Package manager

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- pnpm (recommended) or npm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/apexfolio/apexfolio.git
cd apexfolio
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
Create a `.env` file in the root directory with your Supabase credentials:
```env
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

4. Start the development server:
```bash
pnpm dev
```

5. Open [http://localhost:5173](http://localhost:5173) in your browser.

## 📁 Project Structure

```
apexfolio/
├── src/
│   ├── app/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── routes.tsx      # Route configuration
│   │   └── App.tsx         # Main app component
│   ├── styles/             # Global styles and themes
│   └── utils/              # Utility functions and helpers
├── supabase/
│   └── functions/          # Edge functions
├── public/                 # Static assets
└── package.json
```

## 🎨 Design Philosophy

ApexFolio breaks away from traditional dashboard layouts with:
- **Editorial-style layouts** inspired by modern magazines
- **Sharp rectangles and clean lines** for a professional feel
- **Large typography** for improved readability
- **Monochromatic theme** (black, white, grays) with strategic color accents
- **3D interactions** and subtle animations for depth

## 📊 Key Features Breakdown

### Asset Allocation
Track your portfolio across multiple asset classes:
- Equities
- Debt instruments
- Cash and equivalents
- Alternative investments

### Returns Calculation
- **Absolute Returns** - Simple percentage gain/loss
- **CAGR** - Compound Annual Growth Rate
- **XIRR** - Extended Internal Rate of Return for irregular cash flows

### Risk Metrics
- **Volatility (σ)** - Standard deviation of returns
- **Beta (β)** - Correlation with market movements
- **Max Drawdown** - Largest peak-to-trough decline
- **Sharpe Ratio** - Risk-adjusted return measurement

## 🔐 Authentication Flow

1. **Sign Up** - Create account with email, password, and name
2. **Email Confirmation** - Automatically confirmed (no email server required for demo)
3. **Sign In** - Authenticate with Supabase
4. **Session Management** - Persistent sessions with automatic refresh
5. **Sign Out** - Clear session and redirect

## 🌙 Theme System

ApexFolio features a custom theme system with:
- System preference detection
- Manual theme toggle
- Persistent theme selection
- Smooth transitions between themes

## 📱 Responsive Design

The application is fully responsive with breakpoints for:
- Mobile (< 768px)
- Tablet (768px - 1024px)
- Desktop (> 1024px)

## 🧪 Development

### Running Tests
```bash
pnpm test
```

### Building for Production
```bash
pnpm build
```

### Linting
```bash
pnpm lint
```

## 🤝 Contributing

This is a student project, but we welcome contributions! Feel free to:
- Report bugs
- Suggest features
- Submit pull requests

## 📄 License

This project is open source and available under the MIT License.

## 📧 Contact

- **Email**: apexfolio.fsad@gmail.com
- **GitHub**: [github.com/apexfolio](https://github.com/apexfolio)

## 🙏 Acknowledgments

- Our FSAD course instructors for guidance and support
- The open-source community for amazing tools and libraries
- Unsplash for high-quality stock images

## 🎯 Future Enhancements

- Real-time market data integration
- Social features for sharing portfolio performance
- Advanced portfolio optimization algorithms
- Mobile app (React Native)
- AI-powered investment recommendations

---

**Built with ❤️ by Rohan Das, Tarun Muddana, and Kridhaay**

*FSAD Course Project 2026*
