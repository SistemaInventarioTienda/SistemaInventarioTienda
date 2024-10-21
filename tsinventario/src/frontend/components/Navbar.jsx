import React, { useState } from 'react';
import { Bell, User } from 'lucide-react';
import { Button } from './ui';
import { useAuth } from "../context/authContext";
import UserMenu from './ui/UserMenu';

const Navbar = () => {
  const { isAuthenticated, user } = useAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  if (!isAuthenticated) {
    return null;
  }

  const toggleUserMenu = () => {
    setIsUserMenuOpen(prev => !prev);
  };

  return (
    <nav className="navbar bg-card-custom" style={{ height: '60px', padding: '0 30px' }}>
      <div className="d-flex justify-content-end align-items-center w-100">
        <span className="text-primary-custom me-3">{user.username}</span>

        {/* Botón de campana */}
        <Button
          className="btn me-3 p-0"
          style={{
            backgroundColor: '#05004E',
            borderColor: '#05004E',
            borderRadius: '16px',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
          <Bell size={20} color="#FFFFFF" />
        </Button>

        {/* Botón de usuario */}
        <Button
          className="btn me-3 p-0"
          onClick={toggleUserMenu}
          style={{
            backgroundColor: '#05004E',
            borderColor: '#05004E',
            borderRadius: '16px',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
          <User size={20} color="#FFFFFF" />
        </Button>

        <UserMenu isOpen={isUserMenuOpen} />
      </div>
    </nav>
  );
}

export default Navbar;
