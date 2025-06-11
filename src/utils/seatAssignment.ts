import { Hall, SeatAssignment, User } from '../types';

export const generateSeatAssignments = (
  examId: string,
  students: User[],
  hall: Hall
): SeatAssignment[] => {
  const assignments: SeatAssignment[] = [];
  const availableSeats = hall.layout.flat().filter(seat => seat.isAvailable);
  
  if (students.length > availableSeats.length) {
    throw new Error('Not enough seats available for all students');
  }

  // Shuffle students for random assignment
  const shuffledStudents = [...students].sort(() => Math.random() - 0.5);
  
  // Shuffle available seats
  const shuffledSeats = [...availableSeats].sort(() => Math.random() - 0.5);

  shuffledStudents.forEach((student, index) => {
    const seat = shuffledSeats[index];
    assignments.push({
      id: `${examId}-${student.id}-${seat.id}`,
      examId,
      studentId: student.id,
      hallId: hall.id,
      seatId: seat.id,
      studentName: student.name,
      rollNumber: student.rollNumber || '',
      row: seat.row,
      column: seat.column,
    });
  });

  return assignments;
};

export const findStudentSeat = (
  assignments: SeatAssignment[],
  studentId: string,
  examId: string
): SeatAssignment | undefined => {
  return assignments.find(
    assignment => assignment.studentId === studentId && assignment.examId === examId
  );
};

export const getSeatByPosition = (
  hall: Hall,
  row: number,
  column: number
): string => {
  const rowLabel = String.fromCharCode(65 + row); // A, B, C...
  return `${rowLabel}${column + 1}`;
};