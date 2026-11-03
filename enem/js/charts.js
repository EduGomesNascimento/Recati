/* ============================================================
   CHARTS — gráficos SVG feitos à mão (sem bibliotecas).
   Paleta categórica validada (dataviz). Superfície clara.
   Marcas finas, gridlines discretas, rótulos diretos, hover.
   ============================================================ */
window.Charts = (function () {
  const COR = {
    s1: "#2a78d6", s2: "#1baf7a", s3: "#eda100", s4: "#008300",
    s5: "#4a3aa7", s6: "#e34948", s7: "#e87ba4", s8: "#eb6834",
    ink: "#1c1b22", ink2: "#52514e", mute: "#898781",
    grid: "#e7e6ef", baseline: "#c9c8d4", roxo: "#6c4ad0", verde: "#17b978", vermelho: "#e34948"
  };
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  // ---- tooltip único ----
  let tip;
  function ensureTip() {
    if (!tip) {
      tip = document.createElement("div");
      tip.className = "viz-tooltip hidden";
      document.body.appendChild(tip);
    }
    return tip;
  }
  function showTip(html, x, y) {
    const t = ensureTip();
    t.innerHTML = html; t.classList.remove("hidden");
    t.style.left = Math.min(x + 14, window.innerWidth - 200) + "px";
    t.style.top = (y - 10) + "px";
  }
  function hideTip() { if (tip) tip.classList.add("hidden"); }

  function wrap(svg, legenda) {
    let leg = "";
    if (legenda && legenda.length) {
      leg = '<div class="viz-legenda">' + legenda.map(l =>
        `<span class="item"><span class="swatch" style="background:${l.cor}"></span>${esc(l.nome)}</span>`).join("") + "</div>";
    }
    return `<div class="viz">${svg}${leg}</div>`;
  }

  /* ---------- GRÁFICO DE BARRAS (horizontais) ----------
     dados: [{r: rótulo, v: valor}], opts: {titulo, sufixo, cor, max} */
  function barras(dados, opts = {}) {
    const W = 520, rowH = 40, padL = 130, padR = 60, padT = 34, padB = 12;
    const H = padT + dados.length * rowH + padB;
    const max = opts.max || Math.max(...dados.map(d => d.v), 1);
    const cor = opts.cor || COR.roxo;
    const sufixo = opts.sufixo || "";
    const plotW = W - padL - padR;
    let bars = "";
    dados.forEach((d, i) => {
      const y = padT + i * rowH;
      const w = Math.max(3, (d.v / max) * plotW);
      const barY = y + 8, barH = 18;
      bars += `<text x="${padL - 10}" y="${barY + 14}" text-anchor="end" font-size="12" fill="${COR.ink2}">${esc(d.r)}</text>`;
      bars += `<rect x="${padL}" y="${barY}" width="${w}" height="${barH}" rx="6" fill="${cor}"
                 tabindex="0" role="img" aria-label="${esc(d.r)}: ${d.v}${sufixo}"
                 onmousemove="Charts._tip(event,'${esc(d.r)}: <b>${d.v}${sufixo}</b>')" onmouseleave="Charts._hide()"></rect>`;
      bars += `<text x="${padL + w + 8}" y="${barY + 14}" font-size="12" font-weight="700" fill="${COR.ink}">${d.v}${sufixo}</text>`;
    });
    const titulo = opts.titulo ? `<text x="0" y="18" font-size="14" font-weight="800" fill="${COR.ink}">${esc(opts.titulo)}</text>` : "";
    const svg = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(opts.titulo || "Gráfico de barras")}">${titulo}${bars}</svg>`;
    return wrap(svg);
  }

  /* ---------- CURVA DE APRENDIZAGEM (linha) ----------
     pontos: [{x: rótulo, v: valor%}], opts {titulo} */
  function linha(pontos, opts = {}) {
    const W = 560, H = 260, padL = 44, padR = 20, padT = 34, padB = 40;
    const plotW = W - padL - padR, plotH = H - padT - padB;
    const cor = opts.cor || COR.roxo;
    const n = pontos.length;
    if (n === 0) return wrap(`<svg viewBox="0 0 ${W} ${H}"></svg>`);
    const xAt = i => padL + (n === 1 ? plotW / 2 : (i / (n - 1)) * plotW);
    const yAt = v => padT + plotH - (v / 100) * plotH;

    // grid horizontal 0..100
    let grid = "";
    [0, 25, 50, 75, 100].forEach(g => {
      const y = yAt(g);
      grid += `<line x1="${padL}" y1="${y}" x2="${W - padR}" y2="${y}" stroke="${COR.grid}" stroke-width="1"/>`;
      grid += `<text x="${padL - 8}" y="${y + 4}" text-anchor="end" font-size="11" fill="${COR.mute}">${g}%</text>`;
    });

    // área + linha
    let path = "", area = "";
    pontos.forEach((p, i) => {
      const x = xAt(i), y = yAt(p.v);
      path += (i === 0 ? "M" : "L") + x + " " + y + " ";
    });
    area = `M${xAt(0)} ${yAt(0)} ` + pontos.map((p, i) => `L${xAt(i)} ${yAt(p.v)}`).join(" ") + ` L${xAt(n - 1)} ${yAt(0)} Z`;

    let dots = "", labels = "";
    pontos.forEach((p, i) => {
      const x = xAt(i), y = yAt(p.v);
      dots += `<circle cx="${x}" cy="${y}" r="5" fill="${cor}" stroke="#fff" stroke-width="2"
                tabindex="0" role="img" aria-label="${esc(p.x)}: ${p.v}%"
                onmousemove="Charts._tip(event,'${esc(p.x)}: <b>${p.v}%</b>')" onmouseleave="Charts._hide()"></circle>`;
      labels += `<text x="${x}" y="${H - padB + 16}" text-anchor="middle" font-size="10" fill="${COR.mute}">${esc(p.x)}</text>`;
    });
    // rótulo direto no último ponto
    const last = pontos[n - 1];
    const lx = xAt(n - 1), ly = yAt(last.v);
    const dirLabel = `<text x="${Math.min(lx, W - padR - 26)}" y="${ly - 12}" text-anchor="middle" font-size="12" font-weight="800" fill="${cor}">${last.v}%</text>`;

    const titulo = opts.titulo ? `<text x="0" y="18" font-size="14" font-weight="800" fill="${COR.ink}">${esc(opts.titulo)}</text>` : "";
    const svg = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(opts.titulo || "Curva de aprendizagem")}">
      ${titulo}${grid}
      <path d="${area}" fill="${cor}" opacity="0.10"/>
      <path d="${path}" fill="none" stroke="${cor}" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>
      ${dots}${labels}${dirLabel}
    </svg>`;
    return wrap(svg);
  }

  /* ---------- RADAR (proficiência por área) ----------
     eixos: [{nome, v(0-100), cor}] */
  function radar(eixos, opts = {}) {
    const size = 300, cx = size / 2, cy = size / 2 + 6, R = 100;
    const n = eixos.length;
    if (n < 3) return barras(eixos.map(e => ({ r: e.nome, v: e.v })), { titulo: opts.titulo, sufixo: "%", cor: COR.roxo });
    const ang = i => (Math.PI * 2 * i / n) - Math.PI / 2;
    const pt = (i, r) => [cx + Math.cos(ang(i)) * r, cy + Math.sin(ang(i)) * r];

    // anéis
    let rings = "";
    [0.25, 0.5, 0.75, 1].forEach(f => {
      const pts = eixos.map((_, i) => pt(i, R * f).join(",")).join(" ");
      rings += `<polygon points="${pts}" fill="none" stroke="${COR.grid}" stroke-width="1"/>`;
    });
    // raios + rótulos
    let spokes = "";
    eixos.forEach((e, i) => {
      const [x, y] = pt(i, R);
      const [lx, ly] = pt(i, R + 22);
      spokes += `<line x1="${cx}" y1="${cy}" x2="${x}" y2="${y}" stroke="${COR.grid}" stroke-width="1"/>`;
      const anchor = Math.abs(lx - cx) < 8 ? "middle" : (lx > cx ? "start" : "end");
      spokes += `<text x="${lx}" y="${ly}" text-anchor="${anchor}" font-size="10.5" font-weight="700" fill="${COR.ink2}">${esc(e.nome)}</text>`;
      spokes += `<text x="${lx}" y="${ly + 13}" text-anchor="${anchor}" font-size="10" fill="${COR.mute}">${e.v}%</text>`;
    });
    // polígono de dados
    const dpts = eixos.map((e, i) => pt(i, R * (e.v / 100)).join(",")).join(" ");
    let dmarks = "";
    eixos.forEach((e, i) => {
      const [x, y] = pt(i, R * (e.v / 100));
      dmarks += `<circle cx="${x}" cy="${y}" r="4" fill="${COR.roxo}" stroke="#fff" stroke-width="1.5"
                  tabindex="0" role="img" aria-label="${esc(e.nome)}: ${e.v}%"
                  onmousemove="Charts._tip(event,'${esc(e.nome)}: <b>${e.v}%</b>')" onmouseleave="Charts._hide()"></circle>`;
    });
    const titulo = opts.titulo ? `<text x="${cx}" y="16" text-anchor="middle" font-size="14" font-weight="800" fill="${COR.ink}">${esc(opts.titulo)}</text>` : "";
    const svg = `<svg viewBox="-58 0 ${size + 116} ${size + 24}" role="img" aria-label="${esc(opts.titulo || "Radar de proficiência")}">
      ${titulo}${rings}${spokes}
      <polygon points="${dpts}" fill="${COR.roxo}" fill-opacity="0.18" stroke="${COR.roxo}" stroke-width="2.5"/>
      ${dmarks}
    </svg>`;
    return wrap(svg);
  }

  /* ---------- DONUT de proficiência geral ---------- */
  function donut(pct, opts = {}) {
    const size = 160, cx = size / 2, cy = size / 2, r = 62, sw = 16;
    const c = 2 * Math.PI * r;
    const off = c * (1 - pct / 100);
    const cor = pct >= 70 ? COR.verde : pct >= 45 ? COR.s3 : COR.vermelho;
    const svg = `<svg viewBox="0 0 ${size} ${size}" role="img" aria-label="Proficiência ${pct}%">
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${COR.grid}" stroke-width="${sw}"/>
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${cor}" stroke-width="${sw}"
        stroke-dasharray="${c}" stroke-dashoffset="${off}" stroke-linecap="round"
        transform="rotate(-90 ${cx} ${cy})"/>
      <text x="${cx}" y="${cy - 2}" text-anchor="middle" font-size="30" font-weight="800" fill="${COR.ink}">${pct}%</text>
      <text x="${cx}" y="${cy + 18}" text-anchor="middle" font-size="11" fill="${COR.mute}">${esc(opts.rotulo || "preparo")}</text>
    </svg>`;
    return `<div class="viz" style="max-width:180px;margin:0 auto">${svg}</div>`;
  }

  /* ---------- Parábola (didática, lição de função) ---------- */
  function parabola(opts = {}) {
    const W = 420, H = 240, padL = 30, padB = 30, padT = 20, padR = 20;
    const plotW = W - padL - padR, plotH = H - padT - padB;
    // f(x) = -x^2 + 8x - 7, vértice em x=4
    const f = x => -x * x + 8 * x - 7;
    const xmin = 0, xmax = 8, ymin = -8, ymax = 10;
    const X = x => padL + ((x - xmin) / (xmax - xmin)) * plotW;
    const Y = y => padT + plotH - ((y - ymin) / (ymax - ymin)) * plotH;
    let path = "";
    for (let x = xmin; x <= xmax; x += 0.2) {
      path += (x === xmin ? "M" : "L") + X(x).toFixed(1) + " " + Y(f(x)).toFixed(1) + " ";
    }
    const vx = 4, vy = f(4);
    const eixoX = `<line x1="${padL}" y1="${Y(0)}" x2="${W - padR}" y2="${Y(0)}" stroke="${COR.baseline}" stroke-width="1.5"/>`;
    const eixoY = `<line x1="${X(0)}" y1="${padT}" x2="${X(0)}" y2="${H - padB}" stroke="${COR.baseline}" stroke-width="1.5"/>`;
    const vert = `<circle cx="${X(vx)}" cy="${Y(vy)}" r="5" fill="${COR.vermelho}" stroke="#fff" stroke-width="2"/>
      <text x="${X(vx)}" y="${Y(vy) - 10}" text-anchor="middle" font-size="11" font-weight="800" fill="${COR.vermelho}">vértice (4, ${vy})</text>`;
    const titulo = opts.titulo ? `<text x="0" y="14" font-size="13" font-weight="800" fill="${COR.ink}">${esc(opts.titulo)}</text>` : "";
    const svg = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Parábola">
      ${titulo}${eixoX}${eixoY}
      <path d="${path}" fill="none" stroke="${COR.roxo}" stroke-width="2.5"/>
      ${vert}
    </svg>`;
    return `<div class="viz">${svg}</div>`;
  }

  return {
    barras, linha, radar, donut, parabola, cores: COR,
    _tip: (e, html) => showTip(html, e.clientX, e.clientY),
    _hide: hideTip
  };
})();
