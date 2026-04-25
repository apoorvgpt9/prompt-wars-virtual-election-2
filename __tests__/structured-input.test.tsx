import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { StructuredInput } from '../components/structured-input';
import { ACTIVE_CONFIG } from '../lib/domain-config';

describe('StructuredInput Component', () => {
  it('renders with correct label from ACTIVE_CONFIG', () => {
    render(<StructuredInput onSubmit={vi.fn()} isLoading={false} />);
    expect(screen.getByText(ACTIVE_CONFIG.inputLabel)).toBeDefined();
  });

  it('submit button is disabled when empty', () => {
    render(<StructuredInput onSubmit={vi.fn()} isLoading={false} />);
    const button = screen.getByRole('button', { name: /analyse topic/i });
    expect(button).toBeDisabled();
  });

  it('submit button is enabled when topic length is >= 3', () => {
    render(<StructuredInput onSubmit={vi.fn()} isLoading={false} />);
    const input = screen.getByPlaceholderText(ACTIVE_CONFIG.inputPlaceholder);
    const button = screen.getByRole('button', { name: /analyse topic/i });

    fireEvent.change(input, { target: { value: 'vot' } });
    expect(button).not.toBeDisabled();
  });

  it('calls onSubmit when Enter is pressed', () => {
    const handleSubmit = vi.fn();
    render(<StructuredInput onSubmit={handleSubmit} isLoading={false} />);
    const input = screen.getByPlaceholderText(ACTIVE_CONFIG.inputPlaceholder);

    fireEvent.change(input, { target: { value: 'voter registration' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    expect(handleSubmit).toHaveBeenCalledWith('voter registration');
  });

  it('renders suggested topics from ACTIVE_CONFIG', () => {
    render(<StructuredInput onSubmit={vi.fn()} isLoading={false} />);
    ACTIVE_CONFIG.topics.forEach(topic => {
      expect(screen.getByText(topic)).toBeDefined();
    });
  });
});
