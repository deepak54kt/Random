const screen = document.querySelector('#game-screen');
const levelLabel = document.querySelector('#level-label');
const levelName = document.querySelector('#level-name');
const progressFill = document.querySelector('#progress-fill');
const footerStatus = document.querySelector('#footer-status');

const levelNames = ['PLAYER DETECTED', 'HUMAN VERIFICATION', 'ROASTING TEST', 'FRIENDSHIP DATABASE', 'GAMING HISTORY', 'BIRTHDAY PROTOCOL', 'FINAL SCAN', 'MESSAGE UNLOCKED', 'NAME REGISTRATION'];
let currentLevel = 1;
let selectedResponse = null;
const NAME_SUBMISSION_ENDPOINT = 'https://formspree.io/f/mnpnewzz';

const choices = {
  identity: [
    ['Obviously 🙄', ['Yeah, we know it\'s you. 💀', 'No need to act innocent.']],
    ['Who is Chasmis? 🤨', ['Nice try.', 'We literally found you. 💀', 'Identity theft attempt detected.']]
  ],
  human: [
    ['One actual game', ['Suspicious.', 'Nobody actually plays only one game. 💀']],
    ['Seven more games', ['Correct.', 'You are clearly familiar with the laws of gaming. 😂']],
    ['Lose and blame teammates', ['Classic behavior detected.', 'The teammates are always guilty apparently. 💀']],
    ['Say one last game and disappear for 3 hours', ['Extremely realistic answer.', 'System has accepted your identity. 😂']]
  ],
  roast: [
    ['Me 😌', ['Confidence detected.', 'Evidence of this confidence: absolutely zero. 💀']],
    ['You 🙄', ['Finally, some honesty.', 'Screenshotting this before you change your answer. 😂']],
    ['Obviously me', ["Bro didn't even hesitate. 💀", 'Respect the confidence.']],
    ["Let's not embarrass you today", ['Aww.', 'Chasmis is feeling generous today. 😂']]
  ],
  friendship: [
    ['Normal gaming friends', ['NORMAL?', 'After all the roasting?', 'That\'s the biggest lie submitted today. 💀']],
    ['Professional Roasting Partners', ['Correct answer detected. ✅', 'Friendship classification updated.']],
    ['Two idiots who somehow became friends', ['System agrees. 😂', 'No further investigation required.']],
    ['I regret everything', ['Too late.', 'There is no unsubscribe button. 💀']]
  ]
};

function updateHud(name = levelNames[currentLevel - 1]) {
  levelLabel.textContent = `LEVEL ${String(currentLevel).padStart(2, '0')} / 09`;
  levelName.textContent = name;
  progressFill.style.width = `${(currentLevel / 9) * 100}%`;
}

function setScreen(markup, status = 'AWAITING PLAYER INPUT') {
  screen.innerHTML = `<div class="view">${markup}</div>`;
  footerStatus.textContent = status;
}

function optionButtons(items, handler) {
  return `<div class="options">${items.map((item, index) => `<button class="option" data-choice="${index}"><span class="number">0${index + 1}</span>${item[0]}</button>`).join('')}</div>`;
}

function bindChoices(items, handler) {
  document.querySelectorAll('[data-choice]').forEach(button => {
    button.addEventListener('click', () => handler(items[Number(button.dataset.choice)]));
  });
}

function responseBox(lines, next) {
  const message = lines.map(line => `<p>${line}</p>`).join('');
  return `<div class="response">${message}</div><div class="action-row"><button class="action-btn" id="continue-btn">CONTINUE <span aria-hidden="true">→</span></button></div>`;
}

function advance(level, render) {
  currentLevel = level;
  selectedResponse = null;
  updateHud();
  render();
}

