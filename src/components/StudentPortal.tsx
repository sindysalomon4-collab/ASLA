import React, { useMemo, useState } from 'react';
import {
  AcademicCertificate,
  AslaPaymentType,
  AttendanceRecord,
  ClassroomRecord,
  ExamPrepAttempt,
  ExamPrepMaterial,
  ExamPrepMockExam,
  ExamPrepPaymentRecord,
  ExamPrepProgram,
  ExamPrepQuestion,
  ExamPrepStudyPlanTask,
  ExamPrepSubjectConfig,
  ExamPrepTopic,
  Language,
  LearningFlowStage,
  PaymentTransaction,
  SchoolNotification,
  SchoolSettings,
  StudentAccount,
  SubjectDefinition,
  WorkSubmission,
} from '../types';
import { TRANSLATIONS } from '../i18n/translations';
import { GRADE_COMPLEXITY_PROFILE } from '../data/syllabusMatrix';
import { BookReaderWorkspace } from './BookReaderWorkspace';
import { AslaLogo } from './AslaLogo';
import { CertificateDiplomaView } from './CertificateDiplomaView';
import { StudentPaymentCenter } from './StudentPaymentCenter';
import {
  EXAM_PREP_SUBSECTIONS,
  ExamPrepStudentWorkspace,
  ExamPrepSubSection,
} from './ExamPrepStudentWorkspace';
import {
  Award,
  Bell,
  BookOpen,
  CalendarCheck,
  CheckCircle2,
  ClipboardList,
  FileSpreadsheet,
  GraduationCap,
  LayoutDashboard,
  Lock,
  LogOut,
  Menu,
  User,
  X,
} from 'lucide-react';

export type StudentMenuSection =
  | 'Dashboard'
  | 'Peman'
  | 'Preparasyon Egzamen Leta / Filo'
  | 'My Classroom'
  | 'My Grade'
  | 'My Subjects'
  | 'My Books'
  | 'Chapters'
  | 'Lessons'
  | 'Classwork'
  | 'Homework'
  | 'Quizzes'
  | 'Exams'
  | 'Grades'
  | 'My Progress'
  | 'Certificates & Diploma'
  | 'Attendance'
  | 'Notifications'
  | 'Profile';

const STUDENT_MENU_ITEMS: StudentMenuSection[] = [
  'Dashboard',
  'Peman',
  'Preparasyon Egzamen Leta / Filo',
  'My Classroom',
  'My Grade',
  'My Subjects',
  'My Books',
  'Chapters',
  'Lessons',
  'Classwork',
  'Homework',
  'Quizzes',
  'Exams',
  'Grades',
  'My Progress',
  'Certificates & Diploma',
  'Attendance',
  'Notifications',
  'Profile',
];

interface StudentPortalProps {
  language: Language;
  onChangeLanguage: (lang: Language) => void;
  student: StudentAccount;
  allStudents: StudentAccount[];
  onSwitchStudent: (studentId: string) => void;
  classrooms: ClassroomRecord[];
  subjects: SubjectDefinition[];
  submissions: WorkSubmission[];
  attendance: AttendanceRecord[];
  notifications: SchoolNotification[];
  payments: PaymentTransaction[];
  certificates: AcademicCertificate[];
  settings: SchoolSettings;
  examPrepPrograms: ExamPrepProgram[];
  examPrepSubjects: ExamPrepSubjectConfig[];
  examPrepTopics: ExamPrepTopic[];
  examPrepQuestions: ExamPrepQuestion[];
  examPrepMockExams: ExamPrepMockExam[];
  examPrepMaterials: ExamPrepMaterial[];
  examPrepAttempts: ExamPrepAttempt[];
  examPrepPayments: ExamPrepPaymentRecord[];
  examPrepStudyPlan: ExamPrepStudyPlanTask[];
  onSubmitExamPrepPayment: (
    payment: Omit<ExamPrepPaymentRecord, 'id' | 'submittedAt' | 'status'>
  ) => void;
  onSubmitTuitionReceipt: (payload: {
    paymentReference: string;
    transactionNumber: string;
    amountHtg: number;
    paymentDate: string;
    natcashNumber: string;
    receiptFileName: string;
    receiptDataUrl?: string;
  }) => void;
  onRecordExamPrepAttempt: (attempt: Omit<ExamPrepAttempt, 'id' | 'date'>) => void;
  onUpdateExamPrepTopicStatus: (
    topicId: string,
    status: 'Completed' | 'In Progress' | 'Not Started'
  ) => void;
  onToggleExamPrepStudyPlanTask: (taskId: string) => void;
  onAddExamPrepStudyPlanTask: (
    task: Omit<ExamPrepStudyPlanTask, 'id' | 'studentId' | 'completed'>
  ) => void;
  onIssueCertificate: (cert: AcademicCertificate) => void;
  onToggleLessonCompleted: (lessonId: string) => void;
  onSubmitWork: (submission: Omit<WorkSubmission, 'id' | 'submittedAt'>) => void;
  onUpdateStudentProfile: (updated: StudentAccount) => void;
  onSignOut: () => void;
}

