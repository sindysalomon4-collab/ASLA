import React, { useMemo, useState } from 'react';
import {
  ASLA_GRADES,
  ExamPrepAccessStatus,
  ExamPrepAttempt,
  ExamPrepAuditLog,
  ExamPrepDifficulty,
  ExamPrepMaterial,
  ExamPrepMockExam,
  ExamPrepPaymentRecord,
  ExamPrepPaymentStatus,
  ExamPrepProgram,
  ExamPrepQuestion,
  ExamPrepQuestionType,
  ExamPrepStudentType,
  ExamPrepSubjectCode,
  ExamPrepSubjectConfig,
  ExamPrepTopic,
  GradeLevel,
  StudentAccount,
} from '../types';
import { getStudentExamPrepFee } from '../data/examPrepData';

export type ExamPrepAdminTab =
  | 'Preparation Dashboard'
  | 'Programs'
  | 'Subjects'
  | 'Revision Content'
  | 'Exam Questions'
  | 'Mock Exams'
  | 'Exam Materials'
  | 'Students'
  | 'Payments'
  | 'Access Approvals'
  | 'Results'
  | 'Progress'
  | 'Reports'
  | 'Settings';

export const EXAM_PREP_ADMIN_TABS: ExamPrepAdminTab[] = [
  'Preparation Dashboard',
  'Programs',
  'Subjects',
  'Revision Content',
  'Exam Questions',
  'Mock Exams',
  'Exam Materials',
  'Students',
  'Payments',
  'Access Approvals',
  'Results',
  'Progress',
  'Reports',
  'Settings',
];

interface ExamPrepAdminWorkspaceProps {
  students: StudentAccount[];
  programs: ExamPrepProgram[];
  subjectConfigs: ExamPrepSubjectConfig[];
  topics: ExamPrepTopic[];
  questions: ExamPrepQuestion[];
  mockExams: ExamPrepMockExam[];
  materials: ExamPrepMaterial[];
  attempts: ExamPrepAttempt[];
  examPrepPayments: ExamPrepPaymentRecord[];
  auditLogs: ExamPrepAuditLog[];
  initialTab?: ExamPrepAdminTab;
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
  onToggleSubjectEnabled: (subjectCode: ExamPrepSubjectCode) => void;
  onToggleProgramSubject: (
    programId: string,
    subjectCode: ExamPrepSubjectCode
  ) => void;
  onAddExamPrepTopic: (topic: ExamPrepTopic) => void;
  onAddExamPrepQuestion: (question: ExamPrepQuestion) => void;
  onAddExamPrepMockExam: (mockExam: ExamPrepMockExam) => void;
  onAddExamPrepMaterial: (material: ExamPrepMaterial) => void;
}

