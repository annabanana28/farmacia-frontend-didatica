# Farmácia Didática - Front-end

Front-end desenvolvido em **React com TypeScript** e **Vite**, seguindo rigorosamente o padrão acadêmico do curso.

## 🚀 Tecnologias Utilizadas

- **React 19** + **TypeScript**
- **Vite** (bundler e servidor de desenvolvimento rápido)
- **Tailwind CSS v4** (estilização moderna e responsiva)
- **React Router DOM v7** (roteamento declarativo)
- **Fetch API** (comunicação limpa com o backend)

## 📁 Estrutura de Pastas

```text
src/
├── assets/
│   └── app-icon.png
├── components/
│   ├── BoasVindas/
│   │   └── BoasVindas.tsx
│   ├── Formularios/
│   │   ├── FormCliente/
│   │   │   └── FormCliente.tsx
│   │   ├── FormProduto/
│   │   │   └── FormProduto.tsx
│   │   ├── FormPedido/
│   │   │   └── FormPedido.tsx
│   │   └── FormLogin/
│   │       └── FormLogin.tsx
│   ├── Listagens/
│   │   ├── ListagemClientes/
│   │   │   └── ListagemClientes.tsx
│   │   ├── ListagemProdutos/
│   │   │   └── ListagemProdutos.tsx
│   │   ├── ListagemPedidos/
│   │   │   └── ListagemPedidos.tsx
│   │   └── DetalhesPedido/
│   │       └── DetalhesPedido.tsx
│   ├── Navegacao/
│   │   └── Navegacao.tsx
│   └── Rodape/
│       └── Rodape.tsx
├── dto/
│   ├── ClienteDTO.ts
│   ├── ProdutoDTO.ts
│   ├── PedidoDTO.ts
│   └── ItemPedidoDTO.ts
├── fetch/
│   ├── ClienteRequests.ts
│   ├── ProdutoRequests.ts
│   ├── PedidoRequests.ts
│   └── AuthRequests.ts
├── pages/
│   ├── PCadastro/
│   │   ├── PCadastroCliente/
│   │   ├── PCadastroProduto/
│   │   └── PCadastroPedido/
│   ├── PDetalhes/
│   │   └── PDetalhesPedido/
│   ├── PHome/
│   │   └── PHome.tsx
│   ├── PListagem/
│   │   ├── PListagemCliente/
│   │   ├── PListagemProduto/
│   │   └── PListagemPedido/
│   └── PLogin/
│       └── PLogin.tsx
├── utils/
│   └── Utilitario.ts
├── App.css
├── App.tsx
├── index.css
└── main.tsx
```

## 🔌 Integração com o Backend

O front consome os seguintes endpoints do servidor em `http://localhost:3333`:

- **Clientes**:
  - `GET /clientes` - Listagem de clientes
  - `POST /clientes` - Cadastro de novo cliente
- **Produtos**:
  - `GET /produtos` - Listagem com indicador de estoque baixo
  - `GET /produtos/alerta` - Produtos com estoque em alerta
  - `POST /produtos` - Cadastro de produto
  - `PUT /produtos/:idProduto` - Atualização de produto
- **Pedidos**:
  - `GET /pedidos` - Listagem de todos os pedidos
  - `GET /pedidos/:id` - Detalhes do pedido com itens
  - `GET /pedidos/:id/itens` - Apenas os itens do pedido
  - `POST /pedidos` - Criação de novo pedido com múltiplos itens
  - `POST /pedidos/:id/itens` - Adição de item em pedido existente
- **Itens de Venda**:
  - `DELETE /itens/:idVenda/:idProduto` - Exclusão de item de uma venda

## 🏃 Como Executar

1. Certifique-se de que o backend está rodando na porta 3333.
2. Na pasta `farmacia-frontend-didatica`:
   ```bash
   npm install
   npm run dev
   ```
3. Acesse a aplicação pelo navegador no link informado pelo Vite (geralmente `http://localhost:5173`).
