import React, { useState, useEffect, useRef } from 'react';
import { Bell, UserRoundCogIcon } from 'lucide-react';
import { Button } from '../common';
import { useAuth } from "../../context/authContext";
import UserMenu from '../features/UserMenu';
import './styles/navbar.css';

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
    <nav className="navbar bg-card-custom navbar-custom">
      <div className="d-flex justify-content-end align-items-center w-100">
        <span className="text-primary-custom me-3">{user.username}</span>

        <Button className="btn icon-button me-3">
          <Bell size={20} className="navbar-icon" />
        </Button>

        <Button
          className="btn icon-button me-3"
          onClick={toggleUserMenu}
        >
          <UserRoundCogIcon size={20} className="navbar-icon" />
        </Button>

        <div ref={userMenuRef}>
          <UserMenu isOpen={isUserMenuOpen} />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;