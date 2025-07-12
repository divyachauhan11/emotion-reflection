import React from 'react';
import { EmotionAnalysis } from '../types';

interface EmotionResultProps {
  analysis: EmotionAnalysis;
  onReset: () => void;
}

const EmotionResult: React.FC<EmotionResultProps> = ({ analysis, onReset }) => {
  const getEmotionEmoji = (emotion: string): string => {
    const emojiMap: { [key: string]: string } = {
      'anxious': '😰',
      'excited': '🤗',
      'sad': '😢',
      'confident': '💪',
      'overwhelmed': '😵',
      'neutral': '😐',
      'happy': '😊',
      'angry': '😠',
      'surprised': '😲',
      'fearful': '😨',
      'disgusted': '🤢'
    };
    return emojiMap[emotion.toLowerCase()] || '🤔';
  };

  const getConfidenceColor = (confidence: number): string => {
    if (confidence >= 0.8) return '#10B981'; // Green
    if (confidence >= 0.6) return '#F59E0B'; // Yellow
    return '#EF4444'; // Red
  };

  return (
    <div className="emotion-result">
      <div className="result-header">
        <span className="emotion-emoji">{getEmotionEmoji(analysis.emotion)}</span>
        <h2>You seem to be feeling</h2>
        <h3 className="emotion-label">{analysis.emotion}</h3>
      </div>
      
      <div className="confidence-section">
        <div className="confidence-bar">
          <div 
            className="confidence-fill"
            style={{ 
              width: `${analysis.confidence * 100}%`,
              backgroundColor: getConfidenceColor(analysis.confidence)
            }}
          />
        </div>
        <p className="confidence-text">
          {Math.round(analysis.confidence * 100)}% confidence
        </p>
      </div>

      {analysis.message && (
        <div className="support-message">
          <h4>💭 Reflection</h4>
          <p>{analysis.message}</p>
        </div>
      )}

      <button 
        className="reset-button"
        onClick={onReset}
      >
        Share Another Reflection
      </button>
    </div>
  );
};

export default EmotionResult;