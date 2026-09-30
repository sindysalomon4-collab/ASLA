import React, { useMemo, useState } from 'react';
import {
  AslaPaymentType,
  ExamPrepPaymentRecord,
  ExamPrepStudentType,
  Language,
  PaymentTransaction,
  StudentAccount,
} from '../types';
import { getStudentExamPrepFee } from '../data/examPrepData';
import { CheckCircle2, Clock, AlertTriangle, XCircle, ShieldCheck } from 'lucide-react';

interface StudentPaymentCenterProps {
  language: Language;
  student: StudentAccount;
  tuitionPayments: PaymentTransaction[];
  examPrepPayments: ExamPrepPaymentRecord[];
  initialPaymentType?: AslaPaymentType;
  onSubmitTuitionReceipt: (payload: {
    paymentReference: string;
    transactionNumber: string;
    amountHtg: number;
    paymentDate: string;
    natcashNumber: string;
    receiptFileName: string;
    receiptDataUrl?: string;
  }) => void;
  onSubmitExamPrepReceipt: (
    payload: Omit<ExamPrepPaymentRecord, 'id' | 'submittedAt' | 'status'>
  ) => void;
  onBack: () => void;
}

type ActivePanel = 'NONE' | 'INSTRUCTIONS' | 'UPLOAD' | 'WHATSAPP' | 'STATUS';

