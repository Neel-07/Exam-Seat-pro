import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Home, Building, Calendar, Users, Search } from 'lucide-react';

export const Navigation: React.FC = () => {
  const { user } = useAuth();

  const adminLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: Home },
    { to: '/halls', label: 'Halls', icon: Building },
    { to: '/exams', label: 'Exams', icon: Calendar },
    { to: '/students', label: 'Students', icon: Users },
  ];

  const studentLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: Home },
    { to: '/my-seats', label: 'My Seats', icon: Search },
  ];

  const links = user?.role === 'admin' ? adminLinks : studentLinks;

  return (
    <nav className="bg-gray-50 border-r border-gray-200 w-64 min-h-screen">
      <div className="p-4">
        <ul className="space-y-2">
          {links.map(({ to, label, icon: Icon }) => (
            <li key={to}>
              <NavLink
                to={to}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-100 text-blue-700 border border-blue-200'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`
                }
              >
                <Icon className="h-5 w-5" />
                <span>{label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};