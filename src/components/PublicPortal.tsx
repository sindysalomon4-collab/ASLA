import React, { useState } from 'react';
import {
  AccountType,
  ASLA_GRADES,
  ClassroomRecord,
  GradeLevel,
  Language,
  ParentAccount,
  PaymentTransaction,
  SchoolSettings,
  StudentAccount,
  SubjectDefinition,
} from '../types';
import { TRANSLATIONS } from '../i18n/translations';
import { ASLA_IMAGES } from '../data/seedData';
import { GRADE_COMPLEXITY_PROFILE } from '../data/syllabusMatrix';
import { AslaLogo } from './AslaLogo';
import {
  BookOpen,
  CheckCircle2,
  Eye,
  EyeOff,
  FileText,
  GraduationCap,
  Lock,
  ShieldCheck,
  Upload,
  Users,
  X,
} from 'lucide-react';

export type PublicSubView = 'WELCOME' | 'SIGN_IN' | 'SIGN_UP' | 'PAYMENT' | 'PAYMENT_PENDING';

export type InfoModalType = 'About' | 'Contact' | 'Help' | 'Privacy' | 'Terms' | null;

interface PublicPortalProps {
  language: Language;
  onChangeLanguage: (lang: Language) => void;
  subView: PublicSubView;
  onChangeSubView: (view: PublicSubView) => void;
  students: StudentAccount[];
  parents: ParentAccount[];
  classrooms: ClassroomRecord[];
  subjects: SubjectDefinition[];
  settings: SchoolSettings;
  onSignInSuccess: (role: AccountType, userId: string) => void;
  onGoogleSignIn: (role: AccountType) => Promise<void>;
  onRegisterStudentAndProceedToPayment: (newStudent: StudentAccount) => void;
  onRegisterParentAndProceedToPayment: (newParent: ParentAccount, childStudent: StudentAccount) => void;
  onSubmitPaymentReceipt: (payment: PaymentTransaction) => void;
  pendingRegistrationStudent: StudentAccount | null;
}

