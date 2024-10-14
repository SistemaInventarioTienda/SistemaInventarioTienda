import React from 'react';
import { Bell, Settings } from 'lucide-react';
import { Button } from './ui'; // Importa tu componente Button
import { useAuth } from "../context/authContext";

const Navbar = () => {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated) {
    return null;
  }
  return (
    <nav className="navbar bg-card-custom" style={{ height: '60px', padding: '0 30px' }}>
      <div className="d-flex justify-content-end align-items-center w-100">
        <span className="text-primary-custom me-3">{user.username}</span>
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
          }}
          icon={Settings}
          iconSize={20}
          iconColor="#FFFFFF"
        />
      </div>
    </nav>
  );
}

export default Navbar;
