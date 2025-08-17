# Construction Tech Platform

A comprehensive construction management platform that connects homeowners, contractors, and project managers through an intuitive interface for managing construction projects, bids, and milestones.

## 🏗️ Project Overview

Construction Tech is a full-stack web application designed to streamline the construction industry by providing:
- **Project Management**: Create and track construction projects from start to finish
- **Bidding System**: Efficient contractor bidding and selection process
- **Professional Network**: Connect with qualified contractors and professionals
- **Progress Tracking**: Milestone-based project progress monitoring
- **Communication**: Real-time notifications and email updates
- **Security**: Robust authentication and role-based access control

## 🚀 Features

### Core Functionality
- **User Management**: Multi-role user system (Homeowners, Contractors, Professionals)
- **Project Creation**: Detailed project specifications with budget and timeline
- **Bid Management**: Submit, review, and accept contractor bids
- **Milestone Tracking**: Monitor project progress with customizable milestones
- **Job Postings**: Professional contractors can post and manage job opportunities
- **Notifications**: Real-time updates via email and in-app notifications

### Security & Authentication
- **JWT Authentication**: Secure token-based authentication system
- **Password Reset**: Secure password recovery with email verification
- **Role-Based Access**: Granular permissions based on user roles
- **Input Validation**: Comprehensive validation for all user inputs
- **SQL Injection Protection**: Secure database operations

### Email System
- **Professional Templates**: Beautiful HTML email templates for all notifications
- **Bid Notifications**: Accept/reject notifications for contractors
- **Project Updates**: Status change notifications for homeowners
- **Password Reset**: Secure password recovery emails
- **Job Applications**: Professional job application notifications

## 🏗️ Architecture

### Backend (Node.js + Express)
- **API Layer**: RESTful API with comprehensive endpoints
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT-based security with role management
- **Testing**: Comprehensive Jest test suite (176+ tests)
- **Documentation**: Complete API documentation with Postman collection

### Frontend (React)
- **Modern UI**: Responsive design with modern React patterns
- **State Management**: Efficient state management for complex workflows
- **User Experience**: Intuitive interface for all user types
- **Responsive Design**: Mobile-first approach for all devices

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js with Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT with bcrypt password hashing
- **Email**: Nodemailer with SMTP integration
- **Testing**: Jest with supertest for API testing
- **Containerization**: Docker with Docker Compose

### Frontend
- **Framework**: React with modern hooks
- **Styling**: CSS-in-JS or styled-components
- **State Management**: React Context or Redux
- **Build Tool**: Vite or Create React App
- **Testing**: Jest with React Testing Library

## 📁 Project Structure

```
construction-tech-start-up/
├── backend/                 # Node.js API server
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   ├── services/       # Business logic
│   │   ├── repositories/   # Data access layer
│   │   ├── routes/         # API route definitions
│   │   ├── middleware/     # Authentication and validation
│   │   ├── utils/          # Helper functions
│   │   └── tests/          # Comprehensive test suite
│   ├── prisma/             # Database schema and migrations
│   └── README.md           # Backend documentation
├── frontend/                # React web application
│   └── construction-tech-start-up-frontend/
│       └── README.md       # Frontend documentation
└── README.md               # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL database
- Docker and Docker Compose (optional)

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Configure your environment variables
npm run test:init
npm test
npm run dev
```

### Frontend Setup
```bash
cd frontend/construction-tech-start-up-frontend
npm install
npm start
```

### Docker Setup (Recommended)
```bash
docker compose up --build
```

## 🔧 Configuration

### Environment Variables
- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Secret key for JWT tokens
- `FRONTEND_URL`: Frontend application URL
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`: Email configuration

### Database Setup
The application uses Prisma for database management:
- Automatic migrations on startup
- Seed data for development
- Test database isolation

## 🧪 Testing

### Backend Testing
- **Unit Tests**: Service layer functionality
- **Integration Tests**: API endpoint validation
- **Security Tests**: Authentication and authorization
- **Database Tests**: Repository operations
- **Email Tests**: Notification functionality

### Running Tests
```bash
cd backend
npm test              # Run all tests
npm run test:dev      # Watch mode
npm run test:reset    # Reset test database
```

## 📚 API Documentation

Complete API documentation is available via Postman:
[View API Documentation](https://documenter.getpostman.com/view/42348839/2sB3BEoVoP)

### Key Endpoints
- **Authentication**: `/api/auth/*` - Registration, login, password reset
- **Projects**: `/api/projects/*` - Project CRUD operations
- **Bids**: `/api/bids/*` - Bid management
- **Milestones**: `/api/milestones/*` - Progress tracking
- **Jobs**: `/api/jobs/*` - Professional job postings
- **Notifications**: `/api/notifications/*` - User notifications

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Security**: Bcrypt hashing with configurable salt rounds
- **Role-Based Access**: Multiple user roles with appropriate permissions
- **Input Validation**: Comprehensive validation for all user inputs
- **SQL Injection Protection**: Prisma ORM with parameterized queries
- **Password Reset**: Secure token-based password recovery

## 🚀 Deployment

### Docker Deployment
```bash
docker compose up --build -d
```

### AWS Elastic Beanstalk
- Single-container Docker platform
- Automatic database migrations
- Environment variable configuration
- Health check integration

### Manual Deployment
1. Set up PostgreSQL database
2. Configure environment variables
3. Run database migrations
4. Start the application

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Guidelines
- Write comprehensive tests for new functionality
- Follow existing code style and patterns
- Update documentation for new features
- Ensure all tests pass before submitting

## 📖 Documentation

- **[Backend README](./backend/README.md)**: Detailed backend documentation
- **[Password Reset Guide](./backend/PASSWORD_RESET_README.md)**: Password reset implementation details
- **[Frontend README](./frontend/construction-tech-start-up-frontend/README.md)**: Frontend documentation
- **[API Documentation](https://documenter.getpostman.com/view/42348839/2sB3BEoVoP)**: Complete API reference

## 🐛 Troubleshooting

### Common Issues
- **Database Connection**: Verify `DATABASE_URL` and database accessibility
- **Email Issues**: Check SMTP configuration and credentials
- **Authentication**: Ensure `JWT_SECRET` is properly set
- **Tests Failing**: Run `npm run test:reset` to reset test database

### Getting Help
- Check the documentation files
- Review existing issues
- Create a new issue with detailed information

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Prisma Team**: For the excellent ORM
- **Express.js Community**: For the robust web framework
- **Jest Team**: For comprehensive testing framework
- **All Contributors**: For helping improve this platform

---

**Construction Tech Platform** - Building the future of construction management, one project at a time. 🏗️✨
