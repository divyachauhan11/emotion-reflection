export interface EmotionAnalysis {
  emotion: string;
  confidence: number;
  message?: string;
}

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface ApiResponse {
  success: boolean;
  data?: EmotionAnalysis;
  error?: string;
}