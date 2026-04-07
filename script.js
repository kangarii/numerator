let currentView = "md";
let generatedData = [];

/* ---- Titik visual ---- */
function updateTitikVisual() {
  const n = Math.min(
    parseInt(document.getElementById("titikCount").value) || 1,
    50,
  );
  const vis = document.getElementById("titik-visual");
  vis.innerHTML = "";
  const show = Math.min(n, 14);
  for (let i = 1; i <= show; i++) {
    const d = document.createElement("div");
    d.className = "titik-dot";
    d.textContent = i;
    vis.appendChild(d);
  }
  if (n > 14) {
    const d = document.createElement("div");
    d.className = "titik-dot more";
    d.textContent = "+" + (n - 14);
    vis.appendChild(d);
  }
  updatePreviewFormat();
}

/* ---- Toggle affix ---- */
function toggleAffixSection() {
  const tog = document.getElementById("affix-toggle").checked;
  const sec = document.getElementById("affix-section");
  sec.classList.toggle("open", tog);
  updatePreviewFormat();
}

/* ---- Format preview ---- */
function updatePreviewFormat() {
  const start = parseInt(document.getElementById("startNum").value) || 1;
  const pf = document.getElementById("preview-format");
  if (pf) pf.value = formatNumber(start);
}
["startNum", "padding", "prefix", "suffix"].forEach((id) => {
  document.getElementById(id)?.addEventListener("input", updatePreviewFormat);
});

function formatNumber(n) {
  const pad = parseInt(document.getElementById("padding").value);
  const prefix = document.getElementById("prefix").value || "";
  const suffix = document.getElementById("suffix").value || "";
  const numStr = pad > 0 ? String(n).padStart(pad, "0") : String(n);
  return prefix + numStr + suffix;
}

/* ---- Generate ---- */
function generateNumbers() {
  const start = parseInt(document.getElementById("startNum").value);
  const rows = Math.min(
    parseInt(document.getElementById("sheetCount").value) || 1,
    2000,
  );
  const cols = Math.min(
    parseInt(document.getElementById("titikCount").value) || 1,
    50,
  );
  const step = Math.max(
    parseInt(document.getElementById("step").value) || 1,
    1,
  );

  if (isNaN(start)) {
    alert("Angka awal tidak valid.");
    return;
  }

  generatedData = [];
  for (let r = 0; r < rows; r++) {
    const row = [];
    for (let c = 0; c < cols; c++) {
      row.push(start + c * rows * step + r * step);
    }
    generatedData.push(row);
  }

  renderOutput(cols);
  updateStats(rows, cols, start, step);
  document.getElementById("btn-print").disabled = false;
  document.getElementById("total-label").textContent =
    (rows * cols).toLocaleString() + " nomor";
}

/* ---- Render ---- */
function renderOutput(cols) {
  document.getElementById("empty-state").style.display = "none";
  const tWrap = document.getElementById("table-wrap");
  const grid = document.getElementById("number-grid");
  const vcSingle = document.getElementById("view-controls-single");

  if (cols === 1) {
    tWrap.style.display = "none";
    grid.style.display = "grid";
    vcSingle.style.display = "flex";
    renderSingleGrid();
  } else {
    grid.style.display = "none";
    vcSingle.style.display = "none";
    tWrap.style.display = "block";
    renderTable(cols);
  }
  document.getElementById("stats-row").style.display = "flex";
}

