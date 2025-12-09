import { Link, useLocation } from 'react-router-dom';
import { SITE } from '../config';
import SocialLinks from './SocialLinks';

export const Header = () => {
    const location = useLocation();

    return (
        <header
            className="bg-gradient-to-r from-midnight to-kholin-blue text-stone py-8 px-8 border-b-3 border-stormlight-gold">

            {/* Desktop: 3-column layout | Mobile: stacked */}
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-6">

                {/* Navigation - Left on desktop, second on mobile */}
                <nav aria-label="Main navigation" className="flex justify-center md:justify-start gap-4 order-2 md:order-1 md:flex-1">
                    <Link
                        to="/"
                        viewTransition
                        className={`font-display font-bold text-stone/70 no-underline px-4 py-2 rounded transition-colors hover:text-stormlight-gold hover:bg-white/10 ${
                            location.pathname === '/' ? 'text-stormlight-gold bg-white/10' : ''
                        }`}
                    >
                        Home
                    </Link>
                    <Link
                        to="/episodes"
                        viewTransition
                        className={`font-display font-bold text-stone/70 no-underline px-4 py-2 rounded transition-colors hover:text-stormlight-gold hover:bg-white/10 ${
                            location.pathname === '/episodes' ? 'text-stormlight-gold bg-white/10' : ''
                        }`}
                    >
                        Episodes
                    </Link>
                    <Link
                        to="/resources"
                        viewTransition
                        className={`font-display font-bold text-stone/70 no-underline px-4 py-2 rounded transition-colors hover:text-stormlight-gold hover:bg-white/10 ${
                            location.pathname === '/resources' ? 'text-stormlight-gold bg-white/10' : ''
                        }`}
                    >
                        Resources
                    </Link>
                </nav>

                {/* Logo - Center on desktop, first on mobile */}
                <Link to="/" viewTransition className="order-1 md:order-2 flex justify-center">
                    <img
                        src="/TNI-logo_full-color-2.svg"
                        alt={SITE.name}
                        className="w-[200px] md:w-[240px] h-auto"
                    />
                </Link>

                {/* Social Links - Right on desktop, third on mobile */}
                <div className="order-3 md:flex-1 flex justify-center md:justify-end">
                    <SocialLinks/>
                </div>
            </div>
        </header>
    );
}