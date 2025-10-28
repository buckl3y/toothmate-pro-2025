
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
        <Route path="/dashboard" element={<Login />} />
        <Route path='/direct/:nhi' element={<Dashboard />} />
        <Route path='/prototype' element={<ProtoEmbed />} />
      </Routes>

    </Router>
  )
}

export default App
