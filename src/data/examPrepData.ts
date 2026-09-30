import {
  ExamPrepAttempt,
  ExamPrepAuditLog,
  ExamPrepMaterial,
  ExamPrepMockExam,
  ExamPrepPaymentRecord,
  ExamPrepProgram,
  ExamPrepQuestion,
  ExamPrepStudyPlanTask,
  ExamPrepSubjectCode,
  ExamPrepSubjectConfig,
  ExamPrepTopic,
  StudentAccount,
} from '../types';

/**
 * Determines the official Exam Prep fee from the student's enrollment and course completion status.
 * - Official ASLA student who completed required ASLA classes/courses: 500 HTG
 * - External student who did NOT complete classes/courses at ASLA: 2,000 HTG
 */
export function getStudentExamPrepFee(student: StudentAccount): 500 | 2000 {
  const isAslaStudent = (student.examPrepStudentType || 'ASLA Student') === 'ASLA Student';
  const completedCourses = student.completedRequiredAslaCourses !== false;
  return isAslaStudent && completedCourses ? 500 : 2000;
}

export function getStudentExamPrepFeeLabelHt(student: StudentAccount): string {
  const fee = getStudentExamPrepFee(student);
  if (fee === 500) {
    return 'Elèv ASLA ki fini tout klas/kour li yo: 500 HTG';
  }
  return 'Elèv ekstèn ki pa t fè klas li yo nan ASLA: 2,000 HTG';
}

export const INITIAL_EXAM_PREP_SUBJECTS: ExamPrepSubjectConfig[] = [
  {
    code: 'MATH',
    nameHt: 'Matematik',
    nameFr: 'Mathématiques',
    nameEn: 'Mathematics',
    coefficient: 4,
    enabled: true,
    descriptionHt:
      'Aljèb, jeyometri, fonksyon, trigonometri, estatistik, pwobabilite, ak rezolisyon pwoblèm tip Egzamen Leta / Filo.',
  },
  {
    code: 'FRAN',
    nameHt: 'Français',
    nameFr: 'Français',
    nameEn: 'French',
    coefficient: 3,
    enabled: true,
    descriptionHt:
      'Gramè avanse, konpreyansyon tèks, analiz literè ayisyen ak frankofòn, disètasyon ak rezime tèks ofisyèl.',
  },
  {
    code: 'KREY',
    nameHt: 'Kreyòl Ayisyen',
    nameFr: 'Créole Haïtien',
    nameEn: 'Haitian Creole',
    coefficient: 3,
    enabled: true,
    descriptionHt:
      'Òtograf ofisyèl AKA, sintaks, estilistik, pwovèb, analiz tèks literè ayisyen ak redaksyon agimantatif.',
  },
  {
    code: 'ENGL',
    nameHt: 'English',
    nameFr: 'Anglais',
    nameEn: 'English',
    coefficient: 2,
    enabled: true,
    descriptionHt:
      'Reading comprehension, grammar structures, academic vocabulary, translation, and essay writing for state exams.',
  },
  {
    code: 'SCIN',
    nameHt: 'Syans Natirèl',
    nameFr: 'Sciences Naturelles (SVT / Physique-Chimie)',
    nameEn: 'Natural Sciences',
    coefficient: 4,
    enabled: true,
    descriptionHt:
      'Biyoloji selilè, jenetik, anatomi imen, ekoloji, chimi jeneral ak òganik, mekanik, elektrisite ak optik.',
  },
  {
    code: 'SCIS',
    nameHt: 'Syans Sosyal',
    nameFr: 'Sciences Sociales & Géographie',
    nameEn: 'Social Sciences & Geography',
    coefficient: 3,
    enabled: true,
    descriptionHt:
      'Jewografi fizik, imen ak ekonomik Ayiti ak Karayib la, istwa inivèsèl, demografi ak jeyopolitik mondyal.',
  },
  {
    code: 'ISTW',
    nameHt: 'Istwa D Ayiti',
    nameFr: 'Histoire d’Haïti',
    nameEn: 'History of Haiti',
    coefficient: 3,
    enabled: true,
    descriptionHt:
      'Matyè ofisyèl apa: epòk Taíno, kolonizasyon, Saint-Domingue, Revolisyon Ayisyen an (1791–1804), 19yèm–21yèm syèk ak istoriografi.',
  },
  {
    code: 'CIVI',
    nameHt: 'Edikasyon Sivik',
    nameFr: 'Éducation à la Citoyenneté',
    nameEn: 'Civic Education',
    coefficient: 2,
    enabled: true,
    descriptionHt:
      'Konstitisyon 1987, twa pouvwa Leta yo, dwa ak devwa sitwayen, enstitisyon piblik, demokrasi ak etik sivik.',
  },
  {
    code: 'INFO',
    nameHt: 'Informatique',
    nameFr: 'Informatique & Technologies',
    nameEn: 'Computer Science',
    coefficient: 2,
    enabled: true,
    descriptionHt:
      'Achitekti òdinatè, algoritmik, lojik pwogramasyon, bazdone, rezo entènèt ak sekirite enfòmatik.',
  },
];

export const INITIAL_EXAM_PREP_PROGRAMS: ExamPrepProgram[] = [
  {
    id: 'prog-9af',
    code: 'MENFP-9AF',
    titleHt: 'Preparasyon Egzamen Ofisyèl 9yèm Ane Fondamantal',
    titleFr: 'Préparation Examen Officiel 9e Année Fondamentale',
    titleEn: 'Official 9th Grade State Examination Preparation',
    targetGrades: ['Grade 7', 'Grade 8', 'Grade 9'],
    officialExamName: 'Egzamen Leta 9yèm Ane Fondamantal (MENFP)',
    passingPercentage: 65,
    enabledSubjects: ['MATH', 'FRAN', 'KREY', 'ENGL', 'SCIN', 'SCIS', 'ISTW', 'CIVI', 'INFO'],
    descriptionHt:
      'Pwogram ofisyèl konplè pou elèv 7yèm, 8yèm ak 9yèm AF k ap prepare Egzamen Leta 9yèm Ane Fondamantal Ministè Edikasyon Nasyonal.',
  },
  {
    id: 'prog-rheto',
    code: 'MENFP-BAC1',
    titleHt: 'Preparasyon Egzamen Leta Segondè III / Rhéto (Bac I)',
    titleFr: 'Préparation Examen d’État Secondaire III / Rhéto (Bac I)',
    titleEn: 'State Exam Preparation — Secondary III / Rhéto (Bac I)',
    targetGrades: ['Grade 10', 'Grade 11'],
    officialExamName: 'Egzamen Leta Segondè III / Rhéto (MENFP)',
    passingPercentage: 65,
    enabledSubjects: ['MATH', 'FRAN', 'KREY', 'ENGL', 'SCIN', 'SCIS', 'ISTW', 'CIVI', 'INFO'],
    descriptionHt:
      'Pwogram preparasyon entansif pou elèv Grade 10 ak Grade 11 (NS2–NS3 / Rhéto) sou tout matyè ofisyèl yo.',
  },
  {
    id: 'prog-philo',
    code: 'MENFP-PHILO',
    titleHt: 'Preparasyon Egzamen Leta Filo / Terminale / Segondè IV (Bac II)',
    titleFr: 'Préparation Examen d’État Philo / Terminale / NS4 (Bac II)',
    titleEn: 'Official Philo / Bac II State Exam Preparation (Grade 12)',
    targetGrades: ['Grade 12'],
    officialExamName: 'Egzamen Leta Filo / Baccalauréat II (NS4 - MENFP)',
    passingPercentage: 65,
    enabledSubjects: ['MATH', 'FRAN', 'KREY', 'ENGL', 'SCIN', 'SCIS', 'ISTW', 'CIVI', 'INFO'],
    descriptionHt:
      'Pwogram ofisyèl nivo Filo / Terminale (Grade 12) avèk similasyon egzamen kronometre, ansyen fèy egzamen Leta, ak analiz apwofondi.',
  },
];

