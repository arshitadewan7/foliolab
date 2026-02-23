<script>
  import { tasks, currentUser, users } from '../stores/state.js'

  $: me = users[$currentUser]
  $: partner = users[$currentUser === 'arshita' ? 'shivali' : 'arshita']

  const days = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday']
  const todayName = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'][new Date().getDay()]

  $: cols = {
    todo: $tasks.filter(t => t.col === 'todo'),
    doing: $tasks.filter(t => t.col === 'doing'),
    done: $tasks.filter(t => t.col === 'done'),
  }

  let showModal = false
  let form = { title: '', priority: 'med', col: 'todo', day: '', owner: 'both' }

  function openAdd(col = 'todo') {
    form = { title: '', priority: 'med', col, day: '', owner: $currentUser }
    showModal = true
  }

  function save() {
    if (!form.title.trim()) return
    tasks.update(ts => [...ts, { id: Date.now(), ...form }])
    showModal = false
  }

  function move(id, col) {
    tasks.update(ts => ts.map(t => t.id === id ? { ...t, col } : t))
  }

  function remove(id) {
    tasks.update(ts => ts.filter(t => t.id !== id))
  }

  function ownerColor(owner) {
    if (owner === 'arshita') return users.arshita.avatarColor
    if (owner === 'shivali') return users.shivali.avatarColor
    return 'var(--text3)'
  }
  function ownerLabel(owner) {
    if (owner === 'arshita') return users.arshita.avatar
    if (owner === 'shivali') return users.shivali.avatar
    return '👥'
  }

  const prioColor = { high: 'var(--accent3)', med: 'var(--yellow)', low: 'var(--blue)' }
  const prioLabel = { high: 'High', med: 'Med', low: 'Low' }
</script>

