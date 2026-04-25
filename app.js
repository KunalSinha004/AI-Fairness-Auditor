// ===================== NAVIGATION =====================
document.querySelectorAll('.nav-item').forEach(item => {
  item.addEventListener('click', () => {
    const page = item.dataset.page;
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    item.classList.add('active');
    document.querySelectorAll('.page-section').forEach(s => s.classList.remove('active'));
    document.getElementById('page-' + page).classList.add('active');
    document.getElementById('breadcrumb-page').textContent = item.textContent.trim();
    initPageCharts(page);
  });
});

// Toggle buttons
document.querySelectorAll('.toggle').forEach(t => {
  t.addEventListener('click', (e) => { e.preventDefault(); t.classList.toggle('active'); });
});

// Threshold slider
const slider = document.getElementById('threshold-slider');
if (slider) slider.addEventListener('input', () => {
  document.getElementById('threshold-val').textContent = slider.value + '%';
});

// Depth tabs
document.querySelectorAll('#depth-tabs .tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('#depth-tabs .tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
  });
});

// Metric tabs
document.querySelectorAll('#metric-tabs .tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('#metric-tabs .tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
  });
});

// ===================== FILE UPLOAD =====================
const uploadZone = document.getElementById('upload-zone');
const fileInput = document.getElementById('file-input');
const uploadPreview = document.getElementById('upload-preview');
const uploadPlaceholder = document.getElementById('upload-placeholder');

uploadZone.addEventListener('click', () => fileInput.click());
uploadZone.addEventListener('dragover', (e) => { e.preventDefault(); uploadZone.classList.add('dragover'); });
uploadZone.addEventListener('dragleave', () => uploadZone.classList.remove('dragover'));
uploadZone.addEventListener('drop', (e) => {
  e.preventDefault(); uploadZone.classList.remove('dragover');
  if (e.dataTransfer.files.length) handleFile(e.dataTransfer.files[0]);
});
fileInput.addEventListener('change', () => { if (fileInput.files.length) handleFile(fileInput.files[0]); });

function handleFile(file) {
  document.getElementById('preview-name').textContent = file.name;
  document.getElementById('preview-size').textContent = (file.size / 1024).toFixed(1) + ' KB';
  const img = document.getElementById('preview-img');
  if (file.type.startsWith('image/')) {
    const reader = new FileReader();
    reader.onload = (e) => { img.src = e.target.result; img.style.display = 'block'; };
    reader.readAsDataURL(file);
  } else {
    img.style.display = 'none';
  }
  uploadPlaceholder.style.display = 'none';
  uploadPreview.classList.add('active');
}

function clearUpload() {
  uploadPlaceholder.style.display = 'block';
  uploadPreview.classList.remove('active');
  fileInput.value = '';
  document.getElementById('analysis-results').style.display = 'none';
}