export const INITIAL_EXAM_PREP_QUESTIONS: ExamPrepQuestion[] = [
  // 1. MATEMATIK
  {
    id: 'epq-math-1',
    subjectCode: 'MATH',
    subjectNameHt: 'Matematik',
    topicId: 'ept-math-1',
    topicTitleHt: 'Ekwasyon, Inekwasyon ak Sistèm Lineyè / Kwadratik',
    gradeLevels: ['Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'],
    difficulty: 'Official Exam Level',
    questionType: 'math_problem_solving',
    promptHt:
      'Rezoud ekwasyon segond degre sa a nan IR: 2x² - 7x + 3 = 0. Bay diskriminan Δ a epi de rasin x₁ ak x₂ yo.',
    options: [
      'Δ = 25 ; x₁ = 1/2 ak x₂ = 3',
      'Δ = 49 ; x₁ = -1/2 ak x₂ = -3',
      'Δ = 25 ; x₁ = 2 ak x₂ = 3',
      'Δ = 17 ; pa gen rasin reyèl',
    ],
    correctAnswer: 'Δ = 25 ; x₁ = 1/2 ak x₂ = 3',
    stepByStepExplanationHt:
      'Etap 1: Idantifye koefisyan yo: a = 2, b = -7, c = 3. Etap 2: Kalkile diskriminan an Δ = b² - 4ac = (-7)² - 4(2)(3) = 49 - 24 = 25. Etap 3: Kòm Δ = 25 > 0, √Δ = 5. Etap 4: x₁ = (7 - 5)/(2×2) = 2/4 = 1/2 ; x₂ = (7 + 5)/(2×2) = 12/4 = 3.',
    examTipHt: 'Nan Egzamen Leta, toujou ekri fòmil Δ = b² - 4ac la klèman anvan w ranplase chif yo pou w pa pèdi pwen metòd.',
    points: 10,
    isOfficialPastExamStyle: true,
    examYearReference: 'MENFP — Modèl Egzamen Leta Segondè / Filo',
  },
  {
    id: 'epq-math-2',
    subjectCode: 'MATH',
    subjectNameHt: 'Matematik',
    topicId: 'ept-math-1',
    topicTitleHt: 'Ekwasyon, Inekwasyon ak Sistèm Lineyè / Kwadratik',
    gradeLevels: ['Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'],
    difficulty: 'Medium',
    questionType: 'multiple_choice',
    promptHt:
      'Nan yon triyang rektang ABC ki rektang nan A, kote AB = 6 cm ak AC = 8 cm. Dapre Teyorèm Pitagò, ki longè ipoteniz BC a?',
    options: ['10 cm', '12 cm', '14 cm', '100 cm'],
    correctAnswer: '10 cm',
    stepByStepExplanationHt:
      'Dapre Teyorèm Pitagò: BC² = AB² + AC² = 6² + 8² = 36 + 64 = 100. Donk BC = √100 = 10 cm.',
    examTipHt: 'Triplè Pitagò (3,4,5) ak miltip li yo (6,8,10) parèt souvan nan kesyon jeyometri Egzamen 9yèm AF ak Segondè.',
    points: 10,
    isOfficialPastExamStyle: true,
    examYearReference: 'MENFP 9yèm AF',
  },
  {
    id: 'epq-math-3',
    subjectCode: 'MATH',
    subjectNameHt: 'Matematik',
    topicId: 'ept-math-2',
    topicTitleHt: 'Fonksyon, Derive, Limit ak Estatistik (Segondè / Filo)',
    gradeLevels: ['Grade 10', 'Grade 11', 'Grade 12'],
    difficulty: 'Official Exam Level',
    questionType: 'problem_solving',
    promptHt:
      'Konsidere fonksyon f(x) = x³ - 3x + 2 defini sou IR. Ki ekspresyon derive f’(x) la epi pou ki valè x fonksyon an admet ekstremòm lokal yo?',
    options: [
      'f’(x) = 3x² - 3 ; ekstremòm nan x = -1 ak x = 1',
      'f’(x) = 3x² + 3 ; pa gen ekstremòm',
      'f’(x) = x² - 3 ; ekstremòm nan x = √3',
      'f’(x) = 3x - 3 ; ekstremòm nan x = 1 sèlman',
    ],
    correctAnswer: 'f’(x) = 3x² - 3 ; ekstremòm nan x = -1 ak x = 1',
    stepByStepExplanationHt:
      'Etap 1: Derive f(x) = x³ - 3x + 2 bay f’(x) = 3x² - 3 = 3(x - 1)(x + 1). Etap 2: Rezoud f’(x) = 0 → x = -1 oswa x = 1. Nan x = -1 nou gen yon maksimòm lokal f(-1) = 4, epi nan x = 1 nou gen yon minimòm lokal f(1) = 0.',
    examTipHt: 'Toujou fè tablo varyasyon an avèk siy f’(x) sou chak entèval (-∞, -1), (-1, 1), ak (1, +∞).',
    points: 15,
    isOfficialPastExamStyle: true,
    examYearReference: 'MENFP Bac II / Filo',
  },

  // 2. ISTWA D AYITI (Separate Official Subject!)
  {
    id: 'epq-istw-1',
    subjectCode: 'ISTW',
    subjectNameHt: 'Istwa D Ayiti',
    topicId: 'ept-istw-1',
    topicTitleHt: 'Revolisyon Ayisyen an (1791–1804) ak Fondasyon Leta Ayisyen',
    gradeLevels: ['Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'],
    difficulty: 'Official Exam Level',
    questionType: 'historical_analysis',
    promptHt:
      'Analize wòl istorik Bwa Kayiman (14 out 1791), Konstitisyon 1801 Toussaint Louverture la, ak Batay Vètyè (18 novanm 1803) nan pwosesis ki mennen nan Pwoklamasyon Endepandans Ayiti sou Plas d Am Gonayiv 1ye janvye 1804.',
    options: [
      'Bwa Kayiman lanse soulèvman jeneral esklav yo nan Nò; Konstitisyon 1801 tabli otonomi ak abolisyon esklavaj; Vètyè sele defèt final lame Rochambeau a anvan Pwoklamasyon 1ye janvye 1804 pa Dessalines ak Boisrond-Tonnerre.',
      'Bwa Kayiman te fèt apre endepandans an 1805 epi Konstitisyon 1801 te ekri pa Rochambeau.',
      'Batay Vètyè te fèt an 1791 ant Panyòl yo ak Taíno yo nan Marien.',
      'Toussaint Louverture te siyen Ak Endepandans lan Gonayiv 1ye janvye 1804.',
    ],
    correctAnswer:
      'Bwa Kayiman lanse soulèvman jeneral esklav yo nan Nò; Konstitisyon 1801 tabli otonomi ak abolisyon esklavaj; Vètyè sele defèt final lame Rochambeau a anvan Pwoklamasyon 1ye janvye 1804 pa Dessalines ak Boisrond-Tonnerre.',
    stepByStepExplanationHt:
      '1) 14 out 1791 (Bwa Kayiman): Boukman Dutty ak Cécile Fatiman òganize seremoni ki kòmanse ensireksyon jeneral esklav yo nan Nò (22 out 1791). 2) Jiyè 1801: Toussaint Louverture pibliye Konstitisyon 1801 ki konfime abolisyon esklavaj pou tout tan sou tout zile a. 3) 18 novanm 1803 (Batay Vètyè): Lame Endijèn anba Jean-Jacques Dessalines ak François Capois (Capois-La-Mort) venk ekspedisyon fransè a. 4) 1ye janvye 1804 (Gonayiv): Pwoklamasyon ofisyèl Endepandans Ayiti.',
    examTipHt: 'Nan kesyon disertasyon Istwa D Ayiti, toujou site dat egzak yo, kote yo, ak wòl chak lidè istorik.',
    points: 15,
    isOfficialPastExamStyle: true,
    examYearReference: 'MENFP — Istwa D Ayiti (9yèm AF & Filo)',
  },
  {
    id: 'epq-istw-2',
    subjectCode: 'ISTW',
    subjectNameHt: 'Istwa D Ayiti',
    topicId: 'ept-istw-2',
    topicTitleHt: 'Ayiti nan 19yèm ak 20yèm Syèk: Dèt Endepandans ak Okipasyon Ameriken (1915–1934)',
    gradeLevels: ['Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'],
    difficulty: 'Official Exam Level',
    questionType: 'multiple_choice',
    promptHt:
      'Ki konsekans ekonomik prensipal Ordonans 17 avril 1825 Wa Charles X la (150 milyon fran lò) te genyen sou devlopman Leta Ayiti nan 19yèm ak 20yèm syèk?',
    options: [
      'Li fòse Ayiti peye yon "doub dèt endepandans" ki te vide trezò piblik la epi anpeche envestisman nan lekòl, wout ak agrikilti.',
      'Li te bay Ayiti 150 milyon fran kado pou konstwi inivèsite ak lopital.',
      'Li te aboli tout taks sou ekspòtasyon kafe ayisyen an Frans.',
      'Li te mete fen nan divizyon ant Nò ak Sid an 1807.',
    ],
    correctAnswer:
      'Li fòse Ayiti peye yon "doub dèt endepandans" ki te vide trezò piblik la epi anpeche envestisman nan lekòl, wout ak agrikilti.',
    stepByStepExplanationHt:
      'An 1825, anba menas eskad militè Baron de Mackau a, Prezidan Jean-Pierre Boyer aksepte peye 150 milyon fran lò (redui a 90 milyon an 1838) plis enterè labank fransè yo. "Doub dèt" sa a te pran yon gwo pati nan revni ekspòtasyon kafe ak bwa peyi a jiska 1947.',
    examTipHt: 'Fè distenksyon ant Ordonans 1825 (150M fran) ak Trete 1838 la (ki redui montan an a 90M fran epi rekonèt souverènte politik la san kondisyon).',
    points: 10,
    isOfficialPastExamStyle: true,
    examYearReference: 'MENFP — Istwa D Ayiti (Segondè / Filo)',
  },
  {
    id: 'epq-istw-3',
    subjectCode: 'ISTW',
    subjectNameHt: 'Istwa D Ayiti',
    topicId: 'ept-istw-2',
    topicTitleHt: 'Ayiti nan 19yèm ak 20yèm Syèk: Dèt Endepandans ak Okipasyon Ameriken (1915–1934)',
    gradeLevels: ['Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'],
    difficulty: 'Medium',
    questionType: 'short_answer',
    promptHt:
      'Ki lidè mouvman rezistans Cacos yo ki te goumen kont kòve fòse pandan Okipasyon Ameriken an epi ki te tonbe anba bal nan kan li 31 oktòb / 1ye novanm 1919?',
    options: [
      'Charlemagne Péralte',
      'Benoît Batraville',
      'Anténor Firmin',
      'Sténio Vincent',
    ],
    correctAnswer: 'Charlemagne Péralte',
    stepByStepExplanationHt:
      'Charlemagne Péralte (1886–1919), natif natal Ench, te òganize rezistans ame Cacos yo nan Plato Santral ak Nò kont Okipasyon Ameriken an ak sistèm kòve a. Apre asasina li an 1919, Benoît Batraville te kontinye lit la jiska 1920.',
    points: 10,
    isOfficialPastExamStyle: true,
    examYearReference: 'MENFP — Istwa D Ayiti',
  },

  // 3. FRANÇAIS
  {
    id: 'epq-fran-1',
    subjectCode: 'FRAN',
    subjectNameHt: 'Français',
    topicId: 'ept-fran-1',
    topicTitleHt: 'Grammaire Avancée, Concordance des Temps et Analyse Littéraire Haïtienne',
    gradeLevels: ['Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'],
    difficulty: 'Official Exam Level',
    questionType: 'reading_comprehension',
    readingPassageHt:
      'Extrait adapté de « Gouverneurs de la rosée » de Jacques Roumain (1944) : « Manuel s’arrêta au milieu de la savane desséchée. La terre brûlait sous le soleil implacable, mais il savait que l’eau dormait quelque part dans les flancs boisés du morne. Il fallait réconcilier les habitants de Fonds-Rouge par le coumbite pour sauver la vie. »',
    promptHt:
      'D’après cet extrait de Jacques Roumain, quel est le rôle symbolique de l’eau et du « coumbite » dans l’œuvre ?',
    options: [
      'L’eau symbolise la renaissance de la terre et l’espoir, tandis que le coumbite incarne la solidarité collective et la réconciliation fraternelle.',
      'L’eau représente le départ définitif des paysans vers la ville et l’abandon de l’agriculture.',
      'Le coumbite désigne une taxe coloniale imposée aux habitants de Fonds-Rouge.',
      'Manuel refuse d’aider le village et garde la source uniquement pour sa famille.',
    ],
    correctAnswer:
      'L’eau symbolise la renaissance de la terre et l’espoir, tandis que le coumbite incarne la solidarité collective et la réconciliation fraternelle.',
    stepByStepExplanationHt:
      'Dans « Gouverneurs de la rosée » (1944), Jacques Roumain fait de la quête de l’eau le moteur du salut collectif. Le coumbite (konbit) est le symbole de l’unité paysanne indispensable pour vaincre la sécheresse et la division.',
    examTipHt: 'Dans le commentaire composé au Bac, liez toujours les procédés stylistiques (métaphores, champs lexicaux) au message humaniste de l’auteur.',
    points: 15,
    isOfficialPastExamStyle: true,
    examYearReference: 'MENFP — Français & Littérature',
  },
  {
    id: 'epq-fran-2',
    subjectCode: 'FRAN',
    subjectNameHt: 'Français',
    topicId: 'ept-fran-1',
    topicTitleHt: 'Grammaire Avancée, Concordance des Temps et Analyse Littéraire Haïtienne',
    gradeLevels: ['Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'],
    difficulty: 'Medium',
    questionType: 'fill_in_blank',
    promptHt:
      'Complétez avec l’accord correct du participe passé : « Les lettres que les élèves ont _______ (écrire) ont été corrigées par le professeur. »',
    options: ['écrites', 'écrit', 'écrits', 'écrite'],
    correctAnswer: 'écrites',
    stepByStepExplanationHt:
      'Le participe passé employé avec l’auxiliaire « avoir » s’accorde en genre et en nombre avec le complément d’objet direct (COD) « que » (mis pour « les lettres », féminin pluriel) puisqu’il est placé avant le verbe : « écrites ».',
    points: 10,
    isOfficialPastExamStyle: true,
    examYearReference: 'MENFP 9yèm AF & Segondè',
  },

  // 4. KREYÒL AYISYEN
  {
    id: 'epq-krey-1',
    subjectCode: 'KREY',
    subjectNameHt: 'Kreyòl Ayisyen',
    topicId: 'ept-krey-1',
    topicTitleHt: 'Òtograf Ofisyèl AKA, Sintaks, Pwovèb ak Analiz Tèks Kreyòl',
    gradeLevels: ['Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'],
    difficulty: 'Official Exam Level',
    questionType: 'multiple_choice',
    promptHt:
      'Chwazi fraz ki ekri korekteman dapre règ òtograf ofisyèl Akademi Kreyòl Ayisyen (AKA) pou detèminan defini ak pwonon posesif yo :',
    options: [
      'Elèv yo pran liv yo a epi yo mete l sou tab la.',
      'Elèv-yo pran liv-yo-a epi yo mete-l sou tab-la.',
      'Élèv yo pran liv yo a épi yo mété l sou tab la.',
      'Elev yo pran liv yo a epi yo mete l sou tab-la.',
    ],
    correctAnswer: 'Elèv yo pran liv yo a epi yo mete l sou tab la.',
    stepByStepExplanationHt:
      'Nan òtograf ofisyèl kreyòl ayisyen an, nou pa mete tirè (-) devan detèminan defini singilye oswa pliryèl ("tab la", "elèv yo") ni devan pwonon fòm kout ("mete l"). Anplis, son [e] ekri "e" san aksan ("epi", "mete") pandan son [ɛ] ekri "è" ("elèv").',
    examTipHt: 'Sonje règ detèminan defini a: "la" apre konsòn oral, "a" apre vwayèl oral, "an" apre vwayèl nazal, "nan / lan" apre konsòn nazal.',
    points: 10,
    isOfficialPastExamStyle: true,
    examYearReference: 'MENFP — Kreyòl Ayisyen',
  },

  // 5. ENGLISH
  {
    id: 'epq-engl-1',
    subjectCode: 'ENGL',
    subjectNameHt: 'English',
    topicId: 'ept-engl-1',
    topicTitleHt: 'Reading Comprehension, Conditional Tenses & Academic Writing',
    gradeLevels: ['Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'],
    difficulty: 'Official Exam Level',
    questionType: 'multiple_choice',
    promptHt:
      'Choose the correct verb form to complete the third conditional sentence: "If the students _______ harder for the state examination, they would have achieved a higher score."',
    options: ['had studied', 'studied', 'have studied', 'would study'],
    correctAnswer: 'had studied',
    stepByStepExplanationHt:
      'In English grammar, the Third Conditional (past unreal conditional) follows the structure: If + Past Perfect (had + past participle), ... would have + past participle. Therefore, "had studied" is correct.',
    examTipHt: 'Always match the tense in the "If" clause with the main clause: Type 1 (Present → will), Type 2 (Past Simple → would), Type 3 (Past Perfect → would have).',
    points: 10,
    isOfficialPastExamStyle: true,
    examYearReference: 'MENFP — Anglais',
  },

  // 6. SYANS NATIRÈL
  {
    id: 'epq-scin-1',
    subjectCode: 'SCIN',
    subjectNameHt: 'Syans Natirèl',
    topicId: 'ept-scin-1',
    topicTitleHt: 'Biyoloji Selilè, Jenetik, Chimi ak Mekanik Fizik',
    gradeLevels: ['Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'],
    difficulty: 'Official Exam Level',
    questionType: 'problem_solving',
    promptHt:
      'Yon rezistans elektrik R = 20 Ω branche sou yon dèlko ki bay yon tansyon U = 12 V. Dapre Lwa Ohm (U = R × I), ki valè entansite kouran elektrik I ki travèse rezistans lan, epi ki pwisans elektrik P = U × I li konsome?',
    options: [
      'I = 0,6 A ak P = 7,2 W',
      'I = 1,67 A ak P = 20 W',
      'I = 240 A ak P = 2880 W',
      'I = 0,6 A ak P = 20 W',
    ],
    correctAnswer: 'I = 0,6 A ak P = 7,2 W',
    stepByStepExplanationHt:
      'Etap 1: Dapre Lwa Ohm, U = R × I → I = U / R = 12 V / 20 Ω = 0,6 A. Etap 2: Pwisans elektrik P = U × I = 12 V × 0,6 A = 7,2 W (oswa P = R × I² = 20 × 0,36 = 7,2 W).',
    examTipHt: 'Toujou presize inite Sistèm Entènasyonal (SI) yo nan repons final ou: Volt (V), Ohm (Ω), Ampè (A), Watt (W).',
    points: 15,
    isOfficialPastExamStyle: true,
    examYearReference: 'MENFP — Syans Fizik & Natirèl',
  },
  {
    id: 'epq-scin-2',
    subjectCode: 'SCIN',
    subjectNameHt: 'Syans Natirèl',
    topicId: 'ept-scin-1',
    topicTitleHt: 'Biyoloji Selilè, Jenetik, Chimi ak Mekanik Fizik',
    gradeLevels: ['Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'],
    difficulty: 'Medium',
    questionType: 'true_false',
    promptHt:
      'Vrè oswa Fo : Mitokondri a se òganit selilè ki responsab respirasyon selilè ak pwodiksyon enèji sou fòm ATP nan selil ekaryòt yo.',
    options: ['Vrè (True)', 'Fo (False)'],
    correctAnswer: 'Vrè (True)',
    stepByStepExplanationHt:
      'Se vrè: Mitokondri a se sant enèjetik selil ekaryòt la kote glikoz ak oksijèn transfòme an ATP pandan respirasyon selilè a, alòske kloroplas la fè fotosentèz nan selil vejetal yo.',
    points: 10,
    isOfficialPastExamStyle: true,
    examYearReference: 'MENFP — Biyoloji / SVT',
  },

  // 7. SYANS SOSYAL
  {
    id: 'epq-scis-1',
    subjectCode: 'SCIS',
    subjectNameHt: 'Syans Sosyal',
    topicId: 'ept-scis-1',
    topicTitleHt: 'Jewografi Fizik, Ekonomik ak Demografik Ayiti (10 Depatman yo)',
    gradeLevels: ['Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'],
    difficulty: 'Official Exam Level',
    questionType: 'multiple_choice',
    promptHt:
      'Ki pi wo somè montay ann Ayiti, nan ki chèn montay li ye, epi ki wotè (altitid) li mezire an mèt?',
    options: [
      'Pik Lasèl (Pic la Selle), nan Masif Lasèl, avèk 2 680 mèt altitid',
      'Pik Makaya (Pic Macaya), nan Masif Lawòt, avèk 2 347 mèt altitid',
      'Mòn Lopital, nan Lwès, avèk 1 850 mèt altitid',
      'Sitadèl Laferyè, nan Chèn dinò, avèk 900 mèt altitid',
    ],
    correctAnswer: 'Pik Lasèl (Pic la Selle), nan Masif Lasèl, avèk 2 680 mèt altitid',
    stepByStepExplanationHt:
      'Pik Lasèl (Pic la Selle) se pi wo somè ann Ayiti (2 680 mèt altitid) ki sitiye nan Masif Lasèl (Sud-Est / Ouest). Dezyèm pi wo somè a se Pik Makaya (2 347 mèt) nan Masif Lawòt.',
    examTipHt: 'Konnen tout 10 depatman jewografik Ayiti yo avèk chèflye yo (egz. Nippes → Miragoâne, Centre → Hinche, Nord-Est → Fort-Liberté).',
    points: 10,
    isOfficialPastExamStyle: true,
    examYearReference: 'MENFP — Jewografi & Syans Sosyal',
  },

  // 8. EDIKASYON SIVIK
  {
    id: 'epq-civi-1',
    subjectCode: 'CIVI',
    subjectNameHt: 'Edikasyon Sivik',
    topicId: 'ept-civi-1',
    topicTitleHt: 'Konstitisyon 1987, Separasyon Pouvwa yo ak Dwa Sitwayen',
    gradeLevels: ['Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'],
    difficulty: 'Official Exam Level',
    questionType: 'written_response',
    promptHt:
      'Dapre Konstitisyon Repiblik Ayiti a (1987), site twa (3) pouvwa Leta yo epi eksplike wòl prensipal chak pouvwa nan fonksyònman demokratik peyi a.',
    options: [
      'Pouvwa Egzekitif (Prezidan ak Premye Minis + Gouvènman ki aplike lwa yo), Pouvwa Lejislatif (Sena ak Chanm Depite ki vote lwa yo epi kontwole gouvènman an), ak Pouvwa Jidisyè (Lakou Kasasyon ak tribinal yo ki rann lajistis).',
      'Pouvwa Militè, Pouvwa Ekonomik ak Pouvwa Medyatik.',
      'Pouvwa Minisipal, Pouvwa Depatmantal ak Pouvwa Kominal sèlman.',
      'Yon sèl pouvwa santralize nan men chèf egzekitif la.',
    ],
    correctAnswer:
      'Pouvwa Egzekitif (Prezidan ak Premye Minis + Gouvènman ki aplike lwa yo), Pouvwa Lejislatif (Sena ak Chanm Depite ki vote lwa yo epi kontwole gouvènman an), ak Pouvwa Jidisyè (Lakou Kasasyon ak tribinal yo ki rann lajistis).',
    stepByStepExplanationHt:
      'Prensip separasyon twa pouvwa yo (Egzekitif, Lejislatif, Jidisyè) garanti balans enstitisyonèl epi anpeche abi pouvwa dapre Konstitisyon 29 mas 1987 la.',
    points: 10,
    isOfficialPastExamStyle: true,
    examYearReference: 'MENFP — Edikasyon Sivik',
  },

  // 9. INFORMATIQUE
  {
    id: 'epq-info-1',
    subjectCode: 'INFO',
    subjectNameHt: 'Informatique',
    topicId: 'ept-info-1',
    topicTitleHt: 'Algoritmik, Bazdone, Sistèm Binè ak Sekirite Rezo',
    gradeLevels: ['Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'],
    difficulty: 'Official Exam Level',
    questionType: 'multiple_choice',
    promptHt:
      'Konvèti nimewo desimal 25 (baz 10) an sistèm binè (baz 2) ke procesè òdinatè a itilize :',
    options: ['11001₂', '10101₂', '11100₂', '10011₂'],
    correctAnswer: '11001₂',
    stepByStepExplanationHt:
      '25 = 16 + 8 + 0 + 0 + 1 = 1×2⁴ + 1×2³ + 0×2² + 0×2¹ + 1×2⁰ = 11001₂.',
    examTipHt: 'Pou verifye konvèsyon binè rapidman, adisyone pwisans 2 yo de dwat a goch: 1, 2, 4, 8, 16, 32, 64, 128.',
    points: 10,
    isOfficialPastExamStyle: true,
    examYearReference: 'MENFP — Informatique',
  },
];

