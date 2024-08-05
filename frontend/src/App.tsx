import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Controller from './components/Controller';
import Deaf from './components/Deaf';
import Mute from './components/Mute';
import MuteAudio from './components/MuteAudio';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Controller />} />
        <Route path='/deaf' element={<Deaf />} />
        <Route path='/mute' element={<Mute />} />
        <Route path='/mute-audio' element={<MuteAudio />} />
      </Routes>
    </Router>
  );
};

export default App;
