import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomeScreen from './components/HomeScreen';
import CharacterSheetScreen from './components/CharacterSheetScreen';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/character/:id?" element={<CharacterSheetScreen />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;