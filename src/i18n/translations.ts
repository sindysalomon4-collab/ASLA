import { Language } from '../types';

export interface TranslationStrings {
  welcomeTitle: string;
  welcomeSubtitle: string;
  welcomeTagline: string;
  signIn: string;
  signUp: string;
  back: string;
  close: string;
  exit: string;
  signOut: string;
  about: string;
  contact: string;
  help: string;
  privacy: string;
  terms: string;
  student: string;
  parent: string;
  administration: string;
  emailOrUsername: string;
  password: string;
  showPassword: string;
  hidePassword: string;
  forgotPassword: string;
  fullName: string;
  dateOfBirth: string;
  email: string;
  phone: string;
  confirmPassword: string;
  selectGrade: string;
  selectClassroom: string;
  parentGuardianName: string;
  parentGuardianContact: string;
  childInformation: string;
  proceedToPayment: string;
  registrationFeeTitle: string;
  paymentInstructions: string;
  paymentMethod: string;
  transactionRefNumber: string;
  receiptUpload: string;
  submitPayment: string;
  cancelExit: string;
  paymentPendingTitle: string;
  paymentPendingMessage: string;
  protectedClassroomBlockedTitle: string;
  protectedClassroomBlockedMessage: string;
  previous: string;
  next: string;
  reviewChapter: string;
  startChapterQuiz: string;
  academicYearLabel: string;
  gradesSupportedNote: string;
  gradeRestrictionNote: string;
}

