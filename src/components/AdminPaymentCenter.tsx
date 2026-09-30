import React, { useMemo, useState } from 'react';
import {
  AslaPaymentType,
  ExamPrepPaymentRecord,
  ExamPrepPaymentStatus,
  ExamPrepStudentType,
  GradeLevel,
  PaymentStatus,
  PaymentTransaction,
  StudentAccount,
} from '../types';
import { CheckCircle2, AlertTriangle, XCircle, ShieldCheck, Clock } from 'lucide-react';

export type AdminPaymentTab =
  | 'Tout'
  | 'Pending'
  | 'Ready for Verification'
  | 'Approved'
  | 'Rejected'
  | 'Correction Required';

const ADMIN_PAYMENT_TABS: AdminPaymentTab[] = [
  'Tout',
  'Pending',
  'Ready for Verification',
  'Approved',
  'Rejected',
  'Correction Required',
];

export interface UnifiedAdminPaymentItem {
  id: string;
  source: 'TUITION' | 'EXAM_PREP';
  studentId: string;
  studentName: string;
  studentCode: string;
  grade: GradeLevel;
  classroom: string;
  paymentType: AslaPaymentType;
  studentType: ExamPrepStudentType;
  expectedAmountHtg: number;
  submittedAmountHtg: number;
  transactionNumber: string;
  paymentReference: string;
  aslaReceiptReceived: boolean;
  whatsappReceiptReceived: boolean;
  receiptFileName: string;
  receiptDataUrl?: string;
  paymentDate: string;
  submissionDate: string;
  currentStatus:
    | 'Not Started'
    | 'Pending Verification'
    | 'Verified'
    | 'Approved'
    | 'Rejected'
    | 'Correction Required';
  reason?: string;
}

interface AdminPaymentCenterProps {
  students: StudentAccount[];
  tuitionPayments: PaymentTransaction[];
  examPrepPayments: ExamPrepPaymentRecord[];
  onToggleReceiptsStatus: (
    source: 'TUITION' | 'EXAM_PREP',
    paymentId: string,
    aslaReceived: boolean,
    whatsappReceived: boolean
  ) => void;
  onVerifyPaymentRecord: (
    source: 'TUITION' | 'EXAM_PREP',
    paymentId: string
  ) => void;
  onApproveTuitionPayment: (paymentId: string) => void;
  onRejectOrCorrectTuitionPayment: (
    paymentId: string,
    status: 'Rejected' | 'Correction Required',
    reason: string
  ) => void;
  onUpdateExamPrepPaymentStatus: (
    paymentId: string,
    status: ExamPrepPaymentStatus,
    reason?: string
  ) => void;
}

