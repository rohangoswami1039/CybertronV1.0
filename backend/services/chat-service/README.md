# Cybertron Chat Service

## Overview
This service manages chat conversations, messages, and AI completions for the Cybertron AI Platform. It now follows strict industrial best practices for modularity, maintainability, and testability.

## Folder Structure

- `config/`         - Database and environment configuration
- `middleware/`     - Authentication, logging, and rate limiting middleware
- `data/models/`    - Mongoose models for Conversation and Message
- `data/repositories/` - Repository classes for all DB access (NEW)
- `graphql/schema/` - GraphQL schema definitions
- `graphql/resolvers/` - GraphQL resolvers (can be split by domain)
- `services/`       - Business logic (uses repositories for DB access)
- `utils/`          - Utility functions (e.g., websocket)

## API Endpoints

- `POST /graphql`   - Main GraphQL endpoint for all chat operations
- `GET /health`     - Health check endpoint

## Repository Pattern
All database access is now handled via repository classes in `src/data/repositories/`. This matches the pattern used in the auth-service and ensures:
- Separation of concerns
- Easier unit testing
- Cleaner, more maintainable code

## Example Usage

```js
// In a service file
const ConversationRepository = require('../data/repositories/ConversationRepository');
const MessageRepository = require('../data/repositories/MessageRepository');

const conversation = await ConversationRepository.create({ ... });
const message = await MessageRepository.create({ ... });
```

## GraphQL
- All business logic is exposed via GraphQL mutations and queries.
- See `src/graphql/schema/conversation.js` for schema details.

## Auth
- JWT-based authentication using shared token validator.
- Auth middleware applied to `/graphql`.

## Health
- `GET /health` returns service status and uptime.

---
This service is now fully aligned with the architecture and standards of the auth-service. For any questions, see the main platform README or contact the backend team. 