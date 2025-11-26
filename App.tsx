import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { StudentView } from './components/views/StudentView';
import { CollegeView } from './components/views/CollegeView';
import { AdminView } from './components/views/AdminView';
import { EVENTS, COLLEGES, CATEGORIES } from './constants';
import { Event, College, Category, Role } from './types';

const App: React.FC = () => {
  const [role, setRole] = useState<Role>('STUDENT');
  const [events, setEvents] = useState<Event[]>(EVENTS);
  const [colleges, setColleges] = useState<College[]>(COLLEGES);

  const handleRoleChange = useCallback((newRole: Role) => {
    setRole(newRole);
  }, []);
  
  const handleUpdateEvent = (updatedEvent: Event) => {
    setEvents(prevEvents => prevEvents.map(e => e.id === updatedEvent.id ? updatedEvent : e));
  };
  
  const handleAddEvent = (newEvent: Event) => {
    setEvents(prevEvents => [...prevEvents, newEvent]);
  };
  
  const handleDeleteEvent = (eventId: string) => {
    setEvents(prevEvents => prevEvents.filter(e => e.id !== eventId));
  }
  
  const handleToggleCollegeApproval = (collegeId: string) => {
    setColleges(prevColleges => 
      prevColleges.map(c => 
        c.id === collegeId ? { ...c, approved: !c.approved } : c
      )
    );
  };

  const renderView = () => {
    switch (role) {
      case 'STUDENT':
        return <StudentView events={events} colleges={colleges} categories={CATEGORIES} />;
      case 'COLLEGE':
        // For demo, hardcode the college admin's college ID
        const collegeAdminId = 'c1'; 
        return (
          <CollegeView
            collegeId={collegeAdminId}
            allEvents={events}
            allColleges={colleges}
            allCategories={CATEGORIES}
            onAddEvent={handleAddEvent}
            onUpdateEvent={handleUpdateEvent}
            onDeleteEvent={handleDeleteEvent}
          />
        );
      case 'ADMIN':
        return (
          <AdminView
            events={events}
            colleges={colleges}
            categories={CATEGORIES}
            onAddEvent={handleAddEvent}
            onUpdateEvent={handleUpdateEvent}
            onDeleteEvent={handleDeleteEvent}
            onToggleCollegeApproval={handleToggleCollegeApproval}
          />
        );
      default:
        return <StudentView events={events} colleges={colleges} categories={CATEGORIES} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header role={role} onRoleChange={handleRoleChange} />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {renderView()}
      </main>
    </div>
  );
};

export default App;