export enum AiAction {
  Summarize = 'Summarize',
  Improve = 'Improve Writing',
  Translate = 'Translate',
  GenerateIdeas = 'Generate Ideas',
  FindActionItems = 'Find Action Items',
  CheckSpelling = 'Check Spelling & Grammar',
}

// FIX: Add missing type definitions for JunkFile, StartupProgram, and DiskUsageData.
export interface JunkFile {
  id: string;
  name: string;
  category: string;
  size: number;
}

export type ImpactLevel = 'High' | 'Medium' | 'Low';

export interface StartupProgram {
  id: string;
  name: string;
  publisher: string;
  impact: ImpactLevel;
  enabled: boolean;
}

export interface DiskUsageData {
  name: string;
  value: number;
  fill: string;
}
