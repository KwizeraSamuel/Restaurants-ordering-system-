'use client';

import React from 'react';
import {
  JAVA_PROJECT_FILES,
  ACADEMIC_PROJECT_INFO,
  RUBRIC_CRITERIA,
  generateProjectReportMarkdown,
  JavaFileEntry,
} from '@/lib/javaProjectCode';
import { sound } from '@/lib/sound';
import {
  X,
  Copy,
  Check,
  Download,
  FileCode,
  Users,
  GraduationCap,
  FolderTree,
  CheckCircle2,
  BookOpen,
  FileText,
  Archive,
} from 'lucide-react';

interface JavaCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function JavaCodeModal({ isOpen, onClose }: JavaCodeModalProps) {
  const [activeTab, setActiveTab] = React.useState<'code' | 'rubric' | 'report'>('code');
  const [selectedFile, setSelectedFile] = React.useState<JavaFileEntry>(JAVA_PROJECT_FILES[0]);
  const [copied, setCopied] = React.useState(false);
  const [reportCopied, setReportCopied] = React.useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    sound.click();
    navigator.clipboard.writeText(selectedFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadFile = () => {
    sound.click();
    const blob = new Blob([selectedFile.code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = selectedFile.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadAllJavaBundle = () => {
    sound.click();
    const combined = JAVA_PROJECT_FILES.map(
      (f) =>
        `// ============================================================================\n` +
        `// FILE: src/com/group3/restaurant/${f.filename}\n` +
        `// DESCRIPTION: ${f.description}\n` +
        `// ============================================================================\n\n` +
        `${f.code}\n\n`
    ).join('\n');
    const blob = new Blob([combined], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Group3_CSC1102_All_Java_Source_Files.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadReport = () => {
    sound.click();
    const md = generateProjectReportMarkdown();
    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Group3_CSC1102_Project_Documentation_Report.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopyReport = () => {
    sound.click();
    navigator.clipboard.writeText(generateProjectReportMarkdown());
    setReportCopied(true);
    setTimeout(() => setReportCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-6xl h-[90vh] overflow-hidden shadow-2xl flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4 bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex flex-wrap items-center gap-2">
                <span>{ACADEMIC_PROJECT_INFO.course}</span>
                <span className="text-xs px-2 py-0.5 rounded bg-blue-950 text-blue-400 border border-blue-800">
                  {ACADEMIC_PROJECT_INFO.groupName} • {ACADEMIC_PROJECT_INFO.session}
                </span>
                <span className="text-xs px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 font-mono">
                  Archive: {ACADEMIC_PROJECT_INFO.submissionZipName}
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {ACADEMIC_PROJECT_INFO.projectTitle} • Deadline: {ACADEMIC_PROJECT_INFO.deadline}
              </p>
            </div>
          </div>

          {/* Modal Navigation Tabs */}
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-slate-900 border border-slate-800 p-1 rounded-lg">
              <button
                onClick={() => {
                  sound.click();
                  setActiveTab('code');
                }}
                className={`px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 transition-colors ${
                  activeTab === 'code'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <FileCode className="w-3.5 h-3.5" />
                <span>Java Swing Source (6 Files)</span>
              </button>
              <button
                onClick={() => {
                  sound.click();
                  setActiveTab('rubric');
                }}
                className={`px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 transition-colors ${
                  activeTab === 'rubric'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Lecturer Rubric Checklist</span>
              </button>
              <button
                onClick={() => {
                  sound.click();
                  setActiveTab('report');
                }}
                className={`px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 transition-colors ${
                  activeTab === 'report'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Project Report & Exam PDF</span>
              </button>
            </div>

            <button
              onClick={onClose}
              aria-label="Close Java source modal"
              className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Team Members Strip */}
        <div className="bg-slate-950/70 border-b border-slate-800/80 px-4 py-2.5 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5">
            <span className="text-slate-400 font-semibold flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-blue-400" />
              <span>Group 3 Team:</span>
            </span>
            {ACADEMIC_PROJECT_INFO.members.map((m, idx) => (
              <div key={idx} className="flex items-center gap-1.5 text-slate-300">
                <span className="font-semibold text-white">
                  {idx + 1}. {m.name}
                </span>
                <span className="text-[11px] font-mono text-blue-400">({m.regNo})</span>
              </div>
            ))}
          </div>

          <button
            onClick={handleDownloadAllJavaBundle}
            className="px-2.5 py-1 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-700/60 rounded-md text-xs font-medium flex items-center gap-1.5 transition-colors shrink-0"
          >
            <Archive className="w-3.5 h-3.5" />
            <span>Download All Java Code (.txt)</span>
          </button>
        </div>

        {/* TAB 1: JAVA SOURCE CODE */}
        {activeTab === 'code' && (
          <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden">
            {/* File Tree Left */}
            <div className="w-full md:w-72 bg-slate-950/90 border-r border-slate-800 p-3 flex flex-col overflow-y-auto">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 px-2 flex items-center gap-1.5">
                <FolderTree className="w-3.5 h-3.5 text-slate-500" />
                <span>src/com/group3/restaurant/</span>
              </div>
              <div className="space-y-1.5">
                {JAVA_PROJECT_FILES.map((file) => {
                  const isActive = selectedFile.filename === file.filename;
                  return (
                    <button
                      key={file.filename}
                      onClick={() => {
                        sound.click();
                        setSelectedFile(file);
                      }}
                      className={`w-full text-left px-3 py-2.5 rounded-lg text-xs transition-colors flex flex-col gap-1 ${
                        isActive
                          ? 'bg-blue-600 text-white font-semibold shadow-xs'
                          : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2 font-mono">
                        <FileCode className="w-3.5 h-3.5 shrink-0 opacity-80" />
                        <span className="truncate">{file.filename}</span>
                      </div>
                      <div
                        className={`text-[10px] pl-5 line-clamp-1 ${
                          isActive ? 'text-blue-100' : 'text-slate-500'
                        }`}
                      >
                        {file.oopConcepts.join(' • ')}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="mt-auto pt-4 border-t border-slate-800 text-[11px] text-slate-400 px-2 space-y-1.5 leading-relaxed">
                <div className="font-semibold text-slate-200">MUELE Submission Note:</div>
                <div>
                  Zip all <code className="text-blue-400">.java</code> files + the PDF report as{' '}
                  <code className="text-emerald-400 font-mono">
                    {ACADEMIC_PROJECT_INFO.submissionZipName}
                  </code>
                  .
                </div>
              </div>
            </div>

            {/* Code Viewer Right */}
            <div className="flex-1 flex flex-col min-h-0 bg-slate-950">
              {/* File info bar */}
              <div className="p-3.5 border-b border-slate-800 bg-slate-900/60 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-semibold text-blue-400">
                      {selectedFile.packagePath}
                    </span>
                    <div className="flex flex-wrap items-center gap-1">
                      {selectedFile.oopConcepts.map((concept, i) => (
                        <span
                          key={i}
                          className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700"
                        >
                          {concept}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">{selectedFile.description}</div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopy}
                    className="px-3 py-1.5 text-xs text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-md transition-colors flex items-center gap-1.5"
                  >
                    {copied ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    <span>{copied ? 'Copied' : 'Copy Code'}</span>
                  </button>

                  <button
                    onClick={handleDownloadFile}
                    className="px-3 py-1.5 text-xs text-white bg-blue-600 hover:bg-blue-500 rounded-md transition-colors flex items-center gap-1.5 font-medium"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download {selectedFile.filename}</span>
                  </button>
                </div>
              </div>

              {/* Code text block */}
              <div className="flex-1 overflow-auto p-4 font-mono text-xs text-slate-200 select-text leading-relaxed">
                <pre>
                  <code>{selectedFile.code}</code>
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: LECTURER RUBRIC COMPLIANCE MATRIX */}
        {activeTab === 'rubric' && (
          <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-slate-950">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-bold text-white">
                  CSC 1102 Practical Exam Grading Rubric & Verification Matrix
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Prepared for Group 3&apos;s 15-minute lecturer presentation — maps every exam requirement to exact Java classes and live POS features.
                </p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950 text-emerald-400 border border-emerald-800">
                100% Lecturer Guidelines Satisfied
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {RUBRIC_CRITERIA.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-bold text-blue-400">{item.category}</span>
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/60">
                        <CheckCircle2 className="w-3 h-3" /> Verified
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-3 rounded-lg border border-slate-800/80">
                      <strong className="text-slate-100">Lecturer Requirement:</strong> {item.requirement}
                    </p>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      <strong className="text-slate-200">Group 3 Implementation:</strong>{' '}
                      {item.implementationDetails}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-800 space-y-1.5">
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                      Code References (Click to Inspect):
                    </div>
                    <div className="space-y-1">
                      {item.codeLocations.map((loc, lIdx) => {
                        const matchedFile = JAVA_PROJECT_FILES.find((f) =>
                          loc.startsWith(f.filename.replace('.java', ''))
                        );
                        return (
                          <div
                            key={lIdx}
                            onClick={() => {
                              if (matchedFile) {
                                sound.click();
                                setSelectedFile(matchedFile);
                                setActiveTab('code');
                              }
                            }}
                            className="text-xs font-mono text-slate-300 bg-slate-950 px-2.5 py-1.5 rounded border border-slate-800 hover:border-blue-500/60 hover:text-blue-300 cursor-pointer transition-colors"
                          >
                            → {loc}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: PROJECT REPORT & EXAM BRIEF PDF */}
        {activeTab === 'report' && (
          <div className="flex-1 overflow-y-auto p-6 bg-slate-950 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0">
            {/* Left 7 cols: Printable / Downloadable <5 Page Project Documentation */}
            <div className="lg:col-span-7 flex flex-col bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
              <div className="p-4 border-b border-slate-800 bg-slate-950 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-400" />
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    Submission Document (Title Page + Class Architecture Report)
                  </h4>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyReport}
                    className="px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-md flex items-center gap-1 transition-colors"
                  >
                    {reportCopied ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    <span>{reportCopied ? 'Copied' : 'Copy Report'}</span>
                  </button>
                  <button
                    onClick={handleDownloadReport}
                    className="px-3 py-1 text-xs bg-blue-600 hover:bg-blue-500 text-white rounded-md font-medium flex items-center gap-1 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Report (.md)</span>
                  </button>
                </div>
              </div>

              <div className="p-5 overflow-y-auto flex-1 font-mono text-xs text-slate-200 whitespace-pre-wrap select-text leading-relaxed">
                {generateProjectReportMarkdown()}
              </div>
            </div>

            {/* Right 5 cols: Embedded Lecturer Guidelines PDF */}
            <div className="lg:col-span-5 flex flex-col bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
              <div className="p-4 border-b border-slate-800 bg-slate-950 flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Official CSC 1102 Exam Instructions PDF
                </span>
                <a
                  href={ACADEMIC_PROJECT_INFO.examPdfPath}
                  download="CSC_1102_Practical_Exam_Project.pdf"
                  className="px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-blue-400 rounded-md flex items-center gap-1 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Save PDF</span>
                </a>
              </div>
              <div className="flex-1 bg-slate-950 min-h-[420px]">
                <iframe
                  src={ACADEMIC_PROJECT_INFO.examPdfPath}
                  title="CSC 1102 Practical Exam Project Instructions"
                  className="w-full h-full border-0"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
