import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/authContext';
import { Home, Users, Tag, Box, Truck, UserCheck, ShoppingCart, FileText, BarChart2, Menu, PanelLeftClose } from 'lucide-react';
import './styles/sidebar.css';

const Sidebar = () => {
    const { isAuthenticated } = useAuth();
    const location = useLocation();
    const [collapsed, setCollapsed] = useState(false);

    if (!isAuthenticated) {
        return null;
    }

    const menuItems = [
        { path: '/', icon: Home, text: 'Inicio' },
        { path: '/user', icon: Users, text: 'Usuarios' },
        { path: '/product', icon: Box, text: 'Productos' },
        { path: '/category', icon: Tag, text: 'Categorías' },
        { path: '/suppliers', icon: Truck, text: 'Proveedores' },
        { path: '/clients', icon: UserCheck, text: 'Clientes' },
        { path: '/sales', icon: ShoppingCart, text: 'Ventas' },
        { path: '/shopping', icon: FileText, text: 'Compras' },
        { path: '/reports', icon: BarChart2, text: 'Reportes' },
    ];

    return (
        <div className={`sidebar ${collapsed ? 'collapsed' : ''}`} >
            <div className="sidebar-header">
                {!collapsed && <h2 className="sidebar-title">Sistema de Gestión de Inventario</h2>}
                <button className="toggle-btn" onClick={() => setCollapsed(!collapsed)}>
                    {collapsed ? <Menu size={24} /> : <PanelLeftClose size={24} />}
                </button>
            </div>
            <ul className="list-unstyled">
                {menuItems.map((item, index) => (
                    <li key={item.path} style={{ marginBottom: index < menuItems.length - 1 ? '20px' : '0' }}>
                        <Link
                            to={item.path}
                            className={`sidebar-link ${location.pathname === item.path ? 'active' : ''}`}
                        >
                            <item.icon size={24} />
                            {!collapsed && <span>{item.text}</span>}
                        </Link>
                    </li>
                ))}
            </ul>
        </div >
    );
}

export default Sidebar;
