import React from 'react';

export default function Episode({ title, link, date, content, audioUrl, duration, episode, season, image }) {
  const dateObj = date ? new Date(date) : null;
  const formattedDate = dateObj ? dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }) : '';
  const isoDate = dateObj ? dateObj.toISOString() : '';

  // Format duration (could be "HH:MM:SS" or seconds)
  const formatDuration = (dur) => {
    if (!dur) return null;
    // If it's already formatted like "1:23:45" or "45:30"
    if (typeof dur === 'string' && dur.includes(':')) return dur;
    // If it's seconds, convert
    const seconds = parseInt(dur, 10);
    if (isNaN(seconds)) return dur;
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const episodeLabel = episode ? `Episode ${episode}` : null;
  const seasonLabel = season ? `Season ${season}` : null;
  const formattedDuration = formatDuration(duration);

  return (
    <article className="flex gap-6 pb-8 border-b border-stone-border dark:border-stone/20 last:pb-0 last:border-b-0 max-sm:flex-col">
      {image && (
        <img
          src={image}
          alt=""
          className="w-[120px] h-[120px] object-cover rounded-lg shrink-0 border-2 border-stone-border dark:border-stone/30 max-sm:w-full max-sm:h-auto max-sm:aspect-square max-sm:max-w-[200px] max-sm:mx-auto"
        />
      )}
      <div className="flex-1 flex flex-col gap-2">
        <div className="flex flex-wrap gap-3 text-sm text-kholin-blue/60 dark:text-stone/60">
          {seasonLabel && <span className="text-stormlight-gold font-semibold">{seasonLabel}</span>}
          {episodeLabel && <span className="text-stormlight-gold font-semibold">{episodeLabel}</span>}
          {formattedDate && <time dateTime={isoDate}>{formattedDate}</time>}
          {formattedDuration && (
            <span className="inline-flex items-center">
              <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {formattedDuration}
            </span>
          )}
        </div>
        <h3 className="text-lg m-0 leading-tight">
          <a href={link} target="_blank" rel="noopener noreferrer" className="text-kholin-blue dark:text-accent-light no-underline hover:text-stormlight-gold hover:underline cursor-pointer">
            {title}
          </a>
        </h3>
        {content && <p className="text-[0.95rem] text-kholin-blue/70 dark:text-stone/70 m-0 line-clamp-2">{content}</p>}
        {audioUrl && (
          <audio className="w-full h-10 mt-2" controls preload="none">
            <source src={audioUrl} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        )}
      </div>
    </article>
  );
}
