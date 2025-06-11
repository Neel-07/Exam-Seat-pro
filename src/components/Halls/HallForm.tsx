import React, { useState, useEffect } from 'react';
import { Hall, SeatLayout } from '../../types';
import { ArrowLeft, Save, Grid3X3, RotateCcw } from 'lucide-react';

interface HallFormProps {
  hall?: Hall | null;
  onClose: () => void;
  onSave: (hall: Hall) => void;
}

export const HallForm: React.FC<HallFormProps> = ({ hall, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    rows: 10,
    columns: 10,
  });
  const [layout, setLayout] = useState<SeatLayout[][]>([]);

  useEffect(() => {
    if (hall) {
      setFormData({
        name: hall.name,
        rows: hall.rows,
        columns: hall.columns,
      });
      setLayout(hall.layout);
    } else {
      generateLayout(formData.rows, formData.columns);
    }
  }, [hall]);

  const generateLayout = (rows: number, columns: number) => {
    const newLayout: SeatLayout[][] = [];
    for (let row = 0; row < rows; row++) {
      newLayout[row] = [];
      for (let col = 0; col < columns; col++) {
        newLayout[row][col] = {
          id: `seat-${row}-${col}`,
          row,
          column: col,
          isAvailable: true,
          label: `${String.fromCharCode(65 + row)}${col + 1}`,
        };
      }
    }
    setLayout(newLayout);
  };

  const handleDimensionsChange = (field: 'rows' | 'columns', value: number) => {
    const newFormData = { ...formData, [field]: value };
    setFormData(newFormData);
    generateLayout(newFormData.rows, newFormData.columns);
  };

  const toggleSeat = (row: number, col: number) => {
    const newLayout = layout.map((layoutRow, rowIndex) =>
      layoutRow.map((seat, colIndex) =>
        rowIndex === row && colIndex === col
          ? { ...seat, isAvailable: !seat.isAvailable }
          : seat
      )
    );
    setLayout(newLayout);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const capacity = layout.flat().filter(seat => seat.isAvailable).length;
    
    const hallData: Hall = {
      id: hall?.id || Date.now().toString(),
      name: formData.name,
      rows: formData.rows,
      columns: formData.columns,
      capacity,
      layout,
      createdAt: hall?.createdAt || new Date().toISOString(),
    };

    onSave(hallData);
  };

  const resetLayout = () => {
    generateLayout(formData.rows, formData.columns);
  };

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
          <h1 className="text-3xl font-bold text-gray-900">
            {hall ? 'Edit Hall' : 'Create New Hall'}
          </h1>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={resetLayout}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Reset Layout</span>
          </button>
          <button
            onClick={handleSubmit}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Save className="h-4 w-4" />
            <span>Save Hall</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Hall Settings</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Hall Name
              </label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter hall name"
                required
              />
            </div>

            <div>
              <label htmlFor="rows" className="block text-sm font-medium text-gray-700 mb-1">
                Number of Rows
              </label>
              <input
                id="rows"
                type="number"
                min="1"
                max="30"
                value={formData.rows}
                onChange={(e) => handleDimensionsChange('rows', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="columns" className="block text-sm font-medium text-gray-700 mb-1">
                Number of Columns
              </label>
              <input
                id="columns"
                type="number"
                min="1"
                max="30"
                value={formData.columns}
                onChange={(e) => handleDimensionsChange('columns', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Total Seats:</span>
                <span className="font-medium">{formData.rows * formData.columns}</span>
              </div>
              <div className="flex items-center justify-between text-sm mt-2">
                <span className="text-gray-600">Available Seats:</span>
                <span className="font-medium text-green-600">
                  {layout.flat().filter(seat => seat.isAvailable).length}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm mt-2">
                <span className="text-gray-600">Blocked Seats:</span>
                <span className="font-medium text-red-600">
                  {layout.flat().filter(seat => !seat.isAvailable).length}
                </span>
              </div>
            </div>
          </form>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Grid3X3 className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">Instructions</span>
            </div>
            <ul className="text-xs text-blue-800 space-y-1">
              <li>• Click on seats to toggle availability</li>
              <li>• Green seats are available for assignment</li>
              <li>• Red seats are blocked/unavailable</li>
              <li>• Use reset to restore all seats</li>
            </ul>
          </div>
        </div>

        {/* Layout Preview */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Hall Layout</h2>
          <div className="overflow-auto">
            <div 
              className="grid gap-1 mx-auto"
              style={{ 
                gridTemplateColumns: `repeat(${formData.columns}, minmax(0, 1fr))`,
                maxWidth: `${Math.min(formData.columns * 40 + (formData.columns - 1) * 4, 800)}px`
              }}
            >
              {layout.map((row, rowIndex) =>
                row.map((seat, colIndex) => (
                  <button
                    key={seat.id}
                    onClick={() => toggleSeat(rowIndex, colIndex)}
                    className={`
                      w-8 h-8 text-xs font-medium rounded border-2 transition-all hover:scale-110
                      ${seat.isAvailable
                        ? 'bg-green-100 text-green-800 border-green-300 hover:bg-green-200'
                        : 'bg-red-100 text-red-800 border-red-300 hover:bg-red-200'
                      }
                    `}
                    title={`${seat.label} - ${seat.isAvailable ? 'Available' : 'Blocked'}`}
                  >
                    {seat.label}
                  </button>
                ))
              )}
            </div>
          </div>
          
          <div className="mt-4 flex items-center justify-center space-x-6 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-100 border-2 border-green-300 rounded"></div>
              <span className="text-gray-600">Available</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-red-100 border-2 border-red-300 rounded"></div>
              <span className="text-gray-600">Blocked</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};