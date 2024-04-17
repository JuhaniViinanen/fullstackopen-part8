import { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import { LOGIN } from "../queries";
import { useNavigate } from "react-router-dom";

const LoginForm = ({ setToken }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const nav = useNavigate();

  const [login, { data, loading }] = useMutation(LOGIN, {
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

  useEffect(() => {
    if (data) {
      const token = data.login.value;
      setToken(token);
      localStorage.setItem("usertoken", token);
      nav("/");
    }
  }, [data]);

  const submit = (e) => {
    e.preventDefault();

    login({
      variables: {
        username: username ? username : null,
        password: password ? password : null,
      },
    });

    setUsername("");
    setPassword("");
  };

  if (loading) return <div>logging in...</div>;

  return (
    <div>
      <div style={{ padding: "1em", color: "red", whiteSpace: "pre-wrap" }}>
        {errorMessage}
      </div>
      <form onSubmit={submit}>
        <div>
          <label>
            username
            <input
              value={username}
              onChange={({ target }) => setUsername(target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            password
            <input
              type="password"
              value={password}
              onChange={({ target }) => setPassword(target.value)}
            />
          </label>
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  );
};

export default LoginForm;
