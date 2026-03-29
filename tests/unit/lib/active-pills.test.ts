import { describe, expect, it, vi } from 'vitest';
import { toChildArray, type ComponentChildren, type VNode } from 'preact';
import { ActivePills } from '../../../src/components/islands/filter/ActivePills';
import { createEmptyFilters } from '../../../src/lib/catalog/dimensions';

type PillButtonProps = {
  title?: string;
  'aria-label'?: string;
  children: ComponentChildren;
};

function getFirstPill(filters: ReturnType<typeof createEmptyFilters>): VNode<PillButtonProps> {
  const vnode = ActivePills({
    filters,
    query: '',
    onRemoveFilter: vi.fn(),
    onClearSearch: vi.fn(),
  }) as VNode<{ children: ComponentChildren }>;
  const pills = toChildArray(vnode.props.children);
  const firstPill = pills[0];

  if (!firstPill || typeof firstPill === 'string' || typeof firstPill === 'number') {
    throw new Error('Expected an active filter pill');
  }

  return firstPill as VNode<PillButtonProps>;
}

describe('ActivePills', () => {
  it('uses display labels for truncated filter pills', () => {
    const filters = createEmptyFilters();
    filters.obstruction.add('Change Preventers');

    const pill = getFirstPill(filters);
    const children = toChildArray(pill.props.children);

    expect(children[0]).toBe('Change Prev.');
    expect(pill.props.title).toBe('Change Preventers');
    expect(pill.props['aria-label']).toBe('Remove Change Preventers filter');
  });

  it('keeps the most descriptive accessible label for expanded pills', () => {
    const filters = createEmptyFilters();
    filters.expanse.add('Within');

    const pill = getFirstPill(filters);
    const children = toChildArray(pill.props.children);

    expect(children[0]).toBe('Within Class');
    expect(pill.props.title).toBeUndefined();
    expect(pill.props['aria-label']).toBe('Remove Within Class filter');
  });
});
