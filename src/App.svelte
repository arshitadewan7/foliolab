<script>
  import { onMount } from 'svelte'
  import { supabase } from './lib/supabase.js'
  import { currentPage, currentUser } from './stores/state.js'
  import Sidebar from './components/Sidebar.svelte'
  import Login from './pages/Login.svelte'
  import Dashboard from './pages/Dashboard.svelte'
  import Problems from './pages/Problems.svelte'
  import Planner from './pages/Planner.svelte'
  import Companies from './pages/Companies.svelte'
  import Notes from './pages/Notes.svelte'
  import Lab from './pages/Lab.svelte'

  let loggedIn = false
  let authReady = false   // prevents flash of login screen on refresh

  onMount(() => {
    // Resolve existing session (handles OAuth redirects too)
    supabase.auth.getSession().then(({ data: { session } }) => {
      loggedIn = !!session
      if (session) currentUser.set('arshita')
      authReady = true
    })

    // Keep loggedIn in sync for sign-in / sign-out events
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      loggedIn = !!session
      if (session) currentUser.set('arshita')
      authReady = true
    })

    return () => subscription.unsubscribe()
  })
</script>

{#if !authReady}
  <!-- Blank while Supabase resolves the session to avoid a login flash -->
  <div class="auth-loading">
    <div class="auth-spinner"></div>
  </div>
{:else if !loggedIn}
  <Login />
{:else}
  <div class="app-layout">
    <Sidebar />
    <main class="main-content">
      {#if $currentPage === 'dashboard'}
        <Dashboard />
      {:else if $currentPage === 'problems'}
        <Problems />
      {:else if $currentPage === 'planner'}
        <Planner />
      {:else if $currentPage === 'companies'}
        <Companies />
      {:else if $currentPage === 'notes'}
        <Notes />
      {:else if $currentPage === 'lab'}
        <Lab />
      {/if}
    </main>
  </div>
{/if}

<style>
  .app-layout {
    display: flex;
    height: 100vh;
    overflow: hidden;
    background: var(--bg);
  }

  .main-content {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
  }

  .auth-loading {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--bg);
  }

  .auth-spinner {
    width: 24px; height: 24px;
    border: 2px solid var(--border);
    border-top-color: var(--accent);
    border-radius: 50%;
    animation: spin .6s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg) } }
</style>
