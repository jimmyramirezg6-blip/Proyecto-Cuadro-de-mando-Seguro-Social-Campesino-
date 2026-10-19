const dashboard = window.SSC_DASHBOARD;
const records = dashboard.records;
const months = dashboard.months;
const dimensions = dashboard.dimensions;

const els = {
  month: document.getElementById('monthSelect'),
  zone: document.getElementById('zoneSelect'),
  province: document.getElementById('provinceSelect'),
  canton: document.getElementById('cantonSelect'),
  gender: document.getElementById('genderSelect'),
  status: document.getElementById('statusSelect'),
  metrics: document.getElementById('metrics'),
  provinceTable: document.getElementById('provinceTable'),
  cantonTable: document.getElementById('cantonTable'),
  genderBars: document.getElementById('genderBars'),
  statusBars: document.getElementById('statusBars'),
  trendTable: document.getElementById('trendTable'),
  selectionSummary: document.getElementById('selectionSummary'),
};

const fmt = new Intl.NumberFormat('es-EC');
const money = new Intl.NumberFormat('es-EC', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

function allOption(label) {
  return { value: '', label };
}

function setOptions(select, options, selected = '') {
  const current = selected || select.value || '';
  select.innerHTML = options.map((opt) => `<option value="${escapeHtml(opt.value)}">${escapeHtml(opt.label)}</option>`).join('');
  select.value = current && options.some((opt) => opt.value === current) ? current : '';
}

function escapeHtml(value) {
  return String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
}

function toFilterSet(values) {
  return new Set(values.filter(Boolean));
}

function getFilteredRecords() {
  return records.filter((record) => {
    if (els.zone.value && record.zone !== els.zone.value) return false;
    if (els.province.value && record.province !== els.province.value) return false;
    if (els.canton.value && record.canton !== els.canton.value) return false;
    if (els.gender.value && record.gender !== els.gender.value) return false;
    if (els.status.value && record.status !== els.status.value) return false;
    return true;
  });
}

function getMonthIndex() {
  return Math.max(0, months.indexOf(els.month.value || months[0]));
}

function sum(values) {
  return values.reduce((acc, value) => acc + value, 0);
}

function groupBy(field, filteredRecords, monthIndex) {
  const map = new Map();
  for (const record of filteredRecords) {
    const key = record[field];
    const bucket = map.get(key) || { name: key, volume: 0, jefe: 0, contribution: 0 };
    const value = record.months[monthIndex];
    bucket.volume += value;
    if (record.status === 'JEFE') {
      bucket.jefe += value;
      bucket.contribution += value * (record.aporte || 0);
    }
    map.set(key, bucket);
  }
  return [...map.values()].sort((a, b) => b.volume - a.volume);
}

function buildBars(items) {
  if (!items.length) {
    return '<div class="summary-note">Sin datos para la selección actual.</div>';
  }
  const total = sum(items.map((item) => item.volume));
  if (!total) {
    return '<div class="summary-note">Sin datos para la selección actual.</div>';
  }
  const max = Math.max(...items.map((item) => item.volume), 1);
  return items
    .filter((item) => item.volume > 0)
    .map(
      (item) => `
        <div class="bar-row">
          <div class="bar-label">${escapeHtml(item.name)}</div>
          <div class="bar-track"><div class="bar-fill" style="width:${(item.volume / max) * 100}%"></div></div>
          <div class="bar-value">${fmt.format(item.volume)} (${((item.volume / total) * 100).toFixed(1)}%)</div>
        </div>`,
    )
    .join('');
}

function renderMetricCards(volume, contribution, dependencyRatio, selectedLabel) {
  const cards = [
    {
      label: 'Volumen Total de Afiliados',
      value: fmt.format(volume),
      foot: `Mes y filtro actual: ${selectedLabel}`,
    },
    {
      label: 'Aportación Mensual Estimada',
      value: `$${money.format(contribution)}`,
      foot: 'Calculada sobre filas JEFE con aporte disponible.',
    },
    {
      label: 'Ratio de Dependencia',
      value: dependencyRatio == null ? 'N/D' : `${dependencyRatio.toFixed(2)}`,
      foot: 'Dependientes / JEFE en el contexto filtrado.',
    },
  ];
  els.metrics.innerHTML = cards
    .map(
      (card) => `
        <article class="metric">
          <div class="label">${escapeHtml(card.label)}</div>
          <div class="value">${escapeHtml(card.value)}</div>
          <div class="foot">${escapeHtml(card.foot)}</div>
        </article>`,
    )
    .join('');
}

function renderTable(target, rows) {
  target.innerHTML = rows
    .map(
      (row) => `
        <tr>
          <td>${escapeHtml(row.name)}</td>
          <td>${fmt.format(row.volume)}</td>
          <td>${(row.share * 100).toFixed(1)}%</td>
        </tr>`,
    )
    .join('');
}

function renderTrendTable(filteredRecords) {
  const rows = months.map((month, monthIndex) => {
    const monthVolume = sum(filteredRecords.map((record) => record.months[monthIndex]));
    const jefeVolume = sum(filteredRecords.filter((record) => record.status === 'JEFE').map((record) => record.months[monthIndex]));
    const contribution = sum(
      filteredRecords
        .filter((record) => record.status === 'JEFE' && record.aporte != null)
        .map((record) => record.months[monthIndex] * record.aporte),
    );
    const dependency = jefeVolume ? ((monthVolume - jefeVolume) / jefeVolume).toFixed(2) : 'N/D';
    return `
      <tr>
        <td>${escapeHtml(month)}</td>
        <td>${fmt.format(monthVolume)}</td>
        <td>$${money.format(contribution)}</td>
        <td>${dependency}</td>
      </tr>`;
  });
  els.trendTable.innerHTML = rows.join('');
}

function updateLocationOptions() {
  const zoneValue = els.zone.value;
  const provinceValue = els.province.value;

  const zoneOptions = [allOption('Nacional'), ...dimensions.zones.map((zone) => ({ value: zone, label: `Zona ${zone}` }))];
  setOptions(els.zone, zoneOptions, zoneValue);

  const availableProvinces = zoneValue ? dimensions.provincesByZone[zoneValue] || [] : dimensions.provinces;
  const provinceOptions = [allOption('Todas las provincias'), ...availableProvinces.map((province) => ({ value: province, label: province }))];
  setOptions(els.province, provinceOptions, provinceValue);

  const resolvedProvince = els.province.value;
  const availableCantons = resolvedProvince
    ? dimensions.cantonsByProvince[resolvedProvince] || []
    : zoneValue
      ? [...new Set(records.filter((record) => record.zone === zoneValue).map((record) => record.canton))].sort()
      : dimensions.cantons;
  const cantonOptions = [allOption('Todos los cantones'), ...availableCantons.map((canton) => ({ value: canton, label: canton }))];
  setOptions(els.canton, cantonOptions, els.canton.value);
}

function updateOtherOptions() {
  setOptions(els.month, months.map((month) => ({ value: month, label: month })), els.month.value || months[0]);
  setOptions(els.gender, [allOption('Todos los géneros'), ...dimensions.genders.map((gender) => ({ value: gender, label: gender }))], els.gender.value);
  setOptions(els.status, [allOption('Todas las relaciones'), ...dimensions.statuses.map((status) => ({ value: status, label: status }))], els.status.value);
}

function selectedSummary(filteredRecords, monthLabel) {
  const current = [els.zone.value ? `Zona ${els.zone.value}` : 'Nacional'];
  if (els.province.value) current.push(els.province.value);
  if (els.canton.value) current.push(els.canton.value);
  if (els.gender.value) current.push(els.gender.value);
  if (els.status.value) current.push(els.status.value);
  current.push(monthLabel);
  els.selectionSummary.innerHTML = `
    <div class="summary-title">Contexto activo</div>
    <div class="summary-value">${escapeHtml(current.join(' · '))}</div>
    <div class="summary-note">${fmt.format(filteredRecords.length)} filas en el subconjunto actual.</div>
  `;
}

function render() {
  const monthIndex = getMonthIndex();
  const monthLabel = months[monthIndex];
  const filteredRecords = getFilteredRecords();
  const monthTotal = sum(filteredRecords.map((record) => record.months[monthIndex]));
  const jefeTotal = sum(filteredRecords.filter((record) => record.status === 'JEFE').map((record) => record.months[monthIndex]));
  const contribution = sum(
    filteredRecords
      .filter((record) => record.status === 'JEFE' && record.aporte != null)
      .map((record) => record.months[monthIndex] * record.aporte),
  );
  const dependencyRatio = jefeTotal ? (monthTotal - jefeTotal) / jefeTotal : null;

  const provinces = groupBy('province', filteredRecords, monthIndex);
  const cantons = groupBy('canton', filteredRecords, monthIndex);
  const genderGroups = groupBy('gender', filteredRecords, monthIndex);
  const statusGroups = groupBy('status', filteredRecords, monthIndex);

  renderMetricCards(monthTotal, contribution, dependencyRatio, `${monthLabel}`);
  renderTable(els.provinceTable, provinces.slice(0, 10).map((item) => ({ ...item, share: monthTotal ? item.volume / monthTotal : 0 })));
  renderTable(els.cantonTable, cantons.slice(0, 10).map((item) => ({ ...item, share: monthTotal ? item.volume / monthTotal : 0 })));
  els.genderBars.innerHTML = buildBars(genderGroups.slice(0, 8));
  els.statusBars.innerHTML = buildBars(statusGroups.slice(0, 10));
  renderTrendTable(filteredRecords);
  selectedSummary(filteredRecords, monthLabel);
}

function handleTerritoryChange() {
  const previousProvince = els.province.value;
  const previousCanton = els.canton.value;
  updateLocationOptions();
  if (previousProvince && ![...els.province.options].some((option) => option.value === previousProvince)) {
    els.province.value = '';
  }
  if (previousCanton && ![...els.canton.options].some((option) => option.value === previousCanton)) {
    els.canton.value = '';
  }
  render();
}

function init() {
  updateOtherOptions();
  updateLocationOptions();
  render();

  els.month.addEventListener('change', render);
  els.zone.addEventListener('change', handleTerritoryChange);
  els.province.addEventListener('change', handleTerritoryChange);
  els.canton.addEventListener('change', render);
  els.gender.addEventListener('change', render);
  els.status.addEventListener('change', render);
}

init();
