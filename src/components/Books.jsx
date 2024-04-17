import { useQuery } from "@apollo/client";
import { GET_BOOKS } from "../queries";

const Books = () => {
  const res = useQuery(GET_BOOKS, {
    variables: {
      author: null,
      genre: null,
    },
  });
  const { loading, error, data, refetch } = useQuery(GET_BOOKS, {
    variables: {
      author: null,
      genre: null,
    },
  });

  if (loading) {
    return <div>loading books...</div>;
  }

  const genres = [...new Set(res.data.allBooks.map((b) => b.genres).flat())];

  return (
    <div>
      <h2>Books</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {data.allBooks.map((a) => (
            <tr key={a.id}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        {genres.map((genre) => (
          <button key={genre} onClick={() => refetch({ author: null, genre })}>
            {genre}
          </button>
        ))}
        <button onClick={() => refetch({ author: null, genre: null })}>
          all genres
        </button>
      </div>
    </div>
  );
};

export default Books;
