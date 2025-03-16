import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/authContext';
import { useAuthPermissions } from '../../context/authPermissions';
import { Home, Users, Tag, Box, Truck, UserCheck, ShoppingCart, FileText, BarChart2, Menu, PanelLeftClose, ChevronDown, ChevronUp, ScanBarcode } from 'lucide-react';
import SubMenu from './SubMenu';

import './styles/sidebar.css';

const Sidebar = () => {
    const { isAuthenticated } = useAuth();
    const { permissions } = useAuthPermissions();
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
        // { path: '/sales', icon: ShoppingCart, text: 'Ventas' },
        { 
            text: 'Ventas', 
            icon: ShoppingCart, 
            iconOpened: <ChevronDown size={24}/>,
            iconClosed: <ChevronUp size={24}/>, 
            subNav: [
                { path: '/sales/history', icon: FileText, text: 'Historial de ventas'},
                { path: '/sales/new', icon: ScanBarcode, text: 'Nueva Venta'}
            ] 
        },
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
                {menuItems.map((item, index) =>
                    permissions[item.key] ? (
                        <li key={item.path} style={{ marginBottom: index < menuItems.length - 1 ? '20px' : '0' }}>
                            
                            {item.subNav ? (<SubMenu item={item} collapsed={collapsed}/>) : (
                            <Link
                            to={item.path}
                            className={`sidebar-link ${location.pathname === item.path ? 'active' : ''}`}
                        >
                            <item.icon size={24} />
                            {!collapsed && <span>{item.text}</span>}
                        </Link>
                        )}
                        </li>
                    ) : null
                )}
            </ul>
        </div >
    );
}

export default Sidebar;
