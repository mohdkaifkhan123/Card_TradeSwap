import { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { SIGN_UP } from "../../utils/mutations";
import Auth from "../../utils/auth";
import "./SignupLogin.css";
function SignupPage() {
  const [formState, setFormState] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [signup, { error, data }] = useMutation(SIGN_UP);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormState({
      ...formState,
      [name]: value,
    });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    console.log(formState);

    try {
      const { data } = await signup({
        variables: { ...formState },
      });

      Auth.login(data.addUser.token);
    } catch (e) {
      console.error(e);
    }
  };
  // Locking off the loging and signup page if the user is already logged or signed in

  if (Auth.loggedIn()) {
    return <h1>Already SIGNED IN</h1>;
  }
  return (
    <>
      {data ? (
        <p>
          <Link to="/">back to the homepage.</Link>
        </p>
      ) : (
        <form onSubmit={handleFormSubmit}>
          <input
            className="form-input"
            placeholder="Your username"
            name="username"
            type="text"
            value={formState.name}
            onChange={handleChange}
          />
          <input
            className="form-input"
            placeholder="Your email"
            name="email"
            type="email"
            value={formState.email}
            onChange={handleChange}
          />
          <input
            className="form-input"
            placeholder="******"
            name="password"
            type="password"
            value={formState.password}
            onChange={handleChange}
          />

          <button type="submit">Submit</button>
        </form>
      )}
    </>
  );
}

export default SignupPage;
