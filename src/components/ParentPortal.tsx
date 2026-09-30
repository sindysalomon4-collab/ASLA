import React, { useMemo, useState } from 'react';
import {
  AcademicCertificate,
  AttendanceRecord,
  ClassroomRecord,
  ExamPrepAttempt,
  ExamPrepPaymentRecord,
  ExamPrepSubjectConfig,
  ExamPrepTopic,
  Language,
  ParentAccount,
  PaymentTransaction,
  SchoolNotification,
  StudentAccount,
  SubjectDefinition,
  WorkSubmission,
} from '../types';
import { TRANSLATIONS } from '../i18n/translations';
import { GRADE_COMPLEXITY_PROFILE } from '../data/syllabusMatrix';
import { generateBookForGradeAndSubject } from '../data/curriculumEngine';
import {
  getStudentExamPrepFee,
  getStudentExamPrepFeeLabelHt,
} from '../data/examPrepData';
import { AslaLogo } from './AslaLogo';
import { CertificateDiplomaView } from './CertificateDiplomaView';
import { Award, Menu } from 'lucide-react';

export type ParentMenuSection =
  | 'Dashboard'
  | 'My Children'
  | 'Preparasyon Egzamen Leta / Filo'
  | "Child's Grade"
  | 'Classroom'
  | 'Academic Books'
  | 'Lessons'
  | 'Assignments'
  | 'Grades'
  | 'Progress'
  | 'Certificates & Diploma'
  | 'Attendance'
  | 'Payments'
  | 'Notifications'
  | 'Profile';

const PARENT_MENU_ITEMS: ParentMenuSection[] = [
  'Dashboard',
  'My Children',
  'Preparasyon Egzamen Leta / Filo',
  "Child's Grade",
  'Classroom',
  'Academic Books',
  'Lessons',
  'Assignments',
  'Grades',
  'Progress',
  'Certificates & Diploma',
  'Attendance',
  'Payments',
  'Notifications',
  'Profile',
];

interface ParentPortalProps {
  language: Language;
  onChangeLanguage: (lang: Language) => void;
  parent: ParentAccount;
  students: StudentAccount[];
  classrooms: ClassroomRecord[];
  subjects: SubjectDefinition[];
  submissions: WorkSubmission[];
  attendance: AttendanceRecord[];
  payments: PaymentTransaction[];
  notifications: SchoolNotification[];
  certificates: AcademicCertificate[];
  examPrepSubjects: ExamPrepSubjectConfig[];
  examPrepTopics: ExamPrepTopic[];
  examPrepAttempts: ExamPrepAttempt[];
  examPrepPayments: ExamPrepPaymentRecord[];
  onGoToPayForStudent: (student: StudentAccount) => void;
  onSignOut: () => void;
}

