import React, { useState, useEffect } from 'react';
import SplashScreen from './screens/SplashScreen';
import InventoryScreen from './screens/InventoryScreen';

export default function App() {
  const [screen, setScreen] = useState('splash');

  useEffect(() => {
    const timer = setTimeout(() => {
      setScreen('select');
    }, 3500);

    return () => clearTimeout(timer);
  }, []);

  if (screen === 'splash') {
    return <SplashScreen />;
  }

  if (screen === 'select') {
    return (
      <UserTypeSelectionScreen
        onSelect={(type) => {
          console.log('Tipo seleccionado:', type);
          setScreen('inventory');
        }}
      />
    );
  }

  if (screen === 'inventory') {
    return <InventoryScreen />;
  }

  return null;
}