import { writable, derived } from 'svelte/store'

// ── Theme ──────────────────────────────────────────────────────────────────
export const theme = writable('dark')
theme.subscribe(t => {
  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('data-theme', t)
  }
})

// ── Current User (mock auth) ───────────────────────────────────────────────
export const currentUser = writable('arshita')

// ── Users ─────────────────────────────────────────────────────────────────
export const users = {
  arshita: {
    id: 'arshita',
    name: 'Arshita',
    username: 'arshita-dev',
    avatar: 'AR',
    avatarColor: '#a78bfa',
    streak: 12,
    lastActive: 'Just now',
    bio: 'Grinding toward FAANG 🚀',
  },
  shivali: {
    id: 'shivali',
    name: 'Shivali',
    username: 'shivali-codes',
    avatar: 'SH',
    avatarColor: '#34d399',
    streak: 9,
    lastActive: '2h ago',
    bio: 'SWE @ your future company 💚',
  },
}

// ── Current page ──────────────────────────────────────────────────────────
export const currentPage = writable('dashboard')

// ── Problems ──────────────────────────────────────────────────────────────
export const problems = writable([
  { id: 1, name: 'Two Sum', number: 1, diff: 'Easy', topics: ['Array', 'Hash Map'], arshita: 'done', shivali: 'done', arshitaNotes: 'Classic O(n) with hashmap', shivaliNotes: 'Brute force first, then optimize', link: 'https://leetcode.com/problems/two-sum/' },
  { id: 2, name: 'Longest Substring Without Repeating Characters', number: 3, diff: 'Medium', topics: ['Sliding Window', 'Hash Map'], arshita: 'done', shivali: 'review', arshitaNotes: 'Two pointer shrink window on duplicate', shivaliNotes: 'Keep revisiting the edge cases', link: '' },
  { id: 3, name: 'Median of Two Sorted Arrays', number: 4, diff: 'Hard', topics: ['Binary Search', 'Array'], arshita: 'review', shivali: 'todo', arshitaNotes: 'Binary search on smaller array', shivaliNotes: '', link: '' },
  { id: 4, name: 'Container With Most Water', number: 11, diff: 'Medium', topics: ['Two Pointers', 'Greedy'], arshita: 'done', shivali: 'done', arshitaNotes: 'Move the smaller height pointer inward', shivaliNotes: 'O(n) two pointer, very clean', link: '' },
  { id: 5, name: 'Valid Parentheses', number: 20, diff: 'Easy', topics: ['Stack', 'String'], arshita: 'done', shivali: 'done', arshitaNotes: 'Stack push open, pop and match close', shivaliNotes: 'Easy once you see the stack pattern', link: '' },
  { id: 6, name: 'Merge K Sorted Lists', number: 23, diff: 'Hard', topics: ['Heap', 'Linked List', 'Divide & Conquer'], arshita: 'todo', shivali: 'todo', arshitaNotes: '', shivaliNotes: '', link: '' },
  { id: 7, name: 'Jump Game', number: 55, diff: 'Medium', topics: ['Greedy', 'DP'], arshita: 'done', shivali: 'review', arshitaNotes: 'Track max reachable index', shivaliNotes: 'Think greedy over DP here', link: '' },
  { id: 8, name: 'Climbing Stairs', number: 70, diff: 'Easy', topics: ['DP', 'Math'], arshita: 'done', shivali: 'done', arshitaNotes: 'Fibonacci in disguise', shivaliNotes: 'f(n) = f(n-1) + f(n-2)', link: '' },
  { id: 9, name: 'Word Search', number: 79, diff: 'Medium', topics: ['Backtracking', 'DFS'], arshita: 'review', shivali: 'todo', arshitaNotes: 'DFS + visited matrix, mark and unmark', shivaliNotes: '', link: '' },
  { id: 10, name: 'Binary Tree Level Order Traversal', number: 102, diff: 'Medium', topics: ['BFS', 'Tree'], arshita: 'done', shivali: 'done', arshitaNotes: 'BFS queue, snapshot size at each level', shivaliNotes: 'Queue based, very intuitive', link: '' },
  { id: 11, name: 'Maximum Depth of Binary Tree', number: 104, diff: 'Easy', topics: ['DFS', 'Tree'], arshita: 'done', shivali: 'done', arshitaNotes: '1 + max(left, right)', shivaliNotes: 'Simple recursion', link: '' },
  { id: 12, name: 'LRU Cache', number: 146, diff: 'Hard', topics: ['Hash Map', 'Linked List'], arshita: 'review', shivali: 'todo', arshitaNotes: 'OrderedDict or doubly linked list + map', shivaliNotes: '', link: '' },
])

// ── Tasks / Planner ────────────────────────────────────────────────────────
export const tasks = writable([
  { id: 1, title: 'Solve 5 DP problems', priority: 'high', col: 'doing', day: 'Monday', owner: 'arshita' },
  { id: 2, title: 'Review sliding window patterns', priority: 'high', col: 'todo', day: 'Tuesday', owner: 'shivali' },
  { id: 3, title: 'Mock interview with Shivali', priority: 'high', col: 'todo', day: 'Wednesday', owner: 'both' },
  { id: 4, title: 'Apply to 10 companies', priority: 'med', col: 'doing', day: 'Thursday', owner: 'arshita' },
  { id: 5, title: 'Revise system design basics', priority: 'med', col: 'todo', day: 'Friday', owner: 'both' },
  { id: 6, title: 'Finish Blind 75 easy problems', priority: 'low', col: 'done', day: '', owner: 'shivali' },
  { id: 7, title: 'Update resume with latest projects', priority: 'high', col: 'done', day: '', owner: 'arshita' },
  { id: 8, title: 'Graph traversal practice', priority: 'med', col: 'todo', day: 'Saturday', owner: 'both' },
])