export const StudentPaymentCenter: React.FC<StudentPaymentCenterProps> = ({
  student,
  tuitionPayments,
  examPrepPayments,
  initialPaymentType = 'Frè lekòl anyèl',
  onSubmitTuitionReceipt,
  onSubmitExamPrepReceipt,
  onBack,
}) => {
  const [selectedPaymentType, setSelectedPaymentType] =
    useState<AslaPaymentType>(initialPaymentType);
  const [activePanel, setActivePanel] = useState<ActivePanel>('NONE');

  // Automatic eligibility & price calculation for Examen Leta / Filo
  const studentType: ExamPrepStudentType =
    student.examPrepStudentType || 'ASLA Student';
  const completedAslaCourses = student.completedRequiredAslaCourses !== false;
  const examPrepFee: 500 | 2000 = getStudentExamPrepFee(student);

  // Active amount (cannot be manually changed by student)
  const activeAmountHtg =
    selectedPaymentType === 'Frè lekòl anyèl' ? 15000 : examPrepFee;

  // Latest payment record for each type
  const latestTuitionPayment = useMemo(
    () => tuitionPayments.find((p) => p.studentId === student.id),
    [tuitionPayments, student.id]
  );

  const latestExamPrepPayment = useMemo(
    () => examPrepPayments.find((p) => p.studentId === student.id),
    [examPrepPayments, student.id]
  );

  const defaultReference = useMemo(() => {
    const suffix =
      selectedPaymentType === 'Frè lekòl anyèl' ? 'TUIT' : 'FILO';
    return `ASLA-PAY-${student.studentCode}-${suffix}`;
  }, [student.studentCode, selectedPaymentType]);

  // Normalize current status for the selected payment type
  const currentPaymentDetails = useMemo(() => {
    if (selectedPaymentType === 'Frè lekòl anyèl') {
      if (!latestTuitionPayment) {
        const fallbackApproved = student.paymentStatus === 'Approved';
        return {
          status: fallbackApproved ? ('Approved' as const) : ('Not Started' as const),
          paymentReference: defaultReference,
          transactionNumber: fallbackApproved ? 'NC-VERIFIED' : '',
          paymentDate: fallbackApproved ? student.createdAt : '',
          submissionDate: fallbackApproved ? student.createdAt : '',
          natcashNumber: '+509 4316 6944',
          aslaReceiptReceived: fallbackApproved,
          whatsappReceiptReceived: fallbackApproved,
          reason: undefined,
          receiptFileName: '',
        };
      }
      const rawStatus = latestTuitionPayment.status;
      const normalizedStatus =
        rawStatus === 'Pending' ? 'Pending Verification' : rawStatus;
      return {
        status: normalizedStatus,
        paymentReference:
          latestTuitionPayment.paymentReference || defaultReference,
        transactionNumber: latestTuitionPayment.transactionNumber,
        paymentDate:
          latestTuitionPayment.paymentDate || latestTuitionPayment.date,
        submissionDate:
          latestTuitionPayment.submissionDate || latestTuitionPayment.date,
        natcashNumber:
          latestTuitionPayment.natcashNumber || '+509 4316 6944',
        aslaReceiptReceived:
          latestTuitionPayment.aslaReceiptReceived ?? true,
        whatsappReceiptReceived:
          latestTuitionPayment.whatsappReceiptReceived ??
          normalizedStatus === 'Approved',
        reason: latestTuitionPayment.rejectionReason,
        receiptFileName: latestTuitionPayment.receiptFileName,
      };
    } else {
      if (!latestExamPrepPayment) {
        const fallbackApproved = student.examPrepPaymentStatus === 'Approved';
        return {
          status: fallbackApproved ? ('Approved' as const) : ('Not Started' as const),
          paymentReference: defaultReference,
          transactionNumber: fallbackApproved ? 'NC-VERIFIED' : '',
          paymentDate: fallbackApproved ? student.createdAt : '',
          submissionDate: fallbackApproved ? student.createdAt : '',
          natcashNumber: '+509 4316 6944',
          aslaReceiptReceived: fallbackApproved,
          whatsappReceiptReceived: fallbackApproved,
          reason: undefined,
          receiptFileName: '',
        };
      }
      const rawStatus = latestExamPrepPayment.status;
      const normalizedStatus =
        rawStatus === 'Not Submitted'
          ? 'Not Started'
          : rawStatus === 'Correction Requested'
          ? 'Correction Required'
          : rawStatus;
      return {
        status: normalizedStatus,
        paymentReference:
          latestExamPrepPayment.paymentReference || defaultReference,
        transactionNumber: latestExamPrepPayment.transactionReference,
        paymentDate:
          latestExamPrepPayment.paymentDate ||
          latestExamPrepPayment.submittedAt,
        submissionDate: latestExamPrepPayment.submittedAt,
        natcashNumber:
          latestExamPrepPayment.natcashNumber || '+509 4316 6944',
        aslaReceiptReceived:
          latestExamPrepPayment.aslaReceiptReceived ?? true,
        whatsappReceiptReceived:
          latestExamPrepPayment.whatsappReceiptReceived ??
          normalizedStatus === 'Approved',
        reason: latestExamPrepPayment.rejectionOrCorrectionReason,
        receiptFileName: latestExamPrepPayment.receiptFileName,
      };
    }
  }, [
    selectedPaymentType,
    latestTuitionPayment,
    latestExamPrepPayment,
    student,
    defaultReference,
  ]);

  // Upload Receipt Form State
  const [formReference, setFormReference] = useState(defaultReference);
  const [formTransactionNumber, setFormTransactionNumber] = useState('');
  const [formPaymentDate, setFormPaymentDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [formNatcashNumber, setFormNatcashNumber] = useState('+509 4316 6944');
  const [formReceiptFileName, setFormReceiptFileName] = useState('');
  const [formReceiptDataUrl, setFormReceiptDataUrl] = useState<
    string | undefined
  >(undefined);
  const [uploadSuccessBanner, setUploadSuccessBanner] = useState(false);

  // Sync reference when switching payment type
  const handleSelectPaymentType = (type: AslaPaymentType) => {
    setSelectedPaymentType(type);
    const suffix = type === 'Frè lekòl anyèl' ? 'TUIT' : 'FILO';
    setFormReference(`ASLA-PAY-${student.studentCode}-${suffix}`);
    setUploadSuccessBanner(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFormReceiptFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setFormReceiptDataUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmitReceiptForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTransactionNumber.trim()) return;

    const cleanRef = formReference.trim() || defaultReference;
    const cleanTx = formTransactionNumber.trim();
    const cleanFile =
      formReceiptFileName ||
      `resi_natcash_${student.studentCode.toLowerCase()}_${activeAmountHtg}htg.jpg`;

    if (selectedPaymentType === 'Frè lekòl anyèl') {
      onSubmitTuitionReceipt({
        paymentReference: cleanRef,
        transactionNumber: cleanTx,
        amountHtg: 15000,
        paymentDate: formPaymentDate,
        natcashNumber: formNatcashNumber.trim() || '+509 4316 6944',
        receiptFileName: cleanFile,
        receiptDataUrl: formReceiptDataUrl,
      });
    } else {
      onSubmitExamPrepReceipt({
        studentId: student.id,
        studentCode: student.studentCode,
        studentName: student.fullName,
        studentType,
        completedRequiredAslaCourses: completedAslaCourses,
        grade: student.grade,
        classroom: student.classroom,
        expectedAmountHtg: examPrepFee,
        submittedAmountHtg: examPrepFee,
        paymentMethod: 'NatCash',
        paymentReference: cleanRef,
        natcashNumber: formNatcashNumber.trim() || '+509 4316 6944',
        paymentDate: formPaymentDate,
        transactionReference: cleanTx,
        receiptFileName: cleanFile,
        receiptDataUrl: formReceiptDataUrl,
        aslaReceiptReceived: true,
        whatsappReceiptReceived: false,
      });
    }

    setUploadSuccessBanner(true);
    setFormTransactionNumber('');
  };

  // Pre-filled WhatsApp URL to +509 4316 6944
  const whatsappUrl = useMemo(() => {
    const txNum =
      currentPaymentDetails.transactionNumber ||
      formTransactionNumber ||
      'NC-PENDING';
    const refCode = currentPaymentDetails.paymentReference || defaultReference;
    const messageLines = [
      'Bonjou Administrasyon Aprantisaj se lò Akademi (ASLA),',
      'Mwen voye menm resi peman NatCash mwen an pou verifikasyon :',
      `- Student Name: ${student.fullName}`,
      `- Student ID: ${student.studentCode}`,
      `- Grade & Class: ${student.grade} (${student.classroom})`,
      `- Payment Reference: ${refCode}`,
      `- Payment Type: ${selectedPaymentType}`,
      `- Amount: ${activeAmountHtg.toLocaleString()} HTG`,
      `- Transaction/Reference Number: ${txNum}`,
      'Mwen tache foto menm resi NatCash la nan mesaj WhatsApp sa a.',
    ];
    return `https://wa.me/50943166944?text=${encodeURIComponent(
      messageLines.join('\n')
    )}`;
  }, [
    student,
    selectedPaymentType,
    activeAmountHtg,
    currentPaymentDetails,
    formTransactionNumber,
    defaultReference,
  ]);

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'Approved':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-emerald-100 text-emerald-900 font-bold text-xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
            <span>Approved</span>
          </span>
        );
      case 'Verified':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-blue-100 text-blue-900 font-bold text-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-700" />
            <span>Verified</span>
          </span>
        );
      case 'Pending Verification':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-amber-100 text-amber-900 font-bold text-xs">
            <Clock className="w-3.5 h-3.5 text-amber-700" />
            <span>Pending Verification</span>
          </span>
        );
      case 'Rejected':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-red-100 text-red-900 font-bold text-xs">
            <XCircle className="w-3.5 h-3.5 text-red-700" />
            <span>Rejected</span>
          </span>
        );
      case 'Correction Required':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-orange-100 text-orange-950 font-bold text-xs">
            <AlertTriangle className="w-3.5 h-3.5 text-orange-700" />
            <span>Correction Required</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-slate-200 text-slate-800 font-bold text-xs">
            <span>Not Started</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. HEADER & OFFICIAL ASLA FEE OVERVIEW */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="text-xs font-bold text-[#B91C1C]">
              💳 PEMAN / PAYMENTS · SANT PEMAN OFISYÈL ANNDAN DASHBOARD ELÈV LA
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#0B2545] mt-0.5">
              Peman ASLA
            </h1>
            <p className="text-xs text-slate-600 mt-1">
              Sistèm nan detèmine pri ki aplikab pou ou otomatikman. Elèv pa ka chanje pri a manyèlman.
            </p>
          </div>

          <button
            type="button"
            onClick={onBack}
            className="px-4 py-2 text-xs font-semibold border border-slate-300 text-[#0B2545] rounded-lg hover:bg-slate-100 cursor-pointer"
          >
            ← Retounen
          </button>
        </div>

        {/* Two Official Payment Categories Display */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card 1: Frè lekòl anyèl */}
          <div
            onClick={() => handleSelectPaymentType('Frè lekòl anyèl')}
            className={`p-5 rounded-xl border transition-all cursor-pointer space-y-2 ${
              selectedPaymentType === 'Frè lekòl anyèl'
                ? 'bg-[#0B2545] text-white border-[#0B2545] shadow-sm'
                : 'bg-[#F8FAFC] text-[#0F172A] border-slate-200 hover:border-[#0B2545]'
            }`}
          >
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="font-bold">1. FRÈ LEKÒL ANYÈL</span>
              <span
                className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                  selectedPaymentType === 'Frè lekòl anyèl'
                    ? 'bg-[#FACC15] text-[#0B2545]'
                    : 'bg-slate-200 text-slate-700'
                }`}
              >
                Grades 7–12
              </span>
            </div>
            <h2 className="text-lg font-bold">Frè lekòl anyèl</h2>
            <div className="text-xl font-bold font-mono text-[#FACC15]">
              <span
                className={
                  selectedPaymentType === 'Frè lekòl anyèl'
                    ? 'text-[#FACC15]'
                    : 'text-[#B91C1C]'
                }
              >
                15,000 HTG / ane akademik
              </span>
            </div>
            <p
              className={`text-xs ${
                selectedPaymentType === 'Frè lekòl anyèl'
                  ? 'text-slate-200'
                  : 'text-slate-600'
              }`}
            >
              Debloke sal klas {student.grade}, tout liv akademik yo, leson, egzèsis, quiz ak egzamen.
            </p>
          </div>

          {/* Card 2: Preparasyon Examen Leta / Filo */}
          <div
            onClick={() =>
              handleSelectPaymentType('Preparasyon Examen Leta / Filo')
            }
            className={`p-5 rounded-xl border transition-all cursor-pointer space-y-2 ${
              selectedPaymentType === 'Preparasyon Examen Leta / Filo'
                ? 'bg-[#0B2545] text-white border-[#0B2545] shadow-sm'
                : 'bg-[#F8FAFC] text-[#0F172A] border-slate-200 hover:border-[#0B2545]'
            }`}
          >
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="font-bold">2. PREPARASYON EXAMEN LETA / FILO</span>
              <span
                className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                  selectedPaymentType === 'Preparasyon Examen Leta / Filo'
                    ? 'bg-[#FACC15] text-[#0B2545]'
                    : 'bg-slate-200 text-slate-700'
                }`}
              >
                Tarif Otomatik: {examPrepFee.toLocaleString()} HTG
              </span>
            </div>
            <h2 className="text-lg font-bold">Preparasyon Examen Leta / Filo</h2>
            <div className="space-y-1 text-xs font-mono">
              <div
                className={
                  examPrepFee === 500
                    ? selectedPaymentType === 'Preparasyon Examen Leta / Filo'
                      ? 'text-[#FACC15] font-bold text-sm'
                      : 'text-[#B91C1C] font-bold text-sm'
                    : 'opacity-75'
                }
              >
                Elèv ASLA ki kalifye: 500 HTG{' '}
                {examPrepFee === 500 && '★ (Aplikab pou ou)'}
              </div>
              <div
                className={
                  examPrepFee === 2000
                    ? selectedPaymentType === 'Preparasyon Examen Leta / Filo'
                      ? 'text-[#FACC15] font-bold text-sm'
                      : 'text-[#B91C1C] font-bold text-sm'
                    : 'opacity-75'
                }
              >
                Elèv ekstèn: 2,000 HTG{' '}
                {examPrepFee === 2000 && '★ (Aplikab pou ou)'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. OFFICIAL PAYMENT CARD */}
      <div className="bg-white rounded-xl border-2 border-[#0B2545] p-6 space-y-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <div className="text-xs font-mono font-bold text-[#B91C1C]">
              PAYMENT CARD · VERIFIKASYON 2 RESI (ASLA + WHATSAPP)
            </div>
            <h2 className="text-xl font-bold text-[#0B2545] mt-0.5">
              {selectedPaymentType} — {student.fullName} ({student.studentCode})
            </h2>
          </div>
          {renderStatusBadge(currentPaymentDetails.status)}
        </div>

        {/* Core Payment Card Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 text-xs tabular-nums">
          <div className="p-4 rounded-xl bg-[#F8FAFC] border border-slate-200 space-y-1">
            <div className="text-slate-500 font-semibold">Payment Type</div>
            <div className="text-sm font-bold text-[#0B2545]">
              {selectedPaymentType}
            </div>
            <div className="text-[11px] text-slate-500 font-mono">
              {student.grade} · {studentType}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#F8FAFC] border border-slate-200 space-y-1">
            <div className="text-slate-500 font-semibold">
              Amount (Otomatik)
            </div>
            <div className="text-lg font-bold text-[#B91C1C] font-mono">
              {activeAmountHtg.toLocaleString()} HTG
            </div>
            <div className="text-[11px] text-slate-500">
               Pri fiks (Pa ka modifye)
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#F8FAFC] border border-slate-200 space-y-1">
            <div className="text-slate-500 font-semibold">Payment Reference</div>
            <div className="text-xs font-bold text-[#0B2545] font-mono break-all">
              {currentPaymentDetails.paymentReference}
            </div>
            <div className="text-[11px] text-slate-500 font-mono">
              Tx: {currentPaymentDetails.transactionNumber || 'Poko soumèt'}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#F8FAFC] border border-slate-200 space-y-1">
            <div className="text-slate-500 font-semibold">Payment Status</div>
            <div className="pt-0.5">
              {renderStatusBadge(currentPaymentDetails.status)}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#0B2545] text-white space-y-1">
            <div className="text-amber-300 font-mono font-bold">NatCash</div>
            <div className="text-base font-bold font-mono">+509 4316 6944</div>
            <div className="text-[11px] text-slate-300">
              NatCash & WhatsApp Ofisyèl
            </div>
          </div>
        </div>

        {/* Dual-Receipt Status Strip (ASLA Receipt & WhatsApp Receipt) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div
            className={`p-4 rounded-xl border flex items-center justify-between text-xs font-mono ${
              currentPaymentDetails.aslaReceiptReceived
                ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                : 'bg-slate-50 border-slate-200 text-slate-700'
            }`}
          >
            <div>
              <div className="font-bold">1. Prèv Sou Platfòm ASLA</div>
              <div className="text-[11px] opacity-80">
                Upload menm resi NatCash la nan ASLA
              </div>
            </div>
            <span className="font-bold text-sm">
              {currentPaymentDetails.aslaReceiptReceived
                ? 'ASLA Receipt: ✓ Received'
                : 'ASLA Receipt: Pending'}
            </span>
          </div>

          <div
            className={`p-4 rounded-xl border flex items-center justify-between text-xs font-mono ${
              currentPaymentDetails.whatsappReceiptReceived
                ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                : 'bg-amber-50 border-amber-300 text-amber-950'
            }`}
          >
            <div>
              <div className="font-bold">2. Prèv Sou WhatsApp (+509 4316 6944)</div>
              <div className="text-[11px] opacity-80">
                Konfime sèlman lè administrasyon an resevwa l
              </div>
            </div>
            <span className="font-bold text-sm">
              {currentPaymentDetails.whatsappReceiptReceived
                ? 'WhatsApp Receipt: ✓ Received'
                : 'WhatsApp Receipt: Pending'}
            </span>
          </div>
        </div>

        {/* Rejection or Correction Reason Alert if applicable */}
        {(currentPaymentDetails.status === 'Rejected' ||
          currentPaymentDetails.status === 'Correction Required') && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-300 text-xs text-red-950 space-y-1">
            <div className="font-bold">
              {currentPaymentDetails.status === 'Rejected'
                ? '✕ Peman ou rejte. Tanpri verifye rezon an epi soumèt yon nouvo resi.'
                : '⚠ Administrasyon an mande yon nouvo resi (Correction Required).'}
            </div>
            {currentPaymentDetails.reason && (
              <div className="font-mono bg-white p-2.5 rounded border border-red-200">
                Rezon Administrasyon ASLA : {currentPaymentDetails.reason}
              </div>
            )}
          </div>
        )}

        {/* Payment Card Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={() =>
              setActivePanel(
                activePanel === 'INSTRUCTIONS' ? 'NONE' : 'INSTRUCTIONS'
              )
            }
            className={`px-4 py-2.5 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
              activePanel === 'INSTRUCTIONS'
                ? 'bg-[#0B2545] text-white'
                : 'bg-slate-100 text-[#0B2545] hover:bg-slate-200 border border-slate-300'
            }`}
          >
            💰 Enstriksyon Peman
          </button>

          <button
            type="button"
            onClick={() =>
              setActivePanel(activePanel === 'UPLOAD' ? 'NONE' : 'UPLOAD')
            }
            className={`px-4 py-2.5 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
              activePanel === 'UPLOAD'
                ? 'bg-[#B91C1C] text-white'
                : 'bg-[#B91C1C] text-white hover:bg-[#991B1B]'
            }`}
          >
            📤 Upload Resi
          </button>

          <button
            type="button"
            onClick={() =>
              setActivePanel(activePanel === 'WHATSAPP' ? 'NONE' : 'WHATSAPP')
            }
            className={`px-4 py-2.5 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
              activePanel === 'WHATSAPP'
                ? 'bg-emerald-800 text-white'
                : 'bg-emerald-700 text-white hover:bg-emerald-800'
            }`}
          >
            📲 WhatsApp Resi
          </button>

          <button
            type="button"
            onClick={() =>
              setActivePanel(activePanel === 'STATUS' ? 'NONE' : 'STATUS')
            }
            className={`px-4 py-2.5 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
              activePanel === 'STATUS'
                ? 'bg-[#0B2545] text-white'
                : 'bg-slate-100 text-[#0B2545] hover:bg-slate-200 border border-slate-300'
            }`}
          >
            🔎 Verify Status
          </button>

          <button
            type="button"
            onClick={onBack}
            className="px-4 py-2.5 rounded-lg text-xs font-semibold border border-slate-300 text-slate-700 hover:bg-slate-100 cursor-pointer ml-auto"
          >
            ← Retounen
          </button>
        </div>
      </div>

      {/* 3. PANEL: 💰 ENSTRIKSYON PEMAN */}
      {activePanel === 'INSTRUCTIONS' && (
        <div className="bg-white rounded-xl border-2 border-[#0B2545] p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h3 className="text-lg font-bold text-[#0B2545]">
              💰 Enstriksyon Peman Ofisyèl ASLA
            </h3>
            <button
              type="button"
              onClick={() => setActivePanel('NONE')}
              className="px-3 py-1.5 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg cursor-pointer"
            >
              ✕ Fèmen
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-[#F8FAFC] border border-slate-200 space-y-1.5">
              <div className="font-mono font-bold text-[#B91C1C]">ETAP 1</div>
              <div className="font-bold text-[#0B2545] text-sm">
                1. Voye peman an sou NatCash
              </div>
              <div className="font-mono font-bold text-base text-[#0B2545]">
                +509 4316 6944
              </div>
              <p className="text-slate-600">
                Voye montan egzak la ({activeAmountHtg.toLocaleString()} HTG) sou nimewo NatCash ofisyèl ASLA a.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#F8FAFC] border border-slate-200 space-y-1.5">
              <div className="font-mono font-bold text-[#B91C1C]">ETAP 2</div>
              <div className="font-bold text-[#0B2545] text-sm">
                2. Kenbe resi NatCash la.
              </div>
              <p className="text-slate-600">
                Fè yon capture d’écran (screenshot) oswa foto klè resi tranzaksyon NatCash ou a.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#F8FAFC] border border-slate-200 space-y-1.5">
              <div className="font-mono font-bold text-[#B91C1C]">ETAP 3</div>
              <div className="font-bold text-[#0B2545] text-sm">
                3. Upload menm resi a nan ASLA.
              </div>
              <p className="text-slate-600">
                Klike sou bouton « 📤 Upload Resi » anndan dashboard la pou telechaje resi a sou platfòm ASLA a.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#F8FAFC] border border-slate-200 space-y-1.5">
              <div className="font-mono font-bold text-[#B91C1C]">ETAP 4</div>
              <div className="font-bold text-[#0B2545] text-sm">
                4. Voye menm resi a sou WhatsApp:
              </div>
              <div className="font-mono font-bold text-base text-emerald-800">
                +509 4316 6944
              </div>
              <p className="text-slate-600">
                Klike sou « 📲 WhatsApp Resi » epi tache menm foto resi NatCash la sou WhatsApp.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#F8FAFC] border border-slate-200 space-y-1.5">
              <div className="font-mono font-bold text-[#B91C1C]">ETAP 5</div>
              <div className="font-bold text-[#0B2545] text-sm">
                5. Antre transaction/reference number lan.
              </div>
              <p className="text-slate-600">
                Asire nimewo tranzaksyon NatCash la ekri egzakteman menm jan nan ASLA ak sou WhatsApp.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#F8FAFC] border border-slate-200 space-y-1.5">
              <div className="font-mono font-bold text-[#B91C1C]">ETAP 6</div>
              <div className="font-bold text-[#0B2545] text-sm">
                6. Tann administrasyon an verifye peman an.
              </div>
              <p className="text-slate-600">
                Administrasyon an ap konpare resi ASLA a ak resi WhatsApp la anvan li aktive aksè ou.
              </p>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={() => setActivePanel('NONE')}
              className="px-4 py-2 text-xs font-bold bg-[#0B2545] text-white rounded-lg cursor-pointer"
            >
              ✕ Fèmen
            </button>
          </div>
        </div>
      )}

      {/* 4. PANEL: 📤 UPLOAD RESI */}
      {activePanel === 'UPLOAD' && (
        <div className="bg-white rounded-xl border-2 border-[#B91C1C] p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <div className="text-xs font-mono font-bold text-[#B91C1C]">
                📤 UPLOAD RESI · PRÈV PEMAN #1 (PLATFÒM ASLA)
              </div>
              <h3 className="text-lg font-bold text-[#0B2545]">
                Telechaje Resi NatCash ou nan ASLA ({selectedPaymentType})
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setActivePanel('NONE')}
              className="px-3 py-1.5 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg cursor-pointer"
            >
              ✕ Fèmen
            </button>
          </div>

          {(uploadSuccessBanner || currentPaymentDetails.aslaReceiptReceived) && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 flex flex-wrap items-center justify-between gap-3 text-xs text-emerald-950">
              <div className="font-bold text-sm">
                ASLA Receipt: ✓ Received
              </div>
              <div>
                Resi ou anrejistre sou platfòm ASLA a. Pa bliye voye menm resi a sou WhatsApp (+509 4316 6944).
              </div>
            </div>
          )}

          <form onSubmit={handleSubmitReceiptForm} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Payment Reference *
                </label>
                <input
                  type="text"
                  value={formReference}
                  onChange={(e) => setFormReference(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 font-mono bg-slate-50 font-bold text-[#0B2545]"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Transaction Number (NatCash) *
                </label>
                <input
                  type="text"
                  value={formTransactionNumber}
                  onChange={(e) => setFormTransactionNumber(e.target.value)}
                  placeholder="egz. NC-2026-884920"
                  className="w-full p-2.5 rounded-lg border border-slate-300 font-mono"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Amount (Detèmine pa Sistèm nan)
                </label>
                <input
                  type="text"
                  readOnly
                  value={`${activeAmountHtg.toLocaleString()} HTG`}
                  className="w-full p-2.5 rounded-lg border border-slate-300 bg-slate-100 font-mono font-bold text-[#B91C1C]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Payment Date *
                </label>
                <input
                  type="date"
                  value={formPaymentDate}
                  onChange={(e) => setFormPaymentDate(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 font-mono"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  NatCash Number *
                </label>
                <input
                  type="text"
                  value={formNatcashNumber}
                  onChange={(e) => setFormNatcashNumber(e.target.value)}
                  placeholder="+509 4316 6944"
                  className="w-full p-2.5 rounded-lg border border-slate-300 font-mono"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Receipt Image/File *
                </label>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleFileChange}
                  className="w-full p-2 rounded-lg border border-slate-300 bg-slate-50"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <button
                type="submit"
                className="px-6 py-2.5 font-bold bg-[#B91C1C] text-white rounded-lg hover:bg-[#991B1B] cursor-pointer"
              >
                Submit Receipt
              </button>

              <button
                type="button"
                onClick={() => setActivePanel('WHATSAPP')}
                className="px-4 py-2.5 font-bold bg-emerald-700 text-white rounded-lg hover:bg-emerald-800 cursor-pointer"
              >
                Kontinye sou 📲 WhatsApp Resi →
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 5. PANEL: 📲 WHATSAPP RESI */}
      {activePanel === 'WHATSAPP' && (
        <div className="bg-white rounded-xl border-2 border-emerald-700 p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <div className="text-xs font-mono font-bold text-emerald-800">
                📲 WHATSAPP RESI · PRÈV PEMAN #2 (+509 4316 6944)
              </div>
              <h3 className="text-lg font-bold text-[#0B2545]">
                Voye Menm Resi NatCash la sou WhatsApp Administrasyon ASLA
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setActivePanel('NONE')}
              className="px-3 py-1.5 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg cursor-pointer"
            >
              ✕ Fèmen
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-xs">
            <div className="lg:col-span-7 space-y-3">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 font-mono">
                <div className="text-slate-500 font-sans font-bold">
                  Mesaj pre-ranpli ki pral louvri sou WhatsApp (+509 4316 6944) :
                </div>
                <div>• Student Name: <strong>{student.fullName}</strong></div>
                <div>• Student ID: <strong>{student.studentCode}</strong></div>
                <div>
                  • Payment Reference:{' '}
                  <strong>{currentPaymentDetails.paymentReference}</strong>
                </div>
                <div>• Payment Type: <strong>{selectedPaymentType}</strong></div>
                <div>
                  • Amount:{' '}
                  <strong>{activeAmountHtg.toLocaleString()} HTG</strong>
                </div>
                <div>
                  • Transaction/Reference Number:{' '}
                  <strong>
                    {currentPaymentDetails.transactionNumber ||
                      formTransactionNumber ||
                      'Antre nimewo tranzaksyon ou an'}
                  </strong>
                </div>
              </div>

              <div className="p-3.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-950 font-medium">
                ⚠ <strong>Enpòtan :</strong> Ou dwe tache/voye <strong>MENM foto resi peman NatCash la</strong> nan konvèsasyon WhatsApp la (+509 4316 6944).
              </div>
            </div>

            <div className="lg:col-span-5 p-5 rounded-xl bg-[#F8FAFC] border border-slate-200 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="text-xs text-slate-500 font-semibold">
                  Stati Resi WhatsApp ou a :
                </div>
                <div
                  className={`p-3 rounded-lg border font-mono font-bold text-sm ${
                    currentPaymentDetails.whatsappReceiptReceived
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                      : 'bg-amber-50 border-amber-300 text-amber-900'
                  }`}
                >
                  {currentPaymentDetails.whatsappReceiptReceived
                    ? 'WhatsApp Receipt: ✓ Received'
                    : 'WhatsApp Receipt: Pending'}
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Stati a ap rete « WhatsApp Receipt: Pending » jiskaske administrasyon ASLA konfime li resevwa resi ou sou WhatsApp (+509 4316 6944).
                </p>
              </div>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-center text-xs inline-flex items-center justify-center gap-2"
              >
                <span>📲 Voye Resi sou WhatsApp (+509 4316 6944)</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* 6. PANEL: 🔎 VERIFY STATUS */}
      {activePanel === 'STATUS' && (
        <div className="bg-white rounded-xl border-2 border-[#0B2545] p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <div className="text-xs font-mono font-bold text-[#B91C1C]">
                🔎 VERIFY STATUS · SUIVI VERIFIKASYON PEMAN AN
              </div>
              <h3 className="text-lg font-bold text-[#0B2545]">
                Stati Peman & Verifikasyon 2 Resi — {selectedPaymentType}
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setActivePanel('NONE')}
              className="px-3 py-1.5 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg cursor-pointer"
            >
              ✕ Fèmen
            </button>
          </div>

          {/* All 6 Official Payment Statuses Progression */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 text-xs">
            {(
              [
                'Not Started',
                'Pending Verification',
                'Verified',
                'Approved',
                'Rejected',
                'Correction Required',
              ] as const
            ).map((st) => {
              const isCurrent = currentPaymentDetails.status === st;
              return (
                <div
                  key={st}
                  className={`p-3 rounded-lg border font-mono text-center ${
                    isCurrent
                      ? 'bg-[#0B2545] text-white border-[#0B2545] font-bold shadow-sm'
                      : 'bg-slate-50 text-slate-500 border-slate-200'
                  }`}
                >
                  <div>{isCurrent ? '● ' : ''}{st}</div>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
            <div className="p-4 rounded-xl bg-[#F8FAFC] border border-slate-200 space-y-1">
              <div className="text-slate-500">ASLA Platform Receipt</div>
              <div className="font-bold text-sm text-[#0B2545]">
                {currentPaymentDetails.aslaReceiptReceived
                  ? 'ASLA Receipt: ✓ Received'
                  : 'ASLA Receipt: Pending'}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#F8FAFC] border border-slate-200 space-y-1">
              <div className="text-slate-500">WhatsApp Receipt (+509 4316 6944)</div>
              <div className="font-bold text-sm text-[#0B2545]">
                {currentPaymentDetails.whatsappReceiptReceived
                  ? 'WhatsApp Receipt: ✓ Received'
                  : 'WhatsApp Receipt: Pending'}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#F8FAFC] border border-slate-200 space-y-1">
              <div className="text-slate-500">Stati Aksè Akademik</div>
              <div className="font-bold text-sm text-emerald-800">
                {currentPaymentDetails.status === 'Approved'
                  ? selectedPaymentType === 'Frè lekòl anyèl'
                    ? 'Student Account = Active'
                    : 'Examen Leta / Filo Access = Active'
                  : 'Access = Locked (Tann Apwobasyon)'}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
