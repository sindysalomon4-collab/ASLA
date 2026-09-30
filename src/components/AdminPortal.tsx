import React, { useMemo, useState } from 'react';
import {
  AcademicCertificate,
  ApprovalStatus,
  ASLA_GRADES,
  AttendanceRecord,
  AttendanceStatus,
  CertificateType,
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
  ExamPrepSubjectCode,
  ExamPrepSubjectConfig,
  ExamPrepTopic,
  GradeLevel,
  HonorsMention,
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
} from '../types';
import { TRANSLATIONS } from '../i18n/translations';
import { GRADE_COMPLEXITY_PROFILE } from '../data/syllabusMatrix';
import { generateBookForGradeAndSubject } from '../data/curriculumEngine';
import { AslaLogo } from './AslaLogo';
import { CertificateDiplomaView } from './CertificateDiplomaView';
import { AdminPaymentCenter } from './AdminPaymentCenter';
import {
  ExamPrepAdminTab,
  ExamPrepAdminWorkspace,
} from './ExamPrepAdminWorkspace';
import { Award, Eye, Menu, Plus, Check, X } from 'lucide-react';

export type AdminMenuSection =
  | 'Dashboard'
  | 'Preparasyon Egzamen Leta / Filo'
  | 'Students'
  | 'Parents'
  | 'Grades 7–12'
  | 'Classrooms'
  | 'Subjects'
  | 'Books'
  | 'Chapters'
  | 'Lessons'
  | 'Classwork'
  | 'Homework'
  | 'Quizzes'
  | 'Exams'
  | 'Grades'
  | 'Student Progress'
  | 'Certificates & Diplomas'
  | 'Attendance'
  | 'Payments'
  | 'Approvals'
  | 'Notifications'
  | 'Reports'
  | 'Files'
  | 'Settings';

const ADMIN_MENU_ITEMS: AdminMenuSection[] = [
  'Dashboard',
  'Preparasyon Egzamen Leta / Filo',
  'Students',
  'Parents',
  'Grades 7–12',
  'Classrooms',
  'Subjects',
  'Books',
  'Chapters',
  'Lessons',
  'Classwork',
  'Homework',
  'Quizzes',
  'Exams',
  'Grades',
  'Student Progress',
  'Certificates & Diplomas',
  'Attendance',
  'Payments',
  'Approvals',
  'Notifications',
  'Reports',
  'Files',
  'Settings',
];

