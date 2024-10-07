import {NavLink} from 'react-router-dom';

const AnonymousMenu = () => {
  return (
    <div className='d-flex flex-row gap-3 flex-nowrap'>
      <NavLink to="/register" className='btn btn-success'>Sign up</NavLink>
      <NavLink to="/login" className='btn btn-success'>Sign in</NavLink>
    </div>
  );
};

export default AnonymousMenu;