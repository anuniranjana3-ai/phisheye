const analyzeBtn = document.getElementById('analyzeBtn');
const inputUrl = document.getElementById('targetUrl');
const scanOverlay = document.getElementById('scanOverlay');
const scanProgressLabel = document.getElementById('scanProgress');
const resultsSection = document.getElementById('results');
const resultScoreEl = document.getElementById('resultScore');
const resultStatusEl = document.getElementById('resultStatus');
const progressCircle = document.getElementById('progressCircle');
const secureList = document.getElementById('secureList');
const riskList = document.getElementById('riskList');
const navLinks = document.querySelector('.nav-links');
const toggleMenu = document.querySelector('.toggle-menu');

const circleRadius = 96;
const circleCircumference = 2 * Math.PI * circleRadius;
progressCircle.style.strokeDasharray = `${circleCircumference}`;
progressCircle.style.strokeDashoffset = `${circleCircumference}`;

// Initialize UI safe state
function initializeUI() {
  scanOverlay.classList.add('hidden');
  scanOverlay.style.display = 'none';
  resultsSection.classList.add('hidden');
}

initializeUI();

const unsafeKeywords = ['login', 'verify', 'bank', 'update', 'secure', 'account', 'pay', 'reset', 'confirm'];

function calculateScore(url) {
  const lower = url.toLowerCase().trim();
  let score = 70;

  if (lower.startsWith('https://')) {
    score += 15;
  } else if (lower.startsWith('http://')) {
    score -= 10;
  } else {
    score -= 5;
  }

  if (lower.length > 30) score -= 10;
  if (lower.length > 70) score -= 10;

  unsafeKeywords.forEach(keyword => {
    if (lower.includes(keyword)) score -= 8;
  });

  if (/\.phish|\.malicious|\.fake|\.xyz|\.top/.test(lower)) score -= 12;

  score += Math.floor((Math.random() * 12) - 6);
  score = Math.min(100, Math.max(0, score));

  return score;
}

function updateCircle(score) {
  const offset = circleCircumference - (score / 100) * circleCircumference;
  progressCircle.style.strokeDashoffset = offset;

  let color = '#71f27f';
  if (score < 50) color = '#ff4343';
  else if (score < 80) color = '#f5dd64';
  progressCircle.style.stroke = color;

  const pulse = document.querySelector('.circle-outer');
  pulse.style.boxShadow = `0 0 25px ${color}55, inset 0 0 20px ${color}44`;
}

function getIndicators(url, score) {
  const lower = url.toLowerCase();
  const items = { secure: [], risk: [] };

  if (lower.startsWith('https://')) items.secure.push('HTTPS enabled');
  else items.risk.push('No HTTPS protocol');

  if (lower.length <= 30) items.secure.push('URL length is normal');
  else items.risk.push('Long URL length');

  const hasUnsafe = unsafeKeywords.filter(k => lower.includes(k));
  if (hasUnsafe.length) {
    items.risk.push(`Suspicious keyword detected: ${hasUnsafe.join(', ')}`);
  }

  if (/\.com|\.org|\.net/.test(lower)) items.secure.push('Trusted top-level domain');
  else items.risk.push('Unusual or new TLD');

  if (/\d{4}/.test(lower)) items.risk.push('Timestamp or code in domain');

  if (score > 80) {
    items.secure.push('No suspicious patterns');
  } else if (score > 48) {
    items.risk.push('Potential mismatch or social-engineering signs');
  } else {
    items.risk.push('High risk phishing or malware characteristics');
  }

  if (items.secure.length === 0) items.secure.push('No positive indicators identified');
  if (items.risk.length === 0) items.risk.push('No risk factors detected');

  return items;
}

function animateIndicators(listEl, values) {
  listEl.innerHTML = '';
  values.forEach((item, index) => {
    const li = document.createElement('li');
    li.textContent = item;
    li.style.animationDelay = `${index * 120}ms`;
    listEl.appendChild(li);
  });
}

function showResults(score) {
  const status = score >= 80 ? 'SAFE' : score >= 50 ? 'SUSPICIOUS' : 'DANGEROUS';
  resultScoreEl.textContent = `${score}%`;
  resultStatusEl.textContent = `${status}`;
  resultStatusEl.style.color = score >= 80 ? 'rgba(145, 250, 159, 0.97)' : score >= 50 ? 'rgba(254, 221, 88, 0.95)' : 'rgba(255, 101, 101, 0.96)';

  const indicators = getIndicators(inputUrl.value || 'unknown', score);
  animateIndicators(secureList, indicators.secure);
  animateIndicators(riskList, indicators.risk);

  updateCircle(score);
  if (!resultsSection.classList.contains('hidden')) return;
  resultsSection.classList.remove('hidden');
  resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function runScan() {
  if (!inputUrl.value.trim()) {
    inputUrl.classList.add('shake');
    setTimeout(() => inputUrl.classList.remove('shake'), 300);
    return;
  }

  scanOverlay.classList.remove('hidden');
  scanOverlay.style.display = 'grid';
  const duration = 2400;
  const start = performance.now();

  const animation = requestAnimationFrame(function update(now) {
    const elapsed = now - start;
    const raw = Math.min(100, Math.floor((elapsed / duration) * 100));
    scanProgressLabel.textContent = `${raw}%`;

    const progress = document.querySelector('.progress-bar span');
    const width = Math.min(100, (elapsed / duration) * 100);
    document.querySelector('.progress-bar span').style.left = `${Math.min(93, width)}%`;

    if (elapsed < duration) {
      requestAnimationFrame(update);
    } else {
      scanOverlay.classList.add('hidden');
      scanOverlay.style.display = 'none';
      const score = calculateScore(inputUrl.value);
      showResults(score);
    }
  });
}

analyzeBtn.addEventListener('click', runScan);
inputUrl.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') runScan();
});

toggleMenu.addEventListener('click', () => {
  navLinks.classList.toggle('active');
});

function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal');
      }
    });
  },
  { threshold: 0.1 }
);

document.querySelectorAll('.page-section, .result-heading, .glass-card').forEach((section) => {
  observer.observe(section);
});
