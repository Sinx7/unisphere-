export type Role = 'STUDENT' | 'COLLEGE' | 'ADMIN';

export interface College {
  id: string;
  name: string;
  approved: boolean;
}

export interface Category {
  id: string;
  name: string;
}

export interface Participant {
  id: string;
  name: string;
  avatarUrl: string;
}

export interface Event {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  collegeId: string;
  categoryId: string;
  date: string;
  time: string;
  location: string;
  imageUrl: string;
  participants: Participant[];
  rules: string[];
  prize: string;
}