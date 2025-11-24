import React, { useState } from 'react';
import { SITE } from '../config';

export default function Admin() {
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

  async function handleAuth(e) {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      const response = await fetch('/api/download-emails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });

      if (response.ok) {
        // Authentication successful - trigger download
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'emails.csv';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
        setAuthenticated(true);
        setStatus({ type: 'success', message: 'Download started!' });
      } else {
        setStatus({ type: 'error', message: 'Access denied' });
      }
    } catch (err) {
      setStatus({ type: 'error', message: 'Something went wrong. Please try again.' });
    } finally {
      setLoading(false);
    }
  }

  async function handleDownloadAgain() {
    setLoading(true);
    try {
      const response = await fetch('/api/download-emails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'emails.csv';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
      }
    } catch (err) {
      setStatus({ type: 'error', message: 'Download failed' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-stone">
      {/* Header */}
      <header className="bg-gradient-to-r from-midnight to-kholin-blue text-stone py-16 px-8 text-center border-b-3 border-stormlight-gold">
        <h1 className="text-4xl">{SITE.name}</h1>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-[800px] mx-auto p-8 w-full">
        <section className="card max-w-[400px] mx-auto">
          {!authenticated ? (
            <>
              <h2 className="mb-2 text-kholin-blue">Authentication Required</h2>
              <p className="text-kholin-blue/70 mb-6">Please enter your credentials to continue.</p>

              <form onSubmit={handleAuth} className="flex flex-col gap-3">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  required
                  disabled={loading}
                  className="input"
                />
                <button type="submit" disabled={loading} className="btn btn-primary">
                  {loading ? 'Verifying...' : 'Continue'}
                </button>
              </form>
            </>
          ) : (
            <>
              <h2 className="mb-2 text-kholin-blue">Email List</h2>
              <p className="text-kholin-blue/70 mb-6">Your download should have started automatically.</p>
              <button
                onClick={handleDownloadAgain}
                disabled={loading}
                className="btn btn-primary w-full"
              >
                {loading ? 'Downloading...' : 'Download Again'}
              </button>
            </>
          )}

          {status.message && (
            <p
              className={`mt-4 p-3 rounded text-center ${
                status.type === 'success'
                  ? 'bg-green-100 text-green-800 border border-green-300'
                  : 'bg-red-100 text-red-800 border border-red-300'
              }`}
            >
              {status.message}
            </p>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-midnight text-stone text-center py-6 mt-auto border-t-3 border-stormlight-gold">
        <p>&copy; {new Date().getFullYear()} {SITE.name}</p>
      </footer>
    </div>
  );
}
