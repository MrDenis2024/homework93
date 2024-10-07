import React from 'react';
import {User} from '../../types';
import {useAppDispatch} from '../../app/hooks';
import {logout} from '../../store/usersThunks';

interface Props {
  user: User;
}

const UserMenu: React.FC<Props> = ({user}) => {
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div className="dropdown">
      <button className="dropdown-toggle btn btn-success" data-bs-toggle="dropdown">
        Hello, {user.displayName}
      </button>
      <ul className="dropdown-menu">
        <li>
          <button className="dropdown-item" onClick={handleLogout}>Logout</button>
        </li>
      </ul>
    </div>
  );
};

export default UserMenu;