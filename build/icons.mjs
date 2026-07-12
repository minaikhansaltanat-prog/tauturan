const PATHS = {
  family: '<circle cx="8" cy="8" r="3"/><circle cx="17" cy="9" r="2.5"/><path d="M2 21v-1a5 5 0 0 1 5-5h2a5 5 0 0 1 5 5v1"/><path d="M15 15.2A4 4 0 0 1 22 18v1"/>',
  briefcase: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M3 13h18"/>',
  users: '<path d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  gift: '<rect x="3" y="8" width="18" height="13" rx="1"/><path d="M12 8v13"/><path d="M19 8V6a3 3 0 0 0-6 0 3 3 0 0 0-6 0v2"/>',
  shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
  doc: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/>',
  receipt: '<path d="M6 2h12v20l-2.5-1.6L13 22l-2.5-1.6L8 22l-2-1.6z"/><path d="M9 8h6M9 12h6"/>',
  building: '<rect x="4" y="3" width="16" height="18"/><path d="M9 21v-4h6v4"/><path d="M9 7h1M14 7h1M9 11h1M14 11h1"/>',
  pool: '<path d="M3 17c1.5 1 3 1 4.5 0s3-1 4.5 0 3 1 4.5 0 3-1 4.5 0"/><path d="M6 12V6a2 2 0 0 1 2-2h2"/><circle cx="16" cy="6" r="2"/>',
  sauna: '<path d="M4 21h16"/><path d="M6 21V9l6-5 6 5v12"/><path d="M9 21v-6h6v6"/>',
  sport: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3c2.8 2.4 4.5 5.6 4.5 9s-1.7 6.6-4.5 9c-2.8-2.4-4.5-5.6-4.5-9S9.2 5.4 12 3z"/>',
  hall: '<rect x="3" y="10" width="18" height="11"/><path d="M12 3l9 7H3z"/>',
  sound: '<path d="M11 5 6 9H2v6h4l5 4z"/><path d="M18.5 8.5a5 5 0 0 1 0 7"/><path d="M21 6a8 8 0 0 1 0 12"/>',
  transfer: '<rect x="1" y="7" width="15" height="9" rx="2"/><path d="M16 10h3l3 3v3h-6"/><circle cx="6" cy="19" r="2"/><circle cx="17" cy="19" r="2"/>',
  bed: '<path d="M2 20v-7a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v7"/><path d="M2 13V7a2 2 0 0 1 2-2h5v5"/><path d="M2 20h20"/>',
  phone: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.7a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.4-1.4a2 2 0 0 1 2.1-.5c.9.3 1.8.5 2.7.6a2 2 0 0 1 1.8 2.3z"/>',
  mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 6-10 7L2 6"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/>',
  pin: '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/>',
  arrowLeft: '<path d="M15 18l-6-6 6-6"/>',
  arrowRight: '<path d="M9 6l6 6-6 6"/>',
  play: '<path d="M8 5v14l11-7z"/>',
  pause: '<path d="M6 5h4v14H6zM14 5h4v14h-4z"/>',
  whatsapp: '<path d="M20.5 3.6A11 11 0 0 0 3.2 17.4L2 22l4.7-1.2A11 11 0 1 0 20.5 3.6z" fill="none"/><path d="M8.6 8.1c.2-.4.4-.4.6-.4h.8c.2 0 .4.1.5.3l.8 1.9c.1.2 0 .5-.1.6l-.6.7a6.6 6.6 0 0 0 3.1 3.1l.7-.6c.2-.2.4-.2.6-.1l1.9.8c.2.1.3.3.3.5v.8c0 .3-.2.5-.4.6-.6.3-1.6.5-2.9.1a10.2 10.2 0 0 1-5.7-5.7c-.4-1.3-.2-2.3.1-2.9z" fill="currentColor" stroke="none"/>',
  instagram: '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.3" cy="6.7" r="1.1" fill="currentColor" stroke="none"/>',
  map: '<path d="M9 3 3 5v16l6-2 6 2 6-2V3l-6 2-6-2z"/><path d="M9 3v16M15 5v16"/>',
  check: '<path d="M4 12l5 5L20 6"/>',
  food: '<path d="M6 2v7a2 2 0 0 0 4 0V2M8 9v13"/><path d="M16 2c-1.6 0-3 1.6-3 5s1.4 5 3 5v8"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
};

export function icon(name, opts = {}) {
  const size = opts.size || 24;
  const cls = opts.cls ? ` class="${opts.cls}"` : '';
  const body = PATHS[name] || '';
  return `<svg${cls} width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;
}
