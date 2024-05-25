import React from 'react';

export default function Logout({handleLogout}) {
  return (
    <button onClick={handleLogout}>logout</button>
  );
};