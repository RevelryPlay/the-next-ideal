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
                        Real lessons from a fantasy world: Steven Pond - @TheCosmerenaut and Ben Jeppsen - the Stormlight
                        Psychologist approach the Stormlight Archive as a therapy text, starting with The Way of Kings by
                        Brandon Sanderson. Bringing in modern psychology theories and therapy practices, Steve and Ben
                        discuss the challenges and successes of your favorite characters, finding concrete steps to apply
                        in your life, to help you find your Next Ideal.
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
                        referrerpolicy="strict-origin-when-cross-origin"
                    />
                </div>
            </div>
        </section>
    );
}
