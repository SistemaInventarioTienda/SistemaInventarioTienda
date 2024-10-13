import React from 'react';
import { Bell, Settings } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="navbar bg-card-custom" style={{ height: '60px' }}>
      <div className="container-fluid d-flex justify-content-end align-items-center">
        <span className="text-primary-custom  me-3">Nombre de Usuario</span>
        <button
          className="btn btn-primary me-3"
          style={{ backgroundColor: '#05004E', borderColor: '#05004E', borderRadius: '16px' }}>
          <Bell size={24} color="#FFFFFF" />
        </button>
        <button
          className="btn btn-primary me-3"
          style={{ backgroundColor: '#05004E', borderColor: '#05004E', borderRadius: '16px' }}>
          <Settings size={24} color="#FFFFFF" />
        </button>
      </div>
    </nav>
  );
}

export default Navbar;