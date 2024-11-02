import React, { useState, useEffect, useRef } from 'react';
import { Bell, UserRoundCogIcon } from 'lucide-react';
import { Button } from '../common';
import { useAuth } from "../../context/authContext";
import UserMenu from './UserMenu';

const Navbar = () => {
  const { isAuthenticated, user } = useAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  const toggleUserMenu = () => {
    setIsUserMenuOpen(prev => !prev);
  };

  const handleClickOutside = (event) => {
    if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
      setIsUserMenuOpen(false);
    }
  };

  useEffect(() => {
    if (isUserMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isUserMenuOpen]);

  if (!isAuthenticated) {
    return null;
  }

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
          <UserRoundCogIcon size={20} color="#FFFFFF" />
        </Button>

        {/* El menú de usuario */}
        <div ref={userMenuRef}>
          <UserMenu isOpen={isUserMenuOpen} />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;