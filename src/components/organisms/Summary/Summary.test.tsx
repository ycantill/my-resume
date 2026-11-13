import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Summary from './index';
import { useAppStore } from '../../../store/useAppStore';
import { saveResumeSection } from '../../../api-service';
import type { ResumeData } from '../../../types';
import fixture from '../../../test/fixtures/resume.json';

// Only the network write is replaced; validation and the store run for real
vi.mock('../../../api-service', async importOriginal => ({
  ...(await importOriginal<typeof import('../../../api-service')>()),
  saveResumeSection: vi.fn(),
}));

const resume = () => structuredClone(fixture) as ResumeData;

function renderSummary() {
  const { resumeData } = useAppStore.getState();
  return render(<Summary summary={resumeData!.basics.summary} />);
}

beforeEach(() => {
  vi.mocked(saveResumeSection).mockReset();
  useAppStore.setState({ resumeData: resume() });
});

describe('Summary', () => {
  it('shows the summary in the current language', () => {
    useAppStore.setState({ language: 'es' });
    renderSummary();

    expect(screen.getByRole('heading', { name: 'Resumen' })).toBeInTheDocument();
    expect(screen.getByText(fixture.basics.summary.es)).toBeInTheDocument();
  });

  it('is plain text outside edit mode', () => {
    renderSummary();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('saves an edit to the language being viewed only', async () => {
    vi.mocked(saveResumeSection).mockResolvedValue();
    useAppStore.setState({ language: 'en', editMode: true });
    const user = userEvent.setup();
    renderSummary();

    await user.click(screen.getByRole('button', { name: /summary/i }));
    const field = screen.getByRole('textbox');
    await user.clear(field);
    await user.type(field, 'Rewritten summary');
    await user.tab();

    expect(saveResumeSection).toHaveBeenCalledWith(
      'basics',
      expect.objectContaining({
        summary: { en: 'Rewritten summary', es: fixture.basics.summary.es },
      })
    );
    expect(useAppStore.getState().saveState).toBe('saved');
  });

  it('rolls the page back when the save fails', async () => {
    vi.mocked(saveResumeSection).mockRejectedValue(new Error('Not authorized'));
    useAppStore.setState({ language: 'en', editMode: true });
    const user = userEvent.setup();
    renderSummary();

    await user.click(screen.getByRole('button', { name: /summary/i }));
    await user.type(screen.getByRole('textbox'), ' and more');
    await user.tab();

    const state = useAppStore.getState();
    expect(state.resumeData?.basics.summary.en).toBe(fixture.basics.summary.en);
    expect(state.saveState).toBe('error');
    expect(state.saveError).toBe('Not authorized');
  });

  it('discards the draft on Escape', async () => {
    useAppStore.setState({ language: 'en', editMode: true });
    const user = userEvent.setup();
    renderSummary();

    await user.click(screen.getByRole('button', { name: /summary/i }));
    await user.type(screen.getByRole('textbox'), ' typo');
    await user.keyboard('{Escape}');

    expect(saveResumeSection).not.toHaveBeenCalled();
    expect(screen.getByText(fixture.basics.summary.en)).toBeInTheDocument();
  });
});
