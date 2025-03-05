import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const SubMenu = ({ item, collapsed }) => {
  const [subnav, setSubnav] = useState(false);

  const showSubnav = () => setSubnav(!subnav);

  return (
    <>
      {/* Enlace principal del ítem */}
      <div
        onClick={item.subNav && showSubnav}
        className={`sidebar-link ${collapsed ? 'collapsed' : ''}`}
        style={{ cursor: 'pointer' }}
      >
        <div>
          <item.icon size={24} />
          {!collapsed && <span>{item.text}</span>}
        </div>
        <div>
          {!collapsed && item.subNav && subnav
            ? item.iconOpened
            : !collapsed && item.subNav
            ? item.iconClosed
            : null}
        </div>
      </div>

      {/* Submenú */}
      {subnav &&
        !collapsed &&
        item.subNav.map((subItem, index) => (
          <Link
            to={subItem.path}
            key={index}
            className="sidebar-link submenu-item"
            style={{ paddingLeft: '20px' }}
          >
            <subItem.icon size={24} />
            <span>{subItem.text}</span>
          </Link>
        ))}
    </>
  );
};

export default SubMenu;