export type Language = 'ht' | 'fr' | 'en';

export type GradeLevel =
  | 'Grade 7'
  | 'Grade 8'
  | 'Grade 9'
  | 'Grade 10'
  | 'Grade 11'
  | 'Grade 12';

export const ASLA_GRADES: GradeLevel[] = [
  'Grade 7',
  'Grade 8',
  'Grade 9',
  'Grade 10',
  'Grade 11',
  'Grade 12',
];

export type AccountType = 'Student' | 'Parent' | 'Administration';

export type ApprovalStatus = 'Pending' | 'Approved' | 'Rejected' | 'Suspended' | 'Active';

export type PaymentStatus =
  | 'Not Started'
  | 'Pending'
  | 'Pending Verification'
  | 'Verified'
  | 'Approved'
  | 'Rejected'
  | 'Correction Required';

export type AslaPaymentType =
  | 'Frè lekòl anyèl'
  | 'Preparasyon Examen Leta / Filo';

export type WorkStatus = 'Not Started' | 'In Progress' | 'Submitted' | 'Graded' | 'Missing';

export type AttendanceStatus = 'Present' | 'Absent' | 'Late' | 'Excused';

export type LearningFlowStage =
  | 'CLASSROOM'
  | 'BOOK'
  | 'CHAPTER'
  | 'LESSON'
  | 'CLASSWORK'
  | 'HOMEWORK'
  | 'QUIZ'
  | 'RESULTS'
  | 'PROGRESS';

export const LEARNING_FLOW_STAGES: LearningFlowStage[] = [
  'CLASSROOM',
  'BOOK',
  'CHAPTER',
  'LESSON',
  'CLASSWORK',
  'HOMEWORK',
  'QUIZ',
  'RESULTS',
  'PROGRESS',
];

export interface SubjectDefinition {
  id: string;
  code: string;
  nameHt: string;
  nameFr: string;
  nameEn: string;
  category: 'STEM' | 'Humanities';
  grade: GradeLevel;
  descriptionHt: string;
  descriptionFr: string;
  descriptionEn: string;
  weeklyHours: number;
  coefficient: number;
}

export interface VocabularyItem {
  term: string;
  definitionHt: string;
  definitionFr: string;
  definitionEn: string;
}

export interface WorkedExample {
  title: string;
  scenario: string;
  stepByStepSolution: string[];
  conclusion: string;
}

export interface GuidedPracticeItem {
  prompt: string;
  hint: string;
  modelAnswer: string;
}

export interface ExerciseQuestion {
  id: string;
  number: number;
  type: 'multiple_choice' | 'true_false' | 'short_answer' | 'problem_solving' | 'written_response';
  prompt: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  points: number;
}

export interface HistoricalDateItem {
  date: string;
  event: string;
}

export interface HistoricalFigureItem {
  name: string;
  role: string;
}

export interface ComprehensionQA {
  question: string;
  answer: string;
}

export interface AcademicLesson {
  id: string;
  lessonNumber: number;
  title: string;
  pageStart: number;
  pageEnd: number;
  estimatedMinutes: number;
  objectives: string[];
  introduction: string;
  detailedExplanation: string[];
  importantDates?: HistoricalDateItem[];
  historicalFigures?: HistoricalFigureItem[];
  historiographyNote?: string;
  examples: WorkedExample[];
  vocabulary: VocabularyItem[];
  comprehensionQuestions?: ComprehensionQA[];
  guidedPractice: GuidedPracticeItem[];
  classworkExercises: ExerciseQuestion[];
  homeworkAssignment: {
    title: string;
    instructions: string;
    questions: ExerciseQuestion[];
  };
  reviewSummary?: string;
  reviewQuestions: {
    question: string;
    answer: string;
  }[];
}

export interface AcademicChapter {
  id: string;
  chapterNumber: number;
  title: string;
  subtitle: string;
  pageStart: number;
  pageEnd: number;
  overview: string;
  learningGoals: string[];
  importantDates?: HistoricalDateItem[];
  historicalFigures?: HistoricalFigureItem[];
  historiographyNote?: string;
  comprehensionQuestions?: ComprehensionQA[];
  lessons: AcademicLesson[];
  chapterReview: {
    summaryPoints: string[];
    keyFormulasOrRules: string[];
  };
  chapterQuiz: {
    id: string;
    title: string;
    passingScore: number;
    timeLimitMinutes: number;
    questions: ExerciseQuestion[];
  };
}

