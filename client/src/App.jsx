
import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Welcome from './Components/Welcome';
import Login from './Components/Login/Login';

function App() {

  return (
    <Router>

      <Routes>
        <Route path='/' element={<Welcome />} />
        <Route path="/dashboard" element={<Login />} />
      </Routes>

    </Router>
  )
}

export default App
