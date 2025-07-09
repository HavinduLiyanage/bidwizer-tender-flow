import React from 'react';

const JoinTeam: React.FC = () => {
  const params = new URLSearchParams(window.location.search);
  const email = params.get('email');
  const token = params.get('token');

  return (
    <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <h1>Welcome to BidWizer Team!</h1>
      {email && (
        <p style={{ fontSize: '1.1rem' }}>You are joining as: <b>{email}</b></p>
      )}
      <p style={{ color: '#64748b', marginTop: 24 }}>This page will soon let you create your account and join the team.<br/>For now, you have reached the right place!</p>
    </div>
  );
};

export default JoinTeam; 