export interface AcademicBook {
  id: string;
  grade: GradeLevel;
  subjectId: string;
  subjectNameHt: string;
  subjectNameFr: string;
  subjectNameEn: string;
  title: string;
  subtitle: string;
  edition: string;
  academicYear: string;
  totalPages: number;
  coverCategory: 'STEM' | 'Humanities';
  introduction: string;
  learningObjectives: string[];
  chapters: AcademicChapter[];
  finalReview: {
    overview: string;
    studyChecklist: string[];
    masteryThemes: string[];
  };
  finalExam: {
    id: string;
    title: string;
    timeLimitMinutes: number;
    passingScore: number;
    questions: ExerciseQuestion[];
  };
}

export interface ClassroomRecord {
  id: string;
  grade: GradeLevel;
  name: string;
  roomNumber: string;
  homeroomTeacher: string;
  academicYear: string;
  capacity: number;
  scheduleSummary: string;
}

export interface StudentAccount {
  id: string;
  studentCode: string;
  fullName: string;
  dateOfBirth: string;
  email: string;
  phone: string;
  passwordHash: string;
  grade: GradeLevel;
  classroom: string;
  parentName: string;
  parentContact: string;
  parentId?: string;
  approvalStatus: ApprovalStatus;
  paymentStatus: PaymentStatus;
  academicYear: string;
  completedLessonIds: string[];
  currentSubjectId: string;
  currentChapterNumber: number;
  currentLessonNumber: number;
  createdAt: string;
  // Preparation Examen Leta / Filo fields
  examPrepStudentType?: ExamPrepStudentType;
  completedRequiredAslaCourses?: boolean;
  examPrepAccessStatus?: ExamPrepAccessStatus;
  examPrepPaymentStatus?: ExamPrepPaymentStatus;
  completedExamPrepTopicIds?: string[];
  inProgressExamPrepTopicIds?: string[];
  teacherExamPrepRecommendation?: string;
}

export type ExamPrepStudentType = 'ASLA Student' | 'External Student';

export type ExamPrepAccessStatus =
  | 'Active'
  | 'Pending Verification'
  | 'Payment Required'
  | 'Rejected'
  | 'Correction Requested'
  | 'Revoked';

export type ExamPrepPaymentStatus =
  | 'Not Started'
  | 'Not Submitted'
  | 'Pending Verification'
  | 'Verified'
  | 'Approved'
  | 'Rejected'
  | 'Correction Required'
  | 'Correction Requested';

export type ExamPrepDifficulty = 'Easy' | 'Medium' | 'Hard' | 'Official Exam Level';

export type ExamPrepQuestionType =
  | 'multiple_choice'
  | 'short_answer'
  | 'true_false'
  | 'fill_in_blank'
  | 'problem_solving'
  | 'written_response'
  | 'reading_comprehension'
  | 'historical_analysis'
  | 'math_problem_solving';

export type ExamPrepSubjectCode =
  | 'MATH'
  | 'FRAN'
  | 'KREY'
  | 'ENGL'
  | 'SCIN'
  | 'SCIS'
  | 'ISTW'
  | 'CIVI'
  | 'INFO';

export interface ExamPrepSubjectConfig {
  code: ExamPrepSubjectCode;
  nameHt: string;
  nameFr: string;
  nameEn: string;
  coefficient: number;
  enabled: boolean;
  descriptionHt: string;
}

export interface ExamPrepProgram {
  id: string;
  code: string;
  titleHt: string;
  titleFr: string;
  titleEn: string;
  targetGrades: GradeLevel[];
  officialExamName: string;
  passingPercentage: number;
  enabledSubjects: ExamPrepSubjectCode[];
  descriptionHt: string;
}

