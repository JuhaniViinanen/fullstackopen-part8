import { useState } from "react";
import { useMutation } from "@apollo/client";
import { CREATE_BOOK, GET_BOOKS, ALL_AUTHORS } from "../queries";

const NewBook = () => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [published, setPublished] = useState("");
  const [genre, setGenre] = useState("");
  const [genres, setGenres] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  const [addBook, { loading }] = useMutation(CREATE_BOOK, {
    refetchQueries: [
      { query: GET_BOOKS, variables: { author: null, genre: null } },
      { query: ALL_AUTHORS },
    ],
    onError: ({ networkError, graphQLErrors }) => {
      if (networkError) {
        setErrorMessage(networkError.message);
      } else {
        setErrorMessage(graphQLErrors.map((e) => e.message).join("\n"));
      }
      setTimeout(() => {
        setErrorMessage("");
      }, 10000);
    },
  });

  const submit = (event) => {
    event.preventDefault();

    addBook({
      variables: {
        title: title ? title : null,
        author: author ? author : null,
        published: published ? Number(published) : null,
        genres: genres.length ? genres : null,
      },
    });

    setTitle("");
    setPublished("");
    setAuthor("");
    setGenres([]);
    setGenre("");
  };

  const addGenre = () => {
    setGenres(genres.concat(genre));
    setGenre("");
  };

  if (loading) return <div>book submission in process...</div>;

  return (
    <div>
      <div style={{ padding: "1em", color: "red", whiteSpace: "pre-wrap" }}>
        {errorMessage}
      </div>
      <form onSubmit={submit}>
        <div>
          title
          <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author
          <input
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          published
          <input
            inputMode="numeric"
            pattern="[0-9]*"
            value={published}
            onChange={({ target }) => setPublished(target.value)}
          />
        </div>
        <div>
          <input
            value={genre}
            onChange={({ target }) => setGenre(target.value)}
          />
          <button onClick={addGenre} type="button">
            add genre
          </button>
        </div>
        <div>genres: {genres.join(" ")}</div>
        <button type="submit">create book</button>
      </form>
    </div>
  );
};

export default NewBook;
