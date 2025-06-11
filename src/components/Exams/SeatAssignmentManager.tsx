import React, { useState } from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { Exam, User, Hall, SeatAssignment } from '../../types';
import { generateSeatAssignments } from '../../utils/seatAssignment';
import { ArrowLeft, Users, Shuffle, Save, Download, Eye } from 'lucide-react';
import { SeatViewer } from './SeatViewer';

interface SeatAssignmentManagerProps {
  exam: Exam;
  onClose: () => void;
}

export const SeatAssignmentManager: React.FC<SeatAssignmentManagerProps> = ({ exam, onClose }) => {
  const [users] = useLocalStorage<User[]>('users', []);
  const [halls] = useLocalStorage<Hall[]>('halls', []);
  const [assignments, setAssignments] = useLocalStorage<SeatAssignment[]>('seatAssignments', []);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [currentAssignments, setCurrentAssignments] = useState<SeatAssignment[]>([]);
  const [showViewer, setShowViewer] = useState(false);

  const students = users.filter(user => user.role === 'student');
  const hall = halls.find(h => h.id === exam.hallId);
  const existingAssignments = assignments.filter(a => a.examId === exam.id);

  React.useEffect(() => {
    if (existingAssignments.length > 0) {
      setCurrentAssignments(existingAssignments);
      setSelectedStudents(existingAssignments.map(a => a.studentId));
    }
  }, [existingAssignments.length]);

  const handleStudentToggle = (studentId: string) => {
    setSelectedStudents(prev => 
      prev.includes(studentId)
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleSelectAll = () => {
    if (selectedStudents.length === students.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(students.map(s => s.id));
    }
  };

  const generateAssignments = () => {
    if (!hall || selectedStudents.length === 0) return;

    const selectedStudentData = students.filter(s => selectedStudents.includes(s.id));
    
    if (selectedStudentData.length > hall.capacity) {
      alert(`Cannot assign ${selectedStudentData.length} students to ${hall.capacity} seats.`);
      return;
    }

    try {
      const newAssignments = generateSeatAssignments(exam.id, selectedStudentData, hall);
      setCurrentAssignments(newAssignments);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to generate assignments');
    }
  };

  const saveAssignments = () => {
    // Remove existing assignments for this exam
    const otherAssignments = assignments.filter(a => a.examId !== exam.id);
    // Add new assignments
    setAssignments([...otherAssignments, ...currentAssignments]);
    alert('Seat assignments saved successfully!');
  };

  const exportAssignments = () => {
    if (currentAssignments.length === 0) return;

    const csvContent = [
      'Student Name,Roll Number,Hall,Seat Position,Row,Column',
      ...currentAssignments.map(a => 
        `${a.studentName},${a.rollNumber},${hall?.name},${String.fromCharCode(65 + a.row)}${a.column + 1},${a.row + 1},${a.column + 1}`
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${exam.name}-seat-assignments.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (showViewer && currentAssignments.length > 0) {
    return (
      <SeatViewer
        exam={exam}
        hall={hall!}
        assignments={currentAssignments}
        onClose={() => setShowViewer(false)}
      />
    );
  }

  if (!hall) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Hall not found for this exam.</p>
        <button onClick={onClose} className="mt-4 text-blue-600 hover:underline">
          Go back
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onClose}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Seat Assignment</h1>
            <p className="text-gray-600">{exam.name} - {hall.name}</p>
          </div>
        </div>
        
        <div className="flex space-x-3">
          {currentAssignments.length > 0 && (
            <>
              <button
                onClick={() => setShowViewer(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Eye className="h-4 w-4" />
                <span>View Layout</span>
              </button>
              <button
                onClick={exportAssignments}
                className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Download className="h-4 w-4" />
                <span>Export</span>
              </button>
            </>
          )}
          <button
            onClick={generateAssignments}
            disabled={selectedStudents.length === 0}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <Shuffle className="h-4 w-4" />
            <span>Generate</span>
          </button>
          <button
            onClick={saveAssignments}
            disabled={currentAssignments.length === 0}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            <span>Save</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Student Selection */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Select Students</h2>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {selectedStudents.length} of {students.length} selected
              </span>
              <button
                onClick={handleSelectAll}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                {selectedStudents.length === students.length ? 'Deselect All' : 'Select All'}
              </button>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto space-y-2">
            {students.map((student) => (
              <div
                key={student.id}
                className={`flex items-center justify-between p-3 rounded-lg border-2 transition-colors cursor-pointer ${
                  selectedStudents.includes(student.id)
                    ? 'border-blue-300 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleStudentToggle(student.id)}
              >
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={selectedStudents.includes(student.id)}
                    onChange={() => handleStudentToggle(student.id)}
                    className="h-4 w-4 text-blue-600 rounded"
                  />
                  <div>
                    <p className="font-medium text-gray-900">{student.name}</p>
                    <p className="text-sm text-gray-600">Roll: {student.rollNumber}</p>
                  </div>
                </div>
                {currentAssignments.find(a => a.studentId === student.id) && (
                  <span className="text-sm text-green-600 font-medium">
                    Assigned
                  </span>
                )}
              </div>
            ))}
          </div>

          {students.length === 0 && (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No students found</p>
            </div>
          )}
        </div>

        {/* Assignment Info */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Assignment Info</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Hall Capacity:</span>
                <span className="font-medium">{hall.capacity}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Selected Students:</span>
                <span className="font-medium">{selectedStudents.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Available Seats:</span>
                <span className="font-medium text-green-600">
                  {hall.capacity - selectedStudents.length}
                </span>
              </div>
              {selectedStudents.length > hall.capacity && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-800 text-sm">
                    Too many students selected for available seats!
                  </p>
                </div>
              )}
            </div>
          </div>

          {currentAssignments.length > 0 && (
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Current Assignments</h2>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {currentAssignments.slice(0, 10).map((assignment) => (
                  <div key={assignment.id} className="flex justify-between items-center p-2 bg-gray-50 rounded text-sm">
                    <span className="font-medium">{assignment.studentName}</span>
                    <span className="text-blue-600">
                      {String.fromCharCode(65 + assignment.row)}{assignment.column + 1}
                    </span>
                  </div>
                ))}
                {currentAssignments.length > 10 && (
                  <p className="text-center text-gray-500 text-sm">
                    +{currentAssignments.length - 10} more assignments
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};