<div class="page">
  <div class="page-header">
    <div>
      <h1 class="page-title">Sprint <span>Planner</span></h1>
      <p class="page-sub">Shared board — {$tasks.length} tasks across the sprint</p>
    </div>
    <button class="btn-primary" on:click={() => openAdd()}>+ Add Task</button>
  </div>

  <!-- Week grid -->
  <div class="section-label">THIS WEEK</div>
  <div class="week-grid fade-up">
    {#each days as day}
      {@const dayTasks = $tasks.filter(t => t.day === day)}
      <div class="day-col" class:today={day === todayName}>
        <div class="day-name">{day.slice(0,3).toUpperCase()}</div>
        {#each dayTasks as t}
          <div class="day-task" style="border-left-color: {prioColor[t.priority]}">
            <span class="day-task-owner" style="background:{ownerColor(t.owner)}18;color:{ownerColor(t.owner)}">{ownerLabel(t.owner)}</span>
            {t.title}
          </div>
        {/each}
        {#if !dayTasks.length}
          <div class="day-empty">—</div>
        {/if}
      </div>
    {/each}
  </div>

  <!-- Kanban -->
  <div class="section-label" style="margin-top: 28px;">KANBAN BOARD</div>
  <div class="kanban fade-up">
    {#each [
      { key: 'todo', label: 'Backlog', color: 'var(--text3)' },
      { key: 'doing', label: 'In Progress', color: 'var(--blue)' },
      { key: 'done', label: 'Done', color: 'var(--accent2)' },
    ] as col}
      <div class="kanban-col">
        <div class="col-header">
          <span class="col-dot" style="background:{col.color}"></span>
          <span class="col-title" style="color:{col.color}">{col.label}</span>
          <span class="col-count">{cols[col.key].length}</span>
        </div>

        <div class="col-tasks">
          {#each cols[col.key] as t (t.id)}
            <div class="task-card">
              <div class="task-header">
                <span class="task-title">{t.title}</span>
                <button class="icon-btn-sm danger" on:click={() => remove(t.id)}>✕</button>
              </div>
              <div class="task-meta">
                <span class="prio-badge" style="background:{prioColor[t.priority]}18;color:{prioColor[t.priority]}">{prioLabel[t.priority]}</span>
                {#if t.day}<span class="day-tag">{t.day.slice(0,3)}</span>{/if}
                <span class="owner-chip" style="background:{ownerColor(t.owner)}18;color:{ownerColor(t.owner)}">{ownerLabel(t.owner)}</span>
              </div>
              <div class="task-actions">
                {#if col.key !== 'doing'}<button class="move-btn" on:click={() => move(t.id, 'doing')}>→ Doing</button>{/if}
                {#if col.key !== 'done'}<button class="move-btn done" on:click={() => move(t.id, 'done')}>✓ Done</button>{/if}
                {#if col.key !== 'todo'}<button class="move-btn" on:click={() => move(t.id, 'todo')}>← Back</button>{/if}
              </div>
            </div>
          {/each}
        </div>

        <button class="add-task-btn" on:click={() => openAdd(col.key)}>+ Add task</button>
      </div>
    {/each}
  </div>
</div>

{#if showModal}
  <!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
  <div class="modal-overlay" on:click|self={() => showModal = false}>
    <div class="modal fade-up">
      <h2 class="modal-title">Add Task</h2>
      <div class="form-group">
        <label class="form-label">Task</label>
        <input class="form-input" bind:value={form.title} placeholder="e.g. Solve 5 DP problems" />
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Priority</label>
          <select class="form-input" bind:value={form.priority}>
            <option value="high">🔴 High</option>
            <option value="med">🟡 Medium</option>
            <option value="low">🔵 Low</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Column</label>
          <select class="form-input" bind:value={form.col}>
            <option value="todo">Backlog</option>
            <option value="doing">In Progress</option>
            <option value="done">Done</option>
          </select>
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Day</label>
          <select class="form-input" bind:value={form.day}>
            <option value="">No specific day</option>
            {#each days as d}<option>{d}</option>{/each}
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Owner</label>
          <select class="form-input" bind:value={form.owner}>
            <option value="arshita">Arshita</option>
            <option value="shivali">Shivali</option>
            <option value="both">Both 👥</option>
          </select>
        </div>
      </div>
      <div class="modal-actions">
        <button class="btn-ghost" on:click={() => showModal = false}>Cancel</button>
        <button class="btn-primary" on:click={save}>Add Task</button>
      </div>
    </div>
  </div>
{/if}

<style>
  .page { padding: 32px; max-width: 1200px; }
  .page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; }
  .page-title { font-size: 26px; font-weight: 800; letter-spacing: -.5px; color: var(--text); }
  .page-title span { color: var(--accent); }
  .page-sub { font-size: 12px; color: var(--text3); font-family: 'Space Mono', monospace; margin-top: 3px; }

  .section-label { font-size: 11px; color: var(--text3); text-transform: uppercase; letter-spacing: 2px; font-family: 'Space Mono', monospace; margin-bottom: 12px; }

  /* Week grid */
  .week-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 10px; margin-bottom: 8px; }
  .day-col {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: var(--radius); padding: 12px 10px; min-height: 110px;
  }
  .day-col.today { border-color: rgba(167,139,250,.4); background: var(--accent-dim); }
  .day-name {
    font-size: 10px; font-weight: 700; color: var(--text3);
    font-family: 'Space Mono', monospace; letter-spacing: 1px; margin-bottom: 8px;
  }
  .day-col.today .day-name { color: var(--accent); }
  .day-task {
    font-size: 11px; color: var(--text); background: var(--surface2);
    border-left: 2px solid; border-radius: 4px;
    padding: 4px 6px; margin-bottom: 4px;
    display: flex; align-items: center; gap: 5px;
    line-height: 1.3;
  }
  .day-task-owner {
    width: 18px; height: 18px; border-radius: 4px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    font-size: 9px; font-weight: 800; font-family: 'Syne', sans-serif;
  }
  .day-empty { font-size: 11px; color: var(--text3); text-align: center; margin-top: 16px; }

  /* Kanban */
  .kanban { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
  .kanban-col { display: flex; flex-direction: column; }
  .col-header { display: flex; align-items: center; gap: 8px; margin-bottom: 12px; }
  .col-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
  .col-title { font-size: 13px; font-weight: 700; font-family: 'Space Mono', monospace; flex: 1; }
  .col-count {
    background: var(--surface2); border: 1px solid var(--border);
    border-radius: 99px; padding: 1px 8px;
    font-size: 11px; color: var(--text3); font-family: 'Space Mono', monospace;
  }
  .col-tasks { display: flex; flex-direction: column; gap: 8px; min-height: 80px; }

  .task-card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: var(--radius); padding: 14px;
    transition: border-color .15s, transform .1s, box-shadow .15s;
  }
  .task-card:hover {
    border-color: var(--border2); transform: translateY(-1px);
    box-shadow: var(--shadow);
  }
  .task-header { display: flex; justify-content: space-between; align-items: flex-start; gap: 8px; margin-bottom: 10px; }
  .task-title { font-size: 13px; font-weight: 600; color: var(--text); line-height: 1.3; }
  .icon-btn-sm {
    background: none; border: none; cursor: pointer;
    color: var(--text3); font-size: 11px; padding: 2px 5px;
    border-radius: 4px; transition: all .15s; flex-shrink: 0;
  }
  .icon-btn-sm.danger:hover { color: var(--accent3); background: var(--accent3-dim); }

  .task-meta { display: flex; gap: 6px; align-items: center; flex-wrap: wrap; margin-bottom: 10px; }
  .prio-badge { font-size: 10px; padding: 2px 7px; border-radius: 99px; font-family: 'Space Mono', monospace; font-weight: 700; }
  .day-tag { font-size: 10px; padding: 2px 7px; border-radius: 99px; background: var(--surface2); color: var(--text3); font-family: 'Space Mono', monospace; }
  .owner-chip { width: 20px; height: 20px; border-radius: 5px; display: flex; align-items: center; justify-content: center; font-size: 9px; font-weight: 800; font-family: 'Syne', sans-serif; }

  .task-actions { display: flex; gap: 6px; }
  .move-btn {
    background: var(--surface2); border: 1px solid var(--border);
    border-radius: 5px; padding: 3px 9px; font-size: 11px;
    color: var(--text3); cursor: pointer; font-family: 'Space Mono', monospace;
    transition: all .15s;
  }
  .move-btn:hover { color: var(--text); border-color: var(--border2); }
  .move-btn.done:hover { color: var(--accent2); border-color: var(--accent2); }

  .add-task-btn {
    width: 100%; background: transparent; border: 1px dashed var(--border);
    border-radius: var(--radius-sm); padding: 10px; color: var(--text3);
    cursor: pointer; font-size: 12px; font-family: 'Inter', sans-serif;
    transition: all .15s; margin-top: 8px;
  }
  .add-task-btn:hover { border-color: var(--accent); color: var(--accent); }

  /* Reused */
  .btn-primary { background: var(--accent); color: var(--bg); border: none; border-radius: var(--radius-sm); padding: 9px 18px; font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 700; cursor: pointer; transition: opacity .15s; }
  .btn-primary:hover { opacity: .85; }
  .btn-ghost { background: transparent; border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 9px 18px; font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 600; color: var(--text2); cursor: pointer; }
  .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,.7); backdrop-filter: blur(6px); z-index: 100; display: flex; align-items: center; justify-content: center; }
  .modal { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 28px; width: 460px; max-width: 95vw; }
  .modal-title { font-size: 18px; font-weight: 800; color: var(--text); margin-bottom: 20px; }
  .form-row { display: flex; gap: 12px; }
  .form-group { margin-bottom: 14px; flex: 1; }
  .form-label { display: block; font-size: 11px; color: var(--text3); text-transform: uppercase; letter-spacing: 1px; font-family: 'Space Mono', monospace; margin-bottom: 6px; }
  .form-input { width: 100%; background: var(--bg); border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 9px 12px; color: var(--text); font-family: 'Inter', sans-serif; font-size: 13px; outline: none; transition: border-color .15s; }
  .form-input:focus { border-color: var(--accent); }
  .modal-actions { display: flex; gap: 10px; justify-content: flex-end; margin-top: 6px; }
</style>
