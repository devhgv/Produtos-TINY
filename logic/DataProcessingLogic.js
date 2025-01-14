const DataProcessingLogic = (function () {
  function getDataTINY() {
    try {
      Logger.log("Iniciando processamento da API com paginação...");
      const urlAPI = "https://api.tiny.com.br/api2/produtos.pesquisa.php?";
      const tokenAPI = "token=0135deb228270acba2e5a8a3b5dddc8ebcf094f7";
      const pageAPI = "pagina=";
      let numPage = 1; // Página inicial.

      clearSheet(); // Limpa a planilha antes de adicionar novos dados.

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
          Logger.log(
            `Nenhum produto encontrado na página ${numPage}. Encerrando iteração.`
          );
          break;
        }

        Logger.log(`Processando ${produtos.length} produtos da página ${numPage}...`);
        const filteredData = produtos.map((product) => ({
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

        Logger.log(`Página ${numPage} processada com sucesso.`);
        numPage++;
      }

      
      Logger.log("Processamento concluído.");
    } catch (error) {
      Logger.log(`Erro ao processar dados da API Tiny: ${error.message}`);
    }
  }

  function clearSheet() {
    Logger.log("Limpando a planilha...");
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Produtos");
    sheet.clear(); // Remove todo o conteúdo e formatação da planilha.
  }

  function getDataCleaned(products) {
    Logger.log("Analisando valores vazios(...)");
    return products;
  }

  function getDataChecked(products) {
    Logger.log("Analisando variações nulas(...)");
    return products.filter((prod) => prod.Nome);
  }

  function setupHeaders() {
    const headers = ["ID", "Codigo", "Nome", "Categoria", "Ean", "NumeroSerie", "ultimaAtualizacao"];
    const sheetProdutos = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Produtos");
    const range = sheetProdutos.getRange(1, 1, 1, headers.length);
    range.setValues([headers]);
  }

  const dateUpdate = new Date();

  function setupValues(productsJson) {
    const valuesMatrix = productsJson.map((product) => [
      product.ID,
      product.Codigo,
      product.Nome,
      product.Categoria,
      product.Ean,
      product.NumeroSerie,
      dateUpdate,
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

  return {
    getDataTINY,
  };
})();

// Tornando a função acessível globalmente no Apps Script.
function getDataTINY() {
  return DataProcessingLogic.getDataTINY();
}
