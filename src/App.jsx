import { Routes, Route, Link, Navigate, useNavigate } from "react-router-dom";
import { useApolloClient, useSubscription } from "@apollo/client";
import { BOOK_ADDED, GET_BOOKS } from "./queries";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import LoginForm from "./components/LoginForm";
import Recommended from "./components/Recommended";
import { useState, useEffect } from "react";

const linkStyle = { padding: "1em" };

function App() {
  const [token, setToken] = useState(null);
  const client = useApolloClient();
  const nav = useNavigate();

  useEffect(() => {
    setToken(window.localStorage.getItem("usertoken"));
  }, [window.localStorage.getItem("usertoken")]);

  useSubscription(BOOK_ADDED, {
    onData: ({ data, client }) => {
      window.alert(`New book added\n${data.data.bookAdded.title}`);
      client.cache.updateQuery(
        { query: GET_BOOKS, variables: { author: null, genre: null } },
        ({ allBooks }) => {
          return {
            allBooks: allBooks.concat(data.data.bookAdded),
          };
        }
      );
    },
  });

  const logout = () => {
    setToken(null);
    localStorage.clear();
    client.resetStore();
    nav("/");
  };

  if (!token) {
    return (
      <>
        <div>
          <Link style={linkStyle} to="/authors">
            Authors
          </Link>
          <Link style={linkStyle} to="/books">
            Books
          </Link>
          <Link style={linkStyle} to="/login">
            Login
          </Link>
        </div>
        <Routes>
          <Route path="/authors" element={<Authors />} />
          <Route path="/books" element={<Books />} />
          <Route path="/login" element={<LoginForm setToken={setToken} />} />
          <Route path="/" element={<Navigate replace to={"/authors"} />} />
        </Routes>
      </>
    );
  } else {
    return (
      <>
        <div>
          <Link style={linkStyle} to="/authors">
            Authors
          </Link>
          <Link style={linkStyle} to="/books">
            Books
          </Link>
          <Link style={linkStyle} to="/addbook">
            Add book
          </Link>
          <Link style={linkStyle} to="/recommended">
            Recommended
          </Link>
          <button onClick={logout}>logout</button>
        </div>
        <Routes>
          <Route path="/authors" element={<Authors />} />
          <Route path="/books" element={<Books />} />
          <Route path="/addbook" element={<NewBook />} />
          <Route path="/recommended" element={<Recommended />} />
          <Route path="/" element={<Navigate replace to={"/authors"} />} />
        </Routes>
      </>
    );
  }
}

export default App;
