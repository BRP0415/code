import React, { useState } from 'react';
import { FolderIcon, FileIcon, Plus, Upload, MoreVertical } from 'lucide-react';
import { FileTreeItem } from '../types';

interface FileExplorerProps {
  files: FileTreeItem[];
  onFileSelect: (file: FileTreeItem) => void;
  onFileCreate: (type: 'file' | 'folder', path: string) => void;
  onFileUpload: (files: FileList) => void;
}

const FileExplorer: React.FC<FileExplorerProps> = ({
  files,
  onFileSelect,
  onFileCreate,
  onFileUpload
}) => {
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; path: string } | null>(null);

  const handleContextMenu = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, path });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    onFileUpload(files);
  };

  const renderTree = (items: FileTreeItem[], level = 0) => (
    <div style={{ paddingLeft: `${level * 16}px` }}>
      {items.map((item) => (
        <div
          key={item.id}
          className="flex items-center p-2 hover:bg-gray-800 cursor-pointer rounded"
          onClick={() => item.type === 'file' && onFileSelect(item)}
          onContextMenu={(e) => handleContextMenu(e, item.path)}
        >
          {item.type === 'folder' ? (
            <FolderIcon className="w-4 h-4 text-yellow-400 mr-2" />
          ) : (
            <FileIcon className="w-4 h-4 text-blue-400 mr-2" />
          )}
          <span className="text-sm text-gray-300">{item.name}</span>
          {item.children && renderTree(item.children, level + 1)}
        </div>
      ))}
    </div>
  );

  return (
    <div
      className="h-full bg-gray-900 border-r border-gray-700 p-2 w-64"
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      <div className="flex items-center justify-between mb-4 px-2">
        <h2 className="text-sm font-medium text-gray-300">Files</h2>
        <div className="flex space-x-2">
          <button
            className="p-1 hover:bg-gray-800 rounded"
            onClick={() => onFileCreate('file', '/')}
          >
            <Plus className="w-4 h-4 text-gray-400" />
          </button>
          <button
            className="p-1 hover:bg-gray-800 rounded"
            onClick={() => document.getElementById('file-upload')?.click()}
          >
            <Upload className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </div>

      {renderTree(files)}

      <input
        type="file"
        id="file-upload"
        className="hidden"
        multiple
        onChange={(e) => e.target.files && onFileUpload(e.target.files)}
      />

      {contextMenu && (
        <div
          className="fixed bg-gray-800 rounded shadow-lg py-1 z-50"
          style={{ top: contextMenu.y, left: contextMenu.x }}
        >
          <button
            className="w-full px-4 py-2 text-sm text-left text-gray-300 hover:bg-gray-700"
            onClick={() => onFileCreate('file', contextMenu.path)}
          >
            New File
          </button>
          <button
            className="w-full px-4 py-2 text-sm text-left text-gray-300 hover:bg-gray-700"
            onClick={() => onFileCreate('folder', contextMenu.path)}
          >
            New Folder
          </button>
        </div>
      )}
    </div>
  );
};

export default FileExplorer;