const app = document.querySelector('#app');
const robot = 'assets/robot.webp';
const S = { screen: 'start', step: 0, hall: 0, clues: [], open: null, suspicion: null, plan: null };

const clue = {
  ledger: ['账本记录', '账上田庄铺子共值 12400 两，库房盘点只有现银 380 两。账房在旁批了一句：大头都压在收不回来的租子和卖不掉的陈货里。'],
  arrival: ['到款核对', '庄头送来欠条：5000 两租银因雨水晚到 20 天。欠条背后还有一行小字：此前已有两期拖延。'],
  cashier: ['账房问询', '账房支吾：中秋节礼 1200 两不能减，屋顶漏雨修缮 1000 两拖不得。追问之下才说：另有一笔 800 两旧借，下月初登门，此事未入正账。']
};

function start() {
  app.innerHTML = '<section class="screen start"><div class="topbar"><h1 class="title">工银金融<br>时空局</h1><p class="subtitle">进入历史，修复失衡的财富系统</p></div><div class="start-cta"><button data-a="launch">启动时空档案　›</button><p class="caption">参赛概念原型</p></div></section>';
}

function prologue() {
  app.innerHTML = `<section class="screen prologue"><div><div class="pulse"></div><h2>${S.step < 2 ? '时空档案已唤醒' : '正在检索历史财富系统……'}</h2><p>${S.step < 2 ? '正在验证调查权限……' : '检测到异常档案，信号来源未确认'}</p></div><button class="skip" data-a="hall">跳过序章</button></section>`;
  if (S.step < 4) setTimeout(() => { S.step++; render(); }, 1100);
  else setTimeout(() => { S.screen = 'hall'; S.hall = 0; render(); }, 700);
}

function hall() {
  const gate = S.hall < 2 ? `<div class="modal-layer"><div class="modal-card"><h2>${S.hall === 0 ? '身份确认' : '任务说明'}</h2><p>${S.hall === 0 ? '见习财富调查员' : '历史中的财富系统正在失衡，请进入不同世界调查异常原因。'}</p><button data-a="hall-next">${S.hall === 0 ? '确认身份' : '继续'}</button></div></div>` : '';
  const body = `<section class="screen hall ${S.hall < 2 ? 'gated' : ''}"><header class="hall-head"><h1 class="title">管理局大厅</h1><div class="identity"><span class="dot"></span>身份确认　见习财富调查员</div></header><div class="archive-list"><article class="archive primary"><h2>贾府现金流危机</h2><p class="alert">库银告急</p><p>贾府档案心跳异常，库银撑不过 9 天，请入府核查</p><button data-a="case">查看贾府档案　›</button></article><article class="archive muted"><h2>鲁滨逊岛资本实验</h2><p>档案封存</p></article><article class="archive muted"><h2>百万英镑信用迷局</h2><p>待解锁</p></article></div><div class="assistant"><div style="width:2.6rem;height:2.6rem;overflow:hidden;flex-shrink:0;border-radius:.5rem;background:rgba(255,255,255,.06);"><img src="${robot}" alt="工小智" style="display:block;width:5.2rem;max-width:none;height:2.6rem;object-fit:cover;object-position:left center;"></div><p>检测到贾府档案异常。<br>库银余额撑不过 9 天，请入府核查。</p></div></section>`;
  app.innerHTML = body + gate;
}

function caseBrief() {
  app.innerHTML = '<section class="screen hall"><div class="modal-layer"><div class="modal-card"><h2>贾府现金流危机</h2><p>任务：库银 380 两，10 天内要付 2200 两<br>目标：先撑过 9 天，再查清缺口</p><button data-a="jiafu">进入贾府</button></div></div></section>';
}

function jiafu() {
  const ids = ['ledger', 'arrival', 'cashier'];
  const names = ['查看账本', '核对到款', '询问账房'];
  const cls = ['one', 'two', 'three'];
  const buttons = ids.map((id, i) => `<button class="hotspot ${cls[i]} ${S.clues.includes(id) ? 'seen' : ''}" data-a="clue" data-id="${id}">${names[i]}${S.clues.includes(id) ? '　✓' : ''}</button>`).join('');
  const detail = S.open ? `<div class="clue-panel"><h3>${clue[S.open][0]}</h3><p>${clue[S.open][1]}</p><button data-a="close-clue">返回账房</button></div>` : '';
  let decision = '';
  if (S.clues.length === 3 && !S.open) {
    if (!S.suspicion) {
      decision = `<div class="decision-panel"><h3>线索已齐（3/3）</h3><p>库银 380 两，10 天要付 2200 两，5000 两 20 天后才到。你判断缺口的主因是？</p><div class="decision-options"><button data-a="choose">资产不足</button><button data-a="choose">收入不足</button><button data-a="choose">收支时间错配</button><button data-a="choose">日常支出过高</button></div></div>`;
    } else {
      decision = `<div class="decision-panel"><h3>判断已记录</h3><p>你怀疑：${S.suspicion}</p><p>已记录。账房只能先办一件事，下一幕看你的判断灵不灵，现在不判对错。</p><button data-a="act2">进入下一幕</button></div>`;
    }
  }
  const progress = S.clues.length < 3 ? `<div class="case-cta"><div style="text-align:center;padding:.8rem;border:.08rem solid #f0c889;border-radius:.35rem;background:rgba(143,63,49,.35);color:#fff1d8;font-size:1rem;">已验线索 ${S.clues.length}/3 · 集齐可作判断</div></div>` : '';
  app.innerHTML = `<section class="screen paper-screen"><header class="paper-head"><h1>贾府现金流危机</h1><p>第一幕 · 查清账目</p></header><div class="case-strip"><strong>现银待核对</strong><span>库银 380 两 · 10 天内要付 2200 两</span></div><div class="room-actions">${buttons}</div><div class="dialogue"><h3>账房先生</h3><p>不是没家底，是远水不解近渴。您先看账，我有些话等您看完再说。</p></div>${progress}${detail}${decision}</section>`;
}

