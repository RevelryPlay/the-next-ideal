import React, { useState } from 'react';
import { EMAIL_SIGNUP } from '../config';

export default function EmailSignup() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (response.ok) {
        setStatus({ type: 'success', message: EMAIL_SIGNUP.successMessage });
        setEmail('');
      } else {
        setStatus({ type: 'error', message: data.error });
      }
    } catch (err) {
      setStatus({ type: 'error', message: 'Something went wrong. Please try again.' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="bg-gradient-to-r from-midnight to-kholin-blue rounded-lg p-10 mb-24 border-t-3 border-b-3 border-stormlight-gold text-center">
      <h2 className="text-3xl mb-4 text-stone">{EMAIL_SIGNUP.heading}</h2>
      <p className="text-lg text-stone-faded mb-8">{EMAIL_SIGNUP.description}</p>

      <form onSubmit={handleSubmit} className="flex gap-4 max-w-xl mx-auto max-sm:flex-col">
        <label htmlFor="email-signup" className="sr-only">Email address</label>
        <input
          id="email-signup"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={EMAIL_SIGNUP.placeholder}
          required
          disabled={loading}
          aria-describedby={status.message ? 'signup-status' : undefined}
          className="input flex-1"
        />
        <button type="submit" disabled={loading} aria-busy={loading} className="btn btn-primary">
          {loading ? 'Subscribing...' : EMAIL_SIGNUP.buttonText}
        </button>
      </form>

      <div aria-live="polite" aria-atomic="true">
        {status.message && (
          <p
            id="signup-status"
            role={status.type === 'error' ? 'alert' : 'status'}
            className={`mt-4 p-3 rounded max-w-[500px] mx-auto ${
              status.type === 'success'
                ? 'bg-midnight text-green-200 border border-green-600'
                : 'bg-midnight text-red-200 border border-red-600'
            }`}
          >
            {status.message}
          </p>
        )}
      </div>
    </section>
  );
}
