import React from 'react';
import { Hall } from '../../types';
import { ArrowLeft, Building, Grid3X3, Users } from 'lucide-react';

interface HallViewerProps {
  hall: Hall;
  onClose: () => void;
}

export const HallViewer: React.FC<HallViewerProps> = ({ hall, onClose }) => {
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
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Building className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{hall.name}</h1>
              <p className="text-gray-600">Hall Layout View</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Hall Info */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Hall Information</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Dimensions:</span>
              <span className="font-medium">{hall.rows} × {hall.columns}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Total Seats:</span>
              <span className="font-medium">{hall.rows * hall.columns}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Available:</span>
              <span className="font-medium text-green-600">{hall.capacity}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Blocked:</span>
              <span className="font-medium text-red-600">
                {hall.rows * hall.columns - hall.capacity}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Created:</span>
              <span className="font-medium text-sm">
                {new Date(hall.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Grid3X3 className="h-4 w-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-900">Legend</span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-100 border border-green-300 rounded"></div>
                <span className="text-gray-600">Available Seat</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-100 border border-red-300 rounded"></div>
                <span className="text-gray-600">Blocked Seat</span>
              </div>
            </div>
          </div>
        </div>

        {/* Hall Layout */}
        <div className="lg:col-span-3 bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Seating Layout</h2>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Users className="h-4 w-4" />
              <span>{hall.capacity} seats available</span>
            </div>
          </div>

          <div className="overflow-auto">
            <div 
              className="grid gap-1 mx-auto"
              style={{ 
                gridTemplateColumns: `repeat(${hall.columns}, minmax(0, 1fr))`,
                maxWidth: `${Math.min(hall.columns * 40 + (hall.columns - 1) * 4, 800)}px`
              }}
            >
              {hall.layout.map((row, rowIndex) =>
                row.map((seat, colIndex) => (
                  <div
                    key={seat.id}
                    className={`
                      w-8 h-8 text-xs font-medium rounded border-2 flex items-center justify-center
                      ${seat.isAvailable
                        ? 'bg-green-100 text-green-800 border-green-300'
                        : 'bg-red-100 text-red-800 border-red-300'
                      }
                    `}
                    title={`${seat.label} - ${seat.isAvailable ? 'Available' : 'Blocked'}`}
                  >
                    {seat.label}
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-6 text-center">
            <div className="inline-block bg-gray-100 px-4 py-2 rounded-lg">
              <span className="text-sm font-medium text-gray-900">Front of Hall / Exam Invigilator</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};