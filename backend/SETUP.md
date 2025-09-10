# Cybertron AI Platform - Backend Setup Guide

## 🚀 Quick Start

### Prerequisites

1. **Node.js 18+** - [Download here](https://nodejs.org/)
2. **Docker & Docker Compose** - [Download here](https://www.docker.com/products/docker-desktop/)
3. **MongoDB** (optional - Docker will provide this)
4. **Git** - [Download here](https://git-scm.com/)

### Step 1: Clone and Setup

```bash
# Navigate to the backend directory
cd backend

# Install dependencies for all services
npm run install:all

# Copy environment files
cp .envs/*.env.example .envs/
```

### Step 2: Configure Environment Variables

Edit each `.env` file in the `.envs/` directory:

#### `.envs/gateway.env`
```bash
PORT=8000
NODE_ENV=development
JWT_SECRET=your-super-secret-jwt-key-change-in-production
AUTH_SERVICE_URL=http://localhost:8001
CHAT_SERVICE_URL=http://localhost:8002
PAYMENT_SERVICE_URL=http://localhost:8003
```

#### `.envs/auth.env`
```bash
PORT=8001
NODE_ENV=development
MONGODB_URI=mongodb://admin:password@localhost:27017/cybertron-auth?authSource=admin
JWT_SECRET=your-super-secret-jwt-key-change-in-production
FIREBASE_PROJECT_ID=your-firebase-project-id
```

#### `.envs/chat.env`
```bash
PORT=8002
NODE_ENV=development
MONGODB_URI=mongodb://admin:password@localhost:27017/cybertron-chat?authSource=admin
AUTH_SERVICE_URL=http://localhost:8001
OPENAI_API_KEY=your-openai-api-key
```

#### `.envs/payment.env`
```bash
PORT=8003
NODE_ENV=development
MONGODB_URI=mongodb://admin:password@localhost:27017/cybertron-payment?authSource=admin
RAZORPAY_KEY_ID=your-razorpay-key
RAZORPAY_KEY_SECRET=your-razorpay-secret
```

### Step 3: Start Services

#### Option A: Using the Startup Script (Recommended)
```bash
# Start all services in the correct order
node start-services.js
```

#### Option B: Using Docker Compose
```bash
# Start all services with Docker
docker-compose up -d

# View logs
docker-compose logs -f
```

#### Option C: Manual Start
```bash
# Start services individually
npm run dev:gateway
npm run dev:auth
npm run dev:chat
npm run dev:payment
```

### Step 4: Verify Setup

Check that all services are running:

- **Gateway**: http://localhost:8000/health
- **Auth Service**: http://localhost:8001/health
- **Chat Service**: http://localhost:8002/health
- **Payment Service**: http://localhost:8003/health

## 📁 Project Structure

```
backend/
├── gateway/                 # Apollo Federation Gateway
│   ├── src/
│   │   ├── index.js        # Main entry point
│   │   ├── services.js     # Service configuration
│   │   └── middleware/     # Auth & logging middleware
│   ├── Dockerfile
│   └── package.json
├── services/
│   ├── auth-service/       # User authentication & management
│   │   ├── src/
│   │   │   ├── index.js
│   │   │   ├── config/     # Database & environment config
│   │   │   ├── data/       # Models & repositories
│   │   │   ├── graphql/    # Schema & resolvers
│   │   │   ├── middleware/ # Auth middleware
│   │   │   ├── services/   # Business logic
│   │   │   └── utils/      # Utilities
│   │   ├── Dockerfile
│   │   └── package.json
│   ├── chat-service/       # Conversation & AI management
│   └── payment-service/    # Payment processing
├── shared/                 # Shared utilities & constants
│   ├── constants/
│   └── utils/
├── .envs/                  # Environment configurations
├── docker-compose.yml      # Docker orchestration
├── package.json           # Root package.json
└── start-services.js      # Startup script
```

## 🔧 Development Commands

### Root Level Commands
```bash
# Install all dependencies
npm run install:all

# Start all services
npm run dev

# Start individual services
npm run dev:gateway
npm run dev:auth
npm run dev:chat
npm run dev:payment

# Build all services
npm run build

# Run tests
npm test

# Lint code
npm run lint
```

### Docker Commands
```bash
# Build all services
docker-compose build

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Rebuild and restart
docker-compose up -d --build
```

## 🗄️ Database Setup

### MongoDB Collections

Each service has its own database:

- **cybertron-auth**: Users, OTPs, Transactions
- **cybertron-chat**: Conversations, Messages
- **cybertron-payment**: Orders, Subscriptions

### Database Connection

The services connect to MongoDB using the connection strings in their respective `.env` files. The Docker setup includes a MongoDB instance with authentication.

## 🔐 Authentication Flow

1. **User Registration/Login** → Auth Service
2. **JWT Token Generation** → Auth Service
3. **Token Validation** → Gateway (for all requests)
4. **Service Communication** → Internal service APIs
5. **Token Consumption** → Auth Service (via Chat Service)

## 📊 API Endpoints

### GraphQL Endpoints
- **Gateway**: http://localhost:8000/graphql
- **Auth**: http://localhost:8001/graphql
- **Chat**: http://localhost:8002/graphql
- **Payment**: http://localhost:8003/graphql

### Health Check Endpoints
- **Gateway**: http://localhost:8000/health
- **Auth**: http://localhost:8001/health
- **Chat**: http://localhost:8002/health
- **Payment**: http://localhost:8003/health

## 🧪 Testing

### Run Tests
```bash
# Run all tests
npm test

# Run tests for specific service
npm run test:auth
npm run test:chat
npm run test:payment
npm run test:gateway
```

### Test Coverage
```bash
# Generate coverage reports
npm run test:coverage
```

## 🐛 Troubleshooting

### Common Issues

1. **Port Already in Use**
   ```bash
   # Check what's using the port
   lsof -i :8000
   
   # Kill the process
   kill -9 <PID>
   ```

2. **MongoDB Connection Failed**
   ```bash
   # Check if MongoDB is running
   docker ps | grep mongodb
   
   # Restart MongoDB
   docker-compose restart mongodb
   ```

3. **Service Won't Start**
   ```bash
   # Check logs
   docker-compose logs <service-name>
   
   # Check environment variables
   cat .envs/<service>.env
   ```

4. **Dependencies Issues**
   ```bash
   # Clear node_modules and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

### Logs

View service logs:
```bash
# Docker logs
docker-compose logs -f <service-name>

# Direct logs (if running without Docker)
tail -f logs/combined.log
```

## 🔄 Environment-Specific Setup

### Development
```bash
NODE_ENV=development
npm run dev
```

### Production
```bash
NODE_ENV=production
npm run build
npm start
```

### Testing
```bash
NODE_ENV=test
npm test
```

## 📝 Environment Variables Reference

### Required Variables
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `PORT` - Service port number

### Optional Variables
- `NODE_ENV` - Environment (development/production/test)
- `LOG_LEVEL` - Logging level (debug/info/warn/error)
- `CORS_ORIGIN` - Allowed CORS origins

## 🚀 Deployment

### Docker Deployment
```bash
# Build production images
docker-compose -f docker-compose.prod.yml build

# Deploy to production
docker-compose -f docker-compose.prod.yml up -d
```

### Manual Deployment
```bash
# Build all services
npm run build

# Start production services
npm start
```

## 📚 Additional Resources

- [Apollo Federation Documentation](https://www.apollographql.com/docs/federation/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Docker Documentation](https://docs.docker.com/)
- [GraphQL Documentation](https://graphql.org/)

## 🤝 Contributing

1. Follow the established folder structure
2. Add proper error handling
3. Include tests for new features
4. Update documentation
5. Follow GraphQL best practices

## 📄 License

MIT License - see LICENSE file for details 