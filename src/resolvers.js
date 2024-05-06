import { GraphQLError, subscribe } from "graphql";
import jwt from "jsonwebtoken";
const { sign } = jwt;
import Author from "./models/Author.js";
import Book from "./models/Book.js";
import User from "./models/User.js";
import { PubSub } from "graphql-subscriptions";
const pubsub = new PubSub();

const resolvers = {
  Query: {
    bookCount: async () => await Book.collection.countDocuments(),
    authorCount: async () => await Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      const myQuery = {};
      if (args.author) {
        const author = await Author.findOne({ name: args.author });
        if (!author) return [];
        myQuery.author = author._id;
      }
      if (args.genre) myQuery.genres = args.genre;
      return await Book.find(myQuery).populate("author");
    },
    allAuthors: async () => await Author.find({}),
    me: (root, args, { currentUser }) => currentUser,
  },
  Mutation: {
    addBook: async (root, args, { currentUser }) => {
      if (!currentUser) {
        throw new GraphQLError("Not authenticated", {
          extensions: {
            code: "AUTHENTICATION_ERROR",
          },
        });
      }
      let author = await Author.findOne({ name: args.author });
      if (!author) {
        try {
          author = new Author({ name: args.author });
          author = await author.save();
        } catch (error) {
          throw new GraphQLError("Author creation failed", {
            extensions: {
              code: "BAD_USER_INPUT",
              invalidArgs: args.author,
              error,
            },
          });
        }
      }
      const book = new Book({ ...args, author: author._id });
      try {
        await book.save();
      } catch (error) {
        throw new GraphQLError("Book creation failed", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.title,
            error,
          },
        });
      }
      author.books = author.books.concat(book._id);
      await author.save();
      await book.populate("author");
      pubsub.publish("BOOK_ADDED", { bookAdded: book });
      return book;
    },
    editAuthor: async (root, args, { currentUser }) => {
      if (!currentUser) {
        throw new GraphQLError("Not authenticated", {
          extensions: {
            code: "AUTHENTICATION_ERROR",
          },
        });
      }
      const author = await Author.findOne({ name: args.name });
      if (!author) return null;
      author.born = args.setBornTo;
      return await author.save();
    },
    createUser: async (root, args) => {
      const user = new User({ ...args });
      return user.save().catch((error) => {
        throw new GraphQLError("User creation failed", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.username,
            error,
          },
        });
      });
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username });
      if (!user || args.password !== process.env.SECRET) {
        throw new GraphQLError("Wrong credentials", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }
      const userForToken = {
        username: user.username,
        id: user._id,
      };
      return { value: sign(userForToken, process.env.SECRET) };
    },
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator("BOOK_ADDED"),
    },
  },
  Author: {
    bookCount: async (root) => root.books.length,
  },
};

export default resolvers;
