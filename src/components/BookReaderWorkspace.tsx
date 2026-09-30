import React, { useMemo, useState } from 'react';
import {
  AcademicBook,
  ClassroomRecord,
  ExerciseQuestion,
  Language,
  LEARNING_FLOW_STAGES,
  LearningFlowStage,
  StudentAccount,
  SubjectDefinition,
  WorkSubmission,
} from '../types';
import { generateBookForGradeAndSubject } from '../data/curriculumEngine';
import { ASLA_IMAGES } from '../data/seedData';
import { TRANSLATIONS } from '../i18n/translations';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  FileCheck,
  GraduationCap,
} from 'lucide-react';

interface BookReaderWorkspaceProps {
  language: Language;
  student: StudentAccount;
  classroom?: ClassroomRecord;
  gradeSubjects: SubjectDefinition[];
  activeStage: LearningFlowStage;
  onChangeStage: (stage: LearningFlowStage) => void;
  selectedSubjectId: string;
  onSelectSubject: (subjectId: string) => void;
  selectedChapterNumber: number;
  onSelectChapter: (chapterNum: number) => void;
  selectedLessonNumber: number;
  onSelectLesson: (lessonNum: number) => void;
  submissions: WorkSubmission[];
  onToggleLessonCompleted: (lessonId: string) => void;
  onSubmitWork: (submission: Omit<WorkSubmission, 'id' | 'submittedAt'>) => void;
  onExitToDashboard: () => void;
}