export const ExamPrepAdminWorkspace: React.FC<ExamPrepAdminWorkspaceProps> = ({
  students,
  programs,
  subjectConfigs,
  topics,
  questions,
  mockExams,
  materials,
  attempts,
  examPrepPayments,
  auditLogs,
  initialTab = 'Preparation Dashboard',
  onUpdateExamPrepPaymentStatus,
  onUpdateStudentExamPrepEligibility,
  onToggleSubjectEnabled,
  onToggleProgramSubject,
  onAddExamPrepTopic,
  onAddExamPrepQuestion,
  onAddExamPrepMockExam,
  onAddExamPrepMaterial,
}) => {
  const [activeTab, setActiveTab] = useState<ExamPrepAdminTab>(initialTab);

  // Payment Receipt Inspection & Rejection/Correction Reason State
  const [inspectedPayment, setInspectedPayment] =
    useState<ExamPrepPaymentRecord | null>(null);
  const [actionPaymentId, setActionPaymentId] = useState<string | null>(null);
  const [actionType, setActionType] = useState<
    'Rejected' | 'Correction Requested'
  >('Rejected');
  const [actionReasonText, setActionReasonText] = useState('');

  // Add Revision Topic Form State
  const [newTopicSubj, setNewTopicSubj] = useState<ExamPrepSubjectCode>('ISTW');
  const [newTopicTitle, setNewTopicTitle] = useState('');
  const [newTopicExp, setNewTopicExp] = useState('');
  const [newTopicConcept, setNewTopicConcept] = useState('');
  const [newTopicRuleLabel, setNewTopicRuleLabel] = useState('');
  const [newTopicRuleContent, setNewTopicRuleContent] = useState('');

  // Add Exam Question Form State
  const [newQSubj, setNewQSubj] = useState<ExamPrepSubjectCode>('ISTW');
  const [newQDiff, setNewQDiff] =
    useState<ExamPrepDifficulty>('Official Exam Level');
  const [newQType, setNewQType] =
    useState<ExamPrepQuestionType>('multiple_choice');
  const [newQPrompt, setNewQPrompt] = useState('');
  const [newQCorrect, setNewQCorrect] = useState('');
  const [newQOpt2, setNewQOpt2] = useState('');
  const [newQOpt3, setNewQOpt3] = useState('');
  const [newQExplanation, setNewQExplanation] = useState('');
  const [newQPoints, setNewQPoints] = useState(10);

  // Add Mock Exam Form State
  const [newMockTitle, setNewMockTitle] = useState('');
  const [newMockSubj, setNewMockSubj] = useState<ExamPrepSubjectCode | 'MULTI'>(
    'MULTI'
  );
  const [newMockDuration, setNewMockDuration] = useState(45);

  // Add Study Material Form State
  const [newMatSubj, setNewMatSubj] = useState<ExamPrepSubjectCode>('ISTW');
  const [newMatCat, setNewMatCat] =
    useState<ExamPrepMaterial['category']>('Gid Revizyon');
  const [newMatTitle, setNewMatTitle] = useState('');
  const [newMatSummary, setNewMatSummary] = useState('');
  const [newMatBullets, setNewMatBullets] = useState('');

  const pendingPaymentsCount = useMemo(
    () =>
      examPrepPayments.filter((p) => p.status === 'Pending Verification').length,
    [examPrepPayments]
  );

  const approvedRevenueHtg = useMemo(
    () =>
      examPrepPayments
        .filter((p) => p.status === 'Approved')
        .reduce((sum, p) => sum + p.submittedAmountHtg, 0),
    [examPrepPayments]
  );

  const activeAccessStudentsCount = useMemo(
    () => students.filter((s) => s.examPrepAccessStatus === 'Active').length,
    [students]
  );

  return (
    <div className="space-y-6">
      {/* Header & 14-Tab Sub-Navigation */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-xs font-bold text-[#B91C1C]">
              ADMINISTRASYON · PREPARASYON EGZAMEN LETA / FILO (MENFP)
            </div>
            <h1 className="text-2xl font-bold text-[#0B2545] mt-0.5">
              Sant Jesyon Preparasyon Egzamen Leta & Verifikasyon Peman (500 HTG / 2,000 HTG)
            </h1>
            <p className="text-xs text-slate-600 mt-1">
              Jere elijibilite elèv ASLA vs Ekstèn, valide resi peman yo, konfigire 9 matyè ofisyèl yo (enkli Istwa D Ayiti), epi swiv similasyon yo.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('Payments')}
              className="px-4 py-2 text-xs font-bold bg-[#B91C1C] text-white rounded-lg cursor-pointer"
            >
              Peman Egzamen Leta ({pendingPaymentsCount} Pending)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('Students')}
              className="px-4 py-2 text-xs font-bold bg-[#0B2545] text-white rounded-lg cursor-pointer"
            >
              Elijibilite Elèv (ASLA / Ekstèn)
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 pt-3 border-t border-slate-100">
          {EXAM_PREP_ADMIN_TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === tab
                  ? 'bg-[#0B2545] text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {tab}
              {tab === 'Payments' && pendingPaymentsCount > 0
                ? ` (${pendingPaymentsCount})`
                : ''}
            </button>
          ))}
        </div>
      </div>

      {/* 1. PREPARATION DASHBOARD */}
      {activeTab === 'Preparation Dashboard' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 tabular-nums">
            <div className="bg-white p-5 rounded-xl border border-slate-200">
              <div className="text-xs text-slate-500">Elèv avèk Aksè Aktif</div>
              <div className="text-2xl font-bold text-[#0B2545] font-mono mt-1">
                {activeAccessStudentsCount} / {students.length} Elèv
              </div>
              <div className="text-xs text-emerald-700 mt-1">
                ● Elèv ASLA (500 HTG) & Ekstèn (2,000 HTG)
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200">
              <div className="text-xs text-slate-500">
                Peman Egzamen Leta Apwouve
              </div>
              <div className="text-2xl font-bold text-[#0B2545] font-mono mt-1">
                {approvedRevenueHtg.toLocaleString()} HTG
              </div>
              <div className="text-xs text-amber-700 mt-1">
                ▲ {pendingPaymentsCount} resi ap tann verifikasyon
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200">
              <div className="text-xs text-slate-500">
                Matyè & Kontni Revizyon
              </div>
              <div className="text-2xl font-bold text-[#0B2545] font-mono mt-1">
                {subjectConfigs.filter((s) => s.enabled).length} Matyè · {topics.length} Sijè
              </div>
              <div className="text-xs text-slate-600 mt-1">
                {questions.length} Kesyon Tip Egzamen · {mockExams.length} Mock Exams
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200">
              <div className="text-xs text-slate-500">
                Tantativ & Similasyon Elèv
              </div>
              <div className="text-2xl font-bold text-[#0B2545] font-mono mt-1">
                {attempts.length} Tantativ
              </div>
              <div className="text-xs text-emerald-700 mt-1">
                ● Mwayèn :{' '}
                {attempts.length > 0
                  ? Math.round(
                      attempts.reduce((s, a) => s + a.percentage, 0) /
                        attempts.length
                    )
                  : 0}
                %
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
            <h2 className="text-base font-bold text-[#0B2545]">
              Règ Ofisyèl Aksè ak Tarif Preparasyon Egzamen Leta / Filo
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-[#F8FAFC] border border-slate-200 space-y-1">
                <div className="font-bold text-[#0B2545]">
                  1. Elèv ASLA ki fini tout klas/kour li yo: 500 HTG
                </div>
                <p className="text-slate-600">
                  Sistèm nan aplike 500 HTG otomatikman lè elèv la gen stati « ASLA Student » epi « completedRequiredAslaCourses = true ».
                </p>
              </div>
              <div className="p-4 rounded-xl bg-[#F8FAFC] border border-slate-200 space-y-1">
                <div className="font-bold text-[#B91C1C]">
                  2. Elèv ekstèn ki pa t fè klas li yo nan ASLA: 2,000 HTG
                </div>
                <p className="text-slate-600">
                  Sistèm nan aplike 2,000 HTG otomatikman pou tout kandida ekstèn oswa elèv ki pa t fini kour obligatwa yo nan ASLA.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. PROGRAMS CONFIGURATION */}
      {activeTab === 'Programs' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6">
          <div>
            <h2 className="text-xl font-bold text-[#0B2545]">
              Konfigirasyon Pwogram Egzamen Ofisyèl yo (9yèm AF · Rhéto / Bac I · Filo / Bac II)
            </h2>
            <p className="text-xs text-slate-600">
              Aktive oswa dezaktive matyè pou chak pwogram preparasyon egzamen Leta.
            </p>
          </div>

          <div className="space-y-4">
            {programs.map((prog) => (
              <div
                key={prog.id}
                className="p-5 rounded-xl bg-[#F8FAFC] border border-slate-200 space-y-3 text-xs"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <div className="font-mono text-[#B91C1C] font-bold">
                      {prog.code} · Klas : {prog.targetGrades.join(', ')}
                    </div>
                    <h3 className="text-base font-bold text-[#0B2545]">
                      {prog.titleHt}
                    </h3>
                    <p className="text-slate-600">{prog.descriptionHt}</p>
                  </div>
                  <div className="font-mono font-bold text-[#0B2545]">
                    Nòt pou Pase : {prog.passingPercentage}%
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 space-y-2">
                  <div className="font-semibold text-slate-700">
                    Matyè Aktive nan Pwogram sa a (Klike pou Aktive / Dezaktive) :
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {subjectConfigs.map((sc) => {
                      const isIncluded = prog.enabledSubjects.includes(sc.code);
                      return (
                        <button
                          key={sc.code}
                          type="button"
                          onClick={() => onToggleProgramSubject(prog.id, sc.code)}
                          className={`px-3 py-1.5 rounded-lg font-semibold border cursor-pointer ${
                            isIncluded
                              ? 'bg-[#0B2545] text-white border-[#0B2545]'
                              : 'bg-white text-slate-500 border-slate-300'
                          }`}
                        >
                          {isIncluded ? '✓ ' : '+ '}
                          {sc.nameHt}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. SUBJECTS MANAGEMENT */}
      {activeTab === 'Subjects' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
          <h2 className="text-xl font-bold text-[#0B2545]">
            9 Matyè Ofisyèl Preparasyon Egzamen Leta / Filo (Istwa D Ayiti se yon Matyè Apa)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            {subjectConfigs.map((sc) => (
              <div
                key={sc.code}
                className="p-4 rounded-xl bg-[#F8FAFC] border border-slate-200 flex flex-col justify-between space-y-3"
              >
                <div className="space-y-1">
                  <div className="flex justify-between font-mono text-slate-500">
                    <span>
                      {sc.code} · Koefisyan {sc.coefficient}
                    </span>
                    <span
                      className={
                        sc.enabled
                          ? 'text-emerald-700 font-bold'
                          : 'text-red-700 font-bold'
                      }
                    >
                      {sc.enabled ? '● Enabled' : '✕ Disabled'}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-[#0B2545]">
                    {sc.nameHt}
                  </h3>
                  <p className="text-slate-600">{sc.descriptionHt}</p>
                </div>
                <button
                  type="button"
                  onClick={() => onToggleSubjectEnabled(sc.code)}
                  className="px-3 py-2 font-semibold border border-slate-300 bg-white rounded-lg hover:bg-slate-100 cursor-pointer"
                >
                  {sc.enabled ? 'Dezaktive Matyè a' : 'Aktive Matyè a'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. REVISION CONTENT */}
      {activeTab === 'Revision Content' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
            <h2 className="text-xl font-bold text-[#0B2545]">
              Ajoute Nouvo Leson Revizyon pa Matyè
            </h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!newTopicTitle.trim() || !newTopicExp.trim()) return;
                const subjObj =
                  subjectConfigs.find((s) => s.code === newTopicSubj) ||
                  subjectConfigs[0];
                onAddExamPrepTopic({
                  id: `ept-${newTopicSubj.toLowerCase()}-${Date.now()}`,
                  subjectCode: newTopicSubj,
                  subjectNameHt: subjObj.nameHt,
                  chapterNumber: 2,
                  topicNumber: topics.filter((t) => t.subjectCode === newTopicSubj)
                    .length + 1,
                  titleHt: newTopicTitle.trim(),
                  titleFr: newTopicTitle.trim(),
                  titleEn: newTopicTitle.trim(),
                  targetGrades: ASLA_GRADES,
                  estimatedMinutes: 45,
                  explanationHt: [newTopicExp.trim()],
                  keyConceptsHt: [
                    newTopicConcept.trim() || 'Konsèp fondamantal Egzamen Leta',
                  ],
                  formulasOrRulesHt: [
                    {
                      label: newTopicRuleLabel.trim() || 'Règ / Dat Kle',
                      content:
                        newTopicRuleContent.trim() ||
                        'Aplike metòd ofisyèl MENFP la.',
                    },
                  ],
                  examplesHt: [
                    {
                      title: `Egzanp Modèl — ${newTopicTitle.trim()}`,
                      problem: 'Analize epi rezoud dapre metòd ofisyèl la.',
                      stepByStepSolution: [
                        'Etap 1: Idantifye done kesyon an.',
                        'Etap 2: Aplike fòmil oswa règ istorik/gramatikal la.',
                      ],
                      finalAnswer: 'Repons verifye.',
                    },
                  ],
                  commonExamMistakesHt: [
                    'Pa bliye verifye chak etap kalkil oswa dat istorik anvan ou remèt fèy la.',
                  ],
                  quickReviewHt: [newTopicExp.trim()],
                  practiceQuestions: questions.filter(
                    (q) => q.subjectCode === newTopicSubj
                  ),
                });
                setNewTopicTitle('');
                setNewTopicExp('');
                setNewTopicConcept('');
                setNewTopicRuleLabel('');
                setNewTopicRuleContent('');
              }}
              className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 text-xs"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <select
                  value={newTopicSubj}
                  onChange={(e) =>
                    setNewTopicSubj(e.target.value as ExamPrepSubjectCode)
                  }
                  className="p-2.5 rounded-lg border border-slate-300 bg-white font-semibold"
                >
                  {subjectConfigs.map((s) => (
                    <option key={s.code} value={s.code}>
                      {s.nameHt}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  value={newTopicTitle}
                  onChange={(e) => setNewTopicTitle(e.target.value)}
                  placeholder="Tit Sijè / Leson Revizyon an..."
                  className="p-2.5 rounded-lg border border-slate-300 bg-white"
                  required
                />
              </div>
              <textarea
                rows={2}
                value={newTopicExp}
                onChange={(e) => setNewTopicExp(e.target.value)}
                placeholder="Eksplikasyon detaye leson revizyon an..."
                className="w-full p-2.5 rounded-lg border border-slate-300 bg-white"
                required
              />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  value={newTopicConcept}
                  onChange={(e) => setNewTopicConcept(e.target.value)}
                  placeholder="Konsèp kle..."
                  className="p-2.5 rounded-lg border border-slate-300 bg-white"
                />
                <input
                  type="text"
                  value={newTopicRuleLabel}
                  onChange={(e) => setNewTopicRuleLabel(e.target.value)}
                  placeholder="Tit Fòmil / Dat..."
                  className="p-2.5 rounded-lg border border-slate-300 bg-white"
                />
                <input
                  type="text"
                  value={newTopicRuleContent}
                  onChange={(e) => setNewTopicRuleContent(e.target.value)}
                  placeholder="Kontni Fòmil / Dat..."
                  className="p-2.5 rounded-lg border border-slate-300 bg-white"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 font-bold bg-[#0B2545] text-white rounded-lg cursor-pointer"
              >
                + Pibliye Leson Revizyon
              </button>
            </form>

            <div className="space-y-2.5 text-xs">
              {topics.map((tp) => (
                <div
                  key={tp.id}
                  className="p-4 rounded-xl bg-[#F8FAFC] border border-slate-200 flex items-center justify-between"
                >
                  <div>
                    <div className="font-mono text-slate-500">
                      {tp.subjectNameHt} · Chapit {tp.chapterNumber}
                    </div>
                    <div className="font-bold text-[#0B2545] text-sm">
                      {tp.titleHt}
                    </div>
                  </div>
                  <span className="font-mono text-slate-600">
                    {tp.estimatedMinutes} min
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 5. EXAM QUESTIONS BANK */}
      {activeTab === 'Exam Questions' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6">
          <h2 className="text-xl font-bold text-[#0B2545]">
            Bank Kesyon Tip Egzamen Leta ({questions.length} Kesyon)
          </h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!newQPrompt.trim() || !newQCorrect.trim()) return;
              const subjObj =
                subjectConfigs.find((s) => s.code === newQSubj) ||
                subjectConfigs[0];
              onAddExamPrepQuestion({
                id: `epq-${Date.now()}`,
                subjectCode: newQSubj,
                subjectNameHt: subjObj.nameHt,
                topicId:
                  topics.find((t) => t.subjectCode === newQSubj)?.id ||
                  'ept-istw-1',
                topicTitleHt:
                  topics.find((t) => t.subjectCode === newQSubj)?.titleHt ||
                  subjObj.nameHt,
                gradeLevels: ASLA_GRADES,
                difficulty: newQDiff,
                questionType: newQType,
                promptHt: newQPrompt.trim(),
                options: [
                  newQCorrect.trim(),
                  newQOpt2.trim() || 'Opsyon B',
                  newQOpt3.trim() || 'Opsyon C',
                ],
                correctAnswer: newQCorrect.trim(),
                stepByStepExplanationHt:
                  newQExplanation.trim() || 'Koreksyon ofisyèl verifye.',
                points: newQPoints,
                isOfficialPastExamStyle: true,
                examYearReference: 'MENFP — Nouvo Sujè',
              });
              setNewQPrompt('');
              setNewQCorrect('');
              setNewQOpt2('');
              setNewQOpt3('');
              setNewQExplanation('');
            }}
            className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 text-xs"
          >
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <select
                value={newQSubj}
                onChange={(e) =>
                  setNewQSubj(e.target.value as ExamPrepSubjectCode)
                }
                className="p-2.5 rounded-lg border border-slate-300 bg-white font-semibold"
              >
                {subjectConfigs.map((s) => (
                  <option key={s.code} value={s.code}>
                    {s.nameHt}
                  </option>
                ))}
              </select>
              <select
                value={newQDiff}
                onChange={(e) => setNewQDiff(e.target.value as ExamPrepDifficulty)}
                className="p-2.5 rounded-lg border border-slate-300 bg-white font-semibold"
              >
                <option value="Official Exam Level">Official Exam Level</option>
                <option value="Hard">Hard</option>
                <option value="Medium">Medium</option>
                <option value="Easy">Easy</option>
              </select>
              <select
                value={newQType}
                onChange={(e) =>
                  setNewQType(e.target.value as ExamPrepQuestionType)
                }
                className="p-2.5 rounded-lg border border-slate-300 bg-white font-semibold"
              >
                <option value="multiple_choice">Multiple Choice</option>
                <option value="historical_analysis">Historical Analysis</option>
                <option value="math_problem_solving">Math Problem Solving</option>
                <option value="reading_comprehension">Reading Comprehension</option>
                <option value="short_answer">Short Answer</option>
              </select>
              <input
                type="number"
                value={newQPoints}
                onChange={(e) => setNewQPoints(Number(e.target.value))}
                className="p-2.5 rounded-lg border border-slate-300 bg-white font-mono"
              />
            </div>
            <input
              type="text"
              value={newQPrompt}
              onChange={(e) => setNewQPrompt(e.target.value)}
              placeholder="Enonse kesyon tip egzamen Leta a..."
              className="w-full p-2.5 rounded-lg border border-slate-300 bg-white"
              required
            />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                value={newQCorrect}
                onChange={(e) => setNewQCorrect(e.target.value)}
                placeholder="Repons Egzak (Opsyon Kòrèk) *"
                className="p-2.5 rounded-lg border border-emerald-400 bg-white"
                required
              />
              <input
                type="text"
                value={newQOpt2}
                onChange={(e) => setNewQOpt2(e.target.value)}
                placeholder="Dezyèm chwa..."
                className="p-2.5 rounded-lg border border-slate-300 bg-white"
              />
              <input
                type="text"
                value={newQOpt3}
                onChange={(e) => setNewQOpt3(e.target.value)}
                placeholder="Twazyèm chwa..."
                className="p-2.5 rounded-lg border border-slate-300 bg-white"
              />
            </div>
            <input
              type="text"
              value={newQExplanation}
              onChange={(e) => setNewQExplanation(e.target.value)}
              placeholder="Eksplikasyon etap pa etap..."
              className="w-full p-2.5 rounded-lg border border-slate-300 bg-white"
            />
            <button
              type="submit"
              className="px-4 py-2 font-bold bg-[#0B2545] text-white rounded-lg cursor-pointer"
            >
              + Ajoute Kesyon nan Bank Egzamen an
            </button>
          </form>

          <div className="space-y-2.5 text-xs">
            {questions.map((q, idx) => (
              <div
                key={q.id}
                className="p-4 rounded-xl bg-[#F8FAFC] border border-slate-200 space-y-1"
              >
                <div className="flex justify-between font-mono text-slate-500">
                  <span>
                    #{idx + 1} · {q.subjectNameHt} ({q.questionType})
                  </span>
                  <span>{q.points} pwen</span>
                </div>
                <div className="font-bold text-[#0B2545]">{q.promptHt}</div>
                <div className="text-emerald-800">
                  Repons : {q.correctAnswer}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. MOCK EXAMS */}
      {activeTab === 'Mock Exams' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6">
          <h2 className="text-xl font-bold text-[#0B2545]">
            Jesyon Similasyon Egzamen & Mock Exams ({mockExams.length})
          </h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!newMockTitle.trim()) return;
              const subjQuestions =
                newMockSubj === 'MULTI'
                  ? questions
                  : questions.filter((q) => q.subjectCode === newMockSubj);
              const totalPts = subjQuestions.reduce((s, q) => s + q.points, 0);
              onAddExamPrepMockExam({
                id: `mock-${Date.now()}`,
                titleHt: newMockTitle.trim(),
                titleFr: newMockTitle.trim(),
                titleEn: newMockTitle.trim(),
                programId: 'prog-philo',
                targetGrades: ASLA_GRADES,
                subjectCode: newMockSubj,
                subjectNameHt:
                  newMockSubj === 'MULTI'
                    ? 'Multi-Matyè'
                    : subjectConfigs.find((s) => s.code === newMockSubj)
                        ?.nameHt || 'Matyè',
                durationMinutes: newMockDuration,
                totalPoints: totalPts || 100,
                passingScorePercent: 65,
                isFullSimulation: newMockSubj === 'MULTI',
                instructionsHt:
                  'Similasyon ofisyèl kronometre kreye pa Administrasyon ASLA.',
                questions: subjQuestions.length > 0 ? subjQuestions : questions,
              });
              setNewMockTitle('');
            }}
            className="p-4 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs"
          >
            <input
              type="text"
              value={newMockTitle}
              onChange={(e) => setNewMockTitle(e.target.value)}
              placeholder="Tit Nouvo Mock Exam lan..."
              className="p-2.5 rounded-lg border border-slate-300 bg-white sm:col-span-2"
              required
            />
            <select
              value={newMockSubj}
              onChange={(e) => setNewMockSubj(e.target.value as any)}
              className="p-2.5 rounded-lg border border-slate-300 bg-white font-semibold"
            >
              <option value="MULTI">Multi-Matyè (Similasyon Konplè)</option>
              {subjectConfigs.map((s) => (
                <option key={s.code} value={s.code}>
                  {s.nameHt}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="px-4 py-2.5 font-bold bg-[#0B2545] text-white rounded-lg cursor-pointer"
            >
              + Kreye Mock Exam
            </button>
          </form>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {mockExams.map((m) => (
              <div
                key={m.id}
                className="p-4 rounded-xl bg-[#F8FAFC] border border-slate-200 space-y-1.5"
              >
                <div className="font-mono text-slate-500">
                  {m.subjectNameHt} · {m.durationMinutes} min · {m.totalPoints} pwen
                </div>
                <div className="font-bold text-sm text-[#0B2545]">{m.titleHt}</div>
                <p className="text-slate-600">{m.instructionsHt}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 7. EXAM MATERIALS */}
      {activeTab === 'Exam Materials' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6">
          <h2 className="text-xl font-bold text-[#0B2545]">
            Gid Revizyon, Fèy Fòmil & Liy Tan Istorik ({materials.length})
          </h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!newMatTitle.trim()) return;
              const subjObj =
                subjectConfigs.find((s) => s.code === newMatSubj) ||
                subjectConfigs[0];
              onAddExamPrepMaterial({
                id: `mat-${Date.now()}`,
                subjectCode: newMatSubj,
                subjectNameHt: subjObj.nameHt,
                targetGrades: ASLA_GRADES,
                category: newMatCat,
                titleHt: newMatTitle.trim(),
                summaryHt: newMatSummary.trim() || 'Gid revizyon ofisyèl ASLA.',
                contentSectionsHt: [
                  {
                    heading: 'Pwen Esansyèl pou Retni',
                    bullets: newMatBullets
                      .split('\n')
                      .map((b) => b.trim())
                      .filter(Boolean),
                  },
                ],
                updatedAt: new Date().toISOString().slice(0, 10),
              });
              setNewMatTitle('');
              setNewMatSummary('');
              setNewMatBullets('');
            }}
            className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 text-xs"
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <select
                value={newMatSubj}
                onChange={(e) =>
                  setNewMatSubj(e.target.value as ExamPrepSubjectCode)
                }
                className="p-2.5 rounded-lg border border-slate-300 bg-white font-semibold"
              >
                {subjectConfigs.map((s) => (
                  <option key={s.code} value={s.code}>
                    {s.nameHt}
                  </option>
                ))}
              </select>
              <select
                value={newMatCat}
                onChange={(e) => setNewMatCat(e.target.value as any)}
                className="p-2.5 rounded-lg border border-slate-300 bg-white font-semibold"
              >
                <option value="Gid Revizyon">Gid Revizyon</option>
                <option value="Fèy Fòmil & Règ">Fèy Fòmil & Règ</option>
                <option value=" Liy Tan Istorik">Liy Tan Istorik</option>
                <option value=" Ansyen Egzamen Leta">Ansyen Egzamen Leta</option>
              </select>
              <input
                type="text"
                value={newMatTitle}
                onChange={(e) => setNewMatTitle(e.target.value)}
                placeholder="Tit Gid Revizyon an..."
                className="p-2.5 rounded-lg border border-slate-300 bg-white"
                required
              />
            </div>
            <textarea
              rows={2}
              value={newMatBullets}
              onChange={(e) => setNewMatBullets(e.target.value)}
              placeholder="Pwen revizyon yo (yon pwen sou chak liy)..."
              className="w-full p-2.5 rounded-lg border border-slate-300 bg-white"
              required
            />
            <button
              type="submit"
              className="px-4 py-2 font-bold bg-[#0B2545] text-white rounded-lg cursor-pointer"
            >
              + Pibliye Gid Revizyon
            </button>
          </form>

          <div className="space-y-3 text-xs">
            {materials.map((mat) => (
              <div
                key={mat.id}
                className="p-4 rounded-xl bg-[#F8FAFC] border border-slate-200 space-y-1"
              >
                <div className="font-mono text-slate-500">
                  {mat.subjectNameHt} · {mat.category}
                </div>
                <div className="font-bold text-sm text-[#0B2545]">{mat.titleHt}</div>
                <p className="text-slate-600">{mat.summaryHt}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 8 & 10. STUDENTS ELIGIBILITY & ACCESS APPROVALS */}
      {(activeTab === 'Students' || activeTab === 'Access Approvals') && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
          <div>
            <div className="text-xs font-bold text-[#B91C1C]">
              KONTWÒL ELIJIBILITE ELÈV (ASLA STUDENT 500 HTG vs EXTERNAL STUDENT 2,000 HTG)
            </div>
            <h2 className="text-xl font-bold text-[#0B2545] mt-0.5">
              Verifikasyon Stati Elèv & Aktivasyon Aksè Egzamen Leta / Filo
            </h2>
            <p className="text-xs text-slate-600">
              Administratè a ka verifye epi chanje si elèv la se yon « ASLA Student » ki fini kour li yo (500 HTG) oswa yon « External Student » (2,000 HTG), epi aktive oswa revoke aksè li.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs tabular-nums">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className="py-3 px-2.5">Elèv & ID</th>
                  <th className="py-3 px-2.5">Klas</th>
                  <th className="py-3 px-2.5">Tip Elèv (ASLA / External)</th>
                  <th className="py-3 px-2.5">Fini Kour ASLA?</th>
                  <th className="py-3 px-2.5">Tarif Kalkile</th>
                  <th className="py-3 px-2.5">Stati Peman</th>
                  <th className="py-3 px-2.5">Aksè Egzamen Leta</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {students.map((stu) => {
                  const sType = stu.examPrepStudentType || 'ASLA Student';
                  const completedCourses =
                    stu.completedRequiredAslaCourses !== false;
                  const calcFee = getStudentExamPrepFee(stu);
                  const accStatus =
                    stu.examPrepAccessStatus || 'Payment Required';
                  return (
                    <tr key={stu.id} className="hover:bg-slate-50">
                      <td className="py-3 px-2.5">
                        <div className="font-bold text-[#0B2545]">
                          {stu.fullName}
                        </div>
                        <div className="font-mono text-slate-500">
                          {stu.studentCode}
                        </div>
                      </td>
                      <td className="py-3 px-2.5 font-semibold text-[#B91C1C]">
                        {stu.grade}
                      </td>
                      <td className="py-3 px-2.5">
                        <select
                          value={sType}
                          onChange={(e) => {
                            const nextType = e.target
                              .value as ExamPrepStudentType;
                            onUpdateStudentExamPrepEligibility(
                              stu.id,
                              nextType,
                              nextType === 'ASLA Student'
                                ? completedCourses
                                : false,
                              accStatus,
                              stu.teacherExamPrepRecommendation
                            );
                          }}
                          className="p-1.5 rounded border border-slate-300 bg-white font-semibold"
                        >
                          <option value="ASLA Student">ASLA Student</option>
                          <option value="External Student">
                            External Student
                          </option>
                        </select>
                      </td>
                      <td className="py-3 px-2.5">
                        <input
                          type="checkbox"
                          checked={completedCourses}
                          onChange={(e) =>
                            onUpdateStudentExamPrepEligibility(
                              stu.id,
                              sType,
                              e.target.checked,
                              accStatus,
                              stu.teacherExamPrepRecommendation
                            )
                          }
                          className="w-4 h-4"
                        />
                      </td>
                      <td className="py-3 px-2.5 font-mono font-bold text-[#0B2545]">
                        {calcFee.toLocaleString()} HTG
                      </td>
                      <td className="py-3 px-2.5 font-mono">
                        {stu.examPrepPaymentStatus || 'Not Submitted'}
                      </td>
                      <td className="py-3 px-2.5">
                        <select
                          value={accStatus}
                          onChange={(e) =>
                            onUpdateStudentExamPrepEligibility(
                              stu.id,
                              sType,
                              completedCourses,
                              e.target.value as ExamPrepAccessStatus,
                              stu.teacherExamPrepRecommendation
                            )
                          }
                          className="p-1.5 rounded border border-slate-300 bg-white font-bold text-[#0B2545]"
                        >
                          <option value="Active">Active (Aktif)</option>
                          <option value="Pending Verification">
                            Pending Verification
                          </option>
                          <option value="Payment Required">
                            Payment Required
                          </option>
                          <option value="Rejected">Rejected</option>
                          <option value="Correction Requested">
                            Correction Requested
                          </option>
                          <option value="Revoked">Revoked</option>
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 9. PAYMENTS (Administration → Payments → Examen Leta / Filo) */}
      {activeTab === 'Payments' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <div className="text-xs font-bold text-[#B91C1C]">
              ADMINISTRATION → PAYMENTS → EXAMEN LETA / FILO
            </div>
            <h2 className="text-xl font-bold text-[#0B2545] mt-0.5">
              Verifikasyon Resi Peman Preparasyon Egzamen Leta / Filo (500 HTG & 2,000 HTG)
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              Enspekte resi elèv la. Si ou klike « Approve », Peman = Approved epi Examen Leta / Filo Access = Active otomatikman.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs tabular-nums">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className="py-3 px-2">Elèv & ID</th>
                  <th className="py-3 px-2">Tip Elèv (ASLA/External)</th>
                  <th className="py-3 px-2">Klas</th>
                  <th className="py-3 px-2">Montan Egzije</th>
                  <th className="py-3 px-2">Montan Soumèt</th>
                  <th className="py-3 px-2">Resi</th>
                  <th className="py-3 px-2">Dat Soumèt</th>
                  <th className="py-3 px-2">Stati Peman</th>
                  <th className="py-3 px-2 text-right">Aksyon Administratè</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {examPrepPayments.map((pay) => (
                  <tr key={pay.id} className="hover:bg-slate-50">
                    <td className="py-3 px-2">
                      <div className="font-bold text-[#0B2545]">
                        {pay.studentName}
                      </div>
                      <div className="font-mono text-slate-500">
                        {pay.studentCode}
                      </div>
                    </td>
                    <td className="py-3 px-2">
                      <div className="font-semibold">{pay.studentType}</div>
                      <div className="text-[11px] text-slate-500">
                        {pay.completedRequiredAslaCourses
                          ? 'Fini kour ASLA (500 HTG)'
                          : 'Elèv Ekstèn (2,000 HTG)'}
                      </div>
                    </td>
                    <td className="py-3 px-2 font-semibold text-[#B91C1C]">
                      {pay.grade}
                    </td>
                    <td className="py-3 px-2 font-mono font-bold">
                      {pay.expectedAmountHtg.toLocaleString()} HTG
                    </td>
                    <td className="py-3 px-2 font-mono font-bold text-[#0B2545]">
                      {pay.submittedAmountHtg.toLocaleString()} HTG
                    </td>
                    <td className="py-3 px-2">
                      <button
                        type="button"
                        onClick={() => setInspectedPayment(pay)}
                        className="px-2.5 py-1 text-xs font-semibold text-[#0B2545] border border-slate-300 rounded hover:bg-slate-100 cursor-pointer whitespace-nowrap"
                      >
                        View Receipt
                      </button>
                    </td>
                    <td className="py-3 px-2 font-mono">{pay.submittedAt}</td>
                    <td className="py-3 px-2 font-bold">
                      {pay.status === 'Approved' && (
                        <span className="text-emerald-700">● Approved</span>
                      )}
                      {pay.status === 'Pending Verification' && (
                        <span className="text-amber-700">
                          ▲ Pending Verification
                        </span>
                      )}
                      {(pay.status === 'Rejected' ||
                        pay.status === 'Correction Requested') && (
                        <div className="text-red-700">
                          <div>✕ {pay.status}</div>
                          {pay.rejectionOrCorrectionReason && (
                            <div className="text-[11px] font-normal max-w-xs">
                              Rezon: {pay.rejectionOrCorrectionReason}
                            </div>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-2 text-right space-x-1 whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() =>
                          onUpdateExamPrepPaymentStatus(pay.id, 'Approved')
                        }
                        className="px-2.5 py-1 text-xs font-semibold bg-emerald-700 text-white rounded hover:bg-emerald-800 cursor-pointer"
                      >
                        Approve
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setActionPaymentId(pay.id);
                          setActionType('Rejected');
                          setActionReasonText(
                            pay.rejectionOrCorrectionReason || ''
                          );
                        }}
                        className="px-2.5 py-1 text-xs font-semibold bg-red-700 text-white rounded hover:bg-red-800 cursor-pointer"
                      >
                        Reject
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setActionPaymentId(pay.id);
                          setActionType('Correction Requested');
                          setActionReasonText(
                            pay.rejectionOrCorrectionReason || ''
                          );
                        }}
                        className="px-2.5 py-1 text-xs font-semibold bg-amber-600 text-white rounded hover:bg-amber-700 cursor-pointer"
                      >
                        Request Correction
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Inline Reject / Request Correction Panel */}
          {actionPaymentId && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-red-950">
                  Antre Rezon pou « {actionType} » (Elèv la ap wè rezon sa a) :
                </h4>
                <button
                  type="button"
                  onClick={() => setActionPaymentId(null)}
                  className="font-semibold text-slate-600 cursor-pointer"
                >
                  ✕ Fèmen
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                <input
                  type="text"
                  value={actionReasonText}
                  onChange={(e) => setActionReasonText(e.target.value)}
                  placeholder="egz. Montan sou resi a pa koresponn ak tarif elèv ekstèn 2,000 HTG oswa foto a flou..."
                  className="flex-1 p-2.5 rounded-lg border border-red-300 bg-white"
                />
                <button
                  type="button"
                  onClick={() => {
                    onUpdateExamPrepPaymentStatus(
                      actionPaymentId,
                      actionType,
                      actionReasonText.trim() ||
                        'Tanpri verifye resi a epi soumèt yon nouvo prèv peman.'
                    );
                    setActionPaymentId(null);
                  }}
                  className="px-4 py-2 font-bold bg-red-700 text-white rounded-lg cursor-pointer"
                >
                  Konfime {actionType}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 11 & 12. RESULTS & PROGRESS */}
      {(activeTab === 'Results' || activeTab === 'Progress') && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6">
          <h2 className="text-xl font-bold text-[#0B2545]">
            Rezilta Similasyon & Suivi Pwogrè Elèv yo nan Preparasyon Egzamen Leta
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs tabular-nums">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className="py-3 px-3">Dat</th>
                  <th className="py-3 px-3">Elèv</th>
                  <th className="py-3 px-3">Klas</th>
                  <th className="py-3 px-3">Tip</th>
                  <th className="py-3 px-3">Matyè & Egzamen</th>
                  <th className="py-3 px-3">Nòt</th>
                  <th className="py-3 px-3">Stati</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {attempts.map((att) => (
                  <tr key={att.id}>
                    <td className="py-3 px-3 font-mono">{att.date}</td>
                    <td className="py-3 px-3 font-bold text-[#0B2545]">
                      {att.studentName}
                    </td>
                    <td className="py-3 px-3">{att.grade}</td>
                    <td className="py-3 px-3">{att.attemptType}</td>
                    <td className="py-3 px-3">
                      <div className="font-bold text-[#0B2545]">{att.titleHt}</div>
                      <div className="text-slate-500">{att.subjectNameHt}</div>
                    </td>
                    <td className="py-3 px-3 font-mono font-bold">
                      {att.percentage}% ({att.scorePoints}/{att.totalPoints})
                    </td>
                    <td className="py-3 px-3 font-bold">
                      {att.passed ? (
                        <span className="text-emerald-700">● Pass</span>
                      ) : (
                        <span className="text-amber-700">
                          ▲ Needs Improvement
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 13 & 14. REPORTS, AUDIT LOG & SETTINGS */}
      {(activeTab === 'Reports' || activeTab === 'Settings') && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4 text-xs">
            <h2 className="text-xl font-bold text-[#0B2545]">
              Paramèt Ofisyèl & Rapò Kontwòl (Audit Log) — Examen Leta / Filo
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-[#F8FAFC] border border-slate-200">
                <div className="text-slate-500">Tarif Elèv ASLA (Fini Kour)</div>
                <div className="text-xl font-bold text-[#0B2545] font-mono mt-1">
                  500 HTG
                </div>
              </div>
              <div className="p-4 rounded-xl bg-[#F8FAFC] border border-slate-200">
                <div className="text-slate-500">Tarif Elèv Ekstèn</div>
                <div className="text-xl font-bold text-[#B91C1C] font-mono mt-1">
                  2,000 HTG
                </div>
              </div>
              <div className="p-4 rounded-xl bg-[#F8FAFC] border border-slate-200">
                <div className="text-slate-500"> Total Peman Valide</div>
                <div className="text-xl font-bold text-emerald-700 font-mono mt-1">
                  {approvedRevenueHtg.toLocaleString()} HTG
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 space-y-3">
              <h3 className="text-sm font-bold text-[#0B2545]">
                Jounal Verifikasyon Administrasyon (Audit Log)
              </h3>
              <div className="space-y-2">
                {auditLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-3.5 rounded-lg bg-[#F8FAFC] border border-slate-200 flex flex-wrap items-center justify-between gap-2"
                  >
                    <div>
                      <div className="font-bold text-[#0B2545]">
                        {log.action} — {log.studentName}
                      </div>
                      <div className="text-slate-600">{log.details}</div>
                    </div>
                    <div className="font-mono text-slate-500">
                      {log.timestamp} · {log.adminName}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Receipt Inspection Modal */}
      {inspectedPayment && (
        <div className="fixed inset-0 z-50 bg-black/55 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-slate-200 max-w-lg w-full p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-base font-bold text-[#0B2545]">
                Resi Peman Egzamen Leta / Filo — {inspectedPayment.studentName}
              </h3>
              <button
                type="button"
                onClick={() => setInspectedPayment(null)}
                className="px-2.5 py-1 font-semibold border border-slate-200 rounded cursor-pointer"
              >
                ✕ Fèmen
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 font-mono">
              <div>Elèv : {inspectedPayment.studentName} ({inspectedPayment.studentCode})</div>
              <div>Tip Elèv : {inspectedPayment.studentType}</div>
              <div>Klas : {inspectedPayment.grade} · {inspectedPayment.classroom}</div>
              <div>Montan Egzije : {inspectedPayment.expectedAmountHtg.toLocaleString()} HTG</div>
              <div>Montan Soumèt : {inspectedPayment.submittedAmountHtg.toLocaleString()} HTG</div>
              <div>Metòd & Ref : {inspectedPayment.paymentMethod} · {inspectedPayment.transactionReference}</div>
              <div>Fichye : {inspectedPayment.receiptFileName}</div>
              <div>Dat : {inspectedPayment.submittedAt}</div>
              <div>Stati : {inspectedPayment.status}</div>
            </div>

            {inspectedPayment.receiptDataUrl && (
              <div className="rounded-lg overflow-hidden border border-slate-200 max-h-60">
                <img
                  src={inspectedPayment.receiptDataUrl}
                  alt="Resi Egzamen Leta"
                  className="w-full h-full object-contain"
                />
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  onUpdateExamPrepPaymentStatus(inspectedPayment.id, 'Approved');
                  setInspectedPayment(null);
                }}
                className="px-4 py-2 font-bold bg-emerald-700 text-white rounded-lg cursor-pointer"
              >
                Approve & Activate Access
              </button>
              <button
                type="button"
                onClick={() => setInspectedPayment(null)}
                className="px-4 py-2 font-semibold border border-slate-300 rounded-lg cursor-pointer"
              >
                Fèmen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