export const INITIAL_EXAM_PREP_TOPICS: ExamPrepTopic[] = [
  {
    id: 'ept-math-1',
    subjectCode: 'MATH',
    subjectNameHt: 'Matematik',
    chapterNumber: 1,
    topicNumber: 1,
    titleHt: 'Ekwasyon, Inekwasyon ak Sistèm Lineyè / Kwadratik',
    titleFr: 'Équations, Inéquations et Systèmes Linéaires / Quadratiques',
    titleEn: 'Linear & Quadratic Equations, Inequalities and Systems',
    targetGrades: ['Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'],
    estimatedMinutes: 45,
    explanationHt: [
      'Nan egzamen ofisyèl MENFP yo (9yèm AF, Rhéto ak Filo), rezolisyon ekwasyon premye ak segond degre reprezante baz aljèb la. Elèv la dwe metrize metòd faktòrizasyon, idantite remakab, ak kalkil diskriminan Δ = b² - 4ac.',
      'Pou yon sistèm de ekwasyon a de enkoni (ax + by = c ; dx + ey = f), elèv la ka itilize metòd sibstitisyon, konbinezon lineyè (eliminasyon), oswa metòd detèminan Cramer.',
      'Pou jeyometri egzamen Leta, Teyorèm Pitagò ak Teyorèm Thalès ansanm ak rapò trigonometrik yo (sin, cos, tan) se sijè ki tonbe chak ane.',
    ],
    keyConceptsHt: [
      'Idantite remakab: (a + b)² = a² + 2ab + b² ; (a - b)² = a² - 2ab + b² ; a² - b² = (a - b)(a + b)',
      'Diskriminan segond degre: Δ = b² - 4ac (si Δ > 0, de rasin reyèl distenk; si Δ = 0, yon rasin doub; si Δ < 0, pa gen rasin nan IR)',
      'Som ak Pwodwi rasin yo: S = x₁ + x₂ = -b/a ak P = x₁·x₂ = c/a',
    ],
    formulasOrRulesHt: [
      { label: 'Fòmil Kwadratik', content: 'x = (-b ± √(b² - 4ac)) / (2a)' },
      { label: 'Teyorèm Pitagò', content: 'BC² = AB² + AC² (nan yon triyang rektang nan A)' },
      { label: 'Detèminan Sistèm 2×2', content: 'D = ae - bd ; x = Dx / D ; y = Dy / D' },
    ],
    examplesHt: [
      {
        title: 'Egzanp Modèl Egzamen Leta : Ekwasyon Segond Degre',
        problem: 'Rezoud nan IR ekwasyon: 2x² - 7x + 3 = 0 epi verifye som ak pwodwi rasin yo.',
        stepByStepSolution: [
          'Idantifye a = 2, b = -7, c = 3.',
          'Kalkile Δ = (-7)² - 4(2)(3) = 49 - 24 = 25 = 5².',
          'Kalkile x₁ = (7 - 5)/4 = 1/2 ak x₂ = (7 + 5)/4 = 3.',
          'Verifikasyon: x₁ + x₂ = 1/2 + 3 = 7/2 = -b/a ; x₁·x₂ = (1/2)(3) = 3/2 = c/a.',
        ],
        finalAnswer: 'S = { 1/2 ; 3 }',
      },
    ],
    commonExamMistakesHt: [
      'Bliye siy mwens devan b lè b li menm deja negatif (egz. -(-7) = +7, pa -7).',
      'Pa chanje siy inegalite a lè w divize oswa miltipliye yon inekwasyon pa yon chif negatif.',
    ],
    quickReviewHt: [
      'Toujou verifye si ekwasyon an ka senplifye anvan w kalkile Δ.',
      'Ekri ansanm solisyon S la klèman nan fen repons ou.',
    ],
    practiceQuestions: INITIAL_EXAM_PREP_QUESTIONS.filter((q) => q.topicId === 'ept-math-1'),
  },
  {
    id: 'ept-math-2',
    subjectCode: 'MATH',
    subjectNameHt: 'Matematik',
    chapterNumber: 2,
    topicNumber: 2,
    titleHt: 'Fonksyon, Derive, Limit ak Estatistik (Segondè / Filo)',
    titleFr: 'Fonctions, Dérivées, Limites et Statistiques (Secondaire / Philo)',
    titleEn: 'Functions, Derivatives, Limits and Statistics',
    targetGrades: ['Grade 10', 'Grade 11', 'Grade 12'],
    estimatedMinutes: 50,
    explanationHt: [
      'Etid yon fonksyon nan nivo Segondè ak Filo mande 5 etap ofisyèl: 1) Domèn definisyon Df, 2) Limit nan bò Df yo ak asimptòt yo, 3) Kalkil derive f’(x), 4) Siy f’(x) ak tablo varyasyon, 5) Trase koub Cf la.',
      'Nan estatistik ak pwobabilite, elèv la dwe konnen kijan pou kalkile mwayèn aritmetik (x̄), varyans V(X), ekartip σ(X), ak pwobabilite kondisyonèl.',
    ],
    keyConceptsHt: [
      'Derive yon polinòm: (xⁿ)’ = n·xⁿ⁻¹',
      'Derive yon pwodwi: (u·v)’ = u’v + uv’ ; Derive yon kosyan: (u/v)’ = (u’v - uv’)/v²',
      'Ekwasyon tanjant nan pwen x₀: y = f’(x₀)(x - x₀) + f(x₀)',
    ],
    formulasOrRulesHt: [
      { label: 'Derive ln ak exp', content: '(ln x)’ = 1/x (x > 0) ; (eˣ)’ = eˣ' },
      { label: 'Mwayèn Estatistik', content: 'x̄ = (∑ nᵢ·xᵢ) / N' },
    ],
    examplesHt: [
      {
        title: 'Etid Varyasyon yon Fonksyon Kibik',
        problem: 'Jwenn ekstremòm lokal fonksyon f(x) = x³ - 3x + 2 sou IR.',
        stepByStepSolution: [
          'Kalkile f’(x) = 3x² - 3 = 3(x² - 1) = 3(x - 1)(x + 1).',
          'f’(x) = 0 pou x = -1 ak x = 1.',
          'f(-1) = (-1)³ - 3(-1) + 2 = 4 (Maksimòm lokal) ; f(1) = 1 - 3 + 2 = 0 (Minimòm lokal).',
        ],
        finalAnswer: 'Maksimòm (-1, 4) ; Minimòm (1, 0)',
      },
    ],
    commonExamMistakesHt: [
      'Konfonn(u/v)’ avèk u’/v’ — toujou aplike fòmil (u’v - uv’)/v² la.',
    ],
    quickReviewHt: [
      'Lè f’(x) > 0 sou yon entèval, fonksyon f la strikteman kwasant sou entèval sa a.',
    ],
    practiceQuestions: INITIAL_EXAM_PREP_QUESTIONS.filter((q) => q.topicId === 'ept-math-2'),
  },
  {
    id: 'ept-istw-1',
    subjectCode: 'ISTW',
    subjectNameHt: 'Istwa D Ayiti',
    chapterNumber: 1,
    topicNumber: 1,
    titleHt: 'Revolisyon Ayisyen an (1791–1804) ak Fondasyon Leta Ayisyen',
    titleFr: 'La Révolution Haïtienne (1791–1804) et la Fondation de l’État Haïtien',
    titleEn: 'The Haitian Revolution (1791–1804) and Founding of the Haitian State',
    targetGrades: ['Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'],
    estimatedMinutes: 50,
    explanationHt: [
      'Revolisyon Ayisyen an (1791–1804) se sèl revòlt esklav nan istwa limanite ki rive aboli esklavaj epi fonde yon Leta endepandan. Li sòti nan kontradiksyon sistèm kolonyal Saint-Domingue la, rezistans mawonaj la (Mackandal, Padrejean), ak soulèvman jeneral Out 1791 lan.',
      'Soti nan Bwa Kayiman (14 out 1791) rive nan Abolisyon Esklavaj (29 out 1793 pa Sonthonax / 4 fevriye 1794 pa Konvansyon Nasyonal la), lidèchip Toussaint Louverture konsolide otonomi zile a avèk Konstitisyon Jiyè 1801 an.',
      'Apre ekspedisyon Leclerc la (1802) ak arestasyon Toussaint (7 jen 1802), inite ant ansyen nouvo lib ak ansyen lib nan Kongrè Akayè (18 me 1803) anba Jean-Jacques Dessalines ak Alexandre Pétion mennen nan viktwa Krèt-a-Pyewò, Vètyè (18 novanm 1803) ak Pwoklamasyon Endepandans lan (1ye janvye 1804 nan Gonayiv).',
    ],
    keyConceptsHt: [
      'Mawonaj ak Rezistans: lit kont sistèm plantasyon kolonyal Saint-Domingue la',
      'Konstitisyon 1801: abolisyon esklavaj pou tout tan ak otonomi politik',
      'Kongrè Akayè (18 me 1803): kreyasyon drapo ble ak wouj la epi inifikasyon Lame Endijèn nan',
      'Batay Vètyè (18 novanm 1803) ak Ak Endepandans (1ye janvye 1804, redije pa Louis Félix Boisrond-Tonnerre)',
    ],
    formulasOrRulesHt: [
      { label: '14–22 Out 1791', content: 'Seremoni Bwa Kayiman ak kòmansman soulèvman jeneral esklav yo nan Nò' },
      { label: '29 Out 1793 / 4 Fev. 1794', content: 'Pwoklamasyon abolisyon esklavaj nan Nò epi ratifikasyon pa Konvansyon an' },
      { label: '18 Me 1803', content: 'Kongrè Akayè — Unifikasyon sou otorite Jean-Jacques Dessalines' },
      { label: '18 Novanm 1803', content: 'Viktwa desizif Batay Vètyè (Capois-La-Mort, Dessalines)' },
      { label: '1ye Janvye 1804', content: 'Pwoklamasyon Endepandans Ayiti nan Gonayiv' },
    ],
    examplesHt: [
      {
        title: 'Metòd Disertasyon Istorik pou Egzamen Leta / Filo',
        problem:
          'Sijè Egzamen Leta: « Montre kijan alyans Kongrè Akayè an me 1803 te desizif pou viktwa 1804 la. »',
        stepByStepSolution: [
          'Entwodiksyon: Rappel kontèks ekspedisyon Leclerc (fevriye 1802) ak volonte Napoléon Bonaparte pou retabli esklavaj.',
          'Devlopman 1: Konsyantizasyon jeneral endijèn yo (Dessalines, Pétion, Christophe, Clervaux) nan oktòb 1802.',
          'Devlopman 2: Kongrè Akayè (18 me 1803) ki ini fòs Nò, Lwès ak Sid anba yon sèl kòmandman ak yon sèl drapo.',
          'Konklizyon: Viktwa Vètyè (18 novanm 1803) ak nesans premye Repiblik nwa lib nan mond lan (1ye janvye 1804).',
        ],
        finalAnswer: 'Plan an 3 pati (Kontèks, Inifikasyon militè/politik, Viktwa final) respekte barèm MENFP la.',
      },
    ],
    commonExamMistakesHt: [
      'Konfonn dat Kongrè Akayè (18 me 1803) avèk Batay Vètyè (18 novanm 1803).',
      'Bliye site Louis Félix Boisrond-Tonnerre kòm sekretè ki te redije Ak Endepandans 1ye janvye 1804 la.',
    ],
    quickReviewHt: [
      '14 out 1791 (Bwa Kayiman) → 1801 (Konstitisyon Toussaint) → 18 me 1803 (Akayè) → 18 nov. 1803 (Vètyè) → 1ye janvye 1804 (Gonayiv).',
    ],
    practiceQuestions: INITIAL_EXAM_PREP_QUESTIONS.filter((q) => q.topicId === 'ept-istw-1'),
  },
  {
    id: 'ept-istw-2',
    subjectCode: 'ISTW',
    subjectNameHt: 'Istwa D Ayiti',
    chapterNumber: 2,
    topicNumber: 2,
    titleHt: 'Ayiti nan 19yèm ak 20yèm Syèk: Dèt Endepandans ak Okipasyon Ameriken (1915–1934)',
    titleFr: 'Haïti aux XIXe et XXe Siècles : Dette de l’Indépendance et Occupation Américaine',
    titleEn: 'Haitian History in the 19th & 20th Centuries: Independence Debt & US Occupation',
    targetGrades: ['Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'],
    estimatedMinutes: 45,
    explanationHt: [
      'Apre 1804, jèn nasyon ayisyen an fè fas ak blokis diplomatik entènasyonal, divizyon politik (Leta Nò Henri Christophe vs Repiblik Lwès/Sid Alexandre Pétion ant 1807 ak 1820), ak Ordonans 17 avril 1825 Wa Charles X la ki enpoze yon dèt 150 milyon fran lò.',
      'Nan 20yèm syèk la, enstabilite politik ak enterè jeo-estratejik nan Karayib la mennen nan Okipasyon Ameriken an (28 jiyè 1915 – 15 out 1934). Okipasyon an santralize lameri ak lajan peyi a, men li pwovoke rezistans ame Cacos yo anba Charlemagne Péralte ak Benoît Batraville, ansanm ak mouvman Endijenis kiltirèl la (Jean Price-Mars, « Ainsi parla l’Oncle », 1928) ak Dezyèm Endepandans lan sou Sténio Vincent an 1934.',
    ],
    keyConceptsHt: [
      ' Kontwòl Tè ak Verifikasyon Tit (1804–1806) sou Jean-Jacques Dessalines',
      'Ordonans 1825 (150 milyon fran) ak Trete 1838 (90 milyon fran) sou Jean-Pierre Boyer',
      'Okipasyon Ameriken (1915–1934), rezistans Charlemagne Péralte (1919) ak Machann Dlo / Grèv Damyen (1929)',
    ],
    formulasOrRulesHt: [
      { label: '17 Oktòb 1806', content: 'Asasina Anperè Jean-Jacques Dessalines nan Pon Wouj' },
      { label: '17 Avril 1825', content: 'Ordonans Charles X — Dèt Endepandans 150 milyon fran' },
      { label: '28 Jiyè 1915 – 15 Out 1934', content: 'Peryòd Okipasyon Militè Ameriken ann Ayiti' },
    ],
    examplesHt: [
      {
        title: 'Analiz Dokiman Istorik : Konsekans Okipasyon 1915–1934',
        problem: 'Ki chanjman enstitisyonèl ak ki fòm rezistans ki te make peryòd 1915–1934 la?',
        stepByStepSolution: [
          'Chanjman enstitisyonèl: Kreyasyon Jandarmeri Ayiti (Garde d’Haïti), santralizasyon Pòtoprens, Konstitisyon 1918.',
          'Rezistans ame: Mouvman Cacos nan Plato Santral ak Nò dirije pa Charlemagne Péralte (1918–1919) ak Benoît Batraville (1920).',
          'Rezistans entèlektyèl ak etidyan: Lig Patriyotik, mouvman Endijenis (Jean Price-Mars), Grèv Damyen ak Evènman Machatè (1929).',
        ],
        finalAnswer: 'Dezokipasyon ofisyèl la fèt nan mwa out 1934 sou prezidans Sténio Vincent.',
      },
    ],
    commonExamMistakesHt: [
      'Pa melanje dat kòmansman (28 jiyè 1915) ak dat finisman (out 1934) Okipasyon Ameriken an.',
    ],
    quickReviewHt: [
      'Retni twa dimansyon rezistans kont Okipasyon an: militè (Cacos/Péralte), kiltirèl (Price-Mars/Endijenis), ak sivik/etidyan (Grèv Damyen 1929).',
    ],
    practiceQuestions: INITIAL_EXAM_PREP_QUESTIONS.filter((q) => q.topicId === 'ept-istw-2'),
  },
  {
    id: 'ept-fran-1',
    subjectCode: 'FRAN',
    subjectNameHt: 'Français',
    chapterNumber: 1,
    topicNumber: 1,
    titleHt: 'Grammaire Avancée, Concordance des Temps et Analyse Littéraire Haïtienne',
    titleFr: 'Grammaire Avancée, Concordance des Temps et Analyse Littéraire Haïtienne',
    titleEn: 'Advanced French Grammar & Haitian Literary Analysis',
    targetGrades: ['Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'],
    estimatedMinutes: 45,
    explanationHt: [
      'Egzamen ofisyèl Français MENFP la evalye ni metriz lang lan (akò patisip pase, diskou dirèk/endirèk, subjonctif, figi estil) ni konesans gwo kouran literè ayisyen yo (La Ronde, Endijenis, Spiralis) ak zèv klasik tankou « Gouverneurs de la rosée » (Jacques Roumain), « Compère Général Soleil » (Jacques Stephen Alexis), ak « Zoune chez sa ninnaine » (Justin Lhérisson).',
    ],
    keyConceptsHt: [
      'Accord du participe passé avec être, avoir et les verbes pronominaux',
      'Figures de style : métaphore, comparaison, personnification, hyperbole, antithèse, chiasme',
      'Méthodologie de la dissertation littéraire : Introduction (amorce, problématique, plan), Développement (thèse, antithèse, synthèse), Conclusion',
    ],
    formulasOrRulesHt: [
      {
        label: 'Règlement du Participe Passé (Avoir)',
        content: 'Accord avec le COD uniquement si celui-ci est placé AVANT le verbe.',
      },
      {
        label: 'Mouvement Indigéniste (1927–1928)',
        content: 'La Revue Indigène (Normil Sylvain, Jacques Roumain, Carl Brouard, Émile Roumer) & Jean Price-Mars.',
      },
    ],
    examplesHt: [
      {
        title: 'Analiz Figi Estil ak Gramè',
        problem: 'Idantifye figi estil la nan fraz: « La terre brûlait de soif sous le soleil. »',
        stepByStepSolution: [
          'Yo bay latè yon karakteristik imen oswa vivan (« avoir soif »).',
          'Se yon pèsonifikasyon (personnification) ki ranfòse pa yon ipèbòl (« brûlait »).',
        ],
        finalAnswer: 'Personnification et hyperbole.',
      },
    ],
    commonExamMistakesHt: [
      'Fè akò patisip pase a avèk sijè a lè oksilyè a se « avoir ».',
    ],
    quickReviewHt: [
      'Toujou idantifye COD la avèk kesyon « qui ? » oswa « quoi ? » apre vèb la.',
    ],
    practiceQuestions: INITIAL_EXAM_PREP_QUESTIONS.filter((q) => q.topicId === 'ept-fran-1'),
  },
  {
    id: 'ept-krey-1',
    subjectCode: 'KREY',
    subjectNameHt: 'Kreyòl Ayisyen',
    chapterNumber: 1,
    topicNumber: 1,
    titleHt: 'Òtograf Ofisyèl AKA, Sintaks, Pwovèb ak Analiz Tèks Kreyòl',
    titleFr: 'Orthographe Officielle AKA, Syntaxe, Proverbes et Analyse de Texte',
    titleEn: 'Official Haitian Creole Orthography, Syntax & Text Analysis',
    targetGrades: ['Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'],
    estimatedMinutes: 40,
    explanationHt: [
      'Nan egzamen ofisyèl Kreyòl Ayisyen, elèv la dwe metrize règ òtograf ofisyèl 1979 la ak rezolisyon Akademi Kreyòl Ayisyen (AKA) yo, fonksyon makè tan ak aspè yo (ap, te, pral, t ap, ta), ansanm ak analiz pwovèb ak tèks literè (tankou « Dezafi » Frankétienne oswa « Cric ? Crac ! » Georges Sylvain).',
    ],
    keyConceptsHt: [
      'Sistèm 5 fòm detèminan defini singilye a: la, a, an, nan, lan',
      'Makè predikatif tan/aspè/mòd: te (pase), ap (pwogresif/fiti), pral (fiti pwòch), ta (kondisyonèl)',
      'Siyifikasyon sosyal ak filozofik pwovèb kreyòl yo',
    ],
    formulasOrRulesHt: [
      { label: 'Detèminan Defini', content: 'tab la / chèz la ; pye a / dlo a ; ban an / pon an ; machin nan / chanm lan' },
      { label: 'Pwonon fòm kout', content: 'm, w, l, n, yo (san apòstròf ni tirè nan òtograf ofisyèl la)' },
    ],
    examplesHt: [
      {
        title: 'Koreksyon Òtograf Ofisyèl',
        problem: 'Ekri fraz sa a nan òtograf ofisyèl: « Timoun-yo t’ap li liv-la nan lakou-a. »',
        stepByStepSolution: [
          'Retire tirè devan detèminan yo: "Timoun yo", "liv la", "lakou a".',
          'Retire apòstròf nan makè "t ap": "Timoun yo t ap li liv la nan lakou a."',
        ],
        finalAnswer: 'Timoun yo t ap li liv la nan lakou a.',
      },
    ],
    commonExamMistakesHt: [
      'Mete tirè oswa apòstròf sou modèl fransè a nan tèks kreyòl.',
    ],
    quickReviewHt: [
      'Chak lèt oswa digraf an kreyòl koresponn ak yon sèl son e chak son toujou ekri menm jan.',
    ],
    practiceQuestions: INITIAL_EXAM_PREP_QUESTIONS.filter((q) => q.topicId === 'ept-krey-1'),
  },
  {
    id: 'ept-engl-1',
    subjectCode: 'ENGL',
    subjectNameHt: 'English',
    chapterNumber: 1,
    topicNumber: 1,
    titleHt: 'Reading Comprehension, Conditional Tenses & Academic Writing',
    titleFr: 'Compréhension Écrite, Conditionnel et Rédaction Anglaise',
    titleEn: 'Reading Comprehension, Conditional Tenses & Academic Writing',
    targetGrades: ['Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'],
    estimatedMinutes: 40,
    explanationHt: [
      'Egzamen Leta English la gen ladan l yon tèks konpreyansyon (Reading Comprehension), egzèsis gramè (Verb Tenses, Passive Voice, Reported Speech, Conditionals, Relative Pronouns), vokabilè (Synonyms/Antonyms), ak yon redaksyon kout an anglè.',
    ],
    keyConceptsHt: [
      'Zero, First, Second, and Third Conditionals',
      'Active vs. Passive Voice transformations',
      'Direct vs. Indirect (Reported) Speech',
    ],
    formulasOrRulesHt: [
      { label: '1st Conditional', content: 'If + Simple Present, ... will + base verb' },
      { label: '2nd Conditional', content: 'If + Simple Past, ... would + base verb' },
      { label: '3rd Conditional', content: 'If + Past Perfect (had + V3), ... would have + V3' },
    ],
    examplesHt: [
      {
        title: 'Passive Voice Transformation',
        problem: 'Change to Passive Voice: "The Ministry published the official exam results."',
        stepByStepSolution: [
          'Identify object: "the official exam results" (plural) and tense: Simple Past ("published").',
          'Use "were + past participle": "The official exam results were published by the Ministry."',
        ],
        finalAnswer: 'The official exam results were published by the Ministry.',
      },
    ],
    commonExamMistakesHt: [
      'Using "would" inside the "If-clause" (e.g., "If I would study" instead of "If I studied").',
    ],
    quickReviewHt: [
      'Read the comprehension questions first before scanning the English passage for key evidence.',
    ],
    practiceQuestions: INITIAL_EXAM_PREP_QUESTIONS.filter((q) => q.topicId === 'ept-engl-1'),
  },
  {
    id: 'ept-scin-1',
    subjectCode: 'SCIN',
    subjectNameHt: 'Syans Natirèl',
    chapterNumber: 1,
    topicNumber: 1,
    titleHt: 'Biyoloji Selilè, Jenetik, Chimi ak Mekanik Fizik',
    titleFr: 'Biologie Cellulaire, Génétique, Chimie et Mécanique Physique',
    titleEn: 'Cell Biology, Genetics, Chemistry and Physics',
    targetGrades: ['Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'],
    estimatedMinutes: 50,
    explanationHt: [
      'Nan Syans Natirèl (Biyoloji/SVT, Fizik ak Chimi), elèv la dwe konprann fonksyònman selil la, lwa jenetik Mendel yo, ekilibrasyon ekwasyon chimik ak kalkil mòl, ansanm ak lwa elektrik (Lwa Ohm, Efè Joule) ak mekanik Newton yo.',
    ],
    keyConceptsHt: [
      'Selil ekaryòt vs pwokaryòt; mitoz (2 selil idantik 2n) vs meyoz (4 gamèt n)',
      'Lwa Ohm: U = R × I ; Pwisans elektrik: P = U × I ; Enèji elektrik: E = P × t',
      'Konsèvasyon mas Lavoisier ak kalkil konsantrasyon molè C = n / V',
    ],
    formulasOrRulesHt: [
      { label: 'Lwa Ohm & Pwisans', content: 'U = R · I  |  P = U · I = R · I²' },
      { label: 'Kantite Matyè (Mòl)', content: 'n = m / M  (m: mas an gram, M: mas molè an g/mol)' },
    ],
    examplesHt: [
      {
        title: 'Kalkil Sikwi Elektrik nan Egzamen Leta',
        problem: 'Kalkile kouran I ak pwisans P pou yon rezistans 20 Ω sou 12 V.',
        stepByStepSolution: [
          'I = U / R = 12 / 20 = 0,6 A.',
          'P = U × I = 12 × 0,6 = 7,2 W.',
        ],
        finalAnswer: 'I = 0,6 A ; P = 7,2 W',
      },
    ],
    commonExamMistakesHt: [
      'Bliye konvèti milianpè (mA) an anpè (A) oswa minit an segonn nan kalkil enèji E = P × t.',
    ],
    quickReviewHt: [
      'Toujou tcheke si inite yo nan Sistèm Entènasyonal (SI) anvan w fè kalkil fizik oswa chimi.',
    ],
    practiceQuestions: INITIAL_EXAM_PREP_QUESTIONS.filter((q) => q.topicId === 'ept-scin-1'),
  },
  {
    id: 'ept-scis-1',
    subjectCode: 'SCIS',
    subjectNameHt: 'Syans Sosyal',
    chapterNumber: 1,
    topicNumber: 1,
    titleHt: 'Jewografi Fizik, Ekonomik ak Demografik Ayiti (10 Depatman yo)',
    titleFr: 'Géographie Physique, Économique et Démographique d’Haïti',
    titleEn: 'Physical, Economic & Demographic Geography of Haiti',
    targetGrades: ['Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'],
    estimatedMinutes: 40,
    explanationHt: [
      'Syans Sosyal ak Jewografi nan egzamen Leta kouvri teritwa 27 750 km² Repiblik Ayiti a: 10 depatman jewografik yo ak chèflye yo, chèn montay yo (Masif dinò, Montay Nwa, Chèn Mate, Masif Lasèl, Masif Lawòt), plenn agrikòl yo (Latibonit, Kildesak, Nò, Kay), ak basen vèsan yo.',
    ],
    keyConceptsHt: [
      '10 Depatman ak Chèflye yo: Lwès (Pòtoprens), Nò (Okap), Nòdès (Fòlibète), Nòdwès (Pòdepè), Latibonit (Gonayiv), Sant (Ench), Sid (Okay), Sidès (Jakmèl), Grandans (Jeremi), Nip (Miragwàn)',
      'Pi long flèv ann Ayiti: Flèv Latibonit (~320 km)',
      'Pi wo somè: Pik Lasèl (2 680 m) ak Pik Makaya (2 347 m)',
    ],
    formulasOrRulesHt: [
      { label: 'Sipèfisi Ayiti', content: '27 750 km² (tyè lwès zile Ayiti / Quisqueya)' },
      { label: 'Densite Popilasyon', content: 'D = Popilasyon Total / Sipèfisi (abitan / km²)' },
    ],
    examplesHt: [
      {
        title: 'Idantifikasyon Relyèf ak Plenn Ayiti',
        problem: 'Asosye chak somè ak chèn montay li: 1) Pik Lasèl, 2) Pik Makaya.',
        stepByStepSolution: [
          'Pik Lasèl (2 680 m) sitiye nan Masif Lasèl.',
          'Pik Makaya (2 347 m) sitiye nan Masif Lawòt (penensil Sid la).',
        ],
        finalAnswer: 'Pik Lasèl → Masif Lasèl ; Pik Makaya → Masif Lawòt.',
      },
    ],
    commonExamMistakesHt: [
      'Konfonn chèflye depatman Nip (Miragwàn) ak Grandans (Jeremi).',
    ],
    quickReviewHt: [
      'Revize kat 10 depatman yo, zile adjasan yo (Lagonav, Latòti, Ilavach, Kayimit, Navaz) ak lak yo (Lak Azwèy / Etang Saumâtre, Etang Miragwàn).',
    ],
    practiceQuestions: INITIAL_EXAM_PREP_QUESTIONS.filter((q) => q.topicId === 'ept-scis-1'),
  },
  {
    id: 'ept-civi-1',
    subjectCode: 'CIVI',
    subjectNameHt: 'Edikasyon Sivik',
    chapterNumber: 1,
    topicNumber: 1,
    titleHt: 'Konstitisyon 1987, Separasyon Pouvwa yo ak Dwa Sitwayen',
    titleFr: 'Constitution de 1987, Séparation des Pouvoirs et Droits Civiques',
    titleEn: '1987 Constitution, Separation of Powers & Civic Rights',
    targetGrades: ['Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'],
    estimatedMinutes: 35,
    explanationHt: [
      'Edikasyon Sivik prepare elèv la pou konprann òganizasyon Leta ayisyen an dapre Konstitisyon 1987 la: twa pouvwa yo (Egzekitif, Lejislatif, Jidisyè), kolektivite teritoryal yo ( Seksyon Kominal, Komin, Depatman), ak dwa fondamantal sitwayen yo.',
    ],
    keyConceptsHt: [
      'Separasyon 3 pouvwa Leta yo: Egzekitif, Lejislatif, Jidisyè',
      'Kolektivite teritoryal: CASEC / ASEC (Seksyon Kominal), Mèri / Konsèy Minisipal (Komin), Konsèy Depatmantal',
      'Enstitisyon endepandan: CSC/CA (Kou Sipperyè dè Kont), OPC (Pwoteksyon Sitwayen), CEP',
    ],
    formulasOrRulesHt: [
      { label: 'Deviz Nasyonal', content: 'Libète — Egalite — Fratènite (Konstitisyon 1987, Atik 4)' },
      { label: 'Majorite Sivik', content: '18 an akonpli pou dwa vòt ak responsabilite sivik konplè' },
    ],
    examplesHt: [
      {
        title: 'Wòl Kolektivite Teritoryal yo',
        problem: 'Ki pi piti antite administratif teritoryal nan Repiblik Ayiti?',
        stepByStepSolution: [
          'Dapre Konstitisyon 1987 la, Seksyon Kominal la se pi piti antite teritoryal administratif peyi a.',
          'Li administre pa yon Konsèy Administrasyon Seksyon Kominal (CASEC) ak Asanble Seksyon Kominal (ASEC).',
        ],
        finalAnswer: 'Seksyon Kominal la (dirije pa CASEC ak ASEC).',
      },
    ],
    commonExamMistakesHt: [
      'Konfonn wòl CASEC (administrasyon egzekitif seksyon kominal la) avèk ASEC (asanble deliberatif la).',
    ],
    quickReviewHt: [
      'Konnen diferans ant Pouvwa Lejislatif (vote lwa) ak Pouvwa Jidisyè (aplike lwa nan tribinal).',
    ],
    practiceQuestions: INITIAL_EXAM_PREP_QUESTIONS.filter((q) => q.topicId === 'ept-civi-1'),
  },
  {
    id: 'ept-info-1',
    subjectCode: 'INFO',
    subjectNameHt: 'Informatique',
    chapterNumber: 1,
    topicNumber: 1,
    titleHt: 'Algoritmik, Bazdone, Sistèm Binè ak Sekirite Rezo',
    titleFr: 'Algorithmique, Bases de Données, Système Binaire et Réseaux',
    titleEn: 'Algorithms, Databases, Binary System & Network Security',
    targetGrades: ['Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'],
    estimatedMinutes: 35,
    explanationHt: [
      'Informatique nan egzamen Leta evalye konpreyansyon achitekti òdinatè (CPU, RAM, ROM, SSD), konvèsyon ant baz desimal ak baz binè, lojik algoritmik (kondisyon SI/SINON, bouk POU/TANK), ak sekirite sou rezo entènèt.',
    ],
    keyConceptsHt: [
      'CPU (Unité Centrale de Traitement), RAM (memwa viv volay) vs ROM (memwa mòt)',
      'Sistèm binè (baz 2: 0 ak 1) ak octets (1 Octet / Byte = 8 bits)',
      'Algoritmik: varyab, kondisyon (if/else), ak bouk repetitif',
    ],
    formulasOrRulesHt: [
      { label: 'Inite Memwa', content: '1 Octet (Byte) = 8 bits ; 1 Ko = 1024 octets' },
      { label: 'Pwisans 2 (Binè)', content: '2⁰=1, 2¹=2, 2²=4, 2³=8, 2⁴=16, 2⁵=32, 2⁶=64, 2⁷=128' },
    ],
    examplesHt: [
      {
        title: 'Konvèsyon Desimal → Binè',
        problem: 'Ekri chif 25 nan baz 2.',
        stepByStepSolution: [
          'Dekonpoze 25 an som pwisans 2: 25 = 16 + 8 + 1.',
          'Mete 1 pou pwisans ki prezan yo (16, 8, 1) ak 0 pou sa ki absan yo (4, 2): 11001₂.',
        ],
        finalAnswer: '11001₂',
      },
    ],
    commonExamMistakesHt: [
      'Li rès divizyon binè yo nan sans anwo-anba olye anba-anwo.',
    ],
    quickReviewHt: [
      'Chif pè nan baz 10 toujou fini pa 0 nan baz 2; chif enpè toujou fini pa 1 nan baz 2.',
    ],
    practiceQuestions: INITIAL_EXAM_PREP_QUESTIONS.filter((q) => q.topicId === 'ept-info-1'),
  },
];

