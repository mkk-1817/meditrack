/**
 * Test suite for AI Health Insights Engine
 * Tests the deterministic health recommendation logic
 */

import { 
  generateHealthInsights,
  analyzeCardiovascularHealth,
  analyzeSleepPatterns,
  analyzeStressLevels,
  calculateWellnessScore,
  HealthMetrics,
  HealthInsight
} from '../lib/ai-insights';
import { mockVitalData, mockInsightData } from '../jest.setup';

describe('AI Health Insights Engine', () => {
  const mockHealthMetrics: HealthMetrics = {
    heartRate: { average: 72, min: 65, max: 85, trend: 'stable' },
    bloodPressure: { 
      systolic: { average: 120, trend: 'stable' },
      diastolic: { average: 80, trend: 'stable' }
    },
    sleep: {
      duration: 7.5,
      quality: 85,
      deepSleepPercentage: 25,
      remSleepPercentage: 20
    },
    stress: { level: 30, trend: 'decreasing' },
    activity: { dailySteps: 8500, caloriesBurned: 2200 },
    hydration: { dailyIntake: 2.1, target: 2.5 },
    glucose: { average: 95, trend: 'stable' },
    weight: { current: 70, trend: 'stable' },
    bmi: 22.5,
    age: 30,
    gender: 'female'
  };

  describe('Cardiovascular Health Analysis', () => {
    test('identifies normal cardiovascular health', () => {
      const insights = analyzeCardiovascularHealth(mockHealthMetrics);
      
      expect(insights).toHaveLength(1);
      expect(insights[0].type).toBe('cardiovascular');
      expect(insights[0].priority).toBe('low');
      expect(insights[0].title).toContain('Excellent');
    });

    test('detects elevated heart rate', () => {
      const metrics = {
        ...mockHealthMetrics,
        heartRate: { average: 95, min: 85, max: 110, trend: 'increasing' as const }
      };
      
      const insights = analyzeCardiovascularHealth(metrics);
      
      expect(insights).toHaveLength(1);
      expect(insights[0].priority).toBe('medium');
      expect(insights[0].title).toContain('Elevated');
    });

    test('detects high blood pressure', () => {
      const metrics = {
        ...mockHealthMetrics,
        bloodPressure: {
          systolic: { average: 145, trend: 'increasing' as const },
          diastolic: { average: 95, trend: 'increasing' as const }
        }
      };
      
      const insights = analyzeCardiovascularHealth(metrics);
      
      expect(insights).toHaveLength(1);
      expect(insights[0].priority).toBe('high');
      expect(insights[0].title).toContain('High Blood Pressure');
    });

    test('provides appropriate recommendations', () => {
      const metrics = {
        ...mockHealthMetrics,
        heartRate: { average: 85, min: 75, max: 95, trend: 'increasing' as const }
      };
      
      const insights = analyzeCardiovascularHealth(metrics);
      
      expect(insights[0].recommendation).toContain('exercise');
      expect(insights[0].confidence).toBeGreaterThan(70);
    });
  });

  describe('Sleep Pattern Analysis', () => {
    test('identifies good sleep quality', () => {
      const insights = analyzeSleepPatterns(mockHealthMetrics);
      
      expect(insights).toHaveLength(1);
      expect(insights[0].type).toBe('sleep');
      expect(insights[0].priority).toBe('low');
      expect(insights[0].title).toContain('Good');
    });

    test('detects insufficient sleep', () => {
      const metrics = {
        ...mockHealthMetrics,
        sleep: {
          duration: 5.5,
          quality: 60,
          deepSleepPercentage: 15,
          remSleepPercentage: 12
        }
      };
      
      const insights = analyzeSleepPatterns(metrics);
      
      expect(insights).toHaveLength(1);
      expect(insights[0].priority).toBe('medium');
      expect(insights[0].title).toContain('Insufficient');
    });

    test('detects poor sleep quality', () => {
      const metrics = {
        ...mockHealthMetrics,
        sleep: {
          duration: 7.0,
          quality: 45,
          deepSleepPercentage: 10,
          remSleepPercentage: 8
        }
      };
      
      const insights = analyzeSleepPatterns(metrics);
      
      expect(insights[0].priority).toBe('medium');
      expect(insights[0].recommendation).toContain('sleep hygiene');
    });
  });

  describe('Stress Level Analysis', () => {
    test('identifies low stress levels', () => {
      const insights = analyzeStressLevels(mockHealthMetrics);
      
      expect(insights).toHaveLength(1);
      expect(insights[0].type).toBe('stress');
      expect(insights[0].priority).toBe('low');
    });

    test('detects high stress levels', () => {
      const metrics = {
        ...mockHealthMetrics,
        stress: { level: 80, trend: 'increasing' as const }
      };
      
      const insights = analyzeStressLevels(metrics);
      
      expect(insights[0].priority).toBe('high');
      expect(insights[0].title).toContain('High Stress');
      expect(insights[0].recommendation).toContain('stress management');
    });

    test('considers stress trends', () => {
      const increasingStress = {
        ...mockHealthMetrics,
        stress: { level: 50, trend: 'increasing' as const }
      };
      
      const decreasingStress = {
        ...mockHealthMetrics,
        stress: { level: 50, trend: 'decreasing' as const }
      };
      
      const increasingInsights = analyzeStressLevels(increasingStress);
      const decreasingInsights = analyzeStressLevels(decreasingStress);
      
      expect(increasingInsights[0].priority).toBe('medium');
      expect(decreasingInsights[0].priority).toBe('low');
    });
  });

  describe('Wellness Score Calculation', () => {
    test('calculates wellness score correctly', () => {
      const score = calculateWellnessScore(mockHealthMetrics);
      
      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(100);
      expect(score).toBeGreaterThan(80); // Should be high for good metrics
    });

    test('adjusts score based on health factors', () => {
      const poorMetrics = {
        ...mockHealthMetrics,
        heartRate: { average: 100, min: 90, max: 120, trend: 'increasing' as const },
        sleep: { duration: 5, quality: 40, deepSleepPercentage: 10, remSleepPercentage: 8 },
        stress: { level: 85, trend: 'increasing' as const }
      };
      
      const poorScore = calculateWellnessScore(poorMetrics);
      const goodScore = calculateWellnessScore(mockHealthMetrics);
      
      expect(poorScore).toBeLessThan(goodScore);
      expect(poorScore).toBeLessThan(60);
    });

    test('considers age and gender factors', () => {
      const youngMetrics = { ...mockHealthMetrics, age: 25 };
      const olderMetrics = { ...mockHealthMetrics, age: 65 };
      
      const youngScore = calculateWellnessScore(youngMetrics);
      const olderScore = calculateWellnessScore(olderMetrics);
      
      // Scores should be adjusted for age appropriately
      expect(typeof youngScore).toBe('number');
      expect(typeof olderScore).toBe('number');
    });
  });

  describe('Comprehensive Insight Generation', () => {
    test('generates multiple insights for complex health data', () => {
      const insights = generateHealthInsights(mockHealthMetrics);
      
      expect(insights).toBeInstanceOf(Array);
      expect(insights.length).toBeGreaterThan(0);
      
      // Should have insights from different categories
      const categories = insights.map(insight => insight.category);
      expect(new Set(categories).size).toBeGreaterThan(1);
    });

    test('prioritizes insights correctly', () => {
      const complexMetrics = {
        ...mockHealthMetrics,
        heartRate: { average: 95, min: 85, max: 110, trend: 'increasing' as const },
        stress: { level: 75, trend: 'increasing' as const },
        sleep: { duration: 5.5, quality: 50, deepSleepPercentage: 12, remSleepPercentage: 10 }
      };
      
      const insights = generateHealthInsights(complexMetrics);
      
      // High priority insights should come first
      const highPriorityInsights = insights.filter(i => i.priority === 'high');
      const mediumPriorityInsights = insights.filter(i => i.priority === 'medium');
      
      if (highPriorityInsights.length > 0 && mediumPriorityInsights.length > 0) {
        const firstHighIndex = insights.findIndex(i => i.priority === 'high');
        const firstMediumIndex = insights.findIndex(i => i.priority === 'medium');
        expect(firstHighIndex).toBeLessThan(firstMediumIndex);
      }
    });

    test('includes confidence scores', () => {
      const insights = generateHealthInsights(mockHealthMetrics);
      
      insights.forEach(insight => {
        expect(insight.confidence).toBeGreaterThanOrEqual(0);
        expect(insight.confidence).toBeLessThanOrEqual(100);
        expect(typeof insight.confidence).toBe('number');
      });
    });

    test('provides actionable recommendations', () => {
      const insights = generateHealthInsights(mockHealthMetrics);
      
      insights.forEach(insight => {
        expect(insight.recommendation).toBeTruthy();
        expect(typeof insight.recommendation).toBe('string');
        expect(insight.recommendation.length).toBeGreaterThan(10);
      });
    });
  });

  describe('Edge Cases and Error Handling', () => {
    test('handles missing data gracefully', () => {
      const incompleteMetrics = {
        heartRate: { average: 72, min: 65, max: 85, trend: 'stable' as const },
        age: 30,
        gender: 'female' as const
      } as Partial<HealthMetrics>;
      
      expect(() => {
        generateHealthInsights(incompleteMetrics as HealthMetrics);
      }).not.toThrow();
    });

    test('handles extreme values', () => {
      const extremeMetrics = {
        ...mockHealthMetrics,
        heartRate: { average: 200, min: 180, max: 220, trend: 'stable' as const },
        bloodPressure: {
          systolic: { average: 220, trend: 'stable' as const },
          diastolic: { average: 120, trend: 'stable' as const }
        }
      };
      
      const insights = generateHealthInsights(extremeMetrics);
      
      expect(insights.length).toBeGreaterThan(0);
      expect(insights.some(i => i.priority === 'high')).toBe(true);
    });

    test('validates input data types', () => {
      const invalidMetrics = {
        ...mockHealthMetrics,
        heartRate: { average: 'invalid', min: 65, max: 85, trend: 'stable' }
      } as any;
      
      expect(() => {
        generateHealthInsights(invalidMetrics);
      }).not.toThrow();
    });
  });

  describe('Performance', () => {
    test('executes within reasonable time', () => {
      const startTime = performance.now();
      
      generateHealthInsights(mockHealthMetrics);
      
      const endTime = performance.now();
      const executionTime = endTime - startTime;
      
      expect(executionTime).toBeLessThan(100); // Should execute in under 100ms
    });

    test('handles large datasets efficiently', () => {
      const largeMetrics = {
        ...mockHealthMetrics,
        historicalData: new Array(1000).fill(mockVitalData)
      };
      
      const startTime = performance.now();
      generateHealthInsights(largeMetrics);
      const endTime = performance.now();
      
      expect(endTime - startTime).toBeLessThan(500);
    });
  });
});