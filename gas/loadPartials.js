function doGet() {
  //SpreadsheetApp.getUi();
  //DriveApp.getRootFolder();
  //UrlFetchApp.fetch("");
  const htmlPageTemplate = HtmlService.createTemplateFromFile('index');
  return htmlPageTemplate.evaluate();
}

function loadPartialHTML_(partial) {
  const htmlServ = HtmlService.createTemplateFromFile(partial);
  return htmlServ.evaluate().getContent();
}

function loadSearchView() {
  return loadPartialHTML_("search");
}

function loadAddCustomerView() {
  return loadPartialHTML_('addCustomer');
}

function loadEditCustomerView() {
  return loadPartialHTML_('editCustomer');
}
