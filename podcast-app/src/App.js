import React from 'react';
import './App.css';
import PodcastList from './Components/PodcastList';
import PodcastPlayer from './Components/PodcastPlayer';


function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1 className='header-text'>Podcast App</h1>
      </header>
      
      <PodcastList />
      <PodcastPlayer /> 
    </div>
  );
}

export default App;