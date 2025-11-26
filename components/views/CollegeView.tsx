import React, { useState, useMemo } from 'react';
import { Event, College, Category } from '../../types';
import { Button } from '../Button';
import { PencilIcon } from '../icons/PencilIcon';
import { TrashIcon } from '../icons/TrashIcon';
import { PlusIcon } from '../icons/PlusIcon';
import { EventFormModal } from '../EventFormModal';

interface CollegeViewProps {
  collegeId: string;
  allEvents: Event[];
  allColleges: College[];
  allCategories: Category[];
  onAddEvent: (event: Event) => void;
  onUpdateEvent: (event: Event) => void;
  onDeleteEvent: (eventId: string) => void;
}

export const CollegeView: React.FC<CollegeViewProps> = ({
  collegeId,
  allEvents,
  allColleges,
  allCategories,
  onAddEvent,
  onUpdateEvent,
  onDeleteEvent
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [eventToEdit, setEventToEdit] = useState<Event | null>(null);

  const college = useMemo(() => allColleges.find(c => c.id === collegeId), [allColleges, collegeId]);
  const collegeEvents = useMemo(() => allEvents.filter(e => e.collegeId === collegeId), [allEvents, collegeId]);

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
  }
  
  const handleDelete = (eventId: string) => {
      if (window.confirm('Are you sure you want to delete this event?')) {
          onDeleteEvent(eventId);
      }
  }

  if (!college) {
    return <div className="text-center py-20"><p>College not found.</p></div>;
  }
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
           <h1 className="text-3xl font-bold text-text-primary">Manage Events</h1>
           <p className="text-text-secondary mt-1">for {college.name}</p>
        </div>
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
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Date</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Location</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Participants</th>
                <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {collegeEvents.map((event) => (
                <tr key={event.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-text-primary">{event.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">{formatDate(event.date)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">{event.location}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">{event.participants.length}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-4">
                      <button onClick={() => handleOpenModal(event)} className="text-primary hover:text-primary-hover transition-colors">
                        <PencilIcon />
                      </button>
                      <button onClick={() => handleDelete(event.id)} className="text-red-600 hover:text-red-800 transition-colors">
                        <TrashIcon />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
           {collegeEvents.length === 0 && (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium text-text-primary">No events found</h3>
                <p className="text-sm text-text-secondary mt-1">Click "Add New Event" to get started.</p>
              </div>
           )}
        </div>
      </div>

      <EventFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveEvent}
        eventToEdit={eventToEdit}
        colleges={allColleges}
        categories={allCategories}
        defaultCollegeId={collegeId}
      />
    </div>
  );
};