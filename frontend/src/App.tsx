import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from './components/Header';
import Home from './pages/Home';
import Admin from './pages/Admin';
import EntropyScan from './pages/EntropyScan';
import Docs from './pages/Docs';
import Examples from './pages/Examples';
import './App.css';

function App() {

  return (
    <Router>
      <div className="min-h-screen bg-white dark:bg-black transition-colors">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/scan" element={<EntropyScan />} />
            <Route path="/docs" element={<Docs />} />
            <Route path="/examples" element={<Examples />} />
          </Routes>
        </main>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
      </div>
    </Router>
  );
}

export default App;

