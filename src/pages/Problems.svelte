<script>
  import { problems, currentUser, users } from '../stores/state.js'

  $: me = users[$currentUser]
  $: partner = users[$currentUser === 'arshita' ? 'shivali' : 'arshita']

  let filterDiff = ''
  let filterStatus = ''
  let showModal = false
  let editId = null

  let form = { name: '', number: '', diff: 'Medium', topics: '', myStatus: 'done', myNotes: '' }

  $: filtered = $problems.filter(p => {
    if (filterDiff && p.diff !== filterDiff) return false
    if (filterStatus && p[$currentUser] !== filterStatus) return false
    return true
  })

  function openAdd() {
    editId = null
    form = { name: '', number: '', diff: 'Medium', topics: '', myStatus: 'done', myNotes: '' }
    showModal = true
  }

  function openEdit(p) {
    editId = p.id
    form = {
      name: p.name, number: String(p.number), diff: p.diff,
      topics: p.topics.join(', '),
      myStatus: p[$currentUser],
      myNotes: p[$currentUser + 'Notes'] || ''
    }
    showModal = true
  }

  function save() {
    if (!form.name.trim()) return
    const topics = form.topics.split(',').map(s => s.trim()).filter(Boolean)
    problems.update(ps => {
      if (editId) {
        return ps.map(p => p.id === editId
          ? { ...p, name: form.name, number: parseInt(form.number)||p.number, diff: form.diff, topics,
              [$currentUser]: form.myStatus, [$currentUser+'Notes']: form.myNotes }
          : p)
      } else {
        const newP = {
          id: Date.now(), name: form.name, number: parseInt(form.number)||0,
          diff: form.diff, topics, link: '',
          arshita: $currentUser === 'arshita' ? form.myStatus : 'todo',
          shivali: $currentUser === 'shivali' ? form.myStatus : 'todo',
          arshitaNotes: $currentUser === 'arshita' ? form.myNotes : '',
          shivaliNotes: $currentUser === 'shivali' ? form.myNotes : '',
        }
        return [newP, ...ps]
      }
    })
    showModal = false
  }

  function remove(id) {
    problems.update(ps => ps.filter(p => p.id !== id))
  }

  const diffClass = { Easy: 'easy', Medium: 'medium', Hard: 'hard' }
  const statusLabel = { done: '✓ Solved', review: '↻ Review', todo: '– Todo' }
  const statusClass = { done: 'status-done', review: 'status-review', todo: 'status-todo' }
</script>

