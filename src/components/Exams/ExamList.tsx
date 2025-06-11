import React, { useState } from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { Exam, Hall } from '../../types';
import { Calendar, Plus, Edit, Trash2, Clock, MapPin, Users } from 'lucide-react';
import { ExamForm } from './ExamForm';
import { SeatAssignmentManager } from './SeatAssignmentManager';

export const ExamList: React.FC = () => {
  const [exams, setExams] = useLocalStorage<Exam[]>('exams', []);
  const [halls] = useLocalStorage<Hall[]>('halls', []);
  const [showForm, setShowForm] = useState(false);
  const [editingExam, setEditingExam] = useState<Exam | null>(null);
  const [assigningSeats, setAssigningSeats] = useState<Exam | null>(null);

  const handleDelete = (examId: string) => {
    if (confirm('Are you sure you want to delete this exam?')) {
      setExams(exams.filter(exam => exam.id !== examId));
    }
  };

  const handleEdit = (exam: Exam) => {
    setEditingExam(exam);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingExam(null);
  };

  const getHallName = (hallId: string) => {
    const hall = halls.find(h => h.id === hallId);
    return hall?.name || 'Unknown Hall';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'ongoing':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (showForm) {
    return (
      <ExamForm
        exam={editingExam}
        onClose={handleCloseForm}
        onSave={(exam) => {
          if (editingExam) {
            setExams(exams.map(e => e.id === exam.id ? exam : e));
          } else {
            setExams([...exams, exam]);
          }
          handleCloseForm();
        }}
      />
    );
  }

  if (assigningSeats) {
    return (
      <SeatAssignmentManager
        exam={assigningSeats}
        onClose={() => setAssigningSeats(null)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Exams Management</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Schedule Exam</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {exams.map((exam) => (
          <div key={exam.id} className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Calendar className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{exam.name}</h3>
                  <p className="text-sm text-gray-600">{exam.subject}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(exam)}
                  className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(exam.id)}
                  className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Calendar className="h-4 w-4" />
                <span>{new Date(exam.date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Clock className="h-4 w-4" />
                <span>{exam.time} ({exam.duration} minutes)</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <MapPin className="h-4 w-4" />
                <span>{getHallName(exam.hallId)}</span>
              </div>
            </div>

            <div className="flex items-center justify-between mb-4">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(exam.status)}`}>
                {exam.status.charAt(0).toUpperCase() + exam.status.slice(1)}
              </span>
              <span className="text-xs text-gray-500">
                Created {new Date(exam.createdAt).toLocaleDateString()}
              </span>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => setAssigningSeats(exam)}
                className="flex-1 bg-green-600 text-white px-3 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors text-sm flex items-center justify-center space-x-1"
              >
                <Users className="h-4 w-4" />
                <span>Assign Seats</span>
              </button>
              <button
                onClick={() => handleEdit(exam)}
                className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors text-sm"
              >
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>

      {exams.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No exams scheduled</h3>
          <p className="text-gray-600 mb-6">Schedule your first exam to get started.</p>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Schedule Exam
          </button>
        </div>
      )}
    </div>
  );
};