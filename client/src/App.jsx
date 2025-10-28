
import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Welcome from './Components/Welcome';
import Login from './Components/Login/Login';
import Dashboard from './Components/Dashboard/Dashboard';
import ProtoEmbed from './Components/ProtoEmbed';

function App() {

  return (
    <Router>

      <Routes>
        <Route path='/' element={<Welcome />} />

        {/* Login page which switched to dashboard on successful login attempt. */}
        <Route path="/dashboard" element={<Login />} />

        {/* Bypass the login and load a patient immediately. Useful for Figma transition. */}
        <Route path='/direct/:nhi' element={<Dashboard />} />  

        {/* Renders the Figma Prototype */}
        <Route path='/prototype' element={<ProtoEmbed />} />
      </Routes>

    </Router>
  )
}

export default App
