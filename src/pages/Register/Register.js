import React, { Fragment, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Button from '../../components/Button/Button';
import { authActions, setAuthTimer } from '../../store/auth';
import Config from '../../helpers/config';
import LoadingScreen from '../../components/LoadingScreen/LoadingScreen';
import '../Login/Login.css';

function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState('Logging you in');
  const [errorMsg, setErrorMsg] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

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

  const onConfirmPasswordChanged = (e) => {
    setConfirmPassword(e.target.value);
  };

  const submitForm = async (e) => {
    e.preventDefault();
    try {
      // reset errors for another go
      setError(false);
      setErrorMsg('');

      // start loading
      setLoading(true);
      setLoadingMsg('Registering you');

      // error handling and validation

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

      // validate confirm password
      if (confirmPassword !== password) {
        setError(true);
        setErrorMsg('Passwords must match!');
        setLoading(false);
        return;
      }

      // reach out to API
      let response = await fetch(`${Config.url}:${Config.port}/auth/register`, {
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
        setConfirmPassword('');
        return;
      }

      setLoadingMsg('Logging you in');

      // stop loading
      setLoading(false);

      // reset form fields
      setEmail('');
      setPassword('');
      setConfirmPassword('');

      // all good? get token, login and start auth timer
      const expirationTime = new Date(new Date().getTime() + resData.expiresIn);
      dispatch(
        authActions.loginHandler({
          token: resData.token,
          expiresIn: expirationTime.toISOString(),
        }),
      );
      dispatch(setAuthTimer());
      navigate('/');
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
            <div className="user-box">
              <input
                className="user-input"
                type="password"
                onChange={onConfirmPasswordChanged}
              />
              {confirmPassword.length === 0 && <label>Confirm Password</label>}
            </div>

            <Button label={`Register`} />
            <Link className="page-link" to="/">
              Have an account? Sign in
            </Link>
          </form>
        </div>
      ) : (
        <LoadingScreen message={loadingMsg} />
      )}
    </Fragment>
  );
}

export default Register;
