import React from 'react';
import { Card } from '../common';

const PageLayout = ({ children, title, description }) => {
  return (
    <div className="card border-custom">
      <Card className="card-content">
        <div className="card-body">
          <h1 
            className="card-title h2 mb-4" 
            style={{ 
              fontSize: '20px', 
              fontFamily: 'Poppins, sans-serif', 
              fontWeight: '600',
              color: 'var(--color-primary)' 
            }}
          >
            {title}
          </h1>
          <p 
            className="card-text mb-4" 
            style={{ 
              fontSize: '20px', 
              fontFamily: 'Poppins, sans-serif', 
              color: 'var(--color-primary)', 
              marginTop: '4px'
            }}
          >
            {description}
          </p>
          {children}
        </div>
      </Card>
    </div>
  );
};

export default PageLayout;
