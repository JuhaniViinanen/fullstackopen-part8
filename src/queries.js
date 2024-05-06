import { gql } from "@apollo/client";

export const ALL_AUTHORS = gql`
  query {
    allAuthors {
      name
      id
      born
      bookCount
    }
  }
`;

export const GET_BOOKS = gql`
  query Query($author: String, $genre: String) {
    allBooks(author: $author, genre: $genre) {
      title
      published
      author {
        name
      }
      id
      genres
    }
  }
`;

export const GET_USER = gql`
  query {
    me {
      username
      favoriteGenre
    }
  }
`;

export const CREATE_BOOK = gql`
  mutation Mutation(
    $title: String!
    $author: String!
    $published: Int!
    $genres: [String!]!
  ) {
    addBook(
      title: $title
      author: $author
      published: $published
      genres: $genres
    ) {
      title
      author {
        name
      }
      published
      genres
      id
    }
  }
`;

export const EDIT_AUTHOR = gql`
  mutation Mutation($name: String!, $born: Int!) {
    editAuthor(name: $name, setBornTo: $born) {
      name
      id
      born
    }
  }
`;

export const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      value
    }
  }
`;

export const BOOK_ADDED = gql`
  subscription {
    bookAdded {
      title
      published
      genres
      id
      author {
        name
      }
    }
  }
`;
