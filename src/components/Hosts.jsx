const hosts = [
    {
        name: 'Host Name',
        image: '/hosts/host1.jpg',
        bio: 'Add your bio here. Share your background, why you started this podcast, and what the Stormlight Archive means to you.',
    },
    {
        name: 'Host Name',
        image: '/hosts/host2.jpg',
        bio: 'Add your bio here. Share your background, why you started this podcast, and what the Stormlight Archive means to you.',
    },
];

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
                            <img
                                src={host.image}
                                alt={host.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.parentElement.innerHTML = `
                                        <div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-midnight to-kholin-blue">
                                            <span class="text-stone text-4xl font-display font-bold">${host.name.charAt(0)}</span>
                                        </div>
                                    `;
                                }}
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