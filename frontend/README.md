# Cybertron.AI

Cybertron.AI is a powerful AI studio platform that provides tools for text generation, image generation, script generation, and more.

## Features

- Authentication with Email/Password and Google
- OTP verification for secure login
- Text generation with AI
- Chat history functionality
- Modern responsive UI

## Technology Stack

- React 19
- React Router 6
- Styled Components
- Firebase Authentication
- GraphQL API integration with Apollo Client
- Formik + Yup for form validation

## Getting Started

### Prerequisites

- Node.js 16+ and npm
- Firebase project (for authentication)
- GraphQL backend service running at http://localhost:8000/graphql (or custom URL)

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/cybertron.ai.git
cd cybertron.ai
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```
# API URL
VITE_API_URL=http://localhost:8000

# Firebase config
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-auth-domain.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-storage-bucket.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

4. Start the development server
```bash
npm run dev
```

## Authentication Flow

The application supports multiple authentication methods:

1. **Email/Password Registration and Login**
   - User registers with email/password
   - OTP verification is sent to email
   - User verifies OTP to complete registration
   - For login, user enters email/password, then verifies with OTP

2. **Google Authentication**
   - User signs in with Google
   - If new user, they are redirected to complete onboarding
   - If existing user, they are logged in directly

## API Integration

The application uses a GraphQL API for:

- User authentication and management
- Text generation requests
- Chat history storage and retrieval

See the Postman collection for available API endpoints and their usage.

## Project Structure

```
cybertron.ai/
├── public/          # Static files
├── src/
│   ├── assets/      # Images, fonts, etc.
│   ├── components/  # Reusable components
│   ├── context/     # React context providers
│   ├── hooks/       # Custom React hooks
│   ├── pages/       # Page components
│   ├── utils/       # Utilities and services
│   ├── styles/      # Global styles
│   ├── App.jsx      # Main application component
│   └── main.jsx     # Entry point
├── .env.example     # Example environment variables
├── package.json     # Project dependencies
└── vite.config.js   # Vite configuration
```

## License

This project is proprietary and confidential. Unauthorized copying, modification, distribution, or use is strictly prohibited.

Copyright © 2024 ZooQ Inc. All rights reserved.