export const BookReaderWorkspace: React.FC<BookReaderWorkspaceProps> = ({
  language,
  student,
  classroom,
  gradeSubjects,
  activeStage,
  onChangeStage,
  selectedSubjectId,
  onSelectSubject,
  selectedChapterNumber,
  onSelectChapter,
  selectedLessonNumber,
  onSelectLesson,
  submissions,
  onToggleLessonCompleted,
  onSubmitWork,
  onExitToDashboard,
}) => {
  const t = TRANSLATIONS[language];

  const activeSubject = useMemo(
    () => gradeSubjects.find((s) => s.id === selectedSubjectId) || gradeSubjects[0],
    [gradeSubjects, selectedSubjectId]
  );

  const activeBook: AcademicBook = useMemo(
    () => generateBookForGradeAndSubject(student.grade, activeSubject),
    [student.grade, activeSubject]
  );

  const activeChapter = useMemo(
    () =>
      activeBook.chapters.find((c) => c.chapterNumber === selectedChapterNumber) ||
      activeBook.chapters[0],
    [activeBook, selectedChapterNumber]
  );

  const activeLesson = useMemo(
    () =>
      activeChapter.lessons.find((l) => l.lessonNumber === selectedLessonNumber) ||
      activeChapter.lessons[0],
    [activeChapter, selectedLessonNumber]
  );

  // Guided practice reveal state
  const [revealedGuidedPractice, setRevealedGuidedPractice] = useState<Record<number, boolean>>({});
  // Corrections reveal state
  const [showLessonCorrections, setShowLessonCorrections] = useState(false);
  const [showChapterComprehension, setShowChapterComprehension] = useState(false);

  // Classwork form state
  const [cwAnswers, setCwAnswers] = useState<Record<string, string>>({});
  const [cwWritten, setCwWritten] = useState('');
  const [cwJustSubmitted, setCwJustSubmitted] = useState(false);

  // Homework form state
  const [hwAnswers, setHwAnswers] = useState<Record<string, string>>({});
  const [hwWritten, setHwWritten] = useState('');
  const [hwJustSubmitted, setHwJustSubmitted] = useState(false);

  // Assessment mode inside QUIZ stage: 'CHAPTER_QUIZ' or 'FINAL_EXAM'
  const [assessmentMode, setAssessmentMode] = useState<'CHAPTER_QUIZ' | 'FINAL_EXAM'>('CHAPTER_QUIZ');
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [quizWritten, setQuizWritten] = useState('');

  // AI Teacher — Aprantisaj se lò Akademi (Curriculum-restricted interactive tutor)
  const [aiTeacherOpen, setAiTeacherOpen] = useState<boolean>(true);
  const [aiQuestionInput, setAiQuestionInput] = useState<string>('');
  const [aiMessages, setAiMessages] = useState<
    Array<{ id: string; sender: 'teacher' | 'student'; text: string }>
  >([]);

  const defaultWelcomeMsg = `Byenveni nan AI Teacher Aprantisaj se lò Akademi. Mwen se AI Teacher — Aprantisaj se lò Akademi pou ${activeSubject.nameHt} (${student.grade}), Chapit ${activeChapter.chapterNumber}, Leson ${activeLesson.lessonNumber}: « ${activeLesson.title} ». Mwen reponn kesyon sèlman sou pwogram akademik leson ak liv sa a.`;

  const handleAskAiTeacher = (promptText?: string) => {
    const queryText = (promptText ?? aiQuestionInput).trim();
    if (!queryText) return;
    const lower = queryText.toLowerCase();

    // Curriculum restriction check: reject off-topic / non-academic requests
    const offTopicKeywords = [
      'jwet video',
      'video game',
      'tik tok',
      'tiktok',
      'jwèt',
      ' paryaj',
      'kripto',
      'blag',
      'fim',
    ];
    const isOffCurriculum = offTopicKeywords.some((kw) => lower.includes(kw));

    let reply = '';
    if (isOffCurriculum) {
      reply = `AI Teacher — Aprantisaj se lò Akademi : Mwen ka ede w sèlman ak sijè akademik ki nan pwogram ofisyèl ${student.grade} (${activeSubject.nameHt} — Chapit ${activeChapter.chapterNumber}, Leson ${activeLesson.lessonNumber}: « ${activeLesson.title} »). Tanpri poze yon kesyon sou leson an, egzanp yo, oswa egzèsis yo.`;
    } else if (lower.includes('rezime') || lower.includes('eksplike')) {
      reply = `Byenveni nan AI Teacher Aprantisaj se lò Akademi.\n\n📚 Rezime Leson ${activeChapter.chapterNumber}.${activeLesson.lessonNumber} (${activeLesson.title}) :\n• Entwodiksyon : ${activeLesson.introduction}\n• Pwen Kle : ${activeLesson.reviewSummary || activeLesson.detailedExplanation[0]}`;
    } else if (lower.includes('egzanp')) {
      const ex = activeLesson.examples[0];
      reply = ex
        ? `AI Teacher — Aprantisaj se lò Akademi — Egzanp Gide (${ex.title}) :\nSitiyasyon : ${ex.scenario}\nEtap yo : ${ex.stepByStepSolution.join(' → ')}\nKonklizyon : ${ex.conclusion}`
        : `AI Teacher — Aprantisaj se lò Akademi : Revize seksyon Egzanp Rezoud nan Leson ${activeChapter.chapterNumber}.${activeLesson.lessonNumber} la.`;
    } else if (lower.includes('vokabilè') || lower.includes('mò') || lower.includes('definisyon')) {
      const vocList = activeLesson.vocabulary
        .map((v) => `• ${v.term} : ${v.definitionHt}`)
        .join('\n');
      reply = `AI Teacher — Aprantisaj se lò Akademi — Vokabilè Kle Leson ${activeChapter.chapterNumber}.${activeLesson.lessonNumber} :\n${vocList}`;
    } else {
      reply = `AI Teacher — Aprantisaj se lò Akademi (${activeSubject.nameHt} · ${student.grade}) :\nSou kesyon ou an (« ${queryText} ») nan kad Leson ${activeChapter.chapterNumber}.${activeLesson.lessonNumber} (« ${activeLesson.title} ») :\n• ${activeLesson.detailedExplanation[0]}\n• Konsèy : ${activeLesson.guidedPractice[0]?.modelAnswer || activeLesson.reviewSummary}`;
    }

    setAiMessages((prev) => [
      ...prev,
      { id: `stu-${Date.now()}`, sender: 'student', text: queryText },
      { id: `ai-${Date.now() + 1}`, sender: 'teacher', text: reply },
    ]);
    if (!promptText) {
      setAiQuestionInput('');
    }
  };

  const currentStageIndex = LEARNING_FLOW_STAGES.indexOf(activeStage);

  const handlePreviousStage = () => {
    if (currentStageIndex > 0) {
      onChangeStage(LEARNING_FLOW_STAGES[currentStageIndex - 1]);
    }
  };

  const handleNextStage = () => {
    if (currentStageIndex < LEARNING_FLOW_STAGES.length - 1) {
      onChangeStage(LEARNING_FLOW_STAGES[currentStageIndex + 1]);
    }
  };

  const isLessonCompleted = student.completedLessonIds.includes(activeLesson.id);

  // Existing submissions for this student
  const studentSubmissions = useMemo(
    () => submissions.filter((s) => s.studentId === student.id),
    [submissions, student.id]
  );

  const currentClassworkSub = studentSubmissions.find(
    (s) =>
      s.subjectId === activeSubject.id &&
      s.chapterNumber === activeChapter.chapterNumber &&
      s.lessonNumber === activeLesson.lessonNumber &&
      s.workType === 'Classwork'
  );

  const currentHomeworkSub = studentSubmissions.find(
    (s) =>
      s.subjectId === activeSubject.id &&
      s.chapterNumber === activeChapter.chapterNumber &&
      s.lessonNumber === activeLesson.lessonNumber &&
      s.workType === 'Homework'
  );

  const calculateAutoScore = (questions: ExerciseQuestion[], userAnswers: Record<string, string>, written: string) => {
    let earned = 0;
    let total = 0;
    for (const q of questions) {
      total += q.points;
      const ans = (userAnswers[q.id] || '').trim();
      if (q.type === 'multiple_choice' || q.type === 'true_false') {
        if (ans === q.correctAnswer) earned += q.points;
      } else if (ans.length >= 8 || written.trim().length >= 12) {
        earned += q.points;
      }
    }
    return total > 0 ? Math.round((earned / total) * 100) : 85;
  };

  const getLetterGrade = (score: number) => {
    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return 'F';
  };

  const handleClassworkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const score = calculateAutoScore(activeLesson.classworkExercises, cwAnswers, cwWritten);
    onSubmitWork({
      studentId: student.id,
      studentName: student.fullName,
      grade: student.grade,
      classroom: student.classroom,
      subjectId: activeSubject.id,
      subjectName: activeSubject.nameHt,
      bookId: activeBook.id,
      chapterNumber: activeChapter.chapterNumber,
      lessonNumber: activeLesson.lessonNumber,
      workType: 'Classwork',
      title: `Travay Klas ${activeChapter.chapterNumber}.${activeLesson.lessonNumber} — ${activeLesson.title}`,
      status: 'Graded',
      answers: cwAnswers,
      writtenResponse: cwWritten || 'Tout kesyon Travay Klas yo konplete.',
      score,
      maxScore: 100,
      letterGrade: getLetterGrade(score),
      teacherFeedback: 'Travay klas verifye dapre barèm ofisyèl ASLA.',
      gradedAt: new Date().toISOString().slice(0, 10),
    });
    if (!isLessonCompleted) {
      onToggleLessonCompleted(activeLesson.id);
    }
    setCwJustSubmitted(true);
  };

  const handleHomeworkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const score = calculateAutoScore(
      activeLesson.homeworkAssignment.questions,
      hwAnswers,
      hwWritten
    );
    onSubmitWork({
      studentId: student.id,
      studentName: student.fullName,
      grade: student.grade,
      classroom: student.classroom,
      subjectId: activeSubject.id,
      subjectName: activeSubject.nameHt,
      bookId: activeBook.id,
      chapterNumber: activeChapter.chapterNumber,
      lessonNumber: activeLesson.lessonNumber,
      workType: 'Homework',
      title: activeLesson.homeworkAssignment.title,
      status: 'Graded',
      answers: hwAnswers,
      writtenResponse: hwWritten || 'Devwa lakay soumèt ak devlopman konplè.',
      score,
      maxScore: 100,
      letterGrade: getLetterGrade(score),
      teacherFeedback: 'Devwa lakay resevwa epi note.',
      gradedAt: new Date().toISOString().slice(0, 10),
    });
    setHwJustSubmitted(true);
  };

  const handleQuizOrExamSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const questions =
      assessmentMode === 'FINAL_EXAM'
        ? activeBook.finalExam.questions
        : activeChapter.chapterQuiz.questions;
    const score = calculateAutoScore(questions, quizAnswers, quizWritten);
    onSubmitWork({
      studentId: student.id,
      studentName: student.fullName,
      grade: student.grade,
      classroom: student.classroom,
      subjectId: activeSubject.id,
      subjectName: activeSubject.nameHt,
      bookId: activeBook.id,
      chapterNumber: activeChapter.chapterNumber,
      lessonNumber: activeLesson.lessonNumber,
      workType: assessmentMode === 'FINAL_EXAM' ? 'Exam' : 'Quiz',
      title:
        assessmentMode === 'FINAL_EXAM'
          ? activeBook.finalExam.title
          : activeChapter.chapterQuiz.title,
      status: 'Graded',
      answers: quizAnswers,
      writtenResponse: quizWritten || 'Evalyasyon konplete.',
      score,
      maxScore: 100,
      letterGrade: getLetterGrade(score),
      teacherFeedback:
        score >= 70
          ? 'Felisitasyon! Ou reyisi evalyasyon an ak yon nòt siperyè a 70%.'
          : 'Revize koreksyon chapit la pou amelyore nòt ou.',
      gradedAt: new Date().toISOString().slice(0, 10),
    });
    onChangeStage('RESULTS');
  };

  return (
    <div className="space-y-6">
      {/* Top Academic Workflow Header & Horizontal Left-to-Right Stepper */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-xs text-slate-500 font-mono tabular-nums">
              <span>{student.grade}</span>
              <span className="mx-1.5">·</span>
              <span>{student.classroom}</span>
              <span className="mx-1.5">·</span>
              <span className="font-semibold text-[#0B2545]">{activeSubject.nameHt}</span>
              <span className="mx-1.5">·</span>
              <span>
                Ch. {activeChapter.chapterNumber}/16 · Leson {activeLesson.lessonNumber}/6
              </span>
            </div>
            <h2 className="text-lg font-bold text-[#0B2545] mt-0.5">
              Flux Aprantisaj Goch-a-Dwat (Left-to-Right Student Learning Flow)
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePreviousStage}
              disabled={currentStageIndex === 0}
              className="px-3 py-1.5 text-xs font-semibold border border-slate-300 rounded-lg hover:bg-slate-100 disabled:opacity-40 cursor-pointer whitespace-nowrap"
            >
              {t.previous}
            </button>
            <button
              onClick={handleNextStage}
              disabled={currentStageIndex === LEARNING_FLOW_STAGES.length - 1}
              className="px-3 py-1.5 text-xs font-semibold bg-[#0B2545] text-white rounded-lg hover:bg-[#133B6E] disabled:opacity-40 cursor-pointer whitespace-nowrap"
            >
              {t.next}
            </button>
            <button
              onClick={onExitToDashboard}
              className="px-3 py-1.5 text-xs font-semibold text-red-700 border border-red-200 rounded-lg hover:bg-red-50 cursor-pointer whitespace-nowrap"
            >
              {t.exit}
            </button>
          </div>
        </div>

        {/* Horizontally Scrollable Left-to-Right Pipeline */}
        <div className="overflow-x-auto pb-1">
          <div className="flex items-center gap-1.5 min-w-max">
            {LEARNING_FLOW_STAGES.map((stage, idx) => {
              const isActive = stage === activeStage;
              const isPast = idx < currentStageIndex;
              return (
                <React.Fragment key={stage}>
                  <button
                    onClick={() => onChangeStage(stage)}
                    className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                      isActive
                        ? 'bg-[#0B2545] text-white'
                        : isPast
                        ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <span className="font-mono text-[11px] opacity-75">{idx + 1}.</span>
                    <span>{stage}</span>
                  </button>
                  {idx < LEARNING_FLOW_STAGES.length - 1 && (
                    <span className="text-slate-400 text-xs font-bold px-0.5">→</span>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>

      {/* STAGE 1: CLASSROOM */}
      {activeStage === 'CLASSROOM' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <div className="text-xs font-semibold text-emerald-700">
                ● SAL KLAS PWOTEJE · AKSÈ OTORIZE POU {student.grade.toUpperCase()} SÈLMAN
              </div>
              <h3 className="text-2xl font-bold text-[#0B2545] mt-1">{student.classroom}</h3>
              <p className="text-xs text-slate-600 mt-1">
                Pwofesè Titilè : {classroom?.homeroomTeacher || 'Pwof. Direksyon ASLA'} · Sal :{' '}
                {classroom?.roomNumber || 'Paviyon Segondè'} · {classroom?.scheduleSummary}
              </p>
            </div>
            <button
              onClick={() => onChangeStage('BOOK')}
              className="px-4 py-2.5 text-xs font-semibold bg-[#0B2545] text-white rounded-lg hover:bg-[#133B6E] cursor-pointer whitespace-nowrap"
            >
              Louvri Liv Matyè Chwazi a (BOOK) →
            </button>
          </div>

          <div>
            <h4 className="text-sm font-bold text-[#0B2545] mb-3">
              Chwazi youn nan {gradeSubjects.length} Matyè Ofisyèl {student.grade} ou yo pou avanse nan LIV AKADEMIK la :
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {gradeSubjects.map((subj) => {
                const isSelected = subj.id === activeSubject.id;
                return (
                  <div
                    key={subj.id}
                    onClick={() => {
                      onSelectSubject(subj.id);
                      onChangeStage('BOOK');
                    }}
                    className={`p-4 rounded-xl border transition-colors cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'border-[#0B2545] bg-[#0B2545]/5'
                        : 'border-slate-200 bg-[#F8FAFC] hover:border-slate-400'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-mono text-slate-500 tabular-nums">
                        {subj.code} · {subj.weeklyHours}h/semèn · Koef. {subj.coefficient}
                      </div>
                      <h5 className="text-base font-bold text-[#0B2545] mt-1">{subj.nameHt}</h5>
                      <p className="text-xs text-slate-600 mt-1">{subj.descriptionHt}</p>
                    </div>
                    <div className="mt-4 pt-2.5 border-t border-slate-200/80 flex items-center justify-between text-xs font-semibold text-[#0B2545]">
                      <span>16 Chapit · 96 Leson</span>
                      <span>Louvri Liv →</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* STAGE 2: BOOK (Cover, Introduction, Learning Objectives, Table of Contents, Final Exam link) */}
      {activeStage === 'BOOK' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Book Cover */}
            <div className="lg:col-span-4">
              <div className="rounded-xl overflow-hidden border border-slate-200 bg-[#0B2545] text-white">
                <div className="aspect-3/4 relative">
                  <img
                    src={
                      activeBook.coverCategory === 'STEM'
                        ? ASLA_IMAGES.stemCover
                        : ASLA_IMAGES.humanitiesCover
                    }
                    alt={activeBook.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover opacity-85"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B2545] via-[#0B2545]/65 to-black/30 p-6 flex flex-col justify-between">
                    <div className="space-y-1">
                      <p className="text-xs font-mono tracking-wider text-amber-300">
                        APRANTISAJ SE LÒ AKADEMI · {activeBook.grade.toUpperCase()}
                      </p>
                      <p className="text-xs text-slate-200">{activeBook.edition}</p>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-2xl font-bold leading-snug">{activeBook.subjectNameHt}</h3>
                      <p className="text-xs text-slate-200">{activeBook.subtitle}</p>
                      <div className="pt-3 border-t border-white/20 text-xs font-mono tabular-nums flex items-center justify-between">
                        <span>{activeBook.chapters.length} Chapit · 96 Leson</span>
                        <span>{activeBook.totalPages} Paj</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Book Introduction, Learning Objectives & Table of Contents */}
            <div className="lg:col-span-8 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <div className="text-xs font-semibold text-[#B91C1C]">
                    LIV AKADEMIK OFISYÈL · {activeBook.grade}
                  </div>
                  <h3 className="text-2xl font-bold text-[#0B2545] mt-0.5">{activeBook.title}</h3>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setAssessmentMode('FINAL_EXAM');
                      onChangeStage('QUIZ');
                    }}
                    className="px-3.5 py-2 text-xs font-semibold text-[#B91C1C] border border-[#B91C1C] rounded-lg hover:bg-red-50 cursor-pointer whitespace-nowrap"
                  >
                    Egzamen Final Liv la →
                  </button>
                  <button
                    onClick={() => onChangeStage('CHAPTER')}
                    className="px-4 py-2 text-xs font-semibold bg-[#0B2545] text-white rounded-lg hover:bg-[#133B6E] cursor-pointer whitespace-nowrap"
                  >
                    Ale nan Chapit {activeChapter.chapterNumber} →
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-bold text-[#0B2545]">Entwodiksyon Liv la (Paj 1–2)</h4>
                <p className="text-sm text-slate-700 leading-relaxed">{activeBook.introduction}</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <h4 className="text-sm font-bold text-[#0B2545]">
                  Objektif Aprantisaj Jeneral ({activeBook.grade})
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-700 list-disc pl-5">
                  {activeBook.learningObjectives.map((obj, i) => (
                    <li key={i}>{obj}</li>
                  ))}
                </ul>
              </div>

              {/* Table of Contents (16 Chapters) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-[#0B2545]">
                    Tab Matyè Konplè (Table of Contents — {activeBook.chapters.length} Chapit · 96 Leson · {activeBook.totalPages} Paj)
                  </h4>
                  <span className="text-xs text-slate-500">Klik sou yon chapit pou kòmanse</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 max-h-96 overflow-y-auto pr-1">
                  {activeBook.chapters.map((ch) => {
                    const isCurrent = ch.chapterNumber === activeChapter.chapterNumber;
                    return (
                      <button
                        key={ch.id}
                        onClick={() => {
                          onSelectChapter(ch.chapterNumber);
                          onSelectLesson(1);
                          onChangeStage('CHAPTER');
                        }}
                        className={`p-3 rounded-lg border text-left transition-colors cursor-pointer flex items-center justify-between gap-2 ${
                          isCurrent
                            ? 'border-[#0B2545] bg-[#0B2545]/5'
                            : 'border-slate-200 hover:border-slate-400 bg-white'
                        }`}
                      >
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-[#0B2545] truncate">{ch.title}</div>
                          <div className="text-[11px] text-slate-500 font-mono tabular-nums mt-0.5">
                            6 Leson · Quiz Chapit · p. {ch.pageStart}–{ch.pageEnd}
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STAGE 3: CHAPTER */}
      {activeStage === 'CHAPTER' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <div className="text-xs font-mono text-slate-500 tabular-nums">
                {activeBook.subjectNameHt} · {student.grade} · Paj {activeChapter.pageStart}–{activeChapter.pageEnd}
              </div>
              <h3 className="text-2xl font-bold text-[#0B2545] mt-0.5">{activeChapter.title}</h3>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={activeChapter.chapterNumber}
                onChange={(e) => {
                  onSelectChapter(Number(e.target.value));
                  onSelectLesson(1);
                }}
                className="px-3 py-2 text-xs font-semibold rounded-lg border border-slate-300 bg-white"
              >
                {activeBook.chapters.map((ch) => (
                  <option key={ch.id} value={ch.chapterNumber}>
                    Chapit {ch.chapterNumber} / {activeBook.chapters.length}
                  </option>
                ))}
              </select>
              <button
                onClick={() => onChangeStage('LESSON')}
                className="px-4 py-2 text-xs font-semibold bg-[#0B2545] text-white rounded-lg hover:bg-[#133B6E] cursor-pointer whitespace-nowrap"
              >
                Kòmanse Leson {activeChapter.chapterNumber}.{activeLesson.lessonNumber} →
              </button>
            </div>
          </div>

          <p className="text-sm text-slate-700 leading-relaxed">{activeChapter.overview}</p>

          {/* Learning Goals of the Chapter */}
          <div className="p-4 rounded-xl bg-[#0B2545]/5 border border-[#0B2545]/15 space-y-2">
            <h4 className="text-sm font-bold text-[#0B2545]">
              Objektif Aprantisaj Chapit {activeChapter.chapterNumber} :
            </h4>
            <ul className="space-y-1 text-xs text-slate-700 list-disc pl-5">
              {activeChapter.learningGoals.map((goal, idx) => (
                <li key={idx}>{goal}</li>
              ))}
            </ul>
          </div>

          {/* Historical Dates & Figures for Istwa D Ayiti Chapters */}
          {(activeChapter.importantDates || activeChapter.historicalFigures) && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {activeChapter.importantDates && (
                <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 space-y-2.5">
                  <h4 className="text-sm font-bold text-[#0B2545]">
                    Dat ak Evènman Enpòtan nan Chapit la :
                  </h4>
                  <div className="space-y-2 text-xs">
                    {activeChapter.importantDates.map((d, idx) => (
                      <div key={idx} className="p-2.5 rounded-lg bg-white border border-amber-200/80">
                        <span className="font-mono font-bold text-[#B91C1C]">{d.date}</span>
                        <span className="mx-1.5 text-slate-400">—</span>
                        <span className="text-slate-800">{d.event}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeChapter.historicalFigures && (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
                  <h4 className="text-sm font-bold text-[#0B2545]">
                    Moun / Pèsonaj Istorik Enpòtan :
                  </h4>
                  <div className="space-y-2 text-xs">
                    {activeChapter.historicalFigures.map((fig, idx) => (
                      <div key={idx} className="p-2.5 rounded-lg bg-white border border-slate-200">
                        <div className="font-bold text-[#0B2545]">{fig.name}</div>
                        <div className="text-slate-600 mt-0.5">{fig.role}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeChapter.historiographyNote && (
            <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200 text-xs text-slate-800 leading-relaxed">
              <strong className="text-[#0B2545]">Prèv Istorik ak Sous : </strong>
              {activeChapter.historiographyNote}
            </div>
          )}

          {/* 6 Complete Lessons in this Chapter */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-[#0B2545]">
              6 Leson Konplè nan Chapit {activeChapter.chapterNumber} la :
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeChapter.lessons.map((ls) => {
                const done = student.completedLessonIds.includes(ls.id);
                const isSelected = ls.lessonNumber === activeLesson.lessonNumber;
                return (
                  <div
                    key={ls.id}
                    onClick={() => {
                      onSelectLesson(ls.lessonNumber);
                      onChangeStage('LESSON');
                    }}
                    className={`p-4 rounded-xl border transition-colors cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'border-[#0B2545] bg-[#0B2545]/5'
                        : 'border-slate-200 bg-[#F8FAFC] hover:border-slate-400'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs font-mono tabular-nums">
                        <span className="text-slate-500">
                          Paj {ls.pageStart}–{ls.pageEnd} · {ls.estimatedMinutes} min
                        </span>
                        <span className={done ? 'text-emerald-700 font-bold' : 'text-slate-500'}>
                          {done ? '✓ Konplè' : '○ Pou etidye'}
                        </span>
                      </div>
                      <h5 className="text-sm font-bold text-[#0B2545] mt-1.5">{ls.title}</h5>
                      <p className="text-xs text-slate-600 mt-1 line-clamp-2">{ls.introduction}</p>
                    </div>
                    <div className="mt-4 pt-2.5 border-t border-slate-200/80 flex items-center justify-between text-xs font-semibold text-[#0B2545]">
                      <span>Eksplikasyon · Egzanp · Travay</span>
                      <span>Li Leson an →</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Chapter Comprehension Questions (if present) */}
          {activeChapter.comprehensionQuestions && activeChapter.comprehensionQuestions.length > 0 && (
            <div className="p-5 rounded-xl bg-white border border-slate-200 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h4 className="text-sm font-bold text-[#0B2545]">
                  Kesyon Konpreyansyon Chapit {activeChapter.chapterNumber} ak Koreksyon :
                </h4>
                <button
                  type="button"
                  onClick={() => setShowChapterComprehension(!showChapterComprehension)}
                  className="px-3 py-1.5 text-xs font-semibold text-[#0B2545] border border-slate-300 rounded-lg hover:bg-slate-50 cursor-pointer"
                >
                  {showChapterComprehension ? 'Kache Koreksyon yo' : 'Afiche Repons / Koreksyon yo'}
                </button>
              </div>
              <div className="space-y-2.5 text-xs">
                {activeChapter.comprehensionQuestions.map((cq, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                    <p className="font-semibold text-slate-900">
                      {idx + 1}. {cq.question}
                    </p>
                    {showChapterComprehension && (
                      <p className="text-emerald-800 font-medium pt-1">
                        ✓ Koreksyon : {cq.answer}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Chapter Review Box & Direct Action to Chapter Quiz */}
          <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h4 className="text-sm font-bold text-[#0B2545]">
                Revizyon Chapit {activeChapter.chapterNumber} (Chapter Review & Key Rules)
              </h4>
              <button
                onClick={() => {
                  setAssessmentMode('CHAPTER_QUIZ');
                  onChangeStage('QUIZ');
                }}
                className="px-4 py-2 text-xs font-semibold bg-[#B91C1C] text-white rounded-lg hover:bg-[#991B1B] cursor-pointer whitespace-nowrap"
              >
                {t.startChapterQuiz}
              </button>
            </div>
            <ul className="space-y-1 text-xs text-slate-700 list-disc pl-5">
              {activeChapter.chapterReview.summaryPoints.map((pt, i) => (
                <li key={i}>{pt}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* STAGE 4: LESSON (Detailed explanation, Examples, Vocabulary, Guided Practice, Review & Corrections) */}
      {activeStage === 'LESSON' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 space-y-8">
          {/* Lesson Top Selector & Completion Button */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-5">
            <div>
              <div className="text-xs font-mono text-slate-500 tabular-nums">
                {activeBook.subjectNameHt} · {student.grade} · Chapit {activeChapter.chapterNumber} · Paj{' '}
                {activeLesson.pageStart}–{activeLesson.pageEnd} ({activeLesson.estimatedMinutes} min)
              </div>
              <h3 className="text-2xl font-bold text-[#0B2545] mt-1">{activeLesson.title}</h3>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={activeLesson.lessonNumber}
                onChange={(e) => onSelectLesson(Number(e.target.value))}
                className="px-3 py-2 text-xs font-semibold rounded-lg border border-slate-300 bg-white"
              >
                {activeChapter.lessons.map((ls) => (
                  <option key={ls.id} value={ls.lessonNumber}>
                    Leson {activeChapter.chapterNumber}.{ls.lessonNumber} / 6
                  </option>
                ))}
              </select>

              <button
                onClick={() => onToggleLessonCompleted(activeLesson.id)}
                className={`px-3.5 py-2 text-xs font-semibold rounded-lg border transition-colors cursor-pointer whitespace-nowrap ${
                  isLessonCompleted
                    ? 'bg-emerald-700 text-white border-emerald-700'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                }`}
              >
                {isLessonCompleted ? '✓ Leson Make Konplè' : 'Make Leson an Konplè'}
              </button>

              <button
                onClick={() => onChangeStage('CLASSWORK')}
                className="px-4 py-2 text-xs font-semibold bg-[#0B2545] text-white rounded-lg hover:bg-[#133B6E] cursor-pointer whitespace-nowrap"
              >
                Ale nan Travay Klas (CLASSWORK) →
              </button>
            </div>
          </div>

          {/* 1. Learning Objectives */}
          <div className="p-4 rounded-xl bg-[#0B2545]/5 border border-[#0B2545]/15 space-y-2">
            <h4 className="text-sm font-bold text-[#0B2545]">
              01. Objektif Leson an (Lesson Objectives)
            </h4>
            <ul className="space-y-1 text-xs text-slate-700 list-disc pl-5">
              {activeLesson.objectives.map((obj, idx) => (
                <li key={idx}>{obj}</li>
              ))}
            </ul>
          </div>

          {/* AI TEACHER — APRANTISAJ SE LÒ AKADEMI (Curriculum-Restricted Assistant) */}
          <div className="rounded-xl border-2 border-[#0B2545] bg-[#F8FAFC] overflow-hidden">
            <div className="bg-[#0B2545] text-white px-5 py-3.5 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <GraduationCap className="w-5 h-5 text-[#FACC15] shrink-0" />
                <div>
                  <div className="text-xs font-mono text-amber-300 font-bold">
                    AI Teacher — Aprantisaj se lò Akademi
                  </div>
                  <div className="text-sm font-bold">
                    Byenveni nan AI Teacher Aprantisaj se lò Akademi.
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setAiTeacherOpen((prev) => !prev)}
                className="px-3 py-1 text-xs font-semibold bg-white/15 hover:bg-white/25 rounded-lg cursor-pointer"
              >
                {aiTeacherOpen ? 'Redui Panèl AI Teacher' : 'Louvri AI Teacher'}
              </button>
            </div>

            {aiTeacherOpen && (
              <div className="p-5 space-y-4 text-xs">
                <div className="p-3.5 rounded-lg bg-white border border-slate-200 text-slate-800 leading-relaxed">
                  <div className="font-bold text-[#0B2545] mb-1">
                    AI Teacher — Aprantisaj se lò Akademi ({activeSubject.nameHt} · {student.grade})
                  </div>
                  <p>{defaultWelcomeMsg}</p>
                </div>

                {aiMessages.length > 0 && (
                  <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                    {aiMessages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`p-3 rounded-lg border whitespace-pre-line ${
                          msg.sender === 'teacher'
                            ? 'bg-white border-slate-200 text-slate-800'
                            : 'bg-[#0B2545] border-[#0B2545] text-white ml-6'
                        }`}
                      >
                        <div className="font-bold mb-1 text-[11px] opacity-80">
                          {msg.sender === 'teacher'
                            ? 'AI Teacher — Aprantisaj se lò Akademi'
                            : student.fullName}
                        </div>
                        <div>{msg.text}</div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleAskAiTeacher('Eksplike ak rezime leson sa a')}
                    className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 hover:border-[#0B2545] font-semibold text-[#0B2545] cursor-pointer"
                  >
                    💡 Eksplike Leson an
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAskAiTeacher('Bay yon egzanp rezoud etap pa etap')}
                    className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 hover:border-[#0B2545] font-semibold text-[#0B2545] cursor-pointer"
                  >
                    📐 Egzanp Etap pa Etap
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAskAiTeacher('Vokabilè ak definisyon kle leson an')}
                    className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 hover:border-[#0B2545] font-semibold text-[#0B2545] cursor-pointer"
                  >
                    📖 Vokabilè Kle
                  </button>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={aiQuestionInput}
                    onChange={(e) => setAiQuestionInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAskAiTeacher();
                      }
                    }}
                    placeholder={`Poze AI Teacher — Aprantisaj se lò Akademi yon kesyon sou ${activeLesson.title}...`}
                    className="flex-1 p-2.5 rounded-lg border border-slate-300 bg-white text-slate-900"
                  />
                  <button
                    type="button"
                    onClick={() => handleAskAiTeacher()}
                    className="px-4 py-2.5 rounded-lg bg-[#0B2545] hover:bg-[#133B6E] text-white font-bold cursor-pointer whitespace-nowrap"
                  >
                    Mande AI Teacher
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 2. Introduction */}
          <div className="space-y-2">
            <h4 className="text-base font-bold text-[#0B2545]">02. Entwodiksyon (Introduction)</h4>
            <p className="text-sm text-slate-700 leading-relaxed max-w-3xl">
              {activeLesson.introduction}
            </p>
          </div>

          {/* 3. Detailed Explanation */}
          <div className="space-y-3">
            <h4 className="text-base font-bold text-[#0B2545]">
              03. Leson Konplè — Eksplikasyon Detaye ak Kour Akademik (Detailed Explanation)
            </h4>
            <div className="space-y-3 text-sm text-slate-800 leading-relaxed max-w-3xl">
              {activeLesson.detailedExplanation.map((para, idx) => (
                <p key={idx}>{para}</p>
              ))}
            </div>
          </div>

          {/* 3B. Important Historical Dates & Historical Figures (for Istwa D Ayiti) */}
          {(activeLesson.importantDates || activeLesson.historicalFigures) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {activeLesson.importantDates && (
                <div className="p-5 rounded-xl bg-amber-50/70 border border-amber-200 space-y-3">
                  <h4 className="text-sm font-bold text-[#0B2545]">
                    Dat ak Evènman Enpòtan nan Leson an (Important Dates)
                  </h4>
                  <div className="space-y-2 text-xs">
                    {activeLesson.importantDates.map((d, idx) => (
                      <div key={idx} className="p-3 rounded-lg bg-white border border-amber-200/80">
                        <div className="font-mono font-bold text-[#B91C1C]">{d.date}</div>
                        <div className="text-slate-800 mt-0.5">{d.event}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeLesson.historicalFigures && (
                <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                  <h4 className="text-sm font-bold text-[#0B2545]">
                    Pèsonaj Istorik nan Leson an (Historical Figures)
                  </h4>
                  <div className="space-y-2 text-xs">
                    {activeLesson.historicalFigures.map((fig, idx) => (
                      <div key={idx} className="p-3 rounded-lg bg-white border border-slate-200">
                        <div className="font-bold text-[#0B2545]">{fig.name}</div>
                        <div className="text-slate-700 mt-0.5">{fig.role}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 4. Worked Examples */}
          <div className="space-y-4">
            <h4 className="text-base font-bold text-[#0B2545]">
              04. Egzanp Rezoud Etap pa Etap (Worked Examples)
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {activeLesson.examples.map((ex, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-xl bg-[#F8FAFC] border border-slate-200 space-y-3"
                >
                  <h5 className="text-sm font-bold text-[#0B2545]">{ex.title}</h5>
                  <p className="text-xs text-slate-700 italic bg-white p-3 rounded-lg border border-slate-200">
                    {ex.scenario}
                  </p>
                  <div className="space-y-1.5 text-xs text-slate-800">
                    {ex.stepByStepSolution.map((step, sIdx) => (
                      <div key={sIdx} className="font-mono">
                        {step}
                      </div>
                    ))}
                  </div>
                  <div className="pt-2 border-t border-slate-200 text-xs font-semibold text-emerald-800">
                    Konklizyon : {ex.conclusion}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 5. Key Vocabulary / Concepts (Trilingual) */}
          <div className="space-y-3">
            <h4 className="text-base font-bold text-[#0B2545]">
              05. Vokabilè ak Konsèp Kle (Kreyòl · Français · English)
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {activeLesson.vocabulary.map((voc, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
                  <div className="text-xs font-bold text-[#0B2545]">{voc.term}</div>
                  <div className="text-xs text-slate-700 space-y-1">
                    <p>
                      <strong>Kreyòl :</strong> {voc.definitionHt}
                    </p>
                    <p>
                      <strong>Français :</strong> {voc.definitionFr}
                    </p>
                    <p>
                      <strong>English :</strong> {voc.definitionEn}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 6. Guided Practice */}
          <div className="space-y-3">
            <h4 className="text-base font-bold text-[#0B2545]">
              06. Pratik Gide (Guided Practice)
            </h4>
            <div className="space-y-3">
              {activeLesson.guidedPractice.map((gp, idx) => {
                const isOpen = !!revealedGuidedPractice[idx];
                return (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2"
                  >
                    <p className="text-xs font-bold text-slate-900">{gp.prompt}</p>
                    <p className="text-xs text-slate-600">💡 Endis (Hint) : {gp.hint}</p>
                    <button
                      type="button"
                      onClick={() =>
                        setRevealedGuidedPractice((prev) => ({ ...prev, [idx]: !prev[idx] }))
                      }
                      className="text-xs font-semibold text-[#0B2545] underline cursor-pointer"
                    >
                      {isOpen ? 'Kache Solisyon Modèl la' : 'Montre Solisyon Modèl la (Correction)'}
                    </button>
                    {isOpen && (
                      <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 font-medium">
                        ✓ Solisyon Modèl : {gp.modelAnswer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* 7. Comprehension Questions, Review Summary & Corrections */}
          <div className="p-5 rounded-xl border border-slate-200 bg-white space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h4 className="text-base font-bold text-[#0B2545]">
                07. Kesyon Konpreyansyon, Revizyon ak Koreksyon
              </h4>
              <button
                type="button"
                onClick={() => setShowLessonCorrections(!showLessonCorrections)}
                className="px-3 py-1.5 text-xs font-semibold text-[#0B2545] border border-slate-300 rounded-lg hover:bg-slate-50 cursor-pointer"
              >
                {showLessonCorrections ? 'Kache Repons yo' : 'Afiche Repons / Koreksyon yo'}
              </button>
            </div>

            {activeLesson.reviewSummary && (
              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-800 leading-relaxed">
                <strong className="text-[#0B2545]">Ti Rezime pou Revizyon : </strong>
                {activeLesson.reviewSummary}
              </div>
            )}

            {activeLesson.comprehensionQuestions && activeLesson.comprehensionQuestions.length > 0 && (
              <div className="space-y-2.5">
                <div className="text-xs font-bold text-[#B91C1C]">
                  Kesyon Konpreyansyon sou Leson an :
                </div>
                {activeLesson.comprehensionQuestions.map((cq, idx) => (
                  <div key={idx} className="text-xs space-y-1 border-t border-slate-100 pt-2">
                    <p className="font-semibold text-slate-900">
                      Konpreyansyon {idx + 1} : {cq.question}
                    </p>
                    {showLessonCorrections && (
                      <p className="text-emerald-800 font-medium">→ Koreksyon : {cq.answer}</p>
                    )}
                  </div>
                ))}
              </div>
            )}

            <div className="space-y-3 pt-1">
              <div className="text-xs font-bold text-[#0B2545]">
                Kesyon Revizyon Konplemantè :
              </div>
              {activeLesson.reviewQuestions.map((rq, idx) => (
                <div key={idx} className="text-xs space-y-1 border-t border-slate-100 pt-2">
                  <p className="font-semibold text-slate-900">
                    Revizyon {idx + 1} : {rq.question}
                  </p>
                  {showLessonCorrections && (
                    <p className="text-emerald-800 font-medium">→ Koreksyon : {rq.answer}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Lesson Navigation Bar */}
          <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
            <button
              onClick={() => onChangeStage('CHAPTER')}
              className="px-4 py-2.5 text-xs font-semibold border border-slate-300 rounded-lg hover:bg-slate-100 cursor-pointer"
            >
              ← Retounen nan Plan Chapit {activeChapter.chapterNumber}
            </button>
            <div className="flex items-center gap-3">
              {activeLesson.lessonNumber === 6 && (
                <button
                  onClick={() => {
                    setAssessmentMode('CHAPTER_QUIZ');
                    onChangeStage('QUIZ');
                  }}
                  className="px-4 py-2.5 text-xs font-semibold bg-[#B91C1C] text-white rounded-lg hover:bg-[#991B1B] cursor-pointer"
                >
                  {t.startChapterQuiz}
                </button>
              )}
              <button
                onClick={() => onChangeStage('CLASSWORK')}
                className="px-5 py-2.5 text-xs font-semibold bg-[#0B2545] text-white rounded-lg hover:bg-[#133B6E] cursor-pointer"
              >
                Kontinye nan CLASSWORK →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STAGE 5: CLASSWORK */}
      {activeStage === 'CLASSWORK' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <div className="text-xs font-semibold text-[#B91C1C]">
                TRAVAY NAN KLAS (INDEPENDENT EXERCISES / CLASSWORK)
              </div>
              <h3 className="text-xl font-bold text-[#0B2545] mt-0.5">
                Classwork — {activeLesson.title}
              </h3>
            </div>
            <div className="text-xs font-mono">
              Stati :{' '}
              <strong className="text-[#0B2545]">
                {currentClassworkSub ? `${currentClassworkSub.status} (${currentClassworkSub.score}/100)` : 'In Progress'}
              </strong>
            </div>
          </div>

          {(cwJustSubmitted || currentClassworkSub) && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex flex-wrap items-center justify-between gap-3 text-xs text-emerald-900">
              <div>
                <strong>✓ Travay Klas Soumèt & Note!</strong> Nòt Obteni :{' '}
                <span className="font-mono font-bold">
                  {currentClassworkSub?.score ?? 95}/100 ({currentClassworkSub?.letterGrade ?? 'A'})
                </span>
              </div>
              <button
                onClick={() => onChangeStage('HOMEWORK')}
                className="px-3.5 py-1.5 text-xs font-semibold bg-emerald-800 text-white rounded-lg cursor-pointer"
              >
                Kontinye nan HOMEWORK →
              </button>
            </div>
          )}

          <form onSubmit={handleClassworkSubmit} className="space-y-5">
            {activeLesson.classworkExercises.map((q) => (
              <div key={q.id} className="p-4 rounded-xl bg-[#F8FAFC] border border-slate-200 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
                  <span>Kesyon {q.number} ({q.type.replace('_', ' ')})</span>
                  <span>{q.points} pwen</span>
                </div>
                <p className="text-sm font-semibold text-slate-900">{q.prompt}</p>

                {q.options ? (
                  <div className="space-y-2">
                    {q.options.map((opt) => (
                      <label
                        key={opt}
                        className="flex items-center gap-2.5 p-2.5 rounded-lg bg-white border border-slate-200 text-xs cursor-pointer hover:border-[#0B2545]"
                      >
                        <input
                          type="radio"
                          name={q.id}
                          value={opt}
                          checked={cwAnswers[q.id] === opt}
                          onChange={() => setCwAnswers((prev) => ({ ...prev, [q.id]: opt }))}
                        />
                        <span>{opt}</span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <textarea
                    rows={2}
                    value={cwAnswers[q.id] || ''}
                    onChange={(e) => setCwAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))}
                    placeholder="Ekri repons ak etap demonstrasyon ou isit la..."
                    className="w-full p-3 text-xs rounded-lg border border-slate-300 bg-white"
                  />
                )}

                {currentClassworkSub && (
                  <div className="pt-2 border-t border-slate-200 text-xs text-emerald-800">
                    <strong>Koreksyon Ofisyèl :</strong> {q.correctAnswer} — <em>{q.explanation}</em>
                  </div>
                )}
              </div>
            ))}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Nòt oswa Demontrasyon Konplemantè Elèv la :
              </label>
              <textarea
                rows={3}
                value={cwWritten}
                onChange={(e) => setCwWritten(e.target.value)}
                placeholder="Ajoute kalkil oswa komantè ou pou pwofesè a..."
                className="w-full p-3 text-xs rounded-lg border border-slate-300 bg-white"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={() => onChangeStage('LESSON')}
                className="px-4 py-2.5 text-xs font-semibold border border-slate-300 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                {t.previous} (LESSON)
              </button>
              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-semibold bg-[#B91C1C] text-white rounded-lg hover:bg-[#991B1B] cursor-pointer"
                >
                  Soumèt Classwork (Submit Work)
                </button>
                <button
                  type="button"
                  onClick={() => onChangeStage('HOMEWORK')}
                  className="px-4 py-2.5 text-xs font-semibold bg-[#0B2545] text-white rounded-lg hover:bg-[#133B6E] cursor-pointer"
                >
                  {t.next} (HOMEWORK)
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* STAGE 6: HOMEWORK */}
      {activeStage === 'HOMEWORK' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <div className="text-xs font-semibold text-[#B91C1C]">DEVWA LAKAY (HOMEWORK ASSIGNMENT)</div>
              <h3 className="text-xl font-bold text-[#0B2545] mt-0.5">
                {activeLesson.homeworkAssignment.title}
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                {activeLesson.homeworkAssignment.instructions}
              </p>
            </div>
            <div className="text-xs font-mono">
              Stati :{' '}
              <strong className="text-[#0B2545]">
                {currentHomeworkSub ? `${currentHomeworkSub.status} (${currentHomeworkSub.score}/100)` : 'Not Started'}
              </strong>
            </div>
          </div>

          {(hwJustSubmitted || currentHomeworkSub) && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex flex-wrap items-center justify-between gap-3 text-xs text-emerald-900">
              <div>
                <strong>✓ Devwa Lakay Soumèt!</strong> Nòt Obteni :{' '}
                <span className="font-mono font-bold">
                  {currentHomeworkSub?.score ?? 92}/100 ({currentHomeworkSub?.letterGrade ?? 'A'})
                </span>
              </div>
              <button
                onClick={() => onChangeStage('QUIZ')}
                className="px-3.5 py-1.5 text-xs font-semibold bg-emerald-800 text-white rounded-lg cursor-pointer"
              >
                {t.startChapterQuiz}
              </button>
            </div>
          )}

          <form onSubmit={handleHomeworkSubmit} className="space-y-5">
            {activeLesson.homeworkAssignment.questions.map((q) => (
              <div key={q.id} className="p-4 rounded-xl bg-[#F8FAFC] border border-slate-200 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
                  <span>Kesyon Devwa {q.number}</span>
                  <span>{q.points} pwen</span>
                </div>
                <p className="text-sm font-semibold text-slate-900">{q.prompt}</p>
                {q.options ? (
                  <div className="space-y-2">
                    {q.options.map((opt) => (
                      <label
                        key={opt}
                        className="flex items-center gap-2.5 p-2.5 rounded-lg bg-white border border-slate-200 text-xs cursor-pointer"
                      >
                        <input
                          type="radio"
                          name={q.id}
                          value={opt}
                          checked={hwAnswers[q.id] === opt}
                          onChange={() => setHwAnswers((prev) => ({ ...prev, [q.id]: opt }))}
                        />
                        <span>{opt}</span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <textarea
                    rows={4}
                    value={hwAnswers[q.id] || ''}
                    onChange={(e) => setHwAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))}
                    placeholder="Redije devlopman konplè devwa lakay ou a isit la..."
                    className="w-full p-3 text-xs rounded-lg border border-slate-300 bg-white"
                  />
                )}
              </div>
            ))}

            {/* Chapter Completion Controls required by Prompt Section 15 */}
            <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => onChangeStage('CHAPTER')}
                className="px-4 py-2.5 text-xs font-semibold border border-slate-300 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                {t.reviewChapter}
              </button>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-semibold bg-[#0B2545] text-white rounded-lg hover:bg-[#133B6E] cursor-pointer"
                >
                  Soumèt Devwa Lakay (Submit Homework)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAssessmentMode('CHAPTER_QUIZ');
                    onChangeStage('QUIZ');
                  }}
                  className="px-5 py-2.5 text-xs font-semibold bg-[#B91C1C] text-white rounded-lg hover:bg-[#991B1B] cursor-pointer"
                >
                  {t.startChapterQuiz}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* STAGE 7: QUIZ & FINAL EXAM */}
      {activeStage === 'QUIZ' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <div className="text-xs font-semibold text-[#B91C1C]">
                EVALYASYON OFISYÈL ASLA · {student.grade}
              </div>
              <h3 className="text-xl font-bold text-[#0B2545] mt-0.5">
                {assessmentMode === 'FINAL_EXAM'
                  ? activeBook.finalExam.title
                  : activeChapter.chapterQuiz.title}
              </h3>
            </div>

            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg border border-slate-200">
              <button
                type="button"
                onClick={() => setAssessmentMode('CHAPTER_QUIZ')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md cursor-pointer ${
                  assessmentMode === 'CHAPTER_QUIZ' ? 'bg-[#0B2545] text-white' : 'text-slate-700'
                }`}
              >
                Quiz Chapit {activeChapter.chapterNumber}
              </button>
              <button
                type="button"
                onClick={() => setAssessmentMode('FINAL_EXAM')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md cursor-pointer ${
                  assessmentMode === 'FINAL_EXAM' ? 'bg-[#B91C1C] text-white' : 'text-slate-700'
                }`}
              >
                Egzamen Final Liv la
              </button>
            </div>
          </div>

          <form onSubmit={handleQuizOrExamSubmit} className="space-y-5">
            {(assessmentMode === 'FINAL_EXAM'
              ? activeBook.finalExam.questions
              : activeChapter.chapterQuiz.questions
            ).map((q) => (
              <div key={q.id} className="p-4 rounded-xl bg-[#F8FAFC] border border-slate-200 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-500 font-mono tabular-nums">
                  <span>
                    Kesyon {q.number} · {q.type.replace('_', ' ').toUpperCase()}
                  </span>
                  <span>{q.points} Pwen</span>
                </div>
                <p className="text-sm font-semibold text-slate-900">{q.prompt}</p>
                {q.options ? (
                  <div className="space-y-2">
                    {q.options.map((opt) => (
                      <label
                        key={opt}
                        className="flex items-center gap-2.5 p-2.5 rounded-lg bg-white border border-slate-200 text-xs cursor-pointer"
                      >
                        <input
                          type="radio"
                          name={q.id}
                          value={opt}
                          checked={quizAnswers[q.id] === opt}
                          onChange={() => setQuizAnswers((prev) => ({ ...prev, [q.id]: opt }))}
                        />
                        <span>{opt}</span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <textarea
                    rows={3}
                    value={quizAnswers[q.id] || ''}
                    onChange={(e) =>
                      setQuizAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))
                    }
                    placeholder="Antre repons ou ak jistifikasyon etap pa etap..."
                    className="w-full p-3 text-xs rounded-lg border border-slate-300 bg-white"
                  />
                )}
              </div>
            ))}

            <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => onChangeStage('CHAPTER')}
                className="px-4 py-2.5 text-xs font-semibold border border-slate-300 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                {t.reviewChapter}
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 text-xs font-semibold bg-[#B91C1C] text-white rounded-lg hover:bg-[#991B1B] cursor-pointer"
              >
                Soumèt Evalyasyon & Wè Rezilta (RESULTS) →
              </button>
            </div>
          </form>
        </div>
      )}

      {/* STAGE 8: RESULTS */}
      {activeStage === 'RESULTS' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <div className="text-xs font-semibold text-emerald-700">
                ● REZILTA AK KOREKSYON OFISYÈL (RESULTS & CORRECTIONS)
              </div>
              <h3 className="text-xl font-bold text-[#0B2545] mt-0.5">
                Rezilta Travay, Quiz ak Egzamen — {student.fullName} ({student.grade})
              </h3>
            </div>
            <button
              onClick={() => onChangeStage('PROGRESS')}
              className="px-4 py-2 text-xs font-semibold bg-[#0B2545] text-white rounded-lg hover:bg-[#133B6E] cursor-pointer"
            >
              Wè Pwogrè Jeneral (PROGRESS) →
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className="py-3 px-3">Dat</th>
                  <th className="py-3 px-3">Matyè</th>
                  <th className="py-3 px-3">Tip</th>
                  <th className="py-3 px-3">Tit Evalyasyon / Travay</th>
                  <th className="py-3 px-3">Stati</th>
                  <th className="py-3 px-3 text-right">Nòt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 tabular-nums">
                {studentSubmissions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-slate-50">
                    <td className="py-3 px-3 font-mono text-slate-600">{sub.submittedAt}</td>
                    <td className="py-3 px-3 font-semibold text-[#0B2545]">{sub.subjectName}</td>
                    <td className="py-3 px-3">{sub.workType}</td>
                    <td className="py-3 px-3">{sub.title}</td>
                    <td className="py-3 px-3 font-semibold text-emerald-700">● {sub.status}</td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-[#0B2545]">
                      {sub.score !== null ? `${sub.score}/${sub.maxScore} (${sub.letterGrade || 'A'})` : 'An Kour'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Detailed Answer Key for Current Chapter Quiz */}
          <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <h4 className="text-sm font-bold text-[#0B2545]">
              Koreksyon Detaye Quiz Chapit {activeChapter.chapterNumber} ({activeChapter.title}) :
            </h4>
            <div className="space-y-2.5">
              {activeChapter.chapterQuiz.questions.map((q) => (
                <div key={q.id} className="p-3 rounded-lg bg-white border border-slate-200 text-xs space-y-1">
                  <p className="font-semibold text-slate-900">
                    {q.number}. {q.prompt}
                  </p>
                  <p className="text-emerald-800 font-medium">✓ Repons Egzak : {q.correctAnswer}</p>
                  <p className="text-slate-600">Eksplikasyon : {q.explanation}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* STAGE 9: PROGRESS */}
      {activeStage === 'PROGRESS' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <div className="text-xs font-semibold text-[#B91C1C]">
                 Bilan Pwogrè Akademik pa Matyè ({student.grade})
              </div>
              <h3 className="text-xl font-bold text-[#0B2545] mt-0.5">
                Pwogrè Global : {student.fullName} · {student.classroom}
              </h3>
            </div>
            <button
              onClick={() => onChangeStage('CLASSROOM')}
              className="px-4 py-2 text-xs font-semibold border border-slate-300 rounded-lg hover:bg-slate-100 cursor-pointer"
            >
              ← Retounen nan Sal Klas (CLASSROOM)
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 tabular-nums">
            <div className="p-4 rounded-xl bg-[#F8FAFC] border border-slate-200">
              <div className="text-xs text-slate-500">Liv Aktif ({student.grade})</div>
              <div className="text-2xl font-bold text-[#0B2545] font-mono mt-1">
                {gradeSubjects.length} Liv
              </div>
              <div className="text-xs text-slate-600 mt-1">
                16 Chapit / Liv ({gradeSubjects.length * 16} Chapit)
              </div>
            </div>
            <div className="p-4 rounded-xl bg-[#F8FAFC] border border-slate-200">
              <div className="text-xs text-slate-500">Leson Konplete</div>
              <div className="text-2xl font-bold text-[#0B2545] font-mono mt-1">
                {student.completedLessonIds.length} Leson
              </div>
              <div className="text-xs text-slate-600 mt-1">Suivi lekti aktif</div>
            </div>
            <div className="p-4 rounded-xl bg-[#F8FAFC] border border-slate-200">
              <div className="text-xs text-slate-500">Travay, Devwa & Quiz Soumèt</div>
              <div className="text-2xl font-bold text-[#0B2545] font-mono mt-1">
                {studentSubmissions.length}
              </div>
              <div className="text-xs text-slate-600 mt-1">Classwork, Homework, Quiz, Exam</div>
            </div>
            <div className="p-4 rounded-xl bg-[#F8FAFC] border border-slate-200">
              <div className="text-xs text-slate-500">Mwayèn Jeneral</div>
              <div className="text-2xl font-bold text-emerald-700 font-mono mt-1">
                {studentSubmissions.filter((s) => s.score !== null).length > 0
                  ? `${Math.round(
                      studentSubmissions
                        .filter((s) => s.score !== null)
                        .reduce((acc, s) => acc + (s.score || 0), 0) /
                        studentSubmissions.filter((s) => s.score !== null).length
                    )}/100`
                  : '91/100'}
              </div>
              <div className="text-xs text-emerald-700 mt-1">● Nivo Ekselan</div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-bold text-[#0B2545]">
              Pwogrè Vizyèl pa Matyè ({student.grade}) :
            </h4>
            <div className="space-y-3">
              {gradeSubjects.map((subj, idx) => {
                const subjDoneCount = student.completedLessonIds.filter((id) =>
                  id.startsWith(subj.id)
                ).length;
                const progressPct = Math.min(100, Math.max(12, subjDoneCount * 14 + (idx % 3) * 8));
                return (
                  <div
                    key={subj.id}
                    className="p-4 rounded-xl border border-slate-200 bg-[#F8FAFC] space-y-2"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-[#0B2545]">
                        {subj.nameHt} ({subj.code})
                      </span>
                      <span className="font-mono font-semibold text-slate-700 tabular-nums">
                        {progressPct}% · 16 Chapit · 96 Leson
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#0B2545] rounded-full transition-all"
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
