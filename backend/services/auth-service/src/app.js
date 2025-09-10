const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const { ApolloServer } = require("apollo-server-express");
const { makeExecutableSchema } = require("@graphql-tools/schema");

const { logger } = require("./middleware/logger");
const { rateLimiter } = require("./middleware/rateLimiter");
const { authenticateUser, createContext } = require("./utils/firebaseContext");
const { userResolvers } = require("./graphql/resolvers/userAuthResolver");
const { typeDefs } = require("./graphql/schema/index");

const app = express();

// Apply security and logging middleware
app.use(cors());
app.use(
  helmet({
    contentSecurityPolicy:
      process.env.NODE_ENV === "production" ? undefined : false,
  })
);
app.use(express.json());
app.use(
  morgan("combined", {
    stream: { write: (message) => logger.info(message.trim()) },
  })
);
app.use(rateLimiter);
app.use(authenticateUser);

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    service: "auth-service",
    timestamp: new Date().toISOString(),
  });
});

// Create executable schema
const schema = makeExecutableSchema({
  typeDefs,
  resolvers: userResolvers,
});

// Create Apollo Server with enhanced error handling
const server = new ApolloServer({
  schema,
  context: createContext,
  formatError: (error) => {
    logger.error("GraphQL Error:", error);

    // Don't expose internal server errors to clients
    if (error.extensions?.code === "INTERNAL_SERVER_ERROR") {
      return new Error("Internal server error");
    }

    return error;
  },
  // Enable GraphQL Playground in development
  introspection: process.env.NODE_ENV === "development",
  playground: process.env.NODE_ENV === "development",
});

async function setupApollo() {
  await server.start();
  server.applyMiddleware({ app, path: "/graphql" });
}

module.exports = { app, setupApollo, server }; 