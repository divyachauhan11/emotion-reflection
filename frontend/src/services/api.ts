import { EmotionAnalysis, ApiResponse } from '../types';

export class ApiService {
  private static readonly BASE_URL = 'http://localhost:5000/api';

  static async healthCheck(): Promise<void> {
    try {
      const response = await fetch(`${this.BASE_URL}/health`);
      if (!response.ok) {
        throw new Error('API health check failed');
      }
    } catch (error) {
      console.warn('API not available, using mock data');
    }
  }

  static async analyzeEmotion(text: string): Promise<EmotionAnalysis> {
    try {
      const response = await fetch(`${this.BASE_URL}/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze emotion');
      }

      const data: ApiResponse = await response.json();
      
      if (!data.success || !data.data) {
        throw new Error(data.error || 'Analysis failed');
      }

      return data.data;
    } catch (error) {
      console.warn('API unavailable, using mock analysis');
      return this.getMockAnalysis(text);
    }
  }

  private static getMockAnalysis(text: string): EmotionAnalysis {
    // Simple mock emotion detection based on keywords
    const lowerText = text.toLowerCase();
    
    const emotionKeywords = {
      happy: ['happy', 'joy', 'excited', 'great', 'amazing', 'wonderful', 'fantastic', 'love'],
      sad: ['sad', 'depressed', 'down', 'unhappy', 'crying', 'tears', 'disappointed'],
      anxious: ['anxious', 'nervous', 'worried', 'scared', 'afraid', 'panic', 'stress'],
      angry: ['angry', 'mad', 'furious', 'hate', 'annoyed', 'frustrated', 'rage'],
      excited: ['excited', 'thrilled', 'pumped', 'energetic', 'enthusiastic'],
      confident: ['confident', 'strong', 'capable', 'ready', 'prepared', 'determined'],
      overwhelmed: ['overwhelmed', 'too much', 'exhausted', 'tired', 'burnt out'],
      surprised: ['surprised', 'shocked', 'unexpected', 'wow', 'amazing'],
      fearful: ['fear', 'terrified', 'frightened', 'scary', 'afraid'],
      disgusted: ['disgusted', 'gross', 'sick', 'revolted', 'yuck']
    };

    let detectedEmotion = 'neutral';
    let maxMatches = 0;
    let confidence = 0.5;

    // Find emotion with most keyword matches
    for (const [emotion, keywords] of Object.entries(emotionKeywords)) {
      const matches = keywords.filter(keyword => lowerText.includes(keyword)).length;
      if (matches > maxMatches) {
        maxMatches = matches;
        detectedEmotion = emotion;
        confidence = Math.min(0.95, 0.6 + (matches * 0.15));
      }
    }

    // Generate contextual message
    const messages = {
      happy: "It's wonderful to hear you're feeling positive! Keep embracing those good vibes.",
      sad: "It's okay to feel sad sometimes. Remember that these feelings are temporary and you're not alone.",
      anxious: "Anxiety is natural, especially when facing new challenges. Try taking deep breaths and remember your strengths.",
      angry: "It's normal to feel frustrated. Consider what's within your control and healthy ways to express these feelings.",
      excited: "Your excitement is contagious! Channel that energy into something meaningful.",
      confident: "Your confidence is empowering! Trust in your abilities and keep moving forward.",
      overwhelmed: "When things feel overwhelming, break them down into smaller, manageable steps.",
      surprised: "Life is full of surprises! Embrace the unexpected moments.",
      fearful: "Fear is a natural response. Face it one step at a time with courage.",
      disgusted: "Strong reactions often signal important boundaries. Trust your instincts.",
      neutral: "Sometimes feeling neutral is perfectly fine. You're taking time to process and reflect."
    };

    return {
      emotion: detectedEmotion,
      confidence: confidence,
      message: messages[detectedEmotion as keyof typeof messages] || messages.neutral
    };
  }
}