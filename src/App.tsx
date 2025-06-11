import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AuthPage } from './components/Auth/AuthPage';
import { Header } from './components/Layout/Header';
import { Navigation } from './components/Layout/Navigation';
import { AdminDashboard } from './components/Dashboard/AdminDashboard';
import { StudentDashboard } from './components/Dashboard/StudentDashboard';
import { HallList } from './components/Halls/HallList';
import { ExamList } from './components/Exams/ExamList';
import { StudentList } from './components/Students/StudentList';
import { MySeatView } from './components/Students/MySeatView';

const AppContent: React.FC = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="flex">
        <Navigation />
        <main className="flex-1 p-6">
          <Routes>
            <Route 
              path="/dashboard" 
              element={
                user.role === 'admin' ? <AdminDashboard /> : <StudentDashboard />
              } 
            />
            {user.role === 'admin' && (
              <>
                <Route path="/halls" element={<HallList />} />
                <Route path="/exams" element={<ExamList />} />
                <Route path="/students" element={<StudentList />} />
              </>
            )}
            {user.role === 'student' && (
              <Route path="/my-seats" element={<MySeatView />} />
            )}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;