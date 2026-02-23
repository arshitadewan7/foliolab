<script>
  import { currentUser, users, stats, activity, problems, challenges } from '../stores/state.js'

  $: me = users[$currentUser]
  $: partner = users[$currentUser === 'arshita' ? 'shivali' : 'arshita']
  $: myStats = $stats[$currentUser]
  $: partnerStats = $stats[$currentUser === 'arshita' ? 'shivali' : 'arshita']
  $: myActivity = activity[$currentUser]
  $: activeChallenge = $challenges.find(c => c.status === 'active')

  $: topTopics = (() => {
    const map = {}
    $problems.forEach(p => {
      const status = p[$currentUser]
      if (status === 'done') {
        p.topics.forEach(t => { map[t] = (map[t] || 0) + 1 })
      }
    })
    return Object.entries(map).sort((a,b) => b[1]-a[1]).slice(0,5)
  })()

  $: maxTopic = topTopics.length ? Math.max(...topTopics.map(t => t[1])) : 1

  const topicColors = ['var(--accent)', 'var(--accent2)', 'var(--accent3)', 'var(--yellow)', 'var(--blue)']

  function heatLevel(count) {
    if (!count) return ''
    if (count <= 1) return 'l1'
    if (count <= 2) return 'l2'
    if (count <= 4) return 'l3'
    return 'l4'
  }

  $: heatCells = (() => {
    const cells = []
    for (let i = 69; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i)
      const key = d.toISOString().slice(0,10)
      cells.push({ key, count: myActivity[key] || 0 })
    }
    return cells
  })()

  $: recentSolved = $problems
    .filter(p => p[$currentUser] === 'done')
    .slice(0, 5)
</script>

