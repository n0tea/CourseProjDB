import { Navigate, Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {

  return (
    <>
      {<ToastContainer position="bottom-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />}
      
      <Routes>
        <Route path='*' element={<Navigate to="/home" />} /> 
        <Route path='/' element={<Navigate to="/home" />} /> 
        <Route path='/home' element={<div><HomePage /></div>} />
        {/*<Route path='/info' element={<InfoPage />} />*/}
      </Routes>
    </>
  );
}

export default App
