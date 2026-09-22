(function() {
  const styles = `
    #mvp-overlay {
      position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
      background: rgba(0, 0, 0, 0.85); backdrop-filter: blur(8px);
      z-index: 99999; display: flex; align-items: center; justify-content: center;
      font-family: 'Trebuchet MS', Verdana, sans-serif;
      opacity: 0; pointer-events: none; transition: opacity 0.3s ease;
      color: #fff;
    }
    #mvp-overlay.visible {
      opacity: 1; pointer-events: all;
    }
    .mvp-modal {
      background: #111; border: 1px solid #333; border-radius: 16px;
      width: 90%; max-width: 500px; padding: 32px; box-shadow: 0 10px 40px rgba(0,0,0,0.5);
      position: relative; transform: translateY(20px); transition: transform 0.3s ease;
    }
    #mvp-overlay.visible .mvp-modal { transform: translateY(0); }
    .mvp-close {
      position: absolute; top: 16px; right: 20px; font-size: 24px; cursor: pointer; color: #888;
    }
    .mvp-close:hover { color: #fff; }
    .mvp-title { font-size: 24px; font-weight: bold; margin-bottom: 24px; text-align: center; }
    
    .wallet-btn {
      display: flex; align-items: center; justify-content: space-between;
      width: 100%; padding: 16px; background: #222; border: 1px solid #444;
      border-radius: 12px; margin-bottom: 12px; cursor: pointer; color: #fff;
      font-size: 16px; transition: all 0.2s;
    }
    .wallet-btn:hover { background: #333; border-color: #666; }
    
    .dashboard-container { display: none; }
    .signal-card {
      background: #1a1a1a; border: 1px solid #333; padding: 16px; border-radius: 12px; margin-bottom: 12px;
    }
    .signal-header { display: flex; justify-content: space-between; margin-bottom: 8px; color: #aaa; font-size: 14px;}
    .signal-value { font-size: 20px; font-weight: bold; color: #4ade80; }
    
    .api-response { background: #000; padding: 12px; border-radius: 8px; font-family: monospace; font-size: 12px; color: #a855f7; overflow-x: auto; margin-top: 16px;}
  `;

  const styleEl = document.createElement('style');
  styleEl.innerHTML = styles;
  document.head.appendChild(styleEl);

  const overlay = document.createElement('div');
  overlay.id = 'mvp-overlay';
  overlay.innerHTML = `
    <div class="mvp-modal">
      <div class="mvp-close">&times;</div>
      
      <!-- Connect Wallet State -->
      <div id="mvp-connect-state">
        <div class="mvp-title">Connect Wallet</div>
        <p style="text-align:center; color:#aaa; margin-bottom: 24px; font-size: 14px;">Identity Linking & Verification</p>
        <button class="wallet-btn" onclick="connectWallet('MetaMask')">
          <span>MetaMask</span> <span>🦊</span>
        </button>
        <button class="wallet-btn" onclick="connectWallet('Phantom')">
          <span>Phantom</span> <span>👻</span>
        </button>
        <button class="wallet-btn" onclick="connectWallet('WalletConnect')">
          <span>WalletConnect</span> <span>🔗</span>
        </button>
      </div>

      <!-- Dashboard State -->
      <div id="mvp-dashboard-state" class="dashboard-container">
        <div class="mvp-title">RepLayer Profile</div>
        <p style="text-align:center; color:#aaa; margin-bottom: 24px; font-size: 14px;">Wallet: <span id="wallet-address" style="color:#fff"></span></p>
        
        <div class="signal-card">
          <div class="signal-header"><span>Contribution History</span> <span>Verified by Github</span></div>
          <div class="signal-value">142 Commits (Top 5%)</div>
        </div>
        
        <div class="signal-card">
          <div class="signal-header"><span>Governance Participation</span> <span>Snapshot / Tally</span></div>
          <div class="signal-value">24 Proposals Voted</div>
        </div>
        
        <div class="signal-card">
          <div class="signal-header"><span>Reliability Score</span> <span>Onchain Tx Success</span></div>
          <div class="signal-value">99.8% Success Rate</div>
        </div>
        
        <p style="color:#aaa; font-size: 12px; margin-top: 24px;">API Integration Demo (GET /profile/0x...)</p>
        <div class="api-response">
{
  "address": "0x71C...976F",
  "signals": 3,
  "attestations": 12,
  "evidence": "EAS-verified"
}
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  let isConnected = false;

  window.connectWallet = function(name) {
    const btns = document.querySelectorAll('.wallet-btn');
    btns.forEach(b => b.style.opacity = '0.5');
    setTimeout(() => {
      document.getElementById('mvp-connect-state').style.display = 'none';
      document.getElementById('mvp-dashboard-state').style.display = 'block';
      document.getElementById('wallet-address').innerText = '0x71C...976F';
      isConnected = true;
      
      // Update the main UI buttons if possible
      document.querySelectorAll('button').forEach(btn => {
        if(btn.innerText.includes('Connect Wallet')) {
          btn.innerText = 'Dashboard';
        }
      });
    }, 800);
  };

  document.querySelector('.mvp-close').addEventListener('click', () => {
    overlay.classList.remove('visible');
  });

  // Intercept clicks on the page
  document.addEventListener('click', (e) => {
    // Check if clicked element or its parent is a button or link with specific text
    let target = e.target;
    while (target && target !== document.body) {
      if (target.tagName === 'BUTTON' || target.tagName === 'A') {
        const text = target.innerText || '';
        if (text.includes('Connect Wallet') || text.includes('Dashboard')) {
          e.preventDefault();
          e.stopPropagation();
          overlay.classList.add('visible');
          
          if (isConnected) {
            document.getElementById('mvp-connect-state').style.display = 'none';
            document.getElementById('mvp-dashboard-state').style.display = 'block';
          } else {
            document.getElementById('mvp-connect-state').style.display = 'block';
            document.getElementById('mvp-dashboard-state').style.display = 'none';
          }
          return;
        }
      }
      target = target.parentNode;
    }
  });

})();
