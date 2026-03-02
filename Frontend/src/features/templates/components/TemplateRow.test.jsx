/**
 * TDD: TemplateRow — should only display Title, Description, and Action buttons.
 *
 * RED:  These tests will initially fail because the component shows extra columns.
 * GREEN: After rewriting TemplateRow, all tests should pass.
 */

import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import TemplateRow from './TemplateRow';

const mockTemplate = {
  id: 'test-1',
  name: 'My Test Template',
  content: 'A short description of what this template does.',
  category: 'Hiring',
  subject: 'Subject line',
  status: 'draft',
  visibility: 'team',
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-02-01'),
  version: '1.0',
  usage: 5,
};

const defaultProps = {
  template: mockTemplate,
  onDelete: vi.fn(),
  onClone: vi.fn(),
  onUpdate: vi.fn(),
  isLoading: false,
};

describe('TemplateRow – simplified view', () => {
  it('renders the template title', () => {
    render(<TemplateRow {...defaultProps} />);
    expect(screen.getByText('My Test Template')).toBeInTheDocument();
  });

  it('renders the template description (content)', () => {
    render(<TemplateRow {...defaultProps} />);
    expect(
      screen.getByText('A short description of what this template does.')
    ).toBeInTheDocument();
  });

  it('renders Clone and Delete action buttons', () => {
    render(<TemplateRow {...defaultProps} />);
    expect(screen.getByTitle('Clone')).toBeInTheDocument();
    expect(screen.getByTitle('Delete')).toBeInTheDocument();
  });

  it('does NOT render category/visibility text', () => {
    render(<TemplateRow {...defaultProps} />);
    expect(screen.queryByText('Category & Visibility')).not.toBeInTheDocument();
    expect(screen.queryByText('Team Visible')).not.toBeInTheDocument();
  });

  it('does NOT render status badge', () => {
    render(<TemplateRow {...defaultProps} />);
    // The "Draft" label from the status badge should not appear
    expect(screen.queryByText('Current Status')).not.toBeInTheDocument();
  });

  it('does NOT render metadata (usage count, version)', () => {
    render(<TemplateRow {...defaultProps} />);
    expect(screen.queryByText(/5 uses/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/v1\.0/)).not.toBeInTheDocument();
  });

  it('disables clone button when isLoading is true', () => {
    render(<TemplateRow {...defaultProps} isLoading={true} />);
    expect(screen.getByTitle('Cloning...')).toBeDisabled();
  });
});
