const DataProcessingLogic = (function () {
  function getDataTINY() {
    try {
      Logger.log('Iniciando processamento da API com paginação...');
      const urlAPI = "https://api.tiny.com.br/api2/produtos.pesquisa.php?";
      const tokenAPI = "token=0135deb228270acba2e5a8a3b5dddc8ebcf094f7";
      const pageAPI = "pagina=";
      let numPage = 1; // Página inicial.

      while (true) {
        const urlTiny = `${urlAPI}${tokenAPI}&${pageAPI}${numPage}`;
        Logger.log(`Buscando dados da página ${numPage}...`);

        const response = UrlFetchApp.fetch(urlTiny);
        const statusCode = response.getResponseCode();

        if (statusCode !== 200) {
          Logger.log(`Erro ao acessar a API na página ${numPage}: ${statusCode}`);
          break;
        }

        const xmlContent = response.getContentText();
        const document = XmlService.parse(xmlContent);
        const root = document.getRootElement();

        const produtos = root.getChild("produtos").getChildren("produto");
        if (!produtos.length) {
          Logger.log(`Nenhum produto encontrado na página ${numPage}. Encerrando iteração.`);
          break;
        }

        Logger.log(`Processando ${produtos.length} produtos da página ${numPage}...`);
        const filteredData = produtos.map(product => ({
          ID: product.getChildText("id"),
          Codigo: product.getChildText("codigo"),
          Nome: product.getChildText("nome"),
          Categoria: product.getChildText("tipoVariacao"),
          Ean: product.getChildText("gtin"),
          NumeroSerie: product.getChildText("gtin"),
        }));

        const cleanedDataSheets = getDataCleaned(filteredData);
        const checkedDataSheets = getDataChecked(cleanedDataSheets);
        setDataSheets(checkedDataSheets);

        addLastUpdateColumn();

        Logger.log(`Página ${numPage} processada com sucesso.`);
        numPage++;
      }

      Logger.log('Processamento concluído.');
    } catch (error) {
      Logger.log(`Erro ao processar dados da API Tiny: ${error.message}`);
    }
  }

  function getDataCleaned(products) {
    Logger.log("Verificando valores vazios...");
    return products;
  }

  function getDataChecked(products) {
    Logger.log("Verificando variações nulas...");
    return products.filter(prod => prod.Nome);
  }

  function setupHeaders() {
    const headers = ["ID", "Codigo", "Nome", "Categoria", "Ean", "NumeroSerie"];
    const sheetProdutos = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Produtos");
    const lastRow = sheetProdutos.getLastRow() + 1;
    const range = sheetProdutos.getRange(lastRow, 1, 1, headers.length);
    range.setValues([headers]);
  }

  function setupValues(productsJson) {
    const valuesMatrix = productsJson.map(product => [
      product.ID,
      product.Codigo,
      product.Nome,
      product.Categoria,
      product.Ean,
      product.NumeroSerie,
    ]);

    const sheetProdutos = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Produtos");
    const lastRow = sheetProdutos.getLastRow() + 1;
    const range = sheetProdutos.getRange(lastRow, 1, valuesMatrix.length, valuesMatrix[0].length);
    range.setValues(valuesMatrix);
  }

  function setDataSheets(dataSheets) {
    setupHeaders();
    setupValues(dataSheets);
  }

  function addLastUpdateColumn() {
      const sheet =
        SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Produtos");
      const lastColumn = sheet.getLastColumn() + 1;
  
      sheet.getRange(1, lastColumn).setValue("Última Atualização");
  
      // Formata a data e hora atual.
      const formattedDatetime = Utilities.formatDate(
        new Date(),
        Session.getScriptTimeZone(),
        "dd/MM/yyyy HH:mm:ss"
      );
  
      const numRows = sheet.getLastRow() - 1;
      const dateValues = new Array(numRows).fill([formattedDatetime]);
  
      const range = sheet.getRange(2, lastColumn, numRows, 1);
      range.setValues(dateValues);
    }
  

  return {
    getDataTINY,
  };
})();

// Tornando a função acessível globalmente no Apps Script.
function getDataTINY() {
  return DataProcessingLogic.getDataTINY();
}
