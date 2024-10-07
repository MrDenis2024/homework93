import {NavLink} from 'react-router-dom';
import {useAppSelector} from '../../app/hooks';
import {selectUser} from '../../store/usersSlice';
import UserMenu from './UserMenu';
import AnonymousMenu from './AnonymouseMenu';

const Toolbar = () => {
  const user = useAppSelector(selectUser);
  return (
    <nav className='navbar navbar-dark bg-success'>
      <div className='container'>
        <NavLink to='/' className='navbar-brand'>Chat</NavLink>
        {user ? (
          <UserMenu user={user} />
        ) : (
          <AnonymousMenu />
        )}
      </div>
    </nav>
  );
};

export default Toolbar;