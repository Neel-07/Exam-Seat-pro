import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { Exam, SeatAssignment, Hall } from '../../types';
import { Calendar, MapPin, Clock, BookOpen, AlertCircle } from 'lucide-react';

export const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const [exams] = useLocalStorage<Exam[]>('exams', []);
  const [assignments] = useLocalStorage<SeatAssignment[]>('seatAssignments', []);
  const [halls] = useLocalStorage<Hall[]>('halls', []);

  const myAssignments = assignments.filter(a => a.studentId === user?.id);
  const upcomingExams = exams.filter(exam => 
    new Date(exam.date) > new Date() && 
    myAssignments.some(a => a.examId === exam.id)
  );
  const todayExams = exams.filter(exam => {
    const examDate = new Date(exam.date);
    const today = new Date();
    return examDate.toDateString() === today.toDateString() &&
           myAssignments.some(a => a.examId === exam.id);
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name}</h1>
          <p className="text-gray-600 mt-1">Roll Number: {user?.rollNumber}</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Clock className="h-4 w-4" />
          <span>{new Date().toLocaleDateString()}</span>
        </div>
      </div>

      {/* Today's Exams Alert */}
      {todayExams.length > 0 && (
        <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-center space-x-3">
            <AlertCircle className="h-6 w-6 text-red-600" />
            <div>
              <h2 className="text-lg font-semibold text-red-900">Exams Today!</h2>
              <p className="text-red-700">You have {todayExams.length} exam(s) scheduled for today.</p>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            {todayExams.map((exam) => {
              const assignment = myAssignments.find(a => a.examId === exam.id);
              const hall = halls.find(h => h.id === exam.hallId);
              return (
                <div key={exam.id} className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-900">{exam.name}</h3>
                      <p className="text-sm text-gray-600">{exam.subject}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{exam.time}</p>
                      <p className="text-xs text-gray-600">{exam.duration} minutes</p>
                    </div>
                  </div>
                  {assignment && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <div className="flex items-center space-x-4 text-sm">
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <span>Hall: {hall?.name}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <span className="font-medium">Seat: {String.fromCharCode(65 + assignment.row)}{assignment.column + 1}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Exams</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{myAssignments.length}</p>
            </div>
            <div className="bg-blue-500 p-3 rounded-lg">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Upcoming Exams</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{upcomingExams.length}</p>
            </div>
            <div className="bg-green-500 p-3 rounded-lg">
              <Calendar className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Today's Exams</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{todayExams.length}</p>
            </div>
            <div className="bg-orange-500 p-3 rounded-lg">
              <AlertCircle className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Exams */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Upcoming Exams</h2>
        <div className="space-y-4">
          {upcomingExams.map((exam) => {
            const assignment = myAssignments.find(a => a.examId === exam.id);
            const hall = halls.find(h => h.id === exam.hallId);
            const daysUntil = Math.ceil((new Date(exam.date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
            
            return (
              <div key={exam.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{exam.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{exam.subject}</p>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(exam.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{exam.time}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-4 w-4" />
                        <span>{hall?.name}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      daysUntil <= 1 ? 'bg-red-100 text-red-800' :
                      daysUntil <= 7 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {daysUntil === 0 ? 'Today' : 
                       daysUntil === 1 ? 'Tomorrow' : 
                       `${daysUntil} days`}
                    </span>
                    {assignment && (
                      <p className="text-sm font-medium text-gray-900 mt-2">
                        Seat: {String.fromCharCode(65 + assignment.row)}{assignment.column + 1}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          {upcomingExams.length === 0 && (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No upcoming exams</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};