import { useState } from 'react';
import Landing from './pages/Landing.jsx';
import Home from './pages/Home.jsx';
import './styles/main.css';

function App() {
  // construct state variables. initial variable + setInitial
const[page, setPage]  = useState("landing"); // default value

  return (
    <>
    {page === "landing" && (
      <Landing onEnter={() => setPage("home")}/>
    )}
    {page === "home" && <Home/>}
  </>
  );
}

export default App;