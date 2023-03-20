const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const connectDB = require('./config/db');
const colors = require('colors');
const path = require('path');
const schema = require('./schema/schema');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;
const url = process.env.MONGO_URI;

app.use(cors());
app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    graphiql: true,
  })
);

const start = () => {
  try {
    connectDB(url);
    app.listen(port, () => {
      console.log(`Listening on port ${port}`.blue.underline.bold);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
