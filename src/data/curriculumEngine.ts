import {
  AcademicBook,
  AcademicChapter,
  AcademicLesson,
  ASLA_GRADES,
  ExerciseQuestion,
  GradeLevel,
  SubjectDefinition,
} from '../types';
import {
  CHAPTER_TOPICS_BY_GRADE_AND_SUBJECT,
  CORE_SUBJECT_TEMPLATES,
  GRADE_COMPLEXITY_PROFILE,
} from './syllabusMatrix';
import {
  getHaitianHistoryDetailsForChapter,
  getHaitianHistoryDetailsForLesson,
} from './haitianHistoryCurriculum';

export function buildDefaultSubjectsForAllGrades(): SubjectDefinition[] {
  const subjects: SubjectDefinition[] = [];
  for (const grade of ASLA_GRADES) {
    const gradeNumber = grade.replace('Grade ', '');
    for (const tpl of CORE_SUBJECT_TEMPLATES) {
      subjects.push({
        ...tpl,
        id: `subj-g${gradeNumber}-${tpl.code.toLowerCase()}`,
        code: `${tpl.code}-${gradeNumber}`,
        grade,
      });
    }
  }
  return subjects;
}

const LESSON_SUBTHEME_PATTERNS = [
  {
    index: 1,
    focusHt: 'Fondasyon Teyorik, Definisyon ak Kontèks Ayisyen',
    focusFr: 'Fondements théoriques, définitions et contexte haïtien',
    focusEn: 'Theoretical Foundations, Definitions & Haitian Context',
  },
  {
    index: 2,
    focusHt: 'Règ Esansyèl, Pwopriyete ak Mekanis Fondamantal',
    focusFr: 'Règles essentielles, propriétés et mécanismes fondamentaux',
    focusEn: 'Core Rules, Properties & Fundamental Mechanisms',
  },
  {
    index: 3,
    focusHt: 'Metodoloji Etap pa Etap ak Demontrasyon Gide',
    focusFr: 'Méthodologie étape par étape et démonstration guidée',
    focusEn: 'Step-by-Step Methodology & Guided Demonstration',
  },
  {
    index: 4,
    focusHt: 'Analiz Ka Konkrè ak Aplikasyon Pratik ann Ayiti',
    focusFr: 'Analyse de cas concrets et applications pratiques en Haïti',
    focusEn: 'Concrete Case Analysis & Practical Applications in Haiti',
  },
  {
    index: 5,
    focusHt: 'Rezolisyon Pwoblèm Konplèks ak Panse Kritik',
    focusFr: 'Résolution de problèmes complexes et pensée critique',
    focusEn: 'Complex Problem Solving & Critical Synthesis',
  },
  {
    index: 6,
    focusHt: 'Sentèz Chapit la, Egzèsis Aprofondi ak Preparasyon Egzamen',
    focusFr: 'Synthèse du chapitre, exercices approfondis et préparation aux examens',
    focusEn: 'Chapter Synthesis, Advanced Exercises & Exam Preparation',
  },
];

