import React, {useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {useAppDispatch, useAppSelector} from '../../app/hooks';
import {selectRegisterError, selectRegisterLoading} from '../../store/usersSlice';
import {RegisterMutation} from '../../types';
import {register} from '../../store/usersThunks';
import {toast} from 'react-toastify';
import ButtonSpinner from '../../components/Spinner/ButtonSpinner';

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const error = useAppSelector(selectRegisterError);
  const loading = useAppSelector(selectRegisterLoading);
  const [state, setState] = useState<RegisterMutation>({
    username: '',
    password: '',
    displayName: '',
  });

  const getFieldError = (fieldName: string) => {
    return error?.errors[fieldName]?.message;
  };

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
      await dispatch(register(state)).unwrap();
      navigate('/');
      toast.success('Registration was successful');
    } catch {
      toast.error('There was a registration error');
    }
  };

  return (
    <form className='mt-5 w-25 mx-auto' onSubmit={submitFormHandler}>
      <h4 className='text-center'>Sign up</h4>
      <div className="form-group mb-3">
        <div className={`${getFieldError('username') ? 'is-invalid' : ''}`}>
          <label htmlFor="username">Username</label>
          <input type="text" name="username" id="username" className="form-control" onChange={inputChangeHandler}
                 value={state.username} required autoComplete='new-username'/>
        </div>
        {getFieldError('username') && (
          <div className="invalid-feedback">
            {getFieldError('username')}
          </div>
        )}
      </div>
      <div className="form-group mb-3">
        <div className={`${getFieldError('password') ? 'is-invalid' : ''}`}>
          <label htmlFor="password">Password</label>
          <input type="password" name="password" id="password" className="form-control" onChange={inputChangeHandler}
                 value={state.password} required autoComplete='new-password'/>
        </div>
        {getFieldError('password') && (
          <div className="invalid-feedback">
            {getFieldError('password')}
          </div>
        )}
      </div>
      <div className="form-group mb-3">
        <div className={`${getFieldError('displayName') ? 'is-invalid' : ''}`}>
          <label htmlFor="displayName">Display name</label>
          <input type="displayName" name="displayName" id="displayName" className="form-control"
                 onChange={inputChangeHandler}
                 value={state.displayName} required/>
        </div>
        {getFieldError('displayName') && (
          <div className="invalid-feedback">
            {getFieldError('displayName')}
          </div>
        )}
      </div>
      <button type="submit" className="btn btn-primary w-100 mb-3" disabled={loading}>{loading && <ButtonSpinner/>}SIGN
        UP
      </button>
      <Link to='/login'>Already have an account? Sign in</Link>
    </form>
  );
};

export default Register;