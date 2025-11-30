const hosts = [
    {
        name: 'Steve',
        image: 'steve-headshot',
        bio: 'Add your bio here. Share your background, why you started this podcast, and what the Stormlight Archive means to you.',
    },
    {
        name: 'Ben Jeppsen',
        image: 'Ben_Jeppsen_Horizontal',
        bio: 'Add your bio here. Share your background, why you started this podcast, and what the Stormlight Archive means to you.',
    },
];

// Responsive image component with modern formats
const ResponsiveHostImage = ({ imageName, alt }) => {
    const basePath = `/hosts/optimized/${imageName}`;

    return (
        <picture>
            {/* AVIF format - best compression */}
            <source
                type="image/avif"
                srcSet={`${basePath}-320w.avif 320w, ${basePath}-640w.avif 640w`}
                sizes="(max-width: 768px) 320px, 640px"
            />
            {/* WebP format - good compression and wide support */}
            <source
                type="image/webp"
                srcSet={`${basePath}-320w.webp 320w, ${basePath}-640w.webp 640w`}
                sizes="(max-width: 768px) 320px, 640px"
            />
            {/* JPEG fallback - universal support */}
            <img
                src={`${basePath}-640w.jpg`}
                srcSet={`${basePath}-320w.jpg 320w, ${basePath}-640w.jpg 640w`}
                sizes="(max-width: 768px) 320px, 640px"
                alt={alt}
                className="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
            />
        </picture>
    );
};

export const Hosts = () => {
    return (
        <section className="mb-24">
            <h2 className="text-3xl font-display font-bold text-center text-kholin-blue dark:text-accent-light mb-10">
                Meet the Hosts
            </h2>
            <div className="grid md:grid-cols-2 gap-10">
                {hosts.map((host, index) => (
                    <div
                        key={index}
                        className="bg-[var(--bg-secondary)] rounded-lg shadow-sm border-2 border-stone-border dark:border-stormlight-gold flex flex-col items-center text-center p-8"
                    >
                        <div className="w-40 h-40 rounded-full overflow-hidden mb-6 border-3 border-stormlight-gold bg-midnight/20 dark:bg-midnight/40">
                            <ResponsiveHostImage
                                imageName={host.image}
                                alt={host.name}
                            />
                        </div>
                        <h3 className="text-2xl font-display font-bold text-kholin-blue dark:text-accent-light mb-3">
                            {host.name}
                        </h3>
                        <p className="text-lg text-kholin-blue dark:text-stone leading-relaxed">
                            {host.bio}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
}