<div class="page">
  <div class="page-header">
    <div>
      <h1 class="page-title">Problem <span>Log</span></h1>
      <p class="page-sub">{$problems.length} problems tracked</p>
    </div>
    <div class="header-actions">
      <select bind:value={filterDiff} class="filter-select">
        <option value="">All Difficulties</option>
        <option>Easy</option><option>Medium</option><option>Hard</option>
      </select>
      <select bind:value={filterStatus} class="filter-select">
        <option value="">All Status</option>
        <option value="done">Solved</option>
        <option value="review">Review</option>
        <option value="todo">Todo</option>
      </select>
      <button class="btn-primary" on:click={openAdd}>+ Add Problem</button>
    </div>
  </div>

  <!-- Dual-user legend -->
  <div class="legend fade-up">
    <div class="legend-user" style="border-color: {me.avatarColor}40">
      <div class="leg-av" style="background:{me.avatarColor}18;color:{me.avatarColor}">{me.avatar}</div>
      <span>{me.name} (you)</span>
    </div>
    <div class="legend-user" style="border-color: {partner.avatarColor}40">
      <div class="leg-av" style="background:{partner.avatarColor}18;color:{partner.avatarColor}">{partner.avatar}</div>
      <span>{partner.name}</span>
    </div>
  </div>

  <div class="table-card fade-up">
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Problem</th>
            <th>Difficulty</th>
            <th>Topics</th>
            <th style="color:{me.avatarColor}">{me.name}</th>
            <th style="color:{partner.avatarColor}">{partner.name}</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {#each filtered as p (p.id)}
            <tr class="fade-up">
              <td class="num-col">#{p.number}</td>
              <td class="name-col">
                <span class="prob-name">{p.name}</span>
                {#if p[$currentUser + 'Notes']}
                  <div class="prob-note">{p[$currentUser + 'Notes']}</div>
                {/if}
              </td>
              <td><span class="diff-badge {diffClass[p.diff]}">{p.diff}</span></td>
              <td class="topics-col">
                {#each p.topics as t}
                  <span class="topic-tag">{t}</span>
                {/each}
              </td>
              <td><span class="status-chip {statusClass[p[$currentUser]]}">{statusLabel[p[$currentUser]]}</span></td>
              <td>
                <span class="status-chip {statusClass[p[$currentUser === 'arshita' ? 'shivali' : 'arshita']]}" style="opacity:.7">
                  {statusLabel[p[$currentUser === 'arshita' ? 'shivali' : 'arshita']]}
                </span>
              </td>
              <td class="actions-col">
                <button class="icon-btn" on:click={() => openEdit(p)}>✏</button>
                <button class="icon-btn danger" on:click={() => remove(p.id)}>✕</button>
              </td>
            </tr>
          {/each}
          {#if !filtered.length}
            <tr>
              <td colspan="7" class="empty-row">No problems match your filters</td>
            </tr>
          {/if}
        </tbody>
      </table>
    </div>
  </div>
</div>

{#if showModal}
  <!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
  <div class="modal-overlay" on:click|self={() => showModal = false}>
    <div class="modal fade-up">
      <h2 class="modal-title">{editId ? 'Edit Problem' : 'Log a Problem'}</h2>
      <div class="form-row">
        <div class="form-group" style="flex:3">
          <label class="form-label">Problem Name</label>
          <input class="form-input" bind:value={form.name} placeholder="e.g. Two Sum" />
        </div>
        <div class="form-group" style="flex:1">
          <label class="form-label">Number</label>
          <input class="form-input" bind:value={form.number} placeholder="1" />
        </div>
      </div>
      <div class="form-row">
        <div class="form-group" style="flex:1">
          <label class="form-label">Difficulty</label>
          <select class="form-input" bind:value={form.diff}>
            <option>Easy</option><option>Medium</option><option>Hard</option>
          </select>
        </div>
        <div class="form-group" style="flex:1">
          <label class="form-label">Your Status</label>
          <select class="form-input" bind:value={form.myStatus}>
            <option value="done">✓ Solved</option>
            <option value="review">↻ Need Review</option>
            <option value="todo">– Todo</option>
          </select>
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Topics (comma separated)</label>
        <input class="form-input" bind:value={form.topics} placeholder="Array, Hash Map, Two Pointers" />
      </div>
      <div class="form-group">
        <label class="form-label">Your Notes / Key Insight</label>
        <textarea class="form-input" bind:value={form.myNotes} rows="3" placeholder="What was the trick? What pattern did you apply?"></textarea>
      </div>
      <div class="modal-actions">
        <button class="btn-ghost" on:click={() => showModal = false}>Cancel</button>
        <button class="btn-primary" on:click={save}>Save Problem</button>
      </div>
    </div>
  </div>
{/if}

<style>
  .page { padding: 32px; max-width: 1200px; }
  .page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; }
  .page-title { font-size: 26px; font-weight: 800; letter-spacing: -.5px; color: var(--text); }
  .page-title span { color: var(--accent); }
  .page-sub { font-size: 12px; color: var(--text3); font-family: 'Space Mono', monospace; margin-top: 3px; }
  .header-actions { display: flex; gap: 10px; align-items: center; }

  .filter-select {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: var(--radius-sm); padding: 8px 12px;
    color: var(--text); font-family: 'Inter', sans-serif; font-size: 13px;
    cursor: pointer; outline: none;
  }

  .legend {
    display: flex; gap: 12px; margin-bottom: 16px;
  }
  .legend-user {
    display: flex; align-items: center; gap: 8px;
    padding: 7px 14px; border-radius: 99px;
    border: 1px solid; font-size: 12px; color: var(--text2); font-weight: 500;
    background: var(--surface);
  }
  .leg-av { width: 22px; height: 22px; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 800; font-family: 'Syne', sans-serif; }

  .table-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); overflow: hidden; }
  .table-wrap { overflow-x: auto; }
  table { width: 100%; border-collapse: collapse; }
  th {
    padding: 12px 14px; font-size: 11px; color: var(--text3); text-transform: uppercase;
    letter-spacing: 1.5px; font-family: 'Space Mono', monospace; font-weight: 400;
    border-bottom: 1px solid var(--border); text-align: left;
  }
  td { padding: 13px 14px; border-bottom: 1px solid rgba(255,255,255,.04); vertical-align: middle; }
  tr:last-child td { border-bottom: none; }
  tr:hover td { background: rgba(255,255,255,.015); }

  .num-col { font-family: 'Space Mono', monospace; font-size: 11px; color: var(--text3); white-space: nowrap; }
  .name-col { max-width: 260px; }
  .prob-name { font-size: 13px; font-weight: 600; color: var(--text); }
  .prob-note { font-size: 11px; color: var(--text3); margin-top: 3px; font-style: italic; }
  .topics-col { max-width: 200px; }

  .diff-badge {
    display: inline-block; padding: 2px 9px; border-radius: 99px;
    font-size: 11px; font-weight: 700; font-family: 'Space Mono', monospace; white-space: nowrap;
  }
  .diff-badge.easy { background: var(--accent2-dim); color: var(--accent2); }
  .diff-badge.medium { background: var(--yellow-dim); color: var(--yellow); }
  .diff-badge.hard { background: var(--accent3-dim); color: var(--accent3); }

  .topic-tag {
    display: inline-block; padding: 2px 7px; border-radius: 4px;
    font-size: 10px; background: var(--surface2); color: var(--text3);
    margin: 1px; white-space: nowrap;
  }

  .status-chip {
    display: inline-block; padding: 3px 10px; border-radius: 99px;
    font-size: 11px; font-weight: 600; font-family: 'Space Mono', monospace; white-space: nowrap;
  }
  .status-done { background: var(--accent2-dim); color: var(--accent2); }
  .status-review { background: var(--yellow-dim); color: var(--yellow); }
  .status-todo { background: var(--surface2); color: var(--text3); }

  .actions-col { white-space: nowrap; }
  .icon-btn {
    background: none; border: 1px solid var(--border); border-radius: 6px;
    padding: 4px 8px; cursor: pointer; color: var(--text3); font-size: 12px;
    transition: all .15s; margin-left: 4px;
  }
  .icon-btn:hover { color: var(--text); border-color: var(--border2); }
  .icon-btn.danger:hover { color: var(--accent3); border-color: var(--accent3); }

  .empty-row { text-align: center; color: var(--text3); font-size: 13px; padding: 40px; }

  /* Buttons */
  .btn-primary {
    background: var(--accent); color: var(--bg);
    border: none; border-radius: var(--radius-sm);
    padding: 9px 18px; font-family: 'Syne', sans-serif;
    font-size: 13px; font-weight: 700; cursor: pointer;
    transition: opacity .15s, transform .1s; white-space: nowrap;
  }
  .btn-primary:hover { opacity: .85; transform: translateY(-1px); }
  .btn-ghost {
    background: transparent; border: 1px solid var(--border);
    border-radius: var(--radius-sm); padding: 9px 18px;
    font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 600;
    color: var(--text2); cursor: pointer; transition: all .15s;
  }
  .btn-ghost:hover { border-color: var(--text2); color: var(--text); }

  /* Modal */
  .modal-overlay {
    position: fixed; inset: 0;
    background: rgba(0,0,0,.7); backdrop-filter: blur(6px);
    z-index: 100; display: flex; align-items: center; justify-content: center;
  }
  .modal {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: var(--radius-lg); padding: 28px; width: 500px; max-width: 95vw;
  }
  .modal-title { font-size: 18px; font-weight: 800; color: var(--text); margin-bottom: 20px; }
  .form-row { display: flex; gap: 12px; }
  .form-group { margin-bottom: 14px; flex: 1; }
  .form-label { display: block; font-size: 11px; color: var(--text3); text-transform: uppercase; letter-spacing: 1px; font-family: 'Space Mono', monospace; margin-bottom: 6px; }
  .form-input {
    width: 100%; background: var(--bg); border: 1px solid var(--border);
    border-radius: var(--radius-sm); padding: 9px 12px;
    color: var(--text); font-family: 'Inter', sans-serif; font-size: 13px;
    outline: none; transition: border-color .15s; resize: vertical;
  }
  .form-input:focus { border-color: var(--accent); }
  .modal-actions { display: flex; gap: 10px; justify-content: flex-end; margin-top: 6px; }
</style>
