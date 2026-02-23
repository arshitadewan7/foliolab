<script>
  import { companies, currentUser, users } from '../stores/state.js'

  $: me = users[$currentUser]
  $: partner = users[$currentUser === 'arshita' ? 'shivali' : 'arshita']
  $: myCompanies = $companies.filter(c => c.owner === $currentUser)
  $: partnerCompanies = $companies.filter(c => c.owner !== $currentUser)

  const stageLabels = ['Applied', 'OA / Phone', 'Technical', 'Final Round', 'Offer 🎉']
  const stageColors = ['var(--text3)', 'var(--blue)', 'var(--yellow)', 'var(--accent)', 'var(--accent2)']

  let showModal = false
  let form = { name: '', role: '', stage: 0, notes: '', deadline: '' }

  function openAdd() {
    form = { name: '', role: '', stage: 0, notes: '', deadline: '' }
    showModal = true
  }

  function save() {
    if (!form.name.trim()) return
    companies.update(cs => [...cs, { id: Date.now(), ...form, stage: parseInt(form.stage), owner: $currentUser }])
    showModal = false
  }

  function remove(id) {
    companies.update(cs => cs.filter(c => c.id !== id))
  }

  function advanceStage(id) {
    companies.update(cs => cs.map(c => c.id === id && c.stage < 4 ? { ...c, stage: c.stage + 1 } : c))
  }
</script>

