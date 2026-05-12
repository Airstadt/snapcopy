import React from 'react';

export default function SuccessPage() {
  return (
    <div style={{ padding: '50px', textAlign: 'center' }}>
      <h1>Payment Successful!</h1>
      <p>If you see this, the route is working.</p>
      <a href="/dashboard">Go to Dashboard</a>
    </div>
  );
}