<script>
  import { notes, currentUser, users } from '../stores/state.js'

  $: me = users[$currentUser]
  $: partner = users[$currentUser === 'arshita' ? 'shivali' : 'arshita']

  let showModal = false
  let expandedNote = null
  let form = { title: '', body: '', pinned: false }

  function openAdd() {
    form = { title: '', body: '', pinned: false }
    showModal = true
  }

  function save() {
    if (!form.title.trim()) return
    notes.update(ns => [{
      id: Date.now(), ...form,
      author: $currentUser,
      date: new Date().toLocaleDateString('en-AU', { day: 'numeric', month: 'short' })
    }, ...ns])
    showModal = false
  }

  function remove(id) {
    notes.update(ns => ns.filter(n => n.id !== id))
    if (expandedNote?.id === id) expandedNote = null
  }

  function togglePin(id) {
    notes.update(ns => ns.map(n => n.id === id ? { ...n, pinned: !n.pinned } : n))
  }

  $: pinned = $notes.filter(n => n.pinned)
  $: unpinned = $notes.filter(n => !n.pinned)

  function authorColor(author) {
    return users[author]?.avatarColor || 'var(--text3)'
  }
  function authorLabel(author) {
    return users[author]?.avatar || '?'
  }
</script>

<div class="page">
  <div class="page-header">
    <div>
      <h1 class="page-title">Shared <span>Notes</span></h1>
      <p class="page-sub">{$notes.length} notes — visible to both you and {partner.name}</p>
    </div>
    <button class="btn-primary" on:click={openAdd}>+ New Note</button>
  </div>

  {#if pinned.length}
    <div class="section-label">📌 PINNED</div>
    <div class="notes-grid fade-up">
      {#each pinned as note (note.id)}
        <div class="note-card pinned" on:click={() => expandedNote = note}
          role="button" tabindex="0"
          on:keydown={e => e.key === 'Enter' && (expandedNote = note)}>
          <div class="note-top">
            <div class="author-chip" style="background:{authorColor(note.author)}18;color:{authorColor(note.author)}">
              {authorLabel(note.author)} {users[note.author]?.name}
            </div>
            <div class="note-actions" on:click|stopPropagation role="presentation">
              <button class="action-btn pin" class:active={note.pinned} on:click={() => togglePin(note.id)} title="Unpin">📌</button>
              {#if note.author === $currentUser}
                <button class="action-btn del" on:click={() => remove(note.id)}>✕</button>
              {/if}
            </div>
          </div>
          <div class="note-title">{note.title}</div>
          <div class="note-body">{note.body}</div>
          <div class="note-date">{note.date}</div>
        </div>
      {/each}
    </div>
  {/if}

  {#if unpinned.length}
    <div class="section-label" style="margin-top: {pinned.length ? 24 : 0}px">ALL NOTES</div>
    <div class="notes-grid fade-up">
      {#each unpinned as note (note.id)}
        <div class="note-card" on:click={() => expandedNote = note}
          role="button" tabindex="0"
          on:keydown={e => e.key === 'Enter' && (expandedNote = note)}>
          <div class="note-top">
            <div class="author-chip" style="background:{authorColor(note.author)}18;color:{authorColor(note.author)}">
              {authorLabel(note.author)} {users[note.author]?.name}
            </div>
            <div class="note-actions" on:click|stopPropagation role="presentation">
              <button class="action-btn pin" on:click={() => togglePin(note.id)} title="Pin">📌</button>
              {#if note.author === $currentUser}
                <button class="action-btn del" on:click={() => remove(note.id)}>✕</button>
              {/if}
            </div>
          </div>
          <div class="note-title">{note.title}</div>
          <div class="note-body">{note.body}</div>
          <div class="note-date">{note.date}</div>
        </div>
      {/each}
    </div>
  {/if}

  {#if !$notes.length}
    <div class="empty-state">
      <div class="empty-icon">◻</div>
      <div>No notes yet. Add algo patterns, interview tips, anything!</div>
    </div>
  {/if}
</div>

<!-- Expanded note modal -->
{#if expandedNote}
  <!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
  <div class="modal-overlay" on:click|self={() => expandedNote = null}>
    <div class="modal expanded fade-up">
      <div class="exp-header">
        <div class="author-chip" style="background:{authorColor(expandedNote.author)}18;color:{authorColor(expandedNote.author)}">
          {authorLabel(expandedNote.author)} {users[expandedNote.author]?.name}
        </div>
        <button class="btn-ghost sm" on:click={() => expandedNote = null}>Close</button>
      </div>
      <h2 class="exp-title">{expandedNote.title}</h2>
      <pre class="exp-body">{expandedNote.body}</pre>
      <div class="exp-date">{expandedNote.date}</div>
    </div>
  </div>
{/if}

<!-- Add modal -->
{#if showModal}
  <!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
  <div class="modal-overlay" on:click|self={() => showModal = false}>
    <div class="modal fade-up">
      <h2 class="modal-title">New Note</h2>
      <div class="form-group">
        <label class="form-label">Title</label>
        <input class="form-input" bind:value={form.title} placeholder="e.g. Sliding Window Pattern" />
      </div>
      <div class="form-group">
        <label class="form-label">Content</label>
        <textarea class="form-input" bind:value={form.body} rows="6" placeholder="Write anything — patterns, code snippets, tips..."></textarea>
      </div>
      <div class="modal-actions">
        <button class="btn-ghost" on:click={() => showModal = false}>Cancel</button>
        <button class="btn-primary" on:click={save}>Save Note</button>
      </div>
    </div>
  </div>
{/if}

<style>
  .page { padding: 32px; max-width: 1100px; }
  .page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; }
  .page-title { font-size: 26px; font-weight: 800; letter-spacing: -.5px; color: var(--text); }
  .page-title span { color: var(--accent); }
  .page-sub { font-size: 12px; color: var(--text3); font-family: 'Space Mono', monospace; margin-top: 3px; }

  .section-label { font-size: 11px; color: var(--text3); text-transform: uppercase; letter-spacing: 2px; font-family: 'Space Mono', monospace; margin-bottom: 14px; }

  .notes-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 14px; margin-bottom: 8px; }

  .note-card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: var(--radius); padding: 16px;
    cursor: pointer; min-height: 160px;
    display: flex; flex-direction: column;
    position: relative; overflow: hidden;
    transition: transform .15s, box-shadow .15s, border-color .15s;
  }
  .note-card::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px;
  }
  .note-card:nth-child(4n+1)::before { background: var(--accent); }
  .note-card:nth-child(4n+2)::before { background: var(--accent2); }
  .note-card:nth-child(4n+3)::before { background: var(--accent3); }
  .note-card:nth-child(4n+4)::before { background: var(--yellow); }
  .note-card:hover { transform: translateY(-3px); box-shadow: var(--shadow); border-color: var(--border2); }
  .note-card.pinned { border-color: rgba(167,139,250,.3); }

  .note-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
  .author-chip {
    display: flex; align-items: center; gap: 5px;
    font-size: 11px; font-weight: 700; font-family: 'Syne', sans-serif;
    padding: 3px 8px; border-radius: 99px;
  }
  .note-actions { display: flex; gap: 4px; }
  .action-btn {
    background: none; border: none; cursor: pointer;
    font-size: 11px; padding: 2px 5px; border-radius: 4px;
    color: var(--text3); transition: all .15s; opacity: .4;
  }
  .action-btn:hover { opacity: 1; }
  .action-btn.active { opacity: 1; }
  .action-btn.del:hover { color: var(--accent3); }

  .note-title { font-size: 14px; font-weight: 700; color: var(--text); margin-bottom: 8px; line-height: 1.3; }
  .note-body {
    font-size: 12px; color: var(--text2); line-height: 1.6;
    flex: 1; overflow: hidden;
    display: -webkit-box; -webkit-line-clamp: 4; -webkit-box-orient: vertical;
    white-space: pre-wrap;
  }
  .note-date { font-size: 10px; color: var(--text3); font-family: 'Space Mono', monospace; margin-top: 12px; }

  .empty-state { text-align: center; padding: 60px 20px; color: var(--text3); }
  .empty-icon { font-size: 32px; margin-bottom: 12px; }

  /* Expanded */
  .expanded { max-width: 600px; max-height: 80vh; overflow-y: auto; }
  .exp-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
  .exp-title { font-size: 22px; font-weight: 800; color: var(--text); margin-bottom: 16px; }
  .exp-body { font-size: 13px; color: var(--text2); line-height: 1.7; white-space: pre-wrap; font-family: 'Space Mono', monospace; background: var(--surface2); border-radius: var(--radius-sm); padding: 16px; }
  .exp-date { font-size: 11px; color: var(--text3); font-family: 'Space Mono', monospace; margin-top: 12px; }

  .btn-ghost.sm { padding: 6px 12px; font-size: 12px; }

  .btn-primary { background: var(--accent); color: var(--bg); border: none; border-radius: var(--radius-sm); padding: 9px 18px; font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 700; cursor: pointer; transition: opacity .15s; }
  .btn-primary:hover { opacity: .85; }
  .btn-ghost { background: transparent; border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 9px 18px; font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 600; color: var(--text2); cursor: pointer; }
  .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,.7); backdrop-filter: blur(6px); z-index: 100; display: flex; align-items: center; justify-content: center; }
  .modal { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 28px; width: 480px; max-width: 95vw; }
  .modal-title { font-size: 18px; font-weight: 800; color: var(--text); margin-bottom: 20px; }
  .form-group { margin-bottom: 14px; }
  .form-label { display: block; font-size: 11px; color: var(--text3); text-transform: uppercase; letter-spacing: 1px; font-family: 'Space Mono', monospace; margin-bottom: 6px; }
  .form-input { width: 100%; background: var(--bg); border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 9px 12px; color: var(--text); font-family: 'Inter', sans-serif; font-size: 13px; outline: none; transition: border-color .15s; resize: vertical; }
  .form-input:focus { border-color: var(--accent); }
  .modal-actions { display: flex; gap: 10px; justify-content: flex-end; margin-top: 6px; }
</style>
