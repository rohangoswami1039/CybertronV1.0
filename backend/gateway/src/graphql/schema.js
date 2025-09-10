const typeDefs = `#graphql
  type Query {
    gateway: String!
    serviceStatus: ServiceStatus!
  }
  type ServiceStatus {
    gateway: String!
    services: ServicesStatus!
    timestamp: String!
  }
  type ServicesStatus {
    auth: String!
    chat: String!
    payment: String!
  }
`;

module.exports = typeDefs; 