import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import BasicInfo from './index';
import PersonalContact from '../PersonalContact';
import { useAppStore } from '../../../store/useAppStore';
import type { ResumeData } from '../../../types';
import fixture from '../../../test/fixtures/resume.json';

const basics = (fixture as ResumeData).basics;

const contact = {
  email: '',
  locations: [
    { en: 'Colombia', es: 'Colombia', phone: '+57 300 000 0000' },
    { en: 'Spain', es: 'España', phone: '+34 600 000 000' },
  ],
};

describe('BasicInfo', () => {
  it('shows name, title and public contact links', () => {
    useAppStore.setState({ language: 'en' });
    render(<BasicInfo basics={basics} />);

    expect(screen.getByRole('heading', { level: 1, name: 'Ada Tester' })).toBeInTheDocument();
    expect(screen.getByText('Frontend Engineer')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'ada@example.com' })).toHaveAttribute(
      'href',
      'mailto:ada@example.com'
    );
  });

  it('names the country from the URL without a session', () => {
    useAppStore.setState({ language: 'es', locationSlug: 'spain' });
    render(<BasicInfo basics={basics} />);

    expect(screen.getByText('Remoto · España')).toBeInTheDocument();
  });

  it('defaults to Colombia on a bare language URL', () => {
    useAppStore.setState({ language: 'en', locationSlug: null });
    render(<BasicInfo basics={basics} />);

    expect(screen.getByText('Remote · Colombia')).toBeInTheDocument();
  });
});

describe('PersonalContact', () => {
  it('never shows a phone without the private data', () => {
    useAppStore.setState({ locationSlug: 'spain' });
    render(<PersonalContact />);

    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('shows the phone for the location in the URL', () => {
    useAppStore.setState({ contactData: contact, locationSlug: 'spain' });
    render(<PersonalContact />);

    expect(screen.getByRole('link', { name: '+34 600 000 000' })).toHaveAttribute(
      'href',
      'tel:+34600000000'
    );
  });
});
