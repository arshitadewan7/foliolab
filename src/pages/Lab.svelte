<script>
  import { challenges, currentUser, users } from '../stores/state.js'

  $: me = users[$currentUser]
  $: partner = users[$currentUser === 'arshita' ? 'shivali' : 'arshita']

  $: active = $challenges.filter(c => c.status === 'active')
  $: completed = $challenges.filter(c => c.status === 'completed')

  let showModal = false
  let challengeType = 'race'
  let form = { problem: '', problemNumber: '', diff: 'Medium', type: 'race' }

  function openChallenge() {
    form = { problem: '', problemNumber: '', diff: 'Medium', type: 'race' }
    showModal = true
  }

  function createChallenge() {
    if (!form.problem.trim()) return
    challenges.update(cs => [{
      id: Date.now(),
      type: form.type,
      problem: form.problem,
      problemNumber: parseInt(form.problemNumber) || 0,
      diff: form.diff,
      status: 'active',
      challenger: $currentUser,
      opponent: $currentUser === 'arshita' ? 'shivali' : 'arshita',
      startTime: Date.now(),
      arshitaDone: false,
      shivaliDone: false,
      winner: null,
    }, ...cs])
    showModal = false
  }

  function markDone(id) {
    challenges.update(cs => cs.map(c => {
      if (c.id !== id) return c
      const updated = { ...c, [$currentUser + 'Done']: true }
      // check if both done
      if (updated.arshitaDone && updated.shivaliDone) {
        updated.status = 'completed'
        updated.winner = $currentUser // first to mark done wins in mock
      }
      return updated
    }))
  }

  function winnerName(winner) {
    return users[winner]?.name || 'Unknown'
  }

  function timeSince(ts) {
    const mins = Math.floor((Date.now() - ts) / 60000)
    if (mins < 60) return `${mins}m ago`
    return `${Math.floor(mins/60)}h ago`
  }

  $: wins = {
    arshita: completed.filter(c => c.winner === 'arshita').length,
    shivali: completed.filter(c => c.winner === 'shivali').length,
  }

  const typeIcon = { race: '🏁', 'time-beat': '⏱', weekly: '📅' }
  const typeLabel = { race: 'Race', 'time-beat': 'Time Beat', weekly: 'Weekly' }
  const diffStyle = { Easy: 'easy', Medium: 'medium', Hard: 'hard' }
</script>

