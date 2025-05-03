# Guia de Execução Local - Aplicação Api .NET 8


## Pré-requisitos

Antes de começar, você precisa ter instalado:

1. **SDK do .NET 8** - Este é o ambiente de execução necessário para a aplicação.
   - [Download do .NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
   - Durante a instalação, siga as instruções na tela e aceite as configurações padrão.

## Passos para Executar a Aplicação

### 1. Baixe ou Clone o Projeto

- Se você recebeu os arquivos em um .zip, extraia-os para uma pasta de sua preferência.
- Se o projeto estiver em um repositório Git, você pode usar o comando (ou baixar como ZIP do repositório):
  ```
  git clone [url-do-repositório]
  ```

### 2. Navegue até a Pasta do Projeto

- Abra o Prompt de Comando (Windows) ou Terminal (Mac/Linux)
- Navegue até a pasta onde o projeto foi extraído ou clonado:
  ```
  cd caminho/para/a/pasta/do/projeto
  ```

### 3. Configure o arquivo appsettings.json

O arquivo `appsettings.json` contém as configurações necessárias para a aplicação funcionar corretamente. Você precisa verificar e possivelmente modificar este arquivo:

1. Encontre o arquivo `appsettings.json` na pasta raiz do projeto
2. Abra o arquivo com qualquer editor de texto (Bloco de Notas, Visual Studio Code, etc.)
3. Verifique as seguintes configurações comuns:

```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "AllowedHosts": "*",
    "ConnectionStrings": {
        "DefaultConnection": "Data Source=EmployeeApi.db;Cache=Shared"
    },
  "SetupAdmin":{
    "Email": "teste@teste.com",
    "Password": "q1w2e3r4"
  },
  "JwtSettings": {
    "Secret": "7x!A%D*G-KaPdSgVkYp3s6v8y/B?E(H+",
    "Issuer": "EmployeeAPI",
    "Audience": "EmployeeAPIClients",
    "DurationInMinutes": 180
  }
}
```

4. Modifique os valores conforme necessário:
   - **ConnectionStrings**: Se a aplicação usar banco de dados, configure o servidor, nome do banco, usuário e senha
   - **AppSettings**: Altere valores específicos da aplicação (chaves de API, URLs, etc.)

### 4. Execute a Aplicação

Para iniciar a aplicação, execute o seguinte comando no terminal ou prompt de comando:

```
dotnet run
```

Se tudo estiver correto, você verá mensagens indicando que a aplicação está em execução e uma URL local, geralmente `https://localhost:5173` ou `http://localhost:5001`.

### 5. Acesse a Aplicação

Abra seu navegador web e acesse:
- `https://localhost:5173` (ou a URL indicada no terminal)

## Possíveis Problemas e Soluções

### Erro de Conexão com Banco de Dados
- Verifique se as informações de conexão no `appsettings.json` estão corretas
- Certifique-se de que o banco de dados está em execução

### Erro de Certificado HTTPS
- Se aparecer um aviso de segurança no navegador, você pode:
  - Clicar em "Avançado" e "Prosseguir assim mesmo"
  - Ou executar `dotnet dev-certs https --trust` no terminal para confiar no certificado de desenvolvimento

### Porta em Uso
- Se a porta já estiver em uso, você pode modificar a porta no arquivo `Properties/launchSettings.json`

## Comandos Úteis

- **Parar a aplicação**: Pressione `Ctrl+C` no terminal onde a aplicação está rodando
- **Limpar e reconstruir**: `dotnet clean` seguido de `dotnet build`
- **Atualizar pacotes**: `dotnet restore`

## Testando a API com Postman

Esta aplicação inclui um arquivo de coleção do Postman chamado `Api-Gestao-Funcionarios.postman_collection.json` que contém exemplos de todas as chamadas à API. Para utilizá-lo:

### 1. Instale o Postman

- Baixe e instale o [Postman](https://www.postman.com/downloads/) no seu computador
- Abra o Postman após a instalação

### 2. Importe a Coleção

1. No Postman, clique no botão "Import" (Importar) no canto superior esquerdo
2. Arraste o arquivo `Api-Gestao-Funcionarios.postman_collection.json` para a área de importação ou navegue até ele
3. Clique em "Import" para concluir a importação

### 3. Use as Requisições Pré-configuradas

A coleção contém exemplos de todas as chamadas disponíveis na API de Gestão de Funcionários, como:
- Listar todos os funcionários
- Buscar funcionário por ID
- Adicionar novo funcionário
- Atualizar dados de funcionário
- Excluir funcionário
- Etc.

### 4. Executar as Requisições

1. Certifique-se de que a aplicação .NET está rodando localmente
2. No Postman, selecione uma requisição da coleção
3. Verifique se a URL está correta (normalmente `http://localhost:5000` ou `https://localhost:5001`)
4. Clique no botão "Send" (Enviar)
5. Veja a resposta da API no painel inferior

### Dicas para Usar o Postman

- Se alguma chamada exigir autenticação, você precisará configurar o token nas abas de "Authorization" ou "Headers"
- Você pode modificar os dados nas requisições de tipo POST ou PUT na aba "Body"
- Para requisições que exigem parâmetros de URL, você pode editá-los na própria URL ou na aba "Params"

## Mais Ajuda

Se você precisar de mais ajuda, consulte a [documentação oficial do .NET](https://docs.microsoft.com/pt-br/dotnet/), a [documentação do Postman](https://learning.postman.com/docs/getting-started/introduction/) 