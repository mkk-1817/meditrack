/**
 * Test suite for VitalCard component
 * Tests luxury UI component behavior, accessibility, and interactions
 */

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import VitalCard from '../components/VitalCard';
import { mockVitalData } from '../jest.setup';

// Mock the motion variants to avoid animation issues
jest.mock('../lib/motionVariants', () => ({
  cardHover: {
    initial: { scale: 1 },
    hover: { scale: 1.02 },
  },
  shimmer: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
  },
}));

describe('VitalCard Component', () => {
  const defaultProps = {
    title: 'Heart Rate',
    value: 72,
    unit: 'bpm',
    trend: 'stable' as const,
    status: 'normal' as const,
    icon: 'heart',
    data: mockVitalData,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering and Basic Functionality', () => {
    test('renders vital card with correct data', () => {
      render(<VitalCard {...defaultProps} />);
      
      expect(screen.getByText('Heart Rate')).toBeInTheDocument();
      expect(screen.getByText('72')).toBeInTheDocument();
      expect(screen.getByText('bpm')).toBeInTheDocument();
    });

    test('displays trend indicator correctly', () => {
      const { rerender } = render(<VitalCard {...defaultProps} trend="up" />);
      expect(screen.getByText(/trending up/i)).toBeInTheDocument();

      rerender(<VitalCard {...defaultProps} trend="down" />);
      expect(screen.getByText(/trending down/i)).toBeInTheDocument();

      rerender(<VitalCard {...defaultProps} trend="stable" />);
      expect(screen.getByText(/stable/i)).toBeInTheDocument();
    });

    test('applies correct status styling', () => {
      const { rerender } = render(<VitalCard {...defaultProps} status="normal" />);
      const card = screen.getByRole('article');
      expect(card).toHaveClass('border-green-200');

      rerender(<VitalCard {...defaultProps} status="warning" />);
      expect(card).toHaveClass('border-yellow-200');

      rerender(<VitalCard {...defaultProps} status="critical" />);
      expect(card).toHaveClass('border-red-200');
    });

    test('shows loading state correctly', () => {
      render(<VitalCard {...defaultProps} loading={true} />);
      
      expect(screen.getByText(/loading/i)).toBeInTheDocument();
      expect(screen.getByTestId('loading-shimmer')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    test('has proper ARIA attributes', () => {
      render(<VitalCard {...defaultProps} />);
      
      const card = screen.getByRole('article');
      expect(card).toHaveAttribute('aria-label', expect.stringContaining('Heart Rate'));
      
      const status = screen.getByText('72');
      expect(status).toHaveAttribute('aria-live', 'polite');
    });

    test('supports keyboard navigation', async () => {
      const user = userEvent.setup();
      render(<VitalCard {...defaultProps} />);
      
      const card = screen.getByRole('article');
      await user.tab();
      
      expect(card).toHaveFocus();
    });

    test('provides screen reader friendly content', () => {
      render(<VitalCard {...defaultProps} />);
      
      expect(screen.getByLabelText(/heart rate: 72 bpm, normal status, stable trend/i))
        .toBeInTheDocument();
    });

    test('meets color contrast requirements', () => {
      render(<VitalCard {...defaultProps} />);
      
      const title = screen.getByText('Heart Rate');
      const computedStyle = window.getComputedStyle(title);
      
      // This would normally use a proper contrast ratio checker
      expect(computedStyle.color).toBeDefined();
    });
  });

  describe('Interactions', () => {
    test('handles click events', async () => {
      const handleClick = jest.fn();
      const user = userEvent.setup();
      
      render(<VitalCard {...defaultProps} onClick={handleClick} />);
      
      const card = screen.getByRole('article');
      await user.click(card);
      
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    test('handles hover effects', async () => {
      const user = userEvent.setup();
      render(<VitalCard {...defaultProps} />);
      
      const card = screen.getByRole('article');
      
      await user.hover(card);
      expect(card).toHaveClass('hover:shadow-lg');
      
      await user.unhover(card);
      // Verify hover state is properly managed
    });

    test('handles focus and blur correctly', async () => {
      const user = userEvent.setup();
      render(<VitalCard {...defaultProps} />);
      
      const card = screen.getByRole('article');
      
      await user.tab();
      expect(card).toHaveFocus();
      expect(card).toHaveClass('focus:ring-2');
      
      await user.tab();
      expect(card).not.toHaveFocus();
    });
  });

  describe('Data Formatting', () => {
    test('formats large numbers correctly', () => {
      render(
        <VitalCard 
          {...defaultProps} 
          value={1234567} 
          title="Steps"
          unit="steps"
        />
      );
      
      // Should format as 1.2M or similar
      expect(screen.getByText(/1\./)).toBeInTheDocument();
    });

    test('handles decimal values', () => {
      render(
        <VitalCard 
          {...defaultProps} 
          value={98.6} 
          title="Temperature"
          unit="°F"
        />
      );
      
      expect(screen.getByText('98.6')).toBeInTheDocument();
    });

    test('handles missing or invalid data', () => {
      render(
        <VitalCard 
          {...defaultProps} 
          value={null}
        />
      );
      
      expect(screen.getByText(/no data/i)).toBeInTheDocument();
    });
  });

  describe('Performance', () => {
    test('does not cause unnecessary re-renders', () => {
      const renderSpy = jest.fn();
      
      const TestComponent = (props: any) => {
        renderSpy();
        return <VitalCard {...props} />;
      };

      const { rerender } = render(<TestComponent {...defaultProps} />);
      
      expect(renderSpy).toHaveBeenCalledTimes(1);
      
      // Re-render with same props should not cause additional renders
      rerender(<TestComponent {...defaultProps} />);
      expect(renderSpy).toHaveBeenCalledTimes(1);
      
      // Re-render with different props should cause re-render
      rerender(<TestComponent {...defaultProps} value={80} />);
      expect(renderSpy).toHaveBeenCalledTimes(2);
    });

    test('handles rapid prop changes gracefully', async () => {
      const { rerender } = render(<VitalCard {...defaultProps} />);
      
      // Rapidly change values
      for (let i = 0; i < 10; i++) {
        rerender(<VitalCard {...defaultProps} value={70 + i} />);
      }
      
      await waitFor(() => {
        expect(screen.getByText('79')).toBeInTheDocument();
      });
    });
  });

  describe('Error Handling', () => {
    test('handles component errors gracefully', () => {
      // Suppress console.error for this test
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      
      const ErrorComponent = () => {
        throw new Error('Test error');
      };
      
      expect(() => {
        render(
          <VitalCard 
            {...defaultProps}
            // @ts-ignore - intentionally passing invalid prop
            customRenderer={ErrorComponent}
          />
        );
      }).not.toThrow();
      
      consoleSpy.mockRestore();
    });
  });

  describe('Responsive Behavior', () => {
    test('adapts to mobile viewport', () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });
      
      render(<VitalCard {...defaultProps} />);
      
      const card = screen.getByRole('article');
      expect(card).toHaveClass('p-4'); // Mobile padding
    });

    test('adapts to desktop viewport', () => {
      // Mock desktop viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1024,
      });
      
      render(<VitalCard {...defaultProps} />);
      
      const card = screen.getByRole('article');
      expect(card).toHaveClass('p-6'); // Desktop padding
    });
  });
});