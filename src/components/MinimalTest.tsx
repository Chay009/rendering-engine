import React from 'react';

export interface MinimalTestProps {
  text?: string;
}

export const MinimalTest: React.FC<MinimalTestProps> = ({ 
  text = 'Minimal Test' 
}) => {
  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontSize: '48px',
      color: 'white',
      backgroundColor: 'blue',
    }}>
      {text}
    </div>
  );
};