<div class="page">
  <div class="page-header">
    <div>
      <h1 class="page-title">Company <span>Tracker</span></h1>
      <p class="page-sub">{$companies.length} companies total — {myCompanies.length} yours, {partnerCompanies.length} {partner.name}'s</p>
    </div>
    <button class="btn-primary" on:click={openAdd}>+ Add Company</button>
  </div>

  <!-- My pipeline -->
  <div class="section-header fade-up">
    <div class="avatar-inline" style="background:{me.avatarColor}18;color:{me.avatarColor}">{me.avatar}</div>
    <span>{me.name}'s Pipeline</span>
    <span class="count-badge">{myCompanies.length}</span>
  </div>

  {#if myCompanies.length}
    <div class="company-grid fade-up">
      {#each myCompanies as c (c.id)}
        <div class="company-card">
          <div class="cc-top">
            <div class="cc-name">{c.name}</div>
            <button class="icon-btn-sm danger" on:click={() => remove(c.id)}>✕</button>
          </div>
          <div class="cc-role">{c.role}</div>

          <div class="stage-track">
            {#each stageLabels as _, i}
              <div class="stage-pip" class:active={i === c.stage} class:done={i < c.stage}
                style={i <= c.stage ? `--sc: ${stageColors[c.stage]}` : ''}></div>
            {/each}
          </div>

          <div class="cc-stage-label" style="color:{stageColors[c.stage]}">{stageLabels[c.stage]}</div>

          {#if c.notes}
            <div class="cc-notes">{c.notes}</div>
          {/if}

          <div class="cc-footer">
            {#if c.deadline}<span class="deadline-badge">📅 {c.deadline}</span>{/if}
            {#if c.stage < 4}
              <button class="advance-btn" on:click={() => advanceStage(c.id)}>Advance stage →</button>
            {:else}
              <span class="offer-badge">🎉 Offer received!</span>
            {/if}
          </div>
        </div>
      {/each}
    </div>
  {:else}
    <div class="empty-state">No companies tracked yet. Start applying!</div>
  {/if}

  <!-- Partner pipeline -->
  <div class="section-header fade-up" style="margin-top: 32px;">
    <div class="avatar-inline" style="background:{partner.avatarColor}18;color:{partner.avatarColor}">{partner.avatar}</div>
    <span>{partner.name}'s Pipeline</span>
    <span class="count-badge">{partnerCompanies.length}</span>
  </div>

  {#if partnerCompanies.length}
    <div class="company-grid fade-up">
      {#each partnerCompanies as c (c.id)}
        <div class="company-card partner-card">
          <div class="cc-top">
            <div class="cc-name">{c.name}</div>
          </div>
          <div class="cc-role">{c.role}</div>
          <div class="stage-track">
            {#each stageLabels as _, i}
              <div class="stage-pip" class:active={i === c.stage} class:done={i < c.stage}
                style={i <= c.stage ? `--sc: ${stageColors[c.stage]}` : ''}></div>
            {/each}
          </div>
          <div class="cc-stage-label" style="color:{stageColors[c.stage]}">{stageLabels[c.stage]}</div>
          {#if c.deadline}<div style="margin-top:10px;"><span class="deadline-badge">📅 {c.deadline}</span></div>{/if}
        </div>
      {/each}
    </div>
  {:else}
    <div class="empty-state">{partner.name} hasn't tracked any companies yet</div>
  {/if}
</div>

{#if showModal}
  <!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
  <div class="modal-overlay" on:click|self={() => showModal = false}>
    <div class="modal fade-up">
      <h2 class="modal-title">Track a Company</h2>
      <div class="form-row">
        <div class="form-group" style="flex:2">
          <label class="form-label">Company</label>
          <input class="form-input" bind:value={form.name} placeholder="e.g. Google" />
        </div>
        <div class="form-group" style="flex:1">
          <label class="form-label">Deadline</label>
          <input class="form-input" bind:value={form.deadline} placeholder="Mar 15" />
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Role</label>
        <input class="form-input" bind:value={form.role} placeholder="Software Engineer Intern" />
      </div>
      <div class="form-group">
        <label class="form-label">Current Stage</label>
        <select class="form-input" bind:value={form.stage}>
          {#each stageLabels as label, i}
            <option value={i}>{label}</option>
          {/each}
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Notes</label>
        <textarea class="form-input" bind:value={form.notes} rows="2" placeholder="Recruiter name, tips, deadlines..."></textarea>
      </div>
      <div class="modal-actions">
        <button class="btn-ghost" on:click={() => showModal = false}>Cancel</button>
        <button class="btn-primary" on:click={save}>Save</button>
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

  .section-header {
    display: flex; align-items: center; gap: 10px;
    margin-bottom: 16px; font-size: 14px; font-weight: 700; color: var(--text2);
  }
  .avatar-inline {
    width: 26px; height: 26px; border-radius: 7px;
    display: flex; align-items: center; justify-content: center;
    font-size: 10px; font-weight: 800; font-family: 'Syne', sans-serif;
  }
  .count-badge {
    background: var(--surface2); border: 1px solid var(--border);
    border-radius: 99px; padding: 1px 8px; font-size: 11px; color: var(--text3);
    font-family: 'Space Mono', monospace;
  }

  .company-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 14px; }

  .company-card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: var(--radius); padding: 18px;
    transition: border-color .15s, transform .1s;
  }
  .company-card:hover { transform: translateY(-2px); box-shadow: var(--shadow); }
  .company-card.partner-card { opacity: .8; }

  .cc-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2px; }
  .cc-name { font-size: 16px; font-weight: 800; color: var(--text); }
  .cc-role { font-size: 12px; color: var(--accent); font-family: 'Space Mono', monospace; margin-bottom: 14px; }
  .cc-notes { font-size: 11px; color: var(--text3); margin-top: 8px; line-height: 1.5; }

  .stage-track { display: flex; gap: 4px; margin-bottom: 8px; }
  .stage-pip {
    flex: 1; height: 4px; border-radius: 99px;
    background: var(--surface2); transition: background .3s;
  }
  .stage-pip.done { background: var(--sc, var(--accent)); opacity: .5; }
  .stage-pip.active { background: var(--sc, var(--accent)); }

  .cc-stage-label { font-size: 11px; font-weight: 700; font-family: 'Space Mono', monospace; }

  .cc-footer { display: flex; justify-content: space-between; align-items: center; margin-top: 12px; flex-wrap: wrap; gap: 8px; }
  .deadline-badge { font-size: 11px; color: var(--text3); }
  .advance-btn {
    background: none; border: 1px solid var(--border);
    border-radius: 5px; padding: 4px 10px;
    font-size: 11px; color: var(--text3); cursor: pointer;
    font-family: 'Space Mono', monospace; transition: all .15s;
  }
  .advance-btn:hover { color: var(--accent2); border-color: var(--accent2); }
  .offer-badge { font-size: 12px; font-weight: 700; color: var(--accent2); }

  .empty-state { font-size: 13px; color: var(--text3); padding: 20px 0; }

  .icon-btn-sm { background: none; border: none; cursor: pointer; color: var(--text3); font-size: 11px; padding: 2px 5px; border-radius: 4px; transition: all .15s; }
  .icon-btn-sm.danger:hover { color: var(--accent3); }

  .btn-primary { background: var(--accent); color: var(--bg); border: none; border-radius: var(--radius-sm); padding: 9px 18px; font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 700; cursor: pointer; transition: opacity .15s; }
  .btn-primary:hover { opacity: .85; }
  .btn-ghost { background: transparent; border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 9px 18px; font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 600; color: var(--text2); cursor: pointer; }
  .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,.7); backdrop-filter: blur(6px); z-index: 100; display: flex; align-items: center; justify-content: center; }
  .modal { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 28px; width: 460px; max-width: 95vw; }
  .modal-title { font-size: 18px; font-weight: 800; color: var(--text); margin-bottom: 20px; }
  .form-row { display: flex; gap: 12px; }
  .form-group { margin-bottom: 14px; flex: 1; }
  .form-label { display: block; font-size: 11px; color: var(--text3); text-transform: uppercase; letter-spacing: 1px; font-family: 'Space Mono', monospace; margin-bottom: 6px; }
  .form-input { width: 100%; background: var(--bg); border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 9px 12px; color: var(--text); font-family: 'Inter', sans-serif; font-size: 13px; outline: none; transition: border-color .15s; resize: vertical; }
  .form-input:focus { border-color: var(--accent); }
  .modal-actions { display: flex; gap: 10px; justify-content: flex-end; margin-top: 6px; }
</style>
