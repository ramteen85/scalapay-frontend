import { authActions } from '../../store/auth';
import { sidebarActions } from '../../store/sidebar';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import classes from './Navbar.module.css';
import { useRef, Fragment } from 'react';
import '../../assets/boxicons-2.0.7/css/boxicons.css';

function Navbar(props) {
  // get data from store
  const dispatch = useDispatch();
  const sidebarToggleRef = props.sidebarToggleRef;

  // functions

  const toggleSidebar = () => {
    dispatch(sidebarActions.toggleSidebar());
  };
  const onLogout = (e) => {
    e.preventDefault();
    dispatch(authActions.logoutHandler());
  };

  // render
  return (
    <Fragment>
      <header>
        <div className={classes['top-bar']}>
          <div className={classes['top-bar-leftcol']}>
            <ul className={classes['leftcol-list']}>
              <li
                className={classes['topnav__left-item']}
                onClick={toggleSidebar}
                ref={sidebarToggleRef}
                style={{ marginRight: '1rem' }}
              >
                {/* Message Setting */}
                <i
                  className="bx bx-menu"
                  style={{ color: 'white' }}
                  key={'sidebar_toggle'}
                />
              </li>
            </ul>
          </div>
          <div className={classes['top-bar-rightcol']}>
            <ul className={classes['rightcol-list']}>
              <li className={classes['rightcol-list-item']}>
                <Link to="#" onClick={onLogout}>
                  Logout
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </header>
    </Fragment>
  );
}

export default Navbar;