<div class="page">
  <div class="page-header">
    <div>
      <h1 class="page-title">The <span>Lab</span> ⚗</h1>
      <p class="page-sub">Head-to-head challenges — may the best dev win</p>
    </div>
    <button class="btn-primary" on:click={openChallenge}>+ Challenge {partner.name}</button>
  </div>

  <!-- Score banner -->
  <div class="score-banner fade-up">
    <div class="score-side" style="--col: {me.avatarColor}">
      <div class="score-av" style="background:{me.avatarColor}18;color:{me.avatarColor}">{me.avatar}</div>
      <div class="score-name">{me.name}</div>
      <div class="score-num" style="color:{me.avatarColor}">{wins[$currentUser]}</div>
    </div>
    <div class="score-vs">
      <div class="vs-text">VS</div>
      <div class="vs-total">{completed.length} battles</div>
    </div>
    <div class="score-side right" style="--col: {partner.avatarColor}">
      <div class="score-av" style="background:{partner.avatarColor}18;color:{partner.avatarColor}">{partner.avatar}</div>
      <div class="score-name">{partner.name}</div>
      <div class="score-num" style="color:{partner.avatarColor}">{wins[$currentUser === 'arshita' ? 'shivali' : 'arshita']}</div>
    </div>
  </div>

  <!-- Active challenges -->
  {#if active.length}
    <div class="section-label">⚡ LIVE NOW</div>
    {#each active as c (c.id)}
      <div class="challenge-card active fade-up">
        <div class="ch-left">
          <span class="ch-type">{typeIcon[c.type]} {typeLabel[c.type]}</span>
          <div class="ch-problem">
            {#if c.problemNumber}<span class="ch-num">#{c.problemNumber}</span>{/if}
            <span class="ch-name">{c.problem}</span>
            <span class="diff-badge {diffStyle[c.diff]}">{c.diff}</span>
          </div>
          <div class="ch-meta">Started {timeSince(c.startTime)}</div>
        </div>
        <div class="ch-players">
          {#each ['arshita','shivali'] as u}
            <div class="player-status" class:done={c[u+'Done']}>
              <div class="pl-av" style="background:{users[u].avatarColor}18;color:{users[u].avatarColor}">{users[u].avatar}</div>
              <span class="pl-name">{users[u].name}</span>
              <span class="pl-badge" class:solved={c[u+'Done']}>{c[u+'Done'] ? '✓ Done' : '⏳ Solving'}</span>
            </div>
          {/each}
        </div>
        {#if !c[$currentUser + 'Done']}
          <button class="btn-done" on:click={() => markDone(c.id)}>Mark as solved ✓</button>
        {:else}
          <div class="waiting">Waiting for {partner.name}...</div>
        {/if}
      </div>
    {/each}
  {/if}

  <!-- Completed -->
  {#if completed.length}
    <div class="section-label" style="margin-top: 28px;">PAST BATTLES</div>
    <div class="battles-list fade-up">
      {#each completed as c (c.id)}
        <div class="battle-row">
          <span class="ch-type sm">{typeIcon[c.type]}</span>
          <div class="battle-info">
            <span class="battle-problem">
              {#if c.problemNumber}#{c.problemNumber} — {/if}{c.problem}
            </span>
            {#if c.type === 'time-beat'}
              <span class="battle-detail">Arshita: {c.arshitaTime}min · Shivali: {c.shivaliTime}min</span>
            {:else if c.type === 'weekly'}
              <span class="battle-detail">{c.week} · Arshita: {c.arshitaSolved}/3 · Shivali: {c.shivaliSolved}/3</span>
            {/if}
          </div>
          <span class="diff-badge {diffStyle[c.diff]} sm">{c.diff}</span>
          <div class="winner-chip" style="background:{users[c.winner]?.avatarColor}18;color:{users[c.winner]?.avatarColor}">
            🏆 {winnerName(c.winner)}
          </div>
        </div>
      {/each}
    </div>
  {/if}

  {#if !active.length && !completed.length}
    <div class="empty-state">
      <div class="empty-icon">⚗</div>
      <div>No challenges yet — challenge {partner.name} to a race!</div>
    </div>
  {/if}
</div>

{#if showModal}
  <!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
  <div class="modal-overlay" on:click|self={() => showModal = false}>
    <div class="modal fade-up">
      <h2 class="modal-title">Challenge {partner.name} ⚗</h2>
      <div class="form-group">
        <label class="form-label">Challenge Type</label>
        <div class="type-picker">
          {#each [['race','🏁 Race — who solves it first'], ['time-beat','⏱ Time Beat — beat my time'], ['weekly','📅 Weekly — 3 problems this week']] as [val, label]}
            <button class="type-btn" class:active={form.type === val} on:click={() => form.type = val}>
              {label}
            </button>
          {/each}
        </div>
      </div>
      {#if form.type !== 'weekly'}
        <div class="form-row">
          <div class="form-group" style="flex:3">
            <label class="form-label">Problem Name</label>
            <input class="form-input" bind:value={form.problem} placeholder="e.g. Longest Palindromic Substring" />
          </div>
          <div class="form-group" style="flex:1">
            <label class="form-label">Number</label>
            <input class="form-input" bind:value={form.problemNumber} placeholder="5" />
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Difficulty</label>
          <select class="form-input" bind:value={form.diff}>
            <option>Easy</option><option>Medium</option><option>Hard</option>
          </select>
        </div>
      {:else}
        <div class="form-group">
          <label class="form-label">Weekly Theme (optional)</label>
          <input class="form-input" bind:value={form.problem} placeholder="e.g. Week 9: Dynamic Programming" />
        </div>
      {/if}
      <div class="modal-actions">
        <button class="btn-ghost" on:click={() => showModal = false}>Cancel</button>
        <button class="btn-primary" on:click={createChallenge}>Start Challenge</button>
      </div>
    </div>
  </div>
{/if}

<style>
  .page { padding: 32px; max-width: 900px; }
  .page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; }
  .page-title { font-size: 26px; font-weight: 800; letter-spacing: -.5px; color: var(--text); }
  .page-title span { color: var(--accent3); }
  .page-sub { font-size: 12px; color: var(--text3); font-family: 'Space Mono', monospace; margin-top: 3px; }

  /* Score banner */
  .score-banner {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: var(--radius-lg); padding: 24px 32px;
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 28px;
  }
  .score-side { display: flex; flex-direction: column; align-items: center; gap: 8px; }
  .score-side.right { align-items: center; }
  .score-av { width: 42px; height: 42px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 800; font-family: 'Syne', sans-serif; }
  .score-name { font-size: 13px; font-weight: 600; color: var(--text2); }
  .score-num { font-family: 'Space Mono', monospace; font-size: 40px; font-weight: 700; line-height: 1; }
  .score-vs { text-align: center; }
  .vs-text { font-family: 'Syne', sans-serif; font-size: 20px; font-weight: 800; color: var(--text3); }
  .vs-total { font-size: 11px; color: var(--text3); font-family: 'Space Mono', monospace; margin-top: 4px; }

  .section-label { font-size: 11px; color: var(--text3); text-transform: uppercase; letter-spacing: 2px; font-family: 'Space Mono', monospace; margin-bottom: 14px; }

  /* Active challenge */
  .challenge-card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: var(--radius); padding: 20px;
    margin-bottom: 12px; display: flex; align-items: center; gap: 20px; flex-wrap: wrap;
  }
  .challenge-card.active { border-color: rgba(251,113,133,.3); background: rgba(251,113,133,.03); }

  .ch-left { flex: 1; min-width: 200px; }
  .ch-type { font-size: 12px; color: var(--text3); font-family: 'Space Mono', monospace; display: block; margin-bottom: 6px; }
  .ch-type.sm { font-size: 16px; }
  .ch-problem { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; margin-bottom: 4px; }
  .ch-num { font-family: 'Space Mono', monospace; font-size: 12px; color: var(--text3); }
  .ch-name { font-size: 16px; font-weight: 700; color: var(--text); }
  .ch-meta { font-size: 11px; color: var(--text3); font-family: 'Space Mono', monospace; }

  .ch-players { display: flex; gap: 12px; }
  .player-status { display: flex; align-items: center; gap: 8px; padding: 8px 12px; background: var(--surface2); border-radius: 8px; border: 1px solid var(--border); }
  .player-status.done { border-color: rgba(52,211,153,.3); background: rgba(52,211,153,.05); }
  .pl-av { width: 26px; height: 26px; border-radius: 7px; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 800; font-family: 'Syne', sans-serif; }
  .pl-name { font-size: 13px; font-weight: 600; }
  .pl-badge { font-size: 11px; color: var(--text3); font-family: 'Space Mono', monospace; }
  .pl-badge.solved { color: var(--accent2); }

  .btn-done {
    background: var(--accent2); color: var(--bg);
    border: none; border-radius: var(--radius-sm);
    padding: 10px 18px; font-family: 'Syne', sans-serif;
    font-size: 13px; font-weight: 700; cursor: pointer;
    transition: opacity .15s;
  }
  .btn-done:hover { opacity: .85; }
  .waiting { font-size: 12px; color: var(--text3); font-family: 'Space Mono', monospace; }

  /* Battles list */
  .battles-list { display: flex; flex-direction: column; gap: 8px; }
  .battle-row {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: var(--radius); padding: 14px 18px;
    display: flex; align-items: center; gap: 14px; flex-wrap: wrap;
  }
  .battle-info { flex: 1; min-width: 160px; }
  .battle-problem { font-size: 13px; font-weight: 600; color: var(--text); display: block; }
  .battle-detail { font-size: 11px; color: var(--text3); font-family: 'Space Mono', monospace; }
  .winner-chip { padding: 4px 12px; border-radius: 99px; font-size: 12px; font-weight: 700; }

  /* Diff badges */
  .diff-badge { display: inline-block; padding: 2px 8px; border-radius: 99px; font-size: 11px; font-weight: 700; font-family: 'Space Mono', monospace; }
  .diff-badge.easy { background: var(--accent2-dim); color: var(--accent2); }
  .diff-badge.medium { background: var(--yellow-dim); color: var(--yellow); }
  .diff-badge.hard { background: var(--accent3-dim); color: var(--accent3); }
  .diff-badge.sm { font-size: 10px; padding: 1px 7px; }

  .empty-state { text-align: center; padding: 60px 20px; color: var(--text3); }
  .empty-icon { font-size: 36px; margin-bottom: 12px; }

  /* Type picker */
  .type-picker { display: flex; flex-direction: column; gap: 8px; }
  .type-btn {
    background: var(--surface2); border: 1px solid var(--border);
    border-radius: var(--radius-sm); padding: 10px 14px;
    text-align: left; font-size: 13px; color: var(--text2);
    cursor: pointer; transition: all .15s; font-family: 'Inter', sans-serif;
  }
  .type-btn:hover { border-color: var(--accent); color: var(--text); }
  .type-btn.active { border-color: var(--accent); background: var(--accent-dim); color: var(--accent); font-weight: 600; }

  .btn-primary { background: var(--accent); color: var(--bg); border: none; border-radius: var(--radius-sm); padding: 9px 18px; font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 700; cursor: pointer; transition: opacity .15s; }
  .btn-primary:hover { opacity: .85; }
  .btn-ghost { background: transparent; border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 9px 18px; font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 600; color: var(--text2); cursor: pointer; }
  .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,.7); backdrop-filter: blur(6px); z-index: 100; display: flex; align-items: center; justify-content: center; }
  .modal { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 28px; width: 480px; max-width: 95vw; }
  .modal-title { font-size: 18px; font-weight: 800; color: var(--text); margin-bottom: 20px; }
  .form-row { display: flex; gap: 12px; }
  .form-group { margin-bottom: 14px; flex: 1; }
  .form-label { display: block; font-size: 11px; color: var(--text3); text-transform: uppercase; letter-spacing: 1px; font-family: 'Space Mono', monospace; margin-bottom: 6px; }
  .form-input { width: 100%; background: var(--bg); border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 9px 12px; color: var(--text); font-family: 'Inter', sans-serif; font-size: 13px; outline: none; transition: border-color .15s; }
  .form-input:focus { border-color: var(--accent); }
  .modal-actions { display: flex; gap: 10px; justify-content: flex-end; margin-top: 6px; }
</style>
