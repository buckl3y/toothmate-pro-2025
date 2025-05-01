
import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './Components/Dashboard/Dashboard';
import DisplayWholeMouth from './Components/Chart/DisplayWholeMouth';

function App() {


  return (
    <Router>

      <Routes>
        <Route path="/" element={<DisplayWholeMouth />} />
      </Routes>

    </Router>
  )
}

export default App
