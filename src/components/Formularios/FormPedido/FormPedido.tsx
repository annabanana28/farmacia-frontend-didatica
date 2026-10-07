import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ClienteRequests from "../../../fetch/ClienteRequests";
import ProdutoRequests from "../../../fetch/ProdutoRequests";
import PedidoRequests from "../../../fetch/PedidoRequests";
import type ClienteDTO from "../../../dto/ClienteDTO";
import type ProdutoDTO from "../../../dto/ProdutoDTO";
import Utilitario from "../../../utils/Utilitario";

interface ItemTemp {
    idProduto: number;
    descricao: string;
    qtdProduto: number;
    precoUnit: number;
    subtotal: number;
}

function FormPedido() {
    const navigate = useNavigate();

    // Listas do backend
    const [clientes, setClientes] = useState<ClienteDTO[]>([]);
    const [produtos, setProdutos] = useState<ProdutoDTO[]>([]);

    // Estados do Pedido
    const [idClienteSelecionado, setIdClienteSelecionado] = useState<number | "">("");
    const [itensPedido, setItensPedido] = useState<ItemTemp[]>([]);

    // Item em edição no momento
    const [idProdutoItem, setIdProdutoItem] = useState<number | "">("");
    const [qtdItem, setQtdItem] = useState<number>(1);
    const [precoUnitItem, setPrecoUnitItem] = useState<number>(0);

    const [carregando, setCarregando] = useState(false);

    useEffect(() => {
        const carregarDados = async () => {
            try {
                const [listaClientes, listaProdutos] = await Promise.all([
                    ClienteRequests.obterListaDeClientes(),
                    ProdutoRequests.obterListaDeProdutos()
                ]);
                setClientes(listaClientes);
                setProdutos(listaProdutos);
            } catch (error) {
                console.error("Erro ao carregar clientes ou produtos:", error);
            }
        };

        carregarDados();
    }, []);

    // Quando seleciona um produto no dropdown, preenche o preço unitário automaticamente
    const handleSelecionarProduto = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const idProd = e.target.value === "" ? "" : Number(e.target.value);
        setIdProdutoItem(idProd);

        if (idProd !== "") {
            const prod = produtos.find(p => p.idProduto === idProd);
            if (prod) {
                setPrecoUnitItem(Number(prod.preco) || 0);
            }
        } else {
            setPrecoUnitItem(0);
        }
    };

    // Adiciona o item à lista do pedido
    const handleAdicionarItem = () => {
        if (idProdutoItem === "") {
            alert("Selecione um produto.");
            return;
        }

        if (qtdItem <= 0) {
            alert("A quantidade deve ser maior que zero.");
            return;
        }

        if (precoUnitItem < 0) {
            alert("O preço unitário não pode ser negativo.");
            return;
        }

        const produtoObj = produtos.find(p => p.idProduto === idProdutoItem);
        if (!produtoObj) return;

        // Verifica estoque
        if (produtoObj.qtdEstoque < qtdItem) {
            alert(`Estoque insuficiente! Disponível em estoque: ${produtoObj.qtdEstoque} unidades.`);
            return;
        }

        // Verifica se o item já foi adicionado
        const jaExiste = itensPedido.some(item => item.idProduto === idProdutoItem);
        if (jaExiste) {
            alert("Este produto já foi adicionado ao pedido. Remova-o da lista se desejar alterar a quantidade.");
            return;
        }

        const novoItem: ItemTemp = {
            idProduto: Number(idProdutoItem),
            descricao: produtoObj.descricao,
            qtdProduto: Number(qtdItem),
            precoUnit: Number(precoUnitItem),
            subtotal: Number(qtdItem) * Number(precoUnitItem)
        };

        setItensPedido(prev => [...prev, novoItem]);

        // Reseta seleção de item
        setIdProdutoItem("");
        setQtdItem(1);
        setPrecoUnitItem(0);
    };

    // Remove item da lista
    const handleRemoverItem = (idProdutoRemover: number) => {
        setItensPedido(prev => prev.filter(i => i.idProduto !== idProdutoRemover));
    };

    // Total do pedido
    const valorTotalPedido = itensPedido.reduce((acc, curr) => acc + curr.subtotal, 0);

    // Submete o pedido para o backend
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (idClienteSelecionado === "") {
            alert("Selecione o cliente para o pedido.");
            return;
        }

        if (itensPedido.length === 0) {
            alert("Adicione pelo menos um produto ao pedido antes de finalizar.");
            return;
        }

        try {
            setCarregando(true);
            const resultado = await PedidoRequests.cadastrarPedido({
                idCliente: Number(idClienteSelecionado),
                itens: itensPedido.map(i => ({
                    idProduto: i.idProduto,
                    qtdProduto: i.qtdProduto,
                    precoUnit: i.precoUnit
                }))
            });

            if (resultado.sucesso) {
                alert(resultado.mensagem || "Pedido criado com sucesso!");
                navigate("/lista/pedidos");
            } else {
                alert(resultado.mensagem || "Erro ao criar pedido.");
            }
        } catch (error) {
            console.error("Erro ao enviar pedido:", error);
            alert("Erro de conexão ao salvar pedido.");
        } finally {
            setCarregando(false);
        }
    };

    return (
        <main className="bg-gray-100 flex-1 py-8 sm:py-12 px-4 sm:px-6 lg:px-8 overflow-y-auto">
            <div className="max-w-4xl mx-auto">
                <form
                    onSubmit={handleSubmit}
                    className="bg-white shadow-2xl rounded-2xl p-6 sm:p-10 border border-slate-200"
                >
                    <h1 className="text-2xl sm:text-3xl md:text-4xl text-center font-bold text-slate-800 mb-8 sm:mb-10">
                        Novo Pedido de Venda
                    </h1>

                    {/* Seleção do Cliente */}
                    <div className="mb-8 p-6 bg-slate-50 rounded-xl border border-slate-200">
                        <label htmlFor="cliente" className="block text-sm font-semibold text-slate-700 mb-2">
                            Cliente *
                        </label>
                        <select
                            id="cliente"
                            required
                            value={idClienteSelecionado}
                            onChange={(e) => setIdClienteSelecionado(e.target.value === "" ? "" : Number(e.target.value))}
                            className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-slate-500 focus:outline-none transition-all bg-white"
                        >
                            <option value="">Selecione um cliente...</option>
                            {clientes.map((cli) => (
                                <option key={cli.idCliente} value={cli.idCliente}>
                                    {cli.nome} - CPF: {Utilitario.formatarCPF(cli.cpf)}
                                </option>
                            ))}
                        </select>
                        {clientes.length === 0 && (
                            <p className="text-xs text-amber-600 mt-2">
                                Nenhum cliente encontrado. <a href="/cadastro/cliente" className="underline font-bold">Cadastre um cliente primeiro</a>.
                            </p>
                        )}
                    </div>

                    {/* Adicionar Itens ao Pedido */}
                    <div className="mb-8 p-6 bg-slate-50 rounded-xl border border-slate-200">
                        <h2 className="text-lg font-bold text-slate-800 mb-4">Adicionar Produtos ao Pedido</h2>

                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                            {/* Produto */}
                            <div className="md:col-span-6">
                                <label htmlFor="produto" className="block text-xs font-semibold text-slate-600 mb-1">
                                    Produto
                                </label>
                                <select
                                    id="produto"
                                    value={idProdutoItem}
                                    onChange={handleSelecionarProduto}
                                    className="w-full px-3 py-2.5 border-2 border-slate-200 rounded-lg focus:border-slate-500 focus:outline-none bg-white text-sm"
                                >
                                    <option value="">Selecione o produto...</option>
                                    {produtos.map((p) => (
                                        <option key={p.idProduto} value={p.idProduto}>
                                            {p.descricao} (Estoque: {p.qtdEstoque}) - {Utilitario.formatarParaReal(p.preco)}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Quantidade */}
                            <div className="md:col-span-2">
                                <label htmlFor="qtd" className="block text-xs font-semibold text-slate-600 mb-1">
                                    Qtd.
                                </label>
                                <input
                                    type="number"
                                    id="qtd"
                                    min="1"
                                    value={qtdItem}
                                    onChange={(e) => setQtdItem(Number(e.target.value))}
                                    className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:border-slate-500 focus:outline-none text-sm"
                                />
                            </div>

                            {/* Preço Unitário */}
                            <div className="md:col-span-2">
                                <label htmlFor="precoUnit" className="block text-xs font-semibold text-slate-600 mb-1">
                                    Preço Unit. (R$)
                                </label>
                                <input
                                    type="number"
                                    id="precoUnit"
                                    step="0.01"
                                    min="0"
                                    value={precoUnitItem}
                                    onChange={(e) => setPrecoUnitItem(Number(e.target.value))}
                                    className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:border-slate-500 focus:outline-none text-sm"
                                />
                            </div>

                            {/* Botão Adicionar */}
                            <div className="md:col-span-2">
                                <button
                                    type="button"
                                    onClick={handleAdicionarItem}
                                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 px-3 rounded-lg text-sm transition-all shadow cursor-pointer"
                                >
                                    + Adicionar
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Tabela de Itens Adicionados */}
                    <div className="mb-8">
                        <h2 className="text-lg font-bold text-slate-800 mb-3">Itens do Pedido</h2>
                        <div className="overflow-x-auto border border-slate-200 rounded-xl bg-white shadow-sm">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-slate-700 text-white text-xs uppercase">
                                    <tr>
                                        <th className="p-3">Produto</th>
                                        <th className="p-3 text-center">Quantidade</th>
                                        <th className="p-3 text-right">Preço Unit.</th>
                                        <th className="p-3 text-right">Subtotal</th>
                                        <th className="p-3 text-center">Ações</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200">
                                    {itensPedido.length > 0 ? (
                                        itensPedido.map((item) => (
                                            <tr key={item.idProduto} className="hover:bg-slate-50">
                                                <td className="p-3 font-medium text-slate-800">{item.descricao}</td>
                                                <td className="p-3 text-center">{item.qtdProduto}</td>
                                                <td className="p-3 text-right">{Utilitario.formatarParaReal(item.precoUnit)}</td>
                                                <td className="p-3 text-right font-semibold text-slate-900">
                                                    {Utilitario.formatarParaReal(item.subtotal)}
                                                </td>
                                                <td className="p-3 text-center">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoverItem(item.idProduto)}
                                                        className="text-red-600 hover:text-red-800 font-bold text-xs bg-red-50 hover:bg-red-100 px-2.5 py-1 rounded cursor-pointer transition-colors"
                                                    >
                                                        Remover
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={5} className="p-6 text-center text-slate-400 italic">
                                                Nenhum produto adicionado ao pedido ainda.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                                {itensPedido.length > 0 && (
                                    <tfoot className="bg-slate-100 border-t-2 border-slate-300 font-bold text-slate-900">
                                        <tr>
                                            <td colSpan={3} className="p-3 text-right text-base">
                                                Total do Pedido:
                                            </td>
                                            <td className="p-3 text-right text-lg text-emerald-700 font-extrabold">
                                                {Utilitario.formatarParaReal(valorTotalPedido)}
                                            </td>
                                            <td></td>
                                        </tr>
                                    </tfoot>
                                )}
                            </table>
                        </div>
                    </div>

                    {/* Ações */}
                    <div className="space-y-4">
                        <input
                            type="submit"
                            disabled={carregando || itensPedido.length === 0 || idClienteSelecionado === ""}
                            value={carregando ? "FINALIZANDO PEDIDO..." : "FINALIZAR PEDIDO"}
                            className="w-full bg-slate-800 text-white py-4 rounded-xl font-bold text-base sm:text-lg cursor-pointer hover:bg-slate-700 shadow-lg hover:shadow-xl transition-all active:scale-[0.98] disabled:opacity-50"
                        />
                        <button
                            type="button"
                            onClick={() => navigate("/lista/pedidos")}
                            className="w-full bg-white border-2 border-slate-300 text-slate-600 py-4 rounded-xl font-bold text-base sm:text-lg hover:bg-slate-50 transition-all active:scale-[0.98] cursor-pointer"
                        >
                            VOLTAR PARA LISTAGEM
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
}

export default FormPedido;