interface AdminPortalProps {
  language: Language;
  onChangeLanguage: (lang: Language) => void;
  students: StudentAccount[];
  parents: ParentAccount[];
  classrooms: ClassroomRecord[];
  subjects: SubjectDefinition[];
  submissions: WorkSubmission[];
  attendance: AttendanceRecord[];
  payments: PaymentTransaction[];
  notifications: SchoolNotification[];
  files: SchoolFileResource[];
  settings: SchoolSettings;
  certificates: AcademicCertificate[];
  examPrepPrograms: ExamPrepProgram[];
  examPrepSubjects: ExamPrepSubjectConfig[];
  examPrepTopics: ExamPrepTopic[];
  examPrepQuestions: ExamPrepQuestion[];
  examPrepMockExams: ExamPrepMockExam[];
  examPrepMaterials: ExamPrepMaterial[];
  examPrepAttempts: ExamPrepAttempt[];
  examPrepPayments: ExamPrepPaymentRecord[];
  examPrepAuditLogs: ExamPrepAuditLog[];
  onUpdateExamPrepPaymentStatus: (
    paymentId: string,
    status: ExamPrepPaymentStatus,
    reason?: string
  ) => void;
  onUpdateStudentExamPrepEligibility: (
    studentId: string,
    studentType: ExamPrepStudentType,
    completedRequiredAslaCourses: boolean,
    accessStatus: ExamPrepAccessStatus,
    teacherRecommendation?: string
  ) => void;
  onToggleExamPrepSubjectEnabled: (subjectCode: ExamPrepSubjectCode) => void;
  onToggleExamPrepProgramSubject: (
    programId: string,
    subjectCode: ExamPrepSubjectCode
  ) => void;
  onAddExamPrepTopic: (topic: ExamPrepTopic) => void;
  onAddExamPrepQuestion: (question: ExamPrepQuestion) => void;
  onAddExamPrepMockExam: (mockExam: ExamPrepMockExam) => void;
  onAddExamPrepMaterial: (material: ExamPrepMaterial) => void;
  onIssueCertificate: (cert: AcademicCertificate) => void;
  onToggleCertificateStatus: (certId: string) => void;
  onUpdatePaymentStatus: (
    paymentId: string,
    status: PaymentStatus,
    rejectionReason?: string
  ) => void;
  onToggleReceiptsStatus: (
    source: 'TUITION' | 'EXAM_PREP',
    paymentId: string,
    aslaReceived: boolean,
    whatsappReceived: boolean
  ) => void;
  onVerifyPaymentRecord: (
    source: 'TUITION' | 'EXAM_PREP',
    paymentId: string
  ) => void;
  onUpdateStudentStatus: (studentId: string, approvalStatus: ApprovalStatus) => void;
  onUpdateStudentGradeAndClass: (
    studentId: string,
    grade: GradeLevel,
    classroom: string
  ) => void;
  onAddSubject: (newSubject: SubjectDefinition) => void;
  onAddClassroom: (newRoom: ClassroomRecord) => void;
  onGradeSubmission: (
    submissionId: string,
    score: number,
    letterGrade: string,
    feedback: string
  ) => void;
  onRecordAttendance: (record: Omit<AttendanceRecord, 'id'>) => void;
  onSendNotification: (notif: Omit<SchoolNotification, 'id' | 'date' | 'read'>) => void;
  onAddFileResource: (file: Omit<SchoolFileResource, 'id' | 'updatedAt'>) => void;
  onUpdateSettings: (newSettings: SchoolSettings) => void;
  onSignOut: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  language,
  onChangeLanguage,
  students,
  parents,
  classrooms,
  subjects,
  submissions,
  attendance,
  payments,
  notifications,
  files,
  settings,
  certificates,
  examPrepPrograms,
  examPrepSubjects,
  examPrepTopics,
  examPrepQuestions,
  examPrepMockExams,
  examPrepMaterials,
  examPrepAttempts,
  examPrepPayments,
  examPrepAuditLogs,
  onUpdateExamPrepPaymentStatus,
  onUpdateStudentExamPrepEligibility,
  onToggleExamPrepSubjectEnabled,
  onToggleExamPrepProgramSubject,
  onAddExamPrepTopic,
  onAddExamPrepQuestion,
  onAddExamPrepMockExam,
  onAddExamPrepMaterial,
  onIssueCertificate,
  onToggleCertificateStatus,
  onUpdatePaymentStatus,
  onToggleReceiptsStatus,
  onVerifyPaymentRecord,
  onUpdateStudentStatus,
  onUpdateStudentGradeAndClass,
  onAddSubject,
  onAddClassroom,
  onGradeSubmission,
  onRecordAttendance,
  onSendNotification,
  onAddFileResource,
  onUpdateSettings,
  onSignOut,
}) => {
  const t = TRANSLATIONS[language];

  const [activeMenu, setActiveMenu] = useState<AdminMenuSection>('Dashboard');
  const [examPrepInitialTab, setExamPrepInitialTab] =
    useState<ExamPrepAdminTab>('Preparation Dashboard');
  const [sidebarOpenDesktop, setSidebarOpenDesktop] = useState(true);
  const [sidebarOpenMobile, setSidebarOpenMobile] = useState(false);

  // Filter Grade across Admin views (strictly Grades 7–12)
  const [selectedGradeFilter, setSelectedGradeFilter] = useState<GradeLevel | 'ALL'>('ALL');
  const [managedGrade, setManagedGrade] = useState<GradeLevel>('Grade 9');

  // Receipt Modal & Rejection Reason State (Section 10)
  const [inspectedPayment, setInspectedPayment] = useState<PaymentTransaction | null>(null);
  const [rejectingPaymentId, setRejectingPaymentId] = useState<string | null>(null);
  const [rejectionReasonText, setRejectionReasonText] = useState('');

  // Add Subject State (Section 2: Admin can add/modify subjects without rebuilding)
  const [newSubjGrade, setNewSubjGrade] = useState<GradeLevel>('Grade 10');
  const [newSubjCode, setNewSubjCode] = useState('');
  const [newSubjNameHt, setNewSubjNameHt] = useState('');
  const [newSubjNameFr, setNewSubjNameFr] = useState('');
  const [newSubjNameEn, setNewSubjNameEn] = useState('');
  const [newSubjCategory, setNewSubjCategory] = useState<'STEM' | 'Humanities'>('STEM');
  const [newSubjDesc, setNewSubjDesc] = useState('');

  // Add Classroom State
  const [newRoomGrade, setNewRoomGrade] = useState<GradeLevel>('Grade 8');
  const [newRoomName, setNewRoomName] = useState('');
  const [newRoomNumber, setNewRoomNumber] = useState('');
  const [newRoomTeacher, setNewRoomTeacher] = useState('');

  // Book / Chapter / Lesson Inspector State
  const [bookInspectGrade, setBookInspectGrade] = useState<GradeLevel>('Grade 9');
  const [bookInspectSubjectId, setBookInspectSubjectId] = useState<string>('subj-g9-math');
  const [bookInspectChapterNum, setBookInspectChapterNum] = useState<number>(1);

  const inspectableSubjects = useMemo(
    () => subjects.filter((s) => s.grade === bookInspectGrade),
    [subjects, bookInspectGrade]
  );

  const activeInspectSubject = useMemo(
    () =>
      inspectableSubjects.find((s) => s.id === bookInspectSubjectId) ||
      inspectableSubjects[0] ||
      subjects[0],
    [inspectableSubjects, bookInspectSubjectId, subjects]
  );

  const inspectedBook = useMemo(
    () => generateBookForGradeAndSubject(bookInspectGrade, activeInspectSubject),
    [bookInspectGrade, activeInspectSubject]
  );

  const inspectedChapter = useMemo(
    () =>
      inspectedBook.chapters.find((c) => c.chapterNumber === bookInspectChapterNum) ||
      inspectedBook.chapters[0],
    [inspectedBook, bookInspectChapterNum]
  );

  // Attendance form state
  const [attStudentId, setAttStudentId] = useState(students[0]?.id || 'stu-1');
  const [attStatus, setAttStatus] = useState<AttendanceStatus>('Present');
  const [attNote, setAttNote] = useState('');

  // Notification form state
  const [notifRole, setNotifRole] = useState<'All' | 'Student' | 'Parent'>('All');
  const [notifCategory, setNotifCategory] = useState<SchoolNotification['category']>('Announcement');
  const [notifTitle, setNotifTitle] = useState('');
  const [notifMessage, setNotifMessage] = useState('');

  // Settings form state
  const [localSettings, setLocalSettings] = useState<SchoolSettings>(settings);
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Certificate & Diploma issuance state
  const [certStudentId, setCertStudentId] = useState<string>(students[5]?.id || students[0]?.id || 'stu-6');
  const [certType, setCertType] = useState<CertificateType>('High School Diploma');
  const [certSubjectName, setCertSubjectName] = useState<string>('Matematik (Mathematics)');
  const [certHonors, setCertHonors] = useState<HonorsMention>('Mention Excellence (Summa Cum Laude)');
  const [certScore, setCertScore] = useState<number>(95);
  const [certCitationCustom, setCertCitationCustom] = useState<string>('');
  const [inspectedCertificate, setInspectedCertificate] = useState<AcademicCertificate | null>(
    certificates[0] || null
  );

  const handleAdminIssueCertificate = (e: React.FormEvent) => {
    e.preventDefault();
    const stu = students.find((s) => s.id === certStudentId) || students[0];
    if (!stu) return;
    const gNum = stu.grade.replace('Grade ', '');
    const prefix =
      certType === 'High School Diploma'
        ? 'DIP'
        : certType === 'Grade Promotion'
        ? 'CERT'
        : 'SUBJ';

    const newCert: AcademicCertificate = {
      id: `cert-${Date.now()}`,
      serialNumber: `ASLA-${prefix}-2026-${gNum.padStart(2, '0')}${Math.floor(10 + Math.random() * 89)}-HT`,
      studentId: stu.id,
      studentName: stu.fullName,
      studentCode: stu.studentCode,
      grade: stu.grade,
      classroom: stu.classroom,
      certificateType: certType,
      subjectName: certType === 'Subject Accomplishment' ? certSubjectName : undefined,
      titleHt:
        certType === 'High School Diploma'
          ? `DIPLÒM FINISMAN ETID SEGONDÈ (${stu.grade.toUpperCase()})`
          : certType === 'Grade Promotion'
          ? `SÈTIFIKA AKONPLISMAN NIVO AKADEMIK — ${stu.grade.toUpperCase()}`
          : `SÈTIFIKA AKONPLISMAN PA MATYÈ — ${certSubjectName.toUpperCase()} (${stu.grade.toUpperCase()})`,
      titleFr:
        certType === 'High School Diploma'
          ? `DIPLÔME DE FIN D’ÉTUDES SECONDAIRES (${stu.grade.toUpperCase()})`
          : certType === 'Grade Promotion'
          ? `CERTIFICAT D’ACCOMPLISSEMENT ACADÉMIQUE — ${stu.grade.toUpperCase()}`
          : `CERTIFICAT D’ACCOMPLISSEMENT PAR MATIÈRE — ${certSubjectName.toUpperCase()}`,
      titleEn:
        certType === 'High School Diploma'
          ? `OFFICIAL HIGH SCHOOL GRADUATION DIPLOMA (${stu.grade.toUpperCase()})`
          : certType === 'Grade Promotion'
          ? `CERTIFICATE OF ACADEMIC ACCOMPLISHMENT — ${stu.grade.toUpperCase()}`
          : `SUBJECT CERTIFICATE OF ACCOMPLISHMENT — ${certSubjectName.toUpperCase()}`,
      citationHt:
        certCitationCustom.trim() ||
        `Dekore pa Direksyon Jeneral Aprantisaj se lò Akademi (ASLA) pou ekselans akademik, metriz pwogram ${stu.grade}, ak disiplin egzanplè pandan ane akademik ${settings.academicYear} la.`,
      citationFr:
        certCitationCustom.trim() ||
        `Décerné par la Direction Générale d’Aprantisaj se lò Akademi (ASLA) pour l’excellence académique et la maîtrise du programme officiel de ${stu.grade}.`,
      citationEn:
        certCitationCustom.trim() ||
        `Awarded by the General Administration of Aprantisaj se lò Akademi (ASLA) for academic excellence and mastery of the official ${stu.grade} curriculum.`,
      honors: certHonors,
      finalAverageScore: certScore,
      academicYear: settings.academicYear,
      issuedAt: new Date().toISOString().slice(0, 10),
      issuedBy: 'Sindy Salomon — Direktris Jeneral ASLA',
      status: 'Active',
    };

    onIssueCertificate(newCert);
    setInspectedCertificate(newCert);
    setCertCitationCustom('');
  };

  const filteredStudents = useMemo(
    () =>
      selectedGradeFilter === 'ALL'
        ? students
        : students.filter((s) => s.grade === selectedGradeFilter),
    [students, selectedGradeFilter]
  );

  const pendingPaymentsCount =
    payments.filter(
      (p) => p.status === 'Pending' || p.status === 'Pending Verification'
    ).length +
    examPrepPayments.filter((ep) => ep.status === 'Pending Verification').length;
  const pendingApprovalsCount = students.filter((s) => s.approvalStatus === 'Pending').length;

  const handleAddCustomSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubjNameHt.trim() || !newSubjCode.trim()) return;
    const gNum = newSubjGrade.replace('Grade ', '');
    const id = `subj-g${gNum}-${newSubjCode.trim().toLowerCase()}-${Date.now()}`;
    onAddSubject({
      id,
      code: `${newSubjCode.trim().toUpperCase()}-${gNum}`,
      nameHt: newSubjNameHt.trim(),
      nameFr: newSubjNameFr.trim() || newSubjNameHt.trim(),
      nameEn: newSubjNameEn.trim() || newSubjNameHt.trim(),
      category: newSubjCategory,
      grade: newSubjGrade,
      descriptionHt:
        newSubjDesc.trim() || `Kou ak liv akademik konplè (16 chapit, 96 leson) pou ${newSubjGrade}.`,
      descriptionFr: newSubjDesc.trim() || `Cours académique complet pour ${newSubjGrade}.`,
      descriptionEn: newSubjDesc.trim() || `Complete academic course for ${newSubjGrade}.`,
      weeklyHours: 4,
      coefficient: 3,
    });
    setNewSubjCode('');
    setNewSubjNameHt('');
    setNewSubjNameFr('');
    setNewSubjNameEn('');
    setNewSubjDesc('');
  };

  return (
    <div className="min-h-screen flex bg-[#F8FAFC] text-[#0F172A]">
      {/* Mobile Overlay Sidebar (with ✕ Close) */}
      {sidebarOpenMobile && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpenMobile(false)} />
          <aside className="relative z-10 w-72 bg-[#0B2545] text-white flex flex-col h-full overflow-y-auto">
            <div className="p-4 border-b border-white/15 flex items-center justify-between">
              <AslaLogo size="sm" theme="dark" subtitle="ADMINISTRASYON (7–12)" />
              <button
                onClick={() => setSidebarOpenMobile(false)}
                className="px-2.5 py-1 text-xs font-semibold bg-white/10 rounded cursor-pointer"
              >
                {t.close}
              </button>
            </div>
            <nav className="p-3 space-y-0.5 flex-1">
              {ADMIN_MENU_ITEMS.map((item) => (
                <button
                  key={item}
                  onClick={() => {
                    setActiveMenu(item);
                    setSidebarOpenMobile(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium cursor-pointer flex items-center justify-between ${
                    activeMenu === item
                      ? 'bg-[#B91C1C] text-white font-semibold'
                      : 'text-slate-200 hover:bg-white/10'
                  }`}
                >
                  <span>
                    {item === 'Payments'
                      ? '💳 Peman / Payments'
                      : item === 'Preparasyon Egzamen Leta / Filo'
                      ? '🎯 Preparasyon Egzamen Leta / Filo'
                      : item}
                  </span>
                  {item === 'Payments' && pendingPaymentsCount > 0 && (
                    <span className="font-mono text-[11px] text-amber-300">
                      ({pendingPaymentsCount})
                    </span>
                  )}
                  {item === 'Approvals' && pendingApprovalsCount > 0 && (
                    <span className="font-mono text-[11px] text-amber-300">
                      ({pendingApprovalsCount})
                    </span>
                  )}
                </button>
              ))}
            </nav>
            <div className="p-3 border-t border-white/15">
              <button
                onClick={onSignOut}
                className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-red-300 cursor-pointer"
              >
                {t.signOut}
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Desktop Collapsible Left Sidebar (All 23 Items) */}
      {sidebarOpenDesktop && (
        <aside className="hidden lg:flex w-64 shrink-0 bg-[#0B2545] text-white flex-col border-r border-slate-800">
          <div className="p-4 border-b border-white/15 flex items-center justify-between">
            <AslaLogo size="sm" theme="dark" subtitle="ADMINISTRASYON (7–12)" />
            <button
              onClick={() => setSidebarOpenDesktop(false)}
              className="px-2 py-1 text-xs text-slate-300 hover:text-white border border-white/20 rounded cursor-pointer"
              title="✕ Close"
            >
              ✕
            </button>
          </div>
          <nav className="p-3 space-y-0.5 flex-1 overflow-y-auto">
            {ADMIN_MENU_ITEMS.map((item) => (
              <button
                key={item}
                onClick={() => setActiveMenu(item)}
                className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer flex items-center justify-between ${
                  activeMenu === item
                    ? 'bg-[#B91C1C] text-white font-semibold'
                    : 'text-slate-200 hover:bg-white/10'
                }`}
              >
                <span>
                  {item === 'Payments'
                    ? '💳 Peman / Payments'
                    : item === 'Preparasyon Egzamen Leta / Filo'
                    ? '🎯 Preparasyon Egzamen Leta / Filo'
                    : item}
                </span>
                {item === 'Payments' && pendingPaymentsCount > 0 && (
                  <span className="font-mono text-[11px] text-amber-300">
                    ({pendingPaymentsCount})
                  </span>
                )}
                {item === 'Approvals' && pendingApprovalsCount > 0 && (
                  <span className="font-mono text-[11px] text-amber-300">
                    ({pendingApprovalsCount})
                  </span>
                )}
              </button>
            ))}
          </nav>
          <div className="p-3 border-t border-white/15">
            <button
              onClick={onSignOut}
              className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-red-200 hover:bg-white/10 cursor-pointer"
            >
              {t.signOut}
            </button>
          </div>
        </aside>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar Contract */}
        <header className="sticky top-0 z-20 bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpenMobile(true)}
              className="lg:hidden p-2 text-slate-700 border border-slate-300 rounded-lg cursor-pointer"
            >
              <Menu className="w-4 h-4" />
            </button>
            {!sidebarOpenDesktop && (
              <button
                onClick={() => setSidebarOpenDesktop(true)}
                className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#0B2545] border border-slate-300 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <Menu className="w-3.5 h-3.5" />
                <span>Menu</span>
              </button>
            )}
            <span className="text-base font-bold text-[#0B2545] font-display whitespace-nowrap">
              Aprantisaj se lò Akademi (ASLA) Administration · {activeMenu}
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="hidden md:flex items-center gap-0.5 p-1 bg-slate-100 rounded-lg border border-slate-200">
              {(['ht', 'fr', 'en'] as Language[]).map((lang) => (
                <button
                  key={lang}
                  onClick={() => onChangeLanguage(lang)}
                  className={`px-2 py-0.5 text-xs font-semibold rounded cursor-pointer ${
                    language === lang ? 'bg-[#0B2545] text-white' : 'text-slate-600'
                  }`}
                >
                  {lang.toUpperCase()}
                </button>
              ))}
            </div>
            {activeMenu !== 'Dashboard' && (
              <button
                onClick={() => setActiveMenu('Dashboard')}
                className="px-3 py-1.5 text-xs font-semibold text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-100 cursor-pointer whitespace-nowrap"
              >
                {t.back}
              </button>
            )}
            <button
              onClick={onSignOut}
              className="px-3 py-1.5 text-xs font-semibold text-red-700 border border-red-200 rounded-lg hover:bg-red-50 cursor-pointer whitespace-nowrap"
            >
              {t.signOut}
            </button>
          </div>
        </header>

        <main className="flex-1 p-6 max-w-7xl w-full mx-auto space-y-6">
          {/* 1. ADMIN DASHBOARD */}
          {activeMenu === 'Dashboard' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-semibold text-[#B91C1C]">
                    SANT ADMINISTRASYON JENERAL ASLA · ADMINISTRATÈ : SINDY SALOMON
                  </div>
                  <h1 className="text-2xl font-bold text-[#0B2545] mt-1">
                    Direksyon Akademik & Verifikasyon Pèman ({settings.academicYear})
                  </h1>
                  <p className="text-xs text-slate-600 mt-1">
                    Jere chak nivo (Grade 7 rive Grade 12) endepandamman, verifye resi 15,000 HTG yo, epi apwouve elèv yo.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2.5">
                  <button
                    onClick={() => {
                      setExamPrepInitialTab('Payments');
                      setActiveMenu('Preparasyon Egzamen Leta / Filo');
                    }}
                    className="px-4 py-2.5 text-xs font-bold bg-[#FACC15] text-[#0B2545] rounded-lg hover:bg-[#EAB308] cursor-pointer whitespace-nowrap"
                  >
                    🎯 Examen Leta / Filo (500 / 2,000 HTG)
                  </button>
                  <button
                    onClick={() => setActiveMenu('Payments')}
                    className="px-4 py-2.5 text-xs font-semibold bg-[#B91C1C] text-white rounded-lg hover:bg-[#991B1B] cursor-pointer whitespace-nowrap"
                  >
                    💳 Peman / Payments ({pendingPaymentsCount} Pending)
                  </button>
                  <button
                    onClick={() => setActiveMenu('Approvals')}
                    className="px-4 py-2.5 text-xs font-semibold bg-[#0B2545] text-white rounded-lg hover:bg-[#133B6E] cursor-pointer whitespace-nowrap"
                  >
                    Apwobasyon Elèv ({pendingApprovalsCount} Pending)
                  </button>
                </div>
              </div>

              {/* Core Admin KPIs */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 tabular-nums">
                <div className="bg-white p-5 rounded-xl border border-slate-200">
                  <div className="text-xs text-slate-500">Elèv Enskri (Grades 7–12)</div>
                  <div className="text-2xl font-bold text-[#0B2545] font-mono mt-1">
                    {students.length} Elèv
                  </div>
                  <div className="text-xs text-amber-700 mt-1">
                    ▲ {pendingApprovalsCount} ap tann apwobasyon
                  </div>
                </div>
                <div className="bg-white p-5 rounded-xl border border-slate-200">
                  <div className="text-xs text-slate-500">Pèman 15,000 HTG</div>
                  <div className="text-2xl font-bold text-[#0B2545] font-mono mt-1">
                    {payments
                      .filter((p) => p.status === 'Approved')
                      .reduce((sum, p) => sum + p.amountHtg, 0)
                      .toLocaleString()}{' '}
                    HTG
                  </div>
                  <div className="text-xs text-amber-700 mt-1">
                    ▲ {pendingPaymentsCount} resi pou verifye
                  </div>
                </div>
                <div className="bg-white p-5 rounded-xl border border-slate-200">
                  <div className="text-xs text-slate-500">Bibliyotèk Liv Akademik</div>
                  <div className="text-2xl font-bold text-[#0B2545] font-mono mt-1">
                    {subjects.length} Liv Konplè
                  </div>
                  <div className="text-xs text-emerald-700 mt-1">
                    ● {subjects.length * 16} Chapit · {subjects.length * 96} Leson
                  </div>
                </div>
                <div className="bg-white p-5 rounded-xl border border-slate-200">
                  <div className="text-xs text-slate-500">Sal Klas Grades 7–12</div>
                  <div className="text-2xl font-bold text-[#0B2545] font-mono mt-1">
                    {classrooms.length} Sal Klas
                  </div>
                  <div className="text-xs text-slate-600 mt-1">6 Nivo Akademik Ofisyèl</div>
                </div>
              </div>

              {/* Independent Grades 7–12 Breakdown Grid */}
              <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-bold text-[#0B2545]">
                    Jesyon Endepandan Nivo Akademik yo (Grades 7–12 Sèlman)
                  </h2>
                  <button
                    onClick={() => setActiveMenu('Grades 7–12')}
                    className="text-xs font-semibold text-[#0B2545] underline cursor-pointer"
                  >
                    Louvri Sant Grades 7–12 →
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 tabular-nums">
                  {ASLA_GRADES.map((g) => {
                    const gStudents = students.filter((s) => s.grade === g);
                    const gSubjects = subjects.filter((s) => s.grade === g);
                    const gRooms = classrooms.filter((c) => c.grade === g);
                    return (
                      <div
                        key={g}
                        onClick={() => {
                          setManagedGrade(g);
                          setActiveMenu('Grades 7–12');
                        }}
                        className="p-4 rounded-xl bg-[#F8FAFC] border border-slate-200 hover:border-[#0B2545] transition-colors cursor-pointer space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-base font-bold text-[#0B2545]">{g}</span>
                          <span className="text-xs font-mono text-[#B91C1C] font-semibold">
                            {GRADE_COMPLEXITY_PROFILE[g].haitianEquivalent}
                          </span>
                        </div>
                        <div className="text-xs text-slate-600 flex items-center gap-2">
                          <span>{gStudents.length} Elèv</span>
                          <span>·</span>
                          <span>{gRooms.length} Sal Klas</span>
                          <span>·</span>
                          <span>{gSubjects.length} Liv (96 leson/liv)</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* 2. ASLA PAYMENT CENTER (💳 Peman / Payments: Two-Receipt Verification + Mandatory Confirmation Modal) */}
          {activeMenu === 'Payments' && (
            <AdminPaymentCenter
              students={students}
              tuitionPayments={payments}
              examPrepPayments={examPrepPayments}
              onToggleReceiptsStatus={onToggleReceiptsStatus}
              onVerifyPaymentRecord={onVerifyPaymentRecord}
              onApproveTuitionPayment={(paymentId) =>
                onUpdatePaymentStatus(paymentId, 'Approved')
              }
              onRejectOrCorrectTuitionPayment={(paymentId, status, reason) =>
                onUpdatePaymentStatus(paymentId, status, reason)
              }
              onUpdateExamPrepPaymentStatus={onUpdateExamPrepPaymentStatus}
            />
          )}

          {/* 3. STUDENT APPROVALS & STUDENTS MANAGEMENT (Section 11) */}
          {(activeMenu === 'Approvals' || activeMenu === 'Students') && (
            <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <div className="text-xs font-semibold text-[#B91C1C]">
                    APWOBASYON AK JESYON ELÈV (GRADES 7–12)
                  </div>
                  <h2 className="text-xl font-bold text-[#0B2545] mt-0.5">
                    Kontwòl Stati Elèv : Pending · Approved · Rejected · Suspended · Active
                  </h2>
                </div>

                {/* Grade 7–12 Filter */}
                <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-100 rounded-lg border border-slate-200">
                  <button
                    onClick={() => setSelectedGradeFilter('ALL')}
                    className={`px-2.5 py-1 text-xs font-semibold rounded cursor-pointer ${
                      selectedGradeFilter === 'ALL' ? 'bg-[#0B2545] text-white' : 'text-slate-700'
                    }`}
                  >
                    Tout (7–12)
                  </button>
                  {ASLA_GRADES.map((g) => (
                    <button
                      key={g}
                      onClick={() => setSelectedGradeFilter(g)}
                      className={`px-2.5 py-1 text-xs font-semibold rounded cursor-pointer ${
                        selectedGradeFilter === g ? 'bg-[#0B2545] text-white' : 'text-slate-700'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs tabular-nums">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500">
                      <th className="py-3 px-2.5">Kòd & Non Elèv</th>
                      <th className="py-3 px-2.5">Nivo (Grades 7–12)</th>
                      <th className="py-3 px-2.5">Sal Klas</th>
                      <th className="py-3 px-2.5">Paran / Kontak</th>
                      <th className="py-3 px-2.5">Pèman 15,000 HTG</th>
                      <th className="py-3 px-2.5">Stati Elèv</th>
                      <th className="py-3 px-2.5 text-right">Chanje Stati Apwobasyon</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredStudents.map((stu) => (
                      <tr key={stu.id} className="hover:bg-slate-50">
                        <td className="py-3 px-2.5">
                          <div className="font-bold text-[#0B2545]">{stu.fullName}</div>
                          <div className="font-mono text-slate-500">{stu.studentCode}</div>
                        </td>
                        <td className="py-3 px-2.5">
                          <select
                            value={stu.grade}
                            onChange={(e) => {
                              const newG = e.target.value as GradeLevel;
                              const defaultRoom =
                                classrooms.find((c) => c.grade === newG)?.name ||
                                `${newG} — Sal A`;
                              onUpdateStudentGradeAndClass(stu.id, newG, defaultRoom);
                            }}
                            className="px-2 py-1 text-xs font-semibold rounded border border-slate-300 bg-white text-[#0B2545]"
                          >
                            {ASLA_GRADES.map((g) => (
                              <option key={g} value={g}>
                                {g}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="py-3 px-2.5">{stu.classroom}</td>
                        <td className="py-3 px-2.5">
                          <div>{stu.parentName}</div>
                          <div className="text-slate-500">{stu.parentContact}</div>
                        </td>
                        <td className="py-3 px-2.5 font-mono font-bold">{stu.paymentStatus}</td>
                        <td className="py-3 px-2.5 font-bold">
                          <span
                            className={
                              stu.approvalStatus === 'Approved' || stu.approvalStatus === 'Active'
                                ? 'text-emerald-700'
                                : stu.approvalStatus === 'Pending'
                                ? 'text-amber-700'
                                : 'text-red-700'
                            }
                          >
                            ● {stu.approvalStatus}
                          </span>
                        </td>
                        <td className="py-3 px-2.5 text-right">
                          <select
                            value={stu.approvalStatus}
                            onChange={(e) =>
                              onUpdateStudentStatus(stu.id, e.target.value as ApprovalStatus)
                            }
                            className="px-2.5 py-1 text-xs font-semibold rounded border border-slate-300 bg-white"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Approved">Approved</option>
                            <option value="Active">Active</option>
                            <option value="Rejected">Rejected</option>
                            <option value="Suspended">Suspended</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 4. PARENTS */}
          {activeMenu === 'Parents' && (
            <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
              <h2 className="text-xl font-bold text-[#0B2545]">
                Lis Paran ak Responsab Elèv ASLA (Grades 7–12)
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs tabular-nums">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500">
                      <th className="py-3 px-3">Non Paran</th>
                      <th className="py-3 px-3">Imèl</th>
                      <th className="py-3 px-3">Telefòn</th>
                      <th className="py-3 px-3">Timoun ki Asosye (Grades 7–12)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {parents.map((par) => {
                      const kids = students.filter(
                        (s) => par.childrenIds.includes(s.id) || s.parentId === par.id
                      );
                      return (
                        <tr key={par.id}>
                          <td className="py-3 px-3 font-bold text-[#0B2545]">{par.fullName}</td>
                          <td className="py-3 px-3 font-mono">{par.email}</td>
                          <td className="py-3 px-3 font-mono">{par.phone}</td>
                          <td className="py-3 px-3">
                            {kids.map((k) => `${k.fullName} (${k.grade})`).join(' · ')}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 5. INDEPENDENT GRADES 7–12 MANAGEMENT */}
          {activeMenu === 'Grades 7–12' && (
            <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <div className="text-xs font-semibold text-[#B91C1C]">
                    JESYON ENDEPANDAN CHAK NIVO AKADEMIK (GRADES 7–12)
                  </div>
                  <h2 className="text-xl font-bold text-[#0B2545] mt-0.5">
                    {managedGrade} — {GRADE_COMPLEXITY_PROFILE[managedGrade].haitianEquivalent}
                  </h2>
                </div>
                <div className="flex flex-wrap gap-1 p-1 bg-slate-100 rounded-lg border border-slate-200">
                  {ASLA_GRADES.map((g) => (
                    <button
                      key={g}
                      onClick={() => setManagedGrade(g)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded cursor-pointer ${
                        managedGrade === g ? 'bg-[#0B2545] text-white' : 'text-slate-700'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-[#F8FAFC] border border-slate-200">
                  <div className="text-slate-500">Elèv nan {managedGrade}</div>
                  <div className="text-xl font-bold text-[#0B2545] font-mono mt-1">
                    {students.filter((s) => s.grade === managedGrade).length} Elèv
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-[#F8FAFC] border border-slate-200">
                  <div className="text-slate-500">Sal Klas nan {managedGrade}</div>
                  <div className="text-xl font-bold text-[#0B2545] font-mono mt-1">
                    {classrooms.filter((c) => c.grade === managedGrade).length} Sal Klas
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-[#F8FAFC] border border-slate-200">
                  <div className="text-slate-500">Matyè & Liv Akademik ({managedGrade})</div>
                  <div className="text-xl font-bold text-[#0B2545] font-mono mt-1">
                    {subjects.filter((s) => s.grade === managedGrade).length} Liv (
                    {GRADE_COMPLEXITY_PROFILE[managedGrade].targetPages} paj/liv)
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-bold text-[#0B2545]">
                  Matyè ak Liv Akademik Ofisyèl pou {managedGrade} :
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {subjects
                    .filter((s) => s.grade === managedGrade)
                    .map((subj) => (
                      <div
                        key={subj.id}
                        className="p-4 rounded-xl border border-slate-200 bg-[#F8FAFC] space-y-2"
                      >
                        <div className="text-xs font-mono text-slate-500">
                          {subj.code} · Koef. {subj.coefficient}
                        </div>
                        <div className="text-sm font-bold text-[#0B2545]">{subj.nameHt}</div>
                        <p className="text-xs text-slate-600">{subj.descriptionHt}</p>
                        <button
                          onClick={() => {
                            setBookInspectGrade(managedGrade);
                            setBookInspectSubjectId(subj.id);
                            setActiveMenu('Books');
                          }}
                          className="text-xs font-semibold text-[#B91C1C] underline cursor-pointer"
                        >
                          Enspekte Liv (16 Chapit · 96 Leson) →
                        </button>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}

          {/* 6. CLASSROOMS */}
          {activeMenu === 'Classrooms' && (
            <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6">
              <h2 className="text-xl font-bold text-[#0B2545]">
                Jesyon Sal Klas ASLA (Grades 7–12)
              </h2>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!newRoomName.trim()) return;
                  onAddClassroom({
                    id: `cls-${Date.now()}`,
                    grade: newRoomGrade,
                    name: newRoomName.trim(),
                    roomNumber: newRoomNumber.trim() || 'Paviyon Segondè',
                    homeroomTeacher: newRoomTeacher.trim() || 'Pwof. ASLA',
                    academicYear: settings.academicYear,
                    capacity: 30,
                    scheduleSummary: 'Lendi – Vandredi · 07:30 – 15:00',
                  });
                  setNewRoomName('');
                  setNewRoomNumber('');
                  setNewRoomTeacher('');
                }}
                className="p-4 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs"
              >
                <select
                  value={newRoomGrade}
                  onChange={(e) => setNewRoomGrade(e.target.value as GradeLevel)}
                  className="px-3 py-2 rounded-lg border border-slate-300 bg-white font-semibold"
                >
                  {ASLA_GRADES.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  value={newRoomName}
                  onChange={(e) => setNewRoomName(e.target.value)}
                  placeholder="Non Sal Klas (egz. 9yèm B — Pétion)"
                  className="px-3 py-2 rounded-lg border border-slate-300 bg-white"
                />
                <input
                  type="text"
                  value={newRoomTeacher}
                  onChange={(e) => setNewRoomTeacher(e.target.value)}
                  placeholder="Pwofesè Titilè"
                  className="px-3 py-2 rounded-lg border border-slate-300 bg-white"
                />
                <button
                  type="submit"
                  className="px-4 py-2 font-semibold bg-[#0B2545] text-white rounded-lg cursor-pointer"
                >
                  + Ajoute Sal Klas
                </button>
              </form>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {classrooms.map((cls) => (
                  <div
                    key={cls.id}
                    className="p-4 rounded-xl border border-slate-200 bg-[#F8FAFC] space-y-1.5 text-xs"
                  >
                    <div className="font-mono font-bold text-[#B91C1C]">{cls.grade}</div>
                    <div className="text-base font-bold text-[#0B2545]">{cls.name}</div>
                    <div className="text-slate-600">Sal : {cls.roomNumber}</div>
                    <div className="text-slate-600">Titilè : {cls.homeroomTeacher}</div>
                    <div className="text-slate-500">{cls.scheduleSummary}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 7. SUBJECTS (Add or Modify Subjects dynamically without rebuilding) */}
          {activeMenu === 'Subjects' && (
            <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6">
              <div>
                <h2 className="text-xl font-bold text-[#0B2545]">
                  Katalog Matyè Grades 7–12 ({subjects.length} Matyè Aktif)
                </h2>
                <p className="text-xs text-slate-600">
                  Administrasyon an ka ajoute nouvo matyè nan nenpòt nivo (Grade 7–12) san rekonstrwi aplikasyon an.
                </p>
              </div>

              <form
                onSubmit={handleAddCustomSubject}
                className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-4 text-xs"
              >
                <h3 className="font-bold text-[#0B2545]">
                  + Ajoute yon Nouvo Matyè nan Katalog ASLA a :
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <select
                    value={newSubjGrade}
                    onChange={(e) => setNewSubjGrade(e.target.value as GradeLevel)}
                    className="px-3 py-2 rounded-lg border border-slate-300 bg-white font-semibold"
                  >
                    {ASLA_GRADES.map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={newSubjCode}
                    onChange={(e) => setNewSubjCode(e.target.value)}
                    placeholder="Kòd (egz. ESP, PHILO, ECON)"
                    className="px-3 py-2 rounded-lg border border-slate-300 bg-white"
                    required
                  />
                  <select
                    value={newSubjCategory}
                    onChange={(e) => setNewSubjCategory(e.target.value as 'STEM' | 'Humanities')}
                    className="px-3 py-2 rounded-lg border border-slate-300 bg-white"
                  >
                    <option value="STEM">STEM (Syans & Matematik)</option>
                    <option value="Humanities">Humanities (Lèt, Lang & Syans Sosyal)</option>
                  </select>
                  <input
                    type="text"
                    value={newSubjNameHt}
                    onChange={(e) => setNewSubjNameHt(e.target.value)}
                    placeholder="Non Matyè (egz. Español / Ekonomi)"
                    className="px-3 py-2 rounded-lg border border-slate-300 bg-white"
                    required
                  />
                  <input
                    type="text"
                    value={newSubjDesc}
                    onChange={(e) => setNewSubjDesc(e.target.value)}
                    placeholder="Deskripsyon pwogram matyè a..."
                    className="px-3 py-2 rounded-lg border border-slate-300 bg-white sm:col-span-2"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 font-semibold bg-[#0B2545] text-white rounded-lg cursor-pointer"
                >
                  Ajoute Matyè & Jenere Liv Akademik li (16 Chapit · 96 Leson)
                </button>
              </form>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {subjects.map((subj) => (
                  <div
                    key={subj.id}
                    className="p-4 rounded-xl border border-slate-200 bg-[#F8FAFC] space-y-1 text-xs"
                  >
                    <div className="font-mono text-slate-500">
                      {subj.grade} · {subj.code}
                    </div>
                    <div className="text-sm font-bold text-[#0B2545]">{subj.nameHt}</div>
                    <p className="text-slate-600 line-clamp-2">{subj.descriptionHt}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 8. BOOKS, CHAPTERS & LESSONS INSPECTOR */}
          {(activeMenu === 'Books' || activeMenu === 'Chapters' || activeMenu === 'Lessons') && (
            <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <div className="text-xs font-semibold text-[#B91C1C]">
                    BIBLIYOTÈK AKADEMIK OFISYÈL ASLA (90–150 PAJ · 16 CHAPIT · 96 LESON PA LIV)
                  </div>
                  <h2 className="text-xl font-bold text-[#0B2545] mt-0.5">{inspectedBook.title}</h2>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <select
                    value={bookInspectGrade}
                    onChange={(e) => {
                      const g = e.target.value as GradeLevel;
                      setBookInspectGrade(g);
                      const firstSubj = subjects.find((s) => s.grade === g);
                      if (firstSubj) setBookInspectSubjectId(firstSubj.id);
                    }}
                    className="px-3 py-2 text-xs font-semibold rounded-lg border border-slate-300 bg-white"
                  >
                    {ASLA_GRADES.map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </select>
                  <select
                    value={activeInspectSubject.id}
                    onChange={(e) => setBookInspectSubjectId(e.target.value)}
                    className="px-3 py-2 text-xs font-semibold rounded-lg border border-slate-300 bg-white"
                  >
                    {inspectableSubjects.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.nameHt}
                      </option>
                    ))}
                  </select>
                  <select
                    value={bookInspectChapterNum}
                    onChange={(e) => setBookInspectChapterNum(Number(e.target.value))}
                    className="px-3 py-2 text-xs font-semibold rounded-lg border border-slate-300 bg-white"
                  >
                    {inspectedBook.chapters.map((ch) => (
                      <option key={ch.id} value={ch.chapterNumber}>
                        Chapit {ch.chapterNumber} / {inspectedBook.chapters.length}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                <div className="font-bold text-[#0B2545] text-sm">
                  {inspectedChapter.title} (Paj {inspectedChapter.pageStart}–
                  {inspectedChapter.pageEnd})
                </div>
                <p className="text-slate-700">{inspectedChapter.overview}</p>
              </div>

              <div className="space-y-4">
                {inspectedChapter.lessons.map((ls) => (
                  <div
                    key={ls.id}
                    className="p-5 rounded-xl border border-slate-200 bg-[#F8FAFC] space-y-3 text-xs"
                  >
                    <div className="flex items-center justify-between font-mono text-slate-500">
                      <span>
                        Leson {inspectedChapter.chapterNumber}.{ls.lessonNumber} · Paj{' '}
                        {ls.pageStart}–{ls.pageEnd}
                      </span>
                      <span>
                        {ls.classworkExercises.length} Classwork ·{' '}
                        {ls.homeworkAssignment.questions.length} Homework
                      </span>
                    </div>
                    <h4 className="text-base font-bold text-[#0B2545]">{ls.title}</h4>
                    <p className="text-slate-700 leading-relaxed">{ls.detailedExplanation[0]}</p>
                    <div className="p-3 rounded-lg bg-white border border-slate-200">
                      <strong>Egzanp 1 :</strong> {ls.examples[0]?.scenario} →{' '}
                      <span className="text-emerald-800 font-semibold">
                        {ls.examples[0]?.conclusion}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 9. CLASSWORK, HOMEWORK, QUIZZES, EXAMS, GRADES & STUDENT PROGRESS */}
          {[
            'Classwork',
            'Homework',
            'Quizzes',
            'Exams',
            'Grades',
            'Student Progress',
          ].includes(activeMenu) && (
            <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-5">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-xl font-bold text-[#0B2545]">
                  Jesyon Travay, Devwa, Quiz, Egzamen ak Nòt ({activeMenu})
                </h2>
                <p className="text-xs text-slate-600">
                  Konsilte ak korije soumisyon elèv Grades 7–12 yo.
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs tabular-nums">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500">
                      <th className="py-3 px-2.5">Dat</th>
                      <th className="py-3 px-2.5">Elèv</th>
                      <th className="py-3 px-2.5">Klas</th>
                      <th className="py-3 px-2.5">Matyè & Tip</th>
                      <th className="py-3 px-2.5">Tit Travay la</th>
                      <th className="py-3 px-2.5">Stati</th>
                      <th className="py-3 px-2.5 text-right">Nòt / Aksyon</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {submissions.map((sub) => (
                      <tr key={sub.id}>
                        <td className="py-3 px-2.5 font-mono">{sub.submittedAt}</td>
                        <td className="py-3 px-2.5 font-bold text-[#0B2545]">
                          {sub.studentName}
                        </td>
                        <td className="py-3 px-2.5">{sub.grade}</td>
                        <td className="py-3 px-2.5">
                          {sub.subjectName} · <strong>{sub.workType}</strong>
                        </td>
                        <td className="py-3 px-2.5">{sub.title}</td>
                        <td className="py-3 px-2.5 font-bold text-emerald-700">
                          {sub.status}
                        </td>
                        <td className="py-3 px-2.5 text-right font-mono">
                          {sub.score !== null ? (
                            <span className="font-bold text-[#0B2545]">
                              {sub.score}/100 ({sub.letterGrade})
                            </span>
                          ) : (
                            <button
                              onClick={() =>
                                onGradeSubmission(
                                  sub.id,
                                  92,
                                  'A',
                                  'Korije ak valide pa Direksyon Akademik ASLA.'
                                )
                              }
                              className="px-2.5 py-1 text-xs font-semibold bg-[#0B2545] text-white rounded cursor-pointer"
                            >
                              Note 92/100 (A)
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 10. ATTENDANCE */}
          {activeMenu === 'Attendance' && (
            <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6">
              <h2 className="text-xl font-bold text-[#0B2545]">
                Kontwòl Prezans Elèv (Present · Absent · Late · Excused)
              </h2>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const st = students.find((s) => s.id === attStudentId) || students[0];
                  onRecordAttendance({
                    studentId: st.id,
                    studentName: st.fullName,
                    grade: st.grade,
                    classroom: st.classroom,
                    date: new Date().toISOString().slice(0, 10),
                    status: attStatus,
                    note: attNote.trim() || 'Anrejistre pa Administrasyon ASLA',
                  });
                  setAttNote('');
                }}
                className="p-4 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs"
              >
                <select
                  value={attStudentId}
                  onChange={(e) => setAttStudentId(e.target.value)}
                  className="px-3 py-2 rounded-lg border border-slate-300 bg-white font-semibold"
                >
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.fullName} ({s.grade})
                    </option>
                  ))}
                </select>
                <select
                  value={attStatus}
                  onChange={(e) => setAttStatus(e.target.value as AttendanceStatus)}
                  className="px-3 py-2 rounded-lg border border-slate-300 bg-white font-semibold"
                >
                  <option value="Present">Present (Prezan)</option>
                  <option value="Absent">Absent (Absan)</option>
                  <option value="Late">Late (An Reta)</option>
                  <option value="Excused">Excused (Eskize)</option>
                </select>
                <input
                  type="text"
                  value={attNote}
                  onChange={(e) => setAttNote(e.target.value)}
                  placeholder="Obsèvasyon..."
                  className="px-3 py-2 rounded-lg border border-slate-300 bg-white"
                />
                <button
                  type="submit"
                  className="px-4 py-2 font-semibold bg-[#0B2545] text-white rounded-lg cursor-pointer"
                >
                  + Anrejistre Prezans
                </button>
              </form>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs tabular-nums">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500">
                      <th className="py-3 px-3">Dat</th>
                      <th className="py-3 px-3">Elèv</th>
                      <th className="py-3 px-3">Klas</th>
                      <th className="py-3 px-3">Stati</th>
                      <th className="py-3 px-3">Nòt</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {attendance.map((a) => (
                      <tr key={a.id}>
                        <td className="py-3 px-3 font-mono">{a.date}</td>
                        <td className="py-3 px-3 font-bold text-[#0B2545]">{a.studentName}</td>
                        <td className="py-3 px-3">{a.grade}</td>
                        <td className="py-3 px-3 font-bold">{a.status}</td>
                        <td className="py-3 px-3 text-slate-600">{a.note}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 11. NOTIFICATIONS */}
          {activeMenu === 'Notifications' && (
            <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6">
              <h2 className="text-xl font-bold text-[#0B2545]">
                Voye Notifikasyon & Anons Ofisyèl ASLA
              </h2>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!notifTitle.trim() || !notifMessage.trim()) return;
                  onSendNotification({
                    targetRole: notifRole,
                    category: notifCategory,
                    title: notifTitle.trim(),
                    message: notifMessage.trim(),
                  });
                  setNotifTitle('');
                  setNotifMessage('');
                }}
                className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 text-xs"
              >
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <select
                    value={notifRole}
                    onChange={(e) => setNotifRole(e.target.value as any)}
                    className="px-3 py-2 rounded-lg border border-slate-300 bg-white font-semibold"
                  >
                    <option value="All">Tout Lekòl la (Elèv & Paran)</option>
                    <option value="Student">Elèv Sèlman</option>
                    <option value="Parent">Paran Sèlman</option>
                  </select>
                  <select
                    value={notifCategory}
                    onChange={(e) => setNotifCategory(e.target.value as any)}
                    className="px-3 py-2 rounded-lg border border-slate-300 bg-white font-semibold"
                  >
                    <option value="Announcement">School Announcement</option>
                    <option value="Exam">New Exam</option>
                    <option value="Homework">New Homework</option>
                    <option value="Payment">Payment Reminder</option>
                  </select>
                  <input
                    type="text"
                    value={notifTitle}
                    onChange={(e) => setNotifTitle(e.target.value)}
                    placeholder="Tit Notifikasyon an..."
                    className="px-3 py-2 rounded-lg border border-slate-300 bg-white"
                    required
                  />
                </div>
                <textarea
                  rows={2}
                  value={notifMessage}
                  onChange={(e) => setNotifMessage(e.target.value)}
                  placeholder="Mesaj ofisyèl pou elèv ak paran yo..."
                  className="w-full p-3 rounded-lg border border-slate-300 bg-white"
                  required
                />
                <button
                  type="submit"
                  className="px-4 py-2 font-semibold bg-[#B91C1C] text-white rounded-lg cursor-pointer"
                >
                  Pibliye Notifikasyon
                </button>
              </form>

              <div className="space-y-2.5">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className="p-4 rounded-xl bg-[#F8FAFC] border border-slate-200 text-xs space-y-1"
                  >
                    <div className="flex justify-between font-mono text-slate-500">
                      <span>
                        {n.category} → {n.targetRole}
                      </span>
                      <span>{n.date}</span>
                    </div>
                    <div className="font-bold text-[#0B2545]">{n.title}</div>
                    <p className="text-slate-700">{n.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 12. REPORTS & FILES */}
          {(activeMenu === 'Reports' || activeMenu === 'Files') && (
            <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6">
              <h2 className="text-xl font-bold text-[#0B2545]">
                Rapò Akademik, Finansye ak Fichye Ofisyèl ASLA ({activeMenu})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {files.map((f) => (
                  <div
                    key={f.id}
                    className="p-4 rounded-xl bg-[#F8FAFC] border border-slate-200 space-y-1.5 text-xs"
                  >
                    <div className="font-mono text-slate-500">
                      {f.category} · {f.grade} · {f.sizeLabel}
                    </div>
                    <div className="text-sm font-bold text-[#0B2545]">{f.title}</div>
                    <p className="text-slate-600">{f.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 12B. CERTIFICATES & DIPLOMAS MANAGEMENT */}
          {activeMenu === 'Certificates & Diplomas' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-5 print:hidden">
                <div className="border-b border-slate-100 pb-4 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold text-[#B91C1C]">
                      BIWO DIPLÒM AK SÈTIFIKA AKONPLISMAN ASLA (GRADES 7–12)
                    </p>
                    <h2 className="text-2xl font-bold text-[#0B2545] mt-0.5">
                      Emisyon Sètifika Akonplisman & Diplòm Ofisyèl
                    </h2>
                    <p className="text-xs text-slate-600 mt-1">
                      Administratèanchèf <strong>Sindy Salomon</strong> ka delivre Diplòm Finisman Etid (Grade 12), Sètifika Reyisit Nivo (Grades 7–12), oswa Sètifika Ekselans pa Matyè.
                    </p>
                  </div>
                  <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-[#0B3B75]">
                    <Award className="w-4 h-4 text-[#D97706]" />
                    <span>Total Delivre : {certificates.length}</span>
                  </div>
                </div>

                {/* Form to Issue New Certificate / Diploma */}
                <form
                  onSubmit={handleAdminIssueCertificate}
                  className="p-5 rounded-xl bg-[#F8FAFC] border border-slate-200 space-y-4 text-xs"
                >
                  <h3 className="text-sm font-bold text-[#0B2545]">
                    + Delivre yon Nouvo Sètifika oswa Diplòm Ofisyèl
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Chwazi Elèv (Grades 7–12) *
                      </label>
                      <select
                        value={certStudentId}
                        onChange={(e) => setCertStudentId(e.target.value)}
                        className="w-full p-2.5 rounded-lg border border-slate-300 bg-white font-semibold"
                      >
                        {students.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.fullName} ({s.grade})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Tip Dokiman Ofisyèl *
                      </label>
                      <select
                        value={certType}
                        onChange={(e) => setCertType(e.target.value as CertificateType)}
                        className="w-full p-2.5 rounded-lg border border-slate-300 bg-white font-semibold"
                      >
                        <option value="High School Diploma">
                          High School Diploma (Diplòm Finisman Etid)
                        </option>
                        <option value="Grade Promotion">
                          Grade Promotion (Sètifika Reyisit Nivo 7–12)
                        </option>
                        <option value="Subject Accomplishment">
                          Subject Accomplishment (Sètifika pa Matyè)
                        </option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Mansyon Onorifik (Honors) *
                      </label>
                      <select
                        value={certHonors}
                        onChange={(e) => setCertHonors(e.target.value as HonorsMention)}
                        className="w-full p-2.5 rounded-lg border border-slate-300 bg-white"
                      >
                        <option value="Mention Excellence (Summa Cum Laude)">
                          Mention Excellence (Summa Cum Laude)
                        </option>
                        <option value="Mention Très Bien (Magna Cum Laude)">
                          Mention Très Bien (Magna Cum Laude)
                        </option>
                        <option value="Mention Bien (Cum Laude)">
                          Mention Bien (Cum Laude)
                        </option>
                        <option value="Mention Assez Bien (Honorable)">
                          Mention Assez Bien (Honorable)
                        </option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Mwayèn / Nòt Final (%) *
                      </label>
                      <input
                        type="number"
                        min={60}
                        max={100}
                        value={certScore}
                        onChange={(e) => setCertScore(Number(e.target.value))}
                        className="w-full p-2.5 rounded-lg border border-slate-300 bg-white font-mono"
                      />
                    </div>
                  </div>

                  {certType === 'Subject Accomplishment' && (
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Matyè Ofisyèl
                      </label>
                      <input
                        type="text"
                        value={certSubjectName}
                        onChange={(e) => setCertSubjectName(e.target.value)}
                        placeholder="egz. Matematik (Mathematics)"
                        className="w-full p-2.5 rounded-lg border border-slate-300 bg-white"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Sitasyon Ofisyèl sou Diplòm nan (Opsyonèl)
                    </label>
                    <input
                      type="text"
                      value={certCitationCustom}
                      onChange={(e) => setCertCitationCustom(e.target.value)}
                      placeholder="Kite vid pou itilize tèks ofisyèl Konsèy Akademik ASLA a..."
                      className="w-full p-2.5 rounded-lg border border-slate-300 bg-white"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-5 py-2.5 text-xs font-bold bg-[#0B2545] text-white rounded-lg hover:bg-[#133B6E] cursor-pointer"
                  >
                    Delivre & Siyen Sètifika / Diplòm (Sindy Salomon)
                  </button>
                </form>

                {/* Issued Certificates & Diplomas Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs tabular-nums">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-500">
                        <th className="py-3 px-3">N° Seri</th>
                        <th className="py-3 px-3">Elèv</th>
                        <th className="py-3 px-3">Klas</th>
                        <th className="py-3 px-3">Tip & Tit</th>
                        <th className="py-3 px-3">Nòt & Mansyon</th>
                        <th className="py-3 px-3">Dat</th>
                        <th className="py-3 px-3">Stati</th>
                        <th className="py-3 px-3">Aksyon</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {certificates.map((cert) => (
                        <tr key={cert.id} className="hover:bg-slate-50">
                          <td className="py-3 px-3 font-mono font-semibold text-[#0B3B75]">
                            {cert.serialNumber}
                          </td>
                          <td className="py-3 px-3 font-bold text-[#0B2545]">
                            {cert.studentName}
                          </td>
                          <td className="py-3 px-3 font-semibold text-[#B91C1C]">
                            {cert.grade}
                          </td>
                          <td className="py-3 px-3">
                            <div className="font-semibold text-slate-900">
                              {cert.certificateType}
                            </div>
                            <div className="text-slate-500 truncate max-w-xs">
                              {cert.titleHt}
                            </div>
                          </td>
                          <td className="py-3 px-3 font-mono">
                            <strong>{cert.finalAverageScore}%</strong> · {cert.honors}
                          </td>
                          <td className="py-3 px-3 font-mono">{cert.issuedAt}</td>
                          <td className="py-3 px-3 font-bold">
                            {cert.status === 'Active' ? (
                              <span className="text-emerald-700">● Active</span>
                            ) : (
                              <span className="text-red-700">✕ Revoked</span>
                            )}
                          </td>
                          <td className="py-3 px-3">
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => setInspectedCertificate(cert)}
                                className="px-2.5 py-1 text-xs font-semibold bg-[#0B2545] text-white rounded cursor-pointer whitespace-nowrap"
                              >
                                Wè / Enprime Diplòm
                              </button>
                              <button
                                type="button"
                                onClick={() => onToggleCertificateStatus(cert.id)}
                                className="px-2.5 py-1 text-xs font-semibold border border-slate-300 text-slate-700 rounded hover:bg-slate-100 cursor-pointer whitespace-nowrap"
                              >
                                {cert.status === 'Active' ? 'Revoke' : 'Restore'}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {inspectedCertificate && (
                <CertificateDiplomaView
                  certificate={inspectedCertificate}
                  defaultLanguage={language}
                />
              )}
            </div>
          )}

          {/* 13. SETTINGS */}
          {activeMenu === 'Settings' && (
            <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-5 max-w-2xl">
              <h2 className="text-xl font-bold text-[#0B2545]">
                Paramèt Jeneral Lekòl — Aprantisaj se lò Akademi (ASLA · Grades 7–12)
              </h2>
              {settingsSaved && (
                <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-semibold">
                  ✓ Paramèt Aprantisaj se lò Akademi (ASLA) yo mete ajou.
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">
                    Non Ofisyèl Lekòl la (school_name)
                  </label>
                  <input
                    type="text"
                    value={localSettings.school_name || localSettings.schoolName || 'Aprantisaj se lò Akademi'}
                    onChange={(e) =>
                      setLocalSettings({
                        ...localSettings,
                        school_name: e.target.value,
                        schoolName: e.target.value,
                      })
                    }
                    className="w-full p-2.5 rounded-lg border border-slate-300 font-bold text-[#0B2545]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Ane Akademik
                  </label>
                  <input
                    type="text"
                    value={localSettings.academicYear}
                    onChange={(e) =>
                      setLocalSettings({ ...localSettings, academicYear: e.target.value })
                    }
                    className="w-full p-2.5 rounded-lg border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Frè Enskripsyon Ofisyèl (HTG)
                  </label>
                  <input
                    type="number"
                    value={localSettings.registrationFeeHtg}
                    onChange={(e) =>
                      setLocalSettings({
                        ...localSettings,
                        registrationFeeHtg: Number(e.target.value),
                      })
                    }
                    className="w-full p-2.5 rounded-lg border border-slate-300 font-mono"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">
                    Kont Bankè ak MonCash / Natcash
                  </label>
                  <input
                    type="text"
                    value={localSettings.bankAccountInfo}
                    onChange={(e) =>
                      setLocalSettings({ ...localSettings, bankAccountInfo: e.target.value })
                    }
                    className="w-full p-2.5 rounded-lg border border-slate-300 font-mono"
                  />
                </div>
              </div>
              <button
                onClick={() => {
                  onUpdateSettings(localSettings);
                  setSettingsSaved(true);
                }}
                className="px-5 py-2.5 text-xs font-semibold bg-[#0B2545] text-white rounded-lg cursor-pointer"
              >
                Anrejistre Paramèt Lekòl la
              </button>
            </div>
          )}

          {/* 14. PREPARASYON EGZAMEN LETA / FILO MANAGEMENT CENTER */}
          {activeMenu === 'Preparasyon Egzamen Leta / Filo' && (
            <ExamPrepAdminWorkspace
              key={examPrepInitialTab}
              students={students}
              programs={examPrepPrograms}
              subjectConfigs={examPrepSubjects}
              topics={examPrepTopics}
              questions={examPrepQuestions}
              mockExams={examPrepMockExams}
              materials={examPrepMaterials}
              attempts={examPrepAttempts}
              examPrepPayments={examPrepPayments}
              auditLogs={examPrepAuditLogs}
              initialTab={examPrepInitialTab}
              onUpdateExamPrepPaymentStatus={onUpdateExamPrepPaymentStatus}
              onUpdateStudentExamPrepEligibility={onUpdateStudentExamPrepEligibility}
              onToggleSubjectEnabled={onToggleExamPrepSubjectEnabled}
              onToggleProgramSubject={onToggleExamPrepProgramSubject}
              onAddExamPrepTopic={onAddExamPrepTopic}
              onAddExamPrepQuestion={onAddExamPrepQuestion}
              onAddExamPrepMockExam={onAddExamPrepMockExam}
              onAddExamPrepMaterial={onAddExamPrepMaterial}
            />
          )}
        </main>
      </div>

      {/* Receipt Inspection Modal (View Receipt) */}
      {inspectedPayment && (
        <div className="fixed inset-0 z-50 bg-black/55 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-slate-200 max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-base font-bold text-[#0B2545]">
                Resi Pèman 15,000 HTG — {inspectedPayment.studentName}
              </h3>
              <button
                onClick={() => setInspectedPayment(null)}
                className="px-2.5 py-1 text-xs font-semibold border border-slate-200 rounded cursor-pointer"
              >
                {t.close}
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs font-mono tabular-nums">
              <div>Elèv : {inspectedPayment.studentName}</div>
              <div>
                Nivo & Klas : {inspectedPayment.grade} ({inspectedPayment.classroom})
              </div>
              <div>Paran : {inspectedPayment.parentName} ({inspectedPayment.parentContact})</div>
              <div>Montan Peye : {inspectedPayment.amountHtg.toLocaleString()} HTG</div>
              <div>Metòd Pèman : {inspectedPayment.paymentMethod}</div>
              <div>Nimewo Tranzaksyon : {inspectedPayment.transactionNumber}</div>
              <div>Fichye Resi : {inspectedPayment.receiptFileName}</div>
              <div>Dat : {inspectedPayment.date}</div>
              <div>Stati : {inspectedPayment.status}</div>
            </div>

            {inspectedPayment.receiptDataUrl && (
              <div className="rounded-lg overflow-hidden border border-slate-200 max-h-60">
                <img
                  src={inspectedPayment.receiptDataUrl}
                  alt="Resi Pèman"
                  className="w-full h-full object-contain"
                />
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  onUpdatePaymentStatus(inspectedPayment.id, 'Approved');
                  setInspectedPayment(null);
                }}
                className="px-4 py-2 text-xs font-semibold bg-emerald-700 text-white rounded-lg cursor-pointer"
              >
                Approve Receipt & Student
              </button>
              <button
                onClick={() => setInspectedPayment(null)}
                className="px-4 py-2 text-xs font-semibold border border-slate-300 rounded-lg cursor-pointer"
              >
                {t.close}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
