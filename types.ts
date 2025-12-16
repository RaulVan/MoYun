export interface Poem {
  id: string;
  title: string;
  dynasty: string;
  author: string;
  content: string[]; // Array of lines
  tags: string[];
  translation?: string; // Pre-filled or AI generated
}

export interface AnalysisResult {
  translation: string;
  appreciation: string;
}

export type ViewState = 'home' | 'detail';

export interface GeneratedImage {
  url: string;
  prompt: string;
}