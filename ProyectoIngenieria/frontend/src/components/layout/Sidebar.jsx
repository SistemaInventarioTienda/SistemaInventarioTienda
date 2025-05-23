import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/authContext';
import { useAuthPermissions } from '../../context/authPermissions';
import {
    Home, Users, Tag, Box, Truck, UserCheck, ShoppingCart, FileText,
    BarChart2, Menu, PanelLeftClose, ChevronDown, ChevronUp, Banknote,
    CreditCard, ShoppingBag, ClipboardList, PlusCircle, PackagePlus, HelpCircleIcon
} from 'lucide-react';
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
        { key: 'home', path: '/', icon: Home, text: 'Inicio' },
        { key: 'user', path: '/user', icon: Users, text: 'Usuarios' },
        { key: 'product', path: '/product', icon: Box, text: 'Productos' },
        { key: 'categories', path: '/category', icon: Tag, text: 'Categorías' },
        { key: 'suppliers', path: '/suppliers', icon: Truck, text: 'Proveedores' },
        { key: 'clients', path: '/clients', icon: UserCheck, text: 'Clientes' },
        {
            key: 'sales',
            text: 'Ventas',
            icon: ShoppingBag,
            iconOpened: <ChevronDown size={24} />,
            iconClosed: <ChevronUp size={24} />,
            subNav: [
                { path: 'sales/credit', icon: CreditCard, text: 'Credito' },
                { path: '/sales/history', icon: ClipboardList, text: 'Historial de ventas' },
                { path: '/sales/new', icon: PlusCircle, text: 'Nueva Venta' }
            ]
        },
        {
            key: 'shopping',
            text: 'Compras',
            icon: ShoppingCart,
            iconOpened: <ChevronDown size={24} />,
            iconClosed: <ChevronUp size={24} />,
            subNav: [

                { path: '/shopping/history', icon: ClipboardList, text: 'Historial de compras' },
                { path: '/shopping/new', icon: PackagePlus, text: 'Nueva Compra' }
            ]
        },
        { key: 'transaction', path: '/transaction', icon: FileText, text: 'Transacciones' },
        { key: 'reports', path: '/reports', icon: BarChart2, text: 'Reportes' },
        { key: 'cashClosing', path: '/cashClosing', icon: Banknote, text: 'Cierre de Caja' },
        { key: 'home', path: '/help-center', icon: HelpCircleIcon, text: 'Centro de Ayuda' },
    ];

    return (
        <div className={`sidebar ${collapsed ? 'collapsed' : ''}`} >
            <div className="sidebar-header">
                {!collapsed && <h2 className="sidebar-title">Sistema de Gestión de Inventario</h2>}
                <button key="btnmenu" className="toggle-btn" onClick={() => setCollapsed(!collapsed)}>
                    {collapsed ? <Menu size={24} /> : <PanelLeftClose size={24} />}
                </button>
            </div>
            <ul className="list-unstyled">
                {menuItems.map((item, index) =>
                    permissions[item.key] ? (
                        <li key={item.key + index} style={{ marginBottom: index < menuItems.length - 1 ? '20px' : '0' }}>
                            {item.subNav ? (
                                <SubMenu item={item} collapsed={collapsed} />
                            ) : (
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

