import React from 'react';
import { Event, College } from '../types';
import { CloseIcon } from './icons/CloseIcon';
import { CalendarIcon } from './icons/CalendarIcon';
import { LocationIcon } from './icons/LocationIcon';
import { Button } from './Button';

interface EventDetailModalProps {
  event: Event | null;
  college: College | undefined;
  onClose: () => void;
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const EventDetailModal: React.FC<EventDetailModalProps> = ({ event, college, onClose }) => {
  if (!event) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-card rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col lg:flex-row animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-full lg:w-2/5 flex-shrink-0">
          <img
            src={event.imageUrl}
            alt={event.name}
            className="w-full h-64 lg:h-full object-cover rounded-t-2xl lg:rounded-l-2xl lg:rounded-t-none"
          />
        </div>

        <div className="p-8 relative flex-grow">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 transition"
          >
            <CloseIcon className="w-7 h-7" />
          </button>

          <h2 className="text-4xl font-extrabold text-text-primary mb-2">{event.name}</h2>
          <p className="text-lg font-medium text-primary mb-6">{college?.name}</p>

          <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-8 mb-6 text-text-secondary">
            <div className="flex items-center">
              <CalendarIcon className="w-5 h-5 mr-2 text-primary" />
              <span>{formatDate(event.date)} at {event.time}</span>
            </div>
            <div className="flex items-center">
              <LocationIcon className="w-5 h-5 mr-2 text-primary" />
              <span>{event.location}</span>
            </div>
          </div>
          
          <div className="space-y-6">
            <div>
              <h4 className="text-lg font-bold text-text-primary mb-2">About the Event</h4>
              <p className="text-text-secondary leading-relaxed">{event.longDescription}</p>
            </div>
             <div>
              <h4 className="text-lg font-bold text-text-primary mb-2">Prize</h4>
              <p className="text-secondary font-semibold">{event.prize}</p>
            </div>
            <div>
              <h4 className="text-lg font-bold text-text-primary mb-2">Rules & Guidelines</h4>
              <ul className="list-disc list-inside text-text-secondary space-y-1">
                {event.rules.map((rule, index) => <li key={index}>{rule}</li>)}
              </ul>
            </div>
            {event.participants.length > 0 && (
              <div>
                <h4 className="text-lg font-bold text-text-primary mb-3">Registered Participants ({event.participants.length})</h4>
                <div className="flex flex-wrap gap-2">
                  {event.participants.slice(0, 10).map(p => (
                    <img key={p.id} src={p.avatarUrl} alt={p.name} title={p.name} className="w-10 h-10 rounded-full ring-2 ring-white" />
                  ))}
                  {event.participants.length > 10 && (
                    <div className="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center text-primary font-bold text-xs ring-2 ring-white">
                      +{event.participants.length - 10}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <Button variant="primary" className="w-full sm:w-auto">Register Now</Button>
          </div>
        </div>
      </div>
       <style>{`
        @keyframes fade-in-up {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};
