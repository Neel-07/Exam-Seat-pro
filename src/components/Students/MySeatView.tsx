import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { Exam, SeatAssignment, Hall } from '../../types';
import { Search, MapPin, Calendar, Clock, AlertCircle } from 'lucide-react';

export const MySeatView: React.FC = () => {
  const { user } = useAuth();
  const [exams] = useLocalStorage<Exam[]>('exams', []);
  const [assignments] = useLocalStorage<SeatAssignment[]>('seatAssignments', []);
  const [halls] = useLocalStorage<Hall[]>('halls', []);
  const [searchTerm, setSearchTerm] = useState('');

  const myAssignments = assignments.filter(a => a.studentId === user?.id);
  const myExams = exams.filter(exam => 
    myAssignments.some(a => a.examId === exam.id)
  );

  const filteredExams = myExams.filter(exam =>
    exam.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exam.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getAssignmentForExam = (examId: string) => {
    return myAssignments.find(a => a.examId === examId);
  };

  const getHallForExam = (examId: string) => {
    const exam = myExams.find(e => e.id === examId);
    return halls.find(h => h.id === exam?.hallId);
  };

  const getExamStatus = (exam: Exam) => {
    const examDate = new Date(exam.date);
    const today = new Date();
    const diffTime = examDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return { text: 'Completed', color: 'bg-gray-100 text-gray-800' };
    if (diffDays === 0) return { text: 'Today', color: 'bg-red-100 text-red-800' };
    if (diffDays === 1) return { text: 'Tomorrow', color: 'bg-yellow-100 text-yellow-800' };
    if (diffDays <= 7) return { text: `${diffDays} days`, color: 'bg-orange-100 text-orange-800' };
    return { text: `${diffDays} days`, color: 'bg-green-100 text-green-800' };
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">My Seat Assignments</h1>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <MapPin className="h-4 w-4" />
          <span>{myAssignments.length} assigned seats</span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Search exams..."
          />
        </div>
      </div>

      {/* Exam Cards */}
      <div className="grid gap-6">
        {filteredExams.map((exam) => {
          const assignment = getAssignmentForExam(exam.id);
          const hall = getHallForExam(exam.id);
          const status = getExamStatus(exam);
          
          return (
            <div key={exam.id} className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">{exam.name}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${status.color}`}>
                      {status.text}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-3">{exam.subject}</p>
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(exam.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{exam.time} ({exam.duration} min)</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4" />
                      <span>{hall?.name || 'Hall not found'}</span>
                    </div>
                  </div>
                </div>

                {assignment && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 ml-6">
                    <div className="text-center">
                      <p className="text-sm font-medium text-blue-900 mb-1">Your Seat</p>
                      <p className="text-3xl font-bold text-blue-600">
                        {String.fromCharCode(65 + assignment.row)}{assignment.column + 1}
                      </p>
                      <p className="text-xs text-blue-700 mt-1">
                        Row {assignment.row + 1}, Column {assignment.column + 1}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {status.text === 'Today' && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="h-5 w-5 text-red-600" />
                    <div>
                      <p className="text-red-900 font-medium">Exam Today!</p>
                      <p className="text-red-700 text-sm">
                        Make sure to arrive 30 minutes before the exam starts.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {myExams.length === 0 && (
        <div className="text-center py-12">
          <MapPin className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No seat assignments</h3>
          <p className="text-gray-600">You don't have any exam seats assigned yet.</p>
        </div>
      )}

      {myExams.length > 0 && filteredExams.length === 0 && (
        <div className="text-center py-12">
          <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No matching exams</h3>
          <p className="text-gray-600">Try adjusting your search terms.</p>
        </div>
      )}
    </div>
  );
};