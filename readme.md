### Este módulo consome dados da API-TINY de Produtos da Portoreal.

  ## Para utilizar corretamente:
  1. Clique em "Funcionalidades" para ler sobre o que se trata o módulo ;
  2. Clique em "Atualizar Dados" para os dados de produtos serem atualizados na Planilha.

  ## Um pouco mais sobre:
  - Essa aplicação possui scripts que lidam com consumo da API do ERP TINY ;
  - Ela faz uma requisição GET para o endpoint definido, extrai a resposta como texto e converte o XML para um objeto JSON para melhor manipulação dos dados ;
  - Na última coluna, adiciona data/ hora da atualização dos dados inseridos na Planilha após consumir da API-TINY ;
  - Essa aplicação roda automaticamente através de um acionador (GAS) todos os dias das 06h às 07h.
  