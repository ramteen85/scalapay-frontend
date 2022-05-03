import React, { Fragment, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { authActions, setAuthTimer } from '../../store/auth';
import Config from '../../helpers/config';
import LoadingScreen from '../../components/LoadingScreen/LoadingScreen';
import Button from '../../components/Button/Button';
import './Login.css';

function Login() {
  const dispatch = useDispatch();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // functions
  const validateEmail = (email) => {
    if (/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      return true;
    }
    return false;
  };

  const onEmailChanged = (e) => {
    setEmail(e.target.value);
  };

  const onPasswordChanged = (e) => {
    setPassword(e.target.value);
  };

  const submitForm = async (e) => {
    e.preventDefault();
    try {
      // reset errors for another go
      setError(false);
      setErrorMsg('');

      // start loading
      setLoading(true);

      // error handling

      // validate email
      if (email.length === 0) {
        setError(true);
        setErrorMsg('Please enter an email');
        setLoading(false);
        return;
      }
      if (!validateEmail(email)) {
        setError(true);
        setErrorMsg('Please enter a valid email');
        setLoading(false);
        return;
      }

      // validate password
      if (password.length === 0) {
        setError(true);
        setErrorMsg('Please enter a password');
        setLoading(false);
        return;
      }

      // reach out to API
      let response = await fetch(`${Config.url}:${Config.port}/auth/login`, {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });
      // collect response
      let resData = await response.json();

      // catch any server side errors
      if (resData.error === true) {
        setError(true);
        setErrorMsg(resData.message);
        setLoading(false);

        // reset form fields
        setEmail('');
        setPassword('');
        setPassword('');
        return;
      }

      // stop loading
      setLoading(false);

      // reset form fields
      setEmail('');
      setPassword('');

      // all good? set auth timer and login!
      const expirationTime = new Date(new Date().getTime() + resData.expiresIn);
      dispatch(
        authActions.loginHandler({
          token: resData.token,
          expiresIn: expirationTime.toISOString(),
        }),
      );
      dispatch(setAuthTimer());
    } catch (error) {
      // catch any remaining erors
      setError(true);
      setErrorMsg(error.message);
      setLoading(false);
    }
  };

  return (
    <Fragment>
      {!loading ? (
        <div className="login-box">
          <h2 className="login-heading">Scalapay</h2>
          {error && <span className="error">{errorMsg}</span>}
          <form autoComplete="off" onSubmit={submitForm}>
            <div className="user-box">
              <input
                className="user-input"
                autoComplete="none"
                onChange={onEmailChanged}
              />
              {email.length === 0 && <label>Email</label>}
            </div>
            <div className="user-box">
              <input
                className="user-input"
                type="password"
                onChange={onPasswordChanged}
              />
              {password.length === 0 && <label>Password</label>}
            </div>

            <Button label={`Login`} />
            <Link className="page-link" to="/register">
              Register an Account
            </Link>
          </form>
        </div>
      ) : (
        <LoadingScreen message={`Logging you in`} />
      )}
    </Fragment>
  );
}

export default Login;
