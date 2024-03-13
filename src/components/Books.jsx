import { useQuery } from "@apollo/client";
import { GET_BOOKS } from "../queries";

const Books = (props) => {
  const res = useQuery(GET_BOOKS);

  if (res.loading) {
    return <div>loading books...</div>;
  }

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
          {res.data.allBooks.map((a) => (
            <tr key={a.id}>
              <td>{a.title}</td>
              <td>{a.author}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Books;
