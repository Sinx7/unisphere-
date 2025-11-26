import React, { useState, useMemo, useCallback } from 'react';
import { EventCard } from '../EventCard';
import { EventDetailModal } from '../EventDetailModal';
import { getRecommendedEventIds } from '../../services/geminiService';
import { Event, College, Category } from '../../types';

interface StudentViewProps {
  events: Event[];
  colleges: College[];
  categories: Category[];
}

export const StudentView: React.FC<StudentViewProps> = ({ events, colleges, categories }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedCollege, setSelectedCollege] = useState<string>('all');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [recommendedEventIds, setRecommendedEventIds] = useState<string[]>([]);
  const userInterests = "coding, e-sports, and technology summits";

  const handleSelectEvent = useCallback((event: Event) => {
    setSelectedEvent(event);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedEvent(null);
  }, []);

  const handleCategoryClick = async (categoryId: string) => {
    if (categoryId === 'for-you') {
      setIsLoadingAI(true);
      setRecommendedEventIds([]); // Clear previous recommendations
      setSelectedCategory(categoryId);
      try {
        const ids = await getRecommendedEventIds(events, userInterests);
        setRecommendedEventIds(ids);
      } catch (e) {
        console.error("Failed to get AI recommendations");
      } finally {
        setIsLoadingAI(false);
      }
    } else {
      setRecommendedEventIds([]);
      setSelectedCategory(categoryId);
    }
  };

  const approvedColleges = useMemo(() => colleges.filter(c => c.approved), [colleges]);

  const filteredEvents = useMemo(() => {
    const eventsFromApprovedColleges = events.filter(event => approvedColleges.some(c => c.id === event.collegeId));
    
    if (selectedCategory === 'for-you') {
      return eventsFromApprovedColleges.filter(event => recommendedEventIds.includes(event.id));
    }

    return eventsFromApprovedColleges.filter((event) => {
      const categoryMatch = selectedCategory === 'all' || event.categoryId === selectedCategory;
      const collegeMatch = selectedCollege === 'all' || event.collegeId === selectedCollege;
      return categoryMatch && collegeMatch;
    });
  }, [selectedCategory, selectedCollege, recommendedEventIds, events, approvedColleges]);

  const getCollegeById = (id: string): College | undefined => colleges.find((c) => c.id === id);
  const getCategoryById = (id: string): Category | undefined => categories.find((c) => c.id === id);

  const FilterPill: React.FC<{ id: string; name: string; isLoading?: boolean; }> = ({ id, name, isLoading = false }) => {
    const isActive = selectedCategory === id;
    const baseClasses = "px-4 py-2 text-sm font-semibold rounded-full cursor-pointer transition-all duration-200 flex items-center justify-center";
    const activeClasses = "bg-primary text-white shadow-md";
    const inactiveClasses = "bg-white text-text-secondary hover:bg-gray-100 hover:text-text-primary";
    const loadingClasses = "bg-gray-200 text-gray-500 cursor-not-allowed";

    const handleClick = () => {
      if (isLoading) return;
      handleCategoryClick(id);
    }

    return (
      <button onClick={handleClick} disabled={isLoading} className={`${baseClasses} ${isLoading ? loadingClasses : (isActive ? activeClasses : inactiveClasses)}`}>
        {isLoading && (
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        )}
        {name}
      </button>
    );
  };

  return (
    <>
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-text-primary tracking-tight">Discover Your Next Experience</h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-text-secondary">
          Explore a wide range of events from tech, arts, sports, and more across all colleges.
        </p>
      </div>

      <div className="mb-10 p-4 bg-white/50 backdrop-blur-sm rounded-xl shadow-sm sticky top-24 z-30">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="flex items-center gap-2 flex-wrap">
            <FilterPill id="all" name="All" />
            {categories.map(cat => <FilterPill key={cat.id} id={cat.id} name={cat.name} />)}
            <FilterPill id="for-you" name="For You ✨" isLoading={isLoadingAI && selectedCategory === 'for-you'} />
          </div>
          <div className="sm:ml-auto w-full sm:w-auto">
            <select
              value={selectedCollege}
              onChange={(e) => setSelectedCollege(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-primary focus:border-primary transition"
            >
              <option value="all">All Colleges</option>
              {approvedColleges.map((college) => (
                <option key={college.id} value={college.id}>
                  {college.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {isLoadingAI && selectedCategory === 'for-you' && (
        <div className="text-center py-10">
          <p className="text-text-secondary">Finding events just for you...</p>
        </div>
      )}

      {!isLoadingAI && filteredEvents.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-lg shadow">
          <h3 className="text-2xl font-bold text-text-primary">No Events Found</h3>
          <p className="mt-2 text-text-secondary">
            {selectedCategory === 'for-you' ? 'AI couldn\'t find a match. Try exploring other categories!' : 'Try adjusting your filters to find more events.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              college={getCollegeById(event.collegeId)}
              category={getCategoryById(event.categoryId)}
              onSelect={handleSelectEvent}
              isRecommended={recommendedEventIds.includes(event.id)}
            />
          ))}
        </div>
      )}

      <EventDetailModal
        event={selectedEvent}
        college={selectedEvent ? getCollegeById(selectedEvent.collegeId) : undefined}
        onClose={handleCloseModal}
      />
    </>
  );
};