// content.js
(function () {
  function extractAttendance() {
    var tables = document.querySelectorAll('table');
    var data = [];

    tables.forEach(function (t) {
      var rows = t.querySelectorAll('tr');
      rows.forEach(function (r) {
        var cells = [].slice.call(r.querySelectorAll('td')).map(function (td) {
          return td.innerText.trim();
        });
        if (cells.length === 11 && cells[2]) {
          var present = parseInt(cells[5]);
          var absent = parseInt(cells[6]);
          var total = parseInt(cells[9]);
          var pct = total > 0 ? (present / total) * 100 : 0;

          data.push({
            code: cells[1],
            subject: cells[2],
            present: present,
            absent: absent,
            total: total,
            pct: Math.round(pct * 100) / 100
          });
        }
      });
    });

    return data;
  }

  chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message && message.type === 'EXTRACT_NOW') {
      sendResponse({ data: extractAttendance() });
    }
  });

  function tryExtract(attemptsLeft) {
    var data = extractAttendance();
    console.log('[Civvy ERP] attempt, rows found:', data.length);

    if (data.length) {
      console.table(data);
      return;
    }

    if (attemptsLeft > 0) {
      setTimeout(function () { tryExtract(attemptsLeft - 1); }, 500);
    } else {
      console.warn('[Civvy ERP] No attendance table found after retries.');
    }
  }

  tryExtract(10);
})();