function buildDomainSpecificContent(
  grade: GradeLevel,
  subject: SubjectDefinition,
  chapterNumber: number,
  chapterTitle: string,
  lessonNumber: number,
  lessonFocus: string
) {
  const profile = GRADE_COMPLEXITY_PROFILE[grade];
  const gradeNum = parseInt(grade.replace('Grade ', ''), 10);
  const baseCode = subject.code.split('-')[0];

  if (baseCode === 'MATH') {
    const k = gradeNum * chapterNumber + lessonNumber;
    const a = (chapterNumber % 5) + 2;
    const b = lessonNumber * 3;
    const xVal = gradeNum - 3;
    const rhs = a * xVal + b;

    return {
      detailedExplanation: [
        `Nan nivo ${grade} (${profile.haitianEquivalent}), etid "${chapterTitle}" — espesyalman sou tèm "${lessonFocus}" — konstitye yon poto mitan nan fòmasyon lojik ak syantifik elèv ASLA a. Nan leson sa a, nou etidye relasyon ki egziste ant objè matematik yo, pwopriyete envaryan yo, ak fason nou ka transpòze yon pwoblèm konkrè an ekwasyon oswa modèl jewometrik rigoure.`,
        `Pou metrize konsèp sa a nan nivo ${profile.academicStage}, elèv la dwe distenge ant ipotèz ki bay nan enonse a ak konklizyon li dwe demontre a. Chak transfòmasyon aljebrik oswa jewometrik repoze sou aksyòm ak teyorèm ki deja etabli nan chapit anvan yo, tankou konsèvasyon egalite, pwopriyete distribisyon $a(x + y) = ax + ay$, ak lòd operasyon yo.`,
        `Anplis kalkil dirèk la, pwogram ASLA pou ${grade} mande pou elèv la verifye koyerans rezilta li jwenn nan ( lòd grandè, inite mezi nan sistèm metrik oswa goud HTG, ak domèn validite solisyon an). Metòd sa a prepare elèv la dirèkteman pou egzamen ofisyèl MENFP yo ak pou etid siperyè nan jeni, ekonomi ak syans.`,
      ],
      examples: [
        {
          title: `Egzanp Modelizasyon Aljebrik ak Kalkil (${grade} · Ch. ${chapterNumber}.${lessonNumber})`,
          scenario: `Yon koperativ agrikòl nan Latibonit ap planifye distribisyon rekòt li. Si nou konsidere relasyon lineyè modèl la: ${a}x + ${b} = ${rhs}, kote x reprezante kantite kès pwodwi pa jou (an dizèn), detèmine valè egzak x epi verifye rezilta a.`,
          stepByStepSolution: [
            `Etap 1 — Idantifye ekwasyon referans lan: ${a}x + ${b} = ${rhs}.`,
            `Etap 2 — Izole tèm ki gen enkoni an lè nou soustrè ${b} sou chak bò egalite a: ${a}x = ${rhs} - ${b} = ${rhs - b}.`,
            `Etap 3 — Divize chak bò pa koyefisyan ${a} (paske ${a} ≠ 0): x = ${rhs - b} / ${a} = ${xVal}.`,
            `Etap 4 — Verifikasyon: Nou ranplase x pa ${xVal} nan ekspresyon inisyal la: ${a}(${xVal}) + ${b} = ${a * xVal} + ${b} = ${rhs}. Egalite a verifye.`,
          ],
          conclusion: `Valè egzak solisyon an se x = ${xVal} (sa vle di ${xVal * 10} kès pa jou).`,
        },
        {
          title: `Egzanp Analiz Pwopòsyonalite ak Pousantaj Aplike (${grade})`,
          scenario: `Nan kad yon pwojè syantifik nan ASLA, yon gwoup elèv mezire yon ogmantasyon de ${lessonNumber * 5}% sou yon grandè inisyal ki te vo ${k * 10} inite. Kalkile nouvo valè final la.`,
          stepByStepSolution: [
            `Etap 1 — Kalkile valè ogmantasyon an: (${k * 10} × ${lessonNumber * 5}) / 100 = ${(k * 10 * lessonNumber * 5) / 100}.`,
            `Etap 2 — Ajoute ogmantasyon an sou valè inisyal la: ${k * 10} + ${(k * 10 * lessonNumber * 5) / 100} = ${k * 10 + (k * 10 * lessonNumber * 5) / 100}.`,
            `Etap 3 — Entèpretasyon: Koyefisyan miltiplikatè ki koresponn ak ogmantasyon sa a se k = 1 + ${lessonNumber * 5}/100 = ${(1 + (lessonNumber * 5) / 100).toFixed(2)}.`,
          ],
          conclusion: `Valè final grandè a se ${k * 10 + (k * 10 * lessonNumber * 5) / 100} inite.`,
        },
      ],
      vocabulary: [
        {
          term: 'Ekwasyon / Équation / Equation',
          definitionHt: 'Egalite matematik ki gen youn oswa plizyè varyab enkoni.',
          definitionFr: 'Égalité mathématique comportant une ou plusieurs inconnues.',
          definitionEn: 'Mathematical statement asserting the equality of two expressions with unknowns.',
        },
        {
          term: 'Koyefisyan / Coefficient / Coefficient',
          definitionHt: 'Faktè miltiplikatif ki plase devan yon varyab oswa yon tèm.',
          definitionFr: 'Facteur multiplicatif associé à une variable dans un terme algébrique.',
          definitionEn: 'Numerical or constant factor multiplying a variable in an algebraic term.',
        },
        {
          term: 'Teyorèm / Théorème / Theorem',
          definitionHt: 'Pwopozisyon matematik ki ka demontre a pati de aksyòm ak règ lojik.',
          definitionFr: 'Proposition mathématique démontrable à partir d’axiomes.',
          definitionEn: 'Mathematical proposition proven based on axioms and previously established truths.',
        },
      ],
      formulaSummary: `Fòmil kle Ch. ${chapterNumber}.${lessonNumber}: f(x) = ${a}x + ${b} | Δ = b² - 4ac | d = √((x₂ - x₁)² + (y₂ - y₁)²)`,
    };
  }

  if (baseCode === 'SCIN') {
    return {
      detailedExplanation: [
        `Nan kou Sciences Naturelles pou ${grade} (${profile.haitianEquivalent}), chapit "${chapterTitle}" ak leson "${lessonFocus}" pèmèt elèv la konprann lwa fizik, chimik ak biyolojik ki gouvène mond vivan an ak matyè a, ak yon atansyon espesyal sou ekosistèm ak reyalite anviwònman Ayiti ak Karayib la.`,
        `Demach eksperimantal ASLA a swiv senk etap fondamantal: obsèvasyon fenomèn nan, fòmilasyon yon ipotèz ki ka teste, pwotokòl eksperimantal nan laboratwa oswa sou teren, koleksyon ak analiz done mezire yo, epi konklizyon syantifik ki konfime oswa modifye ipotèz inisyal la.`,
        `Nan nivo ${profile.academicStage}, elèv la aprann relasyon kantitatif ki lye paramèt fizik ak chimik yo (konsèvasyon mas ak enèji, balans ekwasyon chimik, echanj selilè ak dinamik jeolojik) pou devlope yon lespri syantifik rigoure.`,
      ],
      examples: [
        {
          title: `Obsèvasyon ak Analiz Eksperimantal (${grade} · Ch. ${chapterNumber}.${lessonNumber})`,
          scenario: `Nan laboratwa ASLA a, elèv ${grade} yo ap etidye "${chapterTitle}". Yo mezire evolisyon sistèm nan pandan ${lessonNumber * 10} minit epi yo note chanjman paramèt fizik ak biyolojik yo.`,
          stepByStepSolution: [
            `Etap 1 — Idantifye varyab endepandan an (tan ak kondisyon miyò a) ak varyab depandan ki mezire a.`,
            `Etap 2 — Verifye inite mezi yo nan Sistèm Entènasyonal (SI): mèt (m), kilogram (kg), segonn (s), kelvèn/sèlsiyis (°C), oswa mòl (mol).`,
            `Etap 3 — Aplike lwa konsèvasyon an pou verifye ke bilan matyè ak enèji ant eta inisyal la ak eta final la respekte.`,
          ],
          conclusion: `Eksperyans lan konfime ke transfòmasyon obsève nan "${lessonFocus}" obeyi lwa konsèvasyon ak ekilib natirèl yo.`,
        },
        {
          title: `Aplikasyon nan Kontèks Ekoloji ak Sante ann Ayiti`,
          scenario: `Kijan prensip ki etidye nan "${chapterTitle}" ede nou rezoud yon defi konkrè nan kominote ayisyèn yo (jesyon dlo potab, rebwazman basen vèsan, oswa enèji solè)?`,
          stepByStepSolution: [
            `Etap 1 — Dyagnostik syantifik sou teren an dapre prensip "${lessonFocus}".`,
            `Etap 2 — Seleksyon solisyon teknik ki adapte ak klima twopikal Ayiti a.`,
            `Etap 3 — Evalyasyon enpak pozitif sou sante piblik ak pwoteksyon biyodivèsite lokal la.`,
          ],
          conclusion: `Syans aplike pèmèt transfòme konesans teyorik ${grade} an aksyon konkrè pou devlopman dirab.`,
        },
      ],
      vocabulary: [
        {
          term: 'Ipotèz Syantifik / Hypothèse / Scientific Hypothesis',
          definitionHt: 'Eksplikasyon pwovizwa sou yon fenomèn ki dwe verifye pa eksperyans.',
          definitionFr: 'Explication provisoire d’un phénomène soumise à la vérification expérimentale.',
          definitionEn: 'Testable proposed explanation for an observed scientific phenomenon.',
        },
        {
          term: 'Konsèvasyon / Conservation / Conservation Law',
          definitionHt: 'Prensip ki montre yon grandè fizik oswa mas total rete konstan nan yon sistèm izole.',
          definitionFr: 'Principe selon lequel une grandeur demeure constante dans un système isolé.',
          definitionEn: 'Fundamental principle stating a measurable property remains constant in an isolated system.',
        },
        {
          term: 'Ekosistèm / Écosystème / Ecosystem',
          definitionHt: 'Ansanm èt vivan yo (biyosènòz) ak anviwònman fizik yo (biyotòp) an entèraksyon.',
          definitionFr: 'Ensemble formé par une communauté d’êtres vivants et son environnement.',
          definitionEn: 'Biological community of interacting organisms and their physical environment.',
        },
      ],
      formulaSummary: `Prensip kle Ch. ${chapterNumber}.${lessonNumber}: Konsèvasyon Mas (Lavoisier) · E = P × t · Ekilib Biyolojik & Chimik`,
    };
  }

  if (baseCode === 'ISTW') {
    const histDetails = getHaitianHistoryDetailsForLesson(
      grade,
      chapterNumber,
      chapterTitle,
      lessonNumber,
      lessonFocus
    );
    return {
      detailedExplanation: histDetails.detailedExplanation,
      examples: histDetails.examples,
      vocabulary: histDetails.vocabulary,
      importantDates: histDetails.importantDates,
      historicalFigures: histDetails.historicalFigures,
      historiographyNote: histDetails.historiographyNote,
      comprehensionQuestions: histDetails.comprehensionQuestions,
      reviewSummary: histDetails.reviewSummary,
      formulaSummary: `Kronoloji & Sous Ch. ${chapterNumber}.${lessonNumber} : ${histDetails.importantDates.map((d) => d.date).join(' → ')}`,
    };
  }

  return {
    detailedExplanation: [
      `Nan pwogram ofisyèl ASLA pou ${grade} (${profile.haitianEquivalent}), chapit "${chapterTitle}" ak leson "${lessonFocus}" nan matyè ${subject.nameHt} devlope kapasite elèv la pou li analize, konprann, epi pwodwi refleksyon estriktire sou lang, istwa, sosyete, oswa teknoloji.`,
      `Nan nivo ${profile.academicStage}, aprantisaj la pa limite a memorizasyon: elèv la aprann idantifye lide prensipal yo, egzamine estrikti gramatikal oswa istorik yo, epi bati yon agimantasyon solid ki chita sou prèv ak egzanp presi ki soti nan patrimwàn kiltirèl Ayiti ak nan konesans inivèsèl.`,
      `Atravè leson sa a, elèv ${grade} la ranfòse metriz vokabilè akademik li (an Kreyòl Ayisyen, Français ak English) epi li aplike metodoloji travay ki mande nan egzamen nasyonal yo: klète ekspresyon, rigè nan planifikasyon, ak sans kritik.`,
    ],
    examples: [
      {
        title: `Analiz Metodik ak Aplikasyon (${subject.nameEn} · ${grade} · Ch. ${chapterNumber}.${lessonNumber})`,
        scenario: `Konsidere yon sitiyasyon etid oswa yon ekstrè dokiman ki pote sou "${chapterTitle}" (${lessonFocus}). Kijan yon elèv ${grade} dwe òganize analiz li pou li reponn ak tout egzijans akademik ASLA yo?`,
        stepByStepSolution: [
          `Etap 1 — Lekti aktif ak repèraj: Idantifye tèm santral la ("${chapterTitle}"), mo kle yo, ak kontèks istorik, lengwistik oswa teknik la.`,
          `Etap 2 — Analiz estriktirèl: Dekonpoze sijè a an pati lojik dapre règ ki etidye nan "${lessonFocus}".`,
          `Etap 3 — Redaksyon ak ilistrasyon: Fòmile yon repons klè ki respekte règ sintaks yo epi ki apiye sou yon egzanp konkrè ki soti nan reyalite ayisyèn nan.`,
        ],
        conclusion: `Yon analiz ki swiv twa etap sa yo garanti yon repons konplè, presi ak byen agimante pou nivo ${grade}.`,
      },
      {
        title: `Etid Konpare ak Aplikasyon Pratik nan Lavi Lekòl ak Kominote a`,
        scenario: `Aplike konsèp "${lessonFocus}" pou prepare yon travay rechèch oswa yon prezantasyon devan klas ${grade} la.`,
        stepByStepSolution: [
          `Etap 1 — Fòmile pwoblematik santral la sou fòm yon kesyon klè.`,
          `Etap 2 — Rasanble de (2) agiman prensipal ak referans verifye nan liv ASLA a.`,
          `Etap 3 — Prezante yon konklizyon ki rezime aprantisaj la epi ki ouvri sou leson kap vini an.`,
        ],
        conclusion: `Metòd sa a asire ekselans nan ekspresyon ekri ak oral nan ${subject.nameHt}.`,
      },
    ],
    vocabulary: [
      {
        term: 'Pwoblematik / Problématique / Central Problematic',
        definitionHt: 'Kesyon santral ki gide analiz yon tèks, yon sijè istorik oswa yon sistèm.',
        definitionFr: 'Question centrale autour de laquelle s’organise une réflexion ou une dissertation.',
        definitionEn: 'Overarching analytical question that structures an academic inquiry or essay.',
      },
      {
        term: 'Sentèz / Synthèse / Synthesis',
        definitionHt: 'Operasyon entelektyèl ki reyini eleman esansyèl yo nan yon tout koyeran.',
        definitionFr: 'Opération intellectuelle consistant à réunir les éléments essentiels en un ensemble cohérent.',
        definitionEn: 'Combination of distinct ideas or findings into a coherent, structured whole.',
      },
      {
        term: 'Patrimwàn / Patrimoine / Heritage',
        definitionHt: 'Eritaj kiltirèl, istorik, lengwistik ak natirèl yon pèp transmèt bay jenerasyon yo.',
        definitionFr: 'Héritage commun culturel, historique et linguistique transmis entre générations.',
        definitionEn: 'Cultural, historical, and linguistic legacy passed down across generations.',
      },
    ],
    formulaSummary: `Metòd Ch. ${chapterNumber}.${lessonNumber}: Obsèvasyon → Analiz → Agimantasyon → Sentèz Kritik (${grade})`,
  };
}

