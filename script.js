/* ============================================
   Jugal Gajjar - Retro Platformer Portfolio JS
   Hand-drawn pixel art background scene
   ============================================ */

function updateClock() {
  var el = document.getElementById('menu-clock');
  if (el) {
    var now = new Date();
    var h = now.getHours() % 12 || 12;
    var m = String(now.getMinutes()).padStart(2, '0');
    el.textContent = h + ':' + m + (now.getHours() >= 12 ? 'PM' : 'AM');
  }
  var hud = document.getElementById('hud-time');
  if (hud) {
    var n = new Date();
    var hh = String(n.getHours()).padStart(2, '0');
    var mm = String(n.getMinutes()).padStart(2, '0');
    hud.textContent = hh + ':' + mm;
  }
}

function initVisitorCount() {
  var el = document.getElementById('hud-coins');
  if (!el) return;
  var count = parseInt(localStorage.getItem('mario_visits') || '0', 10);
  if (!sessionStorage.getItem('mario_counted')) {
    count++;
    localStorage.setItem('mario_visits', count);
    sessionStorage.setItem('mario_counted', '1');
  }
  el.textContent = 'x' + String(count).padStart(2, '0');
}

function initMobileMenu() {
  var btn = document.getElementById('hamburger-toggle');
  var nav = document.getElementById('mobile-nav');
  if (!btn || !nav) return;
  btn.addEventListener('click', function(e) { e.stopPropagation(); nav.classList.toggle('active'); });
  document.addEventListener('click', function(e) { if (!nav.contains(e.target) && e.target !== btn) nav.classList.remove('active'); });
}

function initWindowControls() {
  // Red - close (hide window, show reopen button)
  document.querySelectorAll('.traffic-light.close').forEach(function(b) {
    b.addEventListener('click', function() {
      var w = b.closest('.mac-window');
      if (w) {
        w.style.transition = 'all 0.3s';
        w.style.opacity = '0';
        w.style.transform = 'scale(0.9)';
        setTimeout(function() {
          w.style.display = 'none';
          // Show reopen button
          var reopen = document.createElement('div');
          reopen.className = 'reopen-btn';
          reopen.textContent = 'REOPEN';
          reopen.onclick = function() {
            w.style.display = '';
            w.style.opacity = '1';
            w.style.transform = 'scale(1)';
            reopen.remove();
          };
          w.parentNode.insertBefore(reopen, w.nextSibling);
        }, 300);
      }
    });
  });

  // Yellow - minimize (collapse body)
  document.querySelectorAll('.traffic-light.minimize').forEach(function(b) {
    b.addEventListener('click', function() {
      var w = b.closest('.mac-window');
      if (!w) return;
      var body = w.querySelector('.mac-body');
      var status = w.querySelector('.status-bar');
      if (body) body.style.display = body.style.display === 'none' ? '' : 'none';
      if (status) status.style.display = status.style.display === 'none' ? '' : 'none';
    });
  });

  // Green - fullscreen toggle
  document.querySelectorAll('.traffic-light.maximize').forEach(function(b) {
    b.addEventListener('click', function() {
      var w = b.closest('.mac-window');
      if (!w) return;
      if (w.classList.contains('fullscreen')) {
        // Exit fullscreen
        w.classList.remove('fullscreen');
        w.style.cssText = '';
      } else {
        // Enter fullscreen
        w.classList.add('fullscreen');
      }
    });
  });
}

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(function(a) {
    a.addEventListener('click', function(e) {
      var t = document.querySelector(a.getAttribute('href'));
      if (t) { e.preventDefault(); t.scrollIntoView({behavior:'smooth'}); }
    });
  });
}

function highlightActiveNav() {
  var page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.finder-nav a').forEach(function(a) {
    if ((a.getAttribute('href')||'').split('/').pop() === page) a.classList.add('active');
  });
}

/* ═══════════════════════════════════════════
   SPAWN SCENERY
   ═══════════════════════════════════════════ */

function spawnClouds() {
  for (var i = 1; i <= 5; i++) {
    var c = document.createElement('div');
    c.className = 'cloud cloud' + i;
    c.innerHTML = '<div class="cloud-pixels"></div>';
    document.body.appendChild(c);
  }
}

function spawnHills() {
  if (window.innerWidth < 768) return;
  var big = document.createElement('div');
  big.className = 'hill hill-big';
  big.innerHTML = '<div class="hill-pixels-big"></div>';
  document.body.appendChild(big);
  var sm = document.createElement('div');
  sm.className = 'hill hill-small';
  sm.innerHTML = '<div class="hill-pixels-small"></div>';
  document.body.appendChild(sm);
}

function spawnPipes() {
  if (window.innerWidth < 768) return;
  var pipeL = document.createElement('div');
  pipeL.className = 'pipe-deco pipe-l';
  pipeL.innerHTML = '<div class="pipe-top"></div><div class="pipe-body"></div>';
  document.body.appendChild(pipeL);
  var pipeR = document.createElement('div');
  pipeR.className = 'pipe-deco pipe-r';
  pipeR.innerHTML = '<div class="pipe-top"></div><div class="pipe-body"></div>';
  document.body.appendChild(pipeR);
}

function spawnBlocks() {
  if (window.innerWidth < 768) return;
  ['q1','q2','q3'].forEach(function(cls) {
    var q = document.createElement('div');
    q.className = 'q-block ' + cls;
    q.textContent = '?';
    document.body.appendChild(q);
  });
  ['bb1','bb2'].forEach(function(cls) {
    var b = document.createElement('div');
    b.className = 'brick-block ' + cls;
    document.body.appendChild(b);
  });
}

