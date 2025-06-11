import React from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { Hall, Exam, User, SeatAssignment } from '../../types';
import { Building, Calendar, Users, MapPin, TrendingUp, Clock } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [halls] = useLocalStorage<Hall[]>('halls', []);
  const [exams] = useLocalStorage<Exam[]>('exams', []);
  const [users] = useLocalStorage<User[]>('users', []);
  const [assignments] = useLocalStorage<SeatAssignment[]>('seatAssignments', []);

  const students = users.filter(user => user.role === 'student');
  const upcomingExams = exams.filter(exam => new Date(exam.date) > new Date());
  const ongoingExams = exams.filter(exam => exam.status === 'ongoing');

  const stats = [
    {
      label: 'Total Halls',
      value: halls.length,
      icon: Building,
      color: 'bg-blue-500',
      trend: '+12%',
    },
    {
      label: 'Total Students',
      value: students.length,
      icon: Users,
      color: 'bg-green-500',
      trend: '+8%',
    },
    {
      label: 'Upcoming Exams',
      value: upcomingExams.length,
      icon: Calendar,
      color: 'bg-purple-500',
      trend: '+15%',
    },
    {
      label: 'Seat Assignments',
      value: assignments.length,
      icon: MapPin,
      color: 'bg-orange-500',
      trend: '+25%',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Clock className="h-4 w-4" />
          <span>{new Date().toLocaleDateString()}</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-600 ml-1">{stat.trend}</span>
                </div>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Exams</h2>
          <div className="space-y-3">
            {exams.slice(-5).reverse().map((exam) => (
              <div key={exam.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{exam.name}</p>
                  <p className="text-sm text-gray-600">{exam.subject}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {new Date(exam.date).toLocaleDateString()}
                  </p>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    exam.status === 'completed' ? 'bg-green-100 text-green-800' :
                    exam.status === 'ongoing' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {exam.status}
                  </span>
                </div>
              </div>
            ))}
            {exams.length === 0 && (
              <p className="text-gray-500 text-center py-4">No exams found</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Hall Utilization</h2>
          <div className="space-y-3">
            {halls.map((hall) => {
              const hallAssignments = assignments.filter(a => a.hallId === hall.id);
              const utilizationRate = hall.capacity > 0 ? (hallAssignments.length / hall.capacity) * 100 : 0;
              
              return (
                <div key={hall.id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium text-gray-900">{hall.name}</p>
                    <p className="text-sm text-gray-600">
                      {hallAssignments.length}/{hall.capacity}
                    </p>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${utilizationRate}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {utilizationRate.toFixed(1)}% utilized
                  </p>
                </div>
              );
            })}
            {halls.length === 0 && (
              <p className="text-gray-500 text-center py-4">No halls found</p>
            )}
          </div>
        </div>
      </div>

      {/* Ongoing Exams */}
      {ongoingExams.length > 0 && (
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl shadow-lg p-6 border border-yellow-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse mr-2"></div>
            Ongoing Exams
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ongoingExams.map((exam) => {
              const hall = halls.find(h => h.id === exam.hallId);
              return (
                <div key={exam.id} className="bg-white rounded-lg p-4 shadow-sm">
                  <h3 className="font-semibold text-gray-900">{exam.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{exam.subject}</p>
                  <p className="text-sm text-gray-600">Hall: {hall?.name || 'Unknown'}</p>
                  <p className="text-sm text-gray-600">Duration: {exam.duration} minutes</p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};