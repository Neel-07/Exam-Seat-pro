import React from 'react';
import { Exam, Hall, SeatAssignment } from '../../types';
import { ArrowLeft, Download, Printer } from 'lucide-react';

interface SeatViewerProps {
  exam: Exam;
  hall: Hall;
  assignments: SeatAssignment[];
  onClose: () => void;
}

export const SeatViewer: React.FC<SeatViewerProps> = ({ exam, hall, assignments, onClose }) => {
  const getSeatAssignment = (row: number, column: number): SeatAssignment | undefined => {
    return assignments.find(a => a.row === row && a.column === column);
  };

  const printLayout = () => {
    window.print();
  };

  const exportLayout = () => {
    const csvContent = [
      'Seat Position,Student Name,Roll Number,Row,Column',
      ...assignments.map(a => 
        `${String.fromCharCode(65 + a.row)}${a.column + 1},${a.studentName},${a.rollNumber},${a.row + 1},${a.column + 1}`
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${exam.name}-seating-layout.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between print:hidden">
        <div className="flex items-center space-x-4">
          <button
            onClick={onClose}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Seating Layout</h1>
            <p className="text-gray-600">{exam.name} - {hall.name}</p>
          </div>
        </div>
        
        <div className="flex space-x-3">
          <button
            onClick={exportLayout}
            className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
          <button
            onClick={printLayout}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Printer className="h-4 w-4" />
            <span>Print</span>
          </button>
        </div>
      </div>

      {/* Print Header */}
      <div className="hidden print:block text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{exam.name}</h1>
        <p className="text-lg text-gray-700 mb-1">{exam.subject}</p>
        <p className="text-gray-600">
          {new Date(exam.date).toLocaleDateString()} at {exam.time} | {hall.name}
        </p>
        <p className="text-gray-600">Duration: {exam.duration} minutes</p>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 print:shadow-none print:border-none">
        <div className="mb-6 print:mb-4">
          <div className="text-center">
            <div className="inline-block bg-gray-100 px-6 py-2 rounded-lg print:bg-gray-200">
              <span className="text-lg font-semibold text-gray-900">Front of Hall / Invigilator</span>
            </div>
          </div>
        </div>

        <div className="overflow-auto">
          <div 
            className="grid gap-2 mx-auto print:gap-1"
            style={{ 
              gridTemplateColumns: `repeat(${hall.columns}, minmax(0, 1fr))`,
              maxWidth: `${Math.min(hall.columns * 60 + (hall.columns - 1) * 8, 1000)}px`
            }}
          >
            {hall.layout.map((row, rowIndex) =>
              row.map((seat, colIndex) => {
                const assignment = getSeatAssignment(rowIndex, colIndex);
                return (
                  <div
                    key={seat.id}
                    className={`
                      w-14 h-14 text-xs font-medium rounded-lg border-2 flex flex-col items-center justify-center p-1 print:w-12 print:h-12 print:text-xs
                      ${!seat.isAvailable
                        ? 'bg-gray-200 text-gray-500 border-gray-300'
                        : assignment
                        ? 'bg-blue-100 text-blue-800 border-blue-300'
                        : 'bg-green-100 text-green-800 border-green-300'
                      }
                    `}
                    title={assignment ? `${assignment.studentName} (${assignment.rollNumber})` : seat.label}
                  >
                    <div className="font-bold">{seat.label}</div>
                    {assignment && (
                      <div className="text-center leading-tight">
                        <div className="truncate w-full" style={{ fontSize: '9px' }}>
                          {assignment.studentName.split(' ')[0]}
                        </div>
                        <div style={{ fontSize: '8px' }}>{assignment.rollNumber}</div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="mt-6 flex items-center justify-center space-x-8 text-sm print:mt-4">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-blue-100 border-2 border-blue-300 rounded"></div>
            <span className="text-gray-600">Assigned</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-100 border-2 border-green-300 rounded"></div>
            <span className="text-gray-600">Available</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-gray-200 border-2 border-gray-300 rounded"></div>
            <span className="text-gray-600">Blocked</span>
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-gray-600 print:mt-4">
          <p>Total Seats: {hall.capacity} | Assigned: {assignments.length} | Available: {hall.capacity - assignments.length}</p>
        </div>
      </div>

      {/* Assignment List for Print */}
      <div className="hidden print:block mt-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Student List</h2>
        <div className="grid grid-cols-2 gap-x-8 gap-y-1 text-sm">
          {assignments
            .sort((a, b) => a.studentName.localeCompare(b.studentName))
            .map((assignment, index) => (
              <div key={assignment.id} className="flex justify-between border-b border-gray-200 py-1">
                <span>{assignment.studentName}</span>
                <span>{assignment.rollNumber}</span>
                <span className="font-medium">
                  {String.fromCharCode(65 + assignment.row)}{assignment.column + 1}
                </span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};