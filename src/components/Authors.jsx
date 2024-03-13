import { useQuery } from "@apollo/client";
import { ALL_AUTHORS } from "../queries";

import EditAuthor from "./EditAuthor";

const Authors = () => {
  const res = useQuery(ALL_AUTHORS);

  if (res.loading) {
    return <div>loading authors...</div>;
  }

  return (
    <>
      <div>
        <h2>Authors</h2>
        <table>
          <tbody>
            <tr>
              <th></th>
              <th>born</th>
              <th>books</th>
            </tr>
            {res.data.allAuthors.map((a) => (
              <tr key={a.id}>
                <td>{a.name}</td>
                <td>{a.born}</td>
                <td>{a.bookCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <EditAuthor authors={res.data.allAuthors} />
    </>
  );
};

export default Authors;
