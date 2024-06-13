import React from 'react';
import './App.css';
import PodcastList from './Components/PodcastList';

//test-commit 3
function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1 className='header-text'>Podcast App</h1>
      </header>
      <PodcastList />
    </div>
  );
}

export default App;
