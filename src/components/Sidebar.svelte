<script>
  import { currentPage, currentUser, theme, users } from '../stores/state.js'

  const navItems = [
    { id: 'dashboard', icon: '⬡', label: 'Dashboard' },
    { id: 'problems',  icon: '⌬', label: 'Problems'  },
    { id: 'planner',   icon: '◫', label: 'Planner'   },
    { id: 'companies', icon: '◈', label: 'Companies' },
    { id: 'notes',     icon: '◻', label: 'Notes'     },
    { id: 'lab',       icon: '⚗', label: 'The Lab'   },
  ]

  $: me = users[$currentUser]
  $: partner = users[$currentUser === 'arshita' ? 'shivali' : 'arshita']

  function toggleTheme() {
    theme.update(t => t === 'dark' ? 'light' : 'dark')
  }
</script>

<aside class="sidebar">
  <!-- Logo -->
  <div class="logo">
    <div class="logo-mark">FL</div>
    <div>
      <div class="logo-text">FolioLab</div>
      <div class="logo-sub">.tech</div>
    </div>
  </div>

  <!-- Nav -->
  <nav class="nav">
    {#each navItems as item}
      <button
        class="nav-item"
        class:active={$currentPage === item.id}
        on:click={() => currentPage.set(item.id)}
      >
        <span class="nav-icon">{item.icon}</span>
        <span>{item.label}</span>
        {#if item.id === 'lab'}
          <span class="new-badge">LIVE</span>
        {/if}
      </button>
    {/each}
  </nav>

  <div class="spacer"></div>

  <!-- Partner card -->
  <div class="partner-section">
    <div class="section-label">PARTNER</div>
    <div class="partner-card">
      <div class="avatar" style="background: {partner.avatarColor}20; color: {partner.avatarColor};">
        {partner.avatar}
      </div>
      <div class="partner-info">
        <div class="partner-name">{partner.name}</div>
        <div class="partner-active">
          <span class="online-dot"></span>
          {partner.lastActive}
        </div>
      </div>
      <div class="partner-streak">
        <span class="streak-num">{partner.streak}</span>
        <span class="streak-fire">🔥</span>
      </div>
    </div>
  </div>

  <!-- User + theme -->
  <div class="sidebar-footer">
    <div class="user-row">
      <div class="avatar sm" style="background: {me.avatarColor}20; color: {me.avatarColor};">
        {me.avatar}
      </div>
      <div class="user-info">
        <div class="user-name">{me.name}</div>
        <div class="user-handle">@{me.username}</div>
      </div>
      <button class="theme-btn" on:click={toggleTheme} title="Toggle theme">
        {$theme === 'dark' ? '☀️' : '🌙'}
      </button>
    </div>
  </div>
</aside>

<style>
  .sidebar {
    width: 228px;
    min-width: 228px;
    background: var(--surface);
    border-right: 1px solid var(--border);
    display: flex;
    flex-direction: column;
    height: 100vh;
    overflow: hidden;
  }

  .logo {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 22px 18px 18px;
    border-bottom: 1px solid var(--border);
  }
  .logo-mark {
    width: 34px; height: 34px;
    background: linear-gradient(135deg, var(--accent), var(--accent2));
    border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    font-family: 'Space Mono', monospace;
    font-size: 12px; font-weight: 700;
    color: #fff;
    flex-shrink: 0;
  }
  .logo-text {
    font-family: 'Syne', sans-serif;
    font-size: 17px; font-weight: 800;
    color: var(--text);
    letter-spacing: -.5px;
    line-height: 1;
  }
  .logo-sub {
    font-family: 'Space Mono', monospace;
    font-size: 10px; color: var(--text3);
    letter-spacing: 1px;
  }

  .nav {
    padding: 14px 10px;
    display: flex; flex-direction: column; gap: 2px;
  }
  .nav-item {
    display: flex; align-items: center; gap: 10px;
    padding: 9px 10px;
    border-radius: var(--radius-sm);
    border: 1px solid transparent;
    background: transparent;
    color: var(--text2);
    font-family: 'Inter', sans-serif;
    font-size: 13.5px; font-weight: 500;
    cursor: pointer;
    transition: all .15s;
    text-align: left; width: 100%;
  }
  .nav-item:hover { color: var(--text); background: var(--surface2); }
  .nav-item.active {
    color: var(--accent);
    background: var(--accent-dim);
    border-color: rgba(167,139,250,.2);
    font-weight: 600;
  }
  .nav-icon { font-size: 15px; width: 20px; text-align: center; flex-shrink: 0; }
  .new-badge {
    margin-left: auto;
    background: var(--accent3-dim);
    color: var(--accent3);
    font-size: 9px; font-weight: 700;
    font-family: 'Space Mono', monospace;
    padding: 2px 6px; border-radius: 99px;
    letter-spacing: .5px;
    animation: pulse 2s infinite;
  }

  .spacer { flex: 1; }

  .partner-section {
    margin: 0 10px 10px;
    padding: 14px;
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: var(--radius);
  }
  .section-label {
    font-size: 10px; color: var(--text3);
    font-family: 'Space Mono', monospace;
    letter-spacing: 1.5px; margin-bottom: 10px;
  }
  .partner-card { display: flex; align-items: center; gap: 10px; }
  .avatar {
    width: 36px; height: 36px; border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-family: 'Syne', sans-serif; font-size: 12px; font-weight: 800;
    flex-shrink: 0;
  }
  .avatar.sm { width: 30px; height: 30px; font-size: 11px; border-radius: 8px; }
  .partner-info { flex: 1; min-width: 0; }
  .partner-name { font-size: 13px; font-weight: 600; color: var(--text); }
  .partner-active { display: flex; align-items: center; gap: 4px; font-size: 11px; color: var(--text3); margin-top: 1px; }
  .online-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--accent2); flex-shrink: 0; }
  .partner-streak { text-align: center; }
  .streak-num { font-family: 'Space Mono', monospace; font-size: 14px; font-weight: 700; color: var(--text); display: block; line-height: 1; }
  .streak-fire { font-size: 12px; }

  .sidebar-footer {
    padding: 12px 10px;
    border-top: 1px solid var(--border);
  }
  .user-row { display: flex; align-items: center; gap: 8px; }
  .user-info { flex: 1; min-width: 0; }
  .user-name { font-size: 13px; font-weight: 600; color: var(--text); }
  .user-handle { font-size: 11px; color: var(--text3); font-family: 'Space Mono', monospace; }
  .theme-btn {
    background: none; border: 1px solid var(--border);
    border-radius: 6px; padding: 4px 7px;
    cursor: pointer; font-size: 14px;
    transition: background .15s;
  }
  .theme-btn:hover { background: var(--surface2); }
</style>
