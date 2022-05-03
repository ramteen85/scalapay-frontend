import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sidebarActions } from '../../store/sidebar';
import { useNavigate } from 'react-router-dom';

const SidebarMain = (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toggleSidebar = (e, action, route) => {
    e.preventDefault();
    if (action) {
      action(e);
    } else {
      navigate(route);
    }
    dispatch(sidebarActions.closeSidebar());
  };

  return (
    <ul className={`sidebar-item-list`}>
      {props.items.map((item, index) => (
        <div
          key={index}
          className={'sidebar-list-item'}
          onClick={(e) => toggleSidebar(e, item.action, item.route)}
        >
          <span>{item.display_name}</span>
        </div>
      ))}
    </ul>
  );
};

export default SidebarMain;
