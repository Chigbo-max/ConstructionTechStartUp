## Construction Tech API

A Node.js + Express API with Prisma + PostgreSQL for a construction platform that connects homeowners, contractors, and project managers via projects, bids, and milestones.

### Tech Stack
- Node.js, Express
- Prisma ORM, PostgreSQL
- JWT authentication with role-based access control
- Password reset functionality with secure tokens
- Email notifications via Nodemailer
- Jest for comprehensive testing
- Docker containerization

### Prerequisites
- Docker and Docker Compose installed

### Environment Variables
Set these in your environment (local, Compose, or AWS):
- `DATABASE_URL` (PostgreSQL URI). Example: `postgresql://postgres:postgres@db:5432/app?schema=public`
- `JWT_SECRET` (e.g., a long random string)
- `PORT` (optional; defaults to 3000; AWS Elastic Beanstalk sets this to 8080 automatically)
- `FRONTEND_URL` (optional; defaults to http://localhost:3000; used for password reset links)
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` (for email functionality)

### Run Locally with Docker Compose
1. Build and start:
   ```bash
   docker compose up --build
   ```
2. The API will be available at `http://localhost:3000`.
3. Health check: `GET /healthz` → 200 OK.

Prisma migrations are applied automatically on container start. To seed local dev data manually:
```bash
docker compose exec api node prisma/seed.js
```

### API Quickstart
Find the link to the Postman Api documentation:
https://documenter.getpostman.com/view/42348839/2sB3BEoVoP

#### Authentication Endpoints
- `POST /api/auth/register` - User registration with role assignment
- `POST /api/auth/login` - User authentication
- `POST /api/auth/switch-role` - Switch between user roles (requires authentication)
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password with token

#### Core Features
- **Projects**: Create, manage, and track construction projects
- **Bids**: Submit and manage contractor bids
- **Milestones**: Track project progress with milestones
- **Notifications**: Real-time updates and email notifications
- **Professional Jobs**: Post and apply for construction jobs
- **Password Reset**: Secure password recovery system


### Model Overview and ER Diagram

- User owns many Projects (as homeowner)
- User submits many Bids (as contractor)
- Project has many Bids and many Milestones
- Project may have an assigned Contractor (optional because the homeowner could decide to cancel)
- Notification belongs to a User and a Project, and may reference a Bid
- PasswordResetToken for secure password recovery
- Professional profiles for specialized contractors
- ContractorJob for job postings and applications



Key constraints and notes:
- Each `Bid` is unique per `(projectId, contractorId)` pair.
- `Project.contractorId` is optional until a contractor is assigned.
- `Notification.bidId` is optional; when present it references the related bid.
- `PasswordResetToken` tokens expire after 1 hour and are single-use.
- Each `JobApplication` is unique per `(jobId, professionalId)` pair.
- See the full schema in `prisma/schema.prisma` for enums and field details.

### Docker
- `Dockerfile` builds a lean production image and generates Prisma Client during build.
- Container startup runs `prisma migrate deploy` then starts the server.
- `.dockerignore` keeps the image small.

### Deploy to AWS Elastic Beanstalk (Docker Platform)
This app is ready for the single-container Docker platform on Elastic Beanstalk.

1) Provision a PostgreSQL database (Amazon RDS recommended) and capture its connection string as `DATABASE_URL`.

2) Create an Elastic Beanstalk application and environment:
- Platform: Docker running on 64bit Amazon Linux 2
- Application code: Upload a ZIP of the repository root containing the `Dockerfile`

3) Configure environment variables in the Elastic Beanstalk console:
- `DATABASE_URL`: e.g., `postgresql://USER:PASSWORD@HOST:5432/DB?schema=public`
- `JWT_SECRET`: a strong random value
- `NODE_ENV`: `production`
- `PORT`: leave blank; EB sets `PORT=8080` automatically

4) Health checks:
- Set Health check URL to `/healthz` (HTTP) in the EB load balancer settings

5) Deployment:
- Click Deploy. The container will start, run Prisma migrations, and listen on `$PORT`.

6) Notes:
- Ensure security groups allow the EB instance(s) to reach the RDS database.
- Migrations run on every deploy (`prisma migrate deploy` is idempotent).

### Security Features
- **JWT Authentication**: Secure token-based authentication
- **Role-Based Access Control**: Multiple user roles (HOMEOWNER, CONTRACTOR, OTHER)
- **Password Security**: Bcrypt hashing with configurable salt rounds
- **Password Reset**: Secure token-based password recovery system
- **Input Validation**: Comprehensive validation for all user inputs
- **SQL Injection Protection**: Prisma ORM with parameterized queries
- **CORS Protection**: Configurable cross-origin resource sharing

### Recent Improvements
- **Password Reset System**: Complete implementation with email notifications
- **Enhanced Email Service**: Professional email templates for all notifications
- **Professional Job System**: Job posting and application management
- **Comprehensive Testing**: 176+ tests covering all functionality
- **Database Migrations**: Automated schema management with Prisma
- **Error Handling**: Graceful error handling with user-friendly messages
- **API Documentation**: Complete Postman collection available

### Password Reset Feature
The application now includes a secure password reset system:
- **Secure Token Generation**: 32-byte cryptographically secure tokens
- **Email Integration**: Professional HTML email templates with reset links
- **Token Expiration**: 1-hour timeout for security
- **Single Use**: Tokens are invalidated after use
- **Automatic Cleanup**: Old tokens are automatically removed
- **Security**: No user enumeration (same response for existing/non-existing emails)

For detailed implementation information, see [PASSWORD_RESET_README.md](./PASSWORD_RESET_README.md)

### Testing
Comprehensive Jest testing suite covering:
- **Unit Tests**: Service layer functionality
- **Integration Tests**: API endpoint validation
- **Security Tests**: Authentication and authorization
- **Database Tests**: Repository operations
- **Email Tests**: Notification functionality

Run tests locally (non-Docker) with a test database:
```bash
npm install
npm run test
```

Test commands:
- `npm test` - Run all tests
- `npm run test:dev` - Run tests in watch mode
- `npm run test:reset` - Reset test database and run tests
- `npm run test:init` - Initialize test environment

### Development

#### Project Structure
```
src/
├── controllers/     # Request handlers
├── services/        # Business logic
├── repositories/    # Data access layer
├── routes/          # API route definitions
├── middleware/      # Authentication and validation
├── utils/           # Helper functions
└── tests/           # Comprehensive test suite
```

#### Key Files
- `prisma/schema.prisma` - Database schema and models
- `src/index.js` - Application entry point
- `src/routes/auth.js` - Authentication endpoints
- `src/services/userService.js` - User management logic
- `src/services/emailService.js` - Email notification system

#### Adding New Features
1. Update Prisma schema if needed
2. Create/update repository methods
3. Implement business logic in services
4. Add API endpoints in routes
5. Write comprehensive tests
6. Update documentation

### Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

### License
MIT


