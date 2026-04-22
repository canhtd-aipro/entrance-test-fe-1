export const parseGoogleSheetUrl = (url: string) => {
  const u = new URL(url);

  const spreadsheetMatch = u.pathname.match(/\/d\/([a-zA-Z0-9-_]+)/);
  const sheetId = spreadsheetMatch ? spreadsheetMatch[1] : null;

  return sheetId;
};
