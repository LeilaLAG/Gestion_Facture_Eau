import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Route, Routes } from 'react-router-dom';
import SignUp from './components/SignUp';
import LogIn from './components/LogIn';
import ProtectedRoute from './Auth/ProtectedRoute';
import Clients from './components/Clients';


function App() {
  return (
    <div className="App">
        <Routes>
          <Route path='/sign-up' element={<SignUp/>} />
          <Route path='/log-in' element={<LogIn/>} />

          <Route path='/clients' element={
            <ProtectedRoute>
              <Clients/>
            </ProtectedRoute>
          } />
        </Routes>
      </div>
  );
}

export default App;
