import React from 'react';
import { Event, College, Category } from '../types';
import { CalendarIcon } from './icons/CalendarIcon';
import { LocationIcon } from './icons/LocationIcon';

interface EventCardProps {
  event: Event;
  college: College | undefined;
  category: Category | undefined;
  onSelect: (event: Event) => void;
  isRecommended: boolean;
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export const EventCard: React.FC<EventCardProps> = ({ event, college, category, onSelect, isRecommended }) => {
  return (
    <div
      onClick={() => onSelect(event)}
      className="bg-card rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer overflow-hidden flex flex-col group"
    >
      <div className="relative">
        <img
          src={event.imageUrl}
          alt={event.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 right-3 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
          {category?.name}
        </div>
         {isRecommended && (
          <div className="absolute top-3 left-3 bg-secondary text-white text-xs font-bold px-3 py-1 rounded-full shadow-md flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 mr-1">
              <path fillRule="evenodd" d="M8 1.75a.75.75 0 0 1 .692.462l1.41 3.393 3.663.293a.75.75 0 0 1 .428 1.317l-2.79 2.39.853 3.575a.75.75 0 0 1-1.11.814L8 11.474l-3.136 1.91a.75.75 0 0 1-1.11-.814l.852-3.574-2.79-2.39a.75.75 0 0 1 .427-1.318l3.663-.293 1.41-3.393A.75.75 0 0 1 8 1.75Z" clipRule="evenodd" />
            </svg>
            Recommended
          </div>
        )}
      </div>
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-text-primary mb-2 truncate group-hover:text-primary transition-colors">
          {event.name}
        </h3>
        <p className="text-text-secondary text-sm mb-4 flex-grow">{event.description}</p>
        <div className="space-y-3 text-sm text-text-secondary mt-auto">
          <div className="flex items-center">
            <LocationIcon className="w-4 h-4 mr-2 text-primary" />
            <span>{college?.name}</span>
          </div>
          <div className="flex items-center">
            <CalendarIcon className="w-4 h-4 mr-2 text-primary" />
            <span>{formatDate(event.date)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
