function pctClass(pct, threshold) {
  return pct < threshold ? 'low' : 'ok';
}

function barColor(pct, threshold) {
  return pct < threshold ? '#d92d20' : '#12b76a';
}

function attendanceAdvice(row, threshold) {
  var requiredRate = threshold / 100;

  if (row.pct >= threshold) {
    var canSkip = Math.max(0, Math.floor(row.present / requiredRate - row.total));
    return canSkip + (canSkip === 1 ? ' class' : ' classes') + ' can be skipped';
  }

  var classesToAttend = Math.ceil((requiredRate * row.total - row.present) / (1 - requiredRate));
  return 'Attend ' + classesToAttend + (classesToAttend === 1 ? ' class' : ' classes') + ' to reach ' + threshold + '%';
}

function renderEmpty(message) {
  document.getElementById('summary').style.display = 'none';
  document.getElementById('rows').innerHTML =
    '<div class="empty">' + message + '</div>';
}

function renderData(data, threshold) {
  if (!data.length) {
    renderEmpty('No attendance table found on this page.');
    return;
  }

  document.getElementById('updated').textContent =
    'Checked ' + new Date().toLocaleTimeString();

  var totalPresent = data.reduce(function (s, r) { return s + r.present; }, 0);
  var totalCount = data.reduce(function (s, r) { return s + r.total; }, 0);
  var overallPct = totalCount > 0 ? Math.round((totalPresent / totalCount) * 10000) / 100 : 0;
  var lowCount = data.filter(function (r) { return r.pct < threshold; }).length;

  document.getElementById('summary').style.display = 'flex';
  document.getElementById('summary').innerHTML =
    '<div class="stat"><div class="num">' + overallPct + '%</div><div class="label">Overall</div></div>' +
    '<div class="stat"><div class="num">' + data.length + '</div><div class="label">Subjects</div></div>' +
    '<div class="stat"><div class="num">' + lowCount + '</div><div class="label">Needs attention</div></div>';

  var html = data.map(function (r) {
    var cls = pctClass(r.pct, threshold);
    var color = barColor(r.pct, threshold);
    var width = Math.min(r.pct, 100);
    return (
      '<li class="row">' +
        '<div class="row-top">' +
          '<div>' +
            '<div class="subject">' + r.subject + '</div>' +
            '<div class="code">' + r.code + '</div>' +
          '</div>' +
          '<div class="pct ' + cls + '">' + r.pct + '%</div>' +
        '</div>' +
        '<div class="row-bottom">' + r.present + ' present · ' + r.absent + ' absent · ' + r.total + ' total</div>' +
        '<div class="row-bottom">' + attendanceAdvice(r, threshold) + '</div>' +
        '<div class="bar-track"><div class="bar-fill" style="width:' + width + '%;background:' + color + '"></div></div>' +
      '</li>'
    );
  }).join('');

  document.getElementById('rows').innerHTML = html;
}

renderEmpty('Checking page…');

chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
  var tab = tabs[0];
  if (!tab || !tab.id) {
    renderEmpty('No active tab found.');
    return;
  }

  chrome.tabs.sendMessage(tab.id, { type: 'EXTRACT_NOW' }, function (response) {
    if (chrome.runtime.lastError) {
      renderEmpty('Open your ERP attendance page, then click the icon.');
      return;
    }
    var data = response && response.data ? response.data : [];
    var criteriaSelect = document.getElementById('criteria');
    var threshold = Number(criteriaSelect.value.replace('%', ''));
    renderData(data, threshold);
    criteriaSelect.addEventListener('change', function () {
      renderData(data, Number(this.value.replace('%', '')));
    });
  });
});