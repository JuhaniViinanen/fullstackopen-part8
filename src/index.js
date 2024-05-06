import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/lib/use/ws";
import express from "express";
import { createServer } from "http";
import cors from "cors";
import "dotenv/config.js";
import mongoose from "mongoose";
import User from "./models/User.js";
import typeDefs from "./schema.js";
import resolvers from "./resolvers.js";
import jwt from "jsonwebtoken";
const { verify } = jwt;

const MONGODB_URI = process.env.MONGODB_URI;

console.log("connecting to db", MONGODB_URI);

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("connected to MongoDB"))
  .catch((e) => console.log("error connecting to MongoDB", e.message));

const app = express();
const httpServer = createServer(app);
const schema = makeExecutableSchema({ typeDefs, resolvers });

const wsServer = new WebSocketServer({
  server: httpServer,
  path: "/",
});
const serverCleanup = useServer({ schema }, wsServer);

const server = new ApolloServer({
  schema,
  plugins: [
    ApolloServerPluginDrainHttpServer({ httpServer }),
    {
      async serverWillStart() {
        return {
          async drainServer() {
            await serverCleanup.dispose();
          },
        };
      },
    },
  ],
});

await server.start();

app.use(
  "/",
  cors(),
  express.json(),
  expressMiddleware(server, {
    context: async ({ req, res }) => {
      const auth = req ? req.headers.authorization : null;
      if (auth && auth.startsWith("Bearer ")) {
        const dedodedToken = verify(auth.substring(7), process.env.SECRET);
        const currentUser = await User.findById(dedodedToken.id);
        return { currentUser };
      }
    },
  })
);

const PORT = 4000;
httpServer.listen(PORT, () => {
  console.log(`Server ready at http://localhost:${PORT}/`);
});
