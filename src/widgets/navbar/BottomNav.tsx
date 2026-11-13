import { NavLink } from 'react-router-dom';
import { useAuth } from '@/entities/user';
import classes from './BottomNav.module.css';

export function BottomNav() {
  const { isAuthenticated } = useAuth();

  return (
    <nav className={classes.nav}>
      <NavLink
        to="/"
        end
        className={({ isActive }) => `${classes.item} ${isActive ? classes.itemActive : ''}`}
      >
        <span>Главная</span>
      </NavLink>

      <NavLink
        to="/catalog"
        className={({ isActive }) => `${classes.item} ${isActive ? classes.itemActive : ''}`}
      >
        <span>Каталог</span>
      </NavLink>

      <NavLink
        to={isAuthenticated ? '/profile' : '/login'}
        className={({ isActive }) => `${classes.item} ${isActive ? classes.itemActive : ''}`}
      >
        <span>{isAuthenticated ? 'Профиль' : 'Вход'}</span>
      </NavLink>
    </nav>
  );
}

export default BottomNav;