function spawnCoins() {
  function create() {
    var c = document.createElement('div');
    c.className = 'floating-coin';
    c.textContent = '●';
    c.style.left = (8 + Math.random() * 84) + 'vw';
    c.style.animationDuration = (14 + Math.random() * 16) + 's';
    c.style.fontSize = (8 + Math.random() * 8) + 'px';
    document.body.appendChild(c);
    setTimeout(function() { if (c.parentNode) c.remove(); }, 35000);
  }
  for (var i = 0; i < 3; i++) setTimeout(create, i * 5000);
  setInterval(create, 7000);
}

function initCoinBurst() {
  document.querySelectorAll('.mac-btn').forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      for (var i = 0; i < 4; i++) {
        var s = document.createElement('div');
        s.textContent = '●';
        s.style.cssText = 'position:fixed;z-index:9999;pointer-events:none;font-size:12px;color:#F8B800;font-family:"Press Start 2P",monospace;transition:all 0.4s ease-out;text-shadow:0 0 4px #F8B800;';
        s.style.left = (e.clientX + (Math.random()*30-15)) + 'px';
        s.style.top = e.clientY + 'px';
        document.body.appendChild(s);
        (function(el, dy) {
          setTimeout(function() { el.style.transform='translateY(-'+dy+'px)'; el.style.opacity='0'; }, 15);
          setTimeout(function() { el.remove(); }, 500);
        })(s, 25 + Math.random()*35);
      }
    });
  });
}

function initScrollReveal() {
  var obs = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (e.isIntersecting) { e.target.style.opacity='1'; e.target.style.transform='translateY(0)'; }
    });
  }, { threshold: 0.08 });
  document.querySelectorAll('.y2k-card, .exp-card, .pub-list li, .guestbook-entry, .pub-detail, .contact-box, .project-detail').forEach(function(el) {
    el.style.opacity = '0';
    el.style.transform = 'translateY(16px)';
    el.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
    obs.observe(el);
  });
}

function gameStartup() {
  var o = document.createElement('div');
  o.style.cssText = 'position:fixed;inset:0;background:#000;z-index:9999;display:flex;align-items:center;justify-content:center;flex-direction:column;transition:opacity 0.6s;';
  o.innerHTML =
    '<div style="font-family:\'Press Start 2P\',monospace;font-size:14px;color:#F8B800;margin-bottom:20px;text-shadow:3px 3px 0 #D82800;">SUPER PORTFOLIO BROS.</div>' +
    '<div style="font-family:\'Press Start 2P\',monospace;font-size:10px;color:#FCF8FC;margin-bottom:24px;">WORLD 1-1</div>' +
    '<div style="width:200px;height:10px;border:3px solid #E89000;background:#000;overflow:hidden;">' +
    '<div id="boot-bar" style="height:100%;width:0%;background:#00A800;transition:width 1.2s;"></div></div>';
  document.body.appendChild(o);
  setTimeout(function() { var b = document.getElementById('boot-bar'); if (b) b.style.width='100%'; }, 100);
  setTimeout(function() { o.style.opacity='0'; setTimeout(function(){o.remove();},600); }, 2000);
}

/* ═══════════════════════════════════════════
   INIT
   ═══════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', function() {
  if (!sessionStorage.getItem('mario_booted')) {
    gameStartup();
    sessionStorage.setItem('mario_booted', '1');
  }
  updateClock();
  setInterval(updateClock, 30000);
  initVisitorCount();
  initMobileMenu();
  initWindowControls();
  initSmoothScroll();
  highlightActiveNav();
  spawnClouds();
  spawnHills();
  spawnPipes();
  spawnBlocks();
  spawnCoins();
  initCoinBurst();
  setTimeout(initScrollReveal, 400);
});

/* ═══════════════════════════════════════════
   CHATBOT UI (logic in chatbot.js)
   ═══════════════════════════════════════════ */
var chatOpen = false;

function toggleChat() {
  chatOpen = !chatOpen;
  var win = document.getElementById('chat-window');
  var tog = document.getElementById('chat-toggle');
  if (win) win.classList.toggle('open', chatOpen);
  if (tog) tog.style.display = chatOpen ? 'none' : 'flex';
  if (chatOpen) {
    var inp = document.getElementById('chat-input');
    if (inp) setTimeout(function() { inp.focus(); }, 100);
  }
}

function sendChat() {
  var inp = document.getElementById('chat-input');
  var body = document.getElementById('chat-body');
  if (!inp || !body) return;
  var q = inp.value.trim();
  if (!q) return;
  inp.value = '';

  // User message
  var uDiv = document.createElement('div');
  uDiv.className = 'chat-msg user';
  uDiv.textContent = q;
  body.appendChild(uDiv);
  body.scrollTop = body.scrollHeight;

  // Typing indicator
  var typing = document.createElement('div');
  typing.className = 'chat-msg bot';
  typing.textContent = '...';
  typing.style.opacity = '0.5';
  body.appendChild(typing);
  body.scrollTop = body.scrollHeight;

  // Get answer (async - supports Groq LLM)
  if (window.portfolioChatbot) {
    var result = window.portfolioChatbot.ask(q);
    // Handle both async (Promise) and sync responses
    if (result && typeof result.then === 'function') {
      result.then(function(answer) {
        typing.textContent = answer;
        typing.style.opacity = '1';
        body.scrollTop = body.scrollHeight;
      }).catch(function() {
        typing.textContent = 'Something went wrong. Try again!';
        typing.style.opacity = '1';
      });
    } else {
      typing.textContent = result || 'Chatbot loading...';
      typing.style.opacity = '1';
      body.scrollTop = body.scrollHeight;
    }
  } else {
    typing.textContent = 'Chatbot loading...';
    typing.style.opacity = '1';
  }
}