function renderTable(cols) {
  const table = document.getElementById("nomor-table");
  table.innerHTML = "";

  /* thead */
  const thead = document.createElement("thead");
  const hrow = document.createElement("tr");
  const th0 = document.createElement("th");
  th0.className = "row-head";
  th0.textContent = "Lbr";
  hrow.appendChild(th0);
  for (let c = 0; c < cols; c++) {
    const th = document.createElement("th");
    th.textContent = "No" + (c + 1);
    hrow.appendChild(th);
  }
  thead.appendChild(hrow);
  table.appendChild(thead);

  /* tbody */
  const tbody = document.createElement("tbody");
  generatedData.forEach((row, ri) => {
    const tr = document.createElement("tr");
    tr.style.animationDelay = Math.min(ri * 0.008, 0.4) + "s";
    const td0 = document.createElement("td");
    td0.className = "row-num";
    td0.textContent = ri + 1;
    tr.appendChild(td0);
    row.forEach((num) => {
      const td = document.createElement("td");
      td.textContent = formatNumber(num);
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);
}

function renderSingleGrid() {
  const grid = document.getElementById("number-grid");
  grid.innerHTML = "";
  grid.className = "";
  if (currentView === "lg") {
    grid.style.gridTemplateColumns = "repeat(auto-fill, minmax(160px, 1fr))";
    grid.style.gap = "10px";
  } else if (currentView === "sm") {
    grid.style.gridTemplateColumns = "repeat(auto-fill, minmax(80px, 1fr))";
    grid.style.gap = "7px";
  } else {
    grid.style.gridTemplateColumns = "repeat(auto-fill, minmax(110px, 1fr))";
    grid.style.gap = "10px";
  }

  const cardClass =
    currentView === "lg" ? "large" : currentView === "sm" ? "small" : "";
  generatedData.forEach((row, i) => {
    const card = document.createElement("div");
    card.className = "num-card " + cardClass;
    card.style.animationDelay = Math.min(i * 0.015, 0.5) + "s";
    const seq = document.createElement("span");
    seq.className = "seq-num";
    seq.textContent = i + 1;
    const txt = document.createElement("span");
    txt.textContent = formatNumber(row[0]);
    card.appendChild(seq);
    card.appendChild(txt);
    grid.appendChild(card);
  });
}

function updateStats(rows, cols, start, step) {
  document.getElementById("stat-rows").textContent = rows.toLocaleString();
  document.getElementById("stat-cols").textContent = cols;
  document.getElementById("stat-total").textContent = (
    rows * cols
  ).toLocaleString();
  document.getElementById("stat-start").textContent = formatNumber(start);
  const lastNum = start + (cols - 1) * rows * step + (rows - 1) * step;
  document.getElementById("stat-end").textContent = formatNumber(lastNum);
}

/* ---- View toggle ---- */
function setView(v) {
  currentView = v;
  ["md", "lg", "sm"].forEach((k) => {
    document.getElementById("vbtn-" + k)?.classList.toggle("active", k === v);
  });
  if (
    generatedData.length &&
    parseInt(document.getElementById("titikCount").value) === 1
  ) {
    renderSingleGrid();
  }
}

/* ---- Reset ---- */
function resetAll() {
  document.getElementById("startNum").value = "0";
  document.getElementById("sheetCount").value = "0";
  document.getElementById("step").value = "1";
  document.getElementById("titikCount").value = "0";
  document.getElementById("padding").value = "0";
  document.getElementById("prefix").value = "";
  document.getElementById("suffix").value = "";
  document.getElementById("raw-output").value = "";
  document.getElementById("affix-toggle").checked = false;
  document.getElementById("affix-section").classList.remove("open");
  document.getElementById("preview-format").value = "";
  document.getElementById("table-wrap").style.display = "none";
  document.getElementById("number-grid").style.display = "none";
  document.getElementById("empty-state").style.display = "flex";
  document.getElementById("stats-row").style.display = "none";
  document.getElementById("btn-print").disabled = true;
  document.getElementById("total-label").textContent = "";
  document.getElementById("view-controls-single").style.display = "none";
  generatedData = [];
  updateTitikVisual();
}

/* Init */
updateTitikVisual();
updatePreviewFormat();
function generateRawOutput() {
  if (!generatedData.length) {
    alert("Generate nomor dulu!");
    return;
  }

  const cols = parseInt(document.getElementById("titikCount").value);
  const raw = document.getElementById("raw-output");

  let lines = [];

  // HEADER
  let header = cols + "\n";

  for (let c = 0; c < cols; c++) {
    header += "\\No" + (c + 1) + "\\";
  }

  lines.push(header);

  // DATA
  generatedData.forEach((row) => {
    let line = "";
    row.forEach((num) => {
      line += "\\" + formatNumber(num) + "\\";
    });
    lines.push(line);
  });

  raw.value = lines.join("\n");
  raw.style.display = "block";

  // auto select biar tinggal copy
  raw.focus();
  raw.select();
}