// ── Companies ─────────────────────────────────────────────────────────────
export const companies = writable([
  { id: 1, name: 'Google', role: 'SWE Intern', stage: 2, owner: 'arshita', notes: 'OA done, waiting for technical round', deadline: 'Mar 15' },
  { id: 2, name: 'Microsoft', role: 'SWE New Grad', stage: 1, owner: 'arshita', notes: 'Phone screen scheduled', deadline: 'Mar 10' },
  { id: 3, name: 'Atlassian', role: 'Graduate Engineer', stage: 3, owner: 'arshita', notes: 'Final round on Friday!', deadline: 'Mar 8' },
  { id: 4, name: 'Canva', role: 'SWE Intern', stage: 2, owner: 'shivali', notes: 'Technical round next week', deadline: 'Mar 12' },
  { id: 5, name: 'Atlassian', role: 'SWE Intern', stage: 1, owner: 'shivali', notes: 'Applied via referral', deadline: 'Mar 20' },
  { id: 6, name: 'Airwallex', role: 'SWE New Grad', stage: 0, owner: 'shivali', notes: 'Just applied', deadline: 'Mar 25' },
  { id: 7, name: 'Stripe', role: 'SWE Intern', stage: 0, owner: 'arshita', notes: '', deadline: 'Mar 30' },
])

// ── Notes ─────────────────────────────────────────────────────────────────
export const notes = writable([
  { id: 1, title: 'Sliding Window Cheatsheet', body: 'Use when asked for subarray/substring with a condition.\n\n1. Expand right pointer\n2. While condition violated, shrink left\n3. Track max/min window size\n\nTime: O(n), Space: O(1) or O(k)', author: 'arshita', date: 'Feb 20', pinned: true },
  { id: 2, title: 'Binary Search Template', body: 'lo, hi = 0, len(arr)-1\nwhile lo <= hi:\n  mid = (lo+hi)//2\n  if arr[mid] == target: return mid\n  elif arr[mid] < target: lo = mid+1\n  else: hi = mid-1\nreturn -1', author: 'shivali', date: 'Feb 19', pinned: true },
  { id: 3, title: 'Graph DFS vs BFS', body: 'DFS: recursion/stack, good for paths, cycles, connected components\nBFS: queue, good for shortest path, level order\n\nBoth: O(V+E)', author: 'arshita', date: 'Feb 18', pinned: false },
  { id: 4, title: 'Interview Mindset 🧠', body: 'Talk through your thinking out loud\nAsk clarifying questions first\nStart with brute force, then optimize\nTest with edge cases: empty, single element, duplicates\n\nRemember: they want to see how you think!', author: 'shivali', date: 'Feb 17', pinned: false },
  { id: 5, title: 'DP Framework', body: '1. Define subproblem\n2. Find recurrence relation\n3. Identify base cases\n4. Decide top-down (memo) or bottom-up (tabulation)\n5. Optimize space if possible', author: 'arshita', date: 'Feb 16', pinned: false },
])

// ── Lab / Head-to-head challenges ─────────────────────────────────────────
export const challenges = writable([
  {
    id: 1,
    type: 'race',
    problem: 'Coin Change',
    problemNumber: 322,
    diff: 'Medium',
    status: 'active',
    challenger: 'shivali',
    opponent: 'arshita',
    startTime: Date.now() - 1000 * 60 * 23,
    arshitaDone: false,
    shivaliDone: false,
    winner: null,
  },
  {
    id: 2,
    type: 'time-beat',
    problem: 'Number of Islands',
    problemNumber: 200,
    diff: 'Medium',
    status: 'completed',
    challenger: 'arshita',
    opponent: 'shivali',
    arshitaTime: 18,
    shivaliTime: 14,
    winner: 'shivali',
  },
  {
    id: 3,
    type: 'weekly',
    problem: 'Week 8 Challenge: 3 Hard Problems',
    diff: 'Hard',
    status: 'completed',
    arshitaSolved: 2,
    shivaliSolved: 3,
    winner: 'shivali',
    week: 'Feb 12–18',
  },
  {
    id: 4,
    type: 'race',
    problem: 'Longest Palindromic Substring',
    problemNumber: 5,
    diff: 'Medium',
    status: 'completed',
    challenger: 'arshita',
    opponent: 'shivali',
    arshitaDone: true,
    shivaliDone: true,
    winner: 'arshita',
  },
])

// ── Activity (heatmap data) ────────────────────────────────────────────────
function generateActivity(seed) {
  const data = {}
  for (let i = 0; i < 70; i++) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const key = d.toISOString().slice(0, 10)
    const rand = Math.sin(i * seed) * 0.5 + 0.5
    data[key] = rand > 0.55 ? Math.floor(rand * 6) : 0
  }
  return data
}

export const activity = {
  arshita: generateActivity(2.3),
  shivali: generateActivity(1.7),
}

// ── Derived stats ─────────────────────────────────────────────────────────
export const stats = derived(problems, $problems => {
  const calc = (user) => {
    const solved = $problems.filter(p => p[user] === 'done').length
    const easy = $problems.filter(p => p[user] === 'done' && p.diff === 'Easy').length
    const medium = $problems.filter(p => p[user] === 'done' && p.diff === 'Medium').length
    const hard = $problems.filter(p => p[user] === 'done' && p.diff === 'Hard').length
    const review = $problems.filter(p => p[user] === 'review').length
    const todo = $problems.filter(p => p[user] === 'todo').length
    return { solved, easy, medium, hard, review, todo, total: $problems.length }
  }
  return { arshita: calc('arshita'), shivali: calc('shivali') }
})
