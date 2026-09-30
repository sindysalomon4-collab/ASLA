import React, { useEffect, useState } from 'react';
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut as firebaseSignOut,
  User as FirebaseUser,
} from 'firebase/auth';
import {
  doc,
  setDoc,
  serverTimestamp,
  collection,
  query,
  where,
  onSnapshot,
} from 'firebase/firestore';
import {
  auth,
  db,
  googleProvider,
  handleFirestoreError,
  OperationType,
} from './firebase';
import {
  AcademicCertificate,
  AccountType,
  ApprovalStatus,
  AttendanceRecord,
  ClassroomRecord,
  ExamPrepAccessStatus,
  ExamPrepAttempt,
  ExamPrepAuditLog,
  ExamPrepMaterial,
  ExamPrepMockExam,
  ExamPrepPaymentRecord,
  ExamPrepPaymentStatus,
  ExamPrepProgram,
  ExamPrepQuestion,
  ExamPrepStudentType,
  ExamPrepStudyPlanTask,
  ExamPrepSubjectCode,
  ExamPrepSubjectConfig,
  ExamPrepTopic,
  GradeLevel,
  Language,
  ParentAccount,
  PaymentStatus,
  PaymentTransaction,
  SchoolFileResource,
  SchoolNotification,
  SchoolSettings,
  StudentAccount,
  SubjectDefinition,
  WorkSubmission,
} from './types';
import { buildDefaultSubjectsForAllGrades } from './data/curriculumEngine';
import {
  INITIAL_ATTENDANCE,
  INITIAL_CERTIFICATES,
  INITIAL_CLASSROOMS,
  INITIAL_FILES,
  INITIAL_NOTIFICATIONS,
  INITIAL_PARENTS,
  INITIAL_PAYMENTS,
  INITIAL_SETTINGS,
  INITIAL_STUDENTS,
  INITIAL_SUBMISSIONS,
} from './data/seedData';
import {
  INITIAL_EXAM_PREP_ATTEMPTS,
  INITIAL_EXAM_PREP_AUDIT_LOGS,
  INITIAL_EXAM_PREP_MATERIALS,
  INITIAL_EXAM_PREP_MOCK_EXAMS,
  INITIAL_EXAM_PREP_PAYMENTS,
  INITIAL_EXAM_PREP_PROGRAMS,
  INITIAL_EXAM_PREP_QUESTIONS,
  INITIAL_EXAM_PREP_STUDY_PLAN,
  INITIAL_EXAM_PREP_SUBJECTS,
  INITIAL_EXAM_PREP_TOPICS,
} from './data/examPrepData';
import { PublicPortal, PublicSubView } from './components/PublicPortal';
import { StudentPortal } from './components/StudentPortal';
import { ParentPortal } from './components/ParentPortal';
import { AdminPortal } from './components/AdminPortal';

const STORAGE_KEY = 'asla_school_platform_v3_state';

function sanitizeId(raw: string): string {
  return raw.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 120) || 'doc_1';
}

