/**
 * Shared SVG icon path data — importable by both Astro and Preact.
 *
 * Prefer ICON_* + Icon when an icon is shared with Preact islands or reused
 * across files. Use a dedicated *Icon.astro for Astro-only icons when a
 * named import reads clearer. Reserve inline <svg> for rare one-offs.
 */

export interface IconDef {
  /** Inner SVG markup (path / circle / line / rect elements) */
  body: string;
  /** SVG viewBox — defaults to "0 0 24 24" when omitted */
  viewBox?: string;
  /** Whether stroke-linejoin="round" should be set on the <svg> */
  strokeLinejoin?: boolean;
}

export const ICON_COPY: IconDef = {
  body: '<rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
  strokeLinejoin: true,
};

export const ICON_CHECK: IconDef = {
  body: '<polyline points="20 6 9 17 4 12"/>',
  strokeLinejoin: true,
};

export const ICON_SEARCH: IconDef = {
  body: '<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>',
  strokeLinejoin: true,
};

export const ICON_SHARE: IconDef = {
  body: '<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>',
};

export const ICON_LINK: IconDef = {
  body: '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>',
};

export const ICON_ARROW_RIGHT: IconDef = {
  body: '<line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>',
};

export const ICON_ARROW_LEFT: IconDef = {
  body: '<line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>',
};

export const ICON_CHEVRON_RIGHT: IconDef = {
  body: '<polyline points="9 18 15 12 9 6"/>',
};

export const ICON_CHEVRON_LEFT: IconDef = {
  body: '<polyline points="15 18 9 12 15 6"/>',
};

export const ICON_WRENCH: IconDef = {
  body: '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>',
};

export const ICON_WARNING: IconDef = {
  body: '<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>',
};

export const ICON_STAR: IconDef = {
  body: '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',
};

export const ICON_RELATIONSHIP_GRAPH: IconDef = {
  body: '<circle cx="5" cy="6" r="3"/><circle cx="19" cy="6" r="3"/><circle cx="12" cy="18" r="3"/><line x1="7.5" y1="7.5" x2="10.5" y2="16"/><line x1="16.5" y1="7.5" x2="13.5" y2="16"/>',
};

export const ICON_USER: IconDef = {
  body: '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
};

export const ICON_CALENDAR: IconDef = {
  body: '<rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>',
};

export const ICON_PENCIL: IconDef = {
  body: '<path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>',
};

export const ICON_ALERT_CIRCLE: IconDef = {
  body: '<path d="M12 9v4m0 4h.01M3 12a9 9 0 1 1 18 0 9 9 0 0 1-18 0z"/>',
};

export const ICON_EXTERNAL_LINK: IconDef = {
  body: '<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>',
};

export const ICON_EXTERNAL_ARROW: IconDef = {
  body: '<path d="M7 17L17 7M17 7H7M17 7v10"/>',
};

export const ICON_GRADUATION_CAP: IconDef = {
  body: '<path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 1.1 2.7 3 6 3s6-1.9 6-3v-5"/>',
};

export const ICON_CODE: IconDef = {
  body: '<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/><line x1="14" y1="4" x2="10" y2="20"/>',
};

/** Brackets only — same polylines as `ICON_CODE` without the center slash (e.g. footer OSS badge). */
export const ICON_CODE_BRACKETS: IconDef = {
  body: '<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>',
};

export const ICON_BOOK_LINES: IconDef = {
  body: '<path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/><line x1="8" y1="7" x2="16" y2="7"/><line x1="8" y1="11" x2="14" y2="11"/>',
};

export const ICON_TAG: IconDef = {
  body: '<path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/>',
};

export const ICON_CLOCK: IconDef = {
  body: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
};

export const ICON_GLOBE: IconDef = {
  body: '<circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>',
};

export const ICON_GITHUB: IconDef = {
  body: '<path fill="currentColor" stroke="none" d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>',
};

export const ICON_SPARKLES: IconDef = {
  body: '<path d="M12 3l1.05 3.15L16.2 7.2l-3.15 1.05L12 11.4l-1.05-3.15L7.8 7.2l3.15-1.05L12 3z"/><path d="M18 12l.7 2.1 2.1.7-2.1.7-.7 2.1-.7-2.1-2.1-.7 2.1-.7L18 12z"/><path d="M7 15l.525 1.575L9.1 17.1l-1.575.525L7 19.2l-.525-1.575L4.9 17.1l1.575-.525L7 15z"/>',
};

export const ICON_SPARKLES_OFF: IconDef = {
  body: '<path d="M12 3l1.05 3.15L16.2 7.2l-3.15 1.05L12 11.4l-1.05-3.15L7.8 7.2l3.15-1.05L12 3z" opacity=".45"/><path d="M18 12l.7 2.1 2.1.7-2.1.7-.7 2.1-.7-2.1-2.1-.7 2.1-.7L18 12z" opacity=".45"/><path d="M7 15l.525 1.575L9.1 17.1l-1.575.525L7 19.2l-.525-1.575L4.9 17.1l1.575-.525L7 15z" opacity=".45"/><line x1="3" y1="3" x2="21" y2="21"/>',
};

export const ICON_LINKEDIN: IconDef = {
  body: '<path fill="currentColor" stroke="none" d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>',
};
