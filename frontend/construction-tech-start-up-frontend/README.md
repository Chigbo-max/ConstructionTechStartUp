# Construction Tech Frontend

A modern React application built with Redux Toolkit, RTK Query, and Tailwind CSS for the Construction Tech platform.

## 🚀 Features

- **Modern React**: Built with React 19 and modern hooks
- **State Management**: Redux Toolkit with RTK Query for API management
- **Styling**: Tailwind CSS with custom brand colors
- **Authentication**: Complete login/register system with JWT
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Real-time Updates**: RTK Query caching and invalidation
- **Type Safety**: PropTypes and modern JavaScript features

## 🛠️ Tech Stack

- **Frontend Framework**: React 19
- **State Management**: Redux Toolkit + RTK Query
- **Styling**: Tailwind CSS v4
- **Build Tool**: Vite
- **Package Manager**: npm
- **Development**: ESLint, React Refresh

## 🎨 Design System

### Brand Colors
- **Primary**: #0077B5 (Blue)
- **Secondary**: #000000 (Black)
- **Accent**: #FFFFFF (White)
- **Extended Palette**: Full range of primary colors (50-900)

### Typography
- **Headings**: Poppins font family
- **Body**: Inter font family
- **Responsive**: Mobile-first typography scale

### Components
- **Buttons**: Primary, secondary, and outline variants
- **Forms**: Consistent input styling with validation states
- **Cards**: Shadow-based card components
- **Modals**: Overlay modals with animations

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── Auth/            # Authentication components
│   │   ├── LoginModal.jsx
│   │   └── RegisterModal.jsx
│   ├── Layout/          # Layout components
│   │   └── Header.jsx
│   └── UI/              # UI components
│       └── Notification.jsx
├── features/            # Redux features and APIs
│   ├── auth/            # Authentication
│   │   ├── authApi.js   # RTK Query API
│   │   └── authSlice.js # Redux slice
│   ├── projects/        # Project management
│   │   └── projectsApi.js
│   ├── jobs/            # Job management
│   │   └── jobsApi.js
│   ├── notifications/   # Notifications
│   │   └── notificationsApi.js
│   ├── milestones/      # Milestone tracking
│   │   └── milestonesApi.js
│   └── ui/              # UI state management
│       └── uiSlice.js
├── app/                 # App configuration
│   └── store.jsx        # Redux store setup
├── App.jsx              # Main application component
├── main.jsx             # Application entry point
└── index.css            # Global styles and Tailwind
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Backend API running (see backend README)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd construction-tech-start-up-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp env.example .env.local
   # Edit .env.local with your API URL
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

5. **Build for Production**
   ```bash
   npm run build
   ```

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# API Configuration
VITE_API_URL=http://localhost:3000/api

# Optional: Override for different environments
# VITE_API_URL=https://api.constructiontech.com/api
```

### Tailwind CSS Configuration

The project includes a custom Tailwind configuration with:
- Brand color palette
- Custom animations
- Responsive breakpoints
- Custom shadows and typography

## 📱 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🔌 API Integration

### RTK Query Setup

The application uses RTK Query for all API calls with:
- **Automatic Caching**: Intelligent cache management
- **Real-time Updates**: Automatic cache invalidation
- **Loading States**: Built-in loading and error handling
- **Optimistic Updates**: Immediate UI updates

### Available APIs

- **Authentication**: Login, register, password reset
- **Projects**: CRUD operations, bid management
- **Jobs**: Job posting and applications
- **Notifications**: User notifications
- **Milestones**: Project progress tracking

## 🎯 Component Usage

### Authentication

```jsx
import { useLoginMutation } from '../features/auth/authApi';

const [login, { isLoading, error }] = useLoginMutation();

const handleLogin = async (credentials) => {
  try {
    const result = await login(credentials).unwrap();
    // Handle successful login
  } catch (error) {
    // Handle error
  }
};
```

### State Management

```jsx
import { useSelector, useDispatch } from 'react-redux';
import { selectIsAuthenticated, logout } from '../features/auth/authSlice';

const isAuthenticated = useSelector(selectIsAuthenticated);
const dispatch = useDispatch();

const handleLogout = () => {
  dispatch(logout());
};
```

## 🎨 Styling Guidelines

### Using Brand Colors

```jsx
// Primary brand color
className="bg-primary-500 text-white"

// Hover states
className="hover:bg-primary-600"

// Text colors
className="text-primary-600"

// Borders
className="border-primary-300"
```

### Responsive Design

```jsx
// Mobile first approach
className="text-sm md:text-base lg:text-lg"

// Grid layouts
className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3"

// Spacing
className="p-4 sm:p-6 lg:p-8"
```

## 🔒 Security Features

- **JWT Authentication**: Secure token-based auth
- **Input Validation**: Client-side form validation
- **XSS Protection**: React's built-in XSS protection
- **CSRF Protection**: Token-based CSRF protection

## 🧪 Testing

The application is set up for testing with:
- **Jest**: Testing framework
- **React Testing Library**: Component testing
- **Redux Testing**: State management testing

## 🚀 Deployment

### Build Process

1. **Production Build**
   ```bash
   npm run build
   ```

2. **Static Files**
   The build creates a `dist/` folder with static files

3. **Deploy Options**
   - Netlify
   - Vercel
   - AWS S3 + CloudFront
   - Traditional web server

### Environment Configuration

Ensure your production environment has:
- Correct `VITE_API_URL` pointing to production API
- HTTPS enabled
- Proper CORS configuration on backend

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**
3. **Make your changes**
4. **Add tests if applicable**
5. **Submit a pull request**

### Development Guidelines

- Follow existing code style
- Use Tailwind CSS for styling
- Implement proper error handling
- Add loading states for async operations
- Test components thoroughly

## 📚 Additional Resources

- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
- [RTK Query Documentation](https://redux-toolkit.js.org/rtk-query/overview)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [React Documentation](https://react.dev/)

## 🐛 Troubleshooting

### Common Issues

1. **API Connection Errors**
   - Check `VITE_API_URL` in environment file
   - Ensure backend is running
   - Check CORS configuration

2. **Styling Issues**
   - Verify Tailwind CSS is properly imported
   - Check for CSS conflicts
   - Ensure proper class names

3. **State Management Issues**
   - Check Redux DevTools
   - Verify action dispatching
   - Check reducer logic

### Getting Help

- Check the console for errors
- Use Redux DevTools for state debugging
- Review the component hierarchy
- Check network requests in browser dev tools

---

**Construction Tech Frontend** - Building the future of construction management with modern web technologies! 🏗️✨