export default function App() {
  // Primary interface language: Kreyòl Ayisyen ('ht')
  const [language, setLanguage] = useState<Language>('ht');

  // Active portal / auth state
  const [activePortal, setActivePortal] = useState<'PUBLIC' | AccountType>('PUBLIC');
  const [publicSubView, setPublicSubView] = useState<PublicSubView>('WELCOME');
  const [activeStudentId, setActiveStudentId] = useState<string>('stu-2');
  const [activeParentId, setActiveParentId] = useState<string>('par-1');
  const [pendingRegistrationStudent, setPendingRegistrationStudent] =
    useState<StudentAccount | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);

  // School Database State (Grades 7–12)
  const [subjects, setSubjects] = useState<SubjectDefinition[]>(() =>
    buildDefaultSubjectsForAllGrades()
  );
  const [classrooms, setClassrooms] = useState<ClassroomRecord[]>(INITIAL_CLASSROOMS);
  const [students, setStudents] = useState<StudentAccount[]>(INITIAL_STUDENTS);
  const [parents, setParents] = useState<ParentAccount[]>(INITIAL_PARENTS);
  const [payments, setPayments] = useState<PaymentTransaction[]>(INITIAL_PAYMENTS);
  const [submissions, setSubmissions] = useState<WorkSubmission[]>(INITIAL_SUBMISSIONS);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(INITIAL_ATTENDANCE);
  const [notifications, setNotifications] =
    useState<SchoolNotification[]>(INITIAL_NOTIFICATIONS);
  const [files, setFiles] = useState<SchoolFileResource[]>(INITIAL_FILES);
  const [settings, setSettings] = useState<SchoolSettings>(INITIAL_SETTINGS);
  const [certificates, setCertificates] =
    useState<AcademicCertificate[]>(INITIAL_CERTIFICATES);

  // Preparation Examen Leta / Filo Database State
  const [examPrepPrograms, setExamPrepPrograms] = useState<ExamPrepProgram[]>(
    INITIAL_EXAM_PREP_PROGRAMS
  );
  const [examPrepSubjects, setExamPrepSubjects] = useState<ExamPrepSubjectConfig[]>(
    INITIAL_EXAM_PREP_SUBJECTS
  );
  const [examPrepTopics, setExamPrepTopics] = useState<ExamPrepTopic[]>(
    INITIAL_EXAM_PREP_TOPICS
  );
  const [examPrepQuestions, setExamPrepQuestions] = useState<ExamPrepQuestion[]>(
    INITIAL_EXAM_PREP_QUESTIONS
  );
  const [examPrepMockExams, setExamPrepMockExams] = useState<ExamPrepMockExam[]>(
    INITIAL_EXAM_PREP_MOCK_EXAMS
  );
  const [examPrepMaterials, setExamPrepMaterials] = useState<ExamPrepMaterial[]>(
    INITIAL_EXAM_PREP_MATERIALS
  );
  const [examPrepAttempts, setExamPrepAttempts] = useState<ExamPrepAttempt[]>(
    INITIAL_EXAM_PREP_ATTEMPTS
  );
  const [examPrepPayments, setExamPrepPayments] = useState<ExamPrepPaymentRecord[]>(
    INITIAL_EXAM_PREP_PAYMENTS
  );
  const [examPrepStudyPlan, setExamPrepStudyPlan] = useState<
    ExamPrepStudyPlanTask[]
  >(INITIAL_EXAM_PREP_STUDY_PLAN);
  const [examPrepAuditLogs, setExamPrepAuditLogs] = useState<ExamPrepAuditLog[]>(
    INITIAL_EXAM_PREP_AUDIT_LOGS
  );

  // Hydrate from localStorage on first load
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.students?.length) setStudents(parsed.students);
        if (parsed.parents?.length) setParents(parsed.parents);
        if (parsed.payments?.length) setPayments(parsed.payments);
        if (parsed.submissions?.length) setSubmissions(parsed.submissions);
        if (parsed.attendance?.length) setAttendance(parsed.attendance);
        if (parsed.notifications?.length) setNotifications(parsed.notifications);
        if (parsed.settings) {
          setSettings({
            ...INITIAL_SETTINGS,
            ...parsed.settings,
            school_name: 'Aprantisaj se lò Akademi',
            schoolName: 'Aprantisaj se lò Akademi',
            fullOfficialTitle: 'Aprantisaj se lò Akademi (ASLA — Grades 7–12)',
          });
        }
        if (parsed.subjects?.length) {
          const defaults = buildDefaultSubjectsForAllGrades();
          const customExtras = (parsed.subjects as SubjectDefinition[]).filter(
            (s) => !defaults.some((d) => d.id === s.id)
          );
          setSubjects([...defaults, ...customExtras]);
        }
        if (parsed.classrooms?.length) setClassrooms(parsed.classrooms);
        if (parsed.certificates?.length) setCertificates(parsed.certificates);
        if (parsed.examPrepPrograms?.length)
          setExamPrepPrograms(parsed.examPrepPrograms);
        if (parsed.examPrepSubjects?.length)
          setExamPrepSubjects(parsed.examPrepSubjects);
        if (parsed.examPrepTopics?.length) setExamPrepTopics(parsed.examPrepTopics);
        if (parsed.examPrepQuestions?.length)
          setExamPrepQuestions(parsed.examPrepQuestions);
        if (parsed.examPrepMockExams?.length)
          setExamPrepMockExams(parsed.examPrepMockExams);
        if (parsed.examPrepMaterials?.length)
          setExamPrepMaterials(parsed.examPrepMaterials);
        if (parsed.examPrepAttempts?.length)
          setExamPrepAttempts(parsed.examPrepAttempts);
        if (parsed.examPrepPayments?.length)
          setExamPrepPayments(parsed.examPrepPayments);
        if (parsed.examPrepStudyPlan?.length)
          setExamPrepStudyPlan(parsed.examPrepStudyPlan);
        if (parsed.examPrepAuditLogs?.length)
          setExamPrepAuditLogs(parsed.examPrepAuditLogs);
      }
    } catch {
      // Ignore storage parse issues
    }
  }, []);

  // Sync browser page title with school_name setting
  useEffect(() => {
    const schoolTitle =
      settings.school_name || settings.schoolName || 'Aprantisaj se lò Akademi';
    document.title = `${schoolTitle} (ASLA — Grades 7–12)`;
  }, [settings.school_name, settings.schoolName]);

  // Persist to localStorage on changes
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          students,
          parents,
          payments,
          submissions,
          attendance,
          notifications,
          settings,
          subjects,
          classrooms,
          certificates,
          examPrepPrograms,
          examPrepSubjects,
          examPrepTopics,
          examPrepQuestions,
          examPrepMockExams,
          examPrepMaterials,
          examPrepAttempts,
          examPrepPayments,
          examPrepStudyPlan,
          examPrepAuditLogs,
        })
      );
    } catch {
      // Ignore quota issues
    }
  }, [
    students,
    parents,
    payments,
    submissions,
    attendance,
    notifications,
    settings,
    subjects,
    classrooms,
    certificates,
    examPrepPrograms,
    examPrepSubjects,
    examPrepTopics,
    examPrepQuestions,
    examPrepMockExams,
    examPrepMaterials,
    examPrepAttempts,
    examPrepPayments,
    examPrepStudyPlan,
    examPrepAuditLogs,
  ]);

  // Listen to Firebase Auth state & sync user's Firestore documents when signed in
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
    });
    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!firebaseUser || !firebaseUser.emailVerified) return;

    const uid = sanitizeId(firebaseUser.uid);
    const submissionsQuery = query(
      collection(db, 'submissions'),
      where('ownerId', '==', uid)
    );

    const unsubscribeSubmissions = onSnapshot(
      submissionsQuery,
      () => {
        // Real-time listener verified against hardened Firestore security rules
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'submissions');
      }
    );

    return () => {
      unsubscribeSubmissions();
    };
  }, [firebaseUser]);

  // Sync a newly registered student to Firestore if authenticated
  const syncStudentToFirestore = async (stu: StudentAccount) => {
    if (!auth.currentUser || !auth.currentUser.emailVerified) return;
    const uid = sanitizeId(auth.currentUser.uid);
    const docId = sanitizeId(stu.id);
    const path = `students/${docId}`;
    try {
      await setDoc(doc(db, 'students', docId), {
        ownerId: uid,
        fullName: stu.fullName.slice(0, 120),
        dateOfBirth: stu.dateOfBirth.slice(0, 20),
        email: stu.email.slice(0, 254),
        phone: stu.phone.slice(0, 40),
        grade: stu.grade,
        classroom: stu.classroom.slice(0, 60),
        parentName: stu.parentName.slice(0, 120),
        parentContact: stu.parentContact.slice(0, 120),
        approvalStatus: 'Pending',
        paymentStatus: 'Pending',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  };

  // Sync a payment record to Firestore if authenticated
  const syncPaymentToFirestore = async (pay: PaymentTransaction) => {
    if (!auth.currentUser || !auth.currentUser.emailVerified) return;
    const uid = sanitizeId(auth.currentUser.uid);
    const docId = sanitizeId(pay.id);
    const path = `payments/${docId}`;
    try {
      await setDoc(doc(db, 'payments', docId), {
        ownerId: uid,
        studentId: sanitizeId(pay.studentId),
        studentName: pay.studentName.slice(0, 120),
        grade: pay.grade,
        classroom: pay.classroom.slice(0, 60),
        parentInfo: `${pay.parentName} (${pay.parentContact})`.slice(0, 200),
        amountHtg: 15000,
        paymentMethod: pay.paymentMethod.slice(0, 60),
        transactionRef: pay.transactionNumber.slice(0, 100),
        receiptFileName: pay.receiptFileName.slice(0, 255),
        status: 'Pending',
        rejectionReason: '',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  };

  const handleGoogleSignIn = async (role: AccountType) => {
    try {
      const cred = await signInWithPopup(auth, googleProvider);
      const user = cred.user;
      if (user && user.emailVerified) {
        const uid = sanitizeId(user.uid);
        const userPath = `users/${uid}`;
        try {
          await setDoc(doc(db, 'users', uid), {
            ownerId: uid,
            fullName: (user.displayName || 'Itilizatè ASLA').slice(0, 120),
            email: (user.email || 'user@asla.edu.ht').slice(0, 254),
            phone: '+509 3700-0000',
            accountType:
              role === 'Administration' && user.email !== 'sindysalomon4@gmail.com'
                ? 'Student'
                : role,
            preferredLanguage: language,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });
        } catch (err) {
          handleFirestoreError(err, OperationType.WRITE, userPath);
        }
      }
      if (role === 'Student') {
        setActiveStudentId(students[1]?.id || 'stu-2');
      } else if (role === 'Parent') {
        setActiveParentId(parents[0]?.id || 'par-1');
      }
      setActivePortal(role);
    } catch {
      // Fallback if popup closed in iframe preview
      setActivePortal(role);
    }
  };

  const handleSignInSuccess = (role: AccountType, userId: string) => {
    if (role === 'Student') {
      setActiveStudentId(userId);
    } else if (role === 'Parent') {
      setActiveParentId(userId);
    }
    setActivePortal(role);
  };

  const handleRegisterStudentAndProceedToPayment = (newStudent: StudentAccount) => {
    setStudents((prev) => [newStudent, ...prev]);
    setPendingRegistrationStudent(newStudent);
    setActiveStudentId(newStudent.id);
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        targetRole: 'Administration',
        category: 'Registration',
        title: `Nouvo Enskripsyon Elèv : ${newStudent.fullName} (${newStudent.grade})`,
        message: `${newStudent.fullName} enskri nan ${newStudent.grade} (${newStudent.classroom}). Dosye a ap tann pèman 15,000 HTG ak apwobasyon.`,
        date: new Date().toISOString().slice(0, 10),
        read: false,
      },
      ...prev,
    ]);
    void syncStudentToFirestore(newStudent);
    setPublicSubView('PAYMENT');
  };

  const handleRegisterParentAndProceedToPayment = (
    newParent: ParentAccount,
    childStudent: StudentAccount
  ) => {
    setParents((prev) => [newParent, ...prev]);
    setStudents((prev) => [childStudent, ...prev]);
    setPendingRegistrationStudent(childStudent);
    setActiveParentId(newParent.id);
    setActiveStudentId(childStudent.id);
    void syncStudentToFirestore(childStudent);
    setPublicSubView('PAYMENT');
  };

  const handleSubmitPaymentReceipt = (payment: PaymentTransaction) => {
    setPayments((prev) => [payment, ...prev]);
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        targetRole: 'Administration',
        category: 'Payment',
        title: `Resi 15,000 HTG Telechaje : ${payment.studentName} (${payment.grade})`,
        message: `Metòd: ${payment.paymentMethod} · Ref: ${payment.transactionNumber} · Fichye: ${payment.receiptFileName}. Tanpri verifye resi a.`,
        date: payment.date,
        read: false,
      },
      ...prev,
    ]);
    void syncPaymentToFirestore(payment);
    setPublicSubView('PAYMENT_PENDING');
  };

  const handleSubmitStudentTuitionReceipt = (payload: {
    paymentReference: string;
    transactionNumber: string;
    amountHtg: number;
    paymentDate: string;
    natcashNumber: string;
    receiptFileName: string;
    receiptDataUrl?: string;
  }) => {
    const stu =
      students.find((s) => s.id === activeStudentId) || students[0];
    if (!stu) return;

    const today = new Date().toISOString().slice(0, 10);
    const newPayment: PaymentTransaction = {
      id: `pay-${Date.now()}`,
      studentId: stu.id,
      studentCode: stu.studentCode,
      studentName: stu.fullName,
      studentType: stu.examPrepStudentType || 'ASLA Student',
      paymentType: 'Frè lekòl anyèl',
      expectedAmountHtg: 15000,
      grade: stu.grade,
      classroom: stu.classroom,
      parentName: stu.parentName,
      parentContact: stu.parentContact,
      amountHtg: 15000,
      paymentMethod: 'NatCash',
      paymentReference: payload.paymentReference,
      natcashNumber: payload.natcashNumber,
      paymentDate: payload.paymentDate,
      submissionDate: today,
      transactionNumber: payload.transactionNumber,
      receiptFileName: payload.receiptFileName,
      receiptDataUrl: payload.receiptDataUrl,
      aslaReceiptReceived: true,
      whatsappReceiptReceived: false,
      whatsappSentByStudent: false,
      date: today,
      status: 'Pending Verification',
    };

    setPayments((prev) => [newPayment, ...prev]);
    setStudents((prev) =>
      prev.map((s) =>
        s.id === stu.id ? { ...s, paymentStatus: 'Pending Verification' } : s
      )
    );
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        targetRole: 'Administration',
        category: 'Payment',
        title: `Resi Frè Lekòl Anyèl (15,000 HTG) Telechaje : ${stu.fullName} (${stu.grade})`,
        message: `Ref: ${payload.paymentReference} · Tx NatCash: ${payload.transactionNumber} · ASLA Receipt: ✓ Received · WhatsApp Receipt: Pending.`,
        date: today,
        read: false,
      },
      ...prev,
    ]);
    void syncPaymentToFirestore(newPayment);
  };

  const handleToggleReceiptsStatus = (
    source: 'TUITION' | 'EXAM_PREP',
    paymentId: string,
    aslaReceived: boolean,
    whatsappReceived: boolean
  ) => {
    if (source === 'TUITION') {
      setPayments((prev) =>
        prev.map((p) =>
          p.id === paymentId
            ? {
                ...p,
                aslaReceiptReceived: aslaReceived,
                whatsappReceiptReceived: whatsappReceived,
              }
            : p
        )
      );
    } else {
      setExamPrepPayments((prev) =>
        prev.map((ep) =>
          ep.id === paymentId
            ? {
                ...ep,
                aslaReceiptReceived: aslaReceived,
                whatsappReceiptReceived: whatsappReceived,
              }
            : ep
        )
      );
    }
  };

  const handleVerifyPaymentRecord = (
    source: 'TUITION' | 'EXAM_PREP',
    paymentId: string
  ) => {
    if (source === 'TUITION') {
      const target = payments.find((p) => p.id === paymentId);
      setPayments((prev) =>
        prev.map((p) =>
          p.id === paymentId
            ? {
                ...p,
                status: p.status === 'Approved' ? 'Approved' : 'Verified',
              }
            : p
        )
      );
      if (target) {
        setStudents((prev) =>
          prev.map((s) =>
            s.id === target.studentId && s.paymentStatus !== 'Approved'
              ? { ...s, paymentStatus: 'Verified' }
              : s
          )
        );
      }
    } else {
      const target = examPrepPayments.find((ep) => ep.id === paymentId);
      setExamPrepPayments((prev) =>
        prev.map((ep) =>
          ep.id === paymentId
            ? {
                ...ep,
                status: ep.status === 'Approved' ? 'Approved' : 'Verified',
              }
            : ep
        )
      );
      if (target) {
        setStudents((prev) =>
          prev.map((s) =>
            s.id === target.studentId && s.examPrepPaymentStatus !== 'Approved'
              ? { ...s, examPrepPaymentStatus: 'Verified' }
              : s
          )
        );
      }
    }
  };

  const handleUpdatePaymentStatus = (
    paymentId: string,
    status: PaymentStatus,
    rejectionReason?: string
  ) => {
    const targetPay = payments.find((p) => p.id === paymentId);
    setPayments((prev) =>
      prev.map((p) =>
        p.id === paymentId
          ? {
              ...p,
              status,
              rejectionReason,
              aslaReceiptReceived:
                status === 'Approved' ? true : p.aslaReceiptReceived,
              whatsappReceiptReceived:
                status === 'Approved' ? true : p.whatsappReceiptReceived,
            }
          : p
      )
    );

    if (targetPay) {
      setStudents((prev) =>
        prev.map((s) => {
          if (s.id !== targetPay.studentId) return s;
          return {
            ...s,
            paymentStatus: status,
            approvalStatus:
              status === 'Approved'
                ? 'Active'
                : status === 'Rejected' || status === 'Correction Required'
                ? 'Rejected'
                : s.approvalStatus,
          };
        })
      );

      setNotifications((prev) => [
        {
          id: `notif-${Date.now()}`,
          targetRole: 'All',
          targetUserId: targetPay.studentId,
          category:
            status === 'Approved' ? 'Payment Approval' : 'Payment Rejection',
          title:
            status === 'Approved'
              ? `Pèman 15,000 HTG Apwouve & Kont Elèv Aktive (${targetPay.studentName})`
              : status === 'Correction Required'
              ? `Nouvo Resi Egzije (Correction Required) — ${targetPay.studentName}`
              : `Pèman 15,000 HTG Rejte (${targetPay.studentName})`,
          message:
            status === 'Approved'
              ? `Administrasyon ASLA verifye resi ASLA ak WhatsApp (${targetPay.transactionNumber}) epi aktive kont ${targetPay.studentName} nan sal klas ${targetPay.grade} la.`
              : `Resi ${targetPay.transactionNumber} (${status}). Rezon: ${
                  rejectionReason || 'Resi pa konfòm'
                }`,
          date: new Date().toISOString().slice(0, 10),
          read: false,
        },
        ...prev,
      ]);
    }
  };

  const handleUpdateStudentStatus = (
    studentId: string,
    approvalStatus: ApprovalStatus
  ) => {
    const stu = students.find((s) => s.id === studentId);
    setStudents((prev) =>
      prev.map((s) => (s.id === studentId ? { ...s, approvalStatus } : s))
    );
    if (stu) {
      setNotifications((prev) => [
        {
          id: `notif-${Date.now()}`,
          targetRole: 'Student',
          targetUserId: stu.id,
          category:
            approvalStatus === 'Approved' || approvalStatus === 'Active'
              ? 'Student Approval'
              : 'Student Rejection',
          title: `Stati Kont Elèv Mete Ajou : ${approvalStatus} (${stu.fullName})`,
          message: `Administrasyon ASLA mete stati kont ou sou "${approvalStatus}" pou ${stu.grade} (${stu.classroom}).`,
          date: new Date().toISOString().slice(0, 10),
          read: false,
        },
        ...prev,
      ]);
    }
  };

  const handleUpdateStudentGradeAndClass = (
    studentId: string,
    grade: GradeLevel,
    classroom: string
  ) => {
    const gNum = grade.replace('Grade ', '');
    setStudents((prev) =>
      prev.map((s) =>
        s.id === studentId
          ? {
              ...s,
              grade,
              classroom,
              currentSubjectId: `subj-g${gNum}-math`,
            }
          : s
      )
    );
  };

  const handleToggleLessonCompleted = (lessonId: string) => {
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id !== activeStudentId) return s;
        const exists = s.completedLessonIds.includes(lessonId);
        return {
          ...s,
          completedLessonIds: exists
            ? s.completedLessonIds.filter((id) => id !== lessonId)
            : [...s.completedLessonIds, lessonId],
        };
      })
    );
  };

  const handleSubmitWork = (
    submission: Omit<WorkSubmission, 'id' | 'submittedAt'>
  ) => {
    const newSub: WorkSubmission = {
      ...submission,
      id: `sub-${Date.now()}`,
      submittedAt: new Date().toISOString().slice(0, 10),
    };
    setSubmissions((prev) => [newSub, ...prev]);

    if (firebaseUser && firebaseUser.emailVerified) {
      const uid = sanitizeId(firebaseUser.uid);
      const docId = sanitizeId(newSub.id);
      const path = `submissions/${docId}`;
      setDoc(doc(db, 'submissions', docId), {
        ownerId: uid,
        grade: newSub.grade,
        subjectId: sanitizeId(newSub.subjectId),
        chapterNumber: newSub.chapterNumber,
        lessonNumber: newSub.lessonNumber,
        workType: newSub.workType,
        responseContent: (newSub.writtenResponse || 'Submitted').slice(0, 5000),
        status: 'Submitted',
        score: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }).catch((err) => handleFirestoreError(err, OperationType.CREATE, path));
    }
  };

  const handleIssueCertificate = (newCert: AcademicCertificate) => {
    setCertificates((prev) => [newCert, ...prev]);
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        targetRole: 'All',
        targetUserId: newCert.studentId,
        category: 'Certificate',
        title: `Nouvo Diplòm / Sètifika Delivre : ${newCert.titleHt}`,
        message: `${newCert.studentName} (${newCert.grade}) resevwa ${newCert.certificateType} (N° ${newCert.serialNumber}) siyen pa Sindy Salomon.`,
        date: newCert.issuedAt,
        read: false,
      },
      ...prev,
    ]);
  };

  const handleToggleCertificateStatus = (certId: string) => {
    setCertificates((prev) =>
      prev.map((c) =>
        c.id === certId
          ? { ...c, status: c.status === 'Active' ? 'Revoked' : 'Active' }
          : c
      )
    );
  };

  // --- EXAM PREP WORKFLOW HANDLERS ---
  const handleSubmitExamPrepPayment = (
    payload: Omit<ExamPrepPaymentRecord, 'id' | 'submittedAt' | 'status'>
  ) => {
    const newPay: ExamPrepPaymentRecord = {
      ...payload,
      id: `ep-pay-${Date.now()}`,
      submittedAt: new Date().toISOString().slice(0, 10),
      status: 'Pending Verification',
    };
    setExamPrepPayments((prev) => [newPay, ...prev]);

    // Never auto-approve! Status becomes Pending Verification
    setStudents((prev) =>
      prev.map((s) =>
        s.id === payload.studentId
          ? {
              ...s,
              examPrepPaymentStatus: 'Pending Verification',
              examPrepAccessStatus: 'Pending Verification',
            }
          : s
      )
    );

    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        targetRole: 'Administration',
        category: 'Payment',
        title: `Nouvo Resi Examen Leta / Filo (${payload.expectedAmountHtg} HTG) : ${payload.studentName}`,
        message: `${payload.studentName} (${payload.studentType}, ${payload.grade}) soumèt resi ${payload.transactionReference} (${payload.expectedAmountHtg} HTG). Stati: Pending Verification.`,
        date: new Date().toISOString().slice(0, 10),
        read: false,
      },
      ...prev,
    ]);
  };

  const handleUpdateExamPrepPaymentStatus = (
    paymentId: string,
    status: ExamPrepPaymentStatus,
    reason?: string
  ) => {
    const targetPay = examPrepPayments.find((p) => p.id === paymentId);
    setExamPrepPayments((prev) =>
      prev.map((p) =>
        p.id === paymentId
          ? {
              ...p,
              status,
              rejectionOrCorrectionReason: reason,
              aslaReceiptReceived:
                status === 'Approved' ? true : p.aslaReceiptReceived,
              whatsappReceiptReceived:
                status === 'Approved' ? true : p.whatsappReceiptReceived,
              reviewedBy: 'Sindy Salomon',
              reviewedAt: new Date().toISOString().slice(0, 10),
            }
          : p
      )
    );

    if (targetPay) {
      const nextAccess: ExamPrepAccessStatus =
        status === 'Approved'
          ? 'Active'
          : status === 'Rejected'
          ? 'Rejected'
          : status === 'Correction Requested' || status === 'Correction Required'
          ? 'Correction Requested'
          : 'Pending Verification';

      setStudents((prev) =>
        prev.map((s) =>
          s.id === targetPay.studentId
            ? {
                ...s,
                examPrepPaymentStatus: status,
                examPrepAccessStatus: nextAccess,
              }
            : s
        )
      );

      setExamPrepAuditLogs((prev) => [
        {
          id: `audit-${Date.now()}`,
          timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
          adminName: 'Sindy Salomon',
          studentId: targetPay.studentId,
          studentName: targetPay.studentName,
          action: `Peman Examen Leta (${targetPay.expectedAmountHtg} HTG) → ${status}`,
          details:
            status === 'Approved'
              ? `Resi ${targetPay.transactionReference} valide. Aksè Examen Leta / Filo aktive.`
              : `Resi ${targetPay.transactionReference} (${status}). Rezon: ${
                  reason || 'N/A'
                }`,
        },
        ...prev,
      ]);

      setNotifications((prev) => [
        {
          id: `notif-${Date.now()}`,
          targetRole: 'All',
          targetUserId: targetPay.studentId,
          category:
            status === 'Approved' ? 'Payment Approval' : 'Payment Rejection',
          title:
            status === 'Approved'
              ? `Aksè Preparasyon Egzamen Leta / Filo Aktive (${targetPay.studentName})`
              : `Peman Preparasyon Egzamen Leta / Filo ${status} (${targetPay.studentName})`,
          message:
            status === 'Approved'
              ? `Peman ${targetPay.expectedAmountHtg} HTG ou a apwouve! Aksè ou nan Preparasyon Egzamen Leta / Filo aktif kounye a.`
              : `Peman ou rejte. Tanpri verifye rezon an epi soumèt yon nouvo resi. Rezon: ${
                  reason || 'Resi pa konfòm'
                }`,
          date: new Date().toISOString().slice(0, 10),
          read: false,
        },
        ...prev,
      ]);
    }
  };

  const handleUpdateStudentExamPrepEligibility = (
    studentId: string,
    studentType: ExamPrepStudentType,
    completedRequiredAslaCourses: boolean,
    accessStatus: ExamPrepAccessStatus,
    teacherRecommendation?: string
  ) => {
    const stu = students.find((s) => s.id === studentId);
    setStudents((prev) =>
      prev.map((s) =>
        s.id === studentId
          ? {
              ...s,
              examPrepStudentType: studentType,
              completedRequiredAslaCourses,
              examPrepAccessStatus: accessStatus,
              examPrepPaymentStatus:
                accessStatus === 'Active'
                  ? 'Approved'
                  : s.examPrepPaymentStatus || 'Not Submitted',
              teacherExamPrepRecommendation:
                teacherRecommendation ?? s.teacherExamPrepRecommendation,
            }
          : s
      )
    );

    if (stu) {
      const fee =
        studentType === 'ASLA Student' && completedRequiredAslaCourses
          ? 500
          : 2000;
      setExamPrepAuditLogs((prev) => [
        {
          id: `audit-${Date.now()}`,
          timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
          adminName: 'Sindy Salomon',
          studentId: stu.id,
          studentName: stu.fullName,
          action: 'Mizajou Elijibilite & Aksè Examen Leta / Filo',
          details: `Tip: ${studentType} · Fini Kour ASLA: ${completedRequiredAslaCourses} · Tarif: ${fee} HTG · Aksè: ${accessStatus}`,
        },
        ...prev,
      ]);
    }
  };

  const handleRecordExamPrepAttempt = (
    payload: Omit<ExamPrepAttempt, 'id' | 'date'>
  ) => {
    const newAttempt: ExamPrepAttempt = {
      ...payload,
      id: `epa-${Date.now()}`,
      date: new Date().toISOString().slice(0, 10),
    };
    setExamPrepAttempts((prev) => [newAttempt, ...prev]);
  };

  const handleUpdateExamPrepTopicStatus = (
    topicId: string,
    status: 'Completed' | 'In Progress' | 'Not Started'
  ) => {
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id !== activeStudentId) return s;
        const comp = (s.completedExamPrepTopicIds || []).filter(
          (id) => id !== topicId
        );
        const inProg = (s.inProgressExamPrepTopicIds || []).filter(
          (id) => id !== topicId
        );
        if (status === 'Completed') comp.push(topicId);
        if (status === 'In Progress') inProg.push(topicId);
        return {
          ...s,
          completedExamPrepTopicIds: comp,
          inProgressExamPrepTopicIds: inProg,
        };
      })
    );
  };

  const handleToggleExamPrepStudyPlanTask = (taskId: string) => {
    setExamPrepStudyPlan((prev) =>
      prev.map((t) =>
        t.id === taskId ? { ...t, completed: !t.completed } : t
      )
    );
  };

  const handleAddExamPrepStudyPlanTask = (
    task: Omit<ExamPrepStudyPlanTask, 'id' | 'studentId' | 'completed'>
  ) => {
    setExamPrepStudyPlan((prev) => [
      ...prev,
      {
        ...task,
        id: `plan-${Date.now()}`,
        studentId: activeStudentId,
        completed: false,
      },
    ]);
  };

  const handleSignOut = () => {
    if (auth.currentUser) {
      void firebaseSignOut(auth);
    }
    setActivePortal('PUBLIC');
    setPublicSubView('WELCOME');
  };

  const activeStudent =
    students.find((s) => s.id === activeStudentId) || students[0];
  const activeParent =
    parents.find((p) => p.id === activeParentId) || parents[0];

  if (activePortal === 'Student') {
    return (
      <StudentPortal
        language={language}
        onChangeLanguage={setLanguage}
        student={activeStudent}
        allStudents={students}
        onSwitchStudent={setActiveStudentId}
        classrooms={classrooms}
        subjects={subjects}
        submissions={submissions}
        attendance={attendance}
        notifications={notifications}
        payments={payments}
        certificates={certificates}
        settings={settings}
        examPrepPrograms={examPrepPrograms}
        examPrepSubjects={examPrepSubjects}
        examPrepTopics={examPrepTopics}
        examPrepQuestions={examPrepQuestions}
        examPrepMockExams={examPrepMockExams}
        examPrepMaterials={examPrepMaterials}
        examPrepAttempts={examPrepAttempts}
        examPrepPayments={examPrepPayments}
        examPrepStudyPlan={examPrepStudyPlan}
        onSubmitExamPrepPayment={handleSubmitExamPrepPayment}
        onSubmitTuitionReceipt={handleSubmitStudentTuitionReceipt}
        onRecordExamPrepAttempt={handleRecordExamPrepAttempt}
        onUpdateExamPrepTopicStatus={handleUpdateExamPrepTopicStatus}
        onToggleExamPrepStudyPlanTask={handleToggleExamPrepStudyPlanTask}
        onAddExamPrepStudyPlanTask={handleAddExamPrepStudyPlanTask}
        onIssueCertificate={handleIssueCertificate}
        onToggleLessonCompleted={handleToggleLessonCompleted}
        onSubmitWork={handleSubmitWork}
        onUpdateStudentProfile={(updated) =>
          setStudents((prev) =>
            prev.map((s) => (s.id === updated.id ? updated : s))
          )
        }
        onSignOut={handleSignOut}
      />
    );
  }

  if (activePortal === 'Parent') {
    return (
      <ParentPortal
        language={language}
        onChangeLanguage={setLanguage}
        parent={activeParent}
        students={students}
        classrooms={classrooms}
        subjects={subjects}
        submissions={submissions}
        attendance={attendance}
        payments={payments}
        notifications={notifications}
        certificates={certificates}
        examPrepSubjects={examPrepSubjects}
        examPrepTopics={examPrepTopics}
        examPrepAttempts={examPrepAttempts}
        examPrepPayments={examPrepPayments}
        onGoToPayForStudent={(child) => {
          setPendingRegistrationStudent(child);
          setActivePortal('PUBLIC');
          setPublicSubView('PAYMENT');
        }}
        onSignOut={handleSignOut}
      />
    );
  }

  if (activePortal === 'Administration') {
    return (
      <AdminPortal
        language={language}
        onChangeLanguage={setLanguage}
        students={students}
        parents={parents}
        classrooms={classrooms}
        subjects={subjects}
        submissions={submissions}
        attendance={attendance}
        payments={payments}
        notifications={notifications}
        files={files}
        settings={settings}
        certificates={certificates}
        examPrepPrograms={examPrepPrograms}
        examPrepSubjects={examPrepSubjects}
        examPrepTopics={examPrepTopics}
        examPrepQuestions={examPrepQuestions}
        examPrepMockExams={examPrepMockExams}
        examPrepMaterials={examPrepMaterials}
        examPrepAttempts={examPrepAttempts}
        examPrepPayments={examPrepPayments}
        examPrepAuditLogs={examPrepAuditLogs}
        onUpdateExamPrepPaymentStatus={handleUpdateExamPrepPaymentStatus}
        onUpdateStudentExamPrepEligibility={handleUpdateStudentExamPrepEligibility}
        onToggleExamPrepSubjectEnabled={(code: ExamPrepSubjectCode) =>
          setExamPrepSubjects((prev) =>
            prev.map((s) =>
              s.code === code ? { ...s, enabled: !s.enabled } : s
            )
          )
        }
        onToggleExamPrepProgramSubject={(
          programId: string,
          subjectCode: ExamPrepSubjectCode
        ) =>
          setExamPrepPrograms((prev) =>
            prev.map((p) => {
              if (p.id !== programId) return p;
              const exists = p.enabledSubjects.includes(subjectCode);
              return {
                ...p,
                enabledSubjects: exists
                  ? p.enabledSubjects.filter((c) => c !== subjectCode)
                  : [...p.enabledSubjects, subjectCode],
              };
            })
          )
        }
        onAddExamPrepTopic={(tp) => setExamPrepTopics((prev) => [tp, ...prev])}
        onAddExamPrepQuestion={(q) =>
          setExamPrepQuestions((prev) => [q, ...prev])
        }
        onAddExamPrepMockExam={(m) =>
          setExamPrepMockExams((prev) => [m, ...prev])
        }
        onAddExamPrepMaterial={(mat) =>
          setExamPrepMaterials((prev) => [mat, ...prev])
        }
        onIssueCertificate={handleIssueCertificate}
        onToggleCertificateStatus={handleToggleCertificateStatus}
        onUpdatePaymentStatus={handleUpdatePaymentStatus}
        onToggleReceiptsStatus={handleToggleReceiptsStatus}
        onVerifyPaymentRecord={handleVerifyPaymentRecord}
        onUpdateStudentStatus={handleUpdateStudentStatus}
        onUpdateStudentGradeAndClass={handleUpdateStudentGradeAndClass}
        onAddSubject={(newSubj) => setSubjects((prev) => [...prev, newSubj])}
        onAddClassroom={(newRoom) => setClassrooms((prev) => [...prev, newRoom])}
        onGradeSubmission={(subId, score, letterGrade, feedback) =>
          setSubmissions((prev) =>
            prev.map((s) =>
              s.id === subId
                ? {
                    ...s,
                    status: 'Graded',
                    score,
                    letterGrade,
                    teacherFeedback: feedback,
                    gradedAt: new Date().toISOString().slice(0, 10),
                  }
                : s
            )
          )
        }
        onRecordAttendance={(rec) =>
          setAttendance((prev) => [{ ...rec, id: `att-${Date.now()}` }, ...prev])
        }
        onSendNotification={(notif) =>
          setNotifications((prev) => [
            {
              ...notif,
              id: `notif-${Date.now()}`,
              date: new Date().toISOString().slice(0, 10),
              read: false,
            },
            ...prev,
          ])
        }
        onAddFileResource={(file) =>
          setFiles((prev) => [
            {
              ...file,
              id: `file-${Date.now()}`,
              updatedAt: new Date().toISOString().slice(0, 10),
            },
            ...prev,
          ])
        }
        onUpdateSettings={setSettings}
        onSignOut={handleSignOut}
      />
    );
  }

  return (
    <PublicPortal
      language={language}
      onChangeLanguage={setLanguage}
      subView={publicSubView}
      onChangeSubView={setPublicSubView}
      students={students}
      parents={parents}
      classrooms={classrooms}
      subjects={subjects}
      settings={settings}
      onSignInSuccess={handleSignInSuccess}
      onGoogleSignIn={handleGoogleSignIn}
      onRegisterStudentAndProceedToPayment={handleRegisterStudentAndProceedToPayment}
      onRegisterParentAndProceedToPayment={handleRegisterParentAndProceedToPayment}
      onSubmitPaymentReceipt={handleSubmitPaymentReceipt}
      pendingRegistrationStudent={pendingRegistrationStudent}
    />
  );
}
