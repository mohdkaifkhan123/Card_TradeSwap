import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { LOGIN } from '../../utils/mutations';
import Auth from '../../utils/auth'
function LoginPage(){
  const [formState, setFormState] = useState({ email: '', password: '' });
  const [login, { error, data }] = useMutation(LOGIN);

  // update state based on form input changes
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormState({
      ...formState,
      [name]: value,
    });
  };

  // submit form
  const handleFormSubmit = async (event) => {
    event.preventDefault();
    console.log(formState);
    try {
      const { data } = await login({
        variables: { ...formState },
      });

      Auth.login(data.login.token);
    } catch (e) {
      console.error(e);
    }

    // clear form values
    setFormState({
      email: '',
      password: '',
    });
  };

// Locking off the loging and signup page if the user is already logged or signed in 
if(Auth.loggedIn()){
  return(
    <h1>Already SIGNED IN</h1>
  )
}
  return (
<form onSubmit={handleFormSubmit}>
  {data ? (
    <p>
      <Link to="/">back to the homepage.</Link>
    </p>
  ) : (
    <>
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
      <button type="submit">
        Submit
      </button>
    </>
  )}
</form>

  );
};

export default LoginPage;

 