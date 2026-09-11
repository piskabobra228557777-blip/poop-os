export type GamePhase =
  | 'NORMAL'
  | 'DOWNLOADING'
  | 'GHOST_CLOSING_WINDOWS'
  | 'GHOST_OPENING_ONION'
  | 'ONION_INTRO'
  | 'CMD_TYPING'
  | 'BLACKOUT_1'
  | 'ONION_STEALING_FILES'
  | 'ONION_OFFER'
  | 'RANSOMWARE_ACTIVE'
  | 'CUTSCENE_3D'
  | 'VICTORY'
  | 'JUMPSCARE';

export interface FileItem {
  id: string;
  name: string;
  folder: 'root' | 'documents' | 'downloads' | 'videos' | 'usb';
  type: 'file' | 'folder' | 'btc' | 'video' | 'image' | 'text' | 'exe' | 'zip';
  size: string;
  date: string;
  isRealBtc?: boolean;
  content?: string;
  icon?: string;
}

export interface WindowState {
  id: string;
  title: string;
  type: 'finder' | 'browser' | 'terminal' | 'onion' | 'text' | 'calculator' | 'notes' | 'music' | 'photos' | 'paint';
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  position: { x: number; y: number };
  size: { width: number; height: number };
  zIndex: number;
  initialFolder?: 'root' | 'documents' | 'downloads' | 'videos' | 'usb';
}

export interface OnionClone {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  rotation: number;
  isStopped: boolean;
}

export interface ClueInfo {
  id: number;
  text: string;
  subtext: string;
  timestamp: number;
}
