import React, { useState } from 'react';

interface EmotionFormProps {
  onSubmit: (text: string) => void;
  isLoading: boolean;
}

const EmotionForm: React.FC<EmotionFormProps> = ({ onSubmit, isLoading }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onSubmit(text.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="emotion-form">
      <div className="form-header">
        <h1>💭 Emotion Reflection</h1>
        <p>Share what you're feeling right now</p>
      </div>
      
      <div className="form-group">
        <label htmlFor="reflection">Your Reflection</label>
        <textarea
          id="reflection"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="e.g., I feel nervous about my first job interview..."
          maxLength={1000}
          rows={4}
          disabled={isLoading}
          required
        />
        <span className="char-count">{text.length}/1000</span>
      </div>

      <button 
        type="submit" 
        disabled={!text.trim() || isLoading}
        className="submit-button"
      >
        {isLoading ? 'Analyzing...' : 'Analyze Emotion'}
      </button>
    </form>
  );
};

export default EmotionForm;