export const StudentPortal: React.FC<StudentPortalProps> = ({
  language,
  onChangeLanguage,
  student,
  allStudents,
  onSwitchStudent,
  classrooms,
  subjects,
  submissions,
  attendance,
  notifications,
  payments,
  certificates,
  settings,
  examPrepPrograms,
  examPrepSubjects,
  examPrepTopics,
  examPrepQuestions,
  examPrepMockExams,
  examPrepMaterials,
  examPrepAttempts,
  examPrepPayments,
  examPrepStudyPlan,
  onSubmitExamPrepPayment,
  onSubmitTuitionReceipt,
  onRecordExamPrepAttempt,
  onUpdateExamPrepTopicStatus,
  onToggleExamPrepStudyPlanTask,
  onAddExamPrepStudyPlanTask,
  onIssueCertificate,
  onToggleLessonCompleted,
  onSubmitWork,
  onUpdateStudentProfile,
  onSignOut,
}) => {
  const t = TRANSLATIONS[language];

  const [activeMenu, setActiveMenu] = useState<StudentMenuSection>('Dashboard');
  const [paymentCenterInitialType, setPaymentCenterInitialType] =
    useState<AslaPaymentType>('Frè lekòl anyèl');
  const [examPrepSubSection, setExamPrepSubSection] =
    useState<ExamPrepSubSection>('Dashboard Preparasyon');
  const [sidebarOpenDesktop, setSidebarOpenDesktop] = useState(true);
  const [sidebarOpenMobile, setSidebarOpenMobile] = useState(false);

  // Left-to-right flow states
  const gradeSubjects = useMemo(
    () => subjects.filter((s) => s.grade === student.grade),
    [subjects, student.grade]
  );

  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(
    student.currentSubjectId || gradeSubjects[0]?.id || ''
  );
  const [selectedChapterNumber, setSelectedChapterNumber] = useState<number>(
    student.currentChapterNumber || 1
  );
  const [selectedLessonNumber, setSelectedLessonNumber] = useState<number>(
    student.currentLessonNumber || 1
  );
  const [learningStage, setLearningStage] = useState<LearningFlowStage>('CLASSROOM');

  // Keep selectedSubjectId strictly within student's assigned grade
  const validSubjectId = useMemo(() => {
    const match = gradeSubjects.find((s) => s.id === selectedSubjectId);
    return match ? match.id : gradeSubjects[0]?.id || '';
  }, [gradeSubjects, selectedSubjectId]);

  const activeSubject = useMemo(
    () => gradeSubjects.find((s) => s.id === validSubjectId) || gradeSubjects[0],
    [gradeSubjects, validSubjectId]
  );

  const assignedClassroom = useMemo(
    () => classrooms.find((c) => c.name === student.classroom && c.grade === student.grade),
    [classrooms, student.classroom, student.grade]
  );

  const studentSubmissions = useMemo(
    () => submissions.filter((s) => s.studentId === student.id),
    [submissions, student.id]
  );

  const studentAttendance = useMemo(
    () => attendance.filter((a) => a.studentId === student.id),
    [attendance, student.id]
  );

  const studentNotifications = useMemo(
    () =>
      notifications.filter(
        (n) =>
          n.targetRole === 'All' ||
          (n.targetRole === 'Student' && (!n.targetUserId || n.targetUserId === student.id))
      ),
    [notifications, student.id]
  );

  const studentPayments = useMemo(
    () => payments.filter((p) => p.studentId === student.id),
    [payments, student.id]
  );

  const studentCertificates = useMemo(
    () => certificates.filter((c) => c.studentId === student.id && c.status === 'Active'),
    [certificates, student.id]
  );

  const [selectedCertificateId, setSelectedCertificateId] = useState<string>('');

  const defaultPreviewDiploma: AcademicCertificate = useMemo(() => {
    const isGrade12 = student.grade === 'Grade 12';
    const gNum = student.grade.replace('Grade ', '');
    return {
      id: `preview-dip-${student.id}`,
      serialNumber: `ASLA-${isGrade12 ? 'DIP' : 'CERT'}-2026-${gNum.padStart(2, '0')}99-HT`,
      studentId: student.id,
      studentName: student.fullName,
      studentCode: student.studentCode,
      grade: student.grade,
      classroom: student.classroom,
      certificateType: isGrade12 ? 'High School Diploma' : 'Grade Promotion',
      titleHt: isGrade12
        ? 'DIPLÒM FINISMAN ETID SEGONDÈ (PHILO / BAC II)'
        : `SÈTIFIKA AKONPLISMAN NIVO AKADEMIK — ${student.grade.toUpperCase()}`,
      titleFr: isGrade12
        ? 'DIPLÔME DE FIN D’ÉTUDES SECONDAIRES (PHILO / BAC II)'
        : `CERTIFICAT D’ACCOMPLISSEMENT ACADÉMIQUE — ${student.grade.toUpperCase()}`,
      titleEn: isGrade12
        ? 'OFFICIAL HIGH SCHOOL GRADUATION DIPLOMA (GRADE 12)'
        : `CERTIFICATE OF ACADEMIC ACCOMPLISHMENT — ${student.grade.toUpperCase()}`,
      citationHt: `Atribye a ${student.fullName} pou metriz pwogram akademik ofisyèl ${student.grade} (${GRADE_COMPLEXITY_PROFILE[student.grade].haitianEquivalent}) nan Aprantisaj se lò Akademi (ASLA).`,
      citationFr: `Décerné à ${student.fullName} pour la maîtrise du programme académique officiel de ${student.grade} à Aprantisaj se lò Akademi (ASLA).`,
      citationEn: `Awarded to ${student.fullName} for mastery of the official ${student.grade} curriculum at Aprantisaj se lò Akademi (ASLA).`,
      honors: 'Mention Excellence (Summa Cum Laude)',
      finalAverageScore: 92,
      academicYear: student.academicYear,
      issuedAt: new Date().toISOString().slice(0, 10),
      issuedBy: 'Sindy Salomon — Direktris Jeneral ASLA',
      status: 'Active',
    };
  }, [student]);

  const activeCertificate = useMemo(
    () =>
      studentCertificates.find((c) => c.id === selectedCertificateId) ||
      studentCertificates[0] ||
      defaultPreviewDiploma,
    [studentCertificates, selectedCertificateId, defaultPreviewDiploma]
  );

  const isApprovedForClassroom =
    student.approvalStatus === 'Approved' || student.approvalStatus === 'Active';

  const handleNavigateMenu = (item: StudentMenuSection) => {
    setActiveMenu(item);
    setSidebarOpenMobile(false);

    // Sync left-to-right learning stage when clicking academic sidebar items
    if (item === 'My Classroom') setLearningStage('CLASSROOM');
    if (item === 'My Books') setLearningStage('BOOK');
    if (item === 'Chapters') setLearningStage('CHAPTER');
    if (item === 'Lessons') setLearningStage('LESSON');
    if (item === 'Classwork') setLearningStage('CLASSWORK');
    if (item === 'Homework') setLearningStage('HOMEWORK');
    if (item === 'Quizzes' || item === 'Exams') setLearningStage('QUIZ');
  };

  const isLearningFlowMenu = [
    'My Classroom',
    'My Books',
    'Chapters',
    'Lessons',
    'Classwork',
    'Homework',
    'Quizzes',
    'Exams',
  ].includes(activeMenu);

  // Profile edit state
  const [profilePhone, setProfilePhone] = useState(student.phone);
  const [profileParentContact, setProfileParentContact] = useState(student.parentContact);
  const [profileSaved, setProfileSaved] = useState(false);

  return (
    <div className="min-h-screen flex bg-[#F8FAFC] text-[#0F172A]">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpenMobile && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setSidebarOpenMobile(false)}
          />
          <aside className="relative z-10 w-72 bg-[#0B2545] text-white flex flex-col h-full overflow-y-auto">
            <div className="p-4 border-b border-white/15 flex items-center justify-between">
              <AslaLogo size="sm" theme="dark" subtitle={`ELÈV · ${student.grade.toUpperCase()}`} />
              <button
                onClick={() => setSidebarOpenMobile(false)}
                className="px-2.5 py-1 text-xs font-semibold bg-white/10 rounded hover:bg-white/20 cursor-pointer"
              >
                {t.close}
              </button>
            </div>
            <nav className="p-3 space-y-1 flex-1">
              {STUDENT_MENU_ITEMS.map((item) => (
                <React.Fragment key={item}>
                  <button
                    onClick={() => handleNavigateMenu(item)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                      activeMenu === item
                        ? 'bg-[#B91C1C] text-white font-semibold'
                        : 'text-slate-200 hover:bg-white/10'
                    }`}
                  >
                    {item === 'Preparasyon Egzamen Leta / Filo'
                      ? '🎯 Preparasyon Egzamen Leta / Filo'
                      : item === 'Peman'
                      ? '💳 Peman'
                      : item}
                  </button>
                  {item === 'Preparasyon Egzamen Leta / Filo' &&
                    activeMenu === 'Preparasyon Egzamen Leta / Filo' && (
                      <div className="pl-3 space-y-0.5 border-l border-white/20 ml-2 my-1">
                        {EXAM_PREP_SUBSECTIONS.map((sub) => (
                          <button
                            key={sub}
                            onClick={() => {
                              setExamPrepSubSection(sub);
                              setSidebarOpenMobile(false);
                            }}
                            className={`w-full text-left px-2.5 py-1.5 rounded text-[11px] cursor-pointer ${
                              examPrepSubSection === sub
                                ? 'bg-white/20 text-amber-300 font-bold'
                                : 'text-slate-300 hover:bg-white/10'
                            }`}
                          >
                            • {sub}
                          </button>
                        ))}
                        <button
                          onClick={() => {
                            setActiveMenu('Dashboard');
                            setSidebarOpenMobile(false);
                          }}
                          className="w-full text-left px-2.5 py-1.5 rounded text-[11px] text-slate-300 hover:bg-white/10 cursor-pointer"
                        >
                          • Retounen
                        </button>
                        <button
                          onClick={() => setSidebarOpenMobile(false)}
                          className="w-full text-left px-2.5 py-1.5 rounded text-[11px] text-slate-300 hover:bg-white/10 cursor-pointer"
                        >
                          • Fèmen
                        </button>
                      </div>
                    )}
                </React.Fragment>
              ))}
            </nav>
            <div className="p-3 border-t border-white/15">
              <button
                onClick={onSignOut}
                className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-red-300 hover:bg-white/10 cursor-pointer"
              >
                {t.signOut}
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Desktop Collapsible Left Sidebar */}
      {sidebarOpenDesktop && (
        <aside className="hidden lg:flex w-64 shrink-0 bg-[#0B2545] text-white flex-col border-r border-slate-800">
          <div className="p-4 border-b border-white/15 flex items-center justify-between">
            <AslaLogo size="sm" theme="dark" subtitle={`ELÈV · ${student.grade.toUpperCase()}`} />
            <button
              onClick={() => setSidebarOpenDesktop(false)}
              className="px-2 py-1 text-xs text-slate-300 hover:text-white border border-white/20 rounded cursor-pointer"
              title="Close Sidebar"
            >
              ✕
            </button>
          </div>

          <nav className="p-3 space-y-1 flex-1 overflow-y-auto">
            {STUDENT_MENU_ITEMS.map((item) => (
              <React.Fragment key={item}>
                <button
                  onClick={() => handleNavigateMenu(item)}
                  className={`w-full text-left px-3.5 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer flex items-center justify-between ${
                    activeMenu === item
                      ? 'bg-[#B91C1C] text-white font-semibold'
                      : 'text-slate-200 hover:bg-white/10'
                  }`}
                >
                  <span>
                    {item === 'Preparasyon Egzamen Leta / Filo'
                      ? '🎯 Preparasyon Egzamen Leta / Filo'
                      : item === 'Peman'
                      ? '💳 Peman'
                      : item}
                  </span>
                  {item === 'Notifications' && studentNotifications.length > 0 && (
                    <span className="font-mono text-[11px] opacity-80">
                      ({studentNotifications.length})
                    </span>
                  )}
                </button>
                {item === 'Preparasyon Egzamen Leta / Filo' &&
                  activeMenu === 'Preparasyon Egzamen Leta / Filo' && (
                    <div className="pl-3 space-y-0.5 border-l border-white/20 ml-2 my-1">
                      {EXAM_PREP_SUBSECTIONS.map((sub) => (
                        <button
                          key={sub}
                          onClick={() => setExamPrepSubSection(sub)}
                          className={`w-full text-left px-2.5 py-1.5 rounded text-[11px] cursor-pointer ${
                            examPrepSubSection === sub
                              ? 'bg-white/20 text-amber-300 font-bold'
                              : 'text-slate-300 hover:bg-white/10'
                          }`}
                        >
                          • {sub}
                        </button>
                      ))}
                      <button
                        onClick={() => setActiveMenu('Dashboard')}
                        className="w-full text-left px-2.5 py-1.5 rounded text-[11px] text-slate-300 hover:bg-white/10 cursor-pointer"
                      >
                        • Retounen
                      </button>
                      <button
                        onClick={() => setSidebarOpenDesktop(false)}
                        className="w-full text-left px-2.5 py-1.5 rounded text-[11px] text-slate-300 hover:bg-white/10 cursor-pointer"
                      >
                        • Fèmen
                      </button>
                    </div>
                  )}
              </React.Fragment>
            ))}
          </nav>

          <div className="p-3 border-t border-white/15">
            <button
              onClick={onSignOut}
              className="w-full text-left px-3.5 py-2.5 rounded-lg text-xs font-semibold text-red-200 hover:bg-white/10 cursor-pointer"
            >
              {t.signOut}
            </button>
          </div>
        </aside>
      )}

      {/* Main Viewport */}
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
              Aprantisaj se lò Akademi (ASLA) · {activeMenu}
            </span>
          </div>

          {/* Student Switcher (for testing different Grades 7–12 & Approval states) + Global Navigation */}
          <div className="flex items-center gap-2.5">
            <select
              value={student.id}
              onChange={(e) => onSwitchStudent(e.target.value)}
              className="hidden sm:block px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 bg-slate-50 text-[#0B2545]"
              title="Chanje Elèv pou Tès (Grades 7-12)"
            >
              {allStudents.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.fullName} · {s.grade} ({s.approvalStatus})
                </option>
              ))}
            </select>

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

        {/* Main Content Body */}
        <main className="flex-1 p-6 max-w-7xl w-full mx-auto space-y-6">
          {/* Approval Security Gate Banner if Student is Pending / Rejected / Suspended */}
          {!isApprovedForClassroom && (
            <div className="p-5 rounded-xl bg-amber-50 border border-amber-300 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="text-xs font-bold text-amber-900">
                  ▲ STATI KONT ELÈV : {student.approvalStatus.toUpperCase()} · PÈMAN 15,000 HTG :{' '}
                  {student.paymentStatus.toUpperCase()}
                </div>
                <button
                  onClick={() => {
                    setPaymentCenterInitialType('Frè lekòl anyèl');
                    setActiveMenu('Peman');
                  }}
                  className="px-3.5 py-1.5 text-xs font-semibold bg-[#B91C1C] text-white rounded-lg hover:bg-[#991B1B] cursor-pointer"
                >
                  💳 Peman / Telechaje Resi 15,000 HTG →
                </button>
              </div>
              <h3 className="text-base font-bold text-[#0B2545]">
                {t.protectedClassroomBlockedTitle}
              </h3>
              <p className="text-xs text-slate-700 leading-relaxed">
                {t.protectedClassroomBlockedMessage}
              </p>
            </div>
          )}

          {/* 1. STUDENT DASHBOARD (Section 14) */}
          {activeMenu === 'Dashboard' && (
            <div className="space-y-6">
              {/* Student Identity Banner */}
              <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="space-y-1.5">
                  <div className="text-xs text-slate-500 font-mono tabular-nums">
                    <span>Kòd Elèv : {student.studentCode}</span>
                    <span className="mx-2">·</span>
                    <span>Ane Akademik : {student.academicYear}</span>
                    <span className="mx-2">·</span>
                    <span
                      className={
                        isApprovedForClassroom
                          ? 'text-emerald-700 font-bold'
                          : 'text-amber-700 font-bold'
                      }
                    >
                      Stati : {student.approvalStatus}
                    </span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-[#0B2545]">
                    {student.fullName}
                  </h1>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-700 font-medium">
                    <span className="text-[#B91C1C] font-bold">{student.grade}</span>
                    <span>·</span>
                    <span>{GRADE_COMPLEXITY_PROFILE[student.grade].haitianEquivalent}</span>
                    <span>·</span>
                    <span>Sal Klas : {student.classroom}</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => handleNavigateMenu('My Classroom')}
                    className="px-5 py-3 text-xs font-semibold bg-[#0B2545] text-white rounded-lg hover:bg-[#133B6E] cursor-pointer whitespace-nowrap"
                  >
                    Antre nan Sal Klas Mwen ({student.grade}) →
                  </button>
                  <button
                    onClick={() => {
                      setExamPrepSubSection('Dashboard Preparasyon');
                      handleNavigateMenu('Preparasyon Egzamen Leta / Filo');
                    }}
                    className="px-4 py-3 text-xs font-bold bg-[#B91C1C] text-white rounded-lg hover:bg-[#991B1B] cursor-pointer whitespace-nowrap"
                  >
                    🎯 Preparasyon Egzamen Leta / Filo →
                  </button>
                  <button
                    onClick={() => handleNavigateMenu('My Books')}
                    className="px-4 py-3 text-xs font-semibold border border-slate-300 text-[#0B2545] rounded-lg hover:bg-slate-100 cursor-pointer whitespace-nowrap"
                  >
                    {gradeSubjects.length} Liv Akademik {student.grade}
                  </button>
                  <button
                    onClick={() => handleNavigateMenu('Certificates & Diploma')}
                    className="px-4 py-3 text-xs font-bold bg-[#FACC15] text-[#0B3B75] rounded-lg hover:bg-[#EAB308] cursor-pointer whitespace-nowrap inline-flex items-center gap-1.5"
                  >
                    <Award className="w-4 h-4" />
                    <span>Sètifika & Diplòm ({studentCertificates.length || 1})</span>
                  </button>
                </div>
              </div>

              {/* Key Student Dashboard Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 tabular-nums">
                <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-1">
                  <div className="text-xs text-slate-500">Nivo & Sal Klas</div>
                  <div className="text-xl font-bold text-[#0B2545]">{student.grade}</div>
                  <div className="text-xs text-slate-600 truncate">{student.classroom}</div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-1">
                  <div className="text-xs text-slate-500">Liv & Leson Aktif</div>
                  <div className="text-xl font-bold text-[#0B2545] font-mono">
                    Ch. {selectedChapterNumber} · Leson {selectedLessonNumber}
                  </div>
                  <div className="text-xs text-slate-600 truncate">
                    {gradeSubjects.find((s) => s.id === validSubjectId)?.nameHt}
                  </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-1">
                  <div className="text-xs text-slate-500">Travay, Devwa, Quiz & Egzamen</div>
                  <div className="text-xl font-bold text-[#0B2545] font-mono">
                    {studentSubmissions.length} Soumèt
                  </div>
                  <div className="text-xs text-emerald-700">
                    ● {student.completedLessonIds.length} Leson konplete
                  </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-1">
                  <div className="text-xs text-slate-500">Prezans (Attendance)</div>
                  <div className="text-xl font-bold text-emerald-700 font-mono">
                    {studentAttendance.filter((a) => a.status === 'Present').length}/
                    {Math.max(1, studentAttendance.length)} Prezan
                  </div>
                  <div className="text-xs text-slate-600">Ane Akademik {student.academicYear}</div>
                </div>
              </div>

              {/* Current Book & Lesson Quick Resume Card */}
              <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <div className="text-xs font-semibold text-[#B91C1C]">
                      KONTINYE APRANTISAJ OU (GOCH → DWAT)
                    </div>
                    <h2 className="text-lg font-bold text-[#0B2545] mt-0.5">
                      Liv Aktif : {gradeSubjects.find((s) => s.id === validSubjectId)?.nameHt} (
                      {student.grade}) — Chapit {selectedChapterNumber}, Leson{' '}
                      {selectedLessonNumber}
                    </h2>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => {
                        setLearningStage('LESSON');
                        setActiveMenu('Lessons');
                      }}
                      className="px-4 py-2 text-xs font-semibold bg-[#0B2545] text-white rounded-lg hover:bg-[#133B6E] cursor-pointer"
                    >
                      Kontinye Leson an →
                    </button>
                    <button
                      onClick={() => {
                        setLearningStage('CLASSWORK');
                        setActiveMenu('Classwork');
                      }}
                      className="px-3.5 py-2 text-xs font-semibold border border-slate-300 rounded-lg hover:bg-slate-100 cursor-pointer"
                    >
                      Travay Klas
                    </button>
                    <button
                      onClick={() => {
                        setLearningStage('HOMEWORK');
                        setActiveMenu('Homework');
                      }}
                      className="px-3.5 py-2 text-xs font-semibold border border-slate-300 rounded-lg hover:bg-slate-100 cursor-pointer"
                    >
                      Devwa Lakay
                    </button>
                    <button
                      onClick={() => {
                        setLearningStage('QUIZ');
                        setActiveMenu('Quizzes');
                      }}
                      className="px-3.5 py-2 text-xs font-semibold bg-[#B91C1C] text-white rounded-lg hover:bg-[#991B1B] cursor-pointer"
                    >
                      Quiz Chapit
                    </button>
                  </div>
                </div>

                {/* Assigned Grade Subjects Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
                  {gradeSubjects.map((subj) => (
                    <div
                      key={subj.id}
                      onClick={() => {
                        setSelectedSubjectId(subj.id);
                        setLearningStage('BOOK');
                        setActiveMenu('My Books');
                      }}
                      className="p-4 rounded-xl bg-[#F8FAFC] border border-slate-200 hover:border-[#0B2545] transition-colors cursor-pointer flex flex-col justify-between"
                    >
                      <div>
                        <div className="text-xs font-mono text-slate-500">
                          {subj.code} · {student.grade}
                        </div>
                        <h3 className="text-sm font-bold text-[#0B2545] mt-1">{subj.nameHt}</h3>
                        <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                          {subj.descriptionHt}
                        </p>
                      </div>
                      <div className="mt-3 pt-2 border-t border-slate-200/70 flex items-center justify-between text-xs font-semibold text-[#0B2545]">
                        <span>16 Chapit · 96 Leson</span>
                        <span>Louvri →</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Quiz/Exam/Assignment Results & Notifications */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-[#0B2545]">
                      Dènye Travay, Devwa, Quiz ak Egzamen ({student.grade})
                    </h3>
                    <button
                      onClick={() => setActiveMenu('Grades')}
                      className="text-xs font-semibold text-[#0B2545] underline cursor-pointer"
                    >
                      Wè tout Nòt yo →
                    </button>
                  </div>
                  {studentSubmissions.length === 0 ? (
                    <p className="text-xs text-slate-500">
                      Ou poko soumèt travay pou trimès sa a. Louvri yon leson pou kòmanse!
                    </p>
                  ) : (
                    <div className="divide-y divide-slate-100 text-xs tabular-nums">
                      {studentSubmissions.slice(0, 5).map((sub) => (
                        <div
                          key={sub.id}
                          className="py-3 flex items-center justify-between gap-3"
                        >
                          <div>
                            <div className="font-semibold text-slate-900">{sub.title}</div>
                            <div className="text-slate-500">
                              {sub.subjectName} · {sub.workType} · {sub.submittedAt}
                            </div>
                          </div>
                          <div className="text-right font-mono">
                            <span className="font-bold text-[#0B2545]">
                              {sub.score !== null ? `${sub.score}/100 (${sub.letterGrade})` : sub.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-[#0B2545]">
                      Notifikasyon Lekòl ({studentNotifications.length})
                    </h3>
                    <button
                      onClick={() => setActiveMenu('Notifications')}
                      className="text-xs font-semibold text-[#0B2545] underline cursor-pointer"
                    >
                      Tout Notifikasyon →
                    </button>
                  </div>
                  <div className="space-y-3">
                    {studentNotifications.slice(0, 3).map((n) => (
                      <div
                        key={n.id}
                        className="p-3.5 rounded-lg bg-[#F8FAFC] border border-slate-200 space-y-1 text-xs"
                      >
                        <div className="flex items-center justify-between text-slate-500 font-mono">
                          <span>{n.category}</span>
                          <span>{n.date}</span>
                        </div>
                        <div className="font-bold text-[#0B2545]">{n.title}</div>
                        <p className="text-slate-600">{n.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 2. PROTECTED LEARNING WORKFLOW SECTIONS */}
          {isLearningFlowMenu && (
            <>
              {!isApprovedForClassroom ? (
                <div className="bg-white rounded-xl border border-slate-200 p-8 text-center space-y-4 max-w-2xl mx-auto">
                  <Lock className="w-10 h-10 text-amber-600 mx-auto" />
                  <h2 className="text-xl font-bold text-[#0B2545]">
                    {t.protectedClassroomBlockedTitle}
                  </h2>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {t.protectedClassroomBlockedMessage}
                  </p>
                  <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 text-xs font-mono space-y-1 text-left">
                    <div>Elèv : {student.fullName}</div>
                    <div>Nivo : {student.grade} ({student.classroom})</div>
                    <div>Stati Apwobasyon : {student.approvalStatus}</div>
                    <div>Stati Pèman 15,000 HTG : {student.paymentStatus}</div>
                  </div>
                  <div className="flex flex-wrap justify-center gap-3 pt-2">
                    <button
                      onClick={() => setActiveMenu('Dashboard')}
                      className="px-4 py-2 text-xs font-semibold border border-slate-300 rounded-lg cursor-pointer"
                    >
                      {t.back}
                    </button>
                    <button
                      onClick={() => {
                        setPaymentCenterInitialType('Frè lekòl anyèl');
                        setActiveMenu('Peman');
                      }}
                      className="px-4 py-2 text-xs font-semibold bg-[#B91C1C] text-white rounded-lg cursor-pointer"
                    >
                      💳 Peman / Telechaje Resi 15,000 HTG
                    </button>
                  </div>
                </div>
              ) : (
                <BookReaderWorkspace
                  language={language}
                  student={student}
                  classroom={assignedClassroom}
                  gradeSubjects={gradeSubjects}
                  activeStage={learningStage}
                  onChangeStage={setLearningStage}
                  selectedSubjectId={validSubjectId}
                  onSelectSubject={setSelectedSubjectId}
                  selectedChapterNumber={selectedChapterNumber}
                  onSelectChapter={setSelectedChapterNumber}
                  selectedLessonNumber={selectedLessonNumber}
                  onSelectLesson={setSelectedLessonNumber}
                  submissions={submissions}
                  onToggleLessonCompleted={onToggleLessonCompleted}
                  onSubmitWork={onSubmitWork}
                  onExitToDashboard={() => setActiveMenu('Dashboard')}
                />
              )}
            </>
          )}

          {/* 3. MY GRADE & MY SUBJECTS */}
          {(activeMenu === 'My Grade' || activeMenu === 'My Subjects') && (
            <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <div className="text-xs font-semibold text-[#B91C1C]">
                    NIVO AKADEMIK ASIYEN (GRADE PROGRESSION PROTECTION ACTIVE)
                  </div>
                  <h2 className="text-2xl font-bold text-[#0B2545] mt-0.5">
                    {student.grade} — {GRADE_COMPLEXITY_PROFILE[student.grade].haitianEquivalent}
                  </h2>
                  <p className="text-xs text-slate-600 mt-1">
                    {GRADE_COMPLEXITY_PROFILE[student.grade].cognitiveFocus}
                  </p>
                </div>
                <button
                  onClick={() => handleNavigateMenu('My Classroom')}
                  className="px-4 py-2 text-xs font-semibold bg-[#0B2545] text-white rounded-lg cursor-pointer"
                >
                  Louvri Sal Klas {student.grade} →
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {gradeSubjects.map((subj) => (
                  <div
                    key={subj.id}
                    className="p-5 rounded-xl bg-[#F8FAFC] border border-slate-200 flex flex-col justify-between"
                  >
                    <div>
                      <div className="text-xs font-mono text-slate-500">
                        {subj.code} · Koefisyan {subj.coefficient} · {subj.weeklyHours}h/semèn
                      </div>
                      <h3 className="text-base font-bold text-[#0B2545] mt-1">{subj.nameHt}</h3>
                      <p className="text-xs text-slate-600 mt-1.5">{subj.descriptionHt}</p>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedSubjectId(subj.id);
                        handleNavigateMenu('My Books');
                      }}
                      className="mt-4 w-full py-2 px-3 text-xs font-semibold bg-[#0B2545] text-white rounded-lg hover:bg-[#133B6E] cursor-pointer"
                    >
                      Louvri Liv {subj.nameEn} ({student.grade}) →
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. GRADES & MY PROGRESS */}
          {(activeMenu === 'Grades' || activeMenu === 'My Progress') && (
            <BookReaderWorkspace
              language={language}
              student={student}
              classroom={assignedClassroom}
              gradeSubjects={gradeSubjects}
              activeStage={activeMenu === 'Grades' ? 'RESULTS' : 'PROGRESS'}
              onChangeStage={setLearningStage}
              selectedSubjectId={validSubjectId}
              onSelectSubject={setSelectedSubjectId}
              selectedChapterNumber={selectedChapterNumber}
              onSelectChapter={setSelectedChapterNumber}
              selectedLessonNumber={selectedLessonNumber}
              onSelectLesson={setSelectedLessonNumber}
              submissions={submissions}
              onToggleLessonCompleted={onToggleLessonCompleted}
              onSubmitWork={onSubmitWork}
              onExitToDashboard={() => setActiveMenu('Dashboard')}
            />
          )}

          {/* 5. ATTENDANCE */}
          {activeMenu === 'Attendance' && (
            <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-xl font-bold text-[#0B2545]">
                    Dosye Prezans (Attendance) — {student.fullName}
                  </h2>
                  <p className="text-xs text-slate-600">
                    {student.grade} · {student.classroom} · Kontwole pa Administrasyon ASLA
                  </p>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs tabular-nums">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500">
                      <th className="py-3 px-3">Dat</th>
                      <th className="py-3 px-3">Klas</th>
                      <th className="py-3 px-3">Stati Prezans</th>
                      <th className="py-3 px-3">Obsèvasyon Administrasyon</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {studentAttendance.map((att) => (
                      <tr key={att.id}>
                        <td className="py-3 px-3 font-mono">{att.date}</td>
                        <td className="py-3 px-3">{att.classroom}</td>
                        <td className="py-3 px-3 font-bold">
                          {att.status === 'Present' && (
                            <span className="text-emerald-700">● Present (Prezan)</span>
                          )}
                          {att.status === 'Absent' && (
                            <span className="text-red-700">✕ Absent (Absan)</span>
                          )}
                          {att.status === 'Late' && (
                            <span className="text-amber-700">▲ Late (An Reta)</span>
                          )}
                          {att.status === 'Excused' && (
                            <span className="text-blue-700">◆ Excused (Eskize)</span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-slate-600">{att.note}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 5B. CERTIFICATES & DIPLOMA */}
          {activeMenu === 'Certificates & Diploma' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4 print:hidden">
                <div>
                  <p className="text-xs font-bold text-[#B91C1C]">
                    SÈTIFIKA AKONPLISMAN AK DIPLÒM OFISYÈL ASLA
                  </p>
                  <h2 className="text-2xl font-bold text-[#0B2545] mt-0.5">
                    Sètifika & Diplòm — {student.fullName} ({student.grade})
                  </h2>
                  <p className="text-xs text-slate-600 mt-1">
                    Chwazi yon sètifika pa matyè oswa diplòm nivo {student.grade} ou a pou wè l nan Kreyòl, Français oswa English, enprime l, oswa telechaje l.
                  </p>
                </div>

                {/* Quick Claim Subject Certificate for Active Subject */}
                <button
                  type="button"
                  onClick={() => {
                    const gNum = student.grade.replace('Grade ', '');
                    const newCert: AcademicCertificate = {
                      id: `cert-${Date.now()}`,
                      serialNumber: `ASLA-SUBJ-2026-${gNum.padStart(2, '0')}-${activeSubject.code.slice(0, 4)}`,
                      studentId: student.id,
                      studentName: student.fullName,
                      studentCode: student.studentCode,
                      grade: student.grade,
                      classroom: student.classroom,
                      certificateType: 'Subject Accomplishment',
                      subjectName: activeSubject.nameHt,
                      titleHt: `SÈTIFIKA AKONPLISMAN PA MATYÈ — ${activeSubject.nameHt.toUpperCase()} (${student.grade.toUpperCase()})`,
                      titleFr: `CERTIFICAT D’ACCOMPLISSEMENT — ${activeSubject.nameFr.toUpperCase()} (${student.grade.toUpperCase()})`,
                      titleEn: `SUBJECT CERTIFICATE OF ACCOMPLISHMENT — ${activeSubject.nameEn.toUpperCase()} (${student.grade.toUpperCase()})`,
                      citationHt: `Atribye a ${student.fullName} pou akonplisman avèk siksè liv ak egzèsis ${activeSubject.nameHt} nan ${student.grade}.`,
                      citationFr: `Décerné à ${student.fullName} pour l’accomplissement avec succès du cours de ${activeSubject.nameFr} en ${student.grade}.`,
                      citationEn: `Awarded to ${student.fullName} for successful completion of the ${activeSubject.nameEn} course and textbook in ${student.grade}.`,
                      honors: 'Mention Excellence (Summa Cum Laude)',
                      finalAverageScore: 93,
                      academicYear: student.academicYear,
                      issuedAt: new Date().toISOString().slice(0, 10),
                      issuedBy: 'Sindy Salomon — Direktris Jeneral ASLA',
                      status: 'Active',
                    };
                    onIssueCertificate(newCert);
                    setSelectedCertificateId(newCert.id);
                  }}
                  className="px-4 py-2.5 text-xs font-bold bg-[#0B2545] text-white rounded-lg hover:bg-[#133B6E] cursor-pointer whitespace-nowrap"
                >
                  + Jenere Sètifika pou {activeSubject.nameHt}
                </button>
              </div>

              {/* Certificate Selector Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 print:hidden">
                {(studentCertificates.length > 0
                  ? studentCertificates
                  : [defaultPreviewDiploma]
                ).map((cert) => {
                  const isSelected = cert.id === activeCertificate.id;
                  return (
                    <button
                      key={cert.id}
                      type="button"
                      onClick={() => setSelectedCertificateId(cert.id)}
                      className={`p-4 rounded-xl border text-left transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-[#0B2545] text-white border-[#0B2545]'
                          : 'bg-white text-slate-900 border-slate-200 hover:border-slate-400'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs font-mono opacity-80">
                        <span>{cert.certificateType}</span>
                        <span>{cert.issuedAt}</span>
                      </div>
                      <div className="text-sm font-bold mt-1.5 line-clamp-2">
                        {cert.titleHt}
                      </div>
                      <div className="text-xs mt-2 font-mono opacity-90">
                        N° {cert.serialNumber} · {cert.finalAverageScore}%
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Official Parchment Certificate / Diploma Viewer */}
              <CertificateDiplomaView
                certificate={activeCertificate}
                defaultLanguage={language}
              />
            </div>
          )}

          {/* 6. NOTIFICATIONS */}
          {activeMenu === 'Notifications' && (
            <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
              <h2 className="text-xl font-bold text-[#0B2545]">
                Notifikasyon ak Anons Ofisyèl ASLA
              </h2>
              <div className="space-y-3">
                {studentNotifications.map((n) => (
                  <div
                    key={n.id}
                    className="p-4 rounded-xl bg-[#F8FAFC] border border-slate-200 space-y-1 text-xs"
                  >
                    <div className="flex items-center justify-between text-slate-500 font-mono">
                      <span>{n.category}</span>
                      <span>{n.date}</span>
                    </div>
                    <h3 className="text-sm font-bold text-[#0B2545]">{n.title}</h3>
                    <p className="text-slate-700">{n.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 7. PROFILE */}
          {activeMenu === 'Profile' && (
            <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6 max-w-2xl">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-xl font-bold text-[#0B2545]">Pwofil Elèv ASLA</h2>
                <p className="text-xs text-slate-600">
                  Kòd Elèv : {student.studentCode} · Klas Asiyen : {student.grade} (
                  {student.classroom})
                </p>
              </div>

              {profileSaved && (
                <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-semibold">
                  ✓ Enfòmasyon kontak pwofil ou a mete ajou.
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-500 mb-1">Non Konplè</label>
                  <div className="p-2.5 rounded-lg bg-slate-100 font-bold text-[#0B2545]">
                    {student.fullName}
                  </div>
                </div>
                <div>
                  <label className="block font-semibold text-slate-500 mb-1">
                    Nivo Akademik (Grades 7–12)
                  </label>
                  <div className="p-2.5 rounded-lg bg-slate-100 font-bold text-[#B91C1C]">
                    {student.grade} ({student.classroom})
                  </div>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Telefòn Elèv</label>
                  <input
                    type="text"
                    value={profilePhone}
                    onChange={(e) => setProfilePhone(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Kontak Paran / Responsab
                  </label>
                  <input
                    type="text"
                    value={profileParentContact}
                    onChange={(e) => setProfileParentContact(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              <button
                onClick={() => {
                  onUpdateStudentProfile({
                    ...student,
                    phone: profilePhone,
                    parentContact: profileParentContact,
                  });
                  setProfileSaved(true);
                }}
                className="px-5 py-2.5 text-xs font-semibold bg-[#0B2545] text-white rounded-lg hover:bg-[#133B6E] cursor-pointer"
              >
                Anrejistre Chanjman Pwofil
              </button>
            </div>
          )}

          {/* 7B. 💳 PEMAN (COMPLETE IN-DASHBOARD PAYMENT CENTER) */}
          {activeMenu === 'Peman' && (
            <StudentPaymentCenter
              key={paymentCenterInitialType}
              language={language}
              student={student}
              tuitionPayments={studentPayments}
              examPrepPayments={examPrepPayments}
              initialPaymentType={paymentCenterInitialType}
              onSubmitTuitionReceipt={onSubmitTuitionReceipt}
              onSubmitExamPrepReceipt={onSubmitExamPrepPayment}
              onBack={() => setActiveMenu('Dashboard')}
            />
          )}

          {/* 8. PREPARASYON EGZAMEN LETA / FILO */}
          {activeMenu === 'Preparasyon Egzamen Leta / Filo' && (
            <ExamPrepStudentWorkspace
              language={language}
              student={student}
              settings={settings}
              programs={examPrepPrograms}
              subjectConfigs={examPrepSubjects}
              topics={examPrepTopics}
              questions={examPrepQuestions}
              mockExams={examPrepMockExams}
              materials={examPrepMaterials}
              attempts={examPrepAttempts}
              payments={examPrepPayments}
              tuitionPayments={studentPayments}
              studyPlanTasks={examPrepStudyPlan}
              activeSubSection={examPrepSubSection}
              onChangeSubSection={setExamPrepSubSection}
              onSubmitExamPrepPayment={onSubmitExamPrepPayment}
              onSubmitTuitionReceipt={onSubmitTuitionReceipt}
              onOpenMainPaymentCenter={() => {
                setPaymentCenterInitialType('Preparasyon Examen Leta / Filo');
                setActiveMenu('Peman');
              }}
              onRecordAttempt={onRecordExamPrepAttempt}
              onUpdateTopicStatus={onUpdateExamPrepTopicStatus}
              onToggleStudyPlanTask={onToggleExamPrepStudyPlanTask}
              onAddStudyPlanTask={onAddExamPrepStudyPlanTask}
              onBackToDashboard={() => setActiveMenu('Dashboard')}
              onCloseSection={() => setActiveMenu('Dashboard')}
              onSignOut={onSignOut}
            />
          )}
        </main>
      </div>
    </div>
  );
};
