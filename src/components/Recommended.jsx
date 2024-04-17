import { useQuery } from "@apollo/client";
import { GET_BOOKS, GET_USER } from "../queries";

const Recommended = () => {
  const { loading, data, error } = useQuery(GET_USER, {
    fetchPolicy: "network-only",
  });
  const books = useQuery(GET_BOOKS, {
    skip: loading,
    variables: {
      author: null,
      genre: !data ? null : data.me.favoriteGenre,
    },
  });

  if (loading || books.loading) return <div>loading...</div>;

  return (
    <div>
      <h2>Recommendations</h2>
      <p>{`books in your favorite genre ${data.me.favoriteGenre}`}</p>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.data.allBooks.map((a) => (
            <tr key={a.id}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Recommended;