export interface ExamPrepQuestion {
  id: string;
  subjectCode: ExamPrepSubjectCode;
  subjectNameHt: string;
  topicId: string;
  topicTitleHt: string;
  gradeLevels: GradeLevel[];
  difficulty: ExamPrepDifficulty;
  questionType: ExamPrepQuestionType;
  promptHt: string;
  readingPassageHt?: string;
  options?: string[];
  correctAnswer: string;
  stepByStepExplanationHt: string;
  examTipHt?: string;
  points: number;
  isOfficialPastExamStyle?: boolean;
  examYearReference?: string;
}

export interface ExamPrepTopic {
  id: string;
  subjectCode: ExamPrepSubjectCode;
  subjectNameHt: string;
  chapterNumber: number;
  topicNumber: number;
  titleHt: string;
  titleFr: string;
  titleEn: string;
  targetGrades: GradeLevel[];
  estimatedMinutes: number;
  explanationHt: string[];
  keyConceptsHt: string[];
  formulasOrRulesHt: { label: string; content: string }[];
  examplesHt: {
    title: string;
    problem: string;
    stepByStepSolution: string[];
    finalAnswer: string;
  }[];
  commonExamMistakesHt: string[];
  quickReviewHt: string[];
  practiceQuestions: ExamPrepQuestion[];
}

export interface ExamPrepMockExam {
  id: string;
  titleHt: string;
  titleFr: string;
  titleEn: string;
  programId: string;
  targetGrades: GradeLevel[];
  subjectCode: ExamPrepSubjectCode | 'MULTI';
  subjectNameHt: string;
  durationMinutes: number;
  totalPoints: number;
  passingScorePercent: number;
  isFullSimulation: boolean;
  instructionsHt: string;
  questions: ExamPrepQuestion[];
}

export interface ExamPrepAttempt {
  id: string;
  studentId: string;
  studentName: string;
  grade: GradeLevel;
  attemptType: 'Practice' | 'Topic Quiz' | 'Kesyon Tip Egzamen' | 'Similasyon Egzamen' | 'Mock Exam';
  mockExamId?: string;
  subjectCode: ExamPrepSubjectCode | 'MULTI';
  subjectNameHt: string;
  topicId?: string;
  titleHt: string;
  attemptNumber: number;
  date: string;
  timeUsedMinutes: number;
  scorePoints: number;
  totalPoints: number;
  percentage: number;
  passed: boolean;
  answers: Record<string, string>;
  weakTopicsHt: string[];
  recommendedLessonsHt: string[];
}

export interface ExamPrepPaymentRecord {
  id: string;
  studentId: string;
  studentCode: string;
  studentName: string;
  studentType: ExamPrepStudentType;
  completedRequiredAslaCourses: boolean;
  grade: GradeLevel;
  classroom: string;
  expectedAmountHtg: 500 | 2000;
  submittedAmountHtg: number;
  paymentMethod: 'MonCash' | 'Natcash' | 'NatCash' | 'Sogebank' | 'BNC' | 'Unibank';
  paymentReference?: string;
  natcashNumber?: string;
  paymentDate?: string;
  transactionReference: string;
  receiptFileName: string;
  receiptDataUrl?: string;
  aslaReceiptReceived?: boolean;
  whatsappReceiptReceived?: boolean;
  whatsappSentByStudent?: boolean;
  submittedAt: string;
  status: ExamPrepPaymentStatus;
  rejectionOrCorrectionReason?: string;
  reviewedBy?: string;
  reviewedAt?: string;
}

export interface ExamPrepStudyPlanTask {
  id: string;
  studentId: string;
  dayHt: string;
  subjectCode: ExamPrepSubjectCode;
  subjectNameHt: string;
  topicTitleHt: string;
  activityType: 'Revizyon Leson' | 'Egzèsis Pratik' | 'Kesyon Tip Egzamen' | 'Mock Exam' | 'Gid Revizyon';
  durationMinutes: number;
  completed: boolean;
}

export interface ExamPrepMaterial {
  id: string;
  subjectCode: ExamPrepSubjectCode;
  subjectNameHt: string;
  targetGrades: GradeLevel[];
  category: 'Gid Revizyon' | 'Fèy Fòmil & Règ' | ' Liy Tan Istorik' | ' Ansyen Egzamen Leta' | ' Lis Verifikasyon';
  titleHt: string;
  summaryHt: string;
  contentSectionsHt: { heading: string; bullets: string[] }[];
  updatedAt: string;
}

