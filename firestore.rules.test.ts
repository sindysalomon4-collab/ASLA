/**
 * Hardened Red Team Security Rules Test Specification
 * Verifies all 12 Dirty Dozen payloads return PERMISSION_DENIED.
 */

export interface SecurityTestCase {
  id: number;
  name: string;
  collection: string;
  operation: 'get' | 'list' | 'create' | 'update' | 'delete';
  expectedResult: 'PERMISSION_DENIED';
}

export const DIRTY_DOZEN_TESTS: SecurityTestCase[] = [
  { id: 1, name: 'Unverified Admin Spoof', collection: 'payments', operation: 'update', expectedResult: 'PERMISSION_DENIED' },
  { id: 2, name: 'Self-Approved Student Creation', collection: 'students', operation: 'create', expectedResult: 'PERMISSION_DENIED' },
  { id: 3, name: 'Invalid Grade Injection (Grade 5)', collection: 'students', operation: 'create', expectedResult: 'PERMISSION_DENIED' },
  { id: 4, name: 'Shadow Field Injection (isAdmin: true)', collection: 'users', operation: 'update', expectedResult: 'PERMISSION_DENIED' },
  { id: 5, name: 'Cross-User PII Read', collection: 'users', operation: 'get', expectedResult: 'PERMISSION_DENIED' },
  { id: 6, name: 'Unfiltered Collection List Scraping', collection: 'students', operation: 'list', expectedResult: 'PERMISSION_DENIED' },
  { id: 7, name: 'Payment Amount Manipulation (amountHtg != 15000)', collection: 'payments', operation: 'create', expectedResult: 'PERMISSION_DENIED' },
  { id: 8, name: 'Owner Self-Approving Payment', collection: 'payments', operation: 'update', expectedResult: 'PERMISSION_DENIED' },
  { id: 9, name: 'Terminal State Mutation on Approved Payment', collection: 'payments', operation: 'update', expectedResult: 'PERMISSION_DENIED' },
  { id: 10, name: 'ID Poisoning Attack', collection: 'submissions', operation: 'create', expectedResult: 'PERMISSION_DENIED' },
  { id: 11, name: 'Timestamp Forgery Attack', collection: 'submissions', operation: 'create', expectedResult: 'PERMISSION_DENIED' },
  { id: 12, name: 'Student Self-Grading Submission', collection: 'submissions', operation: 'update', expectedResult: 'PERMISSION_DENIED' },
];
