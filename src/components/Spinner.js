import React from 'react';
import SpinnerImage from './Spinner1.gif'; // Ensure the path is correct

const Spinner = ({ message = "Loading more..." }) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '50vh', // Full viewport height for vertical centering
      textAlign: 'center',
    }}>
      <img src={SpinnerImage} alt="Loading..." style={{ width: '450px', height: '250px' }} />
      <p style={{
        fontSize: '20px',
        fontWeight: 'bold',
        color: '#5d5d5d',
        marginTop: '10px',
        animation: 'fadeIn 1s infinite', // Add animation for effect
      }}>
        {message}
      </p>
    </div>
  );
};

export default Spinner;