function showBoot() {
  currentLevel = 1;
  updateHud();
  setScreen(`<div class="card hero-card"><p class="eyebrow">⚠ SYSTEM INITIALIZING...</p><p class="type-line">Searching for player<span class="blink">_</span></p><div class="loading-box"><div class="loading-line"><span>NETWORK SCAN</span><span id="boot-percent">00%</span></div><div class="mini-track"><div class="mini-fill" id="boot-fill"></div></div></div></div>`, 'SCANNING PLAYER DATABASE');
  const fill = document.querySelector('#boot-fill');
  const percent = document.querySelector('#boot-percent');
  setTimeout(() => { fill.style.width = '100%'; percent.textContent = '100%'; }, 500);
  setTimeout(showIdentity, 2050);
}

function showIdentity() {
  setScreen(`<div class="card hero-card"><p class="eyebrow">✓ PLAYER FOUND / MATCH 99.8%</p><h1>HELLO, <span class="accent">CHASMIS.</span></h1><div class="data-grid"><div class="data-cell"><span class="data-label">PLAYER</span><span class="data-value cyan">CHASMIS</span></div><div class="data-cell"><span class="data-label">STATUS</span><span class="data-value green">ONLINE</span></div><div class="data-cell"><span class="data-label">TYPE</span><span class="data-value">GAMER</span></div><div class="data-cell"><span class="data-label">THREAT LEVEL</span><span class="data-value yellow">QUESTIONABLE</span></div><div class="data-cell"><span class="data-label">ROASTING LEVEL</span><span class="data-value red">EXTREME</span></div><div class="data-cell"><span class="data-label">REAL NAME</span><span class="data-value purple">██████████ / CLASSIFIED</span></div></div><p class="question">Are you actually Chasmis?</p>${optionButtons(choices.identity, () => {})}</div>`);
  bindChoices(choices.identity, choice => {
    const card = document.querySelector('.hero-card');
    card.insertAdjacentHTML('beforeend', responseBox(choice[1], 2));
    document.querySelectorAll('[data-choice]').forEach(button => button.disabled = true);
    document.querySelector('#continue-btn').addEventListener('click', () => advance(2, showHuman));
  });
}

function showHuman() {
  setScreen(`<div class="card hero-card"><p class="eyebrow">LEVEL 02 // BIOLOGICAL CHECK</p><h2>HUMAN VERIFICATION 🧠</h2><p class="lede">Before we continue, we need to confirm you're actually human.</p><p class="question">Someone says: <strong>"One last game."</strong><br>What happens next?</p>${optionButtons(choices.human)}</div>`);
  bindChoices(choices.human, choice => { const card = document.querySelector('.hero-card'); card.insertAdjacentHTML('beforeend', responseBox(choice[1])); document.querySelectorAll('[data-choice]').forEach(button => button.disabled = true); document.querySelector('#continue-btn').addEventListener('click', () => advance(3, showRoast)); });
}

function showRoast() {
  setScreen(`<div class="card hero-card"><p class="eyebrow">LEVEL 03 // COMBAT ANALYTICS</p><h2>ROASTING SKILL ASSESSMENT 🔥</h2><p class="question"><strong>Be honest, Chasmis...</strong><br>Who is better at roasting the other person?</p>${optionButtons(choices.roast)}</div>`);
  bindChoices(choices.roast, choice => { const card = document.querySelector('.hero-card'); card.insertAdjacentHTML('beforeend', responseBox(choice[1])); document.querySelectorAll('[data-choice]').forEach(button => button.disabled = true); document.querySelector('#continue-btn').addEventListener('click', () => advance(4, showFriendship)); });
}

function showFriendship() {
  setScreen(`<div class="card hero-card"><p class="eyebrow">LEVEL 04 // ARCHIVE QUERY</p><h2>FRIENDSHIP DATABASE</h2><div class="loading-box"><div class="loading-line"><span id="archive-status">Searching friendship records...</span><span id="archive-percent">00%</span></div><div class="mini-track"><div class="mini-fill" id="archive-fill"></div></div></div><p class="question">How would you classify this friendship?</p><div id="friendship-options" class="muted">Decrypting available classifications...</div></div>`, 'SCANNING ROAST HISTORY');
  setTimeout(() => { document.querySelector('#archive-fill').style.width = '100%'; document.querySelector('#archive-percent').textContent = '100%'; document.querySelector('#archive-status').textContent = 'Records loaded.'; document.querySelector('#friendship-options').outerHTML = optionButtons(choices.friendship); bindChoices(choices.friendship, choice => { const card = document.querySelector('.hero-card'); card.insertAdjacentHTML('beforeend', responseBox(choice[1])); document.querySelectorAll('[data-choice]').forEach(button => button.disabled = true); document.querySelector('#continue-btn').addEventListener('click', () => advance(5, showGamingHistory)); }); }, 1500);
}

