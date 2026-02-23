<script>
  import { createEventDispatcher } from 'svelte'
  import { users } from '../stores/state.js'

  const dispatch = createEventDispatcher()

  function login(userId) {
    dispatch('login', { user: userId })
  }
</script>

<div class="login-page">
  <!-- BG grid -->
  <div class="bg-grid"></div>
  <!-- Glow orbs -->
  <div class="orb orb1"></div>
  <div class="orb orb2"></div>

  <div class="login-box fade-up">
    <div class="brand">
      <div class="brand-mark">FL</div>
      <div>
        <div class="brand-name">FolioLab</div>
        <div class="brand-domain">.tech</div>
      </div>
    </div>

    <h1 class="headline">Your <span class="grad">collaborative</span><br/>SWE grind workspace</h1>
    <p class="sub">Track problems, plan your sprint, hunt offers — together.</p>

    <div class="divider">
      <span>Sign in as</span>
    </div>

    <div class="user-cards">
      {#each Object.values(users) as user}
        <button class="user-card" on:click={() => login(user.id)}>
          <div class="uc-avatar" style="background: {user.avatarColor}18; color: {user.avatarColor}; border-color: {user.avatarColor}30;">
            {user.avatar}
          </div>
          <div class="uc-info">
            <div class="uc-name">{user.name}</div>
            <div class="uc-handle">@{user.username}</div>
            <div class="uc-bio">{user.bio}</div>
          </div>
          <div class="uc-arrow">→</div>
        </button>
      {/each}
    </div>

    <div class="login-footer">
      <div class="gh-note">
        <span class="gh-icon">⌥</span>
        In production this would use GitHub OAuth
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
    margin-bottom: 16px;
  }
  .divider::before, .divider::after {
    content: ''; flex: 1;
    height: 1px; background: var(--border);
  }
  .divider span { font-size: 12px; color: var(--text3); white-space: nowrap; font-family: 'Space Mono', monospace; }

  .user-cards { display: flex; flex-direction: column; gap: 10px; margin-bottom: 24px; }

  .user-card {
    display: flex; align-items: center; gap: 14px;
    padding: 16px;
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    cursor: pointer;
    transition: all .15s;
    text-align: left; width: 100%;
  }
  .user-card:hover {
    border-color: var(--accent);
    background: var(--accent-dim);
    transform: translateY(-1px);
    box-shadow: var(--shadow);
  }

  .uc-avatar {
    width: 46px; height: 46px; border-radius: 12px;
    border: 1px solid;
    display: flex; align-items: center; justify-content: center;
    font-family: 'Syne', sans-serif; font-size: 14px; font-weight: 800;
    flex-shrink: 0;
  }
  .uc-info { flex: 1; min-width: 0; }
  .uc-name { font-size: 15px; font-weight: 700; color: var(--text); }
  .uc-handle { font-family: 'Space Mono', monospace; font-size: 11px; color: var(--text3); margin-bottom: 3px; }
  .uc-bio { font-size: 12px; color: var(--text2); }
  .uc-arrow { font-size: 18px; color: var(--text3); transition: transform .15s; }
  .user-card:hover .uc-arrow { transform: translateX(4px); color: var(--accent); }

  .login-footer { border-top: 1px solid var(--border); padding-top: 18px; }
  .gh-note {
    display: flex; align-items: center; gap: 8px;
    font-size: 12px; color: var(--text3);
  }
  .gh-icon { font-size: 14px; }
</style>
