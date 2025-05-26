import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, ChevronUp } from 'lucide-react';

const SubMenu = ({ item, collapsed }) => {
    const [subnav, setSubnav] = useState(false);
    const location = useLocation();

    const showSubnav = () => setSubnav(!subnav);

    return (
        <>
            {/* Ítem principal del menú con toggle */}
            <div
                onClick={item.subNav && showSubnav}
                className={`sidebar-link submenu-header ${subnav ? 'open' : ''}`}
            >
                <div>
                    <item.icon size={24} />
                    {!collapsed && <span>{item.text}</span>}
                </div>
                {!collapsed && item.subNav && (
                    <ChevronDown
                        size={20}
                        className={`chevron-icon ${subnav ? 'chevron-rotated' : ''}`}
                    />
                )}
            </div>

            {/* Ítems del submenú con animación */}
            <div className={`submenu-container ${subnav ? 'open' : ''}`}>
                {item.subNav.map((subItem, index) => (
                    <Link
                        to={subItem.path}
                        key={index}
                        className={`sidebar-link submenu-item ${location.pathname === subItem.path ? 'active' : ''}`}
                    >
                        <subItem.icon size={20} />
                        <span>{subItem.text}</span>
                    </Link>
                ))}
            </div>
        </>
    );
};

export default SubMenu;
