let clickCount = 0;
let upgradeLevel = 0;
let currentUpgradePrice = 10;
let timeLeft = 30;
let timerInterval = null;
let gameOver = false;
let clickTimestamps = [];
let cps = 0;
let clicksThisSecond = 0;
let lastSecondTime = 0;

const clickCountEl = document.getElementById('click-count');
const cpsEl = document.getElementById('cps');
const clickBtn = document.getElementById('click-btn');
const upgradePriceEl = document.getElementById('upgrade-price');
const timeEl = document.getElementById('time-left');
const resetBtn = document.getElementById('reset-btn');

function updateDisplay() {
  clickCountEl.textContent = clickCount;
  cpsEl.textContent = `CPS: ${cps.toFixed(1)}`;
  timeEl.textContent = `Time: ${timeLeft}s`;
}

function startTimer() {
  timeLeft = 30;
  clickTimestamps = [];
  cps = 0;
  clicksThisSecond = 0;
  gameOver = false;
  lastSecondTime = Date.now();
  
  timerInterval = setInterval(() => {
    timeLeft--;
    updateDisplay();
    checkSecondBoundary();
    if (timeLeft <= 0) {
      endGame();
    }
  }, 1000);
}

function checkSecondBoundary() {
  const now = Date.now();
  const secondsElapsed = Math.floor((now - lastSecondTime) / 1000);
  
  if (secondsElapsed >= 1) {
    cps = clicksThisSecond;
    clicksThisSecond = 0;
    lastSecondTime = now;
  }
}

function endGame() {
  gameOver = true;
  clearInterval(timerInterval);
  clearInterval(autoClickInterval);
  clickBtn.disabled = true;
  
  clickCountEl.textContent = clickCount;
  cpsEl.textContent = `Final CPS: ${cps.toFixed(1)}`;
  timeEl.textContent = 'Game Over!';
  upgradePriceEl.parentElement.parentElement.style.display = 'none';
}

function resetGame() {
  gameOver = false;
  clickCount = 0;
  upgradeLevel = 0;
  currentUpgradePrice = 10;
  timeLeft = 30;
  clearInterval(timerInterval);
  clearInterval(autoClickInterval);
  
  clickBtn.disabled = false;
  clickBtn.style.display = 'block';
  const upgradesDiv = document.querySelector('.upgrades');
  upgradesDiv.innerHTML = '';
  const upgradeDiv = document.createElement('div');
  upgradeDiv.className = 'upgrade';
  upgradeDiv.innerHTML = `
    <span>Auto-Clicker</span>
    <span class="price" id="upgrade-price">${currentUpgradePrice}</span>
  `;
  upgradeDiv.addEventListener('click', purchaseUpgrade);
  upgradesDiv.appendChild(upgradeDiv);
  
  updateDisplay();
  startTimer();
}

clickBtn.addEventListener('click', () => {
  if (gameOver) return;
  clickCount++;
  clicksThisSecond++;
  const now = Date.now();
  clickTimestamps.push(now);
  if (clickTimestamps.length > 100) clickTimestamps.shift();
  updateDisplay();
});

function purchaseUpgrade() {
  if (gameOver || clickCount < currentUpgradePrice) return;
  clickCount -= currentUpgradePrice;
  upgradeLevel++;
  cps += 1;
  currentUpgradePrice = Math.floor(10 * Math.pow(1.5, upgradeLevel));
  upgradePriceEl.textContent = currentUpgradePrice;
  updateDisplay();
  renderUpgradeButton();
}

function renderUpgradeButton() {
  const upgradesDiv = document.querySelector('.upgrades');
  upgradesDiv.innerHTML = '';
  const upgradeDiv = document.createElement('div');
  upgradeDiv.className = 'upgrade';
  upgradeDiv.innerHTML = `
    <span>Auto-Clicker (Lvl ${upgradeLevel})</span>
    <span class="price" id="upgrade-price">${currentUpgradePrice}</span>
  `;
  upgradeDiv.addEventListener('click', purchaseUpgrade);
  upgradesDiv.appendChild(upgradeDiv);
  
  if (upgradeLevel >= 1) {
    startAutoClicker();
  }
}

function startAutoClicker() {
  if (autoClickInterval) clearInterval(autoClickInterval);
  autoClickInterval = setInterval(() => {
    if (gameOver) return;
    clickCount++;
    clicksThisSecond++;
    const now = Date.now();
    clickTimestamps.push(now);
    if (clickTimestamps.length > 100) clickTimestamps.shift();
    updateDisplay();
  }, 1000 / cps);
}

updateDisplay();
startTimer();