<div class="page">
  <!-- Header -->
  <div class="page-header">
    <div>
      <h1 class="page-title">Good morning, <span class="name-accent">{me.name}</span> 👋</h1>
      <p class="page-sub">{new Date().toLocaleDateString('en-AU',{weekday:'long',month:'long',day:'numeric'})}</p>
    </div>
    <div class="header-streak">
      <div class="streak-big">{me.streak}</div>
      <div class="streak-lbl">day streak 🔥</div>
    </div>
  </div>

  <!-- VS Banner (active challenge) -->
  {#if activeChallenge}
    <div class="challenge-banner fade-up">
      <div class="cb-pill">⚗ LIVE CHALLENGE</div>
      <div class="cb-content">
        <span class="cb-user" style="color: var(--accent)">Arshita</span>
        <span class="cb-vs">vs</span>
        <span class="cb-user" style="color: var(--accent2)">Shivali</span>
        <span class="cb-sep">—</span>
        <span class="cb-problem">{activeChallenge.problem}</span>
        <span class="cb-diff diff-medium">Medium</span>
      </div>
      <div class="cb-timer">Race in progress ⏱</div>
    </div>
  {/if}

  <!-- Stats row -->
  <div class="stats-row stagger">
    <div class="stat-card fade-up" style="--top: var(--accent)">
      <div class="stat-label">Problems Solved</div>
      <div class="stat-compare">
        <div class="stat-me">
          <span class="stat-val">{myStats.solved}</span>
          <span class="stat-who">{me.name}</span>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-partner">
          <span class="stat-val dim">{partnerStats.solved}</span>
          <span class="stat-who">{partner.name}</span>
        </div>
      </div>
    </div>

    <div class="stat-card fade-up" style="--top: var(--yellow)">
      <div class="stat-label">Hard Problems</div>
      <div class="stat-compare">
        <div class="stat-me">
          <span class="stat-val">{myStats.hard}</span>
          <span class="stat-who">{me.name}</span>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-partner">
          <span class="stat-val dim">{partnerStats.hard}</span>
          <span class="stat-who">{partner.name}</span>
        </div>
      </div>
    </div>

    <div class="stat-card fade-up" style="--top: var(--accent2)">
      <div class="stat-label">Need Review</div>
      <div class="stat-compare">
        <div class="stat-me">
          <span class="stat-val">{myStats.review}</span>
          <span class="stat-who">{me.name}</span>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-partner">
          <span class="stat-val dim">{partnerStats.review}</span>
          <span class="stat-who">{partner.name}</span>
        </div>
      </div>
    </div>

    <div class="stat-card fade-up" style="--top: var(--accent3)">
      <div class="stat-label">Streak</div>
      <div class="stat-compare">
        <div class="stat-me">
          <span class="stat-val">{me.streak}</span>
          <span class="stat-who">{me.name}</span>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-partner">
          <span class="stat-val dim">{partner.streak}</span>
          <span class="stat-who">{partner.name}</span>
        </div>
      </div>
    </div>
  </div>

  <div class="two-col">
    <!-- Heatmap -->
    <div class="card fade-up">
      <div class="card-header">
        <div class="card-title">Activity — Last 70 Days</div>
        <div class="avatar-badge" style="background: {me.avatarColor}18; color: {me.avatarColor}">{me.avatar}</div>
      </div>
      <div class="heatmap">
        {#each heatCells as cell}
          <div class="hcell {heatLevel(cell.count)}" title="{cell.key}: {cell.count} solved"></div>
        {/each}
      </div>
      <div class="heatmap-legend">
        <span>Less</span>
        <div class="hcell"></div>
        <div class="hcell l1"></div>
        <div class="hcell l2"></div>
        <div class="hcell l3"></div>
        <div class="hcell l4"></div>
        <span>More</span>
      </div>
    </div>

    <!-- Topic coverage -->
    <div class="card fade-up">
      <div class="card-header">
        <div class="card-title">Your Topic Coverage</div>
      </div>
      {#if topTopics.length}
        {#each topTopics as [topic, count], i}
          <div class="prog-row">
            <div class="prog-label">
              <span>{topic}</span>
              <span class="mono" style="color: {topicColors[i]}">{count}</span>
            </div>
            <div class="prog-track">
              <div class="prog-fill" style="width:{(count/maxTopic*100).toFixed(0)}%; background:{topicColors[i]}"></div>
            </div>
          </div>
        {/each}
      {:else}
        <p style="color:var(--text3); font-size:13px;">Solve problems to see coverage</p>
      {/if}
    </div>
  </div>

  <!-- Difficulty split -->
  <div class="card fade-up" style="margin-top: 16px;">
    <div class="card-header">
      <div class="card-title">Difficulty Split</div>
    </div>
    <div class="diff-row">
      {#each [{label:'Easy', val: myStats.easy, color:'var(--accent2)'}, {label:'Medium', val: myStats.medium, color:'var(--yellow)'}, {label:'Hard', val: myStats.hard, color:'var(--accent3)'}] as d}
        <div class="diff-block">
          <div class="diff-num" style="color:{d.color}">{d.val}</div>
          <div class="diff-bar-track">
            <div class="diff-bar-fill" style="height:{myStats.solved ? (d.val/myStats.solved*100).toFixed(0) : 0}%; background:{d.color}"></div>
          </div>
          <div class="diff-lbl">{d.label}</div>
        </div>
      {/each}
    </div>
  </div>
</div>

<style>
  .page { padding: 32px; max-width: 1100px; }

  .page-header {
    display: flex; justify-content: space-between; align-items: flex-start;
    margin-bottom: 24px;
  }
  .page-title {
    font-size: 26px; font-weight: 800; letter-spacing: -.5px;
    color: var(--text); margin-bottom: 4px;
  }
  .name-accent { color: var(--accent); }
  .page-sub { font-size: 13px; color: var(--text3); font-family: 'Space Mono', monospace; }

  .header-streak {
    text-align: center;
    background: var(--surface2); border: 1px solid var(--border);
    border-radius: var(--radius); padding: 12px 20px;
  }
  .streak-big {
    font-family: 'Space Mono', monospace; font-size: 30px; font-weight: 700;
    color: var(--accent3); line-height: 1;
  }
  .streak-lbl { font-size: 11px; color: var(--text3); margin-top: 2px; }

  /* Challenge banner */
  .challenge-banner {
    background: linear-gradient(135deg, rgba(167,139,250,.08), rgba(52,211,153,.06));
    border: 1px solid rgba(167,139,250,.25);
    border-radius: var(--radius);
    padding: 14px 18px;
    display: flex; align-items: center; gap: 14px;
    margin-bottom: 24px; flex-wrap: wrap;
  }
  .cb-pill {
    background: var(--accent3-dim); color: var(--accent3);
    font-size: 10px; font-weight: 700; font-family: 'Space Mono', monospace;
    padding: 3px 9px; border-radius: 99px; letter-spacing: .5px;
    animation: pulse 2s infinite; flex-shrink: 0;
  }
  .cb-content { display: flex; align-items: center; gap: 8px; flex: 1; flex-wrap: wrap; }
  .cb-user { font-weight: 700; font-size: 14px; }
  .cb-vs { font-size: 11px; color: var(--text3); font-family: 'Space Mono', monospace; }
  .cb-sep { color: var(--text3); }
  .cb-problem { font-size: 14px; color: var(--text); font-weight: 500; }
  .cb-diff {
    font-size: 11px; font-family: 'Space Mono', monospace; font-weight: 700;
    padding: 2px 8px; border-radius: 99px;
  }
  .diff-medium { background: var(--yellow-dim); color: var(--yellow); }
  .cb-timer { font-size: 12px; color: var(--text3); font-family: 'Space Mono', monospace; }

  /* Stats */
  .stats-row { display: grid; grid-template-columns: repeat(4,1fr); gap: 14px; margin-bottom: 16px; }
  .stat-card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: var(--radius); padding: 18px;
    position: relative; overflow: hidden;
  }
  .stat-card::before {
    content:''; position:absolute; top:0; left:0; right:0; height:2px;
    background: var(--top);
  }
  .stat-label { font-size: 11px; color: var(--text3); text-transform: uppercase; letter-spacing: 1.5px; font-family: 'Space Mono', monospace; margin-bottom: 12px; }
  .stat-compare { display: flex; align-items: center; gap: 12px; }
  .stat-me, .stat-partner { flex: 1; text-align: center; }
  .stat-val { font-family: 'Space Mono', monospace; font-size: 26px; font-weight: 700; color: var(--text); display: block; line-height: 1; }
  .stat-val.dim { color: var(--text3); font-size: 22px; }
  .stat-who { font-size: 10px; color: var(--text3); margin-top: 3px; display: block; }
  .stat-divider { width: 1px; height: 36px; background: var(--border); }

  /* Cards */
  .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: var(--radius); padding: 20px;
  }
  .card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px; }
  .card-title { font-size: 13px; font-weight: 700; color: var(--text2); text-transform: uppercase; letter-spacing: 1px; font-family: 'Space Mono', monospace; }
  .avatar-badge {
    width: 26px; height: 26px; border-radius: 7px;
    display: flex; align-items: center; justify-content: center;
    font-size: 11px; font-weight: 800; font-family: 'Syne', sans-serif;
  }

  /* Heatmap */
  .heatmap { display: flex; flex-wrap: wrap; gap: 3px; }
  .hcell {
    width: 13px; height: 13px; border-radius: 3px;
    background: var(--surface2);
    transition: transform .1s;
    cursor: default;
  }
  .hcell:hover { transform: scale(1.4); }
  .hcell.l1 { background: rgba(167,139,250,.2); }
  .hcell.l2 { background: rgba(167,139,250,.45); }
  .hcell.l3 { background: rgba(167,139,250,.7); }
  .hcell.l4 { background: var(--accent); }
  .heatmap-legend {
    display: flex; align-items: center; gap: 4px;
    margin-top: 12px; font-size: 11px; color: var(--text3);
  }

  /* Progress */
  .prog-row { margin-bottom: 12px; }
  .prog-label { display: flex; justify-content: space-between; font-size: 12px; color: var(--text2); margin-bottom: 5px; }
  .prog-track { height: 5px; background: var(--surface2); border-radius: 99px; overflow: hidden; }
  .prog-fill { height: 100%; border-radius: 99px; transition: width .6s cubic-bezier(.4,0,.2,1); }

  /* Diff split */
  .diff-row { display: flex; gap: 24px; align-items: flex-end; justify-content: center; padding: 8px 0; }
  .diff-block { display: flex; flex-direction: column; align-items: center; gap: 8px; }
  .diff-num { font-family: 'Space Mono', monospace; font-size: 24px; font-weight: 700; }
  .diff-bar-track { width: 40px; height: 80px; background: var(--surface2); border-radius: 6px; overflow: hidden; display: flex; align-items: flex-end; }
  .diff-bar-fill { width: 100%; border-radius: 6px; transition: height .6s ease; min-height: 4px; }
  .diff-lbl { font-size: 11px; color: var(--text3); font-family: 'Space Mono', monospace; }
</style>