export const AdminPaymentCenter: React.FC<AdminPaymentCenterProps> = ({
  students,
  tuitionPayments,
  examPrepPayments,
  onToggleReceiptsStatus,
  onVerifyPaymentRecord,
  onApproveTuitionPayment,
  onRejectOrCorrectTuitionPayment,
  onUpdateExamPrepPaymentStatus,
}) => {
  const [activeTab, setActiveTab] = useState<AdminPaymentTab>('Tout');
  const [paymentTypeFilter, setPaymentTypeFilter] = useState<
    'ALL' | AslaPaymentType
  >('ALL');

  // Warning banner when admin tries to approve a payment missing either receipt
  const [missingReceiptWarningId, setMissingReceiptWarningId] = useState<
    string | null
  >(null);

  // Side-by-side Two-Receipt Comparison Modal state
  const [comparingItem, setComparingItem] =
    useState<UnifiedAdminPaymentItem | null>(null);

  // Final Approval Confirmation Modal state (with 5 mandatory checkboxes)
  const [confirmingApprovalItem, setConfirmingApprovalItem] =
    useState<UnifiedAdminPaymentItem | null>(null);
  const [checkAslaVerified, setCheckAslaVerified] = useState(false);
  const [checkWhatsappVerified, setCheckWhatsappVerified] = useState(false);
  const [checkAmountCorrect, setCheckAmountCorrect] = useState(false);
  const [checkTxSame, setCheckTxSame] = useState(false);
  const [checkStudentNameCorrect, setCheckStudentNameCorrect] = useState(false);

  // Reject or Request New Receipt inline modal state
  const [reasonModalItem, setReasonModalItem] =
    useState<UnifiedAdminPaymentItem | null>(null);
  const [reasonModalAction, setReasonModalAction] = useState<
    'Rejected' | 'Correction Required'
  >('Rejected');
  const [reasonInput, setReasonInput] = useState('');

  // Build unified payment records list combining Frè lekòl anyèl (15,000 HTG) and Preparasyon Examen Leta / Filo (500 / 2,000 HTG)
  const unifiedRecords: UnifiedAdminPaymentItem[] = useMemo(() => {
    const findStudent = (stuId: string) =>
      students.find((s) => s.id === stuId);

    const tuitionItems: UnifiedAdminPaymentItem[] = tuitionPayments.map((p) => {
      const stu = findStudent(p.studentId);
      const rawStatus: PaymentStatus = p.status;
      const normalizedStatus: UnifiedAdminPaymentItem['currentStatus'] =
        rawStatus === 'Pending'
          ? 'Pending Verification'
          : rawStatus === 'Approved'
          ? 'Approved'
          : rawStatus === 'Verified'
          ? 'Verified'
          : rawStatus === 'Rejected'
          ? 'Rejected'
          : rawStatus === 'Correction Required'
          ? 'Correction Required'
          : rawStatus === 'Not Started'
          ? 'Not Started'
          : 'Pending Verification';

      const code = p.studentCode || stu?.studentCode || 'ASLA-2026-0000';
      return {
        id: p.id,
        source: 'TUITION',
        studentId: p.studentId,
        studentName: p.studentName,
        studentCode: code,
        grade: p.grade,
        classroom: p.classroom,
        paymentType: 'Frè lekòl anyèl',
        studentType: p.studentType || stu?.examPrepStudentType || 'ASLA Student',
        expectedAmountHtg: p.expectedAmountHtg || 15000,
        submittedAmountHtg: p.amountHtg,
        transactionNumber: p.transactionNumber,
        paymentReference: p.paymentReference || `ASLA-PAY-${code}-TUIT`,
        aslaReceiptReceived: p.aslaReceiptReceived ?? true,
        whatsappReceiptReceived:
          p.whatsappReceiptReceived ?? normalizedStatus === 'Approved',
        receiptFileName: p.receiptFileName,
        receiptDataUrl: p.receiptDataUrl,
        paymentDate: p.paymentDate || p.date,
        submissionDate: p.submissionDate || p.date,
        currentStatus: normalizedStatus,
        reason: p.rejectionReason,
      };
    });

    const examPrepItems: UnifiedAdminPaymentItem[] = examPrepPayments.map(
      (ep) => {
        const rawStatus = ep.status;
        const normalizedStatus: UnifiedAdminPaymentItem['currentStatus'] =
          rawStatus === 'Not Submitted' || rawStatus === 'Not Started'
            ? 'Not Started'
            : rawStatus === 'Correction Requested' ||
              rawStatus === 'Correction Required'
            ? 'Correction Required'
            : rawStatus === 'Verified'
            ? 'Verified'
            : rawStatus === 'Approved'
            ? 'Approved'
            : rawStatus === 'Rejected'
            ? 'Rejected'
            : 'Pending Verification';

        return {
          id: ep.id,
          source: 'EXAM_PREP',
          studentId: ep.studentId,
          studentName: ep.studentName,
          studentCode: ep.studentCode,
          grade: ep.grade,
          classroom: ep.classroom,
          paymentType: 'Preparasyon Examen Leta / Filo',
          studentType: ep.studentType,
          expectedAmountHtg: ep.expectedAmountHtg,
          submittedAmountHtg: ep.submittedAmountHtg,
          transactionNumber: ep.transactionReference,
          paymentReference:
            ep.paymentReference || `ASLA-PAY-${ep.studentCode}-FILO`,
          aslaReceiptReceived: ep.aslaReceiptReceived ?? true,
          whatsappReceiptReceived:
            ep.whatsappReceiptReceived ?? normalizedStatus === 'Approved',
          receiptFileName: ep.receiptFileName,
          receiptDataUrl: ep.receiptDataUrl,
          paymentDate: ep.paymentDate || ep.submittedAt,
          submissionDate: ep.submittedAt,
          currentStatus: normalizedStatus,
          reason: ep.rejectionOrCorrectionReason,
        };
      }
    );

    return [...tuitionItems, ...examPrepItems];
  }, [tuitionPayments, examPrepPayments, students]);

  const filteredRecords = useMemo(() => {
    return unifiedRecords.filter((item) => {
      if (
        paymentTypeFilter !== 'ALL' &&
        item.paymentType !== paymentTypeFilter
      ) {
        return false;
      }

      if (activeTab === 'Tout') return true;
      if (activeTab === 'Pending') {
        return item.currentStatus === 'Pending Verification';
      }
      if (activeTab === 'Ready for Verification') {
        return (
          (item.currentStatus === 'Pending Verification' ||
            item.currentStatus === 'Verified') &&
          item.aslaReceiptReceived &&
          item.whatsappReceiptReceived
        );
      }
      if (activeTab === 'Approved') {
        return item.currentStatus === 'Approved';
      }
      if (activeTab === 'Rejected') {
        return item.currentStatus === 'Rejected';
      }
      if (activeTab === 'Correction Required') {
        return item.currentStatus === 'Correction Required';
      }
      return true;
    });
  }, [unifiedRecords, activeTab, paymentTypeFilter]);

  const openApprovalConfirmationModal = (item: UnifiedAdminPaymentItem) => {
    if (!item.aslaReceiptReceived || !item.whatsappReceiptReceived) {
      setMissingReceiptWarningId(item.id);
      return;
    }
    setMissingReceiptWarningId(null);
    setConfirmingApprovalItem(item);
    setCheckAslaVerified(false);
    setCheckWhatsappVerified(false);
    setCheckAmountCorrect(false);
    setCheckTxSame(false);
    setCheckStudentNameCorrect(false);
  };

  const handleConfirmFinalApproval = () => {
    if (!confirmingApprovalItem) return;
    if (
      !checkAslaVerified ||
      !checkWhatsappVerified ||
      !checkAmountCorrect ||
      !checkTxSame ||
      !checkStudentNameCorrect
    ) {
      return;
    }

    if (confirmingApprovalItem.source === 'TUITION') {
      onApproveTuitionPayment(confirmingApprovalItem.id);
    } else {
      onUpdateExamPrepPaymentStatus(confirmingApprovalItem.id, 'Approved');
    }

    setConfirmingApprovalItem(null);
  };

  const handleConfirmRejectOrCorrection = () => {
    if (!reasonModalItem) return;
    const cleanReason =
      reasonInput.trim() ||
      (reasonModalAction === 'Rejected'
        ? 'Resi peman an pa konfòm ak tras tranzaksyon NatCash la.'
        : 'Tanpri soumèt yon nouvo foto resi NatCash ki klè sou ASLA ak sou WhatsApp.');

    if (reasonModalItem.source === 'TUITION') {
      onRejectOrCorrectTuitionPayment(
        reasonModalItem.id,
        reasonModalAction,
        cleanReason
      );
    } else {
      onUpdateExamPrepPaymentStatus(
        reasonModalItem.id,
        reasonModalAction,
        cleanReason
      );
    }

    setReasonModalItem(null);
    setReasonInput('');
  };

  const allFiveCheckboxesChecked =
    checkAslaVerified &&
    checkWhatsappVerified &&
    checkAmountCorrect &&
    checkTxSame &&
    checkStudentNameCorrect;

  return (
    <div className="space-y-6">
      {/* 1. HEADER: ASLA PAYMENT CENTER */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="text-xs font-mono font-bold text-[#B91C1C]">
              💳 PEMAN / PAYMENTS · VERIFIKASYON 2 RESI (ASLA + WHATSAPP +509 4316 6944)
            </div>
            <h1 className="text-2xl font-bold text-[#0B2545] mt-0.5">
              ASLA Payment Center — Aprantisaj se lò Akademi
            </h1>
            <p className="text-xs text-slate-600 mt-1">
              Verifye toude prèv peman yo (ASLA Receipt + WhatsApp Receipt sou +509 4316 6944) anvan apwobasyon final.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="px-3 py-1.5 rounded-lg bg-[#0B2545] text-white font-mono font-bold">
              NatCash & WhatsApp: +509 4316 6944
            </span>
          </div>
        </div>

        {/* Status Tabs: Tout | Pending | Ready for Verification | Approved | Rejected | Correction Required */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-1.5">
            {ADMIN_PAYMENT_TABS.map((tab) => {
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`px-3.5 py-2 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                    isActive
                      ? 'bg-[#0B2545] text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>

          {/* Payment Type Filter */}
          <div className="flex flex-wrap items-center gap-1 p-1 rounded-lg bg-slate-100 border border-slate-200 text-xs">
            <button
              type="button"
              onClick={() => setPaymentTypeFilter('ALL')}
              className={`px-2.5 py-1 rounded font-semibold cursor-pointer ${
                paymentTypeFilter === 'ALL'
                  ? 'bg-[#B91C1C] text-white'
                  : 'text-slate-700'
              }`}
            >
              Tout Tip Peman
            </button>
            <button
              type="button"
              onClick={() => setPaymentTypeFilter('Frè lekòl anyèl')}
              className={`px-2.5 py-1 rounded font-semibold cursor-pointer ${
                paymentTypeFilter === 'Frè lekòl anyèl'
                  ? 'bg-[#B91C1C] text-white'
                  : 'text-slate-700'
              }`}
            >
              Frè lekòl anyèl (15,000 HTG)
            </button>
            <button
              type="button"
              onClick={() =>
                setPaymentTypeFilter('Preparasyon Examen Leta / Filo')
              }
              className={`px-2.5 py-1 rounded font-semibold cursor-pointer ${
                paymentTypeFilter === 'Preparasyon Examen Leta / Filo'
                  ? 'bg-[#B91C1C] text-white'
                  : 'text-slate-700'
              }`}
            >
              Examen Leta / Filo (500 / 2,000 HTG)
            </button>
          </div>
        </div>
      </div>

      {/* 2. ADMIN PAYMENT RECORDS LIST */}
      <div className="space-y-4">
        {filteredRecords.map((rec) => {
          const bothReceiptsReady =
            rec.aslaReceiptReceived && rec.whatsappReceiptReceived;
          const showMissingWarning = missingReceiptWarningId === rec.id;

          return (
            <div
              key={`${rec.source}-${rec.id}`}
              className="bg-white rounded-xl border border-slate-200 p-5 space-y-4 shadow-xs"
            >
              {/* Top Row: Student Identity + Current Status */}
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 pb-3">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                    <span className="font-bold text-[#B91C1C]">
                      {rec.paymentType}
                    </span>
                    <span>·</span>
                    <span className="font-bold text-[#0B2545]">
                      Student ID: {rec.studentCode}
                    </span>
                    <span>·</span>
                    <span className="text-slate-600">
                      Student Type: <strong>{rec.studentType}</strong>
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-[#0B2545]">
                    {rec.studentName}{' '}
                    <span className="text-sm font-normal text-slate-600">
                      — {rec.grade} ({rec.classroom})
                    </span>
                  </h3>
                </div>

                {/* Current Status Badge */}
                <div className="flex items-center gap-2">
                  {rec.currentStatus === 'Approved' && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-emerald-100 text-emerald-900 font-bold text-xs">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Approved</span>
                    </span>
                  )}
                  {rec.currentStatus === 'Verified' && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-blue-100 text-blue-900 font-bold text-xs">
                      <ShieldCheck className="w-3.5 h-3.5 text-blue-700" />
                      <span>Verified</span>
                    </span>
                  )}
                  {rec.currentStatus === 'Pending Verification' && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-amber-100 text-amber-900 font-bold text-xs">
                      <Clock className="w-3.5 h-3.5 text-amber-700" />
                      <span>Pending Verification</span>
                    </span>
                  )}
                  {rec.currentStatus === 'Rejected' && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-red-100 text-red-900 font-bold text-xs">
                      <XCircle className="w-3.5 h-3.5 text-red-700" />
                      <span>Rejected</span>
                    </span>
                  )}
                  {rec.currentStatus === 'Correction Required' && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-orange-100 text-orange-950 font-bold text-xs">
                      <AlertTriangle className="w-3.5 h-3.5 text-orange-700" />
                      <span>Correction Required</span>
                    </span>
                  )}
                </div>
              </div>

              {/* All Required Admin Payment Record Fields Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs font-mono tabular-nums">
                <div className="p-3 rounded-lg bg-[#F8FAFC] border border-slate-200">
                  <div className="text-slate-500 font-sans">
                    Student Name & ID
                  </div>
                  <div className="font-bold text-[#0B2545] mt-0.5 font-sans">
                    {rec.studentName}
                  </div>
                  <div className="text-[11px] text-slate-600">
                    {rec.studentCode}
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-[#F8FAFC] border border-slate-200">
                  <div className="text-slate-500 font-sans">Grade & Class</div>
                  <div className="font-bold text-[#B91C1C] mt-0.5">
                    {rec.grade}
                  </div>
                  <div className="text-[11px] text-slate-600 truncate font-sans">
                    {rec.classroom}
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-[#F8FAFC] border border-slate-200">
                  <div className="text-slate-500 font-sans">
                    Payment Type & Student Type
                  </div>
                  <div className="font-bold text-[#0B2545] mt-0.5 font-sans">
                    {rec.paymentType}
                  </div>
                  <div className="text-[11px] text-slate-600">
                    {rec.studentType}
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-[#F8FAFC] border border-slate-200">
                  <div className="text-slate-500 font-sans">
                    Expected Amount
                  </div>
                  <div className="font-bold text-sm text-[#0B2545] mt-0.5">
                    {rec.expectedAmountHtg.toLocaleString()} HTG
                  </div>
                  <div className="text-[11px] text-slate-600">
                    Soumèt: {rec.submittedAmountHtg.toLocaleString()} HTG
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-[#F8FAFC] border border-slate-200">
                  <div className="text-slate-500 font-sans">
                    Transaction & Reference
                  </div>
                  <div className="font-bold text-[#0B2545] mt-0.5">
                    Tx: {rec.transactionNumber}
                  </div>
                  <div className="text-[11px] text-slate-600 truncate">
                    Ref: {rec.paymentReference}
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-[#F8FAFC] border border-slate-200">
                  <div className="text-slate-500 font-sans">
                    Payment & Submission Date
                  </div>
                  <div className="font-bold text-[#0B2545] mt-0.5">
                    Peman: {rec.paymentDate}
                  </div>
                  <div className="text-[11px] text-slate-600">
                    Soumèt: {rec.submissionDate}
                  </div>
                </div>
              </div>

              {/* TWO-RECEIPT VERIFICATION ROW */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
                <div
                  className={`p-3.5 rounded-xl border flex flex-wrap items-center justify-between gap-2 ${
                    rec.aslaReceiptReceived
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                      : 'bg-amber-50 border-amber-300 text-amber-950'
                  }`}
                >
                  <div>
                    <div className="font-bold">
                      ASLA Receipt:{' '}
                      {rec.aslaReceiptReceived ? '✓ Received' : 'Pending'}
                    </div>
                    <div className="text-[11px] opacity-80">
                      Fichye: {rec.receiptFileName}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setComparingItem(rec)}
                      className="px-2.5 py-1 rounded bg-white border border-slate-300 text-[#0B2545] font-sans font-semibold cursor-pointer"
                    >
                      Konpare Resi yo
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        onToggleReceiptsStatus(
                          rec.source,
                          rec.id,
                          !rec.aslaReceiptReceived,
                          rec.whatsappReceiptReceived
                        )
                      }
                      className="px-2.5 py-1 rounded bg-[#0B2545] text-white font-sans font-semibold cursor-pointer"
                    >
                      {rec.aslaReceiptReceived
                        ? 'Make Pending'
                        : '✓ Konfime ASLA Receipt'}
                    </button>
                  </div>
                </div>

                <div
                  className={`p-3.5 rounded-xl border flex flex-wrap items-center justify-between gap-2 ${
                    rec.whatsappReceiptReceived
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                      : 'bg-amber-50 border-amber-300 text-amber-950'
                  }`}
                >
                  <div>
                    <div className="font-bold">
                      WhatsApp Receipt:{' '}
                      {rec.whatsappReceiptReceived ? '✓ Received' : 'Pending'}
                    </div>
                    <div className="text-[11px] opacity-80">
                      WhatsApp Administrasyon: +509 4316 6944
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      onToggleReceiptsStatus(
                        rec.source,
                        rec.id,
                        rec.aslaReceiptReceived,
                        !rec.whatsappReceiptReceived
                      )
                    }
                    className={`px-3 py-1 rounded font-sans font-bold cursor-pointer ${
                      rec.whatsappReceiptReceived
                        ? 'bg-white border border-emerald-400 text-emerald-900'
                        : 'bg-emerald-700 text-white hover:bg-emerald-800'
                    }`}
                  >
                    {rec.whatsappReceiptReceived
                      ? '✓ Resevwa sou WhatsApp (Chanje)'
                      : '✓ Konfime WhatsApp Receipt Resevwa'}
                  </button>
                </div>
              </div>

              {/* Missing Receipt Warning Banner when Admin tries to approve without both receipts */}
              {(!bothReceiptsReady || showMissingWarning) &&
                rec.currentStatus !== 'Approved' && (
                  <div
                    className={`p-3 rounded-lg border text-xs font-bold flex items-center justify-between ${
                      showMissingWarning
                        ? 'bg-red-100 border-red-400 text-red-950'
                        : 'bg-amber-50 border-amber-200 text-amber-950'
                    }`}
                  >
                    <span>
                      ⚠ Toude prèv peman yo dwe disponib anvan peman an ka apwouve.
                    </span>
                    <span className="font-mono text-[11px]">
                      ASLA: {rec.aslaReceiptReceived ? '✓' : '✕'} | WhatsApp:{' '}
                      {rec.whatsappReceiptReceived ? '✓' : '✕'}
                    </span>
                  </div>
                )}

              {/* Reason display if Rejected or Correction Required */}
              {rec.reason &&
                (rec.currentStatus === 'Rejected' ||
                  rec.currentStatus === 'Correction Required') && (
                  <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-900 font-mono">
                    Rezon ({rec.currentStatus}): {rec.reason}
                  </div>
                )}

              {/* ADMIN ACTION BUTTONS: ✓ Verify Payment | ✓ Approve | ✕ Reject | ⚠ Request New Receipt */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
                <div className="text-xs text-slate-500 font-mono">
                  Current Status: <strong>{rec.currentStatus}</strong>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (!bothReceiptsReady) {
                        setMissingReceiptWarningId(rec.id);
                        return;
                      }
                      setMissingReceiptWarningId(null);
                      onVerifyPaymentRecord(rec.source, rec.id);
                      setComparingItem(rec);
                    }}
                    className="px-3.5 py-2 rounded-lg text-xs font-bold bg-blue-700 hover:bg-blue-800 text-white cursor-pointer"
                  >
                    ✓ Verify Payment
                  </button>

                  <button
                    type="button"
                    onClick={() => openApprovalConfirmationModal(rec)}
                    className={`px-3.5 py-2 rounded-lg text-xs font-bold cursor-pointer ${
                      bothReceiptsReady
                        ? 'bg-emerald-700 hover:bg-emerald-800 text-white'
                        : 'bg-slate-200 text-slate-500 hover:bg-slate-300'
                    }`}
                  >
                    ✓ Approve
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setReasonModalItem(rec);
                      setReasonModalAction('Rejected');
                      setReasonInput(rec.reason || '');
                    }}
                    className="px-3.5 py-2 rounded-lg text-xs font-bold bg-red-700 hover:bg-red-800 text-white cursor-pointer"
                  >
                    ✕ Reject
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setReasonModalItem(rec);
                      setReasonModalAction('Correction Required');
                      setReasonInput(rec.reason || '');
                    }}
                    className="px-3.5 py-2 rounded-lg text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white cursor-pointer"
                  >
                    ⚠ Request New Receipt
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. SIDE-BY-SIDE TWO-RECEIPT COMPARISON MODAL */}
      {comparingItem && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-slate-200 max-w-3xl w-full p-6 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <div className="text-xs font-mono font-bold text-[#B91C1C]">
                  TWO-RECEIPT VERIFICATION · KONPAREZON RESI ASLA AK WHATSAPP
                </div>
                <h3 className="text-lg font-bold text-[#0B2545]">
                  {comparingItem.studentName} ({comparingItem.studentCode}) —{' '}
                  {comparingItem.paymentType}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setComparingItem(null)}
                className="px-3 py-1.5 text-xs font-bold border border-slate-300 rounded-lg cursor-pointer"
              >
                ✕ Fèmen
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
              <div className="p-4 rounded-xl bg-[#F8FAFC] border border-slate-200 space-y-2">
                <div className="font-bold text-sm text-[#0B2545]">
                  1. ASLA Platform Receipt
                </div>
                <div>
                  Status:{' '}
                  <strong>
                    {comparingItem.aslaReceiptReceived
                      ? '✓ Received'
                      : 'Pending'}
                  </strong>
                </div>
                <div>Student: {comparingItem.studentName}</div>
                <div>Amount: {comparingItem.submittedAmountHtg} HTG</div>
                <div>Transaction #: {comparingItem.transactionNumber}</div>
                <div>Reference: {comparingItem.paymentReference}</div>
                <div>File: {comparingItem.receiptFileName}</div>
                {comparingItem.receiptDataUrl && (
                  <div className="pt-2">
                    <img
                      src={comparingItem.receiptDataUrl}
                      alt="ASLA Receipt"
                      className="max-h-44 rounded border border-slate-300 object-contain"
                    />
                  </div>
                )}
              </div>

              <div className="p-4 rounded-xl bg-[#F8FAFC] border border-slate-200 space-y-2">
                <div className="font-bold text-sm text-emerald-800">
                  2. WhatsApp Receipt (+509 4316 6944)
                </div>
                <div>
                  Status:{' '}
                  <strong>
                    {comparingItem.whatsappReceiptReceived
                      ? '✓ Received'
                      : 'Pending'}
                  </strong>
                </div>
                <div>Expected Student: {comparingItem.studentName}</div>
                <div>
                  Expected Amount:{' '}
                  {comparingItem.expectedAmountHtg.toLocaleString()} HTG
                </div>
                <div>Expected Tx #: {comparingItem.transactionNumber}</div>
                <div>Payment Date: {comparingItem.paymentDate}</div>
                <p className="font-sans text-slate-600 pt-2">
                  Verifye ke foto resi elèv la voye sou WhatsApp (+509 4316 6944) gen menm nimewo tranzaksyon ({comparingItem.transactionNumber}) ak menm montan ({comparingItem.expectedAmountHtg.toLocaleString()} HTG).
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  const target = comparingItem;
                  setComparingItem(null);
                  openApprovalConfirmationModal(target);
                }}
                className="px-4 py-2 text-xs font-bold bg-emerald-700 text-white rounded-lg cursor-pointer"
              >
                Kontinye nan ✓ Approve →
              </button>
              <button
                type="button"
                onClick={() => setComparingItem(null)}
                className="px-4 py-2 text-xs font-semibold border border-slate-300 rounded-lg cursor-pointer"
              >
                ✕ Fèmen
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. MANDATORY CONFIRMATION MODAL BEFORE FINAL APPROVAL */}
      {confirmingApprovalItem && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border-2 border-[#0B2545] max-w-lg w-full p-6 space-y-5">
            <div className="border-b border-slate-200 pb-3">
              <div className="text-xs font-mono font-bold text-[#B91C1C]">
                CONFIRMATION MODAL · APWOBASYON FINAL PEMAN
              </div>
              <h3 className="text-lg font-bold text-[#0B2545] mt-1">
                Èske ou konfime ou verifye peman sa a?
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                {confirmingApprovalItem.studentName} (
                {confirmingApprovalItem.studentCode}) ·{' '}
                {confirmingApprovalItem.paymentType} ·{' '}
                <strong>
                  {confirmingApprovalItem.expectedAmountHtg.toLocaleString()}{' '}
                  HTG
                </strong>
              </p>
            </div>

            {/* 5 Required Checkboxes */}
            <div className="space-y-2.5 text-xs font-semibold text-[#0B2545] bg-[#F8FAFC] p-4 rounded-xl border border-slate-200">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={checkAslaVerified}
                  onChange={(e) => setCheckAslaVerified(e.target.checked)}
                  className="w-4 h-4 accent-[#0B2545]"
                />
                <span>Resi ASLA verifye</span>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={checkWhatsappVerified}
                  onChange={(e) => setCheckWhatsappVerified(e.target.checked)}
                  className="w-4 h-4 accent-[#0B2545]"
                />
                <span>Resi WhatsApp verifye</span>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={checkAmountCorrect}
                  onChange={(e) => setCheckAmountCorrect(e.target.checked)}
                  className="w-4 h-4 accent-[#0B2545]"
                />
                <span>
                  Montan an kòrèk (
                  {confirmingApprovalItem.expectedAmountHtg.toLocaleString()}{' '}
                  HTG)
                </span>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={checkTxSame}
                  onChange={(e) => setCheckTxSame(e.target.checked)}
                  className="w-4 h-4 accent-[#0B2545]"
                />
                <span>
                  Nimewo tranzaksyon an menm (
                  {confirmingApprovalItem.transactionNumber})
                </span>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={checkStudentNameCorrect}
                  onChange={(e) => setCheckStudentNameCorrect(e.target.checked)}
                  className="w-4 h-4 accent-[#0B2545]"
                />
                <span>
                  Non elèv la kòrèk ({confirmingApprovalItem.studentName})
                </span>
              </label>
            </div>

            <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-950">
              {confirmingApprovalItem.paymentType === 'Frè lekòl anyèl' ? (
                <span>
                  <strong>Apre Apwobasyon :</strong> Student Account = Active
                  (Debloke liv, leson, egzèsis, quiz ak egzamen).
                </span>
              ) : (
                <span>
                  <strong>Apre Apwobasyon :</strong> Examen Leta / Filo Access =
                  Active (Debloke revizyon pa matyè, egzèsis, kesyon tip egzamen, mock exams ak similasyon).
                </span>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                disabled={!allFiveCheckboxesChecked}
                onClick={handleConfirmFinalApproval}
                className={`px-5 py-2.5 rounded-lg text-xs font-bold transition-colors ${
                  allFiveCheckboxesChecked
                    ? 'bg-emerald-700 hover:bg-emerald-800 text-white cursor-pointer'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                ✓ Konfime Apwobasyon
              </button>
              <button
                type="button"
                onClick={() => setConfirmingApprovalItem(null)}
                className="px-4 py-2.5 rounded-lg text-xs font-bold border border-slate-300 text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                ✕ Anile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. REJECT OR REQUEST NEW RECEIPT MODAL */}
      {reasonModalItem && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border-2 border-red-700 max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-base font-bold text-[#0B2545]">
                {reasonModalAction === 'Rejected'
                  ? `✕ Rejte Peman — ${reasonModalItem.studentName}`
                  : `⚠ Mande Nouvo Resi (Correction Required) — ${reasonModalItem.studentName}`}
              </h3>
              <button
                type="button"
                onClick={() => setReasonModalItem(null)}
                className="text-xs font-bold text-slate-600 cursor-pointer"
              >
                ✕ Fèmen
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <label className="block font-semibold text-slate-700">
                {reasonModalAction === 'Rejected'
                  ? 'Antre Rezon Rejè a (Elèv la ap resevwa notifikasyon sa a) *'
                  : 'Antre Rezon Koreksyon an (Elèv la ap resevwa notifikasyon sa a) *'}
              </label>
              <textarea
                rows={3}
                value={reasonInput}
                onChange={(e) => setReasonInput(e.target.value)}
                placeholder="egz. Nimewo tranzaksyon sou resi ASLA a pa koresponn ak resi WhatsApp la oswa foto a pa klè..."
                className="w-full p-3 rounded-lg border border-slate-300"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={handleConfirmRejectOrCorrection}
                className={`px-4 py-2 rounded-lg text-xs font-bold text-white cursor-pointer ${
                  reasonModalAction === 'Rejected'
                    ? 'bg-red-700 hover:bg-red-800'
                    : 'bg-amber-600 hover:bg-amber-700'
                }`}
              >
                {reasonModalAction === 'Rejected'
                  ? '✕ Konfime Rejè (Access = Locked)'
                  : '⚠ Voye Demann Nouvo Resi'}
              </button>
              <button
                type="button"
                onClick={() => setReasonModalItem(null)}
                className="px-4 py-2 rounded-lg text-xs font-semibold border border-slate-300 cursor-pointer"
              >
                ✕ Anile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
