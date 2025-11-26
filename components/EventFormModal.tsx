import React, { useState, useEffect } from 'react';
import { Event, College, Category } from '../types';
import { Button } from './Button';
import { CloseIcon } from './icons/CloseIcon';

interface EventFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: Event) => void;
  eventToEdit?: Event | null;
  colleges: College[];
  categories: Category[];
  defaultCollegeId?: string; // For college view
}

export const EventFormModal: React.FC<EventFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  eventToEdit,
  colleges,
  categories,
  defaultCollegeId,
}) => {
  const initialEventState: Omit<Event, 'id' | 'participants'> = {
    name: '',
    description: '',
    longDescription: '',
    collegeId: defaultCollegeId || colleges[0]?.id || '',
    categoryId: categories[0]?.id || '',
    date: '',
    time: '',
    location: '',
    imageUrl: '',
    rules: [''],
    prize: '',
  };

  const [formState, setFormState] = useState(initialEventState);

  useEffect(() => {
    if (eventToEdit) {
      setFormState({ ...eventToEdit, rules: eventToEdit.rules.length > 0 ? eventToEdit.rules : [''] });
    } else {
      setFormState(initialEventState);
    }
  }, [eventToEdit, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormState(prevState => ({ ...prevState, [name]: value }));
  };
  
  const handleRuleChange = (index: number, value: string) => {
      const newRules = [...formState.rules];
      newRules[index] = value;
      setFormState(prevState => ({ ...prevState, rules: newRules }));
  }

  const addRule = () => {
    setFormState(prevState => ({ ...prevState, rules: [...prevState.rules, ''] }));
  }
  
  const removeRule = (index: number) => {
      if (formState.rules.length <= 1) return;
      const newRules = formState.rules.filter((_, i) => i !== index);
      setFormState(prevState => ({ ...prevState, rules: newRules }));
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const eventData: Event = {
      ...(eventToEdit || { id: `e${Date.now()}`, participants: [] }),
      ...formState,
      rules: formState.rules.filter(rule => rule.trim() !== ''),
    };
    onSave(eventData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit} className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-text-primary">
              {eventToEdit ? 'Edit Event' : 'Create New Event'}
            </h2>
            <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-800">
              <CloseIcon />
            </button>
          </div>

          <div className="space-y-4">
            {/* Form Fields */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-text-secondary">Event Name</label>
              <input type="text" name="name" id="name" value={formState.name} onChange={handleChange} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"/>
            </div>
            
            {!defaultCollegeId && (
                 <div>
                    <label htmlFor="collegeId" className="block text-sm font-medium text-text-secondary">College</label>
                    <select name="collegeId" id="collegeId" value={formState.collegeId} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary">
                        {colleges.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                </div>
            )}

            <div>
              <label htmlFor="categoryId" className="block text-sm font-medium text-text-secondary">Category</label>
              <select name="categoryId" id="categoryId" value={formState.categoryId} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary">
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            
             <div>
              <label htmlFor="description" className="block text-sm font-medium text-text-secondary">Short Description</label>
              <textarea name="description" id="description" value={formState.description} onChange={handleChange} rows={2} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"></textarea>
            </div>

            <div>
              <label htmlFor="longDescription" className="block text-sm font-medium text-text-secondary">Full Description</label>
              <textarea name="longDescription" id="longDescription" value={formState.longDescription} onChange={handleChange} rows={4} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                    <label htmlFor="date" className="block text-sm font-medium text-text-secondary">Date</label>
                    <input type="date" name="date" id="date" value={formState.date} onChange={handleChange} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"/>
                </div>
                 <div>
                    <label htmlFor="time" className="block text-sm font-medium text-text-secondary">Time</label>
                    <input type="text" name="time" id="time" value={formState.time} onChange={handleChange} required placeholder="e.g., 09:00 AM" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"/>
                </div>
            </div>
            
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-text-secondary">Location</label>
              <input type="text" name="location" id="location" value={formState.location} onChange={handleChange} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"/>
            </div>
            
            <div>
              <label htmlFor="prize" className="block text-sm font-medium text-text-secondary">Prize</label>
              <input type="text" name="prize" id="prize" value={formState.prize} onChange={handleChange} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"/>
            </div>

            <div>
                <label className="block text-sm font-medium text-text-secondary">Rules</label>
                {formState.rules.map((rule, index) => (
                    <div key={index} className="flex items-center gap-2 mt-1">
                        <input type="text" value={rule} onChange={(e) => handleRuleChange(index, e.target.value)} className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"/>
                        <button type="button" onClick={() => removeRule(index)} className="text-red-500 hover:text-red-700 disabled:opacity-50" disabled={formState.rules.length <= 1}>&times;</button>
                    </div>
                ))}
                <Button type="button" variant="outline" onClick={addRule} className="mt-2 py-1 px-3 text-xs">Add Rule</Button>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" variant="primary">Save Event</Button>
          </div>
        </form>
      </div>
    </div>
  );
};
