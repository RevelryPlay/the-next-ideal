import React from 'react';
import { SUPPORT_LINKS } from '../config';

// Ko-fi icon (coffee cup)
const KofiIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden="true">
    <path d="M23.881 8.948c-.773-4.085-4.859-4.593-4.859-4.593H.723c-.604 0-.679.798-.679.798s-.082 7.324-.022 11.822c.164 2.424 2.586 2.672 2.586 2.672s8.267-.023 11.966-.049c2.438-.426 2.683-2.566 2.658-3.734 4.352.24 7.422-2.831 6.649-6.916zm-11.062 3.511c-1.246 1.453-4.011 3.976-4.011 3.976s-.121.119-.31.023c-.076-.057-.108-.09-.108-.09-.443-.441-3.368-3.049-4.034-3.954-.709-.965-1.041-2.7-.091-3.71.951-1.01 3.005-1.086 4.363.407 0 0 1.565-1.782 3.468-.963 1.904.82 1.832 3.011.723 4.311zm6.173.478c-.928.116-1.682.028-1.682.028V7.284h1.77s1.971.551 1.971 2.638c0 1.913-.985 2.667-2.059 3.015z"/>
  </svg>
);

// Patreon icon
const PatreonIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden="true">
    <path d="M15.386.524c-4.764 0-8.64 3.876-8.64 8.64 0 4.75 3.876 8.613 8.64 8.613 4.75 0 8.614-3.864 8.614-8.613C24 4.4 20.136.524 15.386.524zM.003 23.537h4.22V.524H.003z"/>
  </svg>
);

export default function SupportLinks() {
  const links = [];

  if (SUPPORT_LINKS.kofi) {
    links.push({
      name: 'Ko-fi',
      url: SUPPORT_LINKS.kofi,
      icon: KofiIcon,
      colorClass: 'bg-kofi hover:bg-kofi/90',
      label: 'Support on Ko-fi',
    });
  }

  if (SUPPORT_LINKS.patreon) {
    links.push({
      name: 'Patreon',
      url: SUPPORT_LINKS.patreon,
      icon: PatreonIcon,
      colorClass: 'bg-patreon hover:bg-patreon/90',
      label: 'Support on Patreon',
    });
  }

  if (links.length === 0) return null;

  return (
    <div className="bg-[var(--bg-secondary)] rounded-lg shadow-sm border-2 border-stone-border dark:border-stormlight-gold mb-24 p-8 text-center">
      <h3 className="mb-6 text-2xl text-kholin-blue dark:text-stone">Support the Show</h3>
      <div className="flex justify-center gap-6 flex-wrap">
        {links.map(({ name, url, icon: Icon, colorClass, label }) => (
          <a
            key={name}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-2 px-6 py-3 text-white no-underline rounded-full font-display font-bold transition-all hover:-translate-y-0.5 hover:shadow-lg ${colorClass}`}
            aria-label={label}
          >
            <Icon />
            <span>{name}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
