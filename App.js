import React, { useState, useEffect } from 'react';
import SplashScreen from './screens/SplashScreen';
import InventoryScreen from './screens/InventoryScreen';

export default function App() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 3500);

    return () => clearTimeout(timer);
  }, []);

  return isLoaded ? <InventoryScreen /> : <SplashScreen />;
}