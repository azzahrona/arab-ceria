import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import LearnPage from './pages/LearnPage';
import QuizPage from './pages/QuizPage';
import GamesPage from './pages/GamesPage';
import ProgressPage from './pages/ProgressPage';
import TeacherPage from './pages/TeacherPage';
import './styles.css';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/masuk" element={<AuthPage />} />
            <Route path="/daftar" element={<AuthPage initialMode="register" />} />
            <Route path="/belajar" element={<ProtectedRoute><LearnPage /></ProtectedRoute>} />
            <Route path="/kuis" element={<ProtectedRoute><QuizPage /></ProtectedRoute>} />
            <Route path="/permainan" element={<ProtectedRoute><GamesPage /></ProtectedRoute>} />
            <Route path="/progres" element={<ProtectedRoute><ProgressPage /></ProtectedRoute>} />
            <Route path="/guru" element={<ProtectedRoute role="teacher"><TeacherPage /></ProtectedRoute>} />
            <Route path="*" element={<HomePage />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </AuthProvider>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode><App /></React.StrictMode>
);
