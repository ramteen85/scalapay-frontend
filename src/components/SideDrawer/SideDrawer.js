import React, { useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { authActions } from '../../store/auth';
import { sidebarActions } from '../../store/sidebar';
import SidebarMain from './SidebarMain';
import './SideDrawer.css';

function SideDrawer(props) {
  const sidebarRef = useRef(null);
  const sidebarToggleRef = useRef(null);
  const sidebarOpen = useSelector((state) => state.sidebar?.sidebarOpen);
  const { onClickOutside } = props;
  const dispatch = useDispatch();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        onClickOutside && onClickOutside();
      }
    };
    document.addEventListener('click', handleClickOutside, true);
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, [onClickOutside]);

  const onLogout = (e) => {
    e.preventDefault();
    dispatch(authActions.logoutHandler());
  };

  const toggleSidebar = (e) => {
    dispatch(sidebarActions.toggleSidebar());
  };

  const menuItems = [
    {
      display_name: 'Create Order',
      route: '/',
    },
    {
      display_name: 'Display Orders',
      route: '/display-orders',
    },
    {
      display_name: 'Logout',
      route: '/#',
      action: onLogout,
    },
  ];

  return (
    <div
      ref={sidebarRef}
      className={`side-drawer ${sidebarOpen ? 'sidebar-shifted' : ''}`}
    >
      <div className="sidebar-header">
        <h2 className="sidebar-title">Scalapay</h2>
        <div
          className={'sidebar__menu-close'}
          onClick={toggleSidebar}
          ref={sidebarToggleRef}
        >
          <i className="bx bx-x"></i>
        </div>
      </div>
      <div className="divider"></div>
      <div className="sidebar-main">
        <SidebarMain items={menuItems} />
      </div>
    </div>
  );
}

export default SideDrawer;
