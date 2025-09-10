const { merge } = require("lodash");
const { userResolvers } = require("./userAuthResolver");
const { scalarResolvers } = require("./scalarResolvers");

// Merge all resolvers
const resolvers = merge(scalarResolvers, userResolvers);

module.exports = { resolvers }; 