import React, { useState } from 'react';
import {
  AcademicCertificate,
  Language,
} from '../types';
import { GRADE_COMPLEXITY_PROFILE } from '../data/syllabusMatrix';
import { AslaLogo } from './AslaLogo';
import { Award, CheckCircle2, Download, Printer } from 'lucide-react';

interface CertificateDiplomaViewProps {
  certificate: AcademicCertificate;
  defaultLanguage?: Language;
  onClose?: () => void;
}

export const CertificateDiplomaView: React.FC<CertificateDiplomaViewProps> = ({
  certificate,
  defaultLanguage = 'ht',
  onClose,
}) => {
  const [certLang, setCertLang] = useState<Language>(defaultLanguage);
  const [downloadedNotice, setDownloadedNotice] = useState(false);

  const isDiploma = certificate.certificateType === 'High School Diploma';
  const gradeProfile = GRADE_COMPLEXITY_PROFILE[certificate.grade];

  const titleText =
    certLang === 'fr'
      ? certificate.titleFr
      : certLang === 'en'
      ? certificate.titleEn
      : certificate.titleHt;

  const citationText =
    certLang === 'fr'
      ? certificate.citationFr
      : certLang === 'en'
      ? certificate.citationEn
      : certificate.citationHt;

  const republicHeader =
    certLang === 'fr'
      ? 'RÉPUBLIQUE D’HAÏTI · ENSEIGNEMENT SECONDAIRE & FONDAMENTAL (GRADES 7–12)'
      : certLang === 'en'
      ? 'REPUBLIC OF HAITI · SECONDARY & FUNDAMENTAL EDUCATION (GRADES 7–12)'
      : 'REPIBLIK DAYITI · ANSÈYMAN FONDAMANTAL AK SEGONDÈ (GRADES 7–12)';

  const conferralLead =
    certLang === 'fr'
      ? 'Le Conseil Académique et la Direction Générale d’ASLA certifient par la présente que'
      : certLang === 'en'
      ? 'The Academic Council and General Administration of ASLA hereby certify that'
      : 'Konsèy Akademik la ak Direksyon Jeneral ASLA sètifye pa dokiman ofisyèl sa a ke';

  const directorRoleLabel =
    certLang === 'fr'
      ? 'Directrice Générale · Administration ASLA'
      : certLang === 'en'
      ? 'General Director · ASLA Administration'
      : 'Direktris Jeneral · Administrasyon ASLA';

  const councilRoleLabel =
    certLang === 'fr'
      ? 'Conseil Pédagogique & Jury Académique (Grades 7–12)'
      : certLang === 'en'
      ? 'Academic Board & Curriculum Council (Grades 7–12)'
      : 'Konsèy Pedagojik & Jiri Akademik (Grades 7–12)';

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadStandaloneCertificate = () => {
    const htmlContent = `<!doctype html>
<html lang="${certLang}">
<head>
  <meta charset="UTF-8" />
  <title>${titleText} — ${certificate.studentName}</title>
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,600;0,9..144,700;1,9..144,400&family=Plus+Jakarta+Sans:wght@400;600;700&family=JetBrains+Mono:wght@500&display=swap" rel="stylesheet">
  <style>
    body {
      margin: 0;
      padding: 32px;
      background: #f1f5f9;
      font-family: 'Plus Jakarta Sans', sans-serif;
      color: #0B2545;
    }
    .certificate-sheet {
      max-width: 960px;
      margin: 0 auto;
      background: #FFFDF8;
      border: 8px solid #0B3B75;
      outline: 3px solid #D97706;
      outline-offset: -16px;
      padding: 56px 48px;
      text-align: center;
      box-sizing: border-box;
      position: relative;
    }
    .header-sub {
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.14em;
      color: #0B3B75;
      margin-bottom: 8px;
    }
    .school-name {
      font-family: 'Fraunces', Georgia, serif;
      font-size: 32px;
      font-weight: 700;
      color: #0B3B75;
      margin: 0;
    }
    .motto {
      font-size: 13px;
      font-weight: 700;
      color: #B45309;
      margin-top: 4px;
    }
    .cert-title {
      font-family: 'Fraunces', Georgia, serif;
      font-size: 26px;
      font-weight: 700;
      color: #B91C1C;
      margin: 28px 0 12px;
    }
    .lead {
      font-size: 14px;
      color: #334155;
      margin-bottom: 12px;
    }
    .student-name {
      font-family: 'Fraunces', Georgia, serif;
      font-size: 40px;
      font-weight: 700;
      color: #0B3B75;
      border-bottom: 2px solid #FACC15;
      display: inline-block;
      padding: 0 24px 6px;
      margin: 8px 0 18px;
    }
    .citation {
      font-size: 15px;
      line-height: 1.6;
      max-width: 680px;
      margin: 0 auto 24px;
      color: #1E293B;
    }
    .meta-row {
      font-family: 'JetBrains Mono', monospace;
      font-size: 12px;
      color: #0B3B75;
      margin-bottom: 32px;
    }
    .signatures {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-top: 36px;
      padding-top: 20px;
      border-top: 1px solid #E2E8F0;
    }
    .sig-box {
      width: 38%;
      text-align: center;
    }
    .sig-script {
      font-family: 'Fraunces', Georgia, serif;
      font-style: italic;
      font-size: 22px;
      color: #0B3B75;
      border-bottom: 1px solid #94A3B8;
      padding-bottom: 6px;
      margin-bottom: 6px;
    }
    @media print {
      body { background: #FFFFFF; padding: 0; }
      .certificate-sheet { border-width: 6px; }
    }
  </style>
</head>
<body>
  <div class="certificate-sheet">
    <div class="header-sub">${republicHeader}</div>
    <h1 class="school-name">Aprantisaj se lò Akademi (ASLA)</h1>
    <div class="motto">Aprantisaj se lò Akademi — Edikasyon jodi a, yon pi bon demen</div>
    <h2 class="cert-title">${titleText}</h2>
    <p class="lead">${conferralLead}</p>
    <div class="student-name">${certificate.studentName}</div>
    <p class="citation">${citationText}</p>
    <div class="meta-row">
      Kòd Elèv: ${certificate.studentCode} · Nivo: ${certificate.grade} (${gradeProfile.haitianEquivalent}) · Klas: ${certificate.classroom}<br/>
      Mwayèn Final: ${certificate.finalAverageScore}/100 · ${certificate.honors} · Ane Akademik: ${certificate.academicYear}
    </div>
    <div class="signatures">
      <div class="sig-box">
        <div class="sig-script">Sindy Salomon</div>
        <div style="font-size:12px;font-weight:700;">Sindy Salomon</div>
        <div style="font-size:11px;color:#475569;">${directorRoleLabel}</div>
      </div>
      <div style="font-size:11px;font-family:'JetBrains Mono',monospace;color:#B45309;font-weight:700;">
        SCEAU OFFICIEL ASLA<br/>N° ${certificate.serialNumber}<br/>Dat: ${certificate.issuedAt}
      </div>
      <div class="sig-box">
        <div class="sig-script">Konsèy Akademik ASLA</div>
        <div style="font-size:12px;font-weight:700;">Konsèy Akademik ASLA</div>
        <div style="font-size:11px;color:#475569;">${councilRoleLabel}</div>
      </div>
    </div>
  </div>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${certificate.serialNumber}_${certificate.studentName.replace(/\s+/g, '_')}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setDownloadedNotice(true);
    setTimeout(() => setDownloadedNotice(false), 4000);
  };

  return (
    <div className="space-y-4">
      {/* Action & Language Controls Toolbar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-wrap items-center justify-between gap-3 print:hidden">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-[#0B3B75]">
            Lang Sètifika / Diplòm :
          </span>
          <div className="inline-flex items-center gap-1 p-1 bg-slate-100 rounded-lg border border-slate-200">
            <button
              type="button"
              onClick={() => setCertLang('ht')}
              className={`px-3 py-1 text-xs font-semibold rounded-md cursor-pointer ${
                certLang === 'ht' ? 'bg-[#0B3B75] text-white' : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              Kreyòl Ayisyen
            </button>
            <button
              type="button"
              onClick={() => setCertLang('fr')}
              className={`px-3 py-1 text-xs font-semibold rounded-md cursor-pointer ${
                certLang === 'fr' ? 'bg-[#0B3B75] text-white' : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              Français
            </button>
            <button
              type="button"
              onClick={() => setCertLang('en')}
              className={`px-3 py-1 text-xs font-semibold rounded-md cursor-pointer ${
                certLang === 'en' ? 'bg-[#0B3B75] text-white' : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              English
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-[#0B3B75] bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg cursor-pointer whitespace-nowrap"
          >
            <Printer className="w-4 h-4" />
            <span>Enprime / PDF</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadStandaloneCertificate}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-[#0B3B75] bg-[#FACC15] hover:bg-[#EAB308] rounded-lg shadow-2xs cursor-pointer whitespace-nowrap"
          >
            <Download className="w-4 h-4" />
            <span>Telechaje Diplòm Ofisyèl</span>
          </button>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 text-xs font-semibold text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-100 cursor-pointer"
            >
              Fèmen
            </button>
          )}
        </div>
      </div>

      {downloadedNotice && (
        <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-semibold flex items-center gap-2 print:hidden">
          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>
            ✓ Fichye ofisyèl sètifika/diplòm ({certificate.serialNumber}) telechaje avèk siksè. Ou ka ouvri l epi enprime l sou papye pachemen.
          </span>
        </div>
      )}

      {/* Official Parchment Certificate / Diploma Canvas */}
      <div className="relative bg-[#FFFDF7] rounded-2xl border-[6px] border-[#0B3B75] p-3 sm:p-5 shadow-md overflow-hidden">
        {/* Inner Gold Frame */}
        <div className="relative border-2 border-[#D97706] rounded-xl p-6 sm:p-10 lg:p-12 text-center space-y-6">
          {/* Corner Ornamental Accents */}
          <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-[#0B3B75]" />
          <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-[#0B3B75]" />
          <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-[#0B3B75]" />
          <div className="absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 border-[#0B3B75]" />

          {/* Top Institutional Header */}
          <div className="space-y-3">
            <p className="text-[11px] sm:text-xs font-bold tracking-widest text-[#0B3B75] uppercase">
              {republicHeader}
            </p>

            <div className="flex flex-col items-center justify-center gap-2">
              <AslaLogo size="lg" theme="light" showText={false} />
              <div className="space-y-0.5">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B3B75] font-display tracking-tight">
                  Aprantisaj se lò Akademi (ASLA)
                </h2>
                <p className="text-xs font-bold text-[#B45309] tracking-wide">
                  Aprantisaj se lò Akademi — Edikasyon jodi a, yon pi bon demen
                </p>
              </div>
            </div>
          </div>

          {/* Ornamental Gold Divider */}
          <div className="flex items-center justify-center gap-3">
            <div className="h-px w-20 sm:w-32 bg-[#D97706]/50" />
            <Award className="w-5 h-5 text-[#D97706]" />
            <div className="h-px w-20 sm:w-32 bg-[#D97706]/50" />
          </div>

          {/* Credential Type & Main Title */}
          <div className="space-y-2">
            <div className="text-xs font-mono font-semibold text-[#B91C1C]">
              {isDiploma
                ? 'DIPLÒM OFISYÈL FINISMAN ETID · HIGH SCHOOL DIPLOMA'
                : certificate.certificateType === 'Grade Promotion'
                ? `SÈTIFIKA REYISIT NIVO AKADEMIK · ${certificate.grade.toUpperCase()}`
                : `SÈTIFIKA AKONPLISMAN PA MATYÈ · ${certificate.subjectName || certificate.grade}`}
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#0B3B75] font-display max-w-2xl mx-auto">
              {titleText}
            </h1>
          </div>

          {/* Conferral Lead & Student Full Name */}
          <div className="space-y-3 py-2">
            <p className="text-xs sm:text-sm text-slate-600 italic">{conferralLead}</p>

            <div className="inline-block border-b-2 border-[#D97706] px-6 sm:px-12 pb-2">
              <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0B2545] font-display tracking-tight">
                {certificate.studentName}
              </div>
            </div>

            <div className="text-xs font-mono text-slate-600 tabular-nums">
              <span>Kòd Elèv : {certificate.studentCode}</span>
              <span className="mx-2">·</span>
              <span className="font-bold text-[#0B3B75]">{certificate.grade}</span>
              <span> ({gradeProfile.haitianEquivalent})</span>
              <span className="mx-2">·</span>
              <span>{certificate.classroom}</span>
            </div>
          </div>

          {/* Citation Paragraph */}
          <p className="text-sm sm:text-base text-slate-800 max-w-2xl mx-auto leading-relaxed">
            {citationText}
          </p>

          {/* Academic Metrics & Honors Row */}
          <div className="max-w-2xl mx-auto pt-2 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono tabular-nums">
            <div className="p-3 rounded-lg bg-[#0B3B75]/5 border border-[#0B3B75]/15">
              <div className="text-slate-500">Mwayèn / Nòt Final</div>
              <div className="text-base font-bold text-[#0B3B75] mt-0.5">
                {certificate.finalAverageScore}% / 100
              </div>
            </div>
            <div className="p-3 rounded-lg bg-[#FACC15]/15 border border-[#D97706]/30">
              <div className="text-slate-600">Mansyon Onorifik (Honors)</div>
              <div className="text-xs font-bold text-[#92400E] mt-1">
                {certificate.honors}
              </div>
            </div>
            <div className="p-3 rounded-lg bg-[#0B3B75]/5 border border-[#0B3B75]/15">
              <div className="text-slate-500">Ane Akademik</div>
              <div className="text-base font-bold text-[#0B3B75] mt-0.5">
                {certificate.academicYear}
              </div>
            </div>
          </div>

          {/* Signatures & Official Embossed Gold Seal */}
          <div className="pt-8 mt-4 border-t border-slate-200 grid grid-cols-1 md:grid-cols-3 items-end gap-6">
            {/* Left Signature: Sindy Salomon */}
            <div className="text-center space-y-1">
              <div className="font-display italic text-2xl text-[#0B3B75] border-b border-slate-400 pb-1 mx-4">
                Sindy Salomon
              </div>
              <div className="text-xs font-bold text-[#0B2545]">Sindy Salomon</div>
              <div className="text-[11px] text-slate-600">{directorRoleLabel}</div>
            </div>

            {/* Center: Gold Embossed Official Seal */}
            <div className="flex flex-col items-center justify-center">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#FACC15] via-[#EAB308] to-[#CA8A04] p-1.5 shadow-md flex items-center justify-center border-2 border-[#0B3B75]">
                <div className="w-full h-full rounded-full border border-dashed border-[#0B3B75] flex flex-col items-center justify-center text-center px-1">
                  <span className="text-[8px] font-mono font-bold text-[#0B3B75] tracking-wider">
                    SCEAU OFFICIEL
                  </span>
                  <span className="text-sm font-black text-[#0B3B75] font-display leading-tight">
                    ASLA
                  </span>
                  <span className="text-[8px] font-bold text-[#0B3B75]">GRADES 7–12</span>
                  <span className="text-[7px] font-mono text-[#0B3B75]">HAÏTI</span>
                </div>
              </div>
              <div className="mt-2 text-[11px] font-mono text-slate-500 tabular-nums">
                N° {certificate.serialNumber} · {certificate.issuedAt}
              </div>
            </div>

            {/* Right Signature: Academic Council */}
            <div className="text-center space-y-1">
              <div className="font-display italic text-2xl text-[#0B3B75] border-b border-slate-400 pb-1 mx-4">
                Konsèy Akademik ASLA
              </div>
              <div className="text-xs font-bold text-[#0B2545]">Konsèy Akademik ASLA</div>
              <div className="text-[11px] text-slate-600">{councilRoleLabel}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