export interface ExamPrepAuditLog {
  id: string;
  timestamp: string;
  adminName: string;
  studentId: string;
  studentName: string;
  action: string;
  details: string;
}

export interface ParentAccount {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  passwordHash: string;
  childrenIds: string[];
  createdAt: string;
}

export interface PaymentTransaction {
  id: string;
  studentId: string;
  studentCode?: string;
  studentName: string;
  studentType?: ExamPrepStudentType;
  paymentType?: AslaPaymentType;
  expectedAmountHtg?: number;
  grade: GradeLevel;
  classroom: string;
  parentName: string;
  parentContact: string;
  amountHtg: number;
  paymentMethod: 'MonCash' | 'Natcash' | 'NatCash' | 'Sogebank' | 'BNC' | 'Unibank';
  paymentReference?: string;
  natcashNumber?: string;
  paymentDate?: string;
  submissionDate?: string;
  transactionNumber: string;
  receiptFileName: string;
  receiptDataUrl?: string;
  aslaReceiptReceived?: boolean;
  whatsappReceiptReceived?: boolean;
  whatsappSentByStudent?: boolean;
  date: string;
  status: PaymentStatus;
  rejectionReason?: string;
}

export interface WorkSubmission {
  id: string;
  studentId: string;
  studentName: string;
  grade: GradeLevel;
  classroom: string;
  subjectId: string;
  subjectName: string;
  bookId: string;
  chapterNumber: number;
  lessonNumber: number;
  workType: 'Classwork' | 'Homework' | 'Quiz' | 'Exam';
  title: string;
  status: WorkStatus;
  answers: Record<string, string>;
  writtenResponse: string;
  score: number | null;
  maxScore: number;
  letterGrade?: string;
  teacherFeedback?: string;
  submittedAt: string;
  gradedAt?: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  grade: GradeLevel;
  classroom: string;
  date: string;
  status: AttendanceStatus;
  note: string;
}

export interface SchoolNotification {
  id: string;
  targetRole: 'All' | 'Student' | 'Parent' | 'Administration';
  targetUserId?: string;
  category:
    | 'Registration'
    | 'Payment'
    | 'Payment Approval'
    | 'Payment Rejection'
    | 'Student Approval'
    | 'Student Rejection'
    | 'Assignment'
    | 'Homework'
    | 'Quiz'
    | 'Exam'
    | 'Grade'
    | 'Certificate'
    | 'Announcement';
  title: string;
  message: string;
  date: string;
  read: boolean;
}

export type CertificateType =
  | 'Subject Accomplishment'
  | 'Grade Promotion'
  | 'High School Diploma';

export type HonorsMention =
  | 'Mention Excellence (Summa Cum Laude)'
  | 'Mention Très Bien (Magna Cum Laude)'
  | 'Mention Bien (Cum Laude)'
  | 'Mention Assez Bien (Honorable)';

export interface AcademicCertificate {
  id: string;
  serialNumber: string;
  studentId: string;
  studentName: string;
  studentCode: string;
  grade: GradeLevel;
  classroom: string;
  certificateType: CertificateType;
  subjectName?: string;
  titleHt: string;
  titleFr: string;
  titleEn: string;
  citationHt: string;
  citationFr: string;
  citationEn: string;
  honors: HonorsMention;
  finalAverageScore: number;
  academicYear: string;
  issuedAt: string;
  issuedBy: string;
  status: 'Active' | 'Revoked';
}

export interface SchoolFileResource {
  id: string;
  title: string;
  category: 'Syllabus' | 'Official Exam Guide' | 'Policy' | 'Calendar' | 'Form';
  grade: GradeLevel | 'All Grades (7–12)';
  sizeLabel: string;
  updatedAt: string;
  description: string;
}

export interface SchoolSettings {
  school_name?: string;
  schoolName: string;
  fullOfficialTitle: string;
  academicYear: string;
  registrationFeeHtg: number;
  defaultLanguage: Language;
  passingScorePercent: number;
  moncashMerchantNumber: string;
  natcashMerchantNumber: string;
  bankAccountInfo: string;
  contactEmail: string;
  contactPhone: string;
  campusAddress: string;
}