export const INITIAL_EXAM_PREP_MOCK_EXAMS: ExamPrepMockExam[] = [
  {
    id: 'mock-full-official',
    titleHt: 'Similasyon Egzamen Leta Ofisyèl Konplè (Tout 9 Matyè yo)',
    titleFr: 'Simulation Complète de l’Examen d’État Officiel (9 Matières)',
    titleEn: 'Full Official State Examination Simulation (All 9 Subjects)',
    programId: 'prog-philo',
    targetGrades: ['Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'],
    subjectCode: 'MULTI',
    subjectNameHt: 'Multi-Matyè (9 Matyè Ofisyèl)',
    durationMinutes: 60,
    totalPoints: 100,
    passingScorePercent: 65,
    isFullSimulation: true,
    instructionsHt:
      'Similasyon ofisyèl kronometre ki kouvri Matematik, Istwa D Ayiti, Français, Kreyòl Ayisyen, English, Syans Natirèl, Syans Sosyal, Edikasyon Sivik ak Informatique. Reponn chak kesyon anvan kronomèt la rive nan zewo.',
    questions: INITIAL_EXAM_PREP_QUESTIONS,
  },
  {
    id: 'mock-istw-official',
    titleHt: 'Mock Exam Ofisyèl — Istwa D Ayiti (1492–21yèm Syèk)',
    titleFr: 'Examen Blanc Officiel — Histoire d’Haïti',
    titleEn: 'Official Mock Exam — History of Haiti',
    programId: 'prog-philo',
    targetGrades: ['Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'],
    subjectCode: 'ISTW',
    subjectNameHt: 'Istwa D Ayiti',
    durationMinutes: 30,
    totalPoints: 35,
    passingScorePercent: 65,
    isFullSimulation: false,
    instructionsHt:
      'Egzamen blan espesyalize sou Istwa D Ayiti: Revolisyon Ayisyen an (1791–1804), Dèt Endepandans lan (1825), ak Okipasyon Ameriken an (1915–1934).',
    questions: INITIAL_EXAM_PREP_QUESTIONS.filter((q) => q.subjectCode === 'ISTW'),
  },
  {
    id: 'mock-math-official',
    titleHt: 'Mock Exam Ofisyèl — Matematik (Aljèb, Jeyometri & Analiz)',
    titleFr: 'Examen Blanc Officiel — Mathématiques',
    titleEn: 'Official Mock Exam — Mathematics',
    programId: 'prog-philo',
    targetGrades: ['Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'],
    subjectCode: 'MATH',
    subjectNameHt: 'Matematik',
    durationMinutes: 35,
    totalPoints: 35,
    passingScorePercent: 65,
    isFullSimulation: false,
    instructionsHt:
      'Egzamen blan Matematik sou ekwasyon segond degre, Teyorèm Pitagò, ak etid fonksyon / derive.',
    questions: INITIAL_EXAM_PREP_QUESTIONS.filter((q) => q.subjectCode === 'MATH'),
  },
  {
    id: 'mock-scin-official',
    titleHt: 'Mock Exam Ofisyèl — Syans Natirèl (Biyoloji, Chimi & Fizik)',
    titleFr: 'Examen Blanc Officiel — Sciences Naturelles',
    titleEn: 'Official Mock Exam — Natural Sciences',
    programId: 'prog-9af',
    targetGrades: ['Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'],
    subjectCode: 'SCIN',
    subjectNameHt: 'Syans Natirèl',
    durationMinutes: 25,
    totalPoints: 25,
    passingScorePercent: 65,
    isFullSimulation: false,
    instructionsHt:
      'Egzamen blan Syans Natirèl sou Lwa Ohm, pwisans elektrik, ak biyoloji selilè.',
    questions: INITIAL_EXAM_PREP_QUESTIONS.filter((q) => q.subjectCode === 'SCIN'),
  },
];

