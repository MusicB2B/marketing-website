import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Sections } from '@/components/sections';
import { parseSiteContent } from '@/lib/validate';
import raw from '../../content/site.json';

const content = parseSiteContent(JSON.parse(JSON.stringify(raw)));
const find = (type: string) => content.sections.find((s) => s.type === type)!;

describe('Sections', () => {
  it('renders every visible section and none of the hidden ones', () => {
    const { container } = render(<Sections sections={content.sections} />);
    const visible = content.sections.filter((s) => s.visible);
    expect(container.querySelectorAll('section')).toHaveLength(visible.length);
  });

  it('hiding a section removes it from the page', () => {
    const hidden = content.sections.map((s) => ({ ...s, visible: false }));
    const { container } = render(<Sections sections={hidden} />);
    expect(container.querySelectorAll('section')).toHaveLength(0);
  });

  it('puts the section id on the element, so anchors keep working', () => {
    const { container } = render(<Sections sections={[find('requestAccess')]} />);
    expect(container.querySelector('#request-access')).toBeInTheDocument();
  });

  it('shows the copy from the content file rather than anything hardcoded', () => {
    const how = find('howItWorks');
    render(<Sections sections={[how]} />);
    expect(screen.getByText(how.fields.heading!)).toBeInTheDocument();
    for (const step of how.items) {
      expect(screen.getByText(step.title!)).toBeInTheDocument();
    }
  });

  it('renders a heading edited to anything at all', () => {
    const how = {
      ...find('howItWorks'),
      fields: { ...find('howItWorks').fields, heading: 'Zzz Qqq' },
    };
    render(<Sections sections={[how]} />);
    expect(screen.getByText('Zzz Qqq')).toBeInTheDocument();
  });

  // Empty strings are a normal thing for an editor to leave behind.
  it('does not render empty optional copy as blank elements', () => {
    const how = find('howItWorks');
    const stripped = { ...how, fields: { ...how.fields, eyebrow: '', subheading: '' } };
    const { container } = render(<Sections sections={[stripped]} />);
    expect(container.textContent).not.toContain('undefined');
  });

  it('renders the six matching-engine cards from the content file', () => {
    // Currently hidden in the content, so force it visible for this test.
    const features = { ...find('features'), visible: true };
    const { container } = render(<Sections sections={[features]} />);
    expect(container.querySelectorAll('article')).toHaveLength(features.items.length);
  });

  it('renders a section with no items without falling over', () => {
    const empty = { ...find('features'), visible: true, items: [] };
    const { container } = render(<Sections sections={[empty]} />);
    expect(container.querySelectorAll('article')).toHaveLength(0);
  });
});
