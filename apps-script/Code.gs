// Cole este código no Apps Script (Extensões > Apps Script) da sua planilha do Google Sheets.
// Veja o passo a passo completo em SHEET_SETUP.md na raiz do repositório.

const SHEET_NAME = 'Leads';

function doPost(e) {
  const sheet = getOrCreateSheet_();
  const data = JSON.parse(e.postData.contents);

  sheet.appendRow([
    data.name || '',
    data.phone || '',
    data.event || '',
    data.channel === 'whatsapp' ? 'WhatsApp' : 'E-mail',
    data.timestamp ? new Date(data.timestamp) : new Date()
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

function getOrCreateSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['Nome', 'Telefone', 'Evento', 'Canal', 'Quando']);
  }
  return sheet;
}
