import React from 'react';
import { Role } from '../types';

const SparkleIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path
      fillRule="evenodd"
      d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.84 2.84l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.84 2.84l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.84-2.84l-2.846-.813a.75.75 0 010-1.442l2.846-.813A3.75 3.75 0 007.426 8.08l.813-2.846A.75.75 0 019 4.5zM15.991 15.018a.75.75 0 01.583.899l-1.04 4.093a.75.75 0 01-1.442 0l-1.04-4.093a.75.75 0 01.583-.899l4.093-1.04a.75.75 0 01.899.583zM18 1.5a.75.75 0 01.728.568l.258 1.036a.75.75 0 01-.568.914l-1.036.258a.75.75 0 01-.914-.568L15.43 2.68a.75.75 0 01.568-.914l1.036-.258A.75.75 0 0118 1.5z"
      clipRule="evenodd"
    />
  </svg>
);

interface HeaderProps {
    role: Role;
    onRoleChange: (role: Role) => void;
}

export const Header: React.FC<HeaderProps> = ({ role, onRoleChange }) => {
    
  const getRoleName = (role: Role) => {
      switch(role) {
          case 'STUDENT': return 'Student';
          case 'COLLEGE': return 'College Admin';
          case 'ADMIN': return 'Platform Admin';
      }
  }

  const getUserDetails = (role: Role) => {
    switch(role) {
        case 'STUDENT': return { name: 'Alex Chen', avatar: 'https://i.pravatar.cc/150?u=alexchen' };
        case 'COLLEGE': return { name: 'Dr. Evelyn Reed', avatar: 'https://i.pravatar.cc/150?u=evelynreed' };
        case 'ADMIN': return { name: 'Admin User', avatar: 'https://i.pravatar.cc/150?u=admin' };
    }
  }

  const user = getUserDetails(role);

  return (
    <header className="bg-card/80 backdrop-blur-lg shadow-sm sticky top-0 z-40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center space-x-3">
            <SparkleIcon className="h-8 w-8 text-primary" />
            <span className="text-2xl font-extrabold text-text-primary tracking-tight">
              Event<span className="text-primary">Hub</span>
            </span>
          </div>
          <div className="flex items-center space-x-4">
             <div className="relative">
                <select 
                    value={role}
                    onChange={(e) => onRoleChange(e.target.value as Role)}
                    className="appearance-none bg-white border border-gray-300 rounded-md py-2 pl-3 pr-8 text-sm font-medium text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                >
                    <option value="STUDENT">Student</option>
                    <option value="COLLEGE">College</option>
                    <option value="ADMIN">Admin</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
            </div>
            <span className="hidden sm:block text-text-secondary font-medium">{user.name}</span>
            <img
              className="h-10 w-10 rounded-full object-cover ring-2 ring-offset-2 ring-primary"
              src={user.avatar}
              alt="User profile"
            />
          </div>
        </div>
      </div>
    </header>
  );
};