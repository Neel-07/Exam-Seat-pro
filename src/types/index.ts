export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'student';
  rollNumber?: string;
}

export interface Hall {
  id: string;
  name: string;
  rows: number;
  columns: number;
  capacity: number;
  layout: SeatLayout[][];
  createdAt: string;
}

export interface SeatLayout {
  id: string;
  row: number;
  column: number;
  isAvailable: boolean;
  label: string;
}

export interface Exam {
  id: string;
  name: string;
  subject: string;
  date: string;
  time: string;
  duration: number;
  hallId: string;
  createdAt: string;
  status: 'scheduled' | 'ongoing' | 'completed';
}

export interface SeatAssignment {
  id: string;
  examId: string;
  studentId: string;
  hallId: string;
  seatId: string;
  studentName: string;
  rollNumber: string;
  row: number;
  column: number;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: Omit<User, 'id'> & { password: string }) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}