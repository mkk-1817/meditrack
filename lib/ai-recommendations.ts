/**
 * AI Health Recommendation Engine
 * Deterministic client-side logic for generating personalized health insights
 */

import vitalsData from '../data/vitals.json';
import insightsData from '../data/insights.json';

export interface VitalReading {
  id: string;
  type: string;
  value: number;
  unit: string;
  timestamp: string;
  severity: 'normal' | 'warning' | 'critical';
  trend: 'up' | 'down' | 'stable';
  trendValue: number;
  notes?: string;
}

export interface HealthInsight {
  id: string;
  title: string;
  category: string;
  description: string;
  severity: 'normal' | 'warning' | 'critical';
  recommendation: string;
  actions: string[];
  benefits: string;
  confidence: number; // 0-100
  priority: 'low' | 'medium' | 'high';
}

export interface UserProfile {
  age?: number;
  gender?: 'male' | 'female' | 'other';
  height?: number;
  weight?: number;
  activityLevel?: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  medicalConditions?: string[];
  medications?: string[];
  goals?: string[];
}

export interface SymptomInput {
  symptoms: string[];
  severity: number; // 1-10
  duration: string;
  frequency: string;
  triggers?: string[];
}

/**
 * Main AI recommendation engine
 */
export class HealthRecommendationEngine {
  private vitals: VitalReading[];
  private insightTemplates: any[];

  constructor() {
    this.vitals = vitalsData.vitals as VitalReading[];
    this.insightTemplates = insightsData.insightTemplates;
  }

  /**
   * Generate health recommendations based on vitals and user profile
   */
  public getHealthRecommendations(params: {
    vitals?: Record<string, number>;
    symptoms?: string[];
    lifestyle?: UserProfile;
    symptomInput?: SymptomInput;
  }): HealthInsight[] {
    const { vitals = {}, symptoms = [], lifestyle = {}, symptomInput } = params;
    const insights: HealthInsight[] = [];

    // Merge current vitals with historical data
    const currentVitals = this.getCurrentVitals(vitals);
    
    // Analyze cardiovascular health
    const cardiovascularInsight = this.analyzeCardiovascularHealth(currentVitals, lifestyle);
    if (cardiovascularInsight) insights.push(cardiovascularInsight);

    // Analyze sleep quality
    const sleepInsight = this.analyzeSleepQuality(currentVitals, lifestyle);
    if (sleepInsight) insights.push(sleepInsight);

    // Analyze stress levels
    const stressInsight = this.analyzeStressLevels(currentVitals, symptoms, symptomInput);
    if (stressInsight) insights.push(stressInsight);

    // Analyze hydration
    const hydrationInsight = this.analyzeHydration(currentVitals, lifestyle);
    if (hydrationInsight) insights.push(hydrationInsight);

    // Analyze glucose levels
    const glucoseInsight = this.analyzeGlucose(currentVitals, lifestyle);
    if (glucoseInsight) insights.push(glucoseInsight);

    // Analyze physical activity
    const activityInsight = this.analyzeActivity(currentVitals, lifestyle);
    if (activityInsight) insights.push(activityInsight);

    // Sort by priority and confidence, return top 3
    return insights
      .sort((a, b) => {
        const priorityWeight = { high: 3, medium: 2, low: 1 };
        const priorityDiff = priorityWeight[b.priority] - priorityWeight[a.priority];
        if (priorityDiff !== 0) return priorityDiff;
        return b.confidence - a.confidence;
      })
      .slice(0, 3);
  }

  /**
   * Get current vitals with defaults from historical data
   */
  private getCurrentVitals(inputVitals: Record<string, number>): Record<string, number> {
    const latestVitals: Record<string, number> = {};
    
    // Get latest readings for each vital type
    const vitalTypes = ['heartRate', 'bloodPressureSystolic', 'bloodPressureDiastolic', 
                       'temperature', 'glucose', 'sleepHours', 'stressLevel', 
                       'waterIntake', 'steps', 'exerciseMinutes'];

    vitalTypes.forEach(type => {
      if (inputVitals[type] !== undefined) {
        latestVitals[type] = inputVitals[type];
      } else {
        // Use latest from historical data
        const latestReading = this.vitals
          .filter(v => v.type === type)
          .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];
        if (latestReading) {
          latestVitals[type] = latestReading.value;
        }
      }
    });

