function getDataForSearch() {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const ws = ss.getSheetByName("Customers");
    return ws.getRange(2, 1, ws.getLastRow() - 1, 3).getValues();
}

function deleteById(id) {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const ws = ss.getSheetByName("Customers");
    const customerIds = ws.getRange(2, 1, ws.getLastRow() - 1, 1).getValues().map(r => r[0].toString().toLowerCase());
    const posIndex = customerIds.indexOf(id.toString().toLowerCase());
    const rowNumber = posIndex === -1 ? 0 : posIndex + 2;
    ws.deleteRow(rowNumber);
}

function getCustomerById(id) {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const ws = ss.getSheetByName("Customers");
    const customerIds = ws.getRange(2, 1, ws.getLastRow() - 1, 1).getValues().map(r => r[0].toString().toLowerCase());
    const posIndex = customerIds.indexOf(id.toString().toLowerCase());
    const rowNumber = posIndex === -1 ? 0 : posIndex + 2;
    const customerInfo = ws.getRange(rowNumber, 1, 1, 4).getValues()[0];
    return {
        custId: customerInfo[0],
        firstName: customerInfo[1],
        lastName: customerInfo[2],
        phoneNumber: customerInfo[3],
    };
}

function editCustomerById(customerInfo) {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const ws = ss.getSheetByName("Customers");
    const customerIds = ws.getRange(2, 1, ws.getLastRow() - 1, 1).getValues().map(r => r[0].toString().toLowerCase());
    const posIndex = customerIds.indexOf(customerInfo.id.toString().toLowerCase());
    const rowNumber = posIndex === -1 ? 0 : posIndex + 2;
    ws.getRange(rowNumber, 2, 1, 3).setValues([[
        customerInfo.firstName,
        customerInfo.lastName,
        customerInfo.phoneNumber
    ]]);
    return true;
}