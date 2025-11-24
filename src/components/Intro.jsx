import { TRAILER } from '../config';

export const Intro = () => {
    return (
        <section className="mb-24">
            <div className="grid md:grid-cols-2 gap-12 items-center">
                {/* Intro Text */}
                <div>
                    <h2 className="text-3xl font-display font-bold text-kholin-blue dark:text-accent-light mb-6">
                        Welcome to The Next Ideal
                    </h2>
                    <p className="text-lg text-kholin-blue dark:text-stone leading-relaxed mb-6">
                        Add your intro text here. Describe what your podcast is about,
                        what listeners can expect, and why they should tune in.
                    </p>
                    <p className="text-lg text-kholin-blue dark:text-stone leading-relaxed">
                        Add more details about your show, the topics you cover,
                        or what makes your podcast unique.
                    </p>
                </div>

                {/* Trailer Video */}
                <div className="aspect-video bg-midnight/20 rounded-lg overflow-hidden border-2 border-stormlight-gold">
                    <iframe
                        className="w-full h-full"
                        src={TRAILER.url}
                        title={TRAILER.title}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />
                </div>
            </div>
        </section>
    );
}
