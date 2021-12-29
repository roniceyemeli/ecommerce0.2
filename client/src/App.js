import React from 'react';
import {BrowserRouter as Router} from 'react-router-dom';
import Header from './components/headers/Header';
import Home from './components/mainPages/Home';
import {DataProvider} from './GlobalState';

function App() {
  return (
    <DataProvider>
      <Router>
        <div className="App">
          <Header/>
          <Home/>
        </div>
      </Router>
    </DataProvider>
  );
}
export default App;
