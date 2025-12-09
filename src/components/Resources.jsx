import React from 'react';
import { RESOURCES } from '../config';

export const Resources = () => {
    return (
        <div className="max-w-4xl mx-auto">
            {/* Header Section */}
            <section className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-display font-bold text-kholin-blue dark:text-accent-light mb-6">
                    Mental Health Resources
                </h1>
                <p className="text-lg md:text-xl text-kholin-blue dark:text-stone leading-relaxed max-w-3xl mx-auto">
                    We believe that mental health support should be accessible to everyone. Below are some valuable resources
                    that can help you on your journey toward better mental health and well-being.
                </p>
            </section>

            {/* Featured Resource - Next Step Coin */}
            {RESOURCES.length > 0 && (
                <section className="mb-12">
                    <a
                        href={RESOURCES[0].url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-[var(--bg-secondary)] rounded-lg shadow-sm border-2 border-stone-border dark:border-stormlight-gold p-8 md:p-12 flex flex-col md:flex-row items-center gap-8 transition-all hover:shadow-lg hover:-translate-y-1 hover:border-stormlight-gold dark:hover:border-stormlight-gold-light no-underline group"
                    >
                        {/* Logo */}
                        <div className="w-full md:w-1/3 flex-shrink-0">
                            <div className="w-full h-64 flex items-center justify-center bg-white dark:bg-stone/95 rounded-lg p-2">
                                <img
                                    src={RESOURCES[0].logo}
                                    alt={`${RESOURCES[0].title} logo`}
                                    className="max-w-full max-h-full object-cover"
                                    loading="lazy"
                                />
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 text-center md:text-left">
                            <h3 className="text-3xl md:text-4xl font-display font-bold text-kholin-blue dark:text-accent-light mb-4 group-hover:text-stormlight-gold dark:group-hover:text-stormlight-gold-light transition-colors">
                                {RESOURCES[0].title}
                            </h3>
                            <p className="text-lg text-kholin-blue dark:text-stone leading-relaxed mb-6">
                                {RESOURCES[0].description}
                            </p>
                            <span className="inline-flex items-center gap-2 text-stormlight-gold font-display font-bold text-lg">
                                {RESOURCES[0].linkText || 'Visit Website'}
                                <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </span>
                        </div>
                    </a>
                </section>
            )}

            {/* Other Resources Grid */}
            {RESOURCES.length > 1 && (
                <section className="grid md:grid-cols-2 gap-8">
                    {RESOURCES.slice(1).map((resource, index) => (
                        <a
                            key={index + 1}
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-[var(--bg-secondary)] rounded-lg shadow-sm border-2 border-stone-border dark:border-stormlight-gold p-8 flex flex-col items-center text-center transition-all hover:shadow-lg hover:-translate-y-1 hover:border-stormlight-gold dark:hover:border-stormlight-gold-light no-underline group"
                        >
                            {/* Logo */}
                            <div className="w-full h-32 mb-6 flex items-center justify-center bg-white dark:bg-stone/95 rounded-lg p-4">
                                <img
                                    src={resource.logo}
                                    alt={`${resource.title} logo`}
                                    className="max-w-full max-h-full object-contain"
                                    loading="lazy"
                                />
                            </div>

                            {/* Title */}
                            <h3 className="text-2xl font-display font-bold text-kholin-blue dark:text-accent-light mb-4 group-hover:text-stormlight-gold dark:group-hover:text-stormlight-gold-light transition-colors">
                                {resource.title}
                            </h3>

                            {/* Description */}
                            <p className="text-base text-kholin-blue dark:text-stone leading-relaxed">
                                {resource.description}
                            </p>

                            {/* Visit Link Indicator */}
                            <span className="mt-6 inline-flex items-center gap-2 text-stormlight-gold font-display font-bold">
                                {resource.linkText || 'Visit Website'}
                                <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </span>
                        </a>
                    ))}
                </section>
            )}

            {/* Additional Info Section */}
            <section className="mt-16 bg-[var(--bg-secondary)] rounded-lg shadow-sm border-2 border-stone-border dark:border-stormlight-gold p-8 text-center">
                <h2 className="text-2xl font-display font-bold text-kholin-blue dark:text-accent-light mb-4">
                    Need Immediate Help?
                </h2>
                <p className="text-base text-kholin-blue dark:text-stone leading-relaxed mb-4">
                    If you're experiencing a mental health crisis, please reach out to these crisis resources:
                </p>
                <div className="space-y-2 text-kholin-blue dark:text-stone">
                    <p>
                        <strong className="font-display">National Suicide Prevention Lifeline:</strong>{' '}
                        <a href="tel:988" className="text-stormlight-gold hover:text-stormlight-gold-light font-bold">
                            988
                        </a>
                    </p>
                    <p>
                        <strong className="font-display">Crisis Text Line:</strong>{' '}
                        <span className="text-stormlight-gold font-bold">Text HOME to 741741</span>
                    </p>
                </div>
            </section>
        </div>
    );
};

export default Resources;
