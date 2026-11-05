'use client';

import React from 'react';
import { JAVA_PROJECT_FILES, ACADEMIC_PROJECT_INFO, JavaFileEntry } from '@/lib/javaProjectCode';
import { sound } from '@/lib/sound';
import { X, Copy, Check, Download, FileCode, Users, GraduationCap, FolderTree } from 'lucide-react';

interface JavaCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function JavaCodeModal({ isOpen, onClose }: JavaCodeModalProps) {
  const [selectedFile, setSelectedFile] = React.useState<JavaFileEntry>(JAVA_PROJECT_FILES[0]);
  const [copied, setCopied] = React.useState(false);

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-5xl h-[88vh] overflow-hidden shadow-2xl flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>{ACADEMIC_PROJECT_INFO.course}</span>
                <span className="text-xs px-2 py-0.5 rounded bg-blue-950 text-blue-400 border border-blue-800">
                  {ACADEMIC_PROJECT_INFO.groupName}
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                {ACADEMIC_PROJECT_INFO.projectTitle} • {ACADEMIC_PROJECT_INFO.session}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Team Members Strip */}
        <div className="bg-slate-950/70 border-b border-slate-800/80 px-4 py-2.5 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs">
          <span className="text-slate-400 font-semibold flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-blue-400" />
            <span>Group Members:</span>
          </span>
          {ACADEMIC_PROJECT_INFO.members.map((m, idx) => (
            <div key={idx} className="flex items-center gap-1.5 text-slate-300">
              <span className="font-semibold text-white">{idx + 1}. {m.name}</span>
              <span className="text-[11px] font-mono text-slate-400">({m.regNo})</span>
            </div>
          ))}
        </div>

        {/* Main Body: File Selector Tree on Left, Code Viewer on Right */}
        <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden">
          {/* File Tree Left */}
          <div className="w-full md:w-64 bg-slate-950/90 border-r border-slate-800 p-3 flex flex-col overflow-y-auto">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 px-2 flex items-center gap-1.5">
              <FolderTree className="w-3.5 h-3.5 text-slate-500" />
              <span>Java Packages</span>
            </div>
            <div className="space-y-1">
              {JAVA_PROJECT_FILES.map((file) => {
                const isActive = selectedFile.filename === file.filename;
                return (
                  <button
                    key={file.filename}
                    onClick={() => {
                      sound.click();
                      setSelectedFile(file);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-mono transition-colors flex items-center gap-2 ${
                      isActive
                        ? 'bg-blue-600 text-white font-semibold shadow-xs'
                        : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                    }`}
                  >
                    <FileCode className="w-3.5 h-3.5 shrink-0 opacity-70" />
                    <span className="truncate">{file.filename}</span>
                  </button>
                );
              })}
            </div>

            <div className="mt-auto pt-4 border-t border-slate-800 text-[11px] text-slate-500 px-2 leading-relaxed">
              Clean 4-tier layered architecture: Domain Model, Persistence, Service, and Presentation.
            </div>
          </div>

          {/* Code Viewer Right */}
          <div className="flex-1 flex flex-col min-h-0 bg-slate-950">
            {/* File info bar */}
            <div className="p-3 border-b border-slate-800 bg-slate-900/60 flex items-center justify-between gap-4">
              <div>
                <div className="text-xs font-mono font-semibold text-blue-400">
                  {selectedFile.packagePath}
                </div>
                <div className="text-[11px] text-slate-400">{selectedFile.description}</div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="px-2.5 py-1 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-md transition-colors flex items-center gap-1"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>

                <button
                  onClick={handleDownloadFile}
                  className="px-2.5 py-1 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-md transition-colors flex items-center gap-1"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
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
      </div>
    </div>
  );
}
