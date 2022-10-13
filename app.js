const express = require('express');
require('dotenv').config();
const bodyParser = require('body-parser');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');
const app = express();
const Event = require("./models/event");

const port = 1234;
app.use(bodyParser.json());

const events = [];

app.use("/graphql", graphqlHTTP({
    schema: buildSchema(`
        type Event {
            _id: ID!
            title: String!
            description: String!
            price: Float!
            date: String!
        }

        input EventInput {
            title: String!
            description: String!
            price: Float!
            date: String!
        }

        type RootQuery{
            events: [Event!]!
        }

        type RootMutaiton{
            createEvent(eventInput: EventInput): Event
        }

        schema{
            query: RootQuery,
            mutation: RootMutaiton
        }
    `),
    rootValue: {
        events: () => {
            return Event.find()
                .then(events => {
                    return events.map(event => {
                        // return { ...event._doc, _id: event._doc._id.toString() }
                        return { ...event._doc, _id: event.id }
                    })
                })
                .catch(err => {
                    console.log(err)
                })
        },
        createEvent: (args) => {
            /*  const event = {
                 _id: Math.random().toString(),
                 title: args.eventInput.title,
                 description: args.eventInput.description,
                 price: +args.eventInput.price,
                 date: args.eventInput.date
             } */
            const event = new Event({
                title: args.eventInput.title,
                description: args.eventInput.description,
                price: +args.eventInput.price,
                date: new Date(args.eventInput.date)
            })
            return event
                .save()
                .then(result => {
                    console.log(result);
                    return { ...result._doc, _id: result._doc._id.toString() };
                })
                .catch(err => {
                    console.log(err);
                    throw err;
                });
        }
    },
    graphiql: true
}));

// console.log("\nprocess.env",process.env)

mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.klizcao.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`)
    .then(() => {
        app.listen(port);
    })
    .catch(err => {
        console.log(err)
    });

console.log(`we are having a party over ${port}/graphql`)