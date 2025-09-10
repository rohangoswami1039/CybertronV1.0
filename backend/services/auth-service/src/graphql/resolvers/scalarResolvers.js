const { GraphQLScalarType } = require('graphql');
const { Kind } = require('graphql/language');

// Custom scalar for JSON data
const JSONScalar = new GraphQLScalarType({
  name: 'JSON',
  description: 'JSON custom scalar type',
  serialize(value) {
    return value;
  },
  parseValue(value) {
    return value;
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.OBJECT) {
      return ast.value;
    }
    return null;
  }
});

const scalarResolvers = {
  JSON: JSONScalar
};

module.exports = { scalarResolvers }; 