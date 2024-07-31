import './App.css'
import HomePage from './components/HomePage'
import LoginPage from './components/LoginPage'
import { Routes, Route, Navigate } from 'react-router-dom';

function App() {
  return (
    <>
      <Routes>
      <Route path="/" element={<Navigate to="/LoginPage" />} />
        <Route path="/LoginPage" element={<LoginPage />} />
        <Route path="/HomePage" element={<HomePage />} />
      </Routes>
    </>
  )
}

export default App