export const ParentPortal: React.FC<ParentPortalProps> = ({
  language,
  onChangeLanguage,
  parent,
  students,
  classrooms,
  subjects,
  submissions,
  attendance,
  payments,
  notifications,
  certificates,
  examPrepSubjects,
  examPrepTopics,
  examPrepAttempts,
  examPrepPayments,
  onGoToPayForStudent,
  onSignOut,
}) => {
  const t = TRANSLATIONS[language];

  const [activeMenu, setActiveMenu] = useState<ParentMenuSection>('Dashboard');
  const [sidebarOpenDesktop, setSidebarOpenDesktop] = useState(true);
  const [sidebarOpenMobile, setSidebarOpenMobile] = useState(false);

  const childrenList = useMemo(() => {
    const matched = students.filter(
      (s) => parent.childrenIds.includes(s.id) || s.parentId === parent.id
    );
    return matched.length > 0 ? matched : students.slice(0, 3);
  }, [students, parent]);

  const [selectedChildId, setSelectedChildId] = useState<string>(childrenList[0]?.id || 'stu-1');

  const activeChild = useMemo(
    () => childrenList.find((c) => c.id === selectedChildId) || childrenList[0],
    [childrenList, selectedChildId]
  );

  const childSubjects = useMemo(
    () => subjects.filter((s) => s.grade === activeChild.grade),
    [subjects, activeChild.grade]
  );

  const [inspectedSubjectId, setInspectedSubjectId] = useState<string>('');
  const validInspectedSubject = useMemo(
    () => childSubjects.find((s) => s.id === inspectedSubjectId) || childSubjects[0],
    [childSubjects, inspectedSubjectId]
  );

  const inspectedBook = useMemo(
    () => generateBookForGradeAndSubject(activeChild.grade, validInspectedSubject),
    [activeChild.grade, validInspectedSubject]
  );

  const childClassroom = useMemo(
    () => classrooms.find((c) => c.name === activeChild.classroom),
    [classrooms, activeChild.classroom]
  );

  const childSubmissions = useMemo(
    () => submissions.filter((s) => s.studentId === activeChild.id),
    [submissions, activeChild.id]
  );

  const childAttendance = useMemo(
    () => attendance.filter((a) => a.studentId === activeChild.id),
    [attendance, activeChild.id]
  );

  const childCertificates = useMemo(
    () => certificates.filter((c) => c.studentId === activeChild.id && c.status === 'Active'),
    [certificates, activeChild.id]
  );

  const defaultChildCertificate: AcademicCertificate = useMemo(() => {
    const isG12 = activeChild.grade === 'Grade 12';
    const gNum = activeChild.grade.replace('Grade ', '');
    return {
      id: `par-preview-${activeChild.id}`,
      serialNumber: `ASLA-${isG12 ? 'DIP' : 'CERT'}-2026-${gNum.padStart(2, '0')}01-HT`,
      studentId: activeChild.id,
      studentName: activeChild.fullName,
      studentCode: activeChild.studentCode,
      grade: activeChild.grade,
      classroom: activeChild.classroom,
      certificateType: isG12 ? 'High School Diploma' : 'Grade Promotion',
      titleHt: isG12
        ? 'DIPLÒM FINISMAN ETID SEGONDÈ (PHILO / BAC II)'
        : `SÈTIFIKA AKONPLISMAN NIVO AKADEMIK — ${activeChild.grade.toUpperCase()}`,
      titleFr: isG12
        ? 'DIPLÔME DE FIN D’ÉTUDES SECONDAIRES (PHILO / BAC II)'
        : `CERTIFICAT D’ACCOMPLISSEMENT ACADÉMIQUE — ${activeChild.grade.toUpperCase()}`,
      titleEn: isG12
        ? 'OFFICIAL HIGH SCHOOL GRADUATION DIPLOMA (GRADE 12)'
        : `CERTIFICATE OF ACADEMIC ACCOMPLISHMENT — ${activeChild.grade.toUpperCase()}`,
      citationHt: `Atribye a ${activeChild.fullName} pou ekselans akademik ak metriz pwogram ${activeChild.grade} nan Aprantisaj se lò Akademi (ASLA).`,
      citationFr: `Décerné à ${activeChild.fullName} pour l’excellence académique en ${activeChild.grade} à Aprantisaj se lò Akademi (ASLA).`,
      citationEn: `Awarded to ${activeChild.fullName} for academic excellence in ${activeChild.grade} at Aprantisaj se lò Akademi (ASLA).`,
      honors: 'Mention Excellence (Summa Cum Laude)',
      finalAverageScore: 91,
      academicYear: activeChild.academicYear,
      issuedAt: '2026-09-28',
      issuedBy: 'Sindy Salomon — Direktris Jeneral ASLA',
      status: 'Active',
    };
  }, [activeChild]);

  const childPayments = useMemo(
    () =>
      payments.filter(
        (p) =>
          childrenList.some((c) => c.id === p.studentId) ||
          p.parentName.toLowerCase().includes(parent.fullName.toLowerCase())
      ),
    [payments, childrenList, parent.fullName]
  );

  const parentNotifications = useMemo(
    () =>
      notifications.filter(
        (n) =>
          n.targetRole === 'All' ||
          (n.targetRole === 'Parent' && (!n.targetUserId || n.targetUserId === parent.id))
      ),
    [notifications, parent.id]
  );

  return (
    <div className="min-h-screen flex bg-[#F8FAFC] text-[#0F172A]">
      {/* Mobile Overlay Sidebar */}
      {sidebarOpenMobile && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpenMobile(false)} />
          <aside className="relative z-10 w-72 bg-[#0B2545] text-white flex flex-col h-full overflow-y-auto">
            <div className="p-4 border-b border-white/15 flex items-center justify-between">
              <AslaLogo size="sm" theme="dark" subtitle="PORTAIL PARAN (7–12)" />
              <button
                onClick={() => setSidebarOpenMobile(false)}
                className="px-2.5 py-1 text-xs font-semibold bg-white/10 rounded cursor-pointer"
              >
                {t.close}
              </button>
            </div>
            <nav className="p-3 space-y-1 flex-1">
              {PARENT_MENU_ITEMS.map((item) => (
                <button
                  key={item}
                  onClick={() => {
                    setActiveMenu(item);
                    setSidebarOpenMobile(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium cursor-pointer ${
                    activeMenu === item
                      ? 'bg-[#B91C1C] text-white font-semibold'
                      : 'text-slate-200 hover:bg-white/10'
                  }`}
                >
                  {item}
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

      {/* Desktop Collapsible Left Sidebar */}
      {sidebarOpenDesktop && (
        <aside className="hidden lg:flex w-64 shrink-0 bg-[#0B2545] text-white flex-col border-r border-slate-800">
          <div className="p-4 border-b border-white/15 flex items-center justify-between">
            <AslaLogo size="sm" theme="dark" subtitle="PORTAIL PARAN (7–12)" />
            <button
              onClick={() => setSidebarOpenDesktop(false)}
              className="px-2 py-1 text-xs text-slate-300 hover:text-white border border-white/20 rounded cursor-pointer"
            >
              ✕
            </button>
          </div>
          <nav className="p-3 space-y-1 flex-1 overflow-y-auto">
            {PARENT_MENU_ITEMS.map((item) => (
              <button
                key={item}
                onClick={() => setActiveMenu(item)}
                className={`w-full text-left px-3.5 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  activeMenu === item
                    ? 'bg-[#B91C1C] text-white font-semibold'
                    : 'text-slate-200 hover:bg-white/10'
                }`}
              >
                {item}
              </button>
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
              Aprantisaj se lò Akademi (ASLA) · Paran · {activeMenu}
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
          {/* Persistent Multi-Child Selector Bar (Section 21: Child 1, Child 2, Child 3) */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-xs font-semibold text-[#B91C1C]">
                  MY CHILDREN — SIVEYANS AKADEMIK TIMOUN YO NAN GRADES 7–12
                </div>
                <h2 className="text-lg font-bold text-[#0B2545]">
                  Paran : {parent.fullName} · Chwazi Timoun pou Kontwole Pwogrè li :
                </h2>
              </div>
              <span className="text-xs text-slate-500">
                Mòd Lekti Sèlman (Paran pa ka modifye nòt ofisyèl yo)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {childrenList.map((child, idx) => {
                const isSelected = child.id === activeChild.id;
                return (
                  <button
                    key={child.id}
                    onClick={() => setSelectedChildId(child.id)}
                    className={`p-4 rounded-xl border text-left transition-colors cursor-pointer ${
                      isSelected
                        ? 'border-[#0B2545] bg-[#0B2545] text-white'
                        : 'border-slate-200 bg-[#F8FAFC] hover:border-slate-400 text-slate-900'
                    }`}
                  >
                    <div className="text-xs font-mono opacity-80">
                      Child {idx + 1} · {child.studentCode}
                    </div>
                    <div className="text-base font-bold mt-1">{child.fullName}</div>
                    <div className="text-xs mt-1 opacity-90">
                      {child.grade} · {child.classroom}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 1. DASHBOARD & MY CHILDREN OVERVIEW */}
          {(activeMenu === 'Dashboard' || activeMenu === 'My Children') && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 tabular-nums">
                <div className="bg-white p-5 rounded-xl border border-slate-200">
                  <div className="text-xs text-slate-500">Elèv Chwazi a</div>
                  <div className="text-lg font-bold text-[#0B2545] mt-1">
                    {activeChild.fullName}
                  </div>
                  <div className="text-xs text-[#B91C1C] font-semibold mt-0.5">
                    {activeChild.grade} ({activeChild.approvalStatus})
                  </div>
                </div>
                <div className="bg-white p-5 rounded-xl border border-slate-200">
                  <div className="text-xs text-slate-500">Sal Klas & Matyè</div>
                  <div className="text-lg font-bold text-[#0B2545] mt-1">
                    {childSubjects.length} Matyè Ofisyèl
                  </div>
                  <div className="text-xs text-slate-600 truncate mt-0.5">
                    {activeChild.classroom}
                  </div>
                </div>
                <div className="bg-white p-5 rounded-xl border border-slate-200">
                  <div className="text-xs text-slate-500">Leson & Travay Konplete</div>
                  <div className="text-lg font-bold text-[#0B2545] font-mono mt-1">
                    {activeChild.completedLessonIds.length} Leson · {childSubmissions.length} Devoir/Quiz
                  </div>
                  <div className="text-xs text-emerald-700 mt-0.5">● Suivi an tan reyèl</div>
                </div>
                <div className="bg-white p-5 rounded-xl border border-slate-200">
                  <div className="text-xs text-slate-500">Prezans (Attendance)</div>
                  <div className="text-lg font-bold text-emerald-700 font-mono mt-1">
                    {childAttendance.filter((a) => a.status === 'Present').length}/
                    {Math.max(1, childAttendance.length)} Jou Prezan
                  </div>
                  <div className="text-xs text-slate-600 mt-0.5">Ane 2026–2027</div>
                </div>
              </div>

              {/* Quick Navigation Cards for Selected Child */}
              <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
                <h3 className="text-base font-bold text-[#0B2545]">
                  Dosye Akademik Konplè pou {activeChild.fullName} ({activeChild.grade})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-[#F8FAFC] border border-slate-200 space-y-2">
                    <div className="text-xs font-bold text-[#0B2545]">
                      Liv Akademik & Leson ({activeChild.grade})
                    </div>
                    <p className="text-xs text-slate-600">
                      8 liv akademik konplè ({GRADE_COMPLEXITY_PROFILE[activeChild.grade].targetPages}{' '}
                      paj, 16 chapit, 96 leson pa liv).
                    </p>
                    <button
                      onClick={() => setActiveMenu('Academic Books')}
                      className="text-xs font-semibold text-[#0B2545] underline cursor-pointer"
                    >
                      Enspekte Liv {activeChild.grade} yo →
                    </button>
                  </div>

                  <div className="p-4 rounded-xl bg-[#F8FAFC] border border-slate-200 space-y-2">
                    <div className="text-xs font-bold text-[#0B2545]">
                      Nòt Ofisyèl & Devwa ({childSubmissions.length})
                    </div>
                    <p className="text-xs text-slate-600">
                      Konsilte nòt Classwork, Homework, Quiz Chapit ak Egzamen Final (Lekti sèlman).
                    </p>
                    <button
                      onClick={() => setActiveMenu('Grades')}
                      className="text-xs font-semibold text-[#0B2545] underline cursor-pointer"
                    >
                      Konsilte Karne Nòt la →
                    </button>
                  </div>

                  <div className="p-4 rounded-xl bg-[#F8FAFC] border border-slate-200 space-y-2">
                    <div className="text-xs font-bold text-[#0B2545]">
                      Pèman 15,000 HTG & Prezans
                    </div>
                    <p className="text-xs text-slate-600">
                      Stati Pèman : <strong>{activeChild.paymentStatus}</strong> · Stati Apwobasyon :{' '}
                      <strong>{activeChild.approvalStatus}</strong>
                    </p>
                    <button
                      onClick={() => setActiveMenu('Payments')}
                      className="text-xs font-semibold text-[#B91C1C] underline cursor-pointer"
                    >
                      Wè Resi Pèman yo →
                    </button>
                  </div>
                </div>

                {/* Quick Card for Child's Preparasyon Egzamen Leta / Filo */}
                <div className="p-4 rounded-xl bg-[#0B2545] text-white flex flex-wrap items-center justify-between gap-4">
                  <div className="space-y-1 text-xs">
                    <div className="font-mono text-amber-300 font-bold">
                      🎯 PREPARASYON EGZAMEN LETA / FILO — {activeChild.fullName.toUpperCase()}
                    </div>
                    <div>
                      Elijibilite : <strong>{getStudentExamPrepFeeLabelHt(activeChild)}</strong> · Aksè :{' '}
                      <strong>{activeChild.examPrepAccessStatus || 'Payment Required'}</strong> · Peman :{' '}
                      <strong>{activeChild.examPrepPaymentStatus || 'Not Submitted'}</strong>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveMenu('Preparasyon Egzamen Leta / Filo')}
                    className="px-4 py-2 text-xs font-bold bg-[#B91C1C] text-white rounded-lg hover:bg-[#991B1B] cursor-pointer"
                  >
                    Suiv Preparasyon Egzamen Leta Timoun nan →
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 1B. PARENT VIEW: PREPARASYON EGZAMEN LETA / FILO */}
          {activeMenu === 'Preparasyon Egzamen Leta / Filo' && (
            <div className="space-y-6">
              {(() => {
                const childFee = getStudentExamPrepFee(activeChild);
                const childFeeLabel = getStudentExamPrepFeeLabelHt(activeChild);
                const childExamAttempts = examPrepAttempts.filter(
                  (a) => a.studentId === activeChild.id
                );
                const childExamPayments = examPrepPayments.filter(
                  (p) => p.studentId === activeChild.id
                );
                const completedTopics = activeChild.completedExamPrepTopicIds || [];
                const inProgTopics = activeChild.inProgressExamPrepTopicIds || [];

                const subjBreakdowns = examPrepSubjects
                  .filter((s) => s.enabled)
                  .map((subj) => {
                    const sTopics = examPrepTopics.filter(
                      (t) => t.subjectCode === subj.code
                    );
                    const done = sTopics.filter((t) =>
                      completedTopics.includes(t.id)
                    ).length;
                    const inPr = sTopics.filter((t) =>
                      inProgTopics.includes(t.id)
                    ).length;
                    const sAtts = childExamAttempts.filter(
                      (a) => a.subjectCode === subj.code || a.subjectCode === 'MULTI'
                    );
                    const avgAtt =
                      sAtts.length > 0
                        ? Math.round(
                            sAtts.reduce((sum, a) => sum + a.percentage, 0) /
                              sAtts.length
                          )
                        : null;
                    const tPct =
                      sTopics.length > 0
                        ? Math.round(((done + inPr * 0.4) / sTopics.length) * 100)
                        : 0;
                    const pct =
                      avgAtt !== null
                        ? Math.min(100, Math.round(tPct * 0.55 + avgAtt * 0.45))
                        : tPct;
                    return { subj, pct, done, total: sTopics.length };
                  });

                const overallPct =
                  subjBreakdowns.length > 0
                    ? Math.round(
                        subjBreakdowns.reduce((s, b) => s + b.pct, 0) /
                          subjBreakdowns.length
                      )
                    : 0;

                const practiceAtts = childExamAttempts.filter(
                  (a) => a.attemptType === 'Practice' || a.attemptType === 'Topic Quiz'
                );
                const mockAtts = childExamAttempts.filter(
                  (a) =>
                    a.attemptType === 'Mock Exam' ||
                    a.attemptType === 'Similasyon Egzamen'
                );
                const avgPrac =
                  practiceAtts.length > 0
                    ? Math.round(
                        practiceAtts.reduce((s, a) => s + a.percentage, 0) /
                          practiceAtts.length
                      )
                    : 0;
                const avgMock =
                  mockAtts.length > 0
                    ? Math.round(
                        mockAtts.reduce((s, a) => s + a.percentage, 0) /
                          mockAtts.length
                      )
                    : 0;

                return (
                  <>
                    <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
                      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
                        <div>
                          <div className="text-xs font-bold text-[#B91C1C]">
                            SIVEYANS PARAN · PREPARASYON EGZAMEN LETA / FILO
                          </div>
                          <h2 className="text-2xl font-bold text-[#0B2545] mt-0.5">
                            {activeChild.fullName} — {activeChild.grade} ({activeChild.classroom})
                          </h2>
                          <p className="text-xs text-slate-600 mt-1">
                            {childFeeLabel}
                          </p>
                        </div>
                        <div className="text-right font-mono text-xs space-y-1">
                          <div>
                            Tip Elèv :{' '}
                            <strong>
                              {activeChild.examPrepStudentType || 'ASLA Student'}
                            </strong>
                          </div>
                          <div>
                            Stati Peman ({childFee.toLocaleString()} HTG) :{' '}
                            <strong className="text-[#0B2545]">
                              {activeChild.examPrepPaymentStatus || 'Not Submitted'}
                            </strong>
                          </div>
                          <div>
                            Stati Aksè :{' '}
                            <strong
                              className={
                                activeChild.examPrepAccessStatus === 'Active'
                                  ? 'text-emerald-700'
                                  : 'text-amber-700'
                              }
                            >
                              {activeChild.examPrepAccessStatus || 'Payment Required'}
                            </strong>
                          </div>
                        </div>
                      </div>

                      {/* Parent KPIs for Selected Child */}
                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 tabular-nums">
                        <div className="p-4 rounded-xl bg-[#F8FAFC] border border-slate-200">
                          <div className="text-xs text-slate-500">
                            Pwogrè Jeneral Egzamen
                          </div>
                          <div className="text-2xl font-bold text-[#0B2545] font-mono mt-1">
                            {overallPct}%
                          </div>
                        </div>
                        <div className="p-4 rounded-xl bg-[#F8FAFC] border border-slate-200">
                          <div className="text-xs text-slate-500">
                            Mwayèn Egzèsis Pratik
                          </div>
                          <div className="text-2xl font-bold text-[#0B2545] font-mono mt-1">
                            {avgPrac}%
                          </div>
                        </div>
                        <div className="p-4 rounded-xl bg-[#F8FAFC] border border-slate-200">
                          <div className="text-xs text-slate-500">
                            Nòt Mock Exams / Similasyon
                          </div>
                          <div className="text-2xl font-bold text-[#B91C1C] font-mono mt-1">
                            {avgMock}%
                          </div>
                        </div>
                        <div className="p-4 rounded-xl bg-[#F8FAFC] border border-slate-200">
                          <div className="text-xs text-slate-500">
                            Sijè Revizyon Konplete
                          </div>
                          <div className="text-2xl font-bold text-emerald-700 font-mono mt-1">
                            {completedTopics.length}/{examPrepTopics.length}
                          </div>
                        </div>
                      </div>

                      {/* Teacher / Admin Recommendation & Weak Areas */}
                      {activeChild.teacherExamPrepRecommendation && (
                        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-950 space-y-1">
                          <div className="font-bold">
                            Rekòmandasyon Pwofesè & Administrasyon ASLA pou{' '}
                            {activeChild.fullName} :
                          </div>
                          <p>{activeChild.teacherExamPrepRecommendation}</p>
                        </div>
                      )}

                      {/* Subject-by-Subject Progress */}
                      <div className="space-y-3 pt-2">
                        <h3 className="text-sm font-bold text-[#0B2545]">
                          Pwogrè pa Matyè nan Preparasyon Egzamen Leta (9 Matyè Ofisyèl, enkli Istwa D Ayiti) :
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          {subjBreakdowns.map(({ subj, pct, done, total }) => (
                            <div
                              key={subj.code}
                              className="p-3.5 rounded-xl bg-[#F8FAFC] border border-slate-200 space-y-1.5 text-xs"
                            >
                              <div className="flex justify-between font-bold text-[#0B2545]">
                                <span>{subj.nameHt}</span>
                                <span className="font-mono">{pct}%</span>
                              </div>
                              <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-[#0B2545] rounded-full"
                                  style={{ width: `${pct}%` }}
                                />
                              </div>
                              <div className="text-[11px] text-slate-500">
                                {done}/{total} sijè konplete
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Child's Exam Attempts & Exam Prep Payment History */}
                    <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4 text-xs">
                      <h3 className="text-base font-bold text-[#0B2545]">
                        Rezilta Egzèsis & Similasyon Egzamen Leta pou {activeChild.fullName}
                      </h3>
                      {childExamAttempts.length === 0 ? (
                        <p className="text-slate-500">
                          Timoun nan poko gen tantativ similasyon anrejistre.
                        </p>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full text-left border-collapse tabular-nums">
                            <thead>
                              <tr className="border-b border-slate-200 text-slate-500">
                                <th className="py-2.5 px-3">Dat</th>
                                <th className="py-2.5 px-3">Tip</th>
                                <th className="py-2.5 px-3">Matyè & Egzamen</th>
                                <th className="py-2.5 px-3">Nòt</th>
                                <th className="py-2.5 px-3">Stati</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                              {childExamAttempts.map((a) => (
                                <tr key={a.id}>
                                  <td className="py-2.5 px-3 font-mono">{a.date}</td>
                                  <td className="py-2.5 px-3">{a.attemptType}</td>
                                  <td className="py-2.5 px-3 font-bold text-[#0B2545]">
                                    {a.titleHt} ({a.subjectNameHt})
                                  </td>
                                  <td className="py-2.5 px-3 font-mono font-bold">
                                    {a.percentage}% ({a.scorePoints}/{a.totalPoints})
                                  </td>
                                  <td className="py-2.5 px-3 font-bold">
                                    {a.passed ? (
                                      <span className="text-emerald-700">● Pass</span>
                                    ) : (
                                      <span className="text-amber-700">
                                        ▲ Needs Review
                                      </span>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}

                      {childExamPayments.length > 0 && (
                        <div className="pt-4 border-t border-slate-100 space-y-2">
                          <h4 className="font-bold text-[#0B2545]">
                            Resi Peman Preparasyon Egzamen Leta ({childFee.toLocaleString()} HTG) :
                          </h4>
                          {childExamPayments.map((p) => (
                            <div
                              key={p.id}
                              className="p-3 rounded-lg bg-[#F8FAFC] border border-slate-200 flex flex-wrap justify-between gap-2 font-mono"
                            >
                              <span>
                                {p.submittedAt} · {p.paymentMethod} · {p.transactionReference}
                              </span>
                              <span className="font-bold text-[#0B2545]">
                                {p.submittedAmountHtg} HTG — {p.status}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </>
                );
              })()}
            </div>
          )}

          {/* 2. CHILD'S GRADE & CLASSROOM */}
          {(activeMenu === "Child's Grade" || activeMenu === 'Classroom') && (
            <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-5">
              <div className="border-b border-slate-100 pb-4">
                <div className="text-xs font-semibold text-[#B91C1C]">
                  ENFÒMASYON SAL KLAS AK NIVO TIMOUN NAN
                </div>
                <h2 className="text-xl font-bold text-[#0B2545] mt-1">
                  {activeChild.fullName} — {activeChild.grade} ({activeChild.classroom})
                </h2>
                <p className="text-xs text-slate-600 mt-1">
                  Pwofesè Titilè : {childClassroom?.homeroomTeacher || 'Pwof. Direksyon ASLA'} · Sal :{' '}
                  {childClassroom?.roomNumber} · Orè : {childClassroom?.scheduleSummary}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {childSubjects.map((subj) => (
                  <div
                    key={subj.id}
                    className="p-4 rounded-xl bg-[#F8FAFC] border border-slate-200 space-y-2"
                  >
                    <div className="text-xs font-mono text-slate-500">
                      {subj.code} · Koef. {subj.coefficient}
                    </div>
                    <div className="text-sm font-bold text-[#0B2545]">{subj.nameHt}</div>
                    <p className="text-xs text-slate-600">{subj.descriptionHt}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. ACADEMIC BOOKS & LESSONS */}
          {(activeMenu === 'Academic Books' || activeMenu === 'Lessons') && (
            <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-xl font-bold text-[#0B2545]">
                    Liv Akademik & Leson pou {activeChild.fullName} ({activeChild.grade})
                  </h2>
                  <p className="text-xs text-slate-600">
                    Chwazi yon matyè pou wè tout 16 chapit ak 96 leson timoun ou an ap etidye.
                  </p>
                </div>
                <select
                  value={validInspectedSubject.id}
                  onChange={(e) => setInspectedSubjectId(e.target.value)}
                  className="px-3.5 py-2 text-xs font-semibold rounded-lg border border-slate-300 bg-white"
                >
                  {childSubjects.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.nameHt} ({activeChild.grade})
                    </option>
                  ))}
                </select>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1 text-xs">
                <div className="font-bold text-[#0B2545] text-sm">{inspectedBook.title}</div>
                <p className="text-slate-600">{inspectedBook.introduction}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {inspectedBook.chapters.map((ch) => (
                  <div
                    key={ch.id}
                    className="p-4 rounded-xl border border-slate-200 bg-[#F8FAFC] space-y-2"
                  >
                    <div className="flex items-center justify-between text-xs font-mono text-slate-500">
                      <span>Chapit {ch.chapterNumber}/16</span>
                      <span>Paj {ch.pageStart}–{ch.pageEnd}</span>
                    </div>
                    <h4 className="text-sm font-bold text-[#0B2545]">{ch.title}</h4>
                    <ul className="text-xs text-slate-600 space-y-1 pt-1">
                      {ch.lessons.map((ls) => {
                        const completed = activeChild.completedLessonIds.includes(ls.id);
                        return (
                          <li key={ls.id} className="flex items-center justify-between gap-2">
                            <span className="truncate">{ls.title}</span>
                            <span
                              className={`font-mono shrink-0 ${
                                completed ? 'text-emerald-700 font-bold' : 'text-slate-400'
                              }`}
                            >
                              {completed ? '✓ Konplè' : 'An kour'}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. ASSIGNMENTS, GRADES & PROGRESS (Read-only official grades for parent) */}
          {(activeMenu === 'Assignments' ||
            activeMenu === 'Grades' ||
            activeMenu === 'Progress') && (
            <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-xl font-bold text-[#0B2545]">
                    Nòt Ofisyèl, Devwa ak Pwogrè — {activeChild.fullName} ({activeChild.grade})
                  </h2>
                  <p className="text-xs text-slate-500">
                    Paran yo ka swiv tout nòt ak travay timoun yo, men yo pa ka modifye nòt ofisyèl lekòl la.
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs tabular-nums">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500">
                      <th className="py-3 px-3">Dat</th>
                      <th className="py-3 px-3">Matyè</th>
                      <th className="py-3 px-3">Tip Travay</th>
                      <th className="py-3 px-3">Tit</th>
                      <th className="py-3 px-3">Stati</th>
                      <th className="py-3 px-3 text-right">Nòt Ofisyèl</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {childSubmissions.map((sub) => (
                      <tr key={sub.id}>
                        <td className="py-3 px-3 font-mono">{sub.submittedAt}</td>
                        <td className="py-3 px-3 font-semibold text-[#0B2545]">
                          {sub.subjectName}
                        </td>
                        <td className="py-3 px-3">{sub.workType}</td>
                        <td className="py-3 px-3">{sub.title}</td>
                        <td className="py-3 px-3 font-semibold text-emerald-700">
                          ● {sub.status}
                        </td>
                        <td className="py-3 px-3 text-right font-mono font-bold text-[#0B2545]">
                          {sub.score !== null ? `${sub.score}/100 (${sub.letterGrade})` : 'Soumèt'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Visual Progress by Subject */}
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <h3 className="text-sm font-bold text-[#0B2545]">
                  Pwogrè Vizyèl pa Matyè pou {activeChild.fullName} ({activeChild.grade}) :
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {childSubjects.map((subj, idx) => {
                    const done = activeChild.completedLessonIds.filter((id) =>
                      id.startsWith(subj.id)
                    ).length;
                    const pct = Math.min(100, Math.max(15, done * 15 + (idx % 3) * 7));
                    return (
                      <div
                        key={subj.id}
                        className="p-3.5 rounded-xl bg-[#F8FAFC] border border-slate-200 space-y-1.5"
                      >
                        <div className="flex justify-between text-xs">
                          <span className="font-bold text-[#0B2545]">{subj.nameHt}</span>
                          <span className="font-mono tabular-nums">{pct}%</span>
                        </div>
                        <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#0B2545] rounded-full"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* 5. ATTENDANCE */}
          {activeMenu === 'Attendance' && (
            <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
              <h2 className="text-xl font-bold text-[#0B2545]">
                Dosye Prezans — {activeChild.fullName} ({activeChild.grade})
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs tabular-nums">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500">
                      <th className="py-3 px-3">Dat</th>
                      <th className="py-3 px-3">Sal Klas</th>
                      <th className="py-3 px-3">Stati</th>
                      <th className="py-3 px-3">Nòt Administrasyon</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {childAttendance.map((att) => (
                      <tr key={att.id}>
                        <td className="py-3 px-3 font-mono">{att.date}</td>
                        <td className="py-3 px-3">{att.classroom}</td>
                        <td className="py-3 px-3 font-bold text-[#0B2545]">{att.status}</td>
                        <td className="py-3 px-3 text-slate-600">{att.note}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 6. PAYMENTS (15,000 HTG) */}
          {activeMenu === 'Payments' && (
            <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-xl font-bold text-[#0B2545]">
                    Istorik Pèman Frè Enskripsyon (15,000 HTG pa Elèv)
                  </h2>
                  <p className="text-xs text-slate-600">
                    Suivi resi MonCash, Natcash ak Labank pou tout timoun ou yo nan ASLA.
                  </p>
                </div>
                <button
                  onClick={() => onGoToPayForStudent(activeChild)}
                  className="px-4 py-2 text-xs font-semibold bg-[#B91C1C] text-white rounded-lg hover:bg-[#991B1B] cursor-pointer"
                >
                  Soumèt / Nouvo Resi 15,000 HTG pou {activeChild.fullName}
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs tabular-nums">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500">
                      <th className="py-3 px-3">Dat</th>
                      <th className="py-3 px-3">Elèv</th>
                      <th className="py-3 px-3">Klas</th>
                      <th className="py-3 px-3">Metòd & Referans</th>
                      <th className="py-3 px-3">Resi</th>
                      <th className="py-3 px-3">Montan</th>
                      <th className="py-3 px-3">Stati</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {childPayments.map((pay) => (
                      <tr key={pay.id}>
                        <td className="py-3 px-3 font-mono">{pay.date}</td>
                        <td className="py-3 px-3 font-bold text-[#0B2545]">{pay.studentName}</td>
                        <td className="py-3 px-3">{pay.grade}</td>
                        <td className="py-3 px-3 font-mono">
                          {pay.paymentMethod} · {pay.transactionNumber}
                        </td>
                        <td className="py-3 px-3 font-mono text-slate-600">
                          {pay.receiptFileName}
                        </td>
                        <td className="py-3 px-3 font-mono font-bold">15,000 HTG</td>
                        <td className="py-3 px-3 font-bold">
                          {pay.status === 'Approved' && (
                            <span className="text-emerald-700">● Approved</span>
                          )}
                          {pay.status === 'Pending' && (
                            <span className="text-amber-700">▲ Pending</span>
                          )}
                          {pay.status === 'Rejected' && (
                            <span className="text-red-700">✕ Rejected</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 6B. CERTIFICATES & DIPLOMA FOR SELECTED CHILD */}
          {activeMenu === 'Certificates & Diploma' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-wrap items-center justify-between gap-4 print:hidden">
                <div>
                  <p className="text-xs font-bold text-[#B91C1C]">
                    SÈTIFIKA AK DIPLÒM OFISYÈL TIMOUN NAN
                  </p>
                  <h2 className="text-xl font-bold text-[#0B2545] mt-0.5">
                    Sètifika Akonplisman & Diplòm — {activeChild.fullName} ({activeChild.grade})
                  </h2>
                  <p className="text-xs text-slate-600 mt-1">
                    Konsilte, enprime, oswa telechaje sètifika akonplisman ak diplòm ofisyèl pou {activeChild.fullName}.
                  </p>
                </div>
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0B3B75]">
                  <Award className="w-4 h-4 text-[#D97706]" />
                  <span>{childCertificates.length || 1} Sètifika / Diplòm Aktif</span>
                </span>
              </div>

              <CertificateDiplomaView
                certificate={childCertificates[0] || defaultChildCertificate}
                defaultLanguage={language}
              />
            </div>
          )}

          {/* 7. NOTIFICATIONS & PROFILE */}
          {activeMenu === 'Notifications' && (
            <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
              <h2 className="text-xl font-bold text-[#0B2545]">Notifikasyon Paran</h2>
              <div className="space-y-3">
                {parentNotifications.map((n) => (
                  <div
                    key={n.id}
                    className="p-4 rounded-xl bg-[#F8FAFC] border border-slate-200 space-y-1 text-xs"
                  >
                    <div className="flex justify-between font-mono text-slate-500">
                      <span>{n.category}</span>
                      <span>{n.date}</span>
                    </div>
                    <div className="font-bold text-[#0B2545]">{n.title}</div>
                    <p className="text-slate-700">{n.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeMenu === 'Profile' && (
            <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4 max-w-xl">
              <h2 className="text-xl font-bold text-[#0B2545]">Pwofil Paran ASLA</h2>
              <div className="space-y-2 text-xs">
                <div>
                  <strong>Non Konplè :</strong> {parent.fullName}
                </div>
                <div>
                  <strong>Imèl :</strong> {parent.email}
                </div>
                <div>
                  <strong>Telefòn :</strong> {parent.phone}
                </div>
                <div>
                  <strong>Timoun Enskri ({childrenList.length}) :</strong>{' '}
                  {childrenList.map((c) => `${c.fullName} (${c.grade})`).join(', ')}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