export const INITIAL_EXAM_PREP_MATERIALS: ExamPrepMaterial[] = [
  {
    id: 'mat-istw-timeline',
    subjectCode: 'ISTW',
    subjectNameHt: 'Istwa D Ayiti',
    targetGrades: ['Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'],
    category: ' Liy Tan Istorik',
    titleHt: 'Gid Revizyon Konplè & Liy Tan Istorik Istwa D Ayiti (1492–2026)',
    summaryHt:
      'Rezime tout dat kle, pèsonaj istorik, konstitisyon ak batay ofisyèl pou Egzamen 9yèm AF, Rhéto ak Filo.',
    contentSectionsHt: [
      {
        heading: '1. Epòk Pre-Kolonbyen ak Kolonizasyon (Avan 1492 – 1789)',
        bullets: [
          '5 Kasika Taíno yo: Marien (Guacanagaric), Magua (Guarionex), Maguana (Caonabo), Xaragua (Bohechío & Anacaona), Higüey (Cayacoa).',
          '5 desanm 1492: Debakman Kristòf Kolon nan Mòl Sen Nikola; 1519–1533: Rezistans Kasik Enriquillo nan Bahoruco.',
          '1697: Trete Ryswick — Espay sede tyè lwès zile a bay Lafrans (Saint-Domingue); 1685: Kòd Nwa.',
        ],
      },
      {
        heading: '2. Revolisyon Ayisyen an (1791 – 1ye Janvye 1804)',
        bullets: [
          '14 out 1791: Seremoni Bwa Kayiman (Boukman Dutty ak Cécile Fatiman).',
          '29 out 1793: Pwoklamasyon abolisyon jeneral esklavaj nan Nò; jiyè 1801: Konstitisyon Toussaint Louverture.',
          '18 me 1803: Kongrè Akayè (kreyasyon drapo a); 18 novanm 1803: Viktwa Vètyè; 1ye janvye 1804: Endepandans nan Gonayiv.',
        ],
      },
      {
        heading: '3. 19yèm ak 20yèm Syèk: Dèt Endepandans & Okipasyon Ameriken',
        bullets: [
          '1807–1820: Divizyon Nò (Henri Christophe) ak Lwès/Sid (Alexandre Pétion); 1825: Ordonans Charles X (150M fran).',
          '1915–1934: Okipasyon Ameriken, rezistans Cacos Charlemagne Péralte (1919), mouvman Endijenis Jean Price-Mars (1928).',
        ],
      },
    ],
    updatedAt: '2026-09-29',
  },
  {
    id: 'mat-math-formulas',
    subjectCode: 'MATH',
    subjectNameHt: 'Matematik',
    targetGrades: ['Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'],
    category: 'Fèy Fòmil & Règ',
    titleHt: 'Fèy Fòmil Ofisyèl Matematik — Aljèb, Jeyometri, Analiz ak Estatistik',
    summaryHt:
      'Tout fòmil endispansab pou rezoud egzèsis Matematik nan Egzamen Leta 9yèm AF ak Filo (Bac II).',
    contentSectionsHt: [
      {
        heading: 'Aljèb ak Ekwasyon Segond Degre',
        bullets: [
          'ax² + bx + c = 0 → Δ = b² - 4ac ; x₁,₂ = (-b ± √Δ) / (2a).',
          'Som rasin: S = -b/a ; Pwodwi rasin: P = c/a.',
        ],
      },
      {
        heading: 'Jeyometri, Trigonometri ak Derive',
        bullets: [
          'Pitagò: c² = a² + b² ; Identite: cos²x + sin²x = 1.',
          'Derive: (xⁿ)’ = n·xⁿ⁻¹ ; (ln x)’ = 1/x ; (eˣ)’ = eˣ.',
        ],
      },
    ],
    updatedAt: '2026-09-29',
  },
  {
    id: 'mat-lang-guide',
    subjectCode: 'KREY',
    subjectNameHt: 'Kreyòl Ayisyen',
    targetGrades: ['Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'],
    category: 'Gid Revizyon',
    titleHt: 'Gid Revizyon Òtograf Ofisyèl Kreyòl Ayisyen & Metòd Disètasyon',
    summaryHt:
      'Règ Akademi Kreyòl Ayisyen (AKA), tablo detèminan defini yo, ak estrikti redaksyon pou egzamen ofisyèl.',
    contentSectionsHt: [
      {
        heading: 'Règ 5 Fòm Detèminan Defini Singilye a',
        bullets: [
          'la : apre konsòn oral (egz. liv la, lekòl la).',
          'a : apre vwayèl oral (egz. pye a, lari a).',
          'an : apre vwayèl nazal oswa mi-vwayèl nazal (egz. ban an, chen an).',
          'nan / lan : apre konsòn nazal m, n, ng (egz. machin nan, chanm lan).',
        ],
      },
    ],
    updatedAt: '2026-09-29',
  },
];

