const mongoose = require("mongoose");
const {
  GraphQLID,
  GraphQLString,
  GraphQLList,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLNonNull,
} = require("graphql");
const Schema = mongoose.Schema;

const personSchema = new Schema({
  firstname: String,
  lastname: String,
});

const PersonType = new GraphQLObjectType({
  name: "Person",
  fields: {
    id: { type: GraphQLID },
    firstname: { type: GraphQLString },
    lastname: { type: GraphQLString },
  },
});

module.exports = mongoose.model("person", personSchema);
