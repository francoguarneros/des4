import React from 'react';
import { Balance } from './components/Views/Balance';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Aquí es donde se muestra el componente que conectamos a Supabase */}
      <Balance />
    </div>
  );
}

export default App;
