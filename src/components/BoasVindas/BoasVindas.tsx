import { useEffect, useState, type JSX } from "react";
import { useNavigate } from "react-router-dom";
import ProdutoRequests from "../../fetch/ProdutoRequests";
import ClienteRequests from "../../fetch/ClienteRequests";
import PedidoRequests from "../../fetch/PedidoRequests";

function BoasVindas(): JSX.Element {
    const navigate = useNavigate();
    const [totalClientes, setTotalClientes] = useState<number>(0);
    const [totalProdutos, setTotalProdutos] = useState<number>(0);
    const [totalPedidos, setTotalPedidos] = useState<number>(0);
    const [produtosAlerta, setProdutosAlerta] = useState<number>(0);

    useEffect(() => {
        const carregarTotais = async () => {
            try {
                const [clientes, produtos, pedidos, alertas] = await Promise.all([
                    ClienteRequests.obterListaDeClientes(),
                    ProdutoRequests.obterListaDeProdutos(),
                    PedidoRequests.obterListaDePedidos(),
                    ProdutoRequests.obterProdutosEmAlerta()
                ]);

                setTotalClientes(clientes.length);
                setTotalProdutos(produtos.length);
                setTotalPedidos(pedidos.length);
                setProdutosAlerta(alertas.length);
            } catch (error) {
                console.error("Erro ao carregar totais:", error);
            }
        };

        carregarTotais();
    }, []);

    return (
        <main className="bg-gray-100 flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-10">
            <div className="w-full max-w-5xl mx-auto text-center mb-10">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-800 tracking-tight">
                    Farmácia Didática
                </h1>
                <p className="mt-4 text-base sm:text-lg md:text-xl text-slate-600 max-w-2xl mx-auto">
                    Sistema de gestão farmacêutica para controle de clientes, produtos em estoque e emissão de pedidos.
                </p>
            </div>

            {/* Cards de Resumo e Acesso Rápido */}
            <div className="w-full max-w-5xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {/* Clientes */}
                <div
                    onClick={() => navigate("/lista/clientes")}
                    className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-all cursor-pointer border border-slate-200 flex flex-col justify-between group"
                >
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Clientes</span>
                        <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                            👥
                        </div>
                    </div>
                    <div className="mt-4">
                        <span className="text-3xl font-bold text-slate-800">{totalClientes}</span>
                        <p className="text-xs text-slate-500 mt-1">cadastrados no sistema</p>
                    </div>
                    <button className="mt-4 text-xs font-semibold text-blue-600 group-hover:underline text-left">
                        Ver clientes →
                    </button>
                </div>

                {/* Produtos */}
                <div
                    onClick={() => navigate("/lista/produtos")}
                    className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-all cursor-pointer border border-slate-200 flex flex-col justify-between group"
                >
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Produtos</span>
                        <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                            💊
                        </div>
                    </div>
                    <div className="mt-4">
                        <span className="text-3xl font-bold text-slate-800">{totalProdutos}</span>
                        <p className="text-xs text-slate-500 mt-1">itens no catálogo</p>
                    </div>
                    <button className="mt-4 text-xs font-semibold text-emerald-600 group-hover:underline text-left">
                        Ver catálogo →
                    </button>
                </div>

                {/* Pedidos */}
                <div
                    onClick={() => navigate("/lista/pedidos")}
                    className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-all cursor-pointer border border-slate-200 flex flex-col justify-between group"
                >
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Pedidos</span>
                        <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                            🛒
                        </div>
                    </div>
                    <div className="mt-4">
                        <span className="text-3xl font-bold text-slate-800">{totalPedidos}</span>
                        <p className="text-xs text-slate-500 mt-1">pedidos realizados</p>
                    </div>
                    <button className="mt-4 text-xs font-semibold text-purple-600 group-hover:underline text-left">
                        Ver pedidos →
                    </button>
                </div>

                {/* Alerta de Estoque */}
                <div
                    onClick={() => navigate("/lista/produtos?alerta=true")}
                    className={`p-6 rounded-2xl shadow-md hover:shadow-xl transition-all cursor-pointer border flex flex-col justify-between group ${
                        produtosAlerta > 0
                            ? "bg-amber-50 border-amber-300"
                            : "bg-white border-slate-200"
                    }`}
                >
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-amber-800 uppercase tracking-wider">Alerta Estoque</span>
                        <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                            ⚠️
                        </div>
                    </div>
                    <div className="mt-4">
                        <span className="text-3xl font-bold text-amber-900">{produtosAlerta}</span>
                        <p className="text-xs text-amber-700 mt-1">com estoque baixo</p>
                    </div>
                    <button className="mt-4 text-xs font-semibold text-amber-800 group-hover:underline text-left">
                        Ver alertas →
                    </button>
                </div>
            </div>

            {/* Ações Rápidas */}
            <div className="w-full max-w-5xl flex flex-wrap gap-4 justify-center">
                <button
                    onClick={() => navigate("/cadastro/cliente")}
                    className="px-5 py-3 rounded-xl bg-slate-800 text-white font-semibold hover:bg-slate-700 shadow transition-all cursor-pointer"
                >
                    + Novo Cliente
                </button>
                <button
                    onClick={() => navigate("/cadastro/produto")}
                    className="px-5 py-3 rounded-xl bg-slate-800 text-white font-semibold hover:bg-slate-700 shadow transition-all cursor-pointer"
                >
                    + Novo Produto
                </button>
                <button
                    onClick={() => navigate("/cadastro/pedido")}
                    className="px-5 py-3 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700 shadow transition-all cursor-pointer"
                >
                    + Criar Novo Pedido
                </button>
            </div>
        </main>
    );
}

export default BoasVindas;
