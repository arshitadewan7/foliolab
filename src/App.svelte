<script>
  import { currentPage, currentUser, theme } from './stores/state.js'
  import Sidebar from './components/Sidebar.svelte'
  import Login from './pages/Login.svelte'
  import Dashboard from './pages/Dashboard.svelte'
  import Problems from './pages/Problems.svelte'
  import Planner from './pages/Planner.svelte'
  import Companies from './pages/Companies.svelte'
  import Notes from './pages/Notes.svelte'
  import Lab from './pages/Lab.svelte'

  let loggedIn = false

  function handleLogin(e) {
    currentUser.set(e.detail.user)
    loggedIn = true
  }
</script>

{#if !loggedIn}
  <Login on:login={handleLogin} />
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
</style>
