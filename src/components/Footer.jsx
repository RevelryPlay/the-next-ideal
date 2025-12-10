import {SITE} from "../config.js";
import SocialLinks from "./SocialLinks.jsx";
import React from "react";

export const Footer = () => {
    return (
        <footer className=" bg-midnight text-stone-faded py-10 mt-auto border-t-3 border-stormlight-gold">
            <div className="mx-auto max-w-6xl px-8 w-full max-sm:px-4 flex flex-wrap content-center items-center-safe justify-between max-sm:justify-center mb-6 gap-6 md:gap-8">
                <div className="flex align-items-left flex-col text-left max-sm:text-center max-sm:items-center min-w-[280px] flex-1">
                    <img src="/TNI-logo_full-color-2.svg" alt={SITE.name} className="w-[150px] h-auto mb-6 max-sm:w-[120px]" />
                    <h3>{SITE.name}</h3>
                    <p className="text-sm">Not affiliated with Brandon Sanderson or Dragonsteel Entertainment</p>
                </div>
                <div className="flex flex-col items-center-safe text-center">
                    <nav aria-label="Footer navigation" className="grid grid-cols-3 gap-2 gap-x-6 justify-items-center items-center-safe text-center">
                        <a href="/" className=" mb-2 text-white hover:text-accent-light">Home</a>
                        <a href="/episodes" className=" mb-2 text-white hover:text-accent-light">Episodes</a>
                        <a href="/resources" className=" mb-2 text-white hover:text-accent-light">Resources</a>
                    </nav>

                    <SocialLinks />
                </div>
            </div>
            <p className="text-center text-stone border-t border-t-primary max-w-6xl mx-auto px-8 pt-6 text-sm">&copy; {new Date().getFullYear()} {SITE.name}. All rights reserved.</p>
        </footer>
    )
}