export const PublicPortal: React.FC<PublicPortalProps> = ({
  language,
  onChangeLanguage,
  subView,
  onChangeSubView,
  students,
  parents,
  classrooms,
  subjects,
  settings,
  onSignInSuccess,
  onGoogleSignIn,
  onRegisterStudentAndProceedToPayment,
  onRegisterParentAndProceedToPayment,
  onSubmitPaymentReceipt,
  pendingRegistrationStudent,
}) => {
  const t = TRANSLATIONS[language];

  // Info modal state (About, Contact, Help, Privacy, Terms)
  const [activeInfoModal, setActiveInfoModal] = useState<InfoModalType>(null);
  const [selectedCatalogGrade, setSelectedCatalogGrade] = useState<GradeLevel>('Grade 7');
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [catalogModalOpen, setCatalogModalOpen] = useState(false);

  // Sign In state
  const [signInRole, setSignInRole] = useState<AccountType>('Student');
  const [signInIdentifier, setSignInIdentifier] = useState('kendrick@asla.edu.ht');
  const [signInPassword, setSignInPassword] = useState('asla123');
  const [showSignInPassword, setShowSignInPassword] = useState(false);
  const [signInError, setSignInError] = useState('');
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  // Sign Up state
  const [signUpType, setSignUpType] = useState<'Student' | 'Parent'>('Student');
  const [stuFullName, setStuFullName] = useState('');
  const [stuDob, setStuDob] = useState('2011-05-12');
  const [stuEmail, setStuEmail] = useState('');
  const [stuPhone, setStuPhone] = useState('+509 ');
  const [stuPassword, setStuPassword] = useState('');
  const [stuConfirmPassword, setStuConfirmPassword] = useState('');
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);
  const [stuGrade, setStuGrade] = useState<GradeLevel>('Grade 8');
  const [stuClassroom, setStuClassroom] = useState('8yèm A — Toussaint Louverture');
  const [stuParentName, setStuParentName] = useState('');
  const [stuParentContact, setStuParentContact] = useState('+509 ');
  const [signUpError, setSignUpError] = useState('');

  // Parent Sign Up fields
  const [parFullName, setParFullName] = useState('');
  const [parEmail, setParEmail] = useState('');
  const [parPhone, setParPhone] = useState('+509 ');
  const [parPassword, setParPassword] = useState('');
  const [parConfirmPassword, setParConfirmPassword] = useState('');
  const [parChildName, setParChildName] = useState('');
  const [parChildDob, setParChildDob] = useState('2012-03-18');
  const [parChildGrade, setParChildGrade] = useState<GradeLevel>('Grade 7');
  const [parChildClassroom, setParChildClassroom] = useState('7yèm A — Jean-Jacques Dessalines');

  // Payment state (15,000 HTG)
  const [paymentMethod, setPaymentMethod] = useState<'MonCash' | 'Natcash' | 'Sogebank' | 'BNC' | 'Unibank'>('MonCash');
  const [transactionNumber, setTransactionNumber] = useState('');
  const [receiptFileName, setReceiptFileName] = useState('');
  const [receiptDataUrl, setReceiptDataUrl] = useState<string | undefined>(undefined);
  const [paymentError, setPaymentError] = useState('');
  const [lastSubmittedPayment, setLastSubmittedPayment] = useState<PaymentTransaction | null>(null);

  const handleSelectGradeForSignUp = (g: GradeLevel, isParentForm: boolean) => {
    const matchingRooms = classrooms.filter((c) => c.grade === g);
    const defaultRoom = matchingRooms[0]?.name || `${g} — Sal A`;
    if (isParentForm) {
      setParChildGrade(g);
      setParChildClassroom(defaultRoom);
    } else {
      setStuGrade(g);
      setStuClassroom(defaultRoom);
    }
  };

  const handleSignInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSignInError('');
    const cleanId = signInIdentifier.trim().toLowerCase();

    if (!cleanId || !signInPassword) {
      setSignInError('Tanpri antre imèl/non itilizatè ak modpas ou.');
      return;
    }

    if (signInRole === 'Administration') {
      const isSindy =
        cleanId === 'sindy salomon' ||
        cleanId === 'sindysalomon' ||
        cleanId === 'sindysalomon4@gmail.com';
      if (isSindy && signInPassword === 'Salomon2026') {
        onSignInSuccess('Administration', 'admin-sindy-salomon');
        return;
      }
      setSignInError(
        'Kredansyèl Administrasyon pa rekonèt. Tanpri verifye non itilizatè ak modpas Administratè a.'
      );
      return;
    }

    if (signInRole === 'Student') {
      const foundStudent =
        students.find(
          (s) =>
            s.email.toLowerCase() === cleanId ||
            s.fullName.toLowerCase().includes(cleanId) ||
            s.studentCode.toLowerCase() === cleanId
        ) || students[1];
      onSignInSuccess('Student', foundStudent.id);
      return;
    }

    if (signInRole === 'Parent') {
      const foundParent =
        parents.find(
          (p) => p.email.toLowerCase() === cleanId || p.fullName.toLowerCase().includes(cleanId)
        ) || parents[0];
      onSignInSuccess('Parent', foundParent.id);
    }
  };

  const handleStudentSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSignUpError('');
    if (!stuFullName.trim() || !stuEmail.trim() || !stuPhone.trim() || !stuParentName.trim() || !stuParentContact.trim()) {
      setSignUpError('Tanpri ranpli tout chan obligatwa yo (Non, Imèl, Telefòn, Klas 7–12, ak Enfòmasyon Paran).');
      return;
    }
    if (!stuPassword || stuPassword.length < 4) {
      setSignUpError('Modpas la dwe gen omwen 4 karaktè.');
      return;
    }
    if (stuPassword !== stuConfirmPassword) {
      setSignUpError('Modpas la ak konfimasyon modpas la pa menm.');
      return;
    }

    const gradeNum = stuGrade.replace('Grade ', '');
    const newStudent: StudentAccount = {
      id: `stu-${Date.now()}`,
      studentCode: `ASLA-2026-${gradeNum.padStart(2, '0')}${Math.floor(10 + Math.random() * 89)}`,
      fullName: stuFullName.trim(),
      dateOfBirth: stuDob,
      email: stuEmail.trim(),
      phone: stuPhone.trim(),
      passwordHash: stuPassword,
      grade: stuGrade,
      classroom: stuClassroom,
      parentName: stuParentName.trim(),
      parentContact: stuParentContact.trim(),
      approvalStatus: 'Pending',
      paymentStatus: 'Pending',
      academicYear: settings.academicYear,
      completedLessonIds: [],
      currentSubjectId: `subj-g${gradeNum}-math`,
      currentChapterNumber: 1,
      currentLessonNumber: 1,
      createdAt: new Date().toISOString().slice(0, 10),
    };

    onRegisterStudentAndProceedToPayment(newStudent);
  };

  const handleParentSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSignUpError('');
    if (!parFullName.trim() || !parEmail.trim() || !parPhone.trim() || !parChildName.trim()) {
      setSignUpError('Tanpri ranpli tout chan obligatwa pou Paran an ak Elèv la.');
      return;
    }
    if (!parPassword || parPassword.length < 4) {
      setSignUpError('Modpas la dwe gen omwen 4 karaktè.');
      return;
    }
    if (parPassword !== parConfirmPassword) {
      setSignUpError('Modpas la ak konfimasyon modpas la pa menm.');
      return;
    }

    const gradeNum = parChildGrade.replace('Grade ', '');
    const childId = `stu-${Date.now()}`;
    const parentId = `par-${Date.now()}`;

    const childStudent: StudentAccount = {
      id: childId,
      studentCode: `ASLA-2026-${gradeNum.padStart(2, '0')}${Math.floor(10 + Math.random() * 89)}`,
      fullName: parChildName.trim(),
      dateOfBirth: parChildDob,
      email: `${parChildName.trim().toLowerCase().replace(/\s+/g, '.')}@asla.edu.ht`,
      phone: parPhone.trim(),
      passwordHash: parPassword,
      grade: parChildGrade,
      classroom: parChildClassroom,
      parentName: parFullName.trim(),
      parentContact: `${parPhone.trim()} / ${parEmail.trim()}`,
      parentId,
      approvalStatus: 'Pending',
      paymentStatus: 'Pending',
      academicYear: settings.academicYear,
      completedLessonIds: [],
      currentSubjectId: `subj-g${gradeNum}-math`,
      currentChapterNumber: 1,
      currentLessonNumber: 1,
      createdAt: new Date().toISOString().slice(0, 10),
    };

    const newParent: ParentAccount = {
      id: parentId,
      fullName: parFullName.trim(),
      email: parEmail.trim(),
      phone: parPhone.trim(),
      passwordHash: parPassword,
      childrenIds: [childId],
      createdAt: new Date().toISOString().slice(0, 10),
    };

    onRegisterParentAndProceedToPayment(newParent, childStudent);
  };

  const handleReceiptFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setReceiptFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setReceiptDataUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentError('');
    if (!transactionNumber.trim()) {
      setPaymentError('Tanpri antre Nimewo Tranzaksyon / Referans pèman 15,000 HTG a.');
      return;
    }
    if (!receiptFileName.trim()) {
      setPaymentError('Tanpri telechaje resi pèman an (foto oswa PDF) pou verifikasyon Administrasyon an.');
      return;
    }

    const targetStudent = pendingRegistrationStudent || students.find((s) => s.paymentStatus === 'Pending') || students[0];
    const newPayment: PaymentTransaction = {
      id: `pay-${Date.now()}`,
      studentId: targetStudent.id,
      studentName: targetStudent.fullName,
      grade: targetStudent.grade,
      classroom: targetStudent.classroom,
      parentName: targetStudent.parentName,
      parentContact: targetStudent.parentContact,
      amountHtg: 15000,
      paymentMethod,
      transactionNumber: transactionNumber.trim(),
      receiptFileName: receiptFileName.trim(),
      receiptDataUrl,
      date: new Date().toISOString().slice(0, 10),
      status: 'Pending',
    };

    setLastSubmittedPayment(newPayment);
    onSubmitPaymentReceipt(newPayment);
  };

  const catalogSubjects = subjects.filter((s) => s.grade === selectedCatalogGrade);

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#0F172A]">
      {/* Top Navigation Bar matching ASLA Reference Mockup */}
      <header className="relative z-30 bg-white border-b border-slate-200 px-6 lg:px-12 h-24 flex items-center justify-between">
        {/* Left: Official ASLA Crest Shield Logo & Brand Title */}
        <button
          onClick={() => onChangeSubView('WELCOME')}
          className="flex items-center gap-3 text-left cursor-pointer group relative"
        >
          <AslaLogo size="lg" theme="light" subtitle="Aprantisaj se lò Akademi" />
        </button>

        {/* Center Navigation Links */}
        <nav className="hidden lg:flex items-center gap-8 text-[15px] font-medium text-[#0B3B75]">
          <button
            onClick={() => onChangeSubView('WELCOME')}
            className="hover:text-[#062347] hover:underline underline-offset-4 transition-colors whitespace-nowrap cursor-pointer"
          >
            {language === 'fr' ? 'Accueil' : language === 'en' ? 'Home' : 'Kay'}
          </button>
          <button
            onClick={() => setActiveInfoModal('About')}
            className="hover:text-[#062347] hover:underline underline-offset-4 transition-colors whitespace-nowrap cursor-pointer"
          >
            {language === 'fr' ? 'À propos d’ASLA' : language === 'en' ? 'About ASLA' : 'Sou ASLA'}
          </button>
          <button
            onClick={() => setActiveInfoModal('Contact')}
            className="hover:text-[#062347] hover:underline underline-offset-4 transition-colors whitespace-nowrap cursor-pointer"
          >
            {language === 'fr' ? 'Contact' : language === 'en' ? 'Contact' : 'Kontakte'}
          </button>
          <button
            onClick={() => setActiveInfoModal('Help')}
            className="hover:text-[#062347] hover:underline underline-offset-4 transition-colors whitespace-nowrap cursor-pointer"
          >
            {language === 'fr' ? 'Aide' : language === 'en' ? 'Help' : 'Èd'}
          </button>
          <button
            onClick={() => setActiveInfoModal('Privacy')}
            className="hover:text-[#062347] hover:underline underline-offset-4 transition-colors whitespace-nowrap cursor-pointer"
          >
            {language === 'fr'
              ? 'Confidentialité'
              : language === 'en'
              ? 'Privacy Policy'
              : 'Règleman sou vi prive'}
          </button>
          <button
            onClick={() => setActiveInfoModal('Terms')}
            className="hover:text-[#062347] hover:underline underline-offset-4 transition-colors whitespace-nowrap cursor-pointer"
          >
            {language === 'fr'
              ? 'Conditions d’utilisation'
              : language === 'en'
              ? 'Terms & Conditions'
              : 'Tèm ak kondisyon'}
          </button>
        </nav>

        {/* Right: Language Dropdown with Haitian Flag Icon */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setLangDropdownOpen(!langDropdownOpen)}
            className="flex items-center gap-2.5 px-4 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-sm font-semibold text-[#0B3B75] shadow-2xs cursor-pointer"
          >
            {/* Circular Haitian Flag SVG */}
            <svg viewBox="0 0 32 32" className="w-5 h-5 rounded-full shrink-0 overflow-hidden">
              <rect x="0" y="0" width="32" height="16" fill="#00209F" />
              <rect x="0" y="16" width="32" height="16" fill="#D21034" />
              <rect x="11" y="12" width="10" height="8" fill="#FFFFFF" rx="1" />
              <circle cx="16" cy="16" r="2.2" fill="#15803D" />
            </svg>
            <span>
              {language === 'ht' ? 'Kreyòl' : language === 'fr' ? 'Français' : 'English'}
            </span>
            <svg
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-4 h-4 text-[#0B3B75]"
            >
              <path
                fillRule="evenodd"
                d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          {langDropdownOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white rounded-xl border border-slate-200 shadow-lg py-1.5 z-50">
              <button
                type="button"
                onClick={() => {
                  onChangeLanguage('ht');
                  setLangDropdownOpen(false);
                }}
                className={`w-full text-left px-4 py-2 text-xs font-semibold flex items-center justify-between cursor-pointer ${
                  language === 'ht' ? 'bg-slate-100 text-[#0B3B75]' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>Kreyòl Ayisyen</span>
                {language === 'ht' && <span>✓</span>}
              </button>
              <button
                type="button"
                onClick={() => {
                  onChangeLanguage('fr');
                  setLangDropdownOpen(false);
                }}
                className={`w-full text-left px-4 py-2 text-xs font-semibold flex items-center justify-between cursor-pointer ${
                  language === 'fr' ? 'bg-slate-100 text-[#0B3B75]' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>Français</span>
                {language === 'fr' && <span>✓</span>}
              </button>
              <button
                type="button"
                onClick={() => {
                  onChangeLanguage('en');
                  setLangDropdownOpen(false);
                }}
                className={`w-full text-left px-4 py-2 text-xs font-semibold flex items-center justify-between cursor-pointer ${
                  language === 'en' ? 'bg-slate-100 text-[#0B3B75]' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>English</span>
                {language === 'en' && <span>✓</span>}
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col">
        {subView === 'WELCOME' && (
          <div className="flex-1 flex flex-col">
            {/* Full-Width Hero Banner matching Reference Mockup */}
            <section className="relative w-full min-h-[500px] lg:min-h-[560px] bg-[#07346E] overflow-hidden flex items-center">
              {/* Background Student Photograph */}
              <img
                src={ASLA_IMAGES.studentsHeroBanner}
                alt="Elèv ASLA nan lakou lekòl la ak drapo Ayiti"
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover object-center"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />

              {/* Smooth Royal Blue Scrim on Left for Text Legibility */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#062C5E]/95 via-[#083A7A]/75 to-transparent" />

              {/* Hero Content Container */}
              <div className="relative z-10 max-w-7xl mx-auto w-full px-6 lg:px-12 py-14 lg:py-20">
                <div className="max-w-xl space-y-4">
                  <div className="space-y-1">
                    <h1 className="text-4xl sm:text-5xl lg:text-[60px] font-extrabold text-white tracking-tight leading-none">
                      {language === 'fr'
                        ? 'Bienvenue à'
                        : language === 'en'
                        ? 'Welcome to'
                        : 'Byenveni nan'}
                    </h1>
                    <div className="text-6xl sm:text-7xl lg:text-[86px] font-black text-[#FACC15] tracking-tight leading-none pt-1">
                      ASLA
                    </div>
                    <div className="text-lg sm:text-xl font-bold text-amber-200 tracking-wide pt-1">
                      Aprantisaj se lò Akademi
                    </div>
                  </div>

                  <p className="text-lg sm:text-xl lg:text-[23px] font-semibold text-white leading-snug pt-2">
                    {language === 'fr'
                      ? 'Une plateforme éducative haïtienne pour les élèves, les parents et l’administration.'
                      : language === 'en'
                      ? 'A Haitian educational platform for students, parents, and administration.'
                      : 'Yon platfòm edikasyon ayisyen pou elèv, paran ak administrasyon.'}
                  </p>

                  {/* Gold Accent Divider */}
                  <div className="w-16 h-1.5 bg-[#FACC15] rounded-full my-3" />

                  {/* Italic Motto */}
                  <p className="text-base sm:text-lg italic text-white/95 font-normal">
                    {language === 'fr'
                      ? 'L’éducation aujourd’hui, un meilleur demain.'
                      : language === 'en'
                      ? 'Education today, a better tomorrow.'
                      : 'Edikasyon jodi a, yon pi bon demen.'}
                  </p>

                  {/* SIGN IN & SIGN UP Pill Buttons */}
                  <div className="flex flex-wrap items-center gap-5 pt-5">
                    <button
                      onClick={() => onChangeSubView('SIGN_IN')}
                      className="px-8 py-3.5 rounded-full bg-[#FACC15] hover:bg-[#EAB308] text-[#0B3B75] font-extrabold text-base tracking-wide shadow-lg flex items-center gap-3 transition-transform active:scale-95 cursor-pointer whitespace-nowrap"
                    >
                      {/* User Plus Icon */}
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-[#0B3B75]">
                        <path d="M10 12a4 4 0 100-8 4 4 0 000 8zm0 2c-4.42 0-8 1.79-8 4v2h16v-2c0-2.21-3.58-4-8-4zm9-4V7h-2v3h-3v2h3v3h2v-3h3v-2h-3z" />
                      </svg>
                      <span>SIGN IN</span>
                    </button>

                    <button
                      onClick={() => onChangeSubView('SIGN_UP')}
                      className="px-8 py-3.5 rounded-full bg-[#09356E]/90 hover:bg-[#0B3B75] text-white border-2 border-white font-extrabold text-base tracking-wide shadow-lg flex items-center gap-3 transition-transform active:scale-95 cursor-pointer whitespace-nowrap"
                    >
                      {/* User Plus Icon */}
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-white">
                        <path d="M10 12a4 4 0 100-8 4 4 0 000 8zm0 2c-4.42 0-8 1.79-8 4v2h16v-2c0-2.21-3.58-4-8-4zm9-4V7h-2v3h-3v2h3v3h2v-3h3v-2h-3z" />
                      </svg>
                      <span>SIGN UP</span>
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* 5-Column Feature Highlights Strip directly below Hero */}
            <section className="bg-white py-10 lg:py-12 flex-1 flex items-center">
              <div className="max-w-7xl mx-auto w-full px-6 lg:px-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 divide-y sm:divide-y-0 sm:divide-x divide-slate-200">
                  {/* Column 1: Edikasyon */}
                  <button
                    type="button"
                    onClick={() => setCatalogModalOpen(true)}
                    className="px-4 py-4 flex flex-col items-center text-center group cursor-pointer"
                  >
                    <div className="h-16 flex items-center justify-center mb-3">
                      <svg viewBox="0 0 64 64" className="w-16 h-16">
                        <polygon points="32,12 6,25 32,38 58,25" fill="#0B3B75" />
                        <path d="M16,32 L16,46 C16,52 48,52 48,46 L48,32 L32,40 Z" fill="#0B3B75" />
                        <path d="M51,28 L51,44" stroke="#FACC15" strokeWidth="3.5" strokeLinecap="round" />
                        <circle cx="51" cy="46" r="3.5" fill="#FACC15" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-extrabold text-[#0B3B75] group-hover:underline">
                      Edikasyon
                    </h3>
                    <p className="text-sm text-[#0B3B75]/85 mt-1">Kalifye pou lavni</p>
                  </button>

                  {/* Column 2: Kontni konplè */}
                  <button
                    type="button"
                    onClick={() => setCatalogModalOpen(true)}
                    className="px-4 py-4 flex flex-col items-center text-center group cursor-pointer"
                  >
                    <div className="h-16 flex items-center justify-center mb-3">
                      <svg viewBox="0 0 64 64" className="w-16 h-16">
                        <path
                          d="M10,16 Q21,12 32,18 Q43,12 54,16 L54,48 Q43,44 32,50 Q21,44 10,48 Z"
                          fill="#FFFFFF"
                          stroke="#0B3B75"
                          strokeWidth="4"
                          strokeLinejoin="round"
                        />
                        <line x1="32" y1="18" x2="32" y2="50" stroke="#0B3B75" strokeWidth="4" />
                        <line x1="16" y1="24" x2="26" y2="23" stroke="#0B3B75" strokeWidth="3" strokeLinecap="round" />
                        <line x1="16" y1="31" x2="26" y2="30" stroke="#0B3B75" strokeWidth="3" strokeLinecap="round" />
                        <line x1="16" y1="38" x2="26" y2="37" stroke="#0B3B75" strokeWidth="3" strokeLinecap="round" />
                        <line x1="38" y1="23" x2="48" y2="24" stroke="#FACC15" strokeWidth="3.5" strokeLinecap="round" />
                        <line x1="38" y1="30" x2="48" y2="31" stroke="#FACC15" strokeWidth="3.5" strokeLinecap="round" />
                        <line x1="38" y1="37" x2="48" y2="38" stroke="#FACC15" strokeWidth="3.5" strokeLinecap="round" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-extrabold text-[#0B3B75] group-hover:underline">
                      Kontni konplè
                    </h3>
                    <p className="text-sm text-[#0B3B75]/85 mt-1">
                      Liv, leson, egzèsis, evalyasyon
                    </p>
                  </button>

                  {/* Column 3: Pou tout moun */}
                  <button
                    type="button"
                    onClick={() => onChangeSubView('SIGN_IN')}
                    className="px-4 py-4 flex flex-col items-center text-center group cursor-pointer"
                  >
                    <div className="h-16 flex items-center justify-center mb-3">
                      <svg viewBox="0 0 64 64" className="w-16 h-16">
                        {/* Side Persons (Navy) */}
                        <circle cx="16" cy="26" r="6" fill="#0B3B75" />
                        <path d="M6,46 C6,39 20,39 22,46 Z" fill="#0B3B75" />
                        <circle cx="48" cy="26" r="6" fill="#0B3B75" />
                        <path d="M42,46 C44,39 58,39 58,46 Z" fill="#0B3B75" />
                        {/* Center Person (Gold) */}
                        <circle cx="32" cy="22" r="8" fill="#FACC15" />
                        <path d="M18,48 C18,38 46,38 46,48 Z" fill="#FACC15" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-extrabold text-[#0B3B75] group-hover:underline">
                      Pou tout moun
                    </h3>
                    <p className="text-sm text-[#0B3B75]/85 mt-1">
                      Elèv, paran, administrasyon
                    </p>
                  </button>

                  {/* Column 4: Sekirite */}
                  <button
                    type="button"
                    onClick={() => setActiveInfoModal('Privacy')}
                    className="px-4 py-4 flex flex-col items-center text-center group cursor-pointer"
                  >
                    <div className="h-16 flex items-center justify-center mb-3">
                      <svg viewBox="0 0 64 64" className="w-16 h-16">
                        <path
                          d="M32,10 L14,18 L14,32 C14,44 22,52 32,56 C42,52 50,44 50,32 L50,18 Z"
                          fill="none"
                          stroke="#0B3B75"
                          strokeWidth="4"
                          strokeLinejoin="round"
                        />
                        <polyline
                          points="24,33 30,39 41,26"
                          fill="none"
                          stroke="#FACC15"
                          strokeWidth="4.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg font-extrabold text-[#0B3B75] group-hover:underline">
                      Sekirite
                    </h3>
                    <p className="text-sm text-[#0B3B75]/85 mt-1">Pwoteksyon done ou yo</p>
                  </button>

                  {/* Column 5: Pwogrè */}
                  <button
                    type="button"
                    onClick={() => onChangeSubView('SIGN_IN')}
                    className="px-4 py-4 flex flex-col items-center text-center group cursor-pointer"
                  >
                    <div className="h-16 flex items-center justify-center mb-3">
                      <svg viewBox="0 0 64 64" className="w-16 h-16">
                        {/* Navy Bars */}
                        <rect x="14" y="38" width="8" height="14" rx="2" fill="#0B3B75" />
                        <rect x="28" y="30" width="8" height="22" rx="2" fill="#0B3B75" />
                        <rect x="42" y="22" width="8" height="30" rx="2" fill="#0B3B75" />
                        {/* Gold Rising Arrow */}
                        <polyline
                          points="14,30 28,22 35,25 48,12"
                          fill="none"
                          stroke="#FACC15"
                          strokeWidth="4"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <polyline
                          points="40,12 48,12 48,20"
                          fill="none"
                          stroke="#FACC15"
                          strokeWidth="4"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg font-extrabold text-[#0B3B75] group-hover:underline">
                      Pwogrè
                    </h3>
                    <p className="text-sm text-[#0B3B75]/85 mt-1">Siveye epi amelyore</p>
                  </button>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* SIGN IN VIEW */}
        {subView === 'SIGN_IN' && (
          <section className="max-w-xl mx-auto px-6 py-12">
            <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <AslaLogo size="md" showText={false} />
                  <div>
                    <p className="text-xs font-semibold text-[#B91C1C]">ASLA PORTAL ACCESS</p>
                    <h1 className="text-2xl font-bold text-[#0B2545] mt-0.5">{t.signIn}</h1>
                  </div>
                </div>
                <button
                  onClick={() => onChangeSubView('WELCOME')}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer whitespace-nowrap"
                >
                  {t.back}
                </button>
              </div>

              {/* Account Type Selector: Student, Parent, Administration */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-700">
                  Tip Kont (Account Type)
                </label>
                <div className="grid grid-cols-3 gap-2 p-1 bg-slate-100 rounded-lg border border-slate-200">
                  {(['Student', 'Parent', 'Administration'] as AccountType[]).map((role) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => {
                        setSignInRole(role);
                        setSignInError('');
                        if (role === 'Student') {
                          setSignInIdentifier('kendrick@asla.edu.ht');
                          setSignInPassword('asla123');
                        }
                        if (role === 'Parent') {
                          setSignInIdentifier('samuel.jb@asla.edu.ht');
                          setSignInPassword('asla123');
                        }
                        if (role === 'Administration') {
                          setSignInIdentifier('');
                          setSignInPassword('');
                        }
                      }}
                      className={`py-2 px-3 text-xs font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                        signInRole === role
                          ? 'bg-[#0B2545] text-white'
                          : 'text-slate-700 hover:text-slate-900'
                      }`}
                    >
                      {role === 'Student'
                        ? t.student
                        : role === 'Parent'
                        ? t.parent
                        : t.administration}
                    </button>
                  ))}
                </div>
              </div>

              {signInError && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 font-medium">
                  ! {signInError}
                </div>
              )}

              <form onSubmit={handleSignInSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    {t.emailOrUsername}
                  </label>
                  <input
                    type="text"
                    value={signInIdentifier}
                    onChange={(e) => setSignInIdentifier(e.target.value)}
                    placeholder="egz. kendrick@asla.edu.ht"
                    className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 focus:outline-none focus:border-[#0B2545]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    {t.password}
                  </label>
                  <div className="relative flex items-center">
                    <input
                      type={showSignInPassword ? 'text' : 'password'}
                      value={signInPassword}
                      onChange={(e) => setSignInPassword(e.target.value)}
                      className="w-full px-3.5 py-2.5 pr-20 text-sm rounded-lg border border-slate-300 focus:outline-none focus:border-[#0B2545]"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowSignInPassword(!showSignInPassword)}
                      className="absolute right-2.5 px-2 py-1 text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1 cursor-pointer"
                    >
                      {showSignInPassword ? (
                        <>
                          <EyeOff className="w-3.5 h-3.5" />
                          <span>{t.hidePassword}</span>
                        </>
                      ) : (
                        <>
                          <Eye className="w-3.5 h-3.5" />
                          <span>{t.showPassword}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setForgotPasswordOpen(!forgotPasswordOpen);
                      setForgotSent(false);
                    }}
                    className="font-semibold text-[#0B2545] hover:underline cursor-pointer"
                  >
                    {t.forgotPassword}
                  </button>
                  <button
                    type="button"
                    onClick={() => onChangeSubView('SIGN_UP')}
                    className="text-slate-600 hover:text-[#B91C1C] font-medium cursor-pointer"
                  >
                    Pa gen kont? {t.signUp} →
                  </button>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-4 text-sm font-semibold text-white bg-[#0B2545] rounded-lg hover:bg-[#133B6E] transition-colors cursor-pointer"
                >
                  {t.signIn} ({signInRole})
                </button>
              </form>

              {/* Google Auth Option */}
              <div className="pt-3 border-t border-slate-200 space-y-3">
                <button
                  type="button"
                  onClick={() => onGoogleSignIn(signInRole)}
                  className="w-full py-2.5 px-4 text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Konekte ak Google Auth ({signInRole})
                </button>

                {/* Quick Fill Account Presets */}
                <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
                  <p className="text-xs font-semibold text-slate-700">
                    Kont tès rapid (Klik pou ranpli otomatikman) :
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setSignInRole('Student');
                        setSignInIdentifier('kendrick@asla.edu.ht');
                        setSignInPassword('asla123');
                      }}
                      className="px-2.5 py-1 text-xs bg-white border border-slate-300 rounded hover:border-[#0B2545] cursor-pointer"
                    >
                      Elèv Grade 9 (Apwouve)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSignInRole('Student');
                        setSignInIdentifier('jovens@asla.edu.ht');
                        setSignInPassword('asla123');
                      }}
                      className="px-2.5 py-1 text-xs bg-white border border-slate-300 rounded hover:border-[#0B2545] cursor-pointer"
                    >
                      Elèv Grade 8 (Pending)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSignInRole('Parent');
                        setSignInIdentifier('samuel.jb@asla.edu.ht');
                        setSignInPassword('asla123');
                      }}
                      className="px-2.5 py-1 text-xs bg-white border border-slate-300 rounded hover:border-[#0B2545] cursor-pointer"
                    >
                      Paran (3 Timoun)
                    </button>
                  </div>
                </div>
              </div>

              {/* Forgot Password Drawer */}
              {forgotPasswordOpen && (
                <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-[#0B2545]">
                      Rekiperasyon Modpas ASLA (Forgot Password)
                    </h3>
                    <button
                      type="button"
                      onClick={() => setForgotPasswordOpen(false)}
                      className="text-xs text-slate-500 hover:text-slate-800 cursor-pointer"
                    >
                      {t.close}
                    </button>
                  </div>
                  {forgotSent ? (
                    <p className="text-xs text-emerald-700 font-medium">
                      ✓ Enstriksyon pou reyinisyalize modpas la voye sou {forgotEmail}.
                    </p>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        type="email"
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        placeholder="Antre imèl kont ou..."
                        className="flex-1 px-3 py-1.5 text-xs rounded border border-slate-300"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (forgotEmail.trim()) setForgotSent(true);
                        }}
                        className="px-3 py-1.5 text-xs font-semibold bg-[#0B2545] text-white rounded cursor-pointer whitespace-nowrap"
                      >
                        Voye Lyen
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </section>
        )}

        {/* SIGN UP VIEW */}
        {subView === 'SIGN_UP' && (
          <section className="max-w-3xl mx-auto px-6 py-10">
            <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <AslaLogo size="md" showText={false} />
                  <div>
                    <p className="text-xs font-semibold text-[#B91C1C]">
                      ENSKRIPSYON OFISYÈL ASLA · GRADES 7–12
                    </p>
                    <h1 className="text-2xl font-bold text-[#0B2545] mt-0.5">{t.signUp}</h1>
                  </div>
                </div>
                <button
                  onClick={() => onChangeSubView('WELCOME')}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer whitespace-nowrap"
                >
                  {t.back}
                </button>
              </div>

              {/* Registration Type Selector: Student vs Parent */}
              <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-lg border border-slate-200">
                <button
                  type="button"
                  onClick={() => {
                    setSignUpType('Student');
                    setSignUpError('');
                  }}
                  className={`py-2.5 px-4 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                    signUpType === 'Student' ? 'bg-[#0B2545] text-white' : 'text-slate-700'
                  }`}
                >
                  Enskripsyon Elèv (Student Registration)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSignUpType('Parent');
                    setSignUpError('');
                  }}
                  className={`py-2.5 px-4 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                    signUpType === 'Parent' ? 'bg-[#0B2545] text-white' : 'text-slate-700'
                  }`}
                >
                  Enskripsyon Paran (Parent Registration)
                </button>
              </div>

              {signUpError && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 font-medium">
                  ! {signUpError}
                </div>
              )}

              {signUpType === 'Student' ? (
                <form onSubmit={handleStudentSignUpSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        {t.fullName} *
                      </label>
                      <input
                        type="text"
                        value={stuFullName}
                        onChange={(e) => setStuFullName(e.target.value)}
                        placeholder="egz. Woodley Pierre"
                        className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        {t.dateOfBirth} *
                      </label>
                      <input
                        type="date"
                        value={stuDob}
                        onChange={(e) => setStuDob(e.target.value)}
                        className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        {t.email} *
                      </label>
                      <input
                        type="email"
                        value={stuEmail}
                        onChange={(e) => setStuEmail(e.target.value)}
                        placeholder="woodley@asla.edu.ht"
                        className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        {t.phone} *
                      </label>
                      <input
                        type="text"
                        value={stuPhone}
                        onChange={(e) => setStuPhone(e.target.value)}
                        placeholder="+509 3700-0000"
                        className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        {t.selectGrade} *
                      </label>
                      <select
                        value={stuGrade}
                        onChange={(e) => handleSelectGradeForSignUp(e.target.value as GradeLevel, false)}
                        className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 bg-white font-semibold text-[#0B2545]"
                      >
                        {ASLA_GRADES.map((g) => (
                          <option key={g} value={g}>
                            {g} ({GRADE_COMPLEXITY_PROFILE[g].haitianEquivalent})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        {t.selectClassroom} *
                      </label>
                      <select
                        value={stuClassroom}
                        onChange={(e) => setStuClassroom(e.target.value)}
                        className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 bg-white"
                      >
                        {classrooms
                          .filter((c) => c.grade === stuGrade)
                          .map((c) => (
                            <option key={c.id} value={c.name}>
                              {c.name}
                            </option>
                          ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        {t.parentGuardianName} *
                      </label>
                      <input
                        type="text"
                        value={stuParentName}
                        onChange={(e) => setStuParentName(e.target.value)}
                        placeholder="egz. Mme Rose-Marie Pierre"
                        className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        {t.parentGuardianContact} *
                      </label>
                      <input
                        type="text"
                        value={stuParentContact}
                        onChange={(e) => setStuParentContact(e.target.value)}
                        placeholder="+509 3800-1122"
                        className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        {t.password} *
                      </label>
                      <input
                        type={showSignUpPassword ? 'text' : 'password'}
                        value={stuPassword}
                        onChange={(e) => setStuPassword(e.target.value)}
                        className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        {t.confirmPassword} *
                      </label>
                      <div className="relative flex items-center">
                        <input
                          type={showSignUpPassword ? 'text' : 'password'}
                          value={stuConfirmPassword}
                          onChange={(e) => setStuConfirmPassword(e.target.value)}
                          className="w-full px-3.5 py-2 pr-16 text-sm rounded-lg border border-slate-300"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                          className="absolute right-2.5 text-xs font-semibold text-slate-600 cursor-pointer"
                        >
                          {showSignUpPassword ? t.hidePassword : t.showPassword}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600">
                    Nòt: ASLA sipòte espesyalman <strong>Grade 7 rive Grade 12</strong>. Apre enskripsyon an, w ap dirije sou paj pèman frè enskripsyon <strong>15,000 HTG</strong> a.
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 px-5 text-sm font-semibold text-white bg-[#B91C1C] rounded-lg hover:bg-[#991B1B] transition-colors cursor-pointer"
                  >
                    {t.proceedToPayment}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleParentSignUpSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Non Konplè Paran (Parent Full Name) *
                      </label>
                      <input
                        type="text"
                        value={parFullName}
                        onChange={(e) => setParFullName(e.target.value)}
                        placeholder="egz. Jean-Claude Moïse"
                        className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        {t.email} *
                      </label>
                      <input
                        type="email"
                        value={parEmail}
                        onChange={(e) => setParEmail(e.target.value)}
                        placeholder="jc.moise@asla.edu.ht"
                        className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        {t.phone} *
                      </label>
                      <input
                        type="text"
                        value={parPhone}
                        onChange={(e) => setParPhone(e.target.value)}
                        placeholder="+509 3400-0000"
                        className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          {t.password} *
                        </label>
                        <input
                          type="password"
                          value={parPassword}
                          onChange={(e) => setParPassword(e.target.value)}
                          className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          {t.confirmPassword} *
                        </label>
                        <input
                          type="password"
                          value={parConfirmPassword}
                          onChange={(e) => setParConfirmPassword(e.target.value)}
                          className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-200 space-y-4">
                    <h3 className="text-sm font-bold text-[#0B2545]">{t.childInformation}</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Non Konplè Elèv la (Child Full Name) *
                        </label>
                        <input
                          type="text"
                          value={parChildName}
                          onChange={(e) => setParChildName(e.target.value)}
                          placeholder="egz. Naïka Moïse"
                          className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Dat Nesans Elèv la *
                        </label>
                        <input
                          type="date"
                          value={parChildDob}
                          onChange={(e) => setParChildDob(e.target.value)}
                          className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          {t.selectGrade} *
                        </label>
                        <select
                          value={parChildGrade}
                          onChange={(e) =>
                            handleSelectGradeForSignUp(e.target.value as GradeLevel, true)
                          }
                          className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 bg-white font-semibold text-[#0B2545]"
                        >
                          {ASLA_GRADES.map((g) => (
                            <option key={g} value={g}>
                              {g} ({GRADE_COMPLEXITY_PROFILE[g].haitianEquivalent})
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          {t.selectClassroom} *
                        </label>
                        <select
                          value={parChildClassroom}
                          onChange={(e) => setParChildClassroom(e.target.value)}
                          className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 bg-white"
                        >
                          {classrooms
                            .filter((c) => c.grade === parChildGrade)
                            .map((c) => (
                              <option key={c.id} value={c.name}>
                                {c.name}
                              </option>
                            ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 px-5 text-sm font-semibold text-white bg-[#B91C1C] rounded-lg hover:bg-[#991B1B] transition-colors cursor-pointer"
                  >
                    {t.proceedToPayment}
                  </button>
                </form>
              )}
            </div>
          </section>
        )}

        {/* REGISTRATION PAYMENT VIEW (15,000 HTG) */}
        {subView === 'PAYMENT' && (
          <section className="max-w-2xl mx-auto px-6 py-10">
            <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <AslaLogo size="md" showText={false} />
                  <div>
                    <p className="text-xs font-semibold text-[#B91C1C]">ETAP 2 SOU 2 · PÈMAN ENSKRIPSYON</p>
                    <h1 className="text-2xl font-bold text-[#0B2545] mt-0.5 tabular-nums">
                      {t.registrationFeeTitle}
                    </h1>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onChangeSubView('SIGN_UP')}
                    className="px-3 py-1.5 text-xs font-semibold text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-100 cursor-pointer whitespace-nowrap"
                  >
                    {t.back}
                  </button>
                  <button
                    type="button"
                    onClick={() => onChangeSubView('WELCOME')}
                    className="px-3 py-1.5 text-xs font-semibold text-red-700 border border-red-200 rounded-lg hover:bg-red-50 cursor-pointer whitespace-nowrap"
                  >
                    {t.cancelExit}
                  </button>
                </div>
              </div>

              {pendingRegistrationStudent && (
                <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div>
                    <span className="text-slate-500">Elèv Enskri : </span>
                    <strong className="text-[#0B2545]">{pendingRegistrationStudent.fullName}</strong>
                    <span className="mx-2">·</span>
                    <strong className="text-[#B91C1C]">{pendingRegistrationStudent.grade}</strong>
                    <span className="mx-2">·</span>
                    <span>{pendingRegistrationStudent.classroom}</span>
                  </div>
                  <div className="font-mono font-semibold text-[#0B2545] tabular-nums">
                    Montan: 15,000 HTG
                  </div>
                </div>
              )}

              {/* Payment Instructions */}
              <div className="p-4 rounded-lg bg-[#0B2545]/5 border border-[#0B2545]/15 space-y-2 text-xs text-slate-700">
                <p className="font-bold text-[#0B2545]">Enstriksyon Pèman Ofisyèl (15,000 HTG) :</p>
                <p>{t.paymentInstructions}</p>
                <div className="pt-1 font-mono text-xs text-[#0B2545] space-y-1 tabular-nums">
                  <div>• MonCash : {settings.moncashMerchantNumber}</div>
                  <div>• Natcash : {settings.natcashMerchantNumber}</div>
                  <div>• Kont Bankè : {settings.bankAccountInfo}</div>
                </div>
              </div>

              {paymentError && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 font-medium">
                  ! {paymentError}
                </div>
              )}

              <form onSubmit={handlePaymentSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    {t.paymentMethod} *
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 bg-white font-semibold"
                  >
                    <option value="MonCash">MonCash (15,000 HTG)</option>
                    <option value="Natcash">Natcash (15,000 HTG)</option>
                    <option value="Sogebank">Sogebank — Depo / Virement (15,000 HTG)</option>
                    <option value="BNC">Banque Nationale de Crédit — BNC (15,000 HTG)</option>
                    <option value="Unibank">Unibank (15,000 HTG)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    {t.transactionRefNumber} *
                  </label>
                  <input
                    type="text"
                    value={transactionNumber}
                    onChange={(e) => setTransactionNumber(e.target.value)}
                    placeholder="egz. MC-20260929-741852"
                    className="w-full px-3.5 py-2.5 text-sm font-mono rounded-lg border border-slate-300"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    {t.receiptUpload} *
                  </label>
                  <div className="p-4 rounded-lg border border-dashed border-slate-300 bg-slate-50 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <label className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold bg-white border border-slate-300 rounded-lg hover:bg-slate-100 cursor-pointer">
                        <Upload className="w-4 h-4 text-[#0B2545]" />
                        <span>Chwazi Fichye Resi (Foto / PDF)</span>
                        <input
                          type="file"
                          accept="image/*,.pdf"
                          onChange={handleReceiptFileChange}
                          className="hidden"
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setReceiptFileName('resi_moncash_15000HTG_verifye.jpg');
                          if (!transactionNumber) {
                            setTransactionNumber(`MC-2026-${Math.floor(100000 + Math.random() * 899999)}`);
                          }
                        }}
                        className="px-3 py-1.5 text-xs font-medium text-[#0B2545] underline cursor-pointer"
                      >
                        Ranpli ak yon egzanp resi 15,000 HTG
                      </button>
                    </div>
                    {receiptFileName && (
                      <div className="text-xs font-mono text-emerald-700">
                        ✓ Fichye chwazi : {receiptFileName}
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => onChangeSubView('WELCOME')}
                    className="px-4 py-2.5 text-xs font-semibold text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-100 cursor-pointer"
                  >
                    {t.cancelExit}
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 px-6 text-sm font-semibold text-white bg-[#0B2545] rounded-lg hover:bg-[#133B6E] transition-colors cursor-pointer"
                  >
                    {t.submitPayment} (15,000 HTG)
                  </button>
                </div>
              </form>
            </div>
          </section>
        )}

        {/* PAYMENT PENDING VIEW */}
        {subView === 'PAYMENT_PENDING' && (
          <section className="max-w-2xl mx-auto px-6 py-12">
            <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="text-xs font-semibold text-amber-700">
                  ▲ STATI PÈMAN AK KONT : PAYMENT PENDING
                </div>
                <button
                  onClick={() => onChangeSubView('WELCOME')}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-100 cursor-pointer"
                >
                  {t.back}
                </button>
              </div>

              <div className="space-y-2">
                <h1 className="text-2xl font-bold text-[#0B2545]">{t.paymentPendingTitle}</h1>
                <p className="text-sm text-slate-600 leading-relaxed">{t.paymentPendingMessage}</p>
              </div>

              {lastSubmittedPayment && (
                <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2 text-xs font-mono tabular-nums">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Elèv :</span>
                    <span className="font-semibold text-slate-900">{lastSubmittedPayment.studentName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Klas :</span>
                    <span className="font-semibold text-[#0B2545]">
                      {lastSubmittedPayment.grade} ({lastSubmittedPayment.classroom})
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Montan :</span>
                    <span className="font-semibold text-slate-900">15,000 HTG</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Metòd & Referans :</span>
                    <span className="font-semibold text-slate-900">
                      {lastSubmittedPayment.paymentMethod} · {lastSubmittedPayment.transactionNumber}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Resi Telechaje :</span>
                    <span className="font-semibold text-slate-900">{lastSubmittedPayment.receiptFileName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Stati Verifikasyon :</span>
                    <span className="font-bold text-amber-700">▲ PENDING (Ap tann Administrasyon)</span>
                  </div>
                </div>
              )}

              <div className="flex flex-wrap items-center gap-3 pt-2">
                {pendingRegistrationStudent && (
                  <button
                    onClick={() => onSignInSuccess('Student', pendingRegistrationStudent.id)}
                    className="px-4 py-2.5 text-xs font-semibold bg-[#0B2545] text-white rounded-lg hover:bg-[#133B6E] cursor-pointer"
                  >
                    Antre nan Tablo Bò Elèv (Mòd Pending) →
                  </button>
                )}
                <button
                  onClick={() => {
                    setSignInRole('Administration');
                    setSignInIdentifier('');
                    setSignInPassword('');
                    setSignInError('');
                    onChangeSubView('SIGN_IN');
                  }}
                  className="px-4 py-2.5 text-xs font-semibold bg-[#B91C1C] text-white rounded-lg hover:bg-[#991B1B] cursor-pointer"
                >
                  Konekte kòm Administrasyon pou Verifye & Apwouve Pèman sa a →
                </button>
                <button
                  onClick={() => onChangeSubView('WELCOME')}
                  className="px-4 py-2.5 text-xs font-semibold text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-100 cursor-pointer"
                >
                  {t.exit}
                </button>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Dark Navy Public Footer matching Reference Mockup */}
      <footer className="bg-[#082F5E] text-white px-6 lg:px-12 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <div>Aprantisaj se lò Akademi (ASLA) © 2026. Tout dwa rezève.</div>

          <div className="flex flex-wrap items-center justify-center gap-2 text-white/90">
            <button
              onClick={() => setActiveInfoModal('About')}
              className="hover:underline cursor-pointer"
            >
              Sou ASLA
            </button>
            <span className="opacity-50">|</span>
            <button
              onClick={() => setActiveInfoModal('Contact')}
              className="hover:underline cursor-pointer"
            >
              Kontakte
            </button>
            <span className="opacity-50">|</span>
            <button
              onClick={() => setActiveInfoModal('Help')}
              className="hover:underline cursor-pointer"
            >
              Èd
            </button>
            <span className="opacity-50">|</span>
            <button
              onClick={() => setActiveInfoModal('Privacy')}
              className="hover:underline cursor-pointer"
            >
              Règleman sou vi prive
            </button>
            <span className="opacity-50">|</span>
            <button
              onClick={() => setActiveInfoModal('Terms')}
              className="hover:underline cursor-pointer"
            >
              Tèm ak kondisyon
            </button>
          </div>

          <div className="flex items-center gap-2 text-white/90">
            <button
              onClick={() => onChangeLanguage('ht')}
              className="underline hover:text-[#FACC15] cursor-pointer"
            >
              Kreyòl
            </button>
            <span className="opacity-50">|</span>
            <button
              onClick={() => onChangeLanguage('fr')}
              className="underline hover:text-[#FACC15] cursor-pointer"
            >
              Français
            </button>
            <span className="opacity-50">|</span>
            <button
              onClick={() => onChangeLanguage('en')}
              className="underline hover:text-[#FACC15] cursor-pointer"
            >
              English
            </button>
          </div>
        </div>
      </footer>

      {/* Interactive Academic Catalog Modal (Grades 7–12) */}
      {catalogModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-5xl w-full p-6 sm:p-8 space-y-6 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
              <div>
                <p className="text-xs font-bold text-[#0B3B75]">KATALOG AKADEMIK OFISYÈL ASLA</p>
                <h3 className="text-2xl font-extrabold text-[#0B3B75]">
                  Nivo Akademik : Grade 7 rive Grade 12
                </h3>
              </div>
              <button
                onClick={() => setCatalogModalOpen(false)}
                className="px-3 py-1.5 text-xs font-semibold text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                {t.close}
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-slate-100 rounded-xl">
              {ASLA_GRADES.map((g) => (
                <button
                  key={g}
                  onClick={() => setSelectedCatalogGrade(g)}
                  className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                    selectedCatalogGrade === g
                      ? 'bg-[#0B3B75] text-white'
                      : 'text-slate-700 hover:text-[#0B3B75]'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {catalogSubjects.map((subj) => (
                <div
                  key={subj.id}
                  className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between"
                >
                  <div>
                    <div className="text-xs font-mono text-slate-500">
                      {subj.code} · {selectedCatalogGrade}
                    </div>
                    <h4 className="text-base font-bold text-[#0B3B75] mt-1">{subj.nameEn}</h4>
                    <p className="text-xs font-semibold text-slate-700">{subj.nameHt}</p>
                    <p className="text-xs text-slate-600 mt-2">{subj.descriptionHt}</p>
                  </div>
                  <div className="mt-4 pt-2 border-t border-slate-200 text-xs font-mono text-slate-500 flex justify-between">
                    <span>16 Chapit · 96 Leson</span>
                    <span>{GRADE_COMPLEXITY_PROFILE[selectedCatalogGrade].targetPages} p.</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal for About, Contact, Help, Privacy, Terms */}
      {activeInfoModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-slate-200 max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-lg font-bold text-[#0B2545]">
                Aprantisaj se lò Akademi (ASLA) — {activeInfoModal}
              </h3>
              <button
                onClick={() => setActiveInfoModal(null)}
                className="px-2.5 py-1 text-xs font-semibold text-slate-600 border border-slate-200 rounded hover:bg-slate-100 cursor-pointer"
              >
                {t.close}
              </button>
            </div>
            <div className="text-sm text-slate-700 space-y-3 leading-relaxed">
              {activeInfoModal === 'About' && (
                <>
                  <p>
                    <strong>Aprantisaj se lò Akademi (ASLA)</strong> se yon enstitisyon edikasyonèl ayisyen ki konsakre nan ekselans akademik pou elèv <strong>Grade 7 rive Grade 12</strong> (7yèm Ane Fondamantal rive Philo / Terminale).
                  </p>
                  <p>
                    Chak nivo gen 9 matyè ofisyèl (enkli <strong>Istwa D Ayiti</strong> kòm yon matyè apa) ak liv konplè (16 chapit, 96 leson, egzèsis pratik, devwa lakay, quiz chapit ak egzamen final).
                  </p>
                </>
              )}
              {activeInfoModal === 'Contact' && (
                <>
                  <p><strong>Adrès Kanpis :</strong> {settings.campusAddress}</p>
                  <p><strong>Telefòn Direksyon :</strong> {settings.contactPhone}</p>
                  <p><strong>Imèl Ofisyèl :</strong> {settings.contactEmail}</p>
                  <p><strong>Orè Biwo :</strong> Lendi – Vandredi, 07:30 AM – 04:30 PM</p>
                </>
              )}
              {activeInfoModal === 'Help' && (
                <>
                  <p>
                    <strong>Gid Enskripsyon ak Aksè :</strong> 1) Enskri kòm Elèv (Grades 7–12) oswa Paran; 2) Peye frè enskripsyon 15,000 HTG a epi telechaje resi a; 3) Administrasyon ASLA verifye resi a epi apwouve kont lan pou debloke sal klas la.
                  </p>
                </>
              )}
              {activeInfoModal === 'Privacy' && (
                <>
                  <p>
                    <strong>Politik Konfidansyalite ASLA :</strong> Tout enfòmasyon pèsonèl elèv yo, nòt ofisyèl yo, ak resi pèman 15,000 HTG yo pwoteje pa règ sekirite strik. Sèlman elèv la, paran li ki otorize, ak Administrasyon ASLA ki ka wè dosye prive yo.
                  </p>
                </>
              )}
              {activeInfoModal === 'Terms' && (
                <>
                  <p>
                    <strong>Kondisyon Itilizasyon ASLA :</strong> Elèv yo dwe swiv sèlman liv ak sal klas nivo yo asiyen an (Grade 7–12). Telechaje yon resi pèman pa apwouve kont lan otomatikman; verifikasyon Administrasyon an obligatwa.
                  </p>
                </>
              )}
            </div>
            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setActiveInfoModal(null)}
                className="px-4 py-2 text-xs font-semibold bg-[#0B2545] text-white rounded-lg cursor-pointer"
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
