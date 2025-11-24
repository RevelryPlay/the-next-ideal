import React from 'react';
import { Link } from 'react-router-dom';

export function NotFound() {
    return (
        <div className="text-center py-16">
            <h1 className="text-6xl font-bold mb-4">404</h1>
            <h2 className="text-2xl mb-6">Page Not Found</h2>
            <p className="text-lg mb-8 text-gray-600 dark:text-gray-400">
                The page you're looking for doesn't exist or has been moved.
            </p>
            <Link
                to="/"
                className="inline-block px-6 py-3 bg-midnight text-white rounded-lg hover:opacity-90 transition-opacity"
            >
                Go Home
            </Link>
        </div>
    );
}
