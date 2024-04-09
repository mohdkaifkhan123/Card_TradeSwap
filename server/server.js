const express = require("express"); // To run the server
const { ApolloServer } = require("@apollo/server"); // To interacted with apollo server
const { expressMiddleware } = require("@apollo/server/express4");
const path = require("path");
// for authentication
const { authMiddleWare } = require("./utils/auth");
const { typeDefs, resolvers } = require("./schemas");
// TypeDefs - Describing the data structure
// Resolver- making these structures actually work from your database
const db = require("./config/connection"); // required the established connection and store within a varibale

const PORT = process.env.PORT || 3001; // the port your server will run on or whatever port when you deploy it
const app = express(); // creates an instance of your express app basically just calling the function
const server = new ApolloServer({
  //passing in your typedefs and resolvers so it shows up in apollo server
  typeDefs,
  resolvers,
});

// Create a new instance of an Apollo server with the GraphQL schema
const startApolloServer = async () => {
  await server.start(); // waits for server to start

  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());
  // ????

  app.use(
    "/graphql",
    expressMiddleware(server, {
      context: authMiddleWare, // for auth
    })
  );

  if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../client/dist")));

    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "../client/dist/index.html"));
    });
  }
  //???
  //Once your databse is open the server will start then starting the apollo server seen in line one
  db.once("open", () => {
    app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}!`);
      console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
    });
  });
};

// Call the async function to start the server
startApolloServer();
