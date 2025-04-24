export type FileTab = 'html' | 'css' | 'js';

export interface CodeState {
  html: string;
  css: string;
  js: string;
}

export interface FileData {
  id: string;
  name: string;
  type: string;
  content: string;
  path: string;
}

export interface FileTreeItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  path: string;
  children?: FileTreeItem[];
}

export type PreviewType = 'web' | 'markdown' | 'image' | 'code';