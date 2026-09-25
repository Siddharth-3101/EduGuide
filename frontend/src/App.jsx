import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CareerProvider } from './context/CareerContext';
import { AppRoutes } from './routes/AppRoutes';

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CareerProvider>
          <AppRoutes />
        </CareerProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
