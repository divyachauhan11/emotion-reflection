import React, { useState, useEffect } from 'react';
import EmotionForm from './components/EmotionForm';
import EmotionResult from './components/EmotionResult';
import LoadingSpinner from './components/LoadingSpinner';
import { ApiService } from './services/api';
import { EmotionAnalysis, LoadingState } from './types';
import './App.css';

const App: React.FC = () => {
  const [loadingState, setLoadingState] = useState<LoadingState>('idle');
  const [analysis, setAnalysis] = useState<EmotionAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check API health on component mount
    const checkApiHealth = async () => {
      try {
        await ApiService.healthCheck();
        console.log('API is healthy');
      } catch (error) {
        console.warn('API health check failed:', error);
      }
    };

    checkApiHealth();
  }, []);

  const handleAnalyze = async (text: string) => {
    setLoadingState('loading');
    setError(null);
        
    try {
      const result = await ApiService.analyzeEmotion(text);
      setAnalysis(result);
      setLoadingState('success');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
      setLoadingState('error');
    }
  };

  const handleReset = () => {
    setLoadingState('idle');
    setAnalysis(null);
    setError(null);
  };

  return (
    <div className="app">
      <div className="container">
        {(loadingState === 'idle' || loadingState === 'loading') && (
          <EmotionForm 
            onSubmit={handleAnalyze}
            isLoading={loadingState === 'loading'}
          />
        )}
                
        {loadingState === 'loading' && <LoadingSpinner />}
                
        {loadingState === 'success' && analysis && (
          <EmotionResult 
            analysis={analysis}
            onReset={handleReset}
          />
        )}
                
        {loadingState === 'error' && (
          <div className="error-state">
            <h2>😕 Something went wrong</h2>
            <p>{error}</p>
            <button onClick={handleReset} className="reset-button">
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;