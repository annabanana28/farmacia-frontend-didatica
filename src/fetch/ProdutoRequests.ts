import type ProdutoDTO from "../dto/ProdutoDTO";

class ProdutoRequests {
    private serverURL: string;
    private endpointProduto: string;

    constructor() {
        this.serverURL = "http://localhost:3333";
        this.endpointProduto = "/produtos";
    }

    async obterListaDeProdutos(): Promise<ProdutoDTO[]> {
        try {
            const respostaAPI = await fetch(`${this.serverURL}${this.endpointProduto}`);

            if (respostaAPI.ok) {
                const listaDeProdutos: ProdutoDTO[] = await respostaAPI.json();
                return listaDeProdutos;
            }

            throw new Error("Não foi possível listar os produtos.");
        } catch (error) {
            console.error(`Erro ao consultar produtos: ${error}`);
            return [];
        }
    }

    async obterProdutosEmAlerta(): Promise<ProdutoDTO[]> {
        try {
            const respostaAPI = await fetch(`${this.serverURL}${this.endpointProduto}/alerta`);

            if (respostaAPI.ok) {
                const produtosAlerta: ProdutoDTO[] = await respostaAPI.json();
                return produtosAlerta;
            }

            throw new Error("Não foi possível listar os produtos em alerta.");
        } catch (error) {
            console.error(`Erro ao consultar produtos em alerta: ${error}`);
            return [];
        }
    }

    async cadastrarProduto(produto: Omit<ProdutoDTO, "idProduto" | "emAlerta">): Promise<boolean> {
        try {
            const respostaAPI = await fetch(`${this.serverURL}${this.endpointProduto}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(produto)
            });

            if (!respostaAPI.ok) {
                const erro = await respostaAPI.json().catch(() => ({}));
                throw new Error(erro.mensagem || `Erro ${respostaAPI.status}`);
            }

            return true;
        } catch (error) {
            console.error(`Erro ao cadastrar produto: ${error}`);
            return false;
        }
    }

    async atualizarProduto(idProduto: number, produto: Partial<ProdutoDTO>): Promise<boolean> {
        try {
            const respostaAPI = await fetch(`${this.serverURL}${this.endpointProduto}/${idProduto}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(produto)
            });

            if (!respostaAPI.ok) {
                const erro = await respostaAPI.json().catch(() => ({}));
                throw new Error(erro.mensagem || `Erro ${respostaAPI.status}`);
            }

            return true;
        } catch (error) {
            console.error(`Erro ao atualizar produto: ${error}`);
            return false;
        }
    }
}

export default new ProdutoRequests();
