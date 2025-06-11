import React, { useState } from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { Hall } from '../../types';
import { Building, Plus, Edit, Trash2, Users, Grid3X3 } from 'lucide-react';
import { HallForm } from './HallForm';
import { HallViewer } from './HallViewer';

export const HallList: React.FC = () => {
  const [halls, setHalls] = useLocalStorage<Hall[]>('halls', []);
  const [showForm, setShowForm] = useState(false);
  const [editingHall, setEditingHall] = useState<Hall | null>(null);
  const [viewingHall, setViewingHall] = useState<Hall | null>(null);

  const handleDelete = (hallId: string) => {
    if (confirm('Are you sure you want to delete this hall?')) {
      setHalls(halls.filter(hall => hall.id !== hallId));
    }
  };

  const handleEdit = (hall: Hall) => {
    setEditingHall(hall);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingHall(null);
  };

  if (showForm) {
    return (
      <HallForm
        hall={editingHall}
        onClose={handleCloseForm}
        onSave={(hall) => {
          if (editingHall) {
            setHalls(halls.map(h => h.id === hall.id ? hall : h));
          } else {
            setHalls([...halls, hall]);
          }
          handleCloseForm();
        }}
      />
    );
  }

  if (viewingHall) {
    return (
      <HallViewer
        hall={viewingHall}
        onClose={() => setViewingHall(null)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Halls Management</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Add Hall</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {halls.map((hall) => (
          <div key={hall.id} className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Building className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{hall.name}</h3>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setViewingHall(hall)}
                  className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                >
                  <Grid3X3 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleEdit(hall)}
                  className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(hall.id)}
                  className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Dimensions:</span>
                <span className="font-medium">{hall.rows} × {hall.columns}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Capacity:</span>
                <div className="flex items-center space-x-1">
                  <Users className="h-4 w-4 text-gray-400" />
                  <span className="font-medium">{hall.capacity}</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Created:</span>
                <span className="font-medium">
                  {new Date(hall.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="mt-4 flex space-x-2">
              <button
                onClick={() => setViewingHall(hall)}
                className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors text-sm"
              >
                View Layout
              </button>
              <button
                onClick={() => handleEdit(hall)}
                className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm"
              >
                Edit Hall
              </button>
            </div>
          </div>
        ))}
      </div>

      {halls.length === 0 && (
        <div className="text-center py-12">
          <Building className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No halls found</h3>
          <p className="text-gray-600 mb-6">Create your first examination hall to get started.</p>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Create Hall
          </button>
        </div>
      )}
    </div>
  );
};