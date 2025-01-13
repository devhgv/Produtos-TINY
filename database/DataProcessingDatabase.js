const DataProcessingDatabase = (function () {
  function getAllProductsSIGE() {
    try {
      return getAllProductsFromTiny();
    } catch (error) {
      Logger.log(errorMessageDataTransferSIGE, `Message: ${error}`);
    }
  }


  return {
    getAllProductsSIGE,
  };
});