function showGamingHistory() {
  setScreen(`<div class="card hero-card"><p class="eyebrow">LEVEL 05 // BEHAVIORAL EVIDENCE</p><h2>PLAYER HISTORY LOG</h2><p class="lede">The system reviewed your known activities. The results are... concerning.</p><div class="data-grid"><div class="data-cell"><span class="data-label">GAMES STARTED</span><span class="data-value cyan">A LOT</span></div><div class="data-cell"><span class="data-label">GAMES FINISHED</span><span class="data-value red">DEBATABLE</span></div><div class="data-cell"><span class="data-label">TRASH TALK</span><span class="data-value green">ABOVE LIMIT</span></div><div class="data-cell"><span class="data-label">MYSTERY NAME</span><span class="data-value purple">STILL UNKNOWN</span></div></div><p class="question">Select the most accurate player description:</p><div class="options"><button class="option" data-history="0"><span class="number">01</span>Skilled gamer with excellent decisions</button><button class="option" data-history="1"><span class="number">02</span>Chaos with a headset</button><button class="option" data-history="2"><span class="number">03</span>Depends who is watching</button></div></div>`);
  document.querySelectorAll('[data-history]').forEach(button => button.addEventListener('click', () => { const lines = Number(button.dataset.history) === 0 ? ['Interesting claim.', 'The evidence has been forwarded to the comedy department. 💀'] : Number(button.dataset.history) === 1 ? ['Profile match confirmed.', 'A highly capable source of chaos. 😂'] : ['The correct answer is always "depends".', 'Your diplomatic skills are questionable but impressive.']; const card = document.querySelector('.hero-card'); card.insertAdjacentHTML('beforeend', responseBox(lines)); document.querySelectorAll('[data-history]').forEach(b => b.disabled = true); document.querySelector('#continue-btn').addEventListener('click', () => advance(6, showBirthdayProtocol)); }));
}

function showBirthdayProtocol() {
  setScreen(`<div class="card hero-card center"><p class="eyebrow">LEVEL 06 // UNAUTHORIZED DISCOVERY</p><h2>BIRTHDAY PROTOCOL DETECTED</h2><p class="lede">Wait. The database has found a critical event attached to this player.</p><div class="big-number">+1</div><p class="quote">A whole new level unlocked.<br><span class="green">Birthday status: dangerously celebrated.</span></p><div class="action-row"><button class="action-btn" id="protocol-btn">RUN CELEBRATION SCAN →</button></div></div>`);
  document.querySelector('#protocol-btn').addEventListener('click', () => advance(7, showFinalScan));
}

function showFinalScan() {
  setScreen(`<div class="card hero-card"><p class="eyebrow">LEVEL 07 // FINAL AUTHENTICATION</p><h2>CHECKING BIRTHDAY ELIGIBILITY...</h2><div class="loading-box"><p class="type-line">Scanning good vibes...<br>Counting laughs...<br>Validating roast immunity...<br>Locating the name we should use<span class="blink">_</span></p><div class="mini-track"><div class="mini-fill" id="final-fill"></div></div></div><div id="final-copy" class="response" style="display:none"><p>AUTHENTICATION COMPLETE. ✅</p><p>Chasmis has successfully passed every test.</p></div><div class="action-row" id="final-action" style="display:none"><button class="action-btn" id="unlock-btn">UNLOCK MESSAGE →</button></div></div>`, 'AUTHENTICATING');
  setTimeout(() => { document.querySelector('#final-fill').style.width = '100%'; }, 300);
  setTimeout(() => { document.querySelector('#final-copy').style.display = 'block'; document.querySelector('#final-action').style.display = 'flex'; footerStatus.textContent = 'ACCESS GRANTED'; document.querySelector('#unlock-btn').addEventListener('click', () => advance(8, showBirthday)); }, 1900);
}

