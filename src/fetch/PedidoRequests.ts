import type PedidoDTO from "../dto/PedidoDTO";
import type ItemPedidoDTO from "../dto/ItemPedidoDTO";

export interface DetalhesPedidoResponse {
    pedido: {
        idVenda: number;
        idCliente: number;
        dataVenda: string;
        nomeCliente: string;
    };
    itens: Array<{
        idProduto: number;
        descricao: string;
        qtdProduto: number;
        precoUnit: number;
    }>;
}

class PedidoRequests {
    private serverURL: string;
    private endpointPedido: string;

    constructor() {
        this.serverURL = "http://localhost:3333";
        this.endpointPedido = "/pedidos";
    }

    async obterListaDePedidos(): Promise<PedidoDTO[]> {
        try {
            const respostaAPI = await fetch(`${this.serverURL}${this.endpointPedido}`);

            if (respostaAPI.ok) {
                const lista: PedidoDTO[] = await respostaAPI.json();
                return lista;
            }

            throw new Error("Não foi possível listar os pedidos.");
        } catch (error) {
            console.error(`Erro ao consultar pedidos: ${error}`);
            return [];
        }
    }

    async obterPedidoPorId(idVenda: number): Promise<DetalhesPedidoResponse | null> {
        try {
            const respostaAPI = await fetch(`${this.serverURL}${this.endpointPedido}/${idVenda}`);

            if (respostaAPI.ok) {
                const dados: DetalhesPedidoResponse = await respostaAPI.json();
                return dados;
            }

            throw new Error("Não foi possível buscar o pedido.");
        } catch (error) {
            console.error(`Erro ao consultar pedido por ID: ${error}`);
            return null;
        }
    }

    async obterItensDoPedido(idVenda: number): Promise<ItemPedidoDTO[]> {
        try {
            const respostaAPI = await fetch(`${this.serverURL}${this.endpointPedido}/${idVenda}/itens`);

            if (respostaAPI.ok) {
                const itens: ItemPedidoDTO[] = await respostaAPI.json();
                return itens;
            }

            throw new Error("Não foi possível listar itens do pedido.");
        } catch (error) {
            console.error(`Erro ao consultar itens do pedido: ${error}`);
            return [];
        }
    }

    async cadastrarPedido(dados: {
        idCliente: number;
        itens: Array<{ idProduto: number; qtdProduto: number; precoUnit: number }>;
    }): Promise<{ sucesso: boolean; mensagem?: string; idVenda?: number }> {
        try {
            const respostaAPI = await fetch(`${this.serverURL}${this.endpointPedido}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(dados)
            });

            const retorno = await respostaAPI.json().catch(() => ({}));

            if (respostaAPI.ok) {
                return { sucesso: true, mensagem: retorno.mensagem, idVenda: retorno.idVenda };
            }

            return { sucesso: false, mensagem: retorno.mensagem || "Erro ao cadastrar pedido." };
        } catch (error) {
            console.error(`Erro ao cadastrar pedido: ${error}`);
            return { sucesso: false, mensagem: "Erro de conexão com o servidor." };
        }
    }

    async adicionarItem(
        idVenda: number,
        item: { idProduto: number; qtdProduto: number; precoUnit: number }
    ): Promise<{ sucesso: boolean; mensagem?: string }> {
        try {
            const respostaAPI = await fetch(`${this.serverURL}${this.endpointPedido}/${idVenda}/itens`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(item)
            });

            const retorno = await respostaAPI.json().catch(() => ({}));

            if (respostaAPI.ok) {
                return { sucesso: true, mensagem: retorno.mensagem };
            }

            return { sucesso: false, mensagem: retorno.mensagem || "Erro ao adicionar item." };
        } catch (error) {
            console.error(`Erro ao adicionar item: ${error}`);
            return { sucesso: false, mensagem: "Erro de conexão com o servidor." };
        }
    }

    async removerItem(idVenda: number, idProduto: number): Promise<boolean> {
        try {
            const respostaAPI = await fetch(`${this.serverURL}/itens/${idVenda}/${idProduto}`, {
                method: "DELETE"
            });

            return respostaAPI.ok;
        } catch (error) {
            console.error(`Erro ao remover item: ${error}`);
            return false;
        }
    }
}

export default new PedidoRequests();
