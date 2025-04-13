import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import {motion} from "framer-motion"

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
<BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>

    <React.StrictMode>
      <motion.div
        initial={{opacity : 0}}
        animate={{opacity : 1}}
        exit={{opacity : 0}}
        transition={{duration : .5}}
      >
        <App />
      </motion.div>
    </React.StrictMode>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