// ===================== ANALYSIS SIMULATION =====================
function runAnalysis() {
  const resultsCard = document.getElementById('analysis-results');
  const content = document.getElementById('results-content');
  resultsCard.style.display = 'block';
  content.innerHTML = '<div class="analysis-running"><div class="spinner"></div><p>Running fairness analysis...</p></div>';
  resultsCard.scrollIntoView({ behavior: 'smooth' });

  setTimeout(() => {
    const fairness = (75 + Math.random() * 20).toFixed(1);
    const gender = (Math.random() * 0.3).toFixed(3);
    const race = (Math.random() * 0.25).toFixed(3);
    const age = (Math.random() * 0.15).toFixed(3);
    const statusClass = fairness > 85 ? 'success' : fairness > 70 ? 'warning' : 'danger';
    const statusText = fairness > 85 ? 'Pass' : fairness > 70 ? 'Review' : 'Fail';

    content.innerHTML = `
      <div class="kpi-grid">
        <div class="kpi-card"><div class="kpi-header"><div class="kpi-icon">⚖️</div><span class="badge badge-${statusClass}">${statusText}</span></div>
          <div class="kpi-value">${fairness}%</div><div class="kpi-label">Fairness Score</div></div>
        <div class="kpi-card"><div class="kpi-header"><div class="kpi-icon">👤</div></div>
          <div class="kpi-value">${gender}</div><div class="kpi-label">Gender Disparity</div></div>
        <div class="kpi-card"><div class="kpi-header"><div class="kpi-icon">🌍</div></div>
          <div class="kpi-value">${race}</div><div class="kpi-label">Racial Disparity</div></div>
        <div class="kpi-card"><div class="kpi-header"><div class="kpi-icon">📅</div></div>
          <div class="kpi-value">${age}</div><div class="kpi-label">Age Disparity</div></div>
      </div>
      <div class="grid-2" style="margin-top:20px;">
        <div>
          <h3 style="font-size:14px;margin-bottom:12px;font-weight:700;">Metric Breakdown</h3>
          <div class="chart-bar-container">
            ${barHTML('Demographic Parity', (70+Math.random()*25).toFixed(1), '--accent-blue')}
            ${barHTML('Equalized Odds', (65+Math.random()*30).toFixed(1), '--accent-purple')}
            ${barHTML('Predictive Parity', (72+Math.random()*20).toFixed(1), '--accent-cyan')}
            ${barHTML('Calibration', (80+Math.random()*15).toFixed(1), '--accent-green')}
            ${barHTML('Individual Fair.', (68+Math.random()*25).toFixed(1), '--accent-amber')}
          </div>
        </div>
        <div>
          <h3 style="font-size:14px;margin-bottom:12px;font-weight:700;">Recommendations</h3>
          <div class="timeline">
            <div class="timeline-item"><div class="timeline-dot" style="border-color:var(--accent-red);"></div>
              <div class="event">⚠️ Re-balance training data for gender representation</div>
              <div class="detail">Gender disparity exceeds threshold by ${(gender*100).toFixed(0)}%</div></div>
            <div class="timeline-item"><div class="timeline-dot" style="border-color:var(--accent-amber);"></div>
              <div class="event">📊 Apply adversarial debiasing techniques</div>
              <div class="detail">Recommended for racial attribute fairness improvement</div></div>
            <div class="timeline-item"><div class="timeline-dot" style="border-color:var(--accent-green);"></div>
              <div class="event">✅ Age fairness within acceptable range</div>
              <div class="detail">No action required at this time</div></div>
          </div>
        </div>
      </div>`;
  }, 2500);
}

function barHTML(label, val, color) {
  const c = `var(${color})`;
  return `<div class="chart-bar-item">
    <div class="chart-bar-label">${label}</div>
    <div class="chart-bar-track"><div class="chart-bar-fill" style="width:${val}%;background:${c};">${val}%</div></div>
  </div>`;
}

// ===================== CHART.JS HELPERS =====================
const chartInstances = {};
const chartColors = {
  blue: 'rgba(59,130,246,', purple: 'rgba(139,92,246,', cyan: 'rgba(6,182,212,',
  green: 'rgba(16,185,129,', amber: 'rgba(245,158,11,', red: 'rgba(239,68,68,', pink: 'rgba(236,72,153,'
};
const defaultFont = { family: 'Inter', size: 11, weight: '500' };

Chart.defaults.color = '#94a3b8';
Chart.defaults.font = defaultFont;
Chart.defaults.plugins.legend.labels.usePointStyle = true;
Chart.defaults.plugins.legend.labels.pointStyleWidth = 8;

function makeChart(id, config) {
  if (chartInstances[id]) chartInstances[id].destroy();
  const ctx = document.getElementById(id);
  if (!ctx) return;
  chartInstances[id] = new Chart(ctx, config);
}

