import { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import { EDIT_AUTHOR } from "../queries";

const EditAuthor = ({ authors }) => {
  const [name, setName] = useState(authors[0].name);
  const [born, setBorn] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [editAuthor, { data, loading, error }] = useMutation(EDIT_AUTHOR, {
    onError: ({ networkError, graphQLErrors }) => {
      if (networkError) {
        setErrorMessage(networkError.message);
      } else {
        setErrorMessage(graphQLErrors.map((e) => e.message).join("\n"));
      }
      setTimeout(() => setErrorMessage(""), 10000);
    },
  });

  useEffect(() => {
    if (data && data.editAuthor === null) {
      setErrorMessage("No such author found.");
      setTimeout(() => setErrorMessage(""), 10000);
    }
  }, [data]);

  const submit = (e) => {
    e.preventDefault();

    editAuthor({
      variables: {
        name: name ? name : null,
        born: born ? Number(born) : null,
      },
    });

    setBorn("");
  };

  if (loading) return <div>updating author...</div>;

  return (
    <div>
      <h2>Edit authors</h2>
      <div style={{ padding: "1em", color: "red", whiteSpace: "pre-wrap" }}>
        {errorMessage}
      </div>
      <form onSubmit={submit}>
        <div>
          <label>
            name
            <select
              value={name}
              onChange={({ target }) => setName(target.value)}
            >
              {authors.map((a) => (
                <option value={a.name} key={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div>
          <label>
            born
            <input
              id="born"
              inputMode="numeric"
              pattern="[0-9]*"
              value={born}
              onChange={({ target }) => setBorn(target.value)}
            />
          </label>
        </div>
        <button type="submit">update author</button>
      </form>
    </div>
  );
};

export default EditAuthor;