export const INITIAL_EXAM_PREP_PAYMENTS: ExamPrepPaymentRecord[] = [
  {
    id: 'ep-pay-1',
    studentId: 'stu-2',
    studentCode: 'ASLA-2026-0901',
    studentName: 'Kendrick Jean-Baptiste',
    studentType: 'ASLA Student',
    completedRequiredAslaCourses: true,
    grade: 'Grade 9',
    classroom: '9yèm A — Henri Christophe (Egzamen Leta)',
    expectedAmountHtg: 500,
    submittedAmountHtg: 500,
    paymentMethod: 'NatCash',
    paymentReference: 'ASLA-PAY-2026-0901-FILO',
    natcashNumber: '+509 4316 6944',
    paymentDate: '2026-09-25',
    transactionReference: 'NC-EXAM-500-9021',
    receiptFileName: 'resi_examen_leta_kendrick_500htg.jpg',
    aslaReceiptReceived: true,
    whatsappReceiptReceived: true,
    whatsappSentByStudent: true,
    submittedAt: '2026-09-25',
    status: 'Approved',
    reviewedBy: 'Sindy Salomon',
    reviewedAt: '2026-09-25',
  },
  {
    id: 'ep-pay-2',
    studentId: 'stu-6',
    studentCode: 'ASLA-2026-1201',
    studentName: 'Peterson Hippolyte',
    studentType: 'ASLA Student',
    completedRequiredAslaCourses: true,
    grade: 'Grade 12',
    classroom: '12yèm A (Philo) — Anténor Firmin',
    expectedAmountHtg: 500,
    submittedAmountHtg: 500,
    paymentMethod: 'NatCash',
    paymentReference: 'ASLA-PAY-2026-1201-FILO',
    natcashNumber: '+509 4316 6944',
    paymentDate: '2026-09-26',
    transactionReference: 'NC-PHILO-500-1201',
    receiptFileName: 'resi_philo_peterson_500htg.jpg',
    aslaReceiptReceived: true,
    whatsappReceiptReceived: true,
    whatsappSentByStudent: true,
    submittedAt: '2026-09-26',
    status: 'Approved',
    reviewedBy: 'Sindy Salomon',
    reviewedAt: '2026-09-26',
  },
  {
    id: 'ep-pay-3',
    studentId: 'stu-1',
    studentCode: 'ASLA-2026-0701',
    studentName: 'Wideline Jean-Baptiste',
    studentType: 'ASLA Student',
    completedRequiredAslaCourses: true,
    grade: 'Grade 7',
    classroom: '7yèm A — Jean-Jacques Dessalines',
    expectedAmountHtg: 500,
    submittedAmountHtg: 500,
    paymentMethod: 'NatCash',
    paymentReference: 'ASLA-PAY-2026-0701-FILO',
    natcashNumber: '+509 4316 6944',
    paymentDate: '2026-09-29',
    transactionReference: 'NC-EXAM-500-0701',
    receiptFileName: 'resi_wideline_500htg.png',
    aslaReceiptReceived: true,
    whatsappReceiptReceived: true,
    whatsappSentByStudent: true,
    submittedAt: '2026-09-29',
    status: 'Pending Verification',
  },
  {
    id: 'ep-pay-4',
    studentId: 'stu-5',
    studentCode: 'ASLA-2026-1001',
    studentName: 'Micaëlle Saint-Fleur',
    studentType: 'External Student',
    completedRequiredAslaCourses: false,
    grade: 'Grade 10',
    classroom: '10yèm A (Seconde) — Alexandre Pétion',
    expectedAmountHtg: 2000,
    submittedAmountHtg: 2000,
    paymentMethod: 'NatCash',
    paymentReference: 'ASLA-PAY-2026-1001-FILO',
    natcashNumber: '+509 4316 6944',
    paymentDate: '2026-09-28',
    transactionReference: 'NC-EXT-2000-1001',
    receiptFileName: 'resi_natcash_micaelle_2000htg.jpg',
    aslaReceiptReceived: true,
    whatsappReceiptReceived: false,
    whatsappSentByStudent: false,
    submittedAt: '2026-09-28',
    status: 'Pending Verification',
  },
  {
    id: 'ep-pay-5',
    studentId: 'stu-7',
    studentCode: 'ASLA-2026-1002',
    studentName: 'Darline Noël',
    studentType: 'External Student',
    completedRequiredAslaCourses: false,
    grade: 'Grade 10',
    classroom: '10yèm A (Seconde) — Alexandre Pétion',
    expectedAmountHtg: 2000,
    submittedAmountHtg: 500,
    paymentMethod: 'NatCash',
    paymentReference: 'ASLA-PAY-2026-1002-FILO',
    natcashNumber: '+509 4316 6944',
    paymentDate: '2026-09-27',
    transactionReference: 'NC-ERR-500-1002',
    receiptFileName: 'resi_darline_500htg_flou.jpg',
    aslaReceiptReceived: true,
    whatsappReceiptReceived: false,
    whatsappSentByStudent: false,
    submittedAt: '2026-09-27',
    status: 'Rejected',
    rejectionOrCorrectionReason:
      'Elèv ekstèn ki pa t fè klas li yo nan ASLA dwe peye 2,000 HTG (pa 500 HTG), epi foto resi a pa lizib.',
    reviewedBy: 'Sindy Salomon',
    reviewedAt: '2026-09-28',
  },
];

