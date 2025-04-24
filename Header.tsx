import React from 'react';
import { Play, Layout, Code, FileJson, FileType2, Download } from 'lucide-react';
import { FileTab } from '../types';

interface HeaderProps {
  activeTab: FileTab;
  setActiveTab: (tab: FileTab) => void;
  isPreviewVisible: boolean;
  setIsPreviewVisible: (visible: boolean) => void;
  onRun: () => void;
  onExport: () => void;
}

const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  isPreviewVisible,
  setIsPreviewVisible,
  onRun,
  onExport
}) => {
  return (
    <header className="flex items-center justify-between h-14 bg-gray-800 border-b border-gray-700 px-4">
      <div className="flex items-center">
        <div className="flex items-center mr-6">
          <Code className="w-6 h-6 text-blue-400 mr-2" />
          <h1 className="text-lg font-semibold">CodePlayground</h1>
        </div>
        
        <nav className="flex h-full">
          <TabButton 
            active={activeTab === 'html'} 
            onClick={() => setActiveTab('html')}
            icon={<FileType2 className="w-4 h-4 mr-2" />}
            label="HTML"
          />
          
          <TabButton 
            active={activeTab === 'css'} 
            onClick={() => setActiveTab('css')}
            icon={<FileJson className="w-4 h-4 mr-2" />}
            label="CSS"
          />
          
          <TabButton 
            active={activeTab === 'js'} 
            onClick={() => setActiveTab('js')}
            icon={<FileJson className="w-4 h-4 mr-2" />}
            label="JS"
          />
        </nav>
      </div>
      
      <div className="flex items-center space-x-2">
        <button 
          className="flex items-center h-9 px-4 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors duration-200"
          onClick={() => setIsPreviewVisible(!isPreviewVisible)}
        >
          <Layout className="w-4 h-4 mr-2" />
          {isPreviewVisible ? 'Hide Preview' : 'Show Preview'}
        </button>
        
        <button 
          className="flex items-center h-9 px-4 bg-purple-600 hover:bg-purple-500 rounded-md transition-colors duration-200"
          onClick={onExport}
        >
          <Download className="w-4 h-4 mr-2" />
          Export
        </button>
        
        <button 
          className="flex items-center h-9 px-4 bg-green-600 hover:bg-green-500 rounded-md transition-colors duration-200"
          onClick={onRun}
        >
          <Play className="w-4 h-4 mr-2" />
          Run
        </button>
      </div>
    </header>
  );
};

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

const TabButton: React.FC<TabButtonProps> = ({ active, onClick, icon, label }) => {
  return (
    <button
      className={`flex items-center h-full px-4 border-b-2 transition-colors duration-200 ${
        active
          ? 'border-blue-500 text-blue-400'
          : 'border-transparent text-gray-400 hover:text-gray-300 hover:bg-gray-700'
      }`}
      onClick={onClick}
    >
      {icon}
      {label}
    </button>
  );
};

export default Header;