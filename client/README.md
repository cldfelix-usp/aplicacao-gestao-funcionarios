# Guia para Executar a Aplicação


## Pré-requisitos

Antes de começar, você precisará instalar:

1. **Node.js**: Ferramenta essencial para executar aplicações JavaScript.
   - Acesse [nodejs.org](https://nodejs.org/) e baixe a versão LTS (suporte de longo prazo).
   - Siga as instruções de instalação para o seu sistema operacional.

2. **Editor de código**: Recomendamos o Visual Studio Code.
   - Baixe em [code.visualstudio.com](https://code.visualstudio.com/)

## Passo a passo para execução

### 1. Baixar o projeto

1. Baixe o arquivo ZIP do projeto ou clone o repositório (se souber usar Git).
2. Descompacte o arquivo em uma pasta no seu computador.

### 2. Abrir o projeto

1. Abra o Visual Studio Code.
2. Clique em "Arquivo" > "Abrir Pasta" e selecione a pasta do projeto.

### 3. Instalar dependências

1. Abra o terminal no Visual Studio Code:
   - Clique em "Terminal" > "Novo Terminal" no menu superior.
2. No terminal que aparecer na parte inferior, digite o comando:
   ```
   npm install
   ```
3. Aguarde até que todas as dependências sejam instaladas (isso pode levar alguns minutos).

### 4. Configurar as constantes

**Importante:** A aplicação precisa das configurações corretas no arquivo de constantes.

1. Navegue até a pasta `src/config` no explorador de arquivos à esquerda.
2. Procure pelo arquivo `constants.tsx`.
3. Abra este arquivo e verifique se as configurações estão corretas para o seu ambiente.



Exemplo de como o arquivo de constantes deve parecer:

```tsx
// src/config/constants.tsx

export const API_URL = 'http://localhost:5173/api/v1';

```

### 5. Executar a aplicação

1. No terminal, digite o comando:
   ```
   npm run dev
   ```
2. Aguarde até que a aplicação seja compilada e iniciada.
3. Você verá uma mensagem indicando que o servidor está rodando, geralmente com uma URL como: `http://localhost:5173/`

### 6. Acessar a aplicação

1. Abra o seu navegador (Chrome, Firefox, etc.).
2. Digite a URL mostrada no terminal (geralmente `http://localhost:5173/`).
3. A aplicação será carregada no seu navegador.

## Solução de problemas comuns

### Se a aplicação não iniciar:

1. Verifique se todas as dependências foram instaladas corretamente.
2. Certifique-se de que o arquivo `src/config/constantes.tsx` existe e está configurado corretamente.
3. Verifique se não há erros no terminal.

### Se aparecer uma tela em branco:

1. Abra as ferramentas de desenvolvedor do navegador (F12 ou Ctrl+Shift+I).
2. Verifique a aba "Console" para ver se há mensagens de erro.

### Se as API's não funcionarem:

1. Verifique se a configuração de `API_URL` no arquivo `constantes.tsx` está apontando para o endereço correto.

## Como parar a aplicação

Para encerrar a aplicação:

1. Volte para o terminal do Visual Studio Code.
2. Pressione `Ctrl+C` (ou `Cmd+C` no Mac).
3. Confirme a ação, se solicitado.

## Comandos úteis

- `npm run dev`: Inicia o servidor de desenvolvimento.
- `npm run build`: Cria uma versão otimizada para produção.
- `npm run preview`: Visualiza a versão de produção localmente.

---

Dúvidas? Entre em contato com a equipe de desenvolvimento.