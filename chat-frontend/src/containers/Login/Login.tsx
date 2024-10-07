import React, {useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {useAppDispatch, useAppSelector} from '../../app/hooks';
import {selectLoginError, selectLoginLoading} from '../../store/usersSlice';
import {LoginMutation} from '../../types';
import {login} from '../../store/usersThunks';
import {toast} from 'react-toastify';
import ButtonSpinner from '../../components/Spinner/ButtonSpinner';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const error = useAppSelector(selectLoginError);
  const loading = useAppSelector(selectLoginLoading);

  const [state, setState] = useState<LoginMutation>({
    username: '',
    password: '',
  });

  const inputChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = event.target;
    setState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const submitFormHandler = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await dispatch(login(state)).unwrap();
      navigate('/');
      toast.success('Login was successful');
    } catch  {
      toast.error('There was a login error');
    }
  };
  return (
    <form className='mt-5 w-25 mx-auto' onSubmit={submitFormHandler}>
      <h4 className='text-center'>Sign in</h4>
      {error && (
        <div className="alert alert-danger d-flex align-items-center">
          <i className="bi bi-exclamation-circle" style={{color: 'red'}}></i>
          <div className='ms-2'>
            {error.error}
          </div>
        </div>
      )}
      <div className="form-group mb-3">
        <div>
          <label htmlFor="username">Username</label>
          <input type="text" name="username" id="username" className="form-control" onChange={inputChangeHandler}
                 value={state.username} required autoComplete="current-username"/>
        </div>
      </div>
      <div className="form-group mb-3">
        <div>
          <label htmlFor="password">Password</label>
          <input type="password" name="password" id="password" className="form-control" onChange={inputChangeHandler}
                 value={state.password} required autoComplete="new-password"/>
        </div>
      </div>
      <button type="submit" className="btn btn-primary w-100 mb-3" disabled={loading}>{loading && <ButtonSpinner/>}SIGN
        IN
      </button>
      <Link to='/register'>Or sing up</Link>
    </form>
  );
};

export default Login;