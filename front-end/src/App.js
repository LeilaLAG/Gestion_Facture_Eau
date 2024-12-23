import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Route, Routes } from 'react-router-dom';
import SignUp from './components/SignUp';
import LogIn from './components/LogIn';
import Home from './components/Home';
import ProtectedRoute from './Auth/ProtectedRoute';


function App() {
  return (
    <div className="App">
        <Routes>
          <Route path='/sign-up' element={<SignUp/>} />
          <Route path='/log-in' element={<LogIn/>} />
          <Route path='/Home' element={
            <ProtectedRoute>
              <Home/>
            </ProtectedRoute>
          } />
        </Routes>
      </div>
  );
}

export default App;
