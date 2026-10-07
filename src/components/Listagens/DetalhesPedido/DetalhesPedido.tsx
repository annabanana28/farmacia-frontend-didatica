import { useState, useEffect, type JSX } from "react";
import { useNavigate } from "react-router-dom";
import PedidoRequests, { type DetalhesPedidoResponse } from "../../../fetch/PedidoRequests";
import ProdutoRequests from "../../../fetch/ProdutoRequests";
import type ProdutoDTO from "../../../dto/ProdutoDTO";
import Utilitario from "../../../utils/Utilitario";

interface DetalhesPedidoProps {
    idPedido: number;
}

function DetalhesPedido({ idPedido }: DetalhesPedidoProps): JSX.Element {
    const navigate = useNavigate();
    const [detalhes, setDetalhes] = useState<DetalhesPedidoResponse | null>(null);
    const [produtos, setProdutos] = useState<ProdutoDTO[]>([]);
    const [carregando, setCarregando] = useState(true);

    // Estado para adicionar novo item ao pedido existente
    const [mostrarModalAdicionar, setMostrarModalAdicionar] = useState(false);
    const [idProdutoNovo, setIdProdutoNovo] = useState<number | "">("");
    const [qtdNovo, setQtdNovo] = useState<number>(1);
    const [precoNovo, setPrecoNovo] = useState<number>(0);
    const [salvandoItem, setSalvandoItem] = useState(false);

    const carregarDados = async () => {
        try {
            setCarregando(true);
            const [pedidoDados, listaProdutos] = await Promise.all([
                PedidoRequests.obterPedidoPorId(idPedido),
                ProdutoRequests.obterListaDeProdutos()
            ]);

            setDetalhes(pedidoDados);
            setProdutos(listaProdutos);
        } catch (error) {
            console.error("Erro ao carregar detalhes do pedido:", error);
            alert("Erro ao carregar detalhes do pedido.");
        } finally {
            setCarregando(false);
        }
    };

    useEffect(() => {
        if (idPedido) {
            carregarDados();
        }
    }, [idPedido]);

    const handleSelecionarProdutoNovo = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const idProd = e.target.value === "" ? "" : Number(e.target.value);
        setIdProdutoNovo(idProd);
        if (idProd !== "") {
            const prod = produtos.find(p => p.idProduto === idProd);
            if (prod) setPrecoNovo(Number(prod.preco) || 0);
        } else {
            setPrecoNovo(0);
        }
    };

    const handleAdicionarItemAoPedido = async (e: React.FormEvent) => {
        e.preventDefault();

        if (idProdutoNovo === "") {
            alert("Selecione um produto.");
            return;
        }

        if (qtdNovo <= 0) {
            alert("A quantidade deve ser maior que zero.");
            return;
        }

        try {
            setSalvandoItem(true);
            const res = await PedidoRequests.adicionarItem(idPedido, {
                idProduto: Number(idProdutoNovo),
                qtdProduto: Number(qtdNovo),
                precoUnit: Number(precoNovo)
            });

            if (res.sucesso) {
                alert(res.mensagem || "Item adicionado com sucesso!");
                setMostrarModalAdicionar(false);
                setIdProdutoNovo("");
                setQtdNovo(1);
                setPrecoNovo(0);
                await carregarDados();
            } else {
                alert(res.mensagem || "Erro ao adicionar item.");
            }
        } catch (error) {
            console.error("Erro ao adicionar item:", error);
            alert("Falha de comunicação com o servidor.");
        } finally {
            setSalvandoItem(false);
        }
    };

    const handleRemoverItem = async (idProduto: number) => {
        if (!confirm("Tem certeza que deseja remover este item do pedido?")) return;

        try {
            const sucesso = await PedidoRequests.removerItem(idPedido, idProduto);
            if (sucesso) {
                alert("Item removido com sucesso!");
                await carregarDados();
            } else {
                alert("Erro ao remover item do pedido.");
            }
        } catch (error) {
            console.error("Erro ao remover item:", error);
            alert("Falha ao remover item.");
        }
    };

    if (carregando) {
        return (
            <main className="bg-gray-100 flex-1 flex items-center justify-center p-8">
                <p className="text-slate-600 font-semibold text-lg">Carregando detalhes do pedido #{idPedido}...</p>
            </main>
        );
    }

    if (!detalhes) {
        return (
            <main className="bg-gray-100 flex-1 flex flex-col items-center justify-center p-8">
                <p className="text-red-600 font-semibold text-lg mb-4">Pedido #{idPedido} não encontrado.</p>
                <button
                    onClick={() => navigate("/lista/pedidos")}
                    className="bg-slate-700 text-white px-5 py-2.5 rounded-lg"
                >
                    Voltar para Pedidos
                </button>
            </main>
        );
    }

    const { pedido, itens } = detalhes;
    const totalGeral = itens.reduce((acc, curr) => acc + (Number(curr.qtdProduto) * Number(curr.precoUnit)), 0);

    return (
        <main className="bg-gray-100 flex-1 py-8 sm:py-12 px-4 sm:px-6 lg:px-8 overflow-y-auto">
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Cabeçalho */}
                <div className="bg-white shadow-xl rounded-2xl p-6 sm:p-8 border border-slate-200">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-slate-200">
                        <div>
                            <span className="text-xs uppercase font-bold tracking-wider text-slate-500">Detalhes da Venda</span>
                            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800">
                                Pedido #{pedido.idVenda}
                            </h1>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setMostrarModalAdicionar(!mostrarModalAdicionar)}
                                className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-emerald-700 transition cursor-pointer shadow"
                            >
                                {mostrarModalAdicionar ? "Cancelar Adição" : "+ Adicionar Item"}
                            </button>
                            <button
                                onClick={() => navigate("/lista/pedidos")}
                                className="bg-slate-700 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-slate-800 transition cursor-pointer"
                            >
                                Voltar
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6">
                        <div>
                            <p className="text-xs font-semibold text-slate-500 uppercase">Cliente</p>
                            <p className="text-base font-bold text-slate-800">{pedido.nomeCliente || `#${pedido.idCliente}`}</p>
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-slate-500 uppercase">Data da Venda</p>
                            <p className="text-base font-bold text-slate-800">{Utilitario.formatarData(pedido.dataVenda)}</p>
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-slate-500 uppercase">Total do Pedido</p>
                            <p className="text-lg font-extrabold text-emerald-600">{Utilitario.formatarParaReal(totalGeral)}</p>
                        </div>
                    </div>
                </div>

                {/* Formulário Embutido para Adicionar Novo Item */}
                {mostrarModalAdicionar && (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 shadow-md animate-slideInDown">
                        <h2 className="text-base font-bold text-emerald-900 mb-4">Adicionar Novo Produto ao Pedido #{idPedido}</h2>
                        <form onSubmit={handleAdicionarItemAoPedido} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                            <div className="md:col-span-5">
                                <label className="block text-xs font-semibold text-slate-700 mb-1">Produto</label>
                                <select
                                    required
                                    value={idProdutoNovo}
                                    onChange={handleSelecionarProdutoNovo}
                                    className="w-full px-3 py-2 border rounded-lg bg-white text-sm"
                                >
                                    <option value="">Selecione...</option>
                                    {produtos.map(p => (
                                        <option key={p.idProduto} value={p.idProduto}>
                                            {p.descricao} (Estoque: {p.qtdEstoque})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-xs font-semibold text-slate-700 mb-1">Qtd.</label>
                                <input
                                    type="number"
                                    min="1"
                                    required
                                    value={qtdNovo}
                                    onChange={(e) => setQtdNovo(Number(e.target.value))}
                                    className="w-full px-3 py-2 border rounded-lg bg-white text-sm"
                                />
                            </div>

                            <div className="md:col-span-3">
                                <label className="block text-xs font-semibold text-slate-700 mb-1">Preço Unit. (R$)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    required
                                    value={precoNovo}
                                    onChange={(e) => setPrecoNovo(Number(e.target.value))}
                                    className="w-full px-3 py-2 border rounded-lg bg-white text-sm"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <button
                                    type="submit"
                                    disabled={salvandoItem}
                                    className="w-full bg-emerald-600 text-white font-bold py-2 px-3 rounded-lg text-sm hover:bg-emerald-700 transition cursor-pointer disabled:opacity-50"
                                >
                                    {salvandoItem ? "Salvando..." : "Salvar"}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Tabela de Itens */}
                <div className="bg-white shadow-xl rounded-2xl p-6 sm:p-8 border border-slate-200">
                    <h2 className="text-lg font-bold text-slate-800 mb-4">Itens Inclusos na Venda</h2>
                    <div className="overflow-x-auto border border-slate-200 rounded-xl">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-700 text-white text-xs uppercase">
                                <tr>
                                    <th className="p-3">ID Prod.</th>
                                    <th className="p-3">Descrição do Produto</th>
                                    <th className="p-3 text-center">Quantidade</th>
                                    <th className="p-3 text-right">Preço Unit.</th>
                                    <th className="p-3 text-right">Subtotal</th>
                                    <th className="p-3 text-center">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                                {itens && itens.length > 0 ? (
                                    itens.map((item) => {
                                        const subtotal = Number(item.qtdProduto) * Number(item.precoUnit);
                                        return (
                                            <tr key={item.idProduto} className="hover:bg-slate-50">
                                                <td className="p-3 text-slate-500 font-medium">#{item.idProduto}</td>
                                                <td className="p-3 font-semibold text-slate-800">{item.descricao}</td>
                                                <td className="p-3 text-center font-bold text-slate-700">{item.qtdProduto}</td>
                                                <td className="p-3 text-right text-slate-600">
                                                    {Utilitario.formatarParaReal(item.precoUnit)}
                                                </td>
                                                <td className="p-3 text-right font-bold text-slate-900">
                                                    {Utilitario.formatarParaReal(subtotal)}
                                                </td>
                                                <td className="p-3 text-center">
                                                    <button
                                                        onClick={() => handleRemoverItem(item.idProduto)}
                                                        className="text-red-600 hover:text-red-800 font-bold text-xs bg-red-50 hover:bg-red-100 px-2.5 py-1 rounded cursor-pointer transition-colors"
                                                    >
                                                        Excluir
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="p-6 text-center text-slate-400 italic">
                                            Nenhum item vinculado a este pedido.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                            <tfoot className="bg-slate-100 border-t-2 border-slate-300 font-bold text-slate-900">
                                <tr>
                                    <td colSpan={4} className="p-4 text-right text-base">Total do Pedido:</td>
                                    <td className="p-4 text-right text-xl text-emerald-700 font-extrabold">
                                        {Utilitario.formatarParaReal(totalGeral)}
                                    </td>
                                    <td></td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default DetalhesPedido;
