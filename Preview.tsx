import React, { useRef, useEffect } from 'react';
import { marked } from 'marked';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';
import { PreviewType } from '../types';

interface PreviewProps {
  content: string;
  type: PreviewType;
  language?: string;
}

const Preview: React.FC<PreviewProps> = ({ content, type, language }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (type === 'web') {
      updateWebPreview();
    } else if (type === 'markdown') {
      updateMarkdownPreview();
    } else if (type === 'code') {
      updateCodePreview();
    }
  }, [content, type, language]);

  const updateWebPreview = () => {
    if (!iframeRef.current) return;
    
    const iframe = iframeRef.current;
    const document = iframe.contentDocument || iframe.contentWindow?.document;
    if (!document) return;
    
    document.open();
    document.write(content);
    document.close();

    // Reset iframe height to match content
    iframe.style.height = '100%';
  };

  const updateMarkdownPreview = () => {
    if (!previewRef.current) return;
    const html = marked(content);
    previewRef.current.innerHTML = html;
  };

  const updateCodePreview = () => {
    if (!previewRef.current || !language) return;
    const highlighted = hljs.highlight(content, { language }).value;
    previewRef.current.innerHTML = `<pre><code class="hljs">${highlighted}</code></pre>`;
  };

  if (type === 'web') {
    return (
      <div className="h-full flex flex-col bg-gray-900">
        <div className="bg-gray-800 text-gray-300 px-4 py-2 text-sm font-medium border-b border-gray-700 flex items-center">
          <span className="text-blue-400 mr-2">▶</span> Preview
        </div>
        <div className="flex-1 bg-white">
          <iframe
            ref={iframeRef}
            title="Preview"
            className="w-full h-full border-0"
            sandbox="allow-scripts allow-same-origin allow-modals allow-popups"
          />
        </div>
      </div>
    );
  }

  if (type === 'image') {
    return (
      <div className="h-full flex flex-col bg-gray-900">
        <div className="bg-gray-800 text-gray-300 px-4 py-2 text-sm font-medium border-b border-gray-700">
          Image Preview
        </div>
        <div className="flex-1 flex items-center justify-center bg-gray-800">
          <img src={content} alt="Preview" className="max-w-full max-h-full object-contain" />
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gray-900">
      <div className="bg-gray-800 text-gray-300 px-4 py-2 text-sm font-medium border-b border-gray-700">
        {type === 'markdown' ? 'Markdown Preview' : 'Code Preview'}
      </div>
      <div
        ref={previewRef}
        className={`flex-1 overflow-auto p-4 ${
          type === 'markdown' ? 'prose prose-invert max-w-none' : ''
        }`}
      />
    </div>
  );
};

export default Preview;