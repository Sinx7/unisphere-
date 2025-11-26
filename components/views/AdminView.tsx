import React, { useState } from 'react';
import { Event, College, Category } from '../../types';
import { Button } from '../Button';
import { PencilIcon } from '../icons/PencilIcon';
import { TrashIcon } from '../icons/TrashIcon';
import { PlusIcon } from '../icons/PlusIcon';
import { EventFormModal } from '../EventFormModal';

interface AdminViewProps {
  events: Event[];
  colleges: College[];
  categories: Category[];
  onAddEvent: (event: Event) => void;
  onUpdateEvent: (event: Event) => void;
  onDeleteEvent: (eventId: string) => void;
  onToggleCollegeApproval: (collegeId: string) => void;
}

export const AdminView: React.FC<AdminViewProps> = ({
  events,
  colleges,
  categories,
  onAddEvent,
  onUpdateEvent,
  onDeleteEvent,
  onToggleCollegeApproval
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [eventToEdit, setEventToEdit] = useState<Event | null>(null);

  const handleOpenModal = (event?: Event) => {
    setEventToEdit(event || null);
    setIsModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEventToEdit(null);
  };
  
  const handleSaveEvent = (event: Event) => {
    if (eventToEdit) {
      onUpdateEvent(event);
    } else {
      onAddEvent(event);
    }
  };
  
  const handleDeleteEvent = (eventId: string) => {
    if (window.confirm('Are you sure you want to delete this event? This action is permanent.')) {
      onDeleteEvent(eventId);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="space-y-12">
      {/* Manage Colleges Section */}
      <div>
        <h1 className="text-3xl font-bold text-text-primary mb-6">Admin Dashboard</h1>
        <h2 className="text-2xl font-semibold text-text-primary mb-4">Manage Colleges</h2>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">College Name</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Status</th>
                  <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {colleges.map((college) => (
                  <tr key={college.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-text-primary">{college.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          college.approved
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {college.approved ? 'Approved' : 'Pending Approval'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button
                        variant={college.approved ? 'outline' : 'secondary'}
                        onClick={() => onToggleCollegeApproval(college.id)}
                        className="py-1 px-3 text-xs"
                      >
                        {college.approved ? 'Revoke' : 'Approve'}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      {/* Manage Events Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-text-primary">Manage All Events</h2>
            <Button onClick={() => handleOpenModal()} variant="primary">
               <PlusIcon className="w-5 h-5 mr-2" />
               Add New Event
            </Button>
        </div>
         <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Event Name</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">College</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Date</th>
                    <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {events.map((event) => (
                    <tr key={event.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-text-primary">{event.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">{colleges.find(c => c.id === event.collegeId)?.name || 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">{formatDate(event.date)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                         <div className="flex items-center justify-end space-x-4">
                           <button onClick={() => handleOpenModal(event)} className="text-primary hover:text-primary-hover transition-colors">
                            <PencilIcon />
                           </button>
                           <button onClick={() => handleDeleteEvent(event.id)} className="text-red-600 hover:text-red-800 transition-colors">
                             <TrashIcon />
                           </button>
                         </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
        </div>
      </div>
      <EventFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveEvent}
        eventToEdit={eventToEdit}
        colleges={colleges}
        categories={categories}
      />
    </div>
  );
};