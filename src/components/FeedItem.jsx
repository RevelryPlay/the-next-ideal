import React from 'react';

export default function FeedItem({ title, link, date, content, image }) {
  const formattedDate = date ? new Date(date).toLocaleDateString() : '';

  return (
    <article className="feed-item">
      {image && (
        <img src={image} alt="" className="feed-item-image" />
      )}
      <div className="feed-item-content">
        <h3 className="feed-item-title">
          <a href={link} target="_blank" rel="noopener noreferrer">
            {title}
          </a>
        </h3>
        {formattedDate && <time className="feed-item-date">{formattedDate}</time>}
        {content && <p className="feed-item-excerpt">{content}</p>}
      </div>
    </article>
  );
}
