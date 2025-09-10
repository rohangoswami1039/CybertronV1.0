# Cybertron AI Platform - Backend Microservices

## Architecture Overview

This backend follows a true microservices architecture with:
- **Apollo Federation Gateway** for GraphQL orchestration
- **Independent Services** with their own databases and business logic
- **Shared Utilities** for common functionality
- **Docker Compose** for easy development and deployment

## Service Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Gateway       │    │  Auth Service   │    │  Chat Service   │
│   (Port 8000)   │    │   (Port 8001)   │    │   (Port 8002)   │
│                 │    │                 │    │                 │
│ • GraphQL       │    │ • User Mgmt     │    │ • Conversations │
│ • Federation    │    │ • JWT Auth      │    │ • AI Integration│
│ • Rate Limiting │    │ • OTP Service   │    │ • Token Tracking│
│ • Auth Middleware│   │ • Transactions  │    │ • Message Mgmt  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │ Payment Service │
                    │   (Port 8003)   │
                    │                 │
                    │ • Razorpay      │
                    │ • Order Mgmt    │
                    │ • Webhooks      │
                    └─────────────────┘
```

## Quick Start

### Prerequisites
- Node.js 18+
- Docker & Docker Compose
- MongoDB (local or cloud)

### Development Setup

1. **Clone and Install**
   ```bash
   cd backend
   npm install
   ```

2. **Environment Setup**
   ```bash
   cp .envs/*.env.example .envs/
   # Edit each .env file with your configuration
   ```

3. **Start Services**
   ```bash
   # Development mode
   docker-compose up -d
   
   # Or start individually
   npm run dev:gateway
   npm run dev:auth
   npm run dev:chat
   npm run dev:payment
   ```

4. **Access Services**
   - Gateway: http://localhost:8000/graphql
   - Auth Service: http://localhost:8001/graphql
   - Chat Service: http://localhost:8002/graphql
   - Payment Service: http://localhost:8003/graphql

## Service Details

### Gateway Service
- **Port**: 8000
- **Purpose**: GraphQL Federation Gateway
- **Features**:
  - Apollo Federation
  - Authentication middleware
  - Rate limiting
  - Service discovery

### Auth Service
- **Port**: 8001
- **Purpose**: User authentication and management
- **Features**:
  - User registration/login
  - JWT token management
  - OTP verification
  - Transaction tracking
  - Token balance management

### Chat Service
- **Port**: 8002
- **Purpose**: Conversation and AI chat management
- **Features**:
  - Conversation CRUD
  - Message handling
  - AI integration
  - Token consumption tracking
  - Real-time chat

### Payment Service
- **Port**: 8003
- **Purpose**: Payment processing and order management
- **Features**:
  - Razorpay integration
  - Order creation
  - Payment verification
  - Webhook handling
  - Subscription management

## Environment Variables

### Gateway (.envs/gateway.env)
```bash
PORT=8000
NODE_ENV=development
JWT_SECRET=your-jwt-secret
AUTH_SERVICE_URL=http://localhost:8001
CHAT_SERVICE_URL=http://localhost:8002
PAYMENT_SERVICE_URL=http://localhost:8003
```

### Auth Service (.envs/auth.env)
```bash
PORT=8001
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/cybertron-auth
JWT_SECRET=your-jwt-secret
JWT_EXPIRES_IN=24h
FIREBASE_PROJECT_ID=your-firebase-project
```

### Chat Service (.envs/chat.env)
```bash
PORT=8002
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/cybertron-chat
AUTH_SERVICE_URL=http://localhost:8001
AI_API_URL=your-ai-api-url
OPENAI_API_KEY=your-ai-api-key
```

### Payment Service (.envs/payment.env)
```bash
PORT=8003
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/cybertron-payment
RAZORPAY_KEY_ID=your-razorpay-key
RAZORPAY_KEY_SECRET=your-razorpay-secret
WEBHOOK_SECRET=your-webhook-secret
```

## API Documentation

### GraphQL Endpoints
- **Gateway**: `http://localhost:8000/graphql`
- **Auth**: `http://localhost:8001/graphql`
- **Chat**: `http://localhost:8002/graphql`
- **Payment**: `http://localhost:8003/graphql`

### REST Endpoints
- **Health Checks**: `GET /health`
- **Service Status**: `GET /status`

## Development Commands

```bash
# Install dependencies
npm install

# Start all services
npm run dev

# Start individual services
npm run dev:gateway
npm run dev:auth
npm run dev:chat
npm run dev:payment

# Build for production
npm run build

# Run tests
npm test

# Lint code
npm run lint

# Format code
npm run format
```

## Docker Commands

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

## Database Schema

Each service has its own database:

### Auth Service Database
- `users` - User accounts and profiles
- `otps` - OTP codes for verification
- `transactions` - Token transactions

### Chat Service Database
- `conversations` - Chat conversations
- `messages` - Individual messages

### Payment Service Database
- `razorpay_orders` - Payment orders
- `subscriptions` - User subscriptions

## Authentication Flow

1. **User Registration/Login** → Auth Service
2. **JWT Token Generation** → Auth Service
3. **Token Validation** → Gateway (for all requests)
4. **Service Communication** → Internal service APIs
5. **Token Consumption** → Auth Service (via Chat Service)

## Deployment

### Production Setup
```bash
# Build production images
docker-compose -f docker-compose.prod.yml build

# Deploy to production
docker-compose -f docker-compose.prod.yml up -d
```

### Environment Variables
- Set all production environment variables
- Use secure secrets management
- Configure proper logging and monitoring

## Monitoring & Health Checks

### Health Endpoints
- Gateway: `http://localhost:8000/health`
- Auth: `http://localhost:8001/health`
- Chat: `http://localhost:8002/health`
- Payment: `http://localhost:8003/health`

### Metrics
- Request/response times
- Error rates
- Database connection status
- Service availability

## Troubleshooting

### Common Issues
1. **Service won't start**: Check environment variables and ports
2. **Database connection**: Verify MongoDB URI and network access
3. **GraphQL errors**: Check schema definitions and resolvers
4. **Authentication**: Verify JWT configuration

### Logs
```bash
# View service logs
docker-compose logs [service-name]

# Follow logs in real-time
docker-compose logs -f [service-name]
```

## Contributing

1. Follow the established folder structure
2. Add proper error handling
3. Include tests for new features
4. Update documentation
5. Follow GraphQL best practices

## License

MIT License - see LICENSE file for details 