export const INITIAL_EXAM_PREP_ATTEMPTS: ExamPrepAttempt[] = [
  {
    id: 'epa-1',
    studentId: 'stu-2',
    studentName: 'Kendrick Jean-Baptiste',
    grade: 'Grade 9',
    attemptType: 'Mock Exam',
    mockExamId: 'mock-istw-official',
    subjectCode: 'ISTW',
    subjectNameHt: 'Istwa D Ayiti',
    titleHt: 'Mock Exam Ofisyèl — Istwa D Ayiti (1492–21yèm Syèk)',
    attemptNumber: 1,
    date: '2026-09-27',
    timeUsedMinutes: 22,
    scorePoints: 30,
    totalPoints: 35,
    percentage: 86,
    passed: true,
    answers: {
      'epq-istw-1':
        'Bwa Kayiman lanse soulèvman jeneral esklav yo nan Nò; Konstitisyon 1801 tabli otonomi ak abolisyon esklavaj; Vètyè sele defèt final lame Rochambeau a anvan Pwoklamasyon 1ye janvye 1804 pa Dessalines ak Boisrond-Tonnerre.',
      'epq-istw-2':
        'Li fòse Ayiti peye yon "doub dèt endepandans" ki te vide trezò piblik la epi anpeche envestisman nan lekòl, wout ak agrikilti.',
      'epq-istw-3': 'Charlemagne Péralte',
    },
    weakTopicsHt: [],
    recommendedLessonsHt: ['Konsolide analiz istoriografik sou 20yèm syèk la'],
  },
  {
    id: 'epa-2',
    studentId: 'stu-2',
    studentName: 'Kendrick Jean-Baptiste',
    grade: 'Grade 9',
    attemptType: 'Mock Exam',
    mockExamId: 'mock-math-official',
    subjectCode: 'MATH',
    subjectNameHt: 'Matematik',
    titleHt: 'Mock Exam Ofisyèl — Matematik (Aljèb, Jeyometri & Analiz)',
    attemptNumber: 1,
    date: '2026-09-28',
    timeUsedMinutes: 28,
    scorePoints: 25,
    totalPoints: 35,
    percentage: 71,
    passed: true,
    answers: {
      'epq-math-1': 'Δ = 25 ; x₁ = 1/2 ak x₂ = 3',
      'epq-math-2': '10 cm',
    },
    weakTopicsHt: ['Fonksyon, Derive, Limit ak Estatistik (Segondè / Filo)'],
    recommendedLessonsHt: ['Revize kalkil derive ak tablo varyasyon fonksyon yo'],
  },
  {
    id: 'epa-3',
    studentId: 'stu-2',
    studentName: 'Kendrick Jean-Baptiste',
    grade: 'Grade 9',
    attemptType: 'Practice',
    subjectCode: 'ENGL',
    subjectNameHt: 'English',
    topicId: 'ept-engl-1',
    titleHt: 'Egzèsis Pratik — Conditional Tenses & Reading Comprehension',
    attemptNumber: 1,
    date: '2026-09-29',
    timeUsedMinutes: 12,
    scorePoints: 6,
    totalPoints: 10,
    percentage: 60,
    passed: false,
    answers: {},
    weakTopicsHt: ['Reading Comprehension, Conditional Tenses & Academic Writing'],
    recommendedLessonsHt: ['Revize Third Conditional (had + past participle) nan leson English la'],
  },
  {
    id: 'epa-4',
    studentId: 'stu-6',
    studentName: 'Peterson Hippolyte',
    grade: 'Grade 12',
    attemptType: 'Similasyon Egzamen',
    mockExamId: 'mock-full-official',
    subjectCode: 'MULTI',
    subjectNameHt: 'Multi-Matyè (9 Matyè Ofisyèl)',
    titleHt: 'Similasyon Egzamen Leta Ofisyèl Konplè (Tout 9 Matyè yo)',
    attemptNumber: 1,
    date: '2026-09-28',
    timeUsedMinutes: 48,
    scorePoints: 92,
    totalPoints: 100,
    percentage: 92,
    passed: true,
    answers: {},
    weakTopicsHt: [],
    recommendedLessonsHt: ['Ekselan metriz pou Bac II / Filo — kontinye pratike disètasyon literè ak istorik.'],
  },
];

export const INITIAL_EXAM_PREP_STUDY_PLAN: ExamPrepStudyPlanTask[] = [
  {
    id: 'plan-1',
    studentId: 'stu-2',
    dayHt: 'Lendi',
    subjectCode: 'MATH',
    subjectNameHt: 'Matematik',
    topicTitleHt: 'Ekwasyon segond degre (Δ = b² - 4ac) & Teyorèm Pitagò',
    activityType: 'Revizyon Leson',
    durationMinutes: 45,
    completed: true,
  },
  {
    id: 'plan-2',
    studentId: 'stu-2',
    dayHt: 'Madi',
    subjectCode: 'ISTW',
    subjectNameHt: 'Istwa D Ayiti',
    topicTitleHt: 'Revolisyon Ayisyen an (1791–1804), Kongrè Akayè ak Batay Vètyè',
    activityType: 'Kesyon Tip Egzamen',
    durationMinutes: 50,
    completed: true,
  },
  {
    id: 'plan-3',
    studentId: 'stu-2',
    dayHt: 'Mèkredi',
    subjectCode: 'FRAN',
    subjectNameHt: 'Français',
    topicTitleHt: 'Accord du participe passé & Analyse de « Gouverneurs de la rosée »',
    activityType: 'Egzèsis Pratik',
    durationMinutes: 40,
    completed: true,
  },
  {
    id: 'plan-4',
    studentId: 'stu-2',
    dayHt: 'Jedi',
    subjectCode: 'ENGL',
    subjectNameHt: 'English',
    topicTitleHt: 'Conditional Sentences (Types 1, 2, 3) & Reading Comprehension',
    activityType: 'Revizyon Leson',
    durationMinutes: 40,
    completed: false,
  },
  {
    id: 'plan-5',
    studentId: 'stu-2',
    dayHt: 'Vandredi',
    subjectCode: 'SCIN',
    subjectNameHt: 'Syans Natirèl',
    topicTitleHt: 'Lwa Ohm (U = R×I), Pwisans Elektrik ak Biyoloji Selilè',
    activityType: 'Egzèsis Pratik',
    durationMinutes: 45,
    completed: false,
  },
  {
    id: 'plan-6',
    studentId: 'stu-2',
    dayHt: 'Samdi',
    subjectCode: 'ISTW',
    subjectNameHt: 'Istwa D Ayiti',
    topicTitleHt: 'Similasyon Egzamen Konplè Kronometre (9 Matyè Ofisyèl)',
    activityType: 'Mock Exam',
    durationMinutes: 60,
    completed: false,
  },
];

export const INITIAL_EXAM_PREP_AUDIT_LOGS: ExamPrepAuditLog[] = [
  {
    id: 'audit-1',
    timestamp: '2026-09-25 09:15',
    adminName: 'Sindy Salomon',
    studentId: 'stu-2',
    studentName: 'Kendy Jean-Baptiste',
    action: 'Apwobasyon Pèman 500 HTG & Aktivasyon Aksè',
    details: 'Elèv ASLA ki fini tout kour li yo (Grade 9). Resi MC-EXAM-500-9021 valide.',
  },
  {
    id: 'audit-2',
    timestamp: '2026-09-26 14:30',
    adminName: 'Sindy Salomon',
    studentId: 'stu-6',
    studentName: 'Daphnée Pierre-Louis',
    action: 'Apwobasyon Pèman 500 HTG & Aktivasyon Aksè Filo',
    details: 'Elèv ASLA Grade 12 (Philo). Resi NC-PHILO-500-1201 valide.',
  },
];
