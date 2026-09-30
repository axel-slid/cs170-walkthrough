// Classes on the home screen. Each class lists its exam dates (shown with a countdown) and
// which exams/worksheets belong to it (by the `course` field in content/*.js).

export const courses = [
  {
    id: 'cs170',
    course: 'CS 170',
    title: 'Efficient Algorithms and Intractable Problems',
    term: 'Fall 2026',
    // From the course calendar.
    exams: [
      { name: 'Midterm 1', start: '2026-10-01T20:00', end: '2026-10-01T22:00' },
      { name: 'Midterm 2', start: '2026-11-05T19:00', end: '2026-11-05T21:00' },
      { name: 'Final', start: '2026-12-15T15:00', end: '2026-12-15T18:00' }
    ]
  }
];