function getResult() {
  if (S.suspicion === '收支时间错配' && S.plan === '优先催收应收款') {
    return { t: '阶段结果：抢回了时间', d: '追回 1500 两急用，节礼保住了。但庄头言明余款仍要 20 天，800 两暗借未解。', days: '9 天 → 15 天', gap: '2200 两 → 700 两', debt: '暗借已暴露，未解决' };
  }
  if (S.suspicion === '收支时间错配' && S.plan === '延后非必要支出') {
    return { t: '阶段结果：省出了时间', d: '节礼减半得罪亲戚，修缮压后漏雨加重。库银多撑 6 天，但 5000 两未到仍是空账。', days: '9 天 → 15 天', gap: '2200 两 → 1000 两', debt: '暗借已暴露，未解决' };
  }
  if (S.suspicion === '日常支出过高') {
    return { t: '阶段结果：支出压了，到款没动', d: '支出压了 600 两，可到款晚到一点没动。下月初 800 两暗借登门仍会爆雷。', days: '9 天 → 12 天', gap: '2200 两 → 1600 两', debt: '暗借将爆雷' };
  }
  return { t: '阶段结果：现钱多了，时间没买回来', d: '按你的意思卖陈货借新钱，现银多 800 两，但 7 天后利息到，缺口更大。账多了现钱，时间没买回来。', days: '9 天 → 11 天，7 天后付息', gap: '2200 两 → 1400 两 + 新利息', debt: '暗借未解 + 新增负债' };
}

function act2() {
  let content = '';
  if (!S.plan) {
    content = `<h2>调整周转</h2><p>已记录怀疑：${S.suspicion || ''}。账房只能优先处理一项，请结合线索作出决定。</p><button data-a="plan" data-plan="优先催收应收款">优先催收应收款</button><button data-a="plan" data-plan="延后非必要支出">延后非必要支出</button>`;
  } else {
    const r = getResult();
    content = `<h2>${r.t}</h2><p>${r.d}</p><div class="result-metric"><span>库银还能撑</span><strong>${r.days}</strong></div><div class="result-metric"><span>10 天内缺口</span><strong>${r.gap}</strong></div><div class="result-metric"><span>下月初暗借</span><strong>${r.debt}</strong></div><button data-a="review">进入复盘</button>`;
  }
  app.innerHTML = `<section class="screen paper-screen act2"><header class="paper-head"><h1>贾府现金流危机</h1><p>第二幕 · 调整周转</p></header><div class="case-strip"><strong>现银紧张</strong><span>远水不解近渴，先保 9 天不断付</span></div><div class="act2-card">${content}</div><div class="dialogue compact"><h3>账房先生</h3><p>催收是抢时间，压支出是省时间，卖产借钱是拿未来换现在。您选一条，我先去办。</p></div></section>`;
}

function review() {
  app.innerHTML = '<section class="screen paper-screen"><header class="paper-head"><h1>阶段复盘</h1><p>账面资产与可用现银</p></header><div class="act2-card"><h2>本阶段金融逻辑</h2><p>1. 你刚看到的：12400 两资产，380 两现银，账面富不等于手头有钱。<br>2. 你刚赌的：5000 两 20 天后到，2200 两 10 天内要付，差的就是时间。<br>3. 你刚选的：催收抢时间，压支出省时间，卖产借钱拿未来换现在。</p><p>这叫收支时间错配，也是家庭理财里应急金和期限错配的源头。如为真实家庭，建议先做资产诊断和目标规划，再谈产品。本案金额情节均为教学虚构。</p><button data-a="back-hall">返回管理局</button></div></section>';
}

function render() {
  if (S.screen === 'start') start();
  else if (S.screen === 'prologue') prologue();
  else if (S.screen === 'hall') hall();
  else if (S.screen === 'case') caseBrief();
  else if (S.screen === 'jiafu') jiafu();
  else if (S.screen === 'act2') act2();
  else review();
}

document.addEventListener('click', e => {
  const b = e.target.closest('[data-a]');
  if (!b) return;
  const a = b.dataset.a;
  if (a === 'launch') { S.screen = 'prologue'; S.step = 0; }
  else if (a === 'hall') { S.screen = 'hall'; S.hall = 0; }
  else if (a === 'hall-next') S.hall++;
  else if (a === 'case') S.screen = 'case';
  else if (a === 'jiafu') S.screen = 'jiafu';
  else if (a === 'clue') { if (!S.clues.includes(b.dataset.id)) S.clues.push(b.dataset.id); S.open = b.dataset.id; }
  else if (a === 'close-clue') S.open = null;
  else if (a === 'choose') S.suspicion = b.textContent.trim();
  else if (a === 'act2') S.screen = 'act2';
  else if (a === 'plan') { S.plan = b.dataset.plan; }
  else if (a === 'review') S.screen = 'review';
  else if (a === 'back-hall') { S.screen = 'hall'; S.hall = 2; }
  render();
});
render();
