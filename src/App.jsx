import { Routes, Route, Link, Navigate } from "react-router-dom";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";

const linkStyle = { padding: "1em" };

function App() {
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
      </div>
      <Routes>
        <Route path="/authors" element={<Authors />} />
        <Route path="/books" element={<Books />} />
        <Route path="/addbook" element={<NewBook />} />
        <Route path="/" element={<Navigate replace to={"/authors"} />} />
      </Routes>
    </>
  );
}

export default App;
