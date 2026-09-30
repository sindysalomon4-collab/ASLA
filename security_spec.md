# ASLA Firestore Security Specification (`security_spec.md`)

## 1. Data Invariants

1. **Default-Deny Catch-All**: Every path not explicitly matched is denied (`allow read, write: if false;`).
2. **Verified Authentication**: Every signed-in check requires `request.auth != null && request.auth.token.email_verified == true`.
3. **Admin Authority**: Admin access is strictly verified via `exists(/databases/$(database)/documents/admins/$(request.auth.uid))` or the bootstrapped verified admin email (`sindysalomon4@gmail.com` with `email_verified == true`). Never trust client-supplied role claims.
4. **Strict Grade Boundaries**: Every `grade` field on `students`, `payments`, and `submissions` MUST be in `['Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12']`. Grades 1–6 or arbitrary strings are rejected.
5. **PII Isolation**: User profiles (`/users/{userId}`), student records (`/students/{studentId}`), and payment receipts (`/payments/{paymentId}`) contain PII (email, phone, DOB, parent info, receipt info). `get` and `list` are strictly restricted to `resource.data.ownerId == request.auth.uid || isAdmin()`.
6. **Payment & Approval Authority**: When a student or parent creates a `StudentRecord` or `PaymentRecord`, `approvalStatus` and `paymentStatus`/`status` MUST initialize to `'Pending'`. Only `isAdmin()` can transition payment or approval status to `'Approved'` or `'Rejected'`.
7. **Terminal State Locking**: Once a `PaymentRecord` reaches `'Approved'` or `'Rejected'`, or a `SubmissionRecord` reaches `'Graded'`, non-admin owners cannot mutate it further.
8. **Temporal & Ownership Immutability**: `createdAt` must equal `request.time` on create and remain immutable on update. `updatedAt` must equal `request.time` on create and update. `ownerId` must equal `request.auth.uid` on create and remain immutable on update.

## 2. The "Dirty Dozen" Payloads

1. **Unverified Admin Spoof**: `auth = { uid: 'spoof1', token: { email: 'sindysalomon4@gmail.com', email_verified: false } }` attempting to approve a payment.
2. **Self-Approved Student Creation**: Student creating `/students/stu_1` with `approvalStatus: 'Approved'` and `paymentStatus: 'Approved'`.
3. **Invalid Grade Injection (Grade 5)**: Creating `/students/stu_2` with `grade: 'Grade 5'` (violating Grades 7–12 requirement).
4. **Shadow Field Injection**: Updating `/users/uid_1` with an extra field `isAdmin: true`.
5. **Cross-User PII Read**: Authenticated user `uid_2` attempting `get` on `/users/uid_1` or `/payments/pay_1` owned by `uid_1`.
6. **Unfiltered Collection List Scraping**: Authenticated user running an unconstrained `list` query on `/students` without filtering `ownerId == request.auth.uid`.
7. **Payment Amount Manipulation**: Creating `/payments/pay_1` with `amountHtg: 500` instead of `15000`.
8. **Owner Self-Approving Payment**: Owner `uid_1` attempting `update` on `/payments/pay_1` to set `status: 'Approved'`.
9. **Terminal State Mutation**: Owner `uid_1` attempting to modify `transactionRef` on `/payments/pay_1` after `status` is already `'Approved'`.
10. **ID Poisoning**: Creating `/submissions/invalid$id!@#` or a 500-character document ID.
11. **Timestamp Forgery**: Creating `/submissions/sub_1` with a past/future `createdAt` not matching `request.time`.
12. **Score Self-Grading**: Student updating `/submissions/sub_1` to set `status: 'Graded'` and `score: 100`.
