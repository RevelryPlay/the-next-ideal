import {useEffect} from "react";
import {defaultPreferences} from "../config.js";

export const ThemeToggle = () => {
    const setThemeAttribute = (theme) => {
        document.documentElement.classList.remove('dark', 'light');
        document.documentElement.classList.add(theme);
        document.documentElement.setAttribute('data-theme', theme);
    }

    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

        const handleSystemThemeChange = (e) => {
            const defaultTheme = defaultPreferences.theme;
            const preferredTheme = localStorage.getItem("theme");

            // If the user does not have a preferred theme, apply the system or default theme
            if (!preferredTheme || preferredTheme === 'default') {
                if (defaultTheme === 'system') {
                    setThemeAttribute( e ? (e.matches ? 'dark' : 'light') : (mediaQuery.matches ? 'dark' : 'light'));
                } else {
                    setThemeAttribute(defaultTheme);
                }
            } else {
                // If the user has a preferred theme, apply it
                setThemeAttribute(preferredTheme);
            }
        };
        mediaQuery.addEventListener('change', handleSystemThemeChange);

        // Because useEffect runs after the first render, we need to set the initial theme here
        handleSystemThemeChange(undefined);

        // Cleanup listener on unmounting
        return () => {
            mediaQuery.removeEventListener('change', handleSystemThemeChange);
        };
    }, []);

    const onToggleTheme = () => {
        const body = document.documentElement;
        const currentTheme = body.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        localStorage.setItem('theme', newTheme);

        setThemeAttribute(newTheme);
    };

    return (
        <button
            type="button"
            className="bg-midnight text-white w-fit p-4 cursor-pointer rounded-full flex items-center justify-center
            fixed top-4 right-4 z-50 hover:bg-kholin-blue transition-colors transition-transform duration-200
            dark:hover:bg-stormlight-gold/20 hover:translate-y-[-2px] border-none"
            aria-label="Toggle dark mode"
            onClick={onToggleTheme}
            id="theme-toggle">
            <svg className="block dark:hidden" width="20" height="20" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                 aria-hidden="true">
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
            </svg>
            <svg className="hidden dark:block" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                 strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                 aria-hidden="true">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
        </button>
    )
}
