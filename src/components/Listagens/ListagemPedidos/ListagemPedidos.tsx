import { type JSX, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PedidoRequests from "../../../fetch/PedidoRequests";
import type PedidoDTO from "../../../dto/PedidoDTO";
import Utilitario from "../../../utils/Utilitario";

function ListagemPedidos(): JSX.Element {
    const [pedidos, setPedidos] = useState<PedidoDTO[]>([]);
    const [busca, setBusca] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 8;
    const navigate = useNavigate();

    useEffect(() => {
        const buscarPedidos = async () => {
            try {
                const lista = await PedidoRequests.obterListaDePedidos();
                setPedidos(lista);
            } catch (error) {
                console.error("Erro ao buscar pedidos:", error);
                alert("Erro ao criar a listagem de pedidos.");
            }
        };

        buscarPedidos();
    }, []);

    // Filtros
    const pedidosFiltrados = pedidos.filter((p) => {
        const termo = busca.toLowerCase();
        const matchCliente = p.nomeCliente?.toLowerCase().includes(termo);
        const matchId = String(p.idVenda).includes(termo);
        return matchCliente || matchId;
    });

    // Lógica de Paginação
    const totalPages = Math.ceil(pedidosFiltrados.length / rowsPerPage) || 1;
    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentPedidos = pedidosFiltrados.slice(indexOfFirstRow, indexOfLastRow);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    return (
        <main className="bg-gray-200 flex-1 flex flex-col px-4 sm:px-6 md:px-10 py-6 md:py-10 overflow-hidden">
            <div className="w-full max-w-7xl mx-auto flex flex-col sm:flex-row items-center gap-4 mb-6 md:mb-8 flex-shrink-0">
                <h1 className="flex-1 text-xl sm:text-2xl md:text-3xl text-center sm:text-left font-bold text-slate-800">
                    Pedidos de Venda
                </h1>
                <button
                    onClick={() => navigate("/cadastro/pedido")}
                    className="w-full sm:w-auto px-4 py-2 md:px-6 md:py-3 text-sm md:text-base bg-emerald-600 rounded-md text-white font-bold hover:bg-emerald-700 transition-all shadow-md hover:shadow-lg active:scale-95 cursor-pointer"
                >
                    + Novo Pedido
                </button>
            </div>

            {/* Input de busca */}
            <input
                type="text"
                name="busca-pedido"
                id="busca-pedido"
                value={busca}
                onChange={(e) => {
                    setBusca(e.target.value);
                    setCurrentPage(1);
                }}
                placeholder="Buscar pedido por cliente ou número da venda..."
                className="w-full max-w-7xl mx-auto p-3 mb-4 bg-white border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:border-slate-500"
            />

            <div className="w-full max-w-7xl mx-auto flex-1 flex flex-col min-h-0 bg-white rounded-xl shadow-xl border border-slate-300 overflow-hidden">
                <div className="flex-1 overflow-auto overscroll-none">
                    <table className="table-auto w-full border-collapse text-xs sm:text-sm md:text-base">
                        <thead className="bg-slate-700 sticky top-0 z-10 shadow-sm">
                            <tr>
                                <th className="border-b border-slate-600 text-white p-3 md:p-4 text-left w-24">Nº Venda</th>
                                <th className="border-b border-slate-600 text-white p-3 md:p-4 text-left">Cliente</th>
                                <th className="border-b border-slate-600 text-white p-3 md:p-4 text-left">Data da Venda</th>
                                <th className="border-b border-slate-600 text-white p-3 md:p-4 text-center w-36">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {currentPedidos.length > 0 ? (
                                currentPedidos.map((pedido) => (
                                    <tr
                                        className="transition-colors hover:bg-slate-50 group"
                                        key={pedido.idVenda}
                                    >
                                        <td className="p-3 md:p-4 font-bold text-slate-800">
                                            #{pedido.idVenda}
                                        </td>
                                        <td className="p-3 md:p-4 text-slate-800 font-semibold">
                                            {pedido.nomeCliente || `Cliente #${pedido.idCliente}`}
                                        </td>
                                        <td className="p-3 md:p-4 text-slate-600">
                                            {Utilitario.formatarData(pedido.dataVenda)}
                                        </td>
                                        <td className="p-2 md:p-4 text-center">
                                            <button
                                                onClick={() => navigate(`/detalhes/pedido/${pedido.idVenda}`)}
                                                className="bg-sky-100 text-sky-700 px-3 py-1.5 rounded-md text-xs font-medium hover:bg-sky-600 hover:text-white transition-all cursor-pointer"
                                            >
                                                Ver Detalhes
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="text-center p-10 text-slate-500 italic">
                                        Nenhum pedido encontrado.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Paginação */}
                <div className="bg-slate-50 border-t border-slate-200 px-4 py-3 sm:px-6 flex items-center justify-between flex-shrink-0">
                    <div className="text-xs sm:text-sm text-slate-600">
                        Mostrando <span className="font-semibold">{currentPedidos.length}</span> de{" "}
                        <span className="font-semibold">{pedidosFiltrados.length}</span> pedidos
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => paginate(Math.max(1, currentPage - 1))}
                            disabled={currentPage === 1}
                            className={`px-3 py-1.5 border border-slate-300 text-xs sm:text-sm rounded-md bg-white text-slate-700 hover:bg-slate-100 ${
                                currentPage === 1 ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                            }`}
                        >
                            Anterior
                        </button>
                        <span className="text-xs sm:text-sm font-semibold text-slate-700">
                            {currentPage} / {totalPages}
                        </span>
                        <button
                            onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                            disabled={currentPage === totalPages}
                            className={`px-3 py-1.5 border border-slate-300 text-xs sm:text-sm rounded-md bg-white text-slate-700 hover:bg-slate-100 ${
                                currentPage === totalPages ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                            }`}
                        >
                            Próxima
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default ListagemPedidos;
