const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const bodyParser = require("body-parser");
//const ExpressGraphQL = require("express-graphql");
const {
  GraphQLID,
  GraphQLString,
  GraphQLList,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLNonNull,
  buildSchema,
} = require("graphql");
const mongoose = require("mongoose");
const personModel = require("./models/person.model");
const app = express();
const PORT = 5001;

const DB = "mongodb://127.0.0.1:27017/graphqlproject";
mongoose.connect(DB).then(() => {
  app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
  });
});

const PersonType = new GraphQLObjectType({
  name: "Person",
  fields: {
    id: { type: GraphQLID },
    firstname: { type: GraphQLString },
    lastname: { type: GraphQLString },
  },
});

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: "Query",
    fields: {
      people: {
        type: new GraphQLList(PersonType),
        resolve: (root, args, context, info) => {
          return personModel.find().exec();
        },
      },
      person: {
        type: PersonType,
        args: {
          id: { type: new GraphQLNonNull(GraphQLID) },
        },
        resolve: (root, args, context, info) => {
          return personModel.findById(args.id).exec();
        },
      },
    },
  }),
  mutation: new GraphQLObjectType({
    name: "Mutation",
    fields: {
      person: {
        type: PersonType,
        args: {
          firstname: { type: new GraphQLNonNull(GraphQLString) },
          lastname: { type: new GraphQLNonNull(GraphQLString) },
        },
        resolve: (root, args, context, info) => {
          let person = new personModel(args);
          return person.save();
        },
      },
    },
  }),
});

app.use(bodyParser.json());
app.use(
  "/graphql",
  graphqlHTTP({
    schema: buildSchema(`
        type RootQuery {
            events: [String!]!
        }

        type RootMutation {
            createEvent(name: String): String
        }

        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    rootValue: {
      events: () => {
        return ["Romantic", "Cooking", "Sailing", "All-Night Coding"];
      },
      createEvent: (args) => {
        const eventName = args.name;
        return eventName;
      },
    },
    graphiql: true,
  })
);
