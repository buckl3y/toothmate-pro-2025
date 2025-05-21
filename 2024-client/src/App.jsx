
import './App.css'
import Dashboard from './Components/Dashboard/Dashboard';
import {Route, createBrowserRouter, createRoutesFromElements, RouterProvider } from 'react-router-dom';

const router = createBrowserRouter(
  createRoutesFromElements(
    // <Route path='/' element={<MainLayout />} />
    // Update this route with a layout element if we end up using layouts
    // e.g. consistent NavBar, Footer etc.
  <Route path='/' >
    {/* Place ROUTES to PAGES here e.g. 
        <Route path='/patients' element={<PatientsPage/>}/> something like that...
        For now, the index is the Dashboard page, and the 'views'
        are handled in Dashboard (isAdminView etc), this is probably going to have to be refactored, but for now it's ok.
    */}
    <Route index element={ <Dashboard />} />
  </Route>
  )
);

function App() {
  // the RouterProvider manages all routes defined in the router variable
  // we pass the router variable to RouterProvider here.
  return <RouterProvider router={router}/>
}

export default App
