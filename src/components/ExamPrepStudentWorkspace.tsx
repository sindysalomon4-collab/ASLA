import React, { useEffect, useMemo, useState } from 'react';
import {
  ExamPrepAttempt,
  ExamPrepDifficulty,
  ExamPrepMaterial,
  ExamPrepMockExam,
  ExamPrepPaymentRecord,
  ExamPrepProgram,
  ExamPrepQuestion,
  ExamPrepQuestionType,
  ExamPrepStudyPlanTask,
  ExamPrepSubjectCode,
  ExamPrepSubjectConfig,
  ExamPrepTopic,
  Language,
  PaymentTransaction,
  SchoolSettings,
  StudentAccount,
} from '../types';
import {
  getStudentExamPrepFee,
  getStudentExamPrepFeeLabelHt,
} from '../data/examPrepData';
import { StudentPaymentCenter } from './StudentPaymentCenter';
import {
  AlertTriangle,
  Award,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  CreditCard,
  FileText,
  Filter,
  HelpCircle,
  Lock,
  Play,
  Printer,
  RotateCcw,
  Target,
  TrendingUp,
  Upload,
} from 'lucide-react';

export type ExamPrepSubSection =
  | 'Dashboard Preparasyon'
  | 'Revizyon pa Matyè'
  | 'Egzèsis'
  | 'Kesyon Tip Egzamen'
  | 'Similasyon Egzamen'
  | 'Mock Exams'
  | 'Gid Revizyon'
  | 'Rezilta'
  | 'Pwogrè'
  | 'Plan Etid'
  | 'Peman / Aksè';

export const EXAM_PREP_SUBSECTIONS: ExamPrepSubSection[] = [
  'Dashboard Preparasyon',
  'Revizyon pa Matyè',
  'Egzèsis',
  'Kesyon Tip Egzamen',
  'Similasyon Egzamen',
  'Mock Exams',
  'Gid Revizyon',
  'Rezilta',
  'Pwogrè',
  'Plan Etid',
  'Peman / Aksè',
];

interface ExamPrepStudentWorkspaceProps {
  language: Language;
  student: StudentAccount;
  settings: SchoolSettings;
  programs: ExamPrepProgram[];
  subjectConfigs: ExamPrepSubjectConfig[];
  topics: ExamPrepTopic[];
  questions: ExamPrepQuestion[];
  mockExams: ExamPrepMockExam[];
  materials: ExamPrepMaterial[];
  attempts: ExamPrepAttempt[];
  payments: ExamPrepPaymentRecord[];
  tuitionPayments: PaymentTransaction[];
  studyPlanTasks: ExamPrepStudyPlanTask[];
  activeSubSection: ExamPrepSubSection;
  onChangeSubSection: (sub: ExamPrepSubSection) => void;
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
  onOpenMainPaymentCenter: () => void;
  onRecordAttempt: (attempt: Omit<ExamPrepAttempt, 'id' | 'date'>) => void;
  onUpdateTopicStatus: (
    topicId: string,
    status: 'Completed' | 'In Progress' | 'Not Started'
  ) => void;
  onToggleStudyPlanTask: (taskId: string) => void;
  onAddStudyPlanTask: (
    task: Omit<ExamPrepStudyPlanTask, 'id' | 'studentId' | 'completed'>
  ) => void;
  onBackToDashboard: () => void;
  onCloseSection: () => void;
  onSignOut: () => void;
}

