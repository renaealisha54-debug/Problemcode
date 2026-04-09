

import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { Play, Sparkles, Smartphone, Settings, Share2, Download, Trash2 } from 'lucide-react';

export default function ProblemCode() {
  const [code, setCode] = useState("# Welcome to ProblemCode\n\ndef greet(name):\n    return f'Hello, {name}!'\n\nprint(greet('World'))");
  const [language, setLanguage] = useState("python");
  const [backendUrl, setBackendUrl] = useState("http://localhost:8000");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [terminal, setTerminal] = useState("System ready...");

  // Action: Execute Code
  const handleExecute = async () => {
    setTerminal("Executing...");
    try {
      const res = await fetch(`${backendUrl}/api/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language })
      });
      const data = await res.json();
      setTerminal(data.result || data.error);
    } catch (e) { setTerminal("Error: Could not connect to backend."); }
  };

  // Action: AI Correction
  const handleAICorrect = async () => {
    setTerminal("Claude is analyzing...");
    const res = await fetch(`${backendUrl}/api/ai/correct`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, language })
    });
    const data = await res.json();
    if (data.corrected_code) setCode(data.corrected_code);
    setTerminal("Code optimized by Claude Sonnet 4.5");
  };

  return (
    <div className="h-screen bg-[#0d1117] text-gray-300 flex flex-col font-sans">
      {/* Header Bar */}
      <header className="flex justify-between items-center p-3 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <span className="bg-blue-600 p-1 rounded text-white text-xs font-bold">PC</span>
          <span className="font-semibold">ProblemCode</span>
        </div>
        <div className="flex gap-4 items-center">
          <Settings size={18} className="cursor-pointer" onClick={() => setIsSettingsOpen(true)} />
          <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm flex items-center gap-1">
            Publish
          </button>
        </div>
      </header>

      {/* Editor Toolbar */}
      <div className="flex items-center gap-4 px-4 py-2 bg-[#161b22]">
        <select 
          value={language} 
          onChange={(e) => setLanguage(e.target.value)}
          className="bg-gray-800 border-none rounded text-xs p-1"
        >
          <option value="python">Python</option>
          <option value="javascript">JavaScript</option>
        </select>
        <Play size={16} onClick={handleExecute} className="cursor-pointer hover:text-green-500" />
        <Sparkles size={16} onClick={handleAICorrect} className="cursor-pointer hover:text-purple-400" />
      </div>

      {/* Monaco Editor */}
      <div className="flex-1">
        <Editor
          theme="vs-dark"
          language={language}
          value={code}
          onChange={(v) => setCode(v)}
          options={{ fontSize: 14, minimap: { enabled: false }, padding: { top: 10 } }}
        />
      </div>

      {/* Terminal / Console */}
      <div className="h-32 bg-black p-3 font-mono text-xs border-t border-gray-800 overflow-y-auto">
        <span className="text-gray-500">{"> "}</span> {terminal}
      </div>

      {/* Backend Settings Overlay (The Modal in your screenshot) */}
      {isSettingsOpen && (
        <div className="absolute inset-0 bg-black/70 flex items-end">
          <div className="w-full bg-[#161b22] rounded-t-2xl p-6 border-t border-gray-700">
            <h2 className="flex items-center gap-2 mb-4 font-bold">
              <span className="text-blue-400">{"<->"}</span> Backend Settings
            </h2>
            <p className="text-xs text-gray-500 mb-4">Configure the FastAPI backend URL for execution and AI features.</p>
            
            <div className="border border-gray-700 rounded-lg p-3 mb-6 bg-[#0d1117]">
              <label className="text-[10px] uppercase text-gray-500 block mb-1">Backend URL</label>
              <input 
                className="bg-transparent w-full text-sm outline-none"
                value={backendUrl}
                onChange={(e) => setBackendUrl(e.target.value)}
              />
            </div>

            <button 
              onClick={() => setIsSettingsOpen(false)}
              className="w-full bg-blue-500 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2"
            >
              💾 Save & Connect
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
