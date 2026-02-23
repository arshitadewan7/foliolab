<script>
  import { supabase } from '../lib/supabase.js'

  let view = 'main'        // 'main' | 'email'
  let emailMode = 'signin' // 'signin' | 'signup'
  let email = ''
  let password = ''
  let error = ''
  let message = ''
  let loading = false

  async function loginWithGoogle() {
    loading = true
    error = ''
    const { error: err } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin }
    })
    if (err) { error = err.message; loading = false }
    // On success the browser redirects — no further action needed here
  }

  async function submitEmail() {
    error = ''
    message = ''
    if (!email.trim()) { error = 'Enter your email address.'; return }
    if (!password) { error = 'Enter your password.'; return }
    loading = true

    if (emailMode === 'signin') {
      const { error: err } = await supabase.auth.signInWithPassword({ email, password })
      if (err) { error = err.message; loading = false }
      // On success, App.svelte's onAuthStateChange handler takes over
    } else {
      const { error: err } = await supabase.auth.signUp({ email, password })
      if (err) {
        error = err.message
        loading = false
      } else {
        loading = false
        message = 'Check your email for a confirmation link.'
        password = ''
      }
    }
  }
</script>

<div class="login-page">
  <!-- BG grid -->
  <div class="bg-grid"></div>
  <!-- Glow orbs -->
  <div class="orb orb1"></div>
  <div class="orb orb2"></div>

  <div class="login-box fade-up">
    <!-- Brand -->
    <div class="brand">
      <div class="brand-mark">FL</div>
      <div>
        <div class="brand-name">FolioLab</div>
        <div class="brand-domain">.tech</div>
      </div>
    </div>

    <h1 class="headline">Your <span class="grad">collaborative</span><br/>SWE grind workspace</h1>
    <p class="sub">Track problems, plan your sprint, hunt offers — together.</p>

    {#if view === 'main'}
      <!-- Google auth -->
      <button class="btn-google" on:click={loginWithGoogle} disabled={loading}>
        {#if loading}
          <div class="spinner"></div>
          <span>Redirecting…</span>
        {:else}
          <svg class="google-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          <span>Continue with Google</span>
        {/if}
      </button>

      <div class="divider"><span>or</span></div>

      <!-- Email option -->
      <button class="btn-email" on:click={() => { view = 'email'; error = '' }} disabled={loading}>
        <svg class="email-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="2" y="4" width="20" height="16" rx="2"/>
          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
        </svg>
        <span>Continue with email</span>
      </button>

    {:else}
      <!-- Back -->
      <button class="btn-back" on:click={() => { view = 'main'; error = ''; message = '' }}>
        <span class="back-arrow">←</span> Back
      </button>

      <!-- Mode toggle -->
      <div class="mode-toggle">
        <button class:active={emailMode === 'signin'} on:click={() => { emailMode = 'signin'; error = ''; message = '' }}>Sign in</button>
        <button class:active={emailMode === 'signup'} on:click={() => { emailMode = 'signup'; error = ''; message = '' }}>Create account</button>
      </div>

      <form class="email-form" on:submit|preventDefault={submitEmail}>
        <div class="field">
          <label for="email">Email</label>
          <input
            id="email"
            type="email"
            placeholder="you@example.com"
            bind:value={email}
            autocomplete="email"
            disabled={loading}
          />
        </div>
        <div class="field">
          <label for="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="••••••••"
            bind:value={password}
            autocomplete={emailMode === 'signin' ? 'current-password' : 'new-password'}
            disabled={loading}
          />
        </div>

        {#if error}
          <div class="error-msg">{error}</div>
        {/if}
        {#if message}
          <div class="success-msg">{message}</div>
        {/if}

        <button type="submit" class="btn-submit" disabled={loading}>
          {#if loading}
            <div class="spinner spinner-light"></div>
            <span>{emailMode === 'signin' ? 'Signing in…' : 'Creating account…'}</span>
          {:else}
            {emailMode === 'signin' ? 'Sign in' : 'Create account'}
          {/if}
        </button>
      </form>
    {/if}

    <div class="login-footer">
      <div class="gh-note">
        <span class="gh-icon">⌥</span>
        Powered by Supabase Auth
      </div>
    </div>
  </div>
</div>

<style>
  .login-page {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--bg);
    position: relative;
    overflow: hidden;
  }

  .bg-grid {
    position: fixed; inset: 0;
    background-image:
      linear-gradient(var(--border) 1px, transparent 1px),
      linear-gradient(90deg, var(--border) 1px, transparent 1px);
    background-size: 40px 40px;
    opacity: .3;
  }

  .orb {
    position: absolute; border-radius: 50%;
    filter: blur(80px); pointer-events: none;
  }
  .orb1 {
    width: 400px; height: 400px;
    background: radial-gradient(circle, rgba(167,139,250,.15), transparent 70%);
    top: -100px; left: -100px;
  }
  .orb2 {
    width: 350px; height: 350px;
    background: radial-gradient(circle, rgba(52,211,153,.12), transparent 70%);
    bottom: -80px; right: -80px;
  }

  .login-box {
    position: relative; z-index: 1;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    padding: 40px;
    width: 440px;
    max-width: 95vw;
    box-shadow: var(--shadow-lg);
  }

  .brand {
    display: flex; align-items: center; gap: 12px;
    margin-bottom: 32px;
  }
  .brand-mark {
    width: 42px; height: 42px;
    background: linear-gradient(135deg, var(--accent), var(--accent2));
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-family: 'Space Mono', monospace;
    font-size: 14px; font-weight: 700; color: #fff;
  }
  .brand-name {
    font-family: 'Syne', sans-serif;
    font-size: 20px; font-weight: 800;
    letter-spacing: -.5px; color: var(--text);
  }
  .brand-domain {
    font-family: 'Space Mono', monospace;
    font-size: 11px; color: var(--text3); letter-spacing: 1px;
  }

  .headline {
    font-size: 26px; font-weight: 800;
    line-height: 1.2; letter-spacing: -.5px;
    color: var(--text); margin-bottom: 10px;
  }
  .grad {
    background: linear-gradient(135deg, var(--accent), var(--accent2));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .sub { font-size: 14px; color: var(--text2); margin-bottom: 28px; }

  .divider {
    display: flex; align-items: center; gap: 12px;
    margin: 14px 0;
  }
  .divider::before, .divider::after {
    content: ''; flex: 1;
    height: 1px; background: var(--border);
  }
  .divider span {
    font-size: 12px; color: var(--text3);
    font-family: 'Space Mono', monospace;
  }

  .btn-google {
    display: flex; align-items: center; justify-content: center; gap: 12px;
    width: 100%; padding: 13px 20px;
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    color: var(--text);
    font-size: 14px; font-weight: 600;
    cursor: pointer; transition: all .15s;
  }
  .btn-google:hover:not(:disabled) {
    border-color: #4285F4;
    background: rgba(66, 133, 244, .08);
    transform: translateY(-1px);
    box-shadow: var(--shadow);
  }
  .btn-google:disabled { opacity: .6; cursor: not-allowed; }
  .google-icon { width: 20px; height: 20px; flex-shrink: 0; }

  .btn-email {
    display: flex; align-items: center; justify-content: center; gap: 12px;
    width: 100%; padding: 13px 20px;
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    color: var(--text2);
    font-size: 14px; font-weight: 500;
    cursor: pointer; transition: all .15s;
  }
  .btn-email:hover:not(:disabled) {
    border-color: var(--accent);
    background: var(--accent-dim);
    color: var(--text);
    transform: translateY(-1px);
    box-shadow: var(--shadow);
  }
  .btn-email:disabled { opacity: .6; cursor: not-allowed; }
  .email-icon { width: 18px; height: 18px; flex-shrink: 0; }

  .btn-back {
    display: flex; align-items: center; gap: 6px;
    background: none; border: none; padding: 0;
    color: var(--text3); font-size: 13px;
    cursor: pointer; transition: color .15s;
    margin-bottom: 22px;
  }
  .btn-back:hover { color: var(--accent); }
  .back-arrow { font-size: 16px; line-height: 1; }

  .mode-toggle {
    display: flex;
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 3px;
    margin-bottom: 20px;
    gap: 3px;
  }
  .mode-toggle button {
    flex: 1; padding: 8px;
    background: none; border: none;
    border-radius: calc(var(--radius) - 3px);
    color: var(--text2); font-size: 13px; font-weight: 500;
    cursor: pointer; transition: all .15s;
  }
  .mode-toggle button.active {
    background: var(--surface3, var(--surface));
    color: var(--text);
    font-weight: 600;
    box-shadow: 0 1px 4px rgba(0,0,0,.3);
  }

  .email-form { display: flex; flex-direction: column; gap: 14px; margin-bottom: 4px; }

  .field { display: flex; flex-direction: column; gap: 6px; }
  .field label {
    font-size: 12px; font-weight: 600;
    color: var(--text2);
    font-family: 'Space Mono', monospace;
    letter-spacing: .5px;
  }
  .field input {
    padding: 11px 14px;
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    color: var(--text);
    font-size: 14px;
    font-family: 'Inter', sans-serif;
    transition: border-color .15s, box-shadow .15s;
    outline: none;
  }
  .field input::placeholder { color: var(--text3); }
  .field input:focus {
    border-color: var(--accent);
    box-shadow: 0 0 0 3px var(--accent-dim);
  }
  .field input:disabled { opacity: .6; cursor: not-allowed; }

  .error-msg {
    font-size: 13px; color: var(--accent3);
    background: rgba(251,113,133,.08);
    border: 1px solid rgba(251,113,133,.2);
    border-radius: var(--radius-sm);
    padding: 9px 12px;
  }
  .success-msg {
    font-size: 13px; color: var(--accent2);
    background: rgba(52,211,153,.08);
    border: 1px solid rgba(52,211,153,.2);
    border-radius: var(--radius-sm);
    padding: 9px 12px;
  }

  .btn-submit {
    display: flex; align-items: center; justify-content: center; gap: 8px;
    width: 100%; padding: 13px 20px;
    background: linear-gradient(135deg, var(--accent), var(--accent2));
    border: none; border-radius: var(--radius);
    color: #fff;
    font-size: 14px; font-weight: 700;
    cursor: pointer; transition: all .15s;
    margin-top: 4px;
  }
  .btn-submit:hover:not(:disabled) {
    opacity: .9;
    transform: translateY(-1px);
    box-shadow: 0 4px 20px rgba(167,139,250,.35);
  }
  .btn-submit:disabled { opacity: .6; cursor: not-allowed; }

  .spinner {
    width: 16px; height: 16px;
    border: 2px solid var(--border);
    border-top-color: var(--accent);
    border-radius: 50%;
    animation: spin .6s linear infinite;
    flex-shrink: 0;
  }
  .spinner-light {
    border-color: rgba(255,255,255,.3);
    border-top-color: #fff;
  }
  @keyframes spin { to { transform: rotate(360deg) } }

  .login-footer { border-top: 1px solid var(--border); padding-top: 18px; margin-top: 24px; }
  .gh-note {
    display: flex; align-items: center; gap: 8px;
    font-size: 12px; color: var(--text3);
  }
  .gh-icon { font-size: 14px; }
</style>