export const ExamPrepStudentWorkspace: React.FC<ExamPrepStudentWorkspaceProps> = ({
  language,
  student,
  programs,
  subjectConfigs,
  topics,
  questions,
  mockExams,
  materials,
  attempts,
  payments,
  tuitionPayments,
  studyPlanTasks,
  activeSubSection,
  onChangeSubSection,
  onSubmitExamPrepPayment,
  onSubmitTuitionReceipt,
  onOpenMainPaymentCenter,
  onRecordAttempt,
  onUpdateTopicStatus,
  onToggleStudyPlanTask,
  onAddStudyPlanTask,
  onBackToDashboard,
  onCloseSection,
  onSignOut,
}) => {
  // Determine Student Program & Eligibility
  const activeProgram = useMemo(
    () =>
      programs.find((p) => p.targetGrades.includes(student.grade)) ||
      programs[programs.length - 1],
    [programs, student.grade]
  );

  const enabledSubjects = useMemo(
    () =>
      subjectConfigs.filter(
        (sc) => sc.enabled && activeProgram?.enabledSubjects.includes(sc.code)
      ),
    [subjectConfigs, activeProgram]
  );

  const expectedFee = getStudentExamPrepFee(student);
  const feeLabelHt = getStudentExamPrepFeeLabelHt(student);
  const studentType = student.examPrepStudentType || 'ASLA Student';
  const accessStatus = student.examPrepAccessStatus || 'Payment Required';
  const paymentStatus = student.examPrepPaymentStatus || 'Not Submitted';
  const hasActiveAccess = accessStatus === 'Active' && paymentStatus === 'Approved';

  const studentPayments = useMemo(
    () => payments.filter((p) => p.studentId === student.id),
    [payments, student.id]
  );
  const latestPayment = studentPayments[0];

  const studentAttempts = useMemo(
    () => attempts.filter((a) => a.studentId === student.id),
    [attempts, student.id]
  );

  const completedTopicIds = student.completedExamPrepTopicIds || [];
  const inProgressTopicIds = student.inProgressExamPrepTopicIds || [];

  // Calculate dynamic subject progress (Never hardcode percentages!)
  const subjectProgressStats = useMemo(() => {
    return enabledSubjects.map((subj) => {
      const subjTopics = topics.filter((t) => t.subjectCode === subj.code);
      const completedCount = subjTopics.filter((t) =>
        completedTopicIds.includes(t.id)
      ).length;
      const inProgCount = subjTopics.filter((t) =>
        inProgressTopicIds.includes(t.id)
      ).length;

      const subjAttempts = studentAttempts.filter(
        (a) => a.subjectCode === subj.code || a.subjectCode === 'MULTI'
      );
      const avgAttemptScore =
        subjAttempts.length > 0
          ? Math.round(
              subjAttempts.reduce((sum, a) => sum + a.percentage, 0) /
                subjAttempts.length
            )
          : null;

      const topicRatio =
        subjTopics.length > 0
          ? Math.round(
              ((completedCount + inProgCount * 0.4) / subjTopics.length) * 100
            )
          : 0;

      const calculatedProgress =
        avgAttemptScore !== null
          ? Math.min(100, Math.round(topicRatio * 0.55 + avgAttemptScore * 0.45))
          : topicRatio;

      return {
        subject: subj,
        totalTopics: subjTopics.length,
        completedCount,
        inProgCount,
        attemptsCount: subjAttempts.length,
        avgScore: avgAttemptScore,
        progressPercent: calculatedProgress,
      };
    });
  }, [enabledSubjects, topics, completedTopicIds, inProgressTopicIds, studentAttempts]);

  const overallProgressPercent = useMemo(() => {
    if (subjectProgressStats.length === 0) return 0;
    const sum = subjectProgressStats.reduce((acc, s) => acc + s.progressPercent, 0);
    return Math.round(sum / subjectProgressStats.length);
  }, [subjectProgressStats]);

  const practiceAttempts = useMemo(
    () =>
      studentAttempts.filter(
        (a) =>
          a.attemptType === 'Practice' ||
          a.attemptType === 'Topic Quiz' ||
          a.attemptType === 'Kesyon Tip Egzamen'
      ),
    [studentAttempts]
  );

  const mockExamAttempts = useMemo(
    () =>
      studentAttempts.filter(
        (a) => a.attemptType === 'Mock Exam' || a.attemptType === 'Similasyon Egzamen'
      ),
    [studentAttempts]
  );

  const avgPracticeScore = useMemo(() => {
    if (practiceAttempts.length === 0) return 0;
    return Math.round(
      practiceAttempts.reduce((sum, a) => sum + a.percentage, 0) /
        practiceAttempts.length
    );
  }, [practiceAttempts]);

  const avgMockExamScore = useMemo(() => {
    if (mockExamAttempts.length === 0) return 0;
    return Math.round(
      mockExamAttempts.reduce((sum, a) => sum + a.percentage, 0) /
        mockExamAttempts.length
    );
  }, [mockExamAttempts]);

  const topicsNeedingReview = useMemo(() => {
    const weakFromAttempts = new Set<string>();
    studentAttempts.forEach((a) => {
      if (a.percentage < 65) {
        a.weakTopicsHt.forEach((wt) => weakFromAttempts.add(wt));
      }
    });
    const uncompleted = topics
      .filter((t) => !completedTopicIds.includes(t.id))
      .map((t) => `${t.subjectNameHt}: ${t.titleHt}`);
    return Array.from(new Set([...Array.from(weakFromAttempts), ...uncompleted])).slice(
      0,
      5
    );
  }, [studentAttempts, topics, completedTopicIds]);

  // --- STATE FOR REVISION BY SUBJECT ---
  const [selectedSubjectCode, setSelectedSubjectCode] =
    useState<ExamPrepSubjectCode>('ISTW');
  const [selectedTopicId, setSelectedTopicId] = useState<string>('ept-istw-1');
  const [revisionTab, setRevisionTab] = useState<
    'LESSON' | 'EXAMPLES' | 'PRACTICE' | 'EXAM_QUESTIONS' | 'REVIEW' | 'QUIZ'
  >('LESSON');
  const [topicQuizAnswers, setTopicQuizAnswers] = useState<Record<string, string>>({});
  const [topicQuizSubmitted, setTopicQuizSubmitted] = useState(false);

  const subjectTopics = useMemo(
    () => topics.filter((t) => t.subjectCode === selectedSubjectCode),
    [topics, selectedSubjectCode]
  );

  const activeTopic = useMemo(
    () =>
      subjectTopics.find((t) => t.id === selectedTopicId) ||
      subjectTopics[0] ||
      topics[0],
    [subjectTopics, selectedTopicId, topics]
  );

  // --- STATE FOR PRACTICE EXERCISES (EGZÈSIS) ---
  const [practiceSubjectFilter, setPracticeSubjectFilter] = useState<
    ExamPrepSubjectCode | 'ALL'
  >('ALL');
  const [practiceDifficultyFilter, setPracticeDifficultyFilter] = useState<
    ExamPrepDifficulty | 'ALL'
  >('ALL');
  const [practiceTypeFilter, setPracticeTypeFilter] = useState<
    ExamPrepQuestionType | 'ALL'
  >('ALL');
  const [practiceAnswers, setPracticeAnswers] = useState<Record<string, string>>({});
  const [practiceCheckedIds, setPracticeCheckedIds] = useState<Record<string, boolean>>(
    {}
  );
  const [practiceSessionResult, setPracticeSessionResult] = useState<{
    score: number;
    total: number;
    percentage: number;
  } | null>(null);

  const filteredPracticeQuestions = useMemo(() => {
    return questions.filter((q) => {
      if (practiceSubjectFilter !== 'ALL' && q.subjectCode !== practiceSubjectFilter)
        return false;
      if (
        practiceDifficultyFilter !== 'ALL' &&
        q.difficulty !== practiceDifficultyFilter
      )
        return false;
      if (practiceTypeFilter !== 'ALL' && q.questionType !== practiceTypeFilter)
        return false;
      return true;
    });
  }, [questions, practiceSubjectFilter, practiceDifficultyFilter, practiceTypeFilter]);

  // --- STATE FOR SIMILASYON EGZAMEN & MOCK EXAMS ---
  const [activeMockExamId, setActiveMockExamId] = useState<string>(
    mockExams[0]?.id || 'mock-full-official'
  );
  const [examRunning, setExamRunning] = useState(false);
  const [examCurrentIdx, setExamCurrentIdx] = useState(0);
  const [examAnswers, setExamAnswers] = useState<Record<string, string>>({});
  const [examSavedNotice, setExamSavedNotice] = useState(false);
  const [examReviewMode, setExamReviewMode] = useState(false);
  const [examSecondsLeft, setExamSecondsLeft] = useState(3600);
  const [completedExamReport, setCompletedExamReport] =
    useState<ExamPrepAttempt | null>(null);

  const selectedMockExam = useMemo(
    () => mockExams.find((m) => m.id === activeMockExamId) || mockExams[0],
    [mockExams, activeMockExamId]
  );

  // Countdown timer for active exam simulation
  useEffect(() => {
    if (!examRunning) return;
    if (examSecondsLeft <= 0) {
      handleFinishMockExam();
      return;
    }
    const timer = window.setInterval(() => {
      setExamSecondsLeft((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [examRunning, examSecondsLeft]);

  const startMockExamSession = (mock: ExamPrepMockExam) => {
    setActiveMockExamId(mock.id);
    setExamAnswers({});
    setExamCurrentIdx(0);
    setExamReviewMode(false);
    setCompletedExamReport(null);
    setExamSecondsLeft(mock.durationMinutes * 60);
    setExamRunning(true);
  };

  const handleFinishMockExam = () => {
    if (!selectedMockExam) return;
    let earnedPoints = 0;
    let totalPossible = 0;
    const weakSet = new Set<string>();

    selectedMockExam.questions.forEach((q) => {
      totalPossible += q.points;
      const ans = (examAnswers[q.id] || '').trim();
      if (ans && ans.toLowerCase() === q.correctAnswer.trim().toLowerCase()) {
        earnedPoints += q.points;
      } else {
        weakSet.add(`${q.subjectNameHt}: ${q.topicTitleHt}`);
      }
    });

    const pct =
      totalPossible > 0 ? Math.round((earnedPoints / totalPossible) * 100) : 0;
    const passed = pct >= selectedMockExam.passingScorePercent;
    const elapsedMinutes = Math.max(
      1,
      Math.ceil((selectedMockExam.durationMinutes * 60 - examSecondsLeft) / 60)
    );
    const prevAttemptsCount = studentAttempts.filter(
      (a) => a.mockExamId === selectedMockExam.id
    ).length;

    const newAttemptPayload: Omit<ExamPrepAttempt, 'id' | 'date'> = {
      studentId: student.id,
      studentName: student.fullName,
      grade: student.grade,
      attemptType: selectedMockExam.isFullSimulation
        ? 'Similasyon Egzamen'
        : 'Mock Exam',
      mockExamId: selectedMockExam.id,
      subjectCode: selectedMockExam.subjectCode,
      subjectNameHt: selectedMockExam.subjectNameHt,
      titleHt: selectedMockExam.titleHt,
      attemptNumber: prevAttemptsCount + 1,
      timeUsedMinutes: elapsedMinutes,
      scorePoints: earnedPoints,
      totalPoints: totalPossible,
      percentage: pct,
      passed,
      answers: { ...examAnswers },
      weakTopicsHt: Array.from(weakSet),
      recommendedLessonsHt:
        weakSet.size > 0
          ? Array.from(weakSet).map((w) => `Revize leson ak egzèsis sou ${w}`)
          : ['Ekselan pèfòmans! Kontinye fè similasyon kronometre yo.'],
    };

    onRecordAttempt(newAttemptPayload);
    setExamRunning(false);
    setExamReviewMode(false);
    setCompletedExamReport({
      ...newAttemptPayload,
      id: `epa-temp-${Date.now()}`,
      date: new Date().toISOString().slice(0, 10),
    });
  };

  // --- STATE FOR PAYMENT FORM ---
  const [payMethod, setPayMethod] = useState<
    'MonCash' | 'Natcash' | 'Sogebank' | 'BNC' | 'Unibank'
  >('MonCash');
  const [payTxRef, setPayTxRef] = useState('');
  const [payReceiptName, setPayReceiptName] = useState('');
  const [payReceiptDataUrl, setPayReceiptDataUrl] = useState<string | undefined>(
    undefined
  );
  const [paySubmittedBanner, setPaySubmittedBanner] = useState(false);

  const handleReceiptFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPayReceiptName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setPayReceiptDataUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  // --- STATE FOR STUDY PLAN ---
  const [newTaskDay, setNewTaskDay] = useState('Lendi');
  const [newTaskSubj, setNewTaskSubj] = useState<ExamPrepSubjectCode>('ISTW');
  const [newTaskTopic, setNewTaskTopic] = useState('');
  const [newTaskType, setNewTaskType] =
    useState<ExamPrepStudyPlanTask['activityType']>('Revizyon Leson');
  const [newTaskDuration, setNewTaskDuration] = useState(45);

  const studentStudyTasks = useMemo(
    () =>
      studyPlanTasks.filter(
        (t) => t.studentId === student.id || t.studentId === 'stu-2'
      ),
    [studyPlanTasks, student.id]
  );

  // Format seconds as MM:SS
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // Protected subsections that require Active Access (Approved 500 HTG or 2,000 HTG payment)
  const isProtectedSubSection = [
    'Revizyon pa Matyè',
    'Egzèsis',
    'Kesyon Tip Egzamen',
    'Similasyon Egzamen',
    'Mock Exams',
    'Gid Revizyon',
  ].includes(activeSubSection);

  return (
    <div className="space-y-6">
      {/* Top Header Banner for Preparation Examen Leta / Filo */}
      <div className="bg-[#0B2545] text-white rounded-xl p-6 border border-slate-800 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-amber-300">
              <span>🎯 PREPARASYON EGZAMEN LETA / FILO (MENFP)</span>
              <span>·</span>
              <span>{activeProgram?.code}</span>
              <span>·</span>
              <span>{student.grade}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-display">
              {activeProgram?.titleHt || 'Preparasyon Egzamen Leta / Filo'}
            </h1>
            <p className="text-xs text-slate-300 max-w-3xl">
              {activeProgram?.descriptionHt}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => onChangeSubSection('Peman / Aksè')}
              className={`px-3.5 py-2 text-xs font-bold rounded-lg cursor-pointer ${
                hasActiveAccess
                  ? 'bg-emerald-600 text-white'
                  : 'bg-[#FACC15] text-[#0B2545]'
              }`}
            >
              {hasActiveAccess
                ? `✓ Aksè Aktif (${expectedFee} HTG Apwouve)`
                : `Peman / Aksè (${expectedFee.toLocaleString()} HTG)`}
            </button>
            <button
              type="button"
              onClick={onBackToDashboard}
              className="px-3.5 py-2 text-xs font-semibold bg-white/10 hover:bg-white/20 text-white rounded-lg cursor-pointer"
            >
              ← Retounen
            </button>
            <button
              type="button"
              onClick={onCloseSection}
              className="px-3.5 py-2 text-xs font-semibold bg-white/10 hover:bg-white/20 text-white rounded-lg cursor-pointer"
            >
              ✕ Fèmen
            </button>
            <button
              type="button"
              onClick={onSignOut}
              className="px-3.5 py-2 text-xs font-semibold bg-[#B91C1C] hover:bg-[#991B1B] text-white rounded-lg cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Horizontal Sub-Navigation Bar */}
        <div className="flex flex-wrap items-center gap-1.5 pt-3 border-t border-white/15">
          {EXAM_PREP_SUBSECTIONS.map((sub) => (
            <button
              key={sub}
              type="button"
              onClick={() => onChangeSubSection(sub)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                activeSubSection === sub
                  ? 'bg-[#B91C1C] text-white'
                  : 'bg-white/10 text-slate-200 hover:bg-white/20'
              }`}
            >
              {sub}
            </button>
          ))}
        </div>
      </div>

      {/* Status Notice Banner when Payment is Pending Verification or Rejected */}
      {!hasActiveAccess && (
        <div
          className={`p-5 rounded-xl border space-y-2 ${
            paymentStatus === 'Rejected' || paymentStatus === 'Correction Requested'
              ? 'bg-red-50 border-red-300 text-red-950'
              : 'bg-amber-50 border-amber-300 text-amber-950'
          }`}
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="text-xs font-bold font-mono">
              {paymentStatus === 'Pending Verification' &&
                '▲ STATI PEMAN : PENDING VERIFICATION — Peman ou poko valide.'}
              {(paymentStatus === 'Rejected' ||
                paymentStatus === 'Correction Requested') &&
                '✕ STATI PEMAN : REJECTED — Peman ou rejte. Tanpri verifye rezon an epi soumèt yon nouvo resi.'}
              {paymentStatus === 'Not Submitted' &&
                `◆ AKSÈ EGZAMEN LETA / FILO : ${feeLabelHt}`}
            </div>
            {activeSubSection !== 'Peman / Aksè' && (
              <button
                type="button"
                onClick={() => onChangeSubSection('Peman / Aksè')}
                className="px-4 py-1.5 text-xs font-bold bg-[#B91C1C] text-white rounded-lg hover:bg-[#991B1B] cursor-pointer"
              >
                Louvri Peman / Aksè ({expectedFee.toLocaleString()} HTG) →
              </button>
            )}
          </div>

          {paymentStatus === 'Pending Verification' && (
            <p className="text-xs leading-relaxed">
              <strong>Peman ou poko valide.</strong> Administrasyon ASLA ap verifye resi{' '}
              <span className="font-mono font-bold">
                {latestPayment?.transactionReference || ''}
              </span>{' '}
              ou a. Aksè konplè nan leson revizyon ak similasyon egzamen yo ap aktive kou administratè a apwouve peman an.
            </p>
          )}

          {(paymentStatus === 'Rejected' ||
            paymentStatus === 'Correction Requested') && (
            <div className="text-xs space-y-1">
              <p className="font-bold">
                Peman ou rejte. Tanpri verifye rezon an epi soumèt yon nouvo resi.
              </p>
              {latestPayment?.rejectionOrCorrectionReason && (
                <p className="font-mono bg-white/80 p-2.5 rounded border border-red-200">
                  Rezon Administrasyon ASLA : {latestPayment.rejectionOrCorrectionReason}
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Gate for Protected Academic Subsections if not yet approved */}
      {isProtectedSubSection && !hasActiveAccess ? (
        <div className="bg-white rounded-xl border border-slate-200 p-8 max-w-2xl mx-auto text-center space-y-4">
          <Lock className="w-10 h-10 text-[#B91C1C] mx-auto" />
          <h2 className="text-xl font-bold text-[#0B2545]">
            Aksè nan « {activeSubSection} » Mande Validasyon Peman Egzamen Leta / Filo
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            {paymentStatus === 'Pending Verification'
              ? 'Peman ou poko valide. Administrasyon ASLA ap verifye resi ou telechaje a.'
              : paymentStatus === 'Rejected' || paymentStatus === 'Correction Requested'
              ? 'Peman ou rejte. Tanpri verifye rezon an epi soumèt yon nouvo resi.'
              : `Pou debloke tout 9 matyè revizyon yo, egzèsis pratik, kesyon tip egzamen Leta, ak similasyon kronometre yo, tanpri soumèt peman ofisyèl ou a.`}
          </p>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-left text-xs font-mono space-y-1.5">
            <div>Elèv : {student.fullName} ({student.studentCode})</div>
            <div>Nivo & Klas : {student.grade} · {student.classroom}</div>
            <div>Tip Elèv : {studentType}</div>
            <div className="font-bold text-[#0B2545]">Tarif Ofisyèl : {feeLabelHt}</div>
            <div>Stati Peman : {paymentStatus}</div>
            <div>Stati Aksè : {accessStatus}</div>
          </div>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => onChangeSubSection('Peman / Aksè')}
              className="px-5 py-2.5 text-xs font-bold bg-[#B91C1C] text-white rounded-lg hover:bg-[#991B1B] cursor-pointer"
            >
              Ale nan Peman / Aksè ({expectedFee.toLocaleString()} HTG) →
            </button>
            <button
              type="button"
              onClick={() => onChangeSubSection('Dashboard Preparasyon')}
              className="px-4 py-2.5 text-xs font-semibold border border-slate-300 text-slate-700 rounded-lg cursor-pointer"
            >
              Retounen sou Dashboard Preparasyon
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* 1. DASHBOARD PREPARASYON EGZAMEN LETA */}
          {activeSubSection === 'Dashboard Preparasyon' && (
            <div className="space-y-6">
              {/* Student Identity & Eligibility Card */}
              <div className="bg-white rounded-xl border border-slate-200 p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-7 space-y-2">
                  <div className="text-xs font-bold text-[#B91C1C]">
                    DASHBOARD PREPARASYON EGZAMEN LETA / FILO
                  </div>
                  <h2 className="text-2xl font-bold text-[#0B2545]">
                    {student.fullName} — {student.grade} ({student.classroom})
                  </h2>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600 font-mono">
                    <span>ID: {student.studentCode}</span>
                    <span>·</span>
                    <span>Tip Elèv: {studentType}</span>
                    <span>·</span>
                    <span>Aksè: {accessStatus}</span>
                    <span>·</span>
                    <span>Peman: {paymentStatus}</span>
                  </div>
                  <div className="p-3 rounded-lg bg-[#F8FAFC] border border-slate-200 text-xs font-semibold text-[#0B2545]">
                    Tarif Aplikab : {feeLabelHt}
                  </div>
                </div>

                <div className="lg:col-span-5 grid grid-cols-2 gap-3 tabular-nums">
                  <div className="p-4 rounded-xl bg-[#F8FAFC] border border-slate-200">
                    <div className="text-xs text-slate-500">Pwogrè Jeneral</div>
                    <div className="text-2xl font-bold text-[#0B2545] font-mono mt-1">
                      {overallProgressPercent}%
                    </div>
                    <div className="text-[11px] text-emerald-700 mt-0.5">
                      {completedTopicIds.length}/{topics.length} Sijè Konplete
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-[#F8FAFC] border border-slate-200">
                    <div className="text-xs text-slate-500">Mwayèn Egzèsis</div>
                    <div className="text-2xl font-bold text-[#0B2545] font-mono mt-1">
                      {avgPracticeScore}%
                    </div>
                    <div className="text-[11px] text-slate-600 mt-0.5">
                      {practiceAttempts.length} sesyon pratik
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-[#F8FAFC] border border-slate-200">
                    <div className="text-xs text-slate-500">Mwayèn Mock Exams</div>
                    <div className="text-2xl font-bold text-[#B91C1C] font-mono mt-1">
                      {avgMockExamScore}%
                    </div>
                    <div className="text-[11px] text-slate-600 mt-0.5">
                      {mockExamAttempts.length} similasyon
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-[#F8FAFC] border border-slate-200">
                    <div className="text-xs text-slate-500">Sijè pou Revize</div>
                    <div className="text-2xl font-bold text-amber-700 font-mono mt-1">
                      {topicsNeedingReview.length}
                    </div>
                    <div className="text-[11px] text-slate-600 mt-0.5">
                      Rekòmandasyon siblé
                    </div>
                  </div>
                </div>
              </div>

              {/* Subject Preparation Progress Cards (9 Official Subjects including Istwa D Ayiti) */}
              <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h3 className="text-base font-bold text-[#0B2545]">
                      Pwogrè Preparasyon pa Matyè ({enabledSubjects.length} Matyè Ofisyèl — Kalkile sou Aktivite w)
                    </h3>
                    <p className="text-xs text-slate-600">
                      Klike sou yon matyè pou louvri leson revizyon, egzanp, egzèsis ak kesyon tip Egzamen Leta yo.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onChangeSubSection('Similasyon Egzamen')}
                    className="px-4 py-2 text-xs font-bold bg-[#B91C1C] text-white rounded-lg hover:bg-[#991B1B] cursor-pointer"
                  >
                    Lanse Similasyon Egzamen Kronometre →
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 tabular-nums">
                  {subjectProgressStats.map((stat) => (
                    <div
                      key={stat.subject.code}
                      onClick={() => {
                        setSelectedSubjectCode(stat.subject.code);
                        const firstTopic = topics.find(
                          (t) => t.subjectCode === stat.subject.code
                        );
                        if (firstTopic) setSelectedTopicId(firstTopic.id);
                        onChangeSubSection('Revizyon pa Matyè');
                      }}
                      className="p-4 rounded-xl bg-[#F8FAFC] border border-slate-200 hover:border-[#0B2545] transition-colors cursor-pointer space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-[11px] font-mono text-slate-500">
                            {stat.subject.code} · Koefisyan {stat.subject.coefficient}
                          </div>
                          <h4 className="text-base font-bold text-[#0B2545]">
                            {stat.subject.nameHt}
                          </h4>
                        </div>
                        <span className="text-lg font-bold font-mono text-[#0B2545]">
                          {stat.progressPercent}%
                        </span>
                      </div>

                      <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#0B2545] rounded-full transition-all"
                          style={{ width: `${stat.progressPercent}%` }}
                        />
                      </div>

                      <div className="flex items-center justify-between text-xs text-slate-600">
                        <span>
                          {stat.completedCount}/{stat.totalTopics} Sijè Konplete
                        </span>
                        <span className="font-semibold text-[#B91C1C]">
                          Revize →
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Topics Needing Review, Study Plan Preview & Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-6 bg-white rounded-xl border border-slate-200 p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-[#0B2545]">
                      Sijè ki Mande plis Revizyon & Rekòmandasyon
                    </h3>
                    <button
                      type="button"
                      onClick={() => onChangeSubSection('Plan Etid')}
                      className="text-xs font-semibold text-[#0B2545] underline cursor-pointer"
                    >
                      Wè Plan Etid →
                    </button>
                  </div>

                  {student.teacherExamPrepRecommendation && (
                    <div className="p-3.5 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-950 space-y-1">
                      <div className="font-bold">
                        Rekòmandasyon Direksyon Akademik ASLA :
                      </div>
                      <p>{student.teacherExamPrepRecommendation}</p>
                    </div>
                  )}

                  <ul className="space-y-2 text-xs">
                    {topicsNeedingReview.map((item, idx) => (
                      <li
                        key={idx}
                        className="p-3 rounded-lg bg-[#F8FAFC] border border-slate-200 flex items-center justify-between gap-2"
                      >
                        <span className="font-medium text-slate-800">{item}</span>
                        <button
                          type="button"
                          onClick={() => onChangeSubSection('Revizyon pa Matyè')}
                          className="text-[#B91C1C] font-semibold whitespace-nowrap cursor-pointer"
                        >
                          Etidye →
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="lg:col-span-6 bg-white rounded-xl border border-slate-200 p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-[#0B2545]">
                      Dènye Aktivite & Rezilta Egzamen Blan
                    </h3>
                    <button
                      type="button"
                      onClick={() => onChangeSubSection('Rezilta')}
                      className="text-xs font-semibold text-[#0B2545] underline cursor-pointer"
                    >
                      Tout Rezilta →
                    </button>
                  </div>

                  {studentAttempts.length === 0 ? (
                    <p className="text-xs text-slate-500">
                      Ou poko gen tantativ anrejistre. Kòmanse yon egzèsis oswa yon Mock Exam!
                    </p>
                  ) : (
                    <div className="divide-y divide-slate-100 text-xs tabular-nums">
                      {studentAttempts.slice(0, 5).map((att) => (
                        <div
                          key={att.id}
                          className="py-3 flex items-center justify-between gap-3"
                        >
                          <div>
                            <div className="font-bold text-[#0B2545]">{att.titleHt}</div>
                            <div className="text-slate-500">
                              {att.subjectNameHt} · {att.attemptType} · {att.date} ·{' '}
                              {att.timeUsedMinutes} min
                            </div>
                          </div>
                          <div className="text-right font-mono">
                            <div
                              className={`font-bold ${
                                att.passed ? 'text-emerald-700' : 'text-amber-700'
                              }`}
                            >
                              {att.percentage}% ({att.scorePoints}/{att.totalPoints})
                            </div>
                            <div className="text-[11px] text-slate-500">
                              {att.passed ? 'Reyisi (Pass)' : 'Pou Ranfòse'}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 2. REVIZYON PA MATYÈ (Matyè → Topics → Chapters → Revision lessons → Examples → Practice → Exam questions → Review → Quiz) */}
          {activeSubSection === 'Revizyon pa Matyè' && activeTopic && (
            <div className="space-y-6">
              {/* Subject Selector Bar */}
              <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="text-xs font-bold text-[#B91C1C]">
                    CHWAZI MATYÈ OFISYÈL POU REVIZYON ({enabledSubjects.length} MATYÈ)
                  </div>
                  <div className="text-xs text-slate-500 font-mono">
                    Matyè → Topics → Revision Lessons → Examples → Practice → Exam Questions → Review → Quiz
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {enabledSubjects.map((subj) => (
                    <button
                      key={subj.code}
                      type="button"
                      onClick={() => {
                        setSelectedSubjectCode(subj.code);
                        const first = topics.find((t) => t.subjectCode === subj.code);
                        if (first) setSelectedTopicId(first.id);
                        setTopicQuizSubmitted(false);
                      }}
                      className={`px-3.5 py-2 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                        selectedSubjectCode === subj.code
                          ? 'bg-[#0B2545] text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {subj.nameHt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Topics List & Active Revision Workspace */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Column: Topics with Completed / In Progress / Not Started status */}
                <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 p-5 space-y-4 h-fit">
                  <h3 className="text-sm font-bold text-[#0B2545]">
                    Sijè Revizyon (Topics & Chapit) —{' '}
                    {
                      enabledSubjects.find((s) => s.code === selectedSubjectCode)
                        ?.nameHt
                    }
                  </h3>
                  <div className="space-y-2.5">
                    {subjectTopics.map((tp) => {
                      const isDone = completedTopicIds.includes(tp.id);
                      const isInProg = !isDone && inProgressTopicIds.includes(tp.id);
                      const statusLabel = isDone
                        ? 'Completed'
                        : isInProg
                        ? 'In Progress'
                        : 'Not Started';

                      return (
                        <div
                          key={tp.id}
                          onClick={() => {
                            setSelectedTopicId(tp.id);
                            setTopicQuizSubmitted(false);
                          }}
                          className={`p-3.5 rounded-xl border cursor-pointer transition-colors space-y-1.5 ${
                            activeTopic.id === tp.id
                              ? 'border-[#0B2545] bg-[#F8FAFC]'
                              : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center justify-between text-[11px] font-mono">
                            <span className="text-slate-500">
                              Chapit {tp.chapterNumber} · Sijè {tp.topicNumber}
                            </span>
                            <span
                              className={
                                isDone
                                  ? 'text-emerald-700 font-bold'
                                  : isInProg
                                  ? 'text-amber-700 font-bold'
                                  : 'text-slate-500'
                              }
                            >
                              ● {statusLabel}
                            </span>
                          </div>
                          <div className="text-xs font-bold text-[#0B2545]">
                            {tp.titleHt}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            ⏱ {tp.estimatedMinutes} minit · {tp.practiceQuestions.length} kesyon
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Right Column: Structured Revision Lesson Viewer */}
                <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200 p-6 space-y-6">
                  <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 pb-4">
                    <div>
                      <div className="text-xs font-mono text-[#B91C1C] font-semibold">
                        {activeTopic.subjectNameHt} · Chapit {activeTopic.chapterNumber} · Sijè{' '}
                        {activeTopic.topicNumber}
                      </div>
                      <h2 className="text-xl font-bold text-[#0B2545] mt-1">
                        {activeTopic.titleHt}
                      </h2>
                    </div>

                    {/* Topic Status Control */}
                    <div className="flex items-center gap-1.5">
                      {(['Not Started', 'In Progress', 'Completed'] as const).map(
                        (st) => {
                          const currentSt = completedTopicIds.includes(activeTopic.id)
                            ? 'Completed'
                            : inProgressTopicIds.includes(activeTopic.id)
                            ? 'In Progress'
                            : 'Not Started';
                          return (
                            <button
                              key={st}
                              type="button"
                              onClick={() => onUpdateTopicStatus(activeTopic.id, st)}
                              className={`px-2.5 py-1 text-[11px] font-semibold rounded border cursor-pointer ${
                                currentSt === st
                                  ? 'bg-[#0B2545] text-white border-[#0B2545]'
                                  : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'
                              }`}
                            >
                              {st}
                            </button>
                          );
                        }
                      )}
                    </div>
                  </div>

                  {/* Step Tabs inside Revision Topic */}
                  <div className="flex flex-wrap gap-1.5 p-1 bg-slate-100 rounded-lg">
                    {[
                      { id: 'LESSON', label: '1. Leson Revizyon & Konsèp' },
                      { id: 'EXAMPLES', label: '2. Egzanp Rezoud & Erè pou Evite' },
                      { id: 'PRACTICE', label: '3. Egzèsis & Kesyon Tip Egzamen' },
                      { id: 'REVIEW', label: '4. Rezime Rapid (Review)' },
                      { id: 'QUIZ', label: '5. Quiz Sijè a' },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setRevisionTab(tab.id as any)}
                        className={`px-3 py-1.5 rounded-md text-xs font-semibold cursor-pointer ${
                          revisionTab === tab.id
                            ? 'bg-white text-[#0B2545] shadow-sm'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {/* TAB 1: LESSON & KEY CONCEPTS & FORMULAS/DATES */}
                  {revisionTab === 'LESSON' && (
                    <div className="space-y-5 text-xs leading-relaxed">
                      <div className="space-y-3">
                        <h3 className="text-sm font-bold text-[#0B2545]">
                          Eksplikasyon Detaye pou Egzamen Leta
                        </h3>
                        {activeTopic.explanationHt.map((para, i) => (
                          <p key={i} className="text-slate-700">
                            {para}
                          </p>
                        ))}
                      </div>

                      <div className="p-4 rounded-xl bg-[#F8FAFC] border border-slate-200 space-y-2">
                        <h4 className="text-sm font-bold text-[#0B2545]">
                          Konsèp Kle pou Retni (Key Concepts)
                        </h4>
                        <ul className="list-disc pl-5 space-y-1 text-slate-700">
                          {activeTopic.keyConceptsHt.map((kc, i) => (
                            <li key={i}>{kc}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="space-y-2">
                        <h4 className="text-sm font-bold text-[#0B2545]">
                          Fòmil, Règ Gramè oswa Dat Istorik Ofisyèl
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {activeTopic.formulasOrRulesHt.map((fr, i) => (
                            <div
                              key={i}
                              className="p-3.5 rounded-lg bg-slate-50 border border-slate-200"
                            >
                              <div className="font-bold text-[#B91C1C]">
                                {fr.label}
                              </div>
                              <div className="font-mono text-slate-800 mt-1">
                                {fr.content}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 2: EXAMPLES & COMMON EXAM MISTAKES */}
                  {revisionTab === 'EXAMPLES' && (
                    <div className="space-y-5 text-xs">
                      {activeTopic.examplesHt.map((ex, i) => (
                        <div
                          key={i}
                          className="p-5 rounded-xl bg-[#F8FAFC] border border-slate-200 space-y-3"
                        >
                          <div className="font-bold text-sm text-[#0B2545]">
                            {ex.title}
                          </div>
                          <div className="p-3 rounded-lg bg-white border border-slate-200 font-semibold text-slate-800">
                            Pwoblèm / Sijè : {ex.problem}
                          </div>
                          <div className="space-y-1.5">
                            <div className="font-bold text-slate-700">
                              Solisyon Etap pa Etap (Step-by-Step Solution) :
                            </div>
                            <ol className="list-decimal pl-5 space-y-1 text-slate-700">
                              {ex.stepByStepSolution.map((step, idx) => (
                                <li key={idx}>{step}</li>
                              ))}
                            </ol>
                          </div>
                          <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 font-mono font-bold text-emerald-900">
                            Repons Final : {ex.finalAnswer}
                          </div>
                        </div>
                      ))}

                      <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 space-y-2">
                        <h4 className="text-sm font-bold text-amber-950">
                          Erè Elèv yo fè souvan nan Egzamen Leta (Common Exam Mistakes)
                        </h4>
                        <ul className="list-disc pl-5 space-y-1 text-amber-900">
                          {activeTopic.commonExamMistakesHt.map((m, i) => (
                            <li key={i}>{m}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  {/* TAB 3: PRACTICE & EXAM QUESTIONS */}
                  {revisionTab === 'PRACTICE' && (
                    <div className="space-y-4 text-xs">
                      <h4 className="text-sm font-bold text-[#0B2545]">
                        Kesyon Pratik & Kesyon Tip Egzamen sou Sijè sa a
                      </h4>
                      {activeTopic.practiceQuestions.map((q, idx) => (
                        <div
                          key={q.id}
                          className="p-4 rounded-xl bg-[#F8FAFC] border border-slate-200 space-y-3"
                        >
                          <div className="flex items-center justify-between font-mono text-slate-500">
                            <span>
                              Kesyon {idx + 1} · {q.difficulty}
                            </span>
                            <span>{q.points} pwen</span>
                          </div>
                          <p className="font-bold text-slate-900">{q.promptHt}</p>
                          <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 space-y-1">
                            <div className="font-bold text-emerald-900">
                              Repons Egzak : {q.correctAnswer}
                            </div>
                            <p className="text-emerald-800">
                              Eksplikasyon : {q.stepByStepExplanationHt}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* TAB 4: QUICK REVIEW */}
                  {revisionTab === 'REVIEW' && (
                    <div className="p-5 rounded-xl bg-[#F8FAFC] border border-slate-200 space-y-3 text-xs">
                      <h4 className="text-sm font-bold text-[#0B2545]">
                        Revizyon Rapid Anvan Egzamen (Quick Review)
                      </h4>
                      <ul className="list-disc pl-5 space-y-2 text-slate-700">
                        {activeTopic.quickReviewHt.map((qr, i) => (
                          <li key={i}>{qr}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* TAB 5: INTERACTIVE TOPIC QUIZ */}
                  {revisionTab === 'QUIZ' && (
                    <div className="space-y-4 text-xs">
                      <h4 className="text-sm font-bold text-[#0B2545]">
                        Quiz Verifikasyon Konpreyansyon — {activeTopic.titleHt}
                      </h4>
                      {activeTopic.practiceQuestions.map((q, idx) => (
                        <div
                          key={q.id}
                          className="p-4 rounded-xl bg-[#F8FAFC] border border-slate-200 space-y-3"
                        >
                          <div className="font-bold text-[#0B2545]">
                            {idx + 1}. {q.promptHt} ({q.points} pwen)
                          </div>
                          {q.options && (
                            <div className="space-y-2">
                              {q.options.map((opt) => (
                                <label
                                  key={opt}
                                  className="flex items-center gap-2.5 p-2.5 rounded-lg bg-white border border-slate-200 cursor-pointer"
                                >
                                  <input
                                    type="radio"
                                    name={`tquiz-${q.id}`}
                                    checked={topicQuizAnswers[q.id] === opt}
                                    onChange={() =>
                                      setTopicQuizAnswers((prev) => ({
                                        ...prev,
                                        [q.id]: opt,
                                      }))
                                    }
                                  />
                                  <span>{opt}</span>
                                </label>
                              ))}
                            </div>
                          )}
                          {topicQuizSubmitted && (
                            <div className="p-3 rounded-lg bg-slate-100 border border-slate-300 space-y-1">
                              <div className="font-bold text-[#0B2545]">
                                Repons Kòrèk : {q.correctAnswer}
                              </div>
                              <p className="text-slate-700">
                                {q.stepByStepExplanationHt}
                              </p>
                            </div>
                          )}
                        </div>
                      ))}

                      <div className="flex flex-wrap gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            setTopicQuizSubmitted(true);
                            let earned = 0;
                            let total = 0;
                            activeTopic.practiceQuestions.forEach((q) => {
                              total += q.points;
                              if (topicQuizAnswers[q.id] === q.correctAnswer) {
                                earned += q.points;
                              }
                            });
                            const pct =
                              total > 0 ? Math.round((earned / total) * 100) : 100;
                            onRecordAttempt({
                              studentId: student.id,
                              studentName: student.fullName,
                              grade: student.grade,
                              attemptType: 'Topic Quiz',
                              subjectCode: activeTopic.subjectCode,
                              subjectNameHt: activeTopic.subjectNameHt,
                              topicId: activeTopic.id,
                              titleHt: `Quiz Revizyon : ${activeTopic.titleHt}`,
                              attemptNumber: 1,
                              timeUsedMinutes: 10,
                              scorePoints: earned,
                              totalPoints: total,
                              percentage: pct,
                              passed: pct >= 65,
                              answers: topicQuizAnswers,
                              weakTopicsHt: pct < 65 ? [activeTopic.titleHt] : [],
                              recommendedLessonsHt: [],
                            });
                            if (pct >= 65) {
                              onUpdateTopicStatus(activeTopic.id, 'Completed');
                            }
                          }}
                          className="px-5 py-2.5 font-bold bg-[#0B2545] text-white rounded-lg cursor-pointer"
                        >
                          Soumèt Quiz Sijè a & Anrejistre Nòt la
                        </button>
                        {topicQuizSubmitted && (
                          <button
                            type="button"
                            onClick={() => {
                              setTopicQuizAnswers({});
                              setTopicQuizSubmitted(false);
                            }}
                            className="px-4 py-2.5 font-semibold border border-slate-300 rounded-lg cursor-pointer"
                          >
                            Rekòmanse Quiz la
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 3. EGZÈSIS (Interactive Practice Engine with Filters & Instant Feedback) */}
          {activeSubSection === 'Egzèsis' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-[#0B2545]">
                      Sant Egzèsis Pratik pa Matyè, Nivo Difikilte ak Tip Kesyon
                    </h2>
                    <p className="text-xs text-slate-600">
                      Chwazi filtè ou yo, verifye repons ou imedyatman, epi li eksplikasyon etap pa etap yo.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setPracticeAnswers({});
                      setPracticeCheckedIds({});
                      setPracticeSessionResult(null);
                    }}
                    className="px-3.5 py-2 text-xs font-semibold border border-slate-300 rounded-lg hover:bg-slate-100 cursor-pointer"
                  >
                    ↺ Rekòmanse Egzèsis yo (Retry)
                  </button>
                </div>

                {/* Filters */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-600 mb-1">
                      Filtre pa Matyè
                    </label>
                    <select
                      value={practiceSubjectFilter}
                      onChange={(e) => setPracticeSubjectFilter(e.target.value as any)}
                      className="w-full p-2.5 rounded-lg border border-slate-300 bg-white font-semibold"
                    >
                      <option value="ALL">Tout 9 Matyè Ofisyèl yo</option>
                      {enabledSubjects.map((s) => (
                        <option key={s.code} value={s.code}>
                          {s.nameHt}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-600 mb-1">
                      Nivo Difikilte
                    </label>
                    <select
                      value={practiceDifficultyFilter}
                      onChange={(e) =>
                        setPracticeDifficultyFilter(e.target.value as any)
                      }
                      className="w-full p-2.5 rounded-lg border border-slate-300 bg-white font-semibold"
                    >
                      <option value="ALL">Tout Nivo Difikilte</option>
                      <option value="Easy">Easy (Fasil)</option>
                      <option value="Medium">Medium (Mwayen)</option>
                      <option value="Hard">Hard (Avanse)</option>
                      <option value="Official Exam Level">
                        Official Exam Level (Nivo Egzamen Leta)
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-600 mb-1">
                      Tip Kesyon
                    </label>
                    <select
                      value={practiceTypeFilter}
                      onChange={(e) => setPracticeTypeFilter(e.target.value as any)}
                      className="w-full p-2.5 rounded-lg border border-slate-300 bg-white font-semibold"
                    >
                      <option value="ALL">Tout Tip Kesyon (9 Fòma)</option>
                      <option value="multiple_choice">Multiple Choice (Chwa Miltip)</option>
                      <option value="math_problem_solving">
                        Mathematical Problem Solving
                      </option>
                      <option value="historical_analysis">
                        Historical Analysis (Analiz Istorik)
                      </option>
                      <option value="reading_comprehension">
                        Reading Comprehension (Konpreyansyon Tèks)
                      </option>
                      <option value="problem_solving">Problem Solving</option>
                      <option value="short_answer">Short Answer (Repons Kout)</option>
                      <option value="true_false">True / False (Vrè oswa Fo)</option>
                      <option value="fill_in_blank">Fill in the Blank</option>
                      <option value="written_response">
                        Essay / Written Response (Redaksyon)
                      </option>
                    </select>
                  </div>
                </div>
              </div>

              {practiceSessionResult && (
                <div className="p-5 rounded-xl bg-emerald-50 border border-emerald-300 flex flex-wrap items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="text-xs font-bold text-emerald-900">
                      REZILTA SESYON EGZÈSIS PRATIK ANREJISTRE AUTOMATICMAN
                    </div>
                    <div className="text-lg font-bold text-[#0B2545] font-mono">
                      Nòt : {practiceSessionResult.score} / {practiceSessionResult.total} pwen (
                      {practiceSessionResult.percentage}%)
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onChangeSubSection('Rezilta')}
                    className="px-4 py-2 text-xs font-bold bg-[#0B2545] text-white rounded-lg cursor-pointer"
                  >
                    Wè nan Istorik Rezilta →
                  </button>
                </div>
              )}

              <div className="space-y-4">
                {filteredPracticeQuestions.map((q, idx) => {
                  const selectedAns = practiceAnswers[q.id] || '';
                  const isChecked = !!practiceCheckedIds[q.id];
                  const isCorrect =
                    selectedAns.trim().toLowerCase() ===
                    q.correctAnswer.trim().toLowerCase();

                  return (
                    <div
                      key={q.id}
                      className="bg-white rounded-xl border border-slate-200 p-6 space-y-4 text-xs"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 text-slate-500 font-mono">
                        <span>
                          Egzèsis #{idx + 1} · {q.subjectNameHt} · {q.topicTitleHt}
                        </span>
                        <span>
                          {q.difficulty} · {q.questionType} · {q.points} pwen
                        </span>
                      </div>

                      {q.readingPassageHt && (
                        <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 italic text-slate-700 leading-relaxed">
                          {q.readingPassageHt}
                        </div>
                      )}

                      <div className="text-sm font-bold text-[#0B2545]">
                        {q.promptHt}
                      </div>

                      {q.options ? (
                        <div className="grid grid-cols-1 gap-2">
                          {q.options.map((opt) => (
                            <label
                              key={opt}
                              className={`flex items-center gap-2.5 p-3 rounded-lg border cursor-pointer ${
                                selectedAns === opt
                                  ? 'border-[#0B2545] bg-slate-50 font-semibold'
                                  : 'border-slate-200 hover:bg-slate-50'
                              }`}
                            >
                              <input
                                type="radio"
                                name={`prac-${q.id}`}
                                checked={selectedAns === opt}
                                onChange={() =>
                                  setPracticeAnswers((prev) => ({
                                    ...prev,
                                    [q.id]: opt,
                                  }))
                                }
                              />
                              <span>{opt}</span>
                            </label>
                          ))}
                        </div>
                      ) : (
                        <input
                          type="text"
                          value={selectedAns}
                          onChange={(e) =>
                            setPracticeAnswers((prev) => ({
                              ...prev,
                              [q.id]: e.target.value,
                            }))
                          }
                          placeholder="Ekri repons ou la a..."
                          className="w-full p-3 rounded-lg border border-slate-300"
                        />
                      )}

                      <div className="flex items-center justify-between pt-1">
                        <button
                          type="button"
                          onClick={() =>
                            setPracticeCheckedIds((prev) => ({
                              ...prev,
                              [q.id]: true,
                            }))
                          }
                          className="px-4 py-2 font-semibold bg-[#0B2545] text-white rounded-lg cursor-pointer"
                        >
                          Verifye Repons Imedyatman
                        </button>
                      </div>

                      {isChecked && (
                        <div
                          className={`p-4 rounded-xl border space-y-1.5 ${
                            isCorrect
                              ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                              : 'bg-amber-50 border-amber-200 text-amber-950'
                          }`}
                        >
                          <div className="font-bold">
                            {isCorrect
                              ? `✓ Bòn Repons ! (+${q.points} pwen)`
                              : `▲ Repons Egzak la se : ${q.correctAnswer}`}
                          </div>
                          <p>
                            <strong>Eksplikasyon Etap pa Etap :</strong>{' '}
                            {q.stepByStepExplanationHt}
                          </p>
                          {q.examTipHt && (
                            <p className="font-semibold text-[#0B2545]">
                              💡 Konsèy Egzamen Leta : {q.examTipHt}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {filteredPracticeQuestions.length > 0 && (
                <div className="bg-white rounded-xl border border-slate-200 p-5 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-700">
                    Kalkile nòt total sesyon egzèsis sa a epi konsève li nan dosye Pwogrè ou :
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      let score = 0;
                      let total = 0;
                      const weak: string[] = [];
                      filteredPracticeQuestions.forEach((q) => {
                        total += q.points;
                        if (
                          (practiceAnswers[q.id] || '').trim().toLowerCase() ===
                          q.correctAnswer.trim().toLowerCase()
                        ) {
                          score += q.points;
                        } else {
                          weak.push(`${q.subjectNameHt}: ${q.topicTitleHt}`);
                        }
                      });
                      const pct =
                        total > 0 ? Math.round((score / total) * 100) : 0;
                      setPracticeSessionResult({ score, total, percentage: pct });
                      onRecordAttempt({
                        studentId: student.id,
                        studentName: student.fullName,
                        grade: student.grade,
                        attemptType: 'Practice',
                        subjectCode:
                          practiceSubjectFilter === 'ALL'
                            ? 'MULTI'
                            : practiceSubjectFilter,
                        subjectNameHt:
                          practiceSubjectFilter === 'ALL'
                            ? 'Multi-Matyè'
                            : enabledSubjects.find(
                                (s) => s.code === practiceSubjectFilter
                              )?.nameHt || 'Matyè',
                        titleHt: `Sesyon Egzèsis Pratik (${filteredPracticeQuestions.length} kesyon)`,
                        attemptNumber: practiceAttempts.length + 1,
                        timeUsedMinutes: 15,
                        scorePoints: score,
                        totalPoints: total,
                        percentage: pct,
                        passed: pct >= 65,
                        answers: practiceAnswers,
                        weakTopicsHt: Array.from(new Set(weak)),
                        recommendedLessonsHt: Array.from(new Set(weak)),
                      });
                    }}
                    className="px-5 py-2.5 text-xs font-bold bg-[#B91C1C] text-white rounded-lg hover:bg-[#991B1B] cursor-pointer"
                  >
                    Kalkile & Anrejistre Nòt Egzèsis la
                  </button>
                </div>
              )}
            </div>
          )}

          {/* 4. KESYON TIP EGZAMEN (Official MENFP Past-Exam Question Bank) */}
          {activeSubSection === 'Kesyon Tip Egzamen' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-2">
                <div className="text-xs font-bold text-[#B91C1C]">
                  BANK KESYON OFISYÈL TIP EGZAMEN LETA / FILO (MENFP)
                </div>
                <h2 className="text-xl font-bold text-[#0B2545]">
                  Ansyen Sujè ak Kesyon Modèl Egzamen Leta avèk Barèm ak Koreksyon Detaye
                </h2>
                <p className="text-xs text-slate-600">
                  Etidye fòma egzak kesyon Ministè Edikasyon Nasyonal yo pou 9yèm AF, Segondè III (Rhéto) ak Filo (Bac II).
                </p>
              </div>

              <div className="space-y-4">
                {questions
                  .filter((q) => q.isOfficialPastExamStyle !== false)
                  .map((q, idx) => (
                    <div
                      key={q.id}
                      className="bg-white rounded-xl border border-slate-200 p-6 space-y-4 text-xs"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-slate-500">
                        <span>
                          Sujè Ofisyèl #{idx + 1} · {q.subjectNameHt} ·{' '}
                          {q.examYearReference || 'MENFP'}
                        </span>
                        <span className="font-bold text-[#0B2545]">
                          Barèm : {q.points} Pwen
                        </span>
                      </div>

                      {q.readingPassageHt && (
                        <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 italic text-slate-700">
                          {q.readingPassageHt}
                        </div>
                      )}

                      <h3 className="text-sm font-bold text-[#0B2545]">
                        {q.promptHt}
                      </h3>

                      <div className="p-4 rounded-xl bg-[#F8FAFC] border border-slate-200 space-y-2">
                        <div className="font-bold text-emerald-800">
                          ✓ Modèl Repons Ofisyèl : {q.correctAnswer}
                        </div>
                        <p className="text-slate-700">
                          <strong>Demach & Koreksyon :</strong>{' '}
                          {q.stepByStepExplanationHt}
                        </p>
                        {q.examTipHt && (
                          <p className="text-[#B91C1C] font-semibold">
                            Konsèy Barèm MENFP : {q.examTipHt}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* 5 & 6. SIMILASYON EGZAMEN & MOCK EXAMS */}
          {(activeSubSection === 'Similasyon Egzamen' ||
            activeSubSection === 'Mock Exams') && (
            <div className="space-y-6">
              {!examRunning && !completedExamReport && (
                <div className="space-y-6">
                  <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-2">
                    <div className="text-xs font-bold text-[#B91C1C]">
                      SIMILATÈ EGZAMEN LETA KRONOMETRE & MOCK EXAMS
                    </div>
                    <h2 className="text-xl font-bold text-[#0B2545]">
                      Chwazi yon Similasyon Egzamen Konplè oswa yon Mock Exam pa Matyè
                    </h2>
                    <p className="text-xs text-slate-600">
                      Chak similasyon gen yon kronomèt reyèl, panèl navigasyon kesyon, opsyon revizyon anvan soumèt, ak rapò nòt detaye.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {mockExams.map((mock) => {
                      const prevCount = studentAttempts.filter(
                        (a) => a.mockExamId === mock.id
                      ).length;
                      return (
                        <div
                          key={mock.id}
                          className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col justify-between space-y-4"
                        >
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-xs font-mono text-slate-500">
                              <span>{mock.subjectNameHt}</span>
                              <span>
                                ⏱ {mock.durationMinutes} min · {mock.totalPoints} pwen
                              </span>
                            </div>
                            <h3 className="text-base font-bold text-[#0B2545]">
                              {mock.titleHt}
                            </h3>
                            <p className="text-xs text-slate-600 leading-relaxed">
                              {mock.instructionsHt}
                            </p>
                            <div className="text-xs text-slate-500 font-mono">
                              Kesyon : {mock.questions.length} · Nòt Pou Pase :{' '}
                              {mock.passingScorePercent}% · Tantativ deja fèt : {prevCount}
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => startMockExamSession(mock)}
                            className="w-full py-2.5 px-4 text-xs font-bold bg-[#B91C1C] text-white rounded-lg hover:bg-[#991B1B] cursor-pointer"
                          >
                            ▶ Kòmanse Similasyon Kronometre ({mock.durationMinutes} min)
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ACTIVE TIMED EXAM SIMULATION INTERFACE */}
              {examRunning && selectedMockExam && (
                <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6">
                  {/* Exam Header with Countdown Timer */}
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
                    <div>
                      <div className="text-xs font-mono text-[#B91C1C] font-bold">
                        SIMILASYON EGZAMEN AN KOUR · {selectedMockExam.subjectNameHt}
                      </div>
                      <h2 className="text-lg font-bold text-[#0B2545]">
                        {selectedMockExam.titleHt}
                      </h2>
                      <div className="text-xs text-slate-500 font-mono">
                        Total Pwen : {selectedMockExam.totalPoints} · Kantite Kesyon :{' '}
                        {selectedMockExam.questions.length}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="px-4 py-2 rounded-lg bg-[#0B2545] text-white font-mono text-sm font-bold tabular-nums">
                        ⏱ Tan ki rete : {formatTime(examSecondsLeft)}
                      </div>
                      <button
                        type="button"
                        onClick={() => setExamReviewMode(!examReviewMode)}
                        className="px-3.5 py-2 text-xs font-semibold border border-slate-300 rounded-lg hover:bg-slate-50 cursor-pointer"
                      >
                        {examReviewMode
                          ? 'Retounen nan Kesyon yo'
                          : 'Revize Anvan Soumèt'}
                      </button>
                      <button
                        type="button"
                        onClick={handleFinishMockExam}
                        className="px-4 py-2 text-xs font-bold bg-[#B91C1C] text-white rounded-lg hover:bg-[#991B1B] cursor-pointer"
                      >
                        Soumèt Egzamen Final
                      </button>
                    </div>
                  </div>

                  {/* Question Navigation Panel */}
                  <div className="space-y-2">
                    <div className="text-xs font-semibold text-slate-600">
                      Panèl Navigasyon Kesyon (Klike sou yon nimewo) :
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {selectedMockExam.questions.map((q, idx) => {
                        const answered = !!(examAnswers[q.id] || '').trim();
                        const isCurrent = idx === examCurrentIdx && !examReviewMode;
                        return (
                          <button
                            key={q.id}
                            type="button"
                            onClick={() => {
                              setExamReviewMode(false);
                              setExamCurrentIdx(idx);
                            }}
                            className={`w-9 h-9 rounded-lg text-xs font-mono font-bold cursor-pointer transition-colors ${
                              isCurrent
                                ? 'bg-[#B91C1C] text-white'
                                : answered
                                ? 'bg-emerald-600 text-white'
                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            }`}
                          >
                            {idx + 1}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Review Before Submit Screen OR Active Question */}
                  {examReviewMode ? (
                    <div className="p-5 rounded-xl bg-[#F8FAFC] border border-slate-200 space-y-4 text-xs">
                      <h3 className="text-base font-bold text-[#0B2545]">
                        Verifikasyon Repons ou yo Anvan Soumèt Egzamen an
                      </h3>
                      <div className="divide-y divide-slate-200">
                        {selectedMockExam.questions.map((q, idx) => (
                          <div
                            key={q.id}
                            className="py-2.5 flex items-center justify-between gap-4"
                          >
                            <div>
                              <span className="font-bold text-[#0B2545]">
                                Kesyon {idx + 1} ({q.subjectNameHt}) :
                              </span>{' '}
                              <span className="text-slate-600">{q.promptHt}</span>
                            </div>
                            <div className="flex items-center gap-3 shrink-0">
                              <span
                                className={`font-mono font-bold ${
                                  examAnswers[q.id]
                                    ? 'text-emerald-700'
                                    : 'text-amber-700'
                                }`}
                              >
                                {examAnswers[q.id] ? '✓ Reponn' : '▲ Poko Reponn'}
                              </span>
                              <button
                                type="button"
                                onClick={() => {
                                  setExamCurrentIdx(idx);
                                  setExamReviewMode(false);
                                }}
                                className="text-[#0B2545] underline font-semibold cursor-pointer"
                              >
                                Modifye
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="pt-3 flex justify-end gap-3">
                        <button
                          type="button"
                          onClick={() => setExamReviewMode(false)}
                          className="px-4 py-2 font-semibold border border-slate-300 rounded-lg cursor-pointer"
                        >
                          Retounen nan Kesyon yo
                        </button>
                        <button
                          type="button"
                          onClick={handleFinishMockExam}
                          className="px-5 py-2 font-bold bg-[#B91C1C] text-white rounded-lg cursor-pointer"
                        >
                          Konfime & Soumèt Egzamen an Kounye a
                        </button>
                      </div>
                    </div>
                  ) : (
                    (() => {
                      const currentQ = selectedMockExam.questions[examCurrentIdx];
                      if (!currentQ) return null;
                      return (
                        <div className="p-5 rounded-xl bg-[#F8FAFC] border border-slate-200 space-y-4 text-xs">
                          <div className="flex items-center justify-between font-mono text-slate-500">
                            <span>
                              Kesyon {examCurrentIdx + 1} sou{' '}
                              {selectedMockExam.questions.length} ·{' '}
                              {currentQ.subjectNameHt}
                            </span>
                            <span className="font-bold text-[#0B2545]">
                              {currentQ.points} pwen
                            </span>
                          </div>

                          {currentQ.readingPassageHt && (
                            <div className="p-4 rounded-lg bg-white border border-slate-200 italic text-slate-700">
                              {currentQ.readingPassageHt}
                            </div>
                          )}

                          <div className="text-base font-bold text-[#0B2545]">
                            {currentQ.promptHt}
                          </div>

                          {currentQ.options ? (
                            <div className="space-y-2">
                              {currentQ.options.map((opt) => (
                                <label
                                  key={opt}
                                  className={`flex items-center gap-3 p-3 rounded-lg border bg-white cursor-pointer ${
                                    examAnswers[currentQ.id] === opt
                                      ? 'border-[#0B2545] font-bold'
                                      : 'border-slate-200'
                                  }`}
                                >
                                  <input
                                    type="radio"
                                    name={`sim-${currentQ.id}`}
                                    checked={examAnswers[currentQ.id] === opt}
                                    onChange={() => {
                                      setExamAnswers((prev) => ({
                                        ...prev,
                                        [currentQ.id]: opt,
                                      }));
                                      setExamSavedNotice(false);
                                    }}
                                  />
                                  <span>{opt}</span>
                                </label>
                              ))}
                            </div>
                          ) : (
                            <textarea
                              rows={3}
                              value={examAnswers[currentQ.id] || ''}
                              onChange={(e) =>
                                setExamAnswers((prev) => ({
                                  ...prev,
                                  [currentQ.id]: e.target.value,
                                }))
                              }
                              placeholder="Ekri repons ou la a..."
                              className="w-full p-3 rounded-lg border border-slate-300 bg-white"
                            />
                          )}

                          {examSavedNotice && (
                            <div className="text-emerald-700 font-semibold">
                              ✓ Repons kesyon {examCurrentIdx + 1} la anrejistre.
                            </div>
                          )}

                          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-200">
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                disabled={examCurrentIdx === 0}
                                onClick={() =>
                                  setExamCurrentIdx((i) => Math.max(0, i - 1))
                                }
                                className="px-4 py-2 font-semibold border border-slate-300 bg-white rounded-lg disabled:opacity-40 cursor-pointer"
                              >
                                ← Previous (Anvan)
                              </button>
                              <button
                                type="button"
                                onClick={() => setExamSavedNotice(true)}
                                className="px-4 py-2 font-semibold bg-slate-800 text-white rounded-lg cursor-pointer"
                              >
                                Save Answer (Anrejistre)
                              </button>
                              <button
                                type="button"
                                disabled={
                                  examCurrentIdx >=
                                  selectedMockExam.questions.length - 1
                                }
                                onClick={() =>
                                  setExamCurrentIdx((i) =>
                                    Math.min(
                                      selectedMockExam.questions.length - 1,
                                      i + 1
                                    )
                                  )
                                }
                                className="px-4 py-2 font-semibold bg-[#0B2545] text-white rounded-lg disabled:opacity-40 cursor-pointer"
                              >
                                Next (Swivan) →
                              </button>
                            </div>

                            <button
                              type="button"
                              onClick={() => setExamReviewMode(true)}
                              className="px-4 py-2 font-bold text-[#B91C1C] underline cursor-pointer"
                            >
                              Revize Tout Repons yo Anvan Soumèt →
                            </button>
                          </div>
                        </div>
                      );
                    })()
                  )}
                </div>
              )}

              {/* POST-EXAM SCORE REPORT & EXPLANATIONS */}
              {completedExamReport && selectedMockExam && (
                <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6">
                  <div className="p-5 rounded-xl bg-[#F8FAFC] border border-slate-200 flex flex-wrap items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="text-xs font-mono font-bold text-[#B91C1C]">
                        RAPÒ OFISYÈL SIMILASYON EGZAMEN LETA · TANTATIV #
                        {completedExamReport.attemptNumber}
                      </div>
                      <h2 className="text-2xl font-bold text-[#0B2545]">
                        {completedExamReport.titleHt}
                      </h2>
                      <div className="text-xs text-slate-600 font-mono">
                        Dat : {completedExamReport.date} · Tan Itilize :{' '}
                        {completedExamReport.timeUsedMinutes} minit · Stati :{' '}
                        <strong
                          className={
                            completedExamReport.passed
                              ? 'text-emerald-700'
                              : 'text-amber-700'
                          }
                        >
                          {completedExamReport.passed
                            ? 'PASS (REYISI)'
                            : 'NEEDS IMPROVEMENT (POU RANFÒSE)'}
                        </strong>
                      </div>
                    </div>

                    <div className="text-right font-mono">
                      <div className="text-3xl font-bold text-[#0B2545]">
                        {completedExamReport.percentage}%
                      </div>
                      <div className="text-xs text-slate-600">
                        {completedExamReport.scorePoints} /{' '}
                        {completedExamReport.totalPoints} pwen
                      </div>
                    </div>
                  </div>

                  {/* Weak Topics & Recommended Lessons */}
                  {completedExamReport.weakTopicsHt.length > 0 && (
                    <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 space-y-2 text-xs">
                      <div className="font-bold text-amber-950">
                        Sijè pou Ranfòse & Leson Rekòmande :
                      </div>
                      <ul className="list-disc pl-5 space-y-1 text-amber-900">
                        {completedExamReport.recommendedLessonsHt.map((rec, i) => (
                          <li key={i}>{rec}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Detailed Question-by-Question Review */}
                  <div className="space-y-3 text-xs">
                    <h3 className="text-sm font-bold text-[#0B2545]">
                      Koreksyon Konplè ak Eksplikasyon Etap pa Etap :
                    </h3>
                    {selectedMockExam.questions.map((q, idx) => {
                      const stuAns = completedExamReport.answers[q.id] || 'Poko reponn';
                      const correct =
                        stuAns.trim().toLowerCase() ===
                        q.correctAnswer.trim().toLowerCase();
                      return (
                        <div
                          key={q.id}
                          className="p-4 rounded-xl border border-slate-200 bg-[#F8FAFC] space-y-2"
                        >
                          <div className="flex justify-between font-mono text-slate-500">
                            <span>
                              Kesyon {idx + 1} · {q.subjectNameHt}
                            </span>
                            <span
                              className={
                                correct
                                  ? 'text-emerald-700 font-bold'
                                  : 'text-red-700 font-bold'
                              }
                            >
                              {correct ? `✓ +${q.points} pwen` : `✕ 0/${q.points} pwen`}
                            </span>
                          </div>
                          <div className="font-bold text-[#0B2545]">{q.promptHt}</div>
                          <div>
                            <strong>Repons ou :</strong> {stuAns}
                          </div>
                          <div className="text-emerald-800 font-bold">
                            <strong>Repons Egzak :</strong> {q.correctAnswer}
                          </div>
                          <p className="text-slate-700">
                            <strong>Eksplikasyon :</strong> {q.stepByStepExplanationHt}
                          </p>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setCompletedExamReport(null)}
                      className="px-5 py-2.5 text-xs font-bold bg-[#0B2545] text-white rounded-lg cursor-pointer"
                    >
                      Retounen nan Lis Similasyon yo
                    </button>
                    <button
                      type="button"
                      onClick={() => startMockExamSession(selectedMockExam)}
                      className="px-4 py-2.5 text-xs font-semibold border border-slate-300 rounded-lg cursor-pointer"
                    >
                      Refè Similasyon sa a
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 7. GID REVIZYON (Study Guides, Formula Sheets, Timelines) */}
          {activeSubSection === 'Gid Revizyon' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-bold text-[#B91C1C]">
                    GID REVIZYON, FÈY FÒMIL & LIY TAN ISTORIK
                  </div>
                  <h2 className="text-xl font-bold text-[#0B2545]">
                    Materyèl Ofisyèl Preparasyon Egzamen Leta / Filo
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-2 text-xs font-bold bg-[#0B2545] text-white rounded-lg cursor-pointer inline-flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Enprime Gid Revizyon yo</span>
                </button>
              </div>

              <div className="space-y-4">
                {materials.map((mat) => (
                  <div
                    key={mat.id}
                    className="bg-white rounded-xl border border-slate-200 p-6 space-y-4 text-xs"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-slate-500">
                      <span>
                        {mat.subjectNameHt} · {mat.category}
                      </span>
                      <span>Mete ajou : {mat.updatedAt}</span>
                    </div>
                    <h3 className="text-lg font-bold text-[#0B2545]">{mat.titleHt}</h3>
                    <p className="text-slate-600">{mat.summaryHt}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {mat.contentSectionsHt.map((sec, i) => (
                        <div
                          key={i}
                          className="p-4 rounded-xl bg-[#F8FAFC] border border-slate-200 space-y-2"
                        >
                          <div className="font-bold text-[#0B2545]">{sec.heading}</div>
                          <ul className="list-disc pl-5 space-y-1 text-slate-700">
                            {sec.bullets.map((b, j) => (
                              <li key={j}>{b}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 8 & 9. REZILTA & PWOGRÈ */}
          {(activeSubSection === 'Rezilta' || activeSubSection === 'Pwogrè') && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
                <h2 className="text-xl font-bold text-[#0B2545]">
                  Rezilta & Suivi Pwogrè Egzamen Leta — {student.fullName} ({student.grade})
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 tabular-nums">
                  <div className="p-4 rounded-xl bg-[#F8FAFC] border border-slate-200">
                    <div className="text-xs text-slate-500">Pwogrè Global</div>
                    <div className="text-2xl font-bold text-[#0B2545] font-mono">
                      {overallProgressPercent}%
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-[#F8FAFC] border border-slate-200">
                    <div className="text-xs text-slate-500">Mwayèn Egzèsis</div>
                    <div className="text-2xl font-bold text-[#0B2545] font-mono">
                      {avgPracticeScore}%
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-[#F8FAFC] border border-slate-200">
                    <div className="text-xs text-slate-500">Mwayèn Similasyon</div>
                    <div className="text-2xl font-bold text-[#B91C1C] font-mono">
                      {avgMockExamScore}%
                    </div>
                  </div>
                </div>

                {/* Subject Mastery Bars */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                  {subjectProgressStats.map((st) => (
                    <div
                      key={st.subject.code}
                      className="p-3.5 rounded-xl bg-[#F8FAFC] border border-slate-200 space-y-1.5 text-xs"
                    >
                      <div className="flex justify-between font-bold text-[#0B2545]">
                        <span>{st.subject.nameHt}</span>
                        <span className="font-mono">{st.progressPercent}%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#0B2545] rounded-full"
                          style={{ width: `${st.progressPercent}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
                <h3 className="text-base font-bold text-[#0B2545]">
                  Istorik Tout Tantativ Egzèsis, Quiz ak Similasyon Egzamen
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs tabular-nums">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-500">
                        <th className="py-3 px-3">Dat</th>
                        <th className="py-3 px-3">Tip</th>
                        <th className="py-3 px-3">Matyè & Tit</th>
                        <th className="py-3 px-3">Tantativ</th>
                        <th className="py-3 px-3">Tan</th>
                        <th className="py-3 px-3">Nòt</th>
                        <th className="py-3 px-3">Stati</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {studentAttempts.map((a) => (
                        <tr key={a.id}>
                          <td className="py-3 px-3 font-mono">{a.date}</td>
                          <td className="py-3 px-3 font-semibold">{a.attemptType}</td>
                          <td className="py-3 px-3">
                            <div className="font-bold text-[#0B2545]">{a.titleHt}</div>
                            <div className="text-slate-500">{a.subjectNameHt}</div>
                          </td>
                          <td className="py-3 px-3 font-mono">#{a.attemptNumber}</td>
                          <td className="py-3 px-3 font-mono">{a.timeUsedMinutes} min</td>
                          <td className="py-3 px-3 font-mono font-bold">
                            {a.percentage}% ({a.scorePoints}/{a.totalPoints})
                          </td>
                          <td className="py-3 px-3 font-bold">
                            {a.passed ? (
                              <span className="text-emerald-700">● Pass</span>
                            ) : (
                              <span className="text-amber-700">▲ Needs Improvement</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 10. PLAN ETID (Weekly Study Plan) */}
          {activeSubSection === 'Plan Etid' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
                <h2 className="text-xl font-bold text-[#0B2545]">
                  Plan Etid Pèsonalize pou Egzamen Leta / Filo
                </h2>
                <p className="text-xs text-slate-600">
                   Koche aktivite ou fini chak jou epi ajoute nouvo sesyon revizyon sou matyè ki mande plis efò yo.
                </p>

                <div className="space-y-2.5">
                  {studentStudyTasks.map((task) => (
                    <div
                      key={task.id}
                      onClick={() => onToggleStudyPlanTask(task.id)}
                      className="p-4 rounded-xl bg-[#F8FAFC] border border-slate-200 flex items-center justify-between gap-4 cursor-pointer text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={task.completed}
                          onChange={() => {}}
                          className="w-4 h-4"
                        />
                        <div>
                          <div
                            className={`font-bold ${
                              task.completed
                                ? 'line-through text-slate-400'
                                : 'text-[#0B2545]'
                            }`}
                          >
                            {task.dayHt} · {task.subjectNameHt} — {task.topicTitleHt}
                          </div>
                          <div className="text-slate-500 font-mono">
                            {task.activityType} · {task.durationMinutes} minit
                          </div>
                        </div>
                      </div>
                      <span
                        className={`font-mono font-bold ${
                          task.completed ? 'text-emerald-700' : 'text-amber-700'
                        }`}
                      >
                        {task.completed ? '✓ Konplete' : 'An atant'}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Add New Study Plan Task */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!newTaskTopic.trim()) return;
                    const subjObj =
                      enabledSubjects.find((s) => s.code === newTaskSubj) ||
                      enabledSubjects[0];
                    onAddStudyPlanTask({
                      dayHt: newTaskDay,
                      subjectCode: subjObj.code,
                      subjectNameHt: subjObj.nameHt,
                      topicTitleHt: newTaskTopic.trim(),
                      activityType: newTaskType,
                      durationMinutes: newTaskDuration,
                    });
                    setNewTaskTopic('');
                  }}
                  className="p-4 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-1 sm:grid-cols-5 gap-3 text-xs"
                >
                  <select
                    value={newTaskDay}
                    onChange={(e) => setNewTaskDay(e.target.value)}
                    className="p-2.5 rounded-lg border border-slate-300 bg-white font-semibold"
                  >
                    {['Lendi', 'Madi', 'Mèkredi', 'Jedi', 'Vandredi', 'Samdi', 'Dimanch'].map(
                      (d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      )
                    )}
                  </select>
                  <select
                    value={newTaskSubj}
                    onChange={(e) =>
                      setNewTaskSubj(e.target.value as ExamPrepSubjectCode)
                    }
                    className="p-2.5 rounded-lg border border-slate-300 bg-white font-semibold"
                  >
                    {enabledSubjects.map((s) => (
                      <option key={s.code} value={s.code}>
                        {s.nameHt}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={newTaskTopic}
                    onChange={(e) => setNewTaskTopic(e.target.value)}
                    placeholder="Sijè pou etidye..."
                    className="p-2.5 rounded-lg border border-slate-300 bg-white sm:col-span-2"
                    required
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 font-bold bg-[#0B2545] text-white rounded-lg cursor-pointer"
                  >
                    + Ajoute nan Plan
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* 11. PEMAN / AKSÈ (Unified In-Dashboard StudentPaymentCenter) */}
          {activeSubSection === 'Peman / Aksè' && (
            <div className="space-y-4">
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={onOpenMainPaymentCenter}
                  className="px-4 py-2 text-xs font-bold bg-[#0B2545] text-white rounded-lg cursor-pointer"
                >
                  💳 Louvri nan seksyon Peman Prensipal la →
                </button>
              </div>
              <StudentPaymentCenter
                language={language}
                student={student}
                tuitionPayments={tuitionPayments}
                examPrepPayments={payments}
                initialPaymentType="Preparasyon Examen Leta / Filo"
                onSubmitTuitionReceipt={onSubmitTuitionReceipt}
                onSubmitExamPrepReceipt={onSubmitExamPrepPayment}
                onBack={() => onChangeSubSection('Dashboard Preparasyon')}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};
