# Sistema de Gestão de Funcionários

## Estrutura do Projeto

```
├── server/                     # API back-end em .NET 8
│   ├── src/                    # Código fonte da API
│   └── README.md               # Instruções específicas para o servidor
│
├── client/                     # Aplicação front-end
│   ├── src/                    # Código fonte do cliente
│   ├── public/                 # Arquivos públicos
│   └── README.md               # Instruções específicas para o cliente
│
├── auxiliar/                                               # Documentação auxiliar
│   ├── pi-Gestao-Funcionarios.postman_collection.json      # Coleção Postman para testes da API
│   └── Employees .sql                                      # Script para insersao de alguns dados
│
└── README.md                   # Este arquivo
```

## Iniciando o Projeto

Para iniciar o projeto completo, você precisará executar tanto o servidor quanto o cliente.

### Passo 1: Configurar e Executar o Servidor (API)

Consulte o arquivo `server/README.md` para instruções detalhadas sobre como:
- Configurar o ambiente de desenvolvimento
- Configurar o banco de dados
- Iniciar a API

### Passo 2: Configurar e Executar o Cliente

Consulte o arquivo `client/README.md` para instruções detalhadas sobre como:
- Configurar o ambiente de desenvolvimento
- Conectar-se à API
- Iniciar a aplicação cliente

## Contribuição

Para contribuir com o projeto:

1. Faça um fork do repositório
2. Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Faça commit das suas alterações (`git commit -m 'Adiciona nova funcionalidade'`)
4. Faça push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request