    return latestVitals;
  }

  /**
   * Analyze cardiovascular health
   */
  private analyzeCardiovascularHealth(vitals: Record<string, number>, _lifestyle: UserProfile): HealthInsight | null {
    const heartRate = vitals.heartRate;
    const systolic = vitals.bloodPressureSystolic;
    const exercise = vitals.exerciseMinutes || 0;

    if (!heartRate || !systolic) return null;

    let assessment = 'fair';
    let priority: 'low' | 'medium' | 'high' = 'medium';
    let confidence = 75;

    // Determine assessment level
    if (heartRate >= 60 && heartRate <= 80 && systolic >= 90 && systolic <= 120 && exercise >= 30) {
      assessment = 'excellent';
      priority = 'low';
      confidence = 90;
    } else if (heartRate >= 60 && heartRate <= 100 && systolic >= 90 && systolic <= 130 && exercise >= 20) {
      assessment = 'good';
      priority = 'low';
      confidence = 85;
    } else if (systolic > 140 || heartRate > 100) {
      assessment = 'poor';
      priority = 'high';
      confidence = 95;
    }

    const template = this.insightTemplates.find(t => t.id === 'cardiovascular_health');
    const recommendation = template?.recommendations[assessment] || 'Consult with a healthcare provider.';

    return {
      id: 'cardiovascular_health',
      title: 'Cardiovascular Health Assessment',
      category: 'heart',
      description: `Based on your heart rate of ${heartRate} bpm and blood pressure reading of ${systolic} mmHg, your cardiovascular health appears ${assessment}.`,
      severity: assessment === 'poor' ? 'critical' : assessment === 'fair' ? 'warning' : 'normal',
      recommendation,
      actions: this.getCardiovascularActions(assessment),
      benefits: 'Improved heart health, reduced cardiovascular risk, better endurance',
      confidence,
      priority,
    };
  }

  /**
   * Analyze sleep quality
   */
  private analyzeSleepQuality(vitals: Record<string, number>, _lifestyle: UserProfile): HealthInsight | null {
    const sleepHours = vitals.sleepHours;
    const stressLevel = vitals.stressLevel || 0;

    if (!sleepHours) return null;

    let quality = 'fair';
    let priority: 'low' | 'medium' | 'high' = 'medium';
    let confidence = 80;

    if (sleepHours >= 7 && sleepHours <= 9 && stressLevel <= 3) {
      quality = 'excellent';
      priority = 'low';
      confidence = 90;
    } else if (sleepHours >= 6 && sleepHours <= 10 && stressLevel <= 5) {
      quality = 'good';
      priority = 'low';
      confidence = 85;
    } else if (sleepHours < 6 || sleepHours > 10 || stressLevel > 7) {
      quality = 'poor';
      priority = 'high';
      confidence = 95;
    }

    const template = this.insightTemplates.find(t => t.id === 'sleep_optimization');
    const recommendation = template?.recommendations[quality] || 'Focus on improving sleep hygiene.';

    return {
      id: 'sleep_optimization',
      title: 'Sleep Quality Optimization',
      category: 'sleep',
      description: `Your sleep pattern shows ${quality} quality with ${sleepHours} hours of rest.`,
      severity: quality === 'poor' ? 'warning' : 'normal',
      recommendation,
      actions: this.getSleepActions(quality),
      benefits: 'Better recovery, improved mood, enhanced cognitive function',
      confidence,
      priority,
    };
  }

  /**
   * Analyze stress levels
   */
  private analyzeStressLevels(
    vitals: Record<string, number>, 
    symptoms: string[], 
    _symptomInput?: SymptomInput
  ): HealthInsight | null {
    const stressLevel = vitals.stressLevel || 0;
    const heartRate = vitals.heartRate || 0;
    
    let stressCategory = 'low';
    let priority: 'low' | 'medium' | 'high' = 'low';
    let confidence = 75;

    // Factor in symptoms that indicate stress
    const stressSymptoms = ['anxiety', 'insomnia', 'headache', 'fatigue', 'irritability'];
    const hasStressSymptoms = symptoms.some(symptom => 
      stressSymptoms.some(stressSymptom => 
        symptom.toLowerCase().includes(stressSymptom)
      )
    );

    if (stressLevel >= 9 || (hasStressSymptoms && stressLevel >= 7)) {
      stressCategory = 'critical';
      priority = 'high';
      confidence = 95;
    } else if (stressLevel >= 7 || (hasStressSymptoms && stressLevel >= 5)) {
      stressCategory = 'high';
      priority = 'high';
      confidence = 90;
    } else if (stressLevel >= 4) {
      stressCategory = 'moderate';
      priority = 'medium';
      confidence = 80;
    }

    // Factor in elevated heart rate
    if (heartRate > 100 && stressLevel > 5) {
      confidence += 10;
      if (stressCategory === 'moderate') stressCategory = 'high';
    }

    const template = this.insightTemplates.find(t => t.id === 'stress_management');
    const recommendation = template?.recommendations[stressCategory] || 'Practice stress reduction techniques.';

    return {
      id: 'stress_management',
      title: 'Stress Level Management',
      category: 'mental',
      description: `Your stress levels are currently ${stressLevel}/10${hasStressSymptoms ? ' with stress-related symptoms detected' : ''}.`,
      severity: stressCategory === 'critical' ? 'critical' : stressCategory === 'high' ? 'warning' : 'normal',
      recommendation,
      actions: this.getStressActions(stressCategory),
      benefits: 'Reduced anxiety, better sleep, improved overall well-being',
      confidence,
      priority,
    };
  }

  /**
   * Analyze hydration levels
   */
  private analyzeHydration(vitals: Record<string, number>, _lifestyle: UserProfile): HealthInsight | null {
    const waterIntake = vitals.waterIntake || 0;
    const exercise = vitals.exerciseMinutes || 0;
    
    let status = 'fair';
    let priority: 'low' | 'medium' | 'high' = 'medium';
    let confidence = 70;

    // Adjust target based on exercise
    const baseTarget = 64; // 64 oz base
    const exerciseAdjustment = Math.floor(exercise / 30) * 8; // +8oz per 30min exercise
    const target = baseTarget + exerciseAdjustment;

    if (waterIntake >= target) {
      status = 'excellent';
      priority = 'low';
      confidence = 85;
    } else if (waterIntake >= target * 0.75) {
      status = 'good';
      priority = 'low';
      confidence = 80;
    } else if (waterIntake < target * 0.5) {
      status = 'poor';
      priority = 'high';
      confidence = 90;
    }

    const template = this.insightTemplates.find(t => t.id === 'hydration_wellness');
    const recommendation = template?.recommendations[status] || 'Increase daily water intake.';

    return {
      id: 'hydration_wellness',
      title: 'Hydration & Wellness',
      category: 'nutrition',
      description: `Your hydration levels are ${status} with ${waterIntake}oz consumed (target: ${target}oz).`,
      severity: status === 'poor' ? 'warning' : 'normal',
      recommendation,
      actions: this.getHydrationActions(status),
      benefits: 'Better physical performance, improved cognitive function, healthier skin',
      confidence,
      priority,
    };
  }

  /**
   * Analyze glucose levels
   */
  private analyzeGlucose(vitals: Record<string, number>, _lifestyle: UserProfile): HealthInsight | null {
    const glucose = vitals.glucose;
    
    if (!glucose) return null;

    let status = 'fair';
    let priority: 'low' | 'medium' | 'high' = 'medium';
    let confidence = 85;

    if (glucose >= 80 && glucose <= 100) {
      status = 'excellent';
      priority = 'low';
      confidence = 90;
    } else if (glucose >= 70 && glucose <= 110) {
      status = 'good';
      priority = 'low';
      confidence = 85;
    } else if (glucose >= 126) {
      status = 'poor';
      priority = 'high';
      confidence = 95;
    }

    const template = this.insightTemplates.find(t => t.id === 'glucose_management');
    const recommendation = template?.recommendations[status] || 'Monitor blood sugar levels regularly.';

    return {
      id: 'glucose_management',
      title: 'Blood Sugar Balance',
      category: 'metabolic',
      description: `Your glucose levels show ${status} control at ${glucose} mg/dL.`,
      severity: status === 'poor' ? 'critical' : status === 'fair' ? 'warning' : 'normal',
      recommendation,
      actions: this.getGlucoseActions(status),
      benefits: 'Stable energy levels, reduced diabetes risk, better weight management',
      confidence,
      priority,
    };
  }

  /**
   * Analyze physical activity
   */
  private analyzeActivity(vitals: Record<string, number>, _lifestyle: UserProfile): HealthInsight | null {
    const steps = vitals.steps || 0;
    const exercise = vitals.exerciseMinutes || 0;

    let status = 'fair';
    let priority: 'low' | 'medium' | 'high' = 'medium';
    let confidence = 80;

    if (steps >= 10000 && exercise >= 45) {
      status = 'excellent';
      priority = 'low';
      confidence = 90;
    } else if (steps >= 7500 && exercise >= 30) {
      status = 'good';
      priority = 'low';
      confidence = 85;
    } else if (steps < 5000 && exercise < 15) {
      status = 'poor';
      priority = 'high';
      confidence = 95;
    }

    const template = this.insightTemplates.find(t => t.id === 'activity_optimization');
    const recommendation = template?.recommendations[status] || 'Increase daily physical activity.';

    return {
      id: 'activity_optimization',
      title: 'Physical Activity Assessment',
      category: 'fitness',
      description: `Your activity level shows ${status} performance with ${steps} steps and ${exercise} minutes of exercise.`,
      severity: status === 'poor' ? 'warning' : 'normal',
      recommendation,
      actions: this.getActivityActions(status),
      benefits: 'Improved cardiovascular health, stronger muscles, better mood',
      confidence,
      priority,
    };
  }

  // Action generators for each category
  private getCardiovascularActions(assessment: string): string[] {
    const actions = {
      excellent: ['Continue current exercise routine', 'Maintain heart-healthy diet', 'Regular cardio checkups'],
      good: ['Add 30min moderate cardio 3-4x/week', 'Limit sodium intake', 'Monitor blood pressure weekly'],
      fair: ['Start with 15min daily walks', 'Reduce processed foods', 'Consult healthcare provider'],
      poor: ['Seek immediate medical evaluation', 'Begin supervised exercise program', 'Implement DASH diet']
    };
    return actions[assessment as keyof typeof actions] || [];
  }

  private getSleepActions(quality: string): string[] {
    const actions = {
      excellent: ['Maintain consistent sleep schedule', 'Continue good sleep hygiene'],
      good: ['Implement wind-down routine', 'Limit evening screen time'],
      fair: ['Create darker sleep environment', 'Avoid caffeine after 2pm'],
      poor: ['Consult sleep specialist', 'Consider sleep study', 'Address underlying stress']
    };
    return actions[quality as keyof typeof actions] || [];
  }

  private getStressActions(category: string): string[] {
    const actions = {
      low: ['Continue current stress management', 'Maintain social connections'],
      moderate: ['Practice 10min daily meditation', 'Try progressive muscle relaxation'],
      high: ['Consider stress counseling', 'Implement multiple stress techniques'],
      critical: ['Seek professional mental health support', 'Consider stress management programs']
    };
    return actions[category as keyof typeof actions] || [];
  }

  private getHydrationActions(status: string): string[] {
    const actions = {
      excellent: ['Maintain current hydration habits', 'Monitor during increased activity'],
      good: ['Add electrolytes after workouts', 'Set regular hydration reminders'],
      fair: ['Increase to 8-10 glasses daily', 'Drink water with each meal'],
      poor: ['Significantly increase water intake', 'Monitor for dehydration signs']
    };
    return actions[status as keyof typeof actions] || [];
  }

  private getGlucoseActions(status: string): string[] {
    const actions = {
      excellent: ['Maintain current diet', 'Continue regular monitoring'],
      good: ['Monitor post-meal levels', 'Maintain balanced diet'],
      fair: ['Reduce refined carbohydrates', 'Increase fiber intake'],
      poor: ['Consult healthcare provider', 'Consider glucose management plan']
    };
    return actions[status as keyof typeof actions] || [];
  }

  private getActivityActions(status: string): string[] {
    const actions = {
      excellent: ['Maintain high activity level', 'Vary exercise routine'],
      good: ['Try different activities', 'Increase intensity gradually'],
      fair: ['Take stairs when possible', 'Schedule daily walks'],
      poor: ['Start with 10min gentle activity', 'Gradually increase duration']
    };
    return actions[status as keyof typeof actions] || [];
  }
}

// Export singleton instance
export const healthRecommendationEngine = new HealthRecommendationEngine();

// Export convenience function
export default function getHealthRecommendations(params: Parameters<typeof healthRecommendationEngine.getHealthRecommendations>[0]) {
  return healthRecommendationEngine.getHealthRecommendations(params);
}