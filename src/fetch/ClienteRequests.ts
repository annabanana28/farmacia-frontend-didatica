import type ClienteDTO from "../dto/ClienteDTO";

class ClienteRequests {
    private serverURL: string;
    private endpointCliente: string;

    constructor() {
        this.serverURL = "http://localhost:3333";
        this.endpointCliente = "/clientes";
    }

    async obterListaDeClientes(): Promise<ClienteDTO[]> {
        try {
            const respostaAPI = await fetch(`${this.serverURL}${this.endpointCliente}`);

            if (respostaAPI.ok) {
                const listaDeClientes: ClienteDTO[] = await respostaAPI.json();
                return listaDeClientes;
            }

            throw new Error("Não foi possível listar os clientes.");
        } catch (error) {
            console.error(`Erro ao consultar clientes: ${error}`);
            return [];
        }
    }

    async cadastrarCliente(cliente: ClienteDTO): Promise<boolean> {
        try {
            const respostaAPI = await fetch(`${this.serverURL}${this.endpointCliente}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(cliente)
            });

            if (!respostaAPI.ok) {
                const erro = await respostaAPI.json().catch(() => ({}));
                throw new Error(erro.mensagem || `Erro ${respostaAPI.status}`);
            }

            return true;
        } catch (error) {
            console.error(`Erro ao cadastrar cliente: ${error}`);
            return false;
        }
    }
}

export default new ClienteRequests();