function showBirthday() {
  setScreen(`<div class="card hero-card birthday"><p class="eyebrow">LEVEL 08 // TRANSMISSION RECEIVED</p><h1>HAPPY<br><span class="accent">BIRTHDAY,</span><br>CHASMIS! 🎉</h1><p class="lede">You survived the verification system, the allegations, and my extremely scientific testing. I hope your day is full of good games, terrible teammates, unforgettable laughs, and absolutely zero suspicious "one last game" promises.</p><p class="real-wish">Outside the game, I genuinely hope this year brings you lots of happiness, success, and people who make life feel lighter. 💚</p><p class="signature">// FROM YOUR FAVORITE ROASTING PARTNER</p><div class="action-row" style="justify-content:center"><button class="action-btn" id="name-btn">COMPLETE PLAYER PROFILE →</button></div></div>`, 'BIRTHDAY MESSAGE UNLOCKED');
  document.querySelector('#name-btn').addEventListener('click', () => advance(9, showNameRegistration));
}

function showNameRegistration() {
  setScreen(`<div class="card hero-card"><p class="eyebrow">LEVEL 09 // PROFILE SAVE</p><h2>ONE LAST MYSTERY.</h2><p class="lede">The birthday message has been delivered. The system is ready to save this player as a verified friend...</p><p class="quote"><span class="cyan">What name am I supposed to save you as? 😂</span></p><p class="warning-line">⚠ REAL NAME REQUIRED FOR PROFILE SAVE. REFUSAL WILL RESULT IN IMMEDIATE KICK FROM THE GAME.</p><form class="name-form" id="name-form"><input class="name-input" id="name-input" type="text" maxlength="32" autocomplete="off" placeholder="Enter your real name..."><button class="action-btn" type="submit">SAVE NAME</button></form><div id="save-result"></div></div>`);
  document.querySelector('#name-input').focus();
  document.querySelector('#name-form').addEventListener('submit', async event => {
    event.preventDefault();
    const input = document.querySelector('#name-input');
    const submitButton = event.target.querySelector('button');
    const name = input.value.trim();
    if (!name) {
      input.placeholder = 'The mystery continues... type something 😭';
      input.focus();
      return;
    }

    submitButton.disabled = true;
    if (NAME_SUBMISSION_ENDPOINT) {
      try {
        const response = await fetch(NAME_SUBMISSION_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({ name })
        });
        if (!response.ok) throw new Error('Name submission failed');
      } catch (error) {
        submitButton.disabled = false;
        document.querySelector('#save-result').innerHTML = '<div class="response"><p class="red">NAME COULD NOT BE SENT. PLEASE TRY AGAIN.</p></div>';
        return;
      }
    }

    localStorage.setItem('submittedPlayerName', name);
    document.querySelector('#save-result').innerHTML = `<div class="response"><p>PROFILE SAVED: ${escapeHtml(name.toUpperCase())} ✅</p><p>Alias: CHASMIS. Birthday status: LEGENDARY.</p><p>Thanks for being an absolute menace and a great friend. 😂</p></div>`;
    input.disabled = true;
    footerStatus.textContent = 'PROFILE SAVED / SESSION COMPLETE';
  });
}

function escapeHtml(value) { return value.replace(/[&<>'"]/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[character])); }

function createParticles() {
  const field = document.querySelector('#particle-field');
  for (let index = 0; index < 36; index += 1) { const particle = document.createElement('span'); particle.className = 'particle'; particle.style.left = `${Math.random() * 100}%`; particle.style.animationDuration = `${9 + Math.random() * 16}s`; particle.style.animationDelay = `${Math.random() * -20}s`; particle.style.opacity = `${.15 + Math.random() * .5}`; field.appendChild(particle); }
}

createParticles();
showBoot();
