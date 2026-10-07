import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import PHome from './pages/PHome/PHome'
import PListagemCliente from './pages/PListagem/PListagemCliente/PListagemCliente'
import PListagemProduto from './pages/PListagem/PListagemProduto/PListagemProduto'
import PListagemPedido from './pages/PListagem/PListagemPedido/PListagemPedido'
import PCadastroCliente from './pages/PCadastro/PCadastroCliente/PCadastroCliente'
import PCadastroProduto from './pages/PCadastro/PCadastroProduto/PCadastroProduto'
import PCadastroPedido from './pages/PCadastro/PCadastroPedido/PCadastroPedido'
import PDetalhesPedido from './pages/PDetalhes/PDetalhesPedido/PDetalhesPedido'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<PHome />} />
        <Route path='/lista/clientes' element={<PListagemCliente />} />
        <Route path='/lista/produtos' element={<PListagemProduto />} />
        <Route path='/lista/pedidos' element={<PListagemPedido />} />
        <Route path='/cadastro/cliente' element={<PCadastroCliente />} />
        <Route path='/cadastro/produto' element={<PCadastroProduto />} />
        <Route path='/cadastro/produto/:idProduto' element={<PCadastroProduto />} />
        <Route path='/cadastro/pedido' element={<PCadastroPedido />} />
        <Route path='/detalhes/pedido/:id' element={<PDetalhesPedido />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
