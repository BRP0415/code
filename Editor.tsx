import React, { useState, useEffect, useRef } from 'react';
import { FileTab } from '../types';

interface EditorProps {
  code: string;
  language: FileTab;
  onChange: (value: string) => void;
}

const Editor: React.FC<EditorProps> = ({ code, language, onChange }) => {
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const [lineNumbers, setLineNumbers] = useState<number[]>([]);
  
  useEffect(() => {
    if (code) {
      const lines = code.split('\n');
      setLineNumbers(Array.from({ length: lines.length }, (_, i) => i + 1));
    } else {
      setLineNumbers([1]);
    }
  }, [code]);
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      
      const target = e.target as HTMLTextAreaElement;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      
      const newValue = code.substring(0, start) + '  ' + code.substring(end);
      onChange(newValue);
      
      setTimeout(() => {
        if (editorRef.current) {
          editorRef.current.selectionStart = editorRef.current.selectionEnd = start + 2;
        }
      }, 0);
    }
  };
  
  return (
    <div className="flex h-full bg-gray-900">
      <div className="bg-gray-800 text-gray-500 py-4 pl-4 pr-6 text-right select-none font-mono border-r border-gray-700">
        {lineNumbers.map(num => (
          <div key={num} className="h-[21px] text-xs leading-[21px]">
            {num}
          </div>
        ))}
      </div>
      
      <div className="flex-1 relative">
        <div className="absolute top-2 right-2 px-2 py-1 bg-gray-800 text-gray-400 text-xs font-medium rounded">
          {language.toUpperCase()}
        </div>
        <textarea
          ref={editorRef}
          value={code}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full h-full p-4 bg-gray-900 text-gray-100 outline-none resize-none font-mono text-sm leading-[21px] focus:ring-1 focus:ring-blue-500 focus:ring-opacity-50"
          spellCheck="false"
          placeholder={`Enter your ${language.toUpperCase()} code here...`}
        />
      </div>
    </div>
  );
};

export default Editor;