export function generateBookForGradeAndSubject(
  grade: GradeLevel,
  subject: SubjectDefinition
): AcademicBook {
  const profile = GRADE_COMPLEXITY_PROFILE[grade];
  const baseCode = subject.code.split('-')[0];
  const customTopics = CHAPTER_TOPICS_BY_GRADE_AND_SUBJECT[grade]?.[baseCode];

  const chapterTitles: string[] =
    customTopics && customTopics.length >= 16
      ? customTopics
      : Array.from({ length: 16 }, (_, idx) => `${subject.nameHt} — Chapit ${idx + 1}: Fondman ak Aplikasyon (${grade})`);

  const chapters: AcademicChapter[] = [];
  let runningPage = 5; // Pages 1-4: Cover, TOC, Introduction, Learning Objectives

  for (let cIdx = 0; cIdx < chapterTitles.length; cIdx++) {
    const chapterNumber = cIdx + 1;
    const chapterTitle = chapterTitles[cIdx];
    const chapterStartPage = runningPage;
    const lessons: AcademicLesson[] = [];

    for (let lIdx = 0; lIdx < LESSON_SUBTHEME_PATTERNS.length; lIdx++) {
      const pattern = LESSON_SUBTHEME_PATTERNS[lIdx];
      const lessonNumber = pattern.index;
      const lessonPageStart = runningPage;
      const lessonPageEnd = runningPage + 1;
      runningPage += 1;

      const domainContent = buildDomainSpecificContent(
        grade,
        subject,
        chapterNumber,
        chapterTitle,
        lessonNumber,
        pattern.focusHt
      );

      const lessonId = `${subject.id}-ch${chapterNumber}-ls${lessonNumber}`;

      const classworkExercises: ExerciseQuestion[] = [
        {
          id: `${lessonId}-cw-1`,
          number: 1,
          type: 'multiple_choice',
          prompt: `[${grade} · Ch. ${chapterNumber} L.${lessonNumber}] Ki prensip fondamantal ki pi byen defini "${chapterTitle}" nan kad "${pattern.focusHt}"?`,
          options: [
            `Aplikasyon rigoure règ ak metodoloji ${subject.nameHt} pou nivo ${grade}`,
            `Eliminasyon tout verifikasyon ak kalkil etap pa etap`,
            `Ranplasman obsèvasyon syantifik pa sipozisyon san prèv`,
            `Itilizasyon règ ki pa koresponn ak nivo ${profile.haitianEquivalent}`,
          ],
          correctAnswer: `Aplikasyon rigoure règ ak metodoloji ${subject.nameHt} pou nivo ${grade}`,
          explanation: `Nan nivo ${grade}, chak rezònman nan ${subject.nameHt} dwe swiv metodoloji ofisyèl ASLA ak verifikasyon etap pa etap.`,
          points: 25,
        },
        {
          id: `${lessonId}-cw-2`,
          number: 2,
          type: 'true_false',
          prompt: `Vrè oswa Fo: Nan leson "${pattern.focusHt}" (${chapterTitle}), li obligatwa pou elèv ${grade} la jistifye chak etap nan repons li.`,
          options: ['Vrè (True)', 'Fo (False)'],
          correctAnswer: 'Vrè (True)',
          explanation: `Jistifikasyon etap pa etap se yon egzijans fondamantal nan kurikulòm ASLA ${grade}.`,
          points: 25,
        },
        {
          id: `${lessonId}-cw-3`,
          number: 3,
          type: 'short_answer',
          prompt: `Bay yon konsèp kle oswa yon règ ou sot etidye nan leson ${chapterNumber}.${lessonNumber} ("${chapterTitle}") epi eksplike wòl li an youn oubyen de fraz.`,
          correctAnswer: `Konsèp kle a pèmèt estriktire analiz la epi verifye validite rezilta a nan ${chapterTitle}.`,
          explanation: `Repons lan dwe mansyone tèm santral leson ${chapterNumber}.${lessonNumber} an ak aplikasyon dirèk li.`,
          points: 25,
        },
        {
          id: `${lessonId}-cw-4`,
          number: 4,
          type: 'problem_solving',
          prompt: `Rezoud pwoblèm aplikasyon sa a sou "${chapterTitle}": Aplike metòd 3 etap ki montre nan Egzanp 1 leson an pou trete yon ka konkrè nan klas ${grade} ou a.`,
          correctAnswer: `Etap 1: Idantifikasyon done yo; Etap 2: Aplikasyon règ la; Etap 3: Verifikasyon ak konklizyon.`,
          explanation: `Elèv la dwe prezante done yo, devlopman an, ak verifikasyon final la.`,
          points: 25,
        },
      ];

      const homeworkQuestions: ExerciseQuestion[] = [
        {
          id: `${lessonId}-hw-1`,
          number: 1,
          type: 'multiple_choice',
          prompt: `Ki objektif prensipal devwa lakay sou "${chapterTitle} — ${pattern.focusHt}" pou yon elèv ${grade}?`,
          options: [
            `Konsolide metriz teyorik ak pratik leson ${chapterNumber}.${lessonNumber} an poukont li`,
            `Sote etap verifikasyon yo nan egzèsis la`,
            `Kopye tit chapit la san fè okenn analiz`,
            `Melanje pwogram ${grade} ak yon lòt nivo san règ`,
          ],
          correctAnswer: `Konsolide metriz teyorik ak pratik leson ${chapterNumber}.${lessonNumber} an poukont li`,
          explanation: `Devwa lakay la pèmèt elèv la verifye li metrize leson an san èd dirèk.`,
          points: 50,
        },
        {
          id: `${lessonId}-hw-2`,
          number: 2,
          type: 'written_response',
          prompt: `Redije yon devlopman konplè (5 a 8 liy) oswa rezolisyon detaye sou "${chapterTitle}" (${pattern.focusHt}), epi bay yon egzanp konkrè ki soti nan lavi chak jou ann Ayiti.`,
          correctAnswer: `Devlopman estriktire ak entwodiksyon, aplikasyon règ leson ${chapterNumber}.${lessonNumber}, ak egzanp konkrè ann Ayiti.`,
          explanation: `Pwofesè a evalye klète eksplikasyon an, presizyon vokabilè a, ak pèrtinans egzanp lan.`,
          points: 50,
        },
      ];

      lessons.push({
        id: lessonId,
        lessonNumber,
        title: `Leson ${chapterNumber}.${lessonNumber} : ${pattern.focusHt}`,
        pageStart: lessonPageStart,
        pageEnd: lessonPageEnd,
        estimatedMinutes: 45 + profile.difficultyMultiplier * 5,
        objectives: [
          `Idantifye ak defini prensip fondamantal "${chapterTitle}" nan kad ${pattern.focusHt}.`,
          `Aplike metodoloji etap pa etap nivo ${grade} (${profile.haitianEquivalent}) sou egzanp konkrè.`,
          `Rezoud egzèsis klas (Classwork) ak devwa (Homework) avèk presizyon ak jistifikasyon.`,
        ],
        introduction: `Byenveni nan Leson ${chapterNumber}.${lessonNumber} nan liv ${subject.nameHt} pou ${grade}. Nan leson sa a, nou pral egzamine "${pattern.focusHt}" anndan chapit "${chapterTitle}". Konesans sa a bati sou sa ou te aprann nan leson anvan yo epi li prepare w dirèkteman pou egzèsis pratik ak evalyasyon chapit la.`,
        detailedExplanation: domainContent.detailedExplanation,
        importantDates: 'importantDates' in domainContent ? domainContent.importantDates : undefined,
        historicalFigures:
          'historicalFigures' in domainContent ? domainContent.historicalFigures : undefined,
        historiographyNote:
          'historiographyNote' in domainContent ? domainContent.historiographyNote : undefined,
        examples: domainContent.examples,
        vocabulary: domainContent.vocabulary,
        comprehensionQuestions:
          'comprehensionQuestions' in domainContent
            ? domainContent.comprehensionQuestions
            : [
                {
                  question: `Ki objektif prensipal Leson ${chapterNumber}.${lessonNumber} ("${pattern.focusHt}") nan kad chapit "${chapterTitle}"?`,
                  answer: `Objektif la se pèmèt elèv ${grade} la konprann epi aplike konsèp kle "${chapterTitle}" avèk presizyon.`,
                },
                {
                  question: `Kijan egzanp gide yo nan leson sa a ede w rezoud Travay Klas la?`,
                  answer: `Yo montre metòd etap pa etap pou idantifye done yo, aplike règ la, epi verifye konklizyon an.`,
                },
              ],
        guidedPractice: [
          {
            prompt: `Pratik Gide 1: Ki premye verifikasyon yon elèv ${grade} dwe fè lè li kòmanse yon egzèsis sou "${chapterTitle}"?`,
            hint: `Sonje Etap 1 nan egzanp gide a: li enonse a ak anpil atansyon epi rasanble done ak inite yo.`,
            modelAnswer: `Premye verifikasyon an se idantifye tout done ki bay nan enonse a, kondisyon validite yo, ak sa kesyon an mande pou nou demontre oswa kalkile.`,
          },
          {
            prompt: `Pratik Gide 2: Kijan nou itilize vokabilè teknik leson ${chapterNumber}.${lessonNumber} an pou jistifye konklizyon nou?`,
            hint: `Gade definisyon 3 tèm kle yo nan seksyon Vokabilè leson an.`,
            modelAnswer: `Nou site règ oswa konsèp egzak la, nou montre kijan done egzèsis la satisfè kondisyon règ la, epi nou ekri konklizyon an ak inite oswa fòmilasyon ki kòrèk la.`,
          },
        ],
        classworkExercises,
        homeworkAssignment: {
          title: `Devwa Lakay ${chapterNumber}.${lessonNumber} — ${chapterTitle}`,
          instructions: `Reponn tout kesyon yo ak swen. Montre tout etap rezonman oswa kalkil ou yo pou nivo ${grade}.`,
          questions: homeworkQuestions,
        },
        reviewSummary:
          'reviewSummary' in domainContent && domainContent.reviewSummary
            ? domainContent.reviewSummary
            : `Rezime Leson ${chapterNumber}.${lessonNumber} : Leson sa a sou "${chapterTitle}" (${pattern.focusHt}) bay elèv ${grade} la fondasyon teyorik, vokabilè ak metòd rezolisyon ki nesesè pou reyisi evalyasyon chapit la.`,
        reviewQuestions: [
          {
            question: `Ki lide santral nou dwe sonje nan Leson ${chapterNumber}.${lessonNumber} (${pattern.focusHt})?`,
            answer: `Lide santral la se metriz "${chapterTitle}" atravè definisyon egzak, aplikasyon metodik etap pa etap, ak verifikasyon sistematik rezilta yo pou nivo ${grade}.`,
          },
          {
            question: `Kijan leson sa a konekte ak rès chapit ${chapterNumber} la?`,
            answer: `Li bay zouti metodolojik ak konsèp ki nesesè pou rezoud pwoblèm konplèks yo epi reyisi Quiz Chapit ${chapterNumber} la.`,
          },
        ],
      });
    }

    const chapterEndPage = runningPage + 1;
    runningPage += 2; // Chapter review + quiz pages

    const quizQuestions: ExerciseQuestion[] = [
      {
        id: `${subject.id}-ch${chapterNumber}-qz-1`,
        number: 1,
        type: 'multiple_choice',
        prompt: `[Quiz Chapit ${chapterNumber}] Nan "${chapterTitle}" (${grade}), ki etap ki garanti validite yon demonstrasyon oswa analiz?`,
        options: [
          `Respè strik definisyon yo, devlopman lojik etap pa etap ak verifikasyon final`,
          `Bay yon repons rapid san okenn eksplikasyon ni prèv`,
          `Itilize yon fòmil oswa règ ki pa gen rapò ak ${subject.nameHt}`,
          `Ignore kontèks ak done enonse a`,
        ],
        correctAnswer: `Respè strik definisyon yo, devlopman lojik etap pa etap ak verifikasyon final`,
        explanation: `Nan tout chapit ${chapterNumber}, validite yon repons repoze sou chèn lojik Ipotèz → Metodoloji → Verifikasyon.`,
        points: 20,
      },
      {
        id: `${subject.id}-ch${chapterNumber}-qz-2`,
        number: 2,
        type: 'true_false',
        prompt: `[Quiz Chapit ${chapterNumber}] Vrè oswa Fo: Tout 6 leson nan Chapit ${chapterNumber} ("${chapterTitle}") konstitye yon pwogresyon koyeran pou nivo ${grade}.`,
        options: ['Vrè (True)', 'Fo (False)'],
        correctAnswer: 'Vrè (True)',
        explanation: `Chak chapit ASLA òganize soti nan fondasyon teyorik rive nan rezolisyon pwoblèm konplèks.`,
        points: 20,
      },
      {
        id: `${subject.id}-ch${chapterNumber}-qz-3`,
        number: 3,
        type: 'multiple_choice',
        prompt: `[Quiz Chapit ${chapterNumber}] Ki wòl egzanp konkrè ak aplikasyon pratik yo jwe nan etid "${chapterTitle}"?`,
        options: [
          `Yo pèmèt transfere konesans teyorik la nan sitiyasyon reyèl ann Ayiti ak nan egzamen ofisyèl`,
          `Yo sèvi sèlman pou ranpli paj liv la san valè pedagojik`,
          `Yo ranplase nesesite pou konprann règ debaz yo`,
          `Yo aplike sèlman pou lòt matyè`,
        ],
        correctAnswer: `Yo pèmèt transfere konesans teyorik la nan sitiyasyon reyèl ann Ayiti ak nan egzamen ofisyèl`,
        explanation: `Metodoloji ASLA konekte teyori akademik ak aplikasyon konkrè.`,
        points: 20,
      },
      {
        id: `${subject.id}-ch${chapterNumber}-qz-4`,
        number: 4,
        type: 'short_answer',
        prompt: `[Quiz Chapit ${chapterNumber}] Rezime an 2 oswa 3 fraz sa ou te aprann nan Chapit ${chapterNumber}: "${chapterTitle}".`,
        correctAnswer: `Chapit ${chapterNumber} pèmèt nou metrize ${chapterTitle} nan nivo ${grade} atravè definisyon kle, règ fondamantal ak aplikasyon pratik.`,
        explanation: `Yon bon rezime dwe site tèm chapit la ak metodoloji prensipal la.`,
        points: 20,
      },
      {
        id: `${subject.id}-ch${chapterNumber}-qz-5`,
        number: 5,
        type: 'problem_solving',
        prompt: `[Quiz Chapit ${chapterNumber}] Pwoblèm Sentèz: Prezante yon egzanp aplikasyon konplè ki baze sou "${chapterTitle}" epi montre kijan ou rezoud li etap pa etap.`,
        correctAnswer: `Prezantasyon pwoblèm nan, aplikasyon règ Chapit ${chapterNumber}, ak verifikasyon rezilta a.`,
        explanation: `Kesyon sa a verifye kapasite elèv la pou li mobilize tout leson chapit la.`,
        points: 20,
      },
    ];

    const chapterHistoryDetails =
      baseCode === 'ISTW'
        ? getHaitianHistoryDetailsForChapter(grade, chapterNumber, chapterTitle)
        : undefined;

    chapters.push({
      id: `${subject.id}-ch${chapterNumber}`,
      chapterNumber,
      title: `Chapit ${chapterNumber} : ${chapterTitle}`,
      subtitle: `${subject.nameHt} · ${grade} (${profile.haitianEquivalent})`,
      pageStart: chapterStartPage,
      pageEnd: chapterEndPage,
      overview: `Chapit sa a kouvri an pwofondè "${chapterTitle}" pou elèv ${grade}. Li gen ladan l 6 leson konplè, egzanp detaye, vokabilè triling, pratik gide, travay nan klas, devwa lakay ak yon quiz evalyasyon.`,
      learningGoals: [
        `Metrize tout definisyon ak konsèp kle nan "${chapterTitle}".`,
        `Rezoud egzèsis ak pwoblèm nivo ${grade} avèk metòd ak presizyon.`,
        `Reyisi Quiz Chapit ${chapterNumber} la ak yon nòt omwen 70/100.`,
      ],
      importantDates: chapterHistoryDetails?.importantDates,
      historicalFigures: chapterHistoryDetails?.historicalFigures,
      historiographyNote: chapterHistoryDetails?.historiographyNote,
      comprehensionQuestions: chapterHistoryDetails?.comprehensionQuestions,
      lessons,
      chapterReview: {
        summaryPoints: [
          `Chapit ${chapterNumber} ("${chapterTitle}") etabli baz esansyèl pou pwogresyon elèv ${grade} la nan ${subject.nameHt}.`,
          `Chak leson (1 a 6) mennen elèv la soti nan konpreyansyon konsèp yo rive nan rezolisyon pwoblèm otonòm.`,
          `Asire w ou revize tout koreksyon egzèsis yo anvan ou kòmanse Quiz Chapit ${chapterNumber} la.`,
        ],
        keyFormulasOrRules: [
          `Règ 1: Toujou idantifye ipotèz, done ak domèn validite anvan ou kòmanse reponn.`,
          `Règ 2: Jistifye chak etap ak vokabilè oswa teyorèm ki apwopriye pou ${grade}.`,
          `Règ 3: Verifye koyerans ak inite rezilta final la.`,
        ],
      },
      chapterQuiz: {
        id: `${subject.id}-ch${chapterNumber}-quiz`,
        title: `Quiz Evalyasyon Chapit ${chapterNumber} — ${chapterTitle}`,
        passingScore: 70,
        timeLimitMinutes: 30,
        questions: quizQuestions,
      },
    });
  }

  const finalExamQuestions: ExerciseQuestion[] = [
    {
      id: `${subject.id}-final-1`,
      number: 1,
      type: 'multiple_choice',
      prompt: `[Egzamen Final ${grade} · ${subject.nameHt}] Ki chapit ki poze premye fondasyon pwogram ${subject.nameHt} nan ${grade}?`,
      options: [
        chapters[0].title,
        'Yon sijè ki pa nan pwogram ofisyèl la',
        'Sèlman dènye paragraf liv la',
        'Okenn nan repons sa yo',
      ],
      correctAnswer: chapters[0].title,
      explanation: `Liv la kòmanse avèk ${chapters[0].title} pou bati baz aprantisaj ane a.`,
      points: 20,
    },
    {
      id: `${subject.id}-final-2`,
      number: 2,
      type: 'multiple_choice',
      prompt: `[Egzamen Final ${grade}] Konbyen chapit konplè liv akademik ${subject.nameHt} (${grade}) sa a genyen pou asire pwogresyon anyèl la?`,
      options: [
        `${chapters.length} chapit konplè ak ${chapters.length * 6} leson estriktire`,
        'Sèlman 2 chapit rezime',
        'Pa gen okenn leson pratik',
        'Yon sèl paj entwodiksyon',
      ],
      correctAnswer: `${chapters.length} chapit konplè ak ${chapters.length * 6} leson estriktire`,
      explanation: `Liv ASLA ${grade} la gen ${chapters.length} chapit ak 6 leson pa chapit (${chapters.length * 6} leson an tout).`,
      points: 20,
    },
    {
      id: `${subject.id}-final-3`,
      number: 3,
      type: 'true_false',
      prompt: `[Egzamen Final ${grade}] Vrè oswa Fo: Pwogram ${subject.nameHt} pou ${grade} (${profile.haitianEquivalent}) prepare elèv la pou li pase nan nivo siperyè a avèk baz solid.`,
      options: ['Vrè (True)', 'Fo (False)'],
      correctAnswer: 'Vrè (True)',
      explanation: `Kurikulòm ASLA a fèt pou asire yon pwogresyon kontini soti Grade 7 rive Grade 12.`,
      points: 20,
    },
    {
      id: `${subject.id}-final-4`,
      number: 4,
      type: 'problem_solving',
      prompt: `[Egzamen Final ${grade}] Sentèz Mitan Ane: Chwazi yon konsèp nan "${chapters[7]?.title || chapters[0].title}" epi montre etap pa etap kijan li aplike nan rezolisyon yon pwoblèm konkrè.`,
      correctAnswer: `Idantifikasyon konsèp la, devlopman etap pa etap, ak konklizyon verifye.`,
      explanation: `Kesyon sa a evalye metriz elèv la sou chapit mitan ane yo.`,
      points: 20,
    },
    {
      id: `${subject.id}-final-5`,
      number: 5,
      type: 'written_response',
      prompt: `[Egzamen Final ${grade}] Disètasyon / Pwoblèm Final: Eksplike kijan aprantisaj ou nan "${chapters[chapters.length - 2]?.title}" ak "${chapters[chapters.length - 1]?.title}" ranfòse fòmasyon akademik ou nan ${grade}.`,
      correctAnswer: `Sentèz estriktire ki konekte dènye chapit liv la ak objektif jeneral ${grade}.`,
      explanation: `Evalye kapasite sentèz jeneral elèv la sou tout liv ${subject.nameHt} la.`,
      points: 20,
    },
  ];

  return {
    id: `book-${subject.id}`,
    grade,
    subjectId: subject.id,
    subjectNameHt: subject.nameHt,
    subjectNameFr: subject.nameFr,
    subjectNameEn: subject.nameEn,
    title: `Liv Akademik ASLA : ${subject.nameHt} — ${grade}`,
    subtitle: `${profile.haitianEquivalent} · ${profile.academicStage}`,
    edition: 'Edisyon Ofisyèl ASLA 2026–2027',
    academicYear: '2026–2027',
    totalPages: profile.targetPages,
    coverCategory: subject.category,
    introduction: `Liv akademik sa a fèt espesyalman pou elèv ${grade} (${profile.haitianEquivalent}) nan Akademi Syans ak Lèt Ayiti (ASLA). Li respekte pwogresyon pedagojik ofisyèl la ak ${chapters.length} chapit konplè ak ${chapters.length * 6} leson detaye (${profile.targetPages} paj). Chak chapit konbine eksplikasyon apwofondi, egzanp ki anrasinen nan reyalite ayisyèn ak entènasyonal, vokabilè triling (Kreyòl, Français, English), pratik gide, travay nan klas, devwa lakay, quiz chapit ak koreksyon konplè.`,
    learningObjectives: [
      `Metrize tout ${chapters.length} chapit pwogram ofisyèl ${subject.nameHt} pou ${grade}.`,
      `Devlope otonomi entelektyèl atravè ${chapters.length * 6} leson pwogresif ak egzèsis pratik.`,
      `Aplike konesans ${subject.nameHt} nan sitiyasyon konkrè ann Ayiti ak nan egzamen ofisyèl yo.`,
      `Prepare tranzisyon solid vè nivo akademik ki vin apre a.`,
    ],
    chapters,
    finalReview: {
      overview: `Revizyon Jeneral Liv ${subject.nameHt} (${grade}) sa a rasanble pwen esansyèl tout ${chapters.length} chapit yo pou prepare elèv la pou Egzamen Final Anyèl la.`,
      studyChecklist: [
        `Revize tab matyè a ak rezime chak nan ${chapters.length} chapit yo.`,
        `Verifye ou fin soumèt tout Classwork ak Homework pou leson ou etidye yo.`,
        `Repase koreksyon Quiz Chapit yo pou korije tout erè anvan Egzamen Final la.`,
      ],
      masteryThemes: chapters.slice(0, 6).map((ch) => ch.title),
    },
    finalExam: {
      id: `exam-final-${subject.id}`,
      title: `Egzamen Final Anyèl — ${subject.nameHt} (${grade})`,
      timeLimitMinutes: 90,
      passingScore: 70,
      questions: finalExamQuestions,
    },
  };
}