// ===================== DASHBOARD CHARTS =====================
function initDashboard() {
  // Trend line chart
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  makeChart('chart-trend', {
    type: 'line',
    data: {
      labels: months,
      datasets: [{
        label: 'Fairness Score', data: [78,80,79,82,84,83,85,86,84,87,86,87.3],
        borderColor: chartColors.blue + '1)', backgroundColor: chartColors.blue + '0.1)',
        fill: true, tension: 0.4, borderWidth: 2, pointRadius: 3
      },{
        label: 'Disparity Index', data: [0.18,0.16,0.17,0.14,0.12,0.13,0.11,0.10,0.11,0.09,0.09,0.08].map(v=>v*100),
        borderColor: chartColors.red + '1)', backgroundColor: chartColors.red + '0.1)',
        fill: true, tension: 0.4, borderWidth: 2, pointRadius: 3, yAxisID: 'y1'
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      scales: {
        x: { grid: { color: 'rgba(255,255,255,0.04)' } },
        y: { grid: { color: 'rgba(255,255,255,0.04)' }, min: 70, max: 100, title: { display: true, text: 'Score %' } },
        y1: { position: 'right', grid: { drawOnChartArea: false }, min: 0, max: 25, title: { display: true, text: 'Disparity %' } }
      }
    }
  });

  // Bias distribution doughnut
  makeChart('chart-bias-dist', {
    type: 'doughnut',
    data: {
      labels: ['Gender','Race','Age','Disability','Income','Location'],
      datasets: [{ data: [28,24,15,8,14,11],
        backgroundColor: [chartColors.blue+'0.8)', chartColors.purple+'0.8)', chartColors.amber+'0.8)', chartColors.green+'0.8)', chartColors.pink+'0.8)', chartColors.cyan+'0.8)'],
        borderColor: 'rgba(10,14,26,0.8)', borderWidth: 3
      }]
    },
    options: { responsive: true, maintainAspectRatio: false, cutout: '65%',
      plugins: { legend: { position: 'bottom' } }
    }
  });

  // Fairness bars
  const cats = [
    { name: 'Hiring', val: 82, color: '--accent-blue' },
    { name: 'Lending', val: 91, color: '--accent-green' },
    { name: 'Healthcare', val: 76, color: '--accent-amber' },
    { name: 'Criminal Justice', val: 68, color: '--accent-red' },
    { name: 'Education', val: 88, color: '--accent-purple' }
  ];
  document.getElementById('fairness-bars').innerHTML = cats.map(c =>
    `<div class="chart-bar-item"><div class="chart-bar-label">${c.name}</div>
     <div class="chart-bar-track"><div class="chart-bar-fill" style="width:${c.val}%;background:var(${c.color});">${c.val}%</div></div></div>`
  ).join('');

  // Recent audits timeline
  const audits = [
    { time: '2 hours ago', event: 'Hiring Model v3.2 audited', detail: 'Score: 82% — 2 warnings', color: '--accent-blue' },
    { time: '5 hours ago', event: 'Lending Model v1.8 audited', detail: 'Score: 91% — Passed', color: '--accent-green' },
    { time: '1 day ago', event: 'Healthcare Risk Model flagged', detail: 'Score: 76% — Review needed', color: '--accent-amber' },
    { time: '2 days ago', event: 'Criminal Justice Model failed', detail: 'Score: 68% — 5 critical alerts', color: '--accent-red' }
  ];
  document.getElementById('recent-audits').innerHTML = audits.map(a =>
    `<div class="timeline-item"><div class="timeline-dot" style="border-color:var(${a.color});"></div>
     <div class="time">${a.time}</div><div class="event">${a.event}</div><div class="detail">${a.detail}</div></div>`
  ).join('');

  // Quick stats
  const stats = [
    { label: 'Models Passing', val: '18/24', dot: '--accent-green' },
    { label: 'Critical Alerts', val: '3', dot: '--accent-red' },
    { label: 'Avg. Audit Time', val: '4.2 min', dot: '--accent-blue' },
    { label: 'Data Points', val: '1.2M', dot: '--accent-purple' },
    { label: 'Last Audit', val: '2h ago', dot: '--accent-cyan' }
  ];
  document.getElementById('quick-stats').innerHTML = stats.map(s =>
    `<div class="metric-row"><div class="metric-label"><div class="metric-dot" style="background:var(${s.dot});"></div>
     <span class="metric-name">${s.label}</span></div><span class="metric-value">${s.val}</span></div>`
  ).join('');
}

// ===================== BIAS PAGE CHARTS =====================
function initBiasPage() {
  makeChart('chart-radar', {
    type: 'radar',
    data: {
      labels: ['Gender','Race','Age','Disability','Income','Location'],
      datasets: [{
        label: 'Current Model', data: [77,82,95,98,85,88],
        borderColor: chartColors.blue + '1)', backgroundColor: chartColors.blue + '0.15)',
        borderWidth: 2, pointRadius: 4
      },{
        label: 'Baseline', data: [90,90,90,90,90,90],
        borderColor: chartColors.amber + '0.6)', backgroundColor: 'transparent',
        borderWidth: 2, borderDash: [5,5], pointRadius: 0
      }]
    },
    options: { responsive: true, maintainAspectRatio: false,
      scales: { r: { min: 50, max: 100, grid: { color: 'rgba(255,255,255,0.06)' },
        angleLines: { color: 'rgba(255,255,255,0.06)' } } }
    }
  });

  makeChart('chart-intersect', {
    type: 'bar',
    data: {
      labels: ['M+White','M+Black','M+Asian','F+White','F+Black','F+Asian'],
      datasets: [{
        label: 'Approval Rate', data: [88,72,81,85,68,79],
        backgroundColor: [chartColors.blue+'0.7)', chartColors.red+'0.7)', chartColors.purple+'0.7)', chartColors.cyan+'0.7)', chartColors.amber+'0.7)', chartColors.green+'0.7)'],
        borderRadius: 6, borderSkipped: false
      }]
    },
    options: { responsive: true, maintainAspectRatio: false,
      scales: { x: { grid: { display: false } }, y: { grid: { color: 'rgba(255,255,255,0.04)' }, min: 50, max: 100 } }
    }
  });

  // Bias table
  const alerts = [
    { time: '2026-04-25 14:30', model: 'Hiring-v3.2', attr: 'Gender', sev: 'High', disp: '0.23', status: 'Open' },
    { time: '2026-04-25 12:15', model: 'Lending-v1.8', attr: 'Race', sev: 'Medium', disp: '0.14', status: 'Reviewing' },
    { time: '2026-04-24 09:45', model: 'Health-v2.1', attr: 'Age', sev: 'Low', disp: '0.07', status: 'Resolved' },
    { time: '2026-04-24 08:00', model: 'Justice-v1.0', attr: 'Race', sev: 'Critical', disp: '0.31', status: 'Open' },
    { time: '2026-04-23 16:20', model: 'Edu-v2.5', attr: 'Income', sev: 'Low', disp: '0.05', status: 'Resolved' }
  ];
  const sevClass = { Critical: 'danger', High: 'danger', Medium: 'warning', Low: 'success' };
  const statClass = { Open: 'danger', Reviewing: 'warning', Resolved: 'success' };
  document.getElementById('bias-tbody').innerHTML = alerts.map(a =>
    `<tr><td>${a.time}</td><td>${a.model}</td><td>${a.attr}</td>
     <td><span class="badge badge-${sevClass[a.sev]}">${a.sev}</span></td>
     <td>${a.disp}</td><td><span class="badge badge-${statClass[a.status]}">${a.status}</span></td></tr>`
  ).join('');
}

// ===================== METRICS PAGE =====================
function initMetricsPage() {
  makeChart('chart-metrics', {
    type: 'bar',
    data: {
      labels: ['Demo. Parity','Equal. Odds','Pred. Parity','Calibration','Ind. Fairness'],
      datasets: [
        { label: 'Group A', data: [0.82,0.78,0.85,0.91,0.76], backgroundColor: chartColors.blue+'0.7)', borderRadius: 6 },
        { label: 'Group B', data: [0.71,0.65,0.79,0.88,0.72], backgroundColor: chartColors.purple+'0.7)', borderRadius: 6 }
      ]
    },
    options: { responsive: true, maintainAspectRatio: false,
      scales: { x: { grid: { display: false } }, y: { grid: { color: 'rgba(255,255,255,0.04)' }, min: 0, max: 1 } },
      plugins: { legend: { position: 'top' } }
    }
  });

  const metrics = [
    { label: 'Statistical Parity Diff.', val: 0.11, color: '--accent-blue' },
    { label: 'Equal Opportunity Diff.', val: 0.13, color: '--accent-purple' },
    { label: 'Predictive Rate Parity', val: 0.06, color: '--accent-cyan' },
    { label: 'Calibration Diff.', val: 0.03, color: '--accent-green' },
    { label: 'Treatment Equality', val: 0.09, color: '--accent-amber' }
  ];
  document.getElementById('metrics-breakdown').innerHTML = metrics.map(m => {
    const pct = Math.min(m.val * 500, 100);
    const cls = m.val < 0.05 ? 'success' : m.val < 0.1 ? 'warning' : 'danger';
    return `<div class="metric-row"><div class="metric-label"><div class="metric-dot" style="background:var(${m.color});"></div>
      <span class="metric-name">${m.label}</span></div>
      <div style="display:flex;align-items:center;gap:10px;"><span class="badge badge-${cls}">${m.val.toFixed(3)}</span></div></div>`;
  }).join('');

  const tbl = [
    ['Statistical Parity','0.82','0.71','0.110','0.866','warning'],
    ['Equal Opportunity','0.78','0.65','0.130','0.833','danger'],
    ['Predictive Parity','0.85','0.79','0.060','0.929','success'],
    ['Calibration','0.91','0.88','0.030','0.967','success'],
    ['Individual Fairness','0.76','0.72','0.040','0.947','success']
  ];
  document.getElementById('metric-tbody').innerHTML = tbl.map(r =>
    `<tr><td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td><td>${r[3]}</td><td>${r[4]}</td>
     <td><span class="badge badge-${r[5]}">${r[5]==='success'?'Pass':r[5]==='warning'?'Review':'Fail'}</span></td></tr>`
  ).join('');
}

// ===================== REPORTS =====================
function generateReport(type) {
  const names = { summary: 'Summary Report', detailed: 'Detailed Report', compliance: 'Compliance Report' };
  const tbody = document.getElementById('report-tbody');
  const now = new Date().toLocaleString();
  const row = document.createElement('tr');
  row.innerHTML = `<td>${now}</td><td>${names[type]}</td><td>All Models</td>
    <td><span class="badge badge-info">Generating...</span></td><td>—</td>`;
  tbody.insertBefore(row, tbody.firstChild);

  setTimeout(() => {
    row.querySelector('.badge').className = 'badge badge-success';
    row.querySelector('.badge').textContent = 'Ready';
    row.querySelector('td:last-child').innerHTML = '<button class="btn btn-sm btn-secondary" onclick="alert(\'Report downloaded!\')">📥 Download</button>';
  }, 2000);
}

// Pre-populate report history
function initReports() {
  const history = [
    ['2026-04-24', 'Summary Report', '24 Models', 'Ready'],
    ['2026-04-20', 'Compliance Report', '18 Models', 'Ready'],
    ['2026-04-15', 'Detailed Report', '22 Models', 'Ready']
  ];
  document.getElementById('report-tbody').innerHTML = history.map(r =>
    `<tr><td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td>
     <td><span class="badge badge-success">${r[3]}</span></td>
     <td><button class="btn btn-sm btn-secondary" onclick="alert('Report downloaded!')">📥 Download</button></td></tr>`
  ).join('');
}

// ===================== INIT =====================
const pageInits = { dashboard: initDashboard, bias: initBiasPage, metrics: initMetricsPage, reports: initReports };

function initPageCharts(page) {
  if (pageInits[page]) setTimeout(() => pageInits[page](), 100);
}

// ===================== AUTH SYSTEM =====================
function toggleAuthMode(mode) {
  event.preventDefault();
  const loginForm = document.getElementById('login-form');
  const signupForm = document.getElementById('signup-form');
  const title = document.getElementById('auth-title');
  const subtitle = document.getElementById('auth-subtitle');

  // Remove any error/success messages
  document.querySelectorAll('.auth-error, .auth-success').forEach(el => el.remove());

  if (mode === 'signup') {
    loginForm.style.display = 'none';
    signupForm.style.display = 'flex';
    title.textContent = 'Create Account';
    subtitle.textContent = 'Join FairAI Auditor and start monitoring AI fairness';
  } else {
    loginForm.style.display = 'flex';
    signupForm.style.display = 'none';
    title.textContent = 'Welcome Back';
    subtitle.textContent = 'Sign in to your FairAI Auditor account';
  }
}

function showAuthMessage(form, message, type) {
  // Remove existing messages
  form.querySelectorAll('.auth-error, .auth-success').forEach(el => el.remove());
  const div = document.createElement('div');
  div.className = type === 'error' ? 'auth-error' : 'auth-success';
  div.textContent = message;
  form.prepend(div);
  setTimeout(() => div.remove(), 4000);
}

function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;
  const form = document.getElementById('login-form');

  if (!email || !password) {
    showAuthMessage(form, 'Please fill in all fields', 'error');
    return;
  }

  // Check localStorage for registered users
  const users = JSON.parse(localStorage.getItem('fairai_users') || '[]');
  const user = users.find(u => u.email === email);

  if (user && user.password === password) {
    loginSuccess(user);
  } else if (!user) {
    // Demo: auto-login with any credentials
    const demoUser = {
      name: email.split('@')[0].replace(/[^a-zA-Z]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
      email: email,
      role: 'Admin',
      avatar: email.substring(0, 2).toUpperCase()
    };
    loginSuccess(demoUser);
  } else {
    showAuthMessage(form, 'Invalid email or password. Please try again.', 'error');
  }
}

function handleSignup(e) {
  e.preventDefault();
  const name = document.getElementById('signup-name').value.trim();
  const email = document.getElementById('signup-email').value.trim();
  const password = document.getElementById('signup-password').value;
  const role = document.getElementById('signup-role').value;
  const form = document.getElementById('signup-form');

  if (!name || !email || !password) {
    showAuthMessage(form, 'Please fill in all fields', 'error');
    return;
  }

  if (password.length < 8) {
    showAuthMessage(form, 'Password must be at least 8 characters', 'error');
    return;
  }

  // Save user to localStorage
  const users = JSON.parse(localStorage.getItem('fairai_users') || '[]');
  if (users.find(u => u.email === email)) {
    showAuthMessage(form, 'An account with this email already exists', 'error');
    return;
  }

  const newUser = {
    name: name,
    email: email,
    password: password,
    role: role.charAt(0).toUpperCase() + role.slice(1),
    avatar: name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase()
  };

  users.push(newUser);
  localStorage.setItem('fairai_users', JSON.stringify(users));

  showAuthMessage(form, '✅ Account created successfully! Signing in...', 'success');
  setTimeout(() => loginSuccess(newUser), 1200);
}

function loginSuccess(user) {
  localStorage.setItem('fairai_session', JSON.stringify(user));
  document.getElementById('auth-overlay').classList.remove('active');
  updateProfileUI(user);
}

function updateProfileUI(user) {
  const initials = user.avatar || user.name.substring(0, 2).toUpperCase();
  document.getElementById('user-avatar-display').textContent = initials;
  document.getElementById('user-name-display').textContent = user.name;
  document.getElementById('user-role-display').textContent = user.role;
  document.getElementById('dropdown-avatar').textContent = initials;
  document.getElementById('dropdown-name').textContent = user.name;
  document.getElementById('dropdown-email').textContent = user.email;
}

function socialLogin(provider) {
  const providerName = provider.charAt(0).toUpperCase() + provider.slice(1);
  const demoUser = {
    name: providerName + ' User',
    email: 'user@' + provider + '.com',
    role: 'Admin',
    avatar: providerName.substring(0, 2).toUpperCase()
  };
  loginSuccess(demoUser);
}

function handleLogout() {
  localStorage.removeItem('fairai_session');
  document.getElementById('auth-overlay').classList.add('active');
  document.getElementById('profile-dropdown').classList.remove('active');
  // Reset forms
  document.getElementById('login-form').reset();
  document.getElementById('signup-form').reset();
  toggleAuthMode('login');
}

// ===================== PROFILE DROPDOWN =====================
function toggleProfileMenu() {
  const dropdown = document.getElementById('profile-dropdown');
  dropdown.classList.toggle('active');
}

// Close dropdown on outside click
document.addEventListener('click', (e) => {
  const dropdown = document.getElementById('profile-dropdown');
  const trigger = document.getElementById('profile-trigger');
  if (dropdown && !dropdown.contains(e.target) && !trigger.contains(e.target)) {
    dropdown.classList.remove('active');
  }
});

function navigateTo(page) {
  document.getElementById('profile-dropdown').classList.remove('active');
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  const navItem = document.getElementById('nav-' + page);
  if (navItem) navItem.classList.add('active');
  document.querySelectorAll('.page-section').forEach(s => s.classList.remove('active'));
  document.getElementById('page-' + page).classList.add('active');
  document.getElementById('breadcrumb-page').textContent = navItem ? navItem.textContent.trim() : page;
  initPageCharts(page);
}

function showProfile() {
  document.getElementById('profile-dropdown').classList.remove('active');
  alert('👤 Profile page coming soon!\n\nCurrent session:\n' +
    JSON.stringify(JSON.parse(localStorage.getItem('fairai_session') || '{}'), null, 2));
}

function showActivity() {
  document.getElementById('profile-dropdown').classList.remove('active');
  alert('📋 Activity log coming soon!');
}

// ===================== THEME TOGGLE =====================
function toggleTheme() {
  const html = document.documentElement;
  const current = html.getAttribute('data-theme');
  const newTheme = current === 'light' ? 'dark' : 'light';
  html.setAttribute('data-theme', newTheme);
  localStorage.setItem('fairai_theme', newTheme);
  document.getElementById('theme-icon').textContent = newTheme === 'light' ? '☀️' : '🌙';

  // Update Chart.js text color for the new theme
  const textColor = newTheme === 'light' ? '#475569' : '#94a3b8';
  Chart.defaults.color = textColor;

  // Re-render visible charts
  Object.values(chartInstances).forEach(chart => {
    if (chart) {
      chart.options.plugins = chart.options.plugins || {};
      chart.update();
    }
  });
}

function loadSavedTheme() {
  const saved = localStorage.getItem('fairai_theme');
  if (saved === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
    document.getElementById('theme-icon').textContent = '☀️';
    Chart.defaults.color = '#475569';
  }
}

// ===================== NOTIFICATIONS =====================
const defaultNotifications = [
  { id: 1, icon: '🚨', type: 'alert',   text: 'Critical bias detected in Justice-v1.0 model — racial disparity 0.31', time: '10 min ago', unread: true },
  { id: 2, icon: '⚠️', type: 'warning', text: 'Hiring-v3.2 gender disparity exceeds threshold (0.23)', time: '2 hours ago', unread: true },
  { id: 3, icon: '✅', type: 'success', text: 'Lending-v1.8 passed fairness audit — score 91%', time: '5 hours ago', unread: true },
  { id: 4, icon: '📊', type: 'info',    text: 'Weekly fairness report generated and ready for download', time: '1 day ago', unread: false },
  { id: 5, icon: '🔄', type: 'info',    text: 'Model Health-v2.1 scheduled for re-audit tomorrow', time: '1 day ago', unread: false },
  { id: 6, icon: '👤', type: 'info',    text: 'New team member "Sarah Chen" joined as Auditor', time: '2 days ago', unread: false },
];

let notifications = [];

function loadNotifications() {
  const saved = localStorage.getItem('fairai_notifications');
  notifications = saved ? JSON.parse(saved) : [...defaultNotifications];
  renderNotifications();
}

function saveNotifications() {
  localStorage.setItem('fairai_notifications', JSON.stringify(notifications));
}

function renderNotifications() {
  const list = document.getElementById('notif-list');
  const empty = document.getElementById('notif-empty');
  const dot = document.getElementById('notif-dot');

  if (notifications.length === 0) {
    list.style.display = 'none';
    empty.style.display = 'block';
    dot.style.display = 'none';
    return;
  }

  list.style.display = 'block';
  empty.style.display = 'none';

  const hasUnread = notifications.some(n => n.unread);
  dot.style.display = hasUnread ? 'block' : 'none';

  list.innerHTML = notifications.map(n => `
    <div class="notif-item ${n.unread ? 'unread' : ''}" onclick="markRead(${n.id})">
      <div class="notif-icon ${n.type}">${n.icon}</div>
      <div class="notif-content">
        <div class="notif-text">${n.text}</div>
        <div class="notif-time">${n.time}</div>
      </div>
    </div>
  `).join('');
}

function toggleNotifications() {
  const panel = document.getElementById('notif-panel');
  panel.classList.toggle('active');
  // Close profile dropdown if open
  document.getElementById('profile-dropdown').classList.remove('active');
}

function markRead(id) {
  const n = notifications.find(n => n.id === id);
  if (n) n.unread = false;
  saveNotifications();
  renderNotifications();
}

function clearNotifications() {
  notifications = [];
  saveNotifications();
  renderNotifications();
}

// Close notification panel on outside click
document.addEventListener('click', (e) => {
  const wrapper = document.getElementById('notif-wrapper');
  if (wrapper && !wrapper.contains(e.target)) {
    document.getElementById('notif-panel').classList.remove('active');
  }
});

// ===================== BOOT =====================
document.addEventListener('DOMContentLoaded', () => {
  // Load saved theme
  loadSavedTheme();

  // Load notifications
  loadNotifications();

  // Check for existing session
  const session = localStorage.getItem('fairai_session');
  if (session) {
    const user = JSON.parse(session);
    document.getElementById('auth-overlay').classList.remove('active');
    updateProfileUI(user);
  }

  initDashboard();
  initReports();
});
