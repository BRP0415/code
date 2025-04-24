import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Editor from './components/Editor';
import Preview from './components/Preview';
import FileExplorer from './components/FileExplorer';
import { FileTab, CodeState, FileTreeItem, FileData, PreviewType } from './types';
import { getInitialCode, combineCode } from './utils/codeUtils';

function App() {
  const [activeTab, setActiveTab] = useState<FileTab>('html');
  const [code, setCode] = useState<CodeState>(getInitialCode());
  const [isPreviewVisible, setIsPreviewVisible] = useState(true);
  const [editorWidth, setEditorWidth] = useState(50);
  const [files, setFiles] = useState<FileTreeItem[]>([]);
  const [activeFile, setActiveFile] = useState<FileData | null>(null);
  
  useEffect(() => {
    localStorage.setItem('code', JSON.stringify(code));
  }, [code]);

  const handleCodeChange = (value: string) => {
    if (activeFile) {
      setActiveFile({ ...activeFile, content: value });
    } else {
      setCode({
        ...code,
        [activeTab]: value
      });
    }
  };

  const handleExport = () => {
    const combinedCode = combineCode(code.html, code.css, code.js);
    const blob = new Blob([combinedCode], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'index.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getPreviewType = (fileType: string): PreviewType => {
    if (['html', 'htm'].includes(fileType)) return 'web';
    if (['md', 'markdown'].includes(fileType)) return 'markdown';
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(fileType)) return 'image';
    return 'code';
  };

  const handleFileCreate = (type: 'file' | 'folder', path: string) => {
    const name = prompt(`Enter ${type} name:`);
    if (!name) return;

    const newItem: FileTreeItem = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      type,
      path: `${path}/${name}`,
      children: type === 'folder' ? [] : undefined
    };

    setFiles([...files, newItem]);
  };

  const handleFileUpload = (fileList: FileList) => {
    Array.from(fileList).forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        const newFile: FileTreeItem = {
          id: Math.random().toString(36).substr(2, 9),
          name: file.name,
          type: 'file',
          path: `/${file.name}`,
          content
        };
        setFiles([...files, newFile]);
      };
      reader.readAsText(file);
    });
  };

  const handleResize = (event: React.MouseEvent<HTMLDivElement>) => {
    const startX = event.clientX;
    const startWidth = editorWidth;
    
    const handleMouseMove = (e: MouseEvent) => {
      const containerWidth = window.innerWidth;
      const newWidth = (startWidth + ((e.clientX - startX) / containerWidth) * 100);
      const constrainedWidth = Math.min(Math.max(newWidth, 20), 80);
      setEditorWidth(constrainedWidth);
    };
    
    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      <Header 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isPreviewVisible={isPreviewVisible}
        setIsPreviewVisible={setIsPreviewVisible}
        onRun={() => {}}
        onExport={handleExport}
      />
      
      <div className="flex flex-1 overflow-hidden">
        <FileExplorer
          files={files}
          onFileSelect={setActiveFile}
          onFileCreate={handleFileCreate}
          onFileUpload={handleFileUpload}
        />
        
        <div 
          className="h-full overflow-auto transition-all duration-300"
          style={{ width: `${isPreviewVisible ? editorWidth : 100}%` }}
        >
          <Editor 
            code={activeFile?.content || code[activeTab]} 
            language={activeTab} 
            onChange={handleCodeChange} 
          />
        </div>
        
        {isPreviewVisible && (
          <>
            <div 
              className="w-2 bg-gray-700 cursor-col-resize hover:bg-blue-500 transition-colors duration-200"
              onMouseDown={handleResize}
            />
            <div 
              className="h-full overflow-auto transition-all duration-300"
              style={{ width: `${100 - editorWidth}%` }}
            >
              {activeFile ? (
                <Preview
                  content={activeFile.content}
                  type={getPreviewType(activeFile.name.split('.').pop() || '')}
                  language={activeFile.name.split('.').pop()}
                />
              ) : (
                <Preview
                  content={combineCode(code.html, code.css, code.js)}
                  type="web"
                />
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;