import type { IconDef } from '../../lib/icon-paths';

interface Props {
  readonly icon: IconDef;
  readonly size?: number;
  readonly class?: string;
  readonly strokeWidth?: number;
}

export function Icon({ icon, size = 14, class: className, strokeWidth = 2 }: Props) {
  return (
    <svg
      class={className}
      width={size}
      height={size}
      viewBox={icon.viewBox ?? '0 0 24 24'}
      fill="none"
      stroke="currentColor"
      stroke-width={strokeWidth}
      stroke-linecap="round"
      {...(icon.strokeLinejoin ? { 'stroke-linejoin': 'round' } : {})}
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: icon.body }}
    />
  );
}