export const TRANSLATIONS: Record<Language, TranslationStrings> = {
  ht: {
    welcomeTitle: 'Byenveni nan Aprantisaj se lò Akademi (ASLA)',
    welcomeSubtitle:
      'Aprantisaj se lò Akademi — A Haitian educational platform for students in Grades 7–12, parents, and school administration.',
    welcomeTagline:
      'Aprantisaj se lò Akademi (ASLA) — Platfòm edikasyonèl ayisyen pou elèv klas 7yèm rive 12yèm ane (Grades 7–12), paran yo, ak direksyon lekòl la.',
    signIn: 'SIGN IN / KONEKTE',
    signUp: 'SIGN UP / ENSKRI',
    back: '← Back',
    close: '✕ Close',
    exit: 'Exit',
    signOut: '🚪 Sign Out',
    about: 'About',
    contact: 'Contact',
    help: 'Help',
    privacy: 'Privacy',
    terms: 'Terms',
    student: 'Student / Elèv',
    parent: 'Parent / Paran',
    administration: 'Administration / Administrasyon',
    emailOrUsername: 'Imèl oswa Non itilizatè (Email/Username)',
    password: 'Modpas (Password)',
    showPassword: 'Show',
    hidePassword: 'Hide',
    forgotPassword: 'Forgot Password? / Bliye modpas?',
    fullName: 'Non Konplè (Full Name)',
    dateOfBirth: 'Dat Nesans (Date of Birth)',
    email: 'Adrès Imèl (Email)',
    phone: 'Nimewo Telefòn (Phone)',
    confirmPassword: 'Konfime Modpas (Confirm Password)',
    selectGrade: 'Chwazi Klas (Grades 7–12 sèlman)',
    selectClassroom: 'Sal Klas (Classroom)',
    parentGuardianName: 'Non Paran oswa Responsab (Parent/Guardian Name)',
    parentGuardianContact: 'Kontak Paran oswa Responsab (Parent/Guardian Contact)',
    childInformation: 'Enfòmasyon sou Elèv la (Child/Student Information)',
    proceedToPayment: 'Kontinye nan Pèman Enskripsyon (15,000 HTG) →',
    registrationFeeTitle: 'Aprantisaj se lò Akademi (ASLA) Registration Fee — 15,000 HTG',
    paymentInstructions:
      'Tanpri peye frè enskripsyon anyèl 15,000 HTG a atravè MonCash, Natcash, oswa transfè labank (Sogebank, BNC, Unibank). Antre nimewo tranzaksyon an epi telechaje resi pèman ou an pou verifikasyon administrasyon Aprantisaj se lò Akademi (ASLA).',
    paymentMethod: 'Metòd Pèman (Payment Method)',
    transactionRefNumber: 'Nimewo Tranzaksyon / Referans (Transaction/Reference Number)',
    receiptUpload: 'Telechaje Resi Pèman (Receipt Upload)',
    submitPayment: 'Submit Payment / Soumèt Pèman',
    cancelExit: 'Cancel / Exit',
    paymentPendingTitle: 'PAYMENT PENDING — Pèman an ap tann verifikasyon',
    paymentPendingMessage:
      'Resi 15,000 HTG ou a resevwa. Telechaje yon resi pa apwouve kont lan otomatikman. Administrasyon Aprantisaj se lò Akademi (ASLA) ap verifye tranzaksyon an epi apwouve aksè elèv la nan sal klas la.',
    protectedClassroomBlockedTitle: 'Aksè nan Sal Klas Pwoteje (Kont ap tann Apwobasyon)',
    protectedClassroomBlockedMessage:
      'Elèv ki an atant (Pending), rejte (Rejected), oswa sispann (Suspended) pa ka antre nan sal klas akademik pwoteje yo jiskaske Administrasyon Aprantisaj se lò Akademi (ASLA) verifye pèman 15,000 HTG a epi apwouve dosye elèv la.',
    previous: '← Previous',
    next: 'Next →',
    reviewChapter: '← Review Chapter',
    startChapterQuiz: 'Start Chapter Quiz →',
    academicYearLabel: 'Ane Akademik 2026–2027',
    gradesSupportedNote: 'Nivo Akademik Ofisyèl Aprantisaj se lò Akademi (ASLA): Grade 7 rive Grade 12',
    gradeRestrictionNote: 'Chak elèv gen aksè sèlman nan liv ak sal klas nivo li ye a.',
  },
  fr: {
    welcomeTitle: 'Byenveni nan Aprantisaj se lò Akademi (ASLA)',
    welcomeSubtitle:
      'Aprantisaj se lò Akademi — A Haitian educational platform for students in Grades 7–12, parents, and school administration.',
    welcomeTagline:
      'Aprantisaj se lò Akademi (ASLA) — Plateforme éducative haïtienne complète pour les élèves de la 7e à la 12e année (Grades 7–12), les parents et l’administration scolaire.',
    signIn: 'SIGN IN / CONNEXION',
    signUp: 'SIGN UP / INSCRIPTION',
    back: '← Back',
    close: '✕ Close',
    exit: 'Exit',
    signOut: '🚪 Sign Out',
    about: 'About',
    contact: 'Contact',
    help: 'Help',
    privacy: 'Privacy',
    terms: 'Terms',
    student: 'Student / Élève',
    parent: 'Parent',
    administration: 'Administration',
    emailOrUsername: 'Email ou nom d’utilisateur',
    password: 'Mot de passe',
    showPassword: 'Show',
    hidePassword: 'Hide',
    forgotPassword: 'Forgot Password? / Mot de passe oublié ?',
    fullName: 'Nom complet',
    dateOfBirth: 'Date de naissance',
    email: 'Adresse email',
    phone: 'Téléphone',
    confirmPassword: 'Confirmer le mot de passe',
    selectGrade: 'Niveau scolaire (Grades 7–12 uniquement)',
    selectClassroom: 'Salle de classe',
    parentGuardianName: 'Nom du parent / tuteur',
    parentGuardianContact: 'Contact du parent / tuteur',
    childInformation: 'Informations sur l’élève / enfant',
    proceedToPayment: 'Continuer vers le paiement (15,000 HTG) →',
    registrationFeeTitle: 'Aprantisaj se lò Akademi (ASLA) Registration Fee — 15,000 HTG',
    paymentInstructions:
      'Veuillez acquitter les frais d’inscription de 15,000 HTG via MonCash, Natcash ou virement bancaire (Sogebank, BNC, Unibank). Saisissez la référence de transaction et téléversez le reçu.',
    paymentMethod: 'Mode de paiement',
    transactionRefNumber: 'Numéro de transaction / référence',
    receiptUpload: 'Téléversement du reçu',
    submitPayment: 'Submit Payment / Soumettre le paiement',
    cancelExit: 'Cancel / Exit',
    paymentPendingTitle: 'PAYMENT PENDING — Paiement en attente de vérification',
    paymentPendingMessage:
      'Votre reçu de 15,000 HTG a été enregistré. Le téléversement du reçu n’active pas automatiquement le compte. L’administration d’Aprantisaj se lò Akademi (ASLA) doit vérifier et approuver le dossier.',
    protectedClassroomBlockedTitle: 'Accès aux salles de classe protégé',
    protectedClassroomBlockedMessage:
      'Les élèves en attente ou refusés ne peuvent pas accéder aux salles de classe académiques avant la validation administrative du paiement de 15,000 HTG par Aprantisaj se lò Akademi (ASLA).',
    previous: '← Previous',
    next: 'Next →',
    reviewChapter: '← Review Chapter',
    startChapterQuiz: 'Start Chapter Quiz →',
    academicYearLabel: 'Année Académique 2026–2027',
    gradesSupportedNote: 'Niveaux Officiels Aprantisaj se lò Akademi (ASLA) : Grade 7 à Grade 12',
    gradeRestrictionNote: 'Chaque élève accède strictement aux manuels de son niveau assigné.',
  },
  en: {
    welcomeTitle: 'Byenveni nan Aprantisaj se lò Akademi (ASLA)',
    welcomeSubtitle:
      'Aprantisaj se lò Akademi — A Haitian educational platform for students in Grades 7–12, parents, and school administration.',
    welcomeTagline:
      'Aprantisaj se lò Akademi (ASLA) — Complete academic library, structured left-to-right coursework, parent monitoring, and school administration for Grades 7 through 12.',
    signIn: 'SIGN IN',
    signUp: 'SIGN UP',
    back: '← Back',
    close: '✕ Close',
    exit: 'Exit',
    signOut: '🚪 Sign Out',
    about: 'About',
    contact: 'Contact',
    help: 'Help',
    privacy: 'Privacy',
    terms: 'Terms',
    student: 'Student',
    parent: 'Parent',
    administration: 'Administration',
    emailOrUsername: 'Email / Username',
    password: 'Password',
    showPassword: 'Show',
    hidePassword: 'Hide',
    forgotPassword: 'Forgot Password?',
    fullName: 'Full Name',
    dateOfBirth: 'Date of Birth',
    email: 'Email Address',
    phone: 'Phone Number',
    confirmPassword: 'Confirm Password',
    selectGrade: 'Grade Level (Grades 7–12 only)',
    selectClassroom: 'Classroom Section',
    parentGuardianName: 'Parent / Guardian Name',
    parentGuardianContact: 'Parent / Guardian Contact',
    childInformation: 'Child / Student Information',
    proceedToPayment: 'Proceed to Registration Payment (15,000 HTG) →',
    registrationFeeTitle: 'Aprantisaj se lò Akademi (ASLA) Registration Fee — 15,000 HTG',
    paymentInstructions:
      'Please remit the 15,000 HTG registration fee via MonCash, Natcash, or bank deposit (Sogebank, BNC, Unibank). Enter the transaction/reference number and upload your receipt for administrative verification.',
    paymentMethod: 'Payment Method',
    transactionRefNumber: 'Transaction / Reference Number',
    receiptUpload: 'Receipt Upload',
    submitPayment: 'Submit Payment',
    cancelExit: 'Cancel / Exit',
    paymentPendingTitle: 'PAYMENT PENDING',
    paymentPendingMessage:
      'Your 15,000 HTG payment receipt has been submitted. Uploading a receipt does not automatically approve the account. Aprantisaj se lò Akademi (ASLA) Administration will verify the receipt and approve classroom access.',
    protectedClassroomBlockedTitle: 'Protected Classroom Access Restricted',
    protectedClassroomBlockedMessage:
      'Pending, rejected, or suspended students cannot enter protected academic classrooms until Aprantisaj se lò Akademi (ASLA) Administration approves their registration and 15,000 HTG payment.',
    previous: '← Previous',
    next: 'Next →',
    reviewChapter: '← Review Chapter',
    startChapterQuiz: 'Start Chapter Quiz →',
    academicYearLabel: 'Academic Year 2026–2027',
    gradesSupportedNote: 'Official Aprantisaj se lò Akademi (ASLA) Academic Levels: Grade 7 through Grade 12',
    gradeRestrictionNote: 'Students are strictly assigned to the books and curriculum of their enrolled grade.',
  },
};
