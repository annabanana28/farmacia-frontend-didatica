class AuthRequests {
    private serverUrl: string;
    private endpointLogin: string;

    constructor() {
        this.serverUrl = "http://localhost:3333";
        this.endpointLogin = "/login";
    }

    async login(login: { email: string; senha: string }): Promise<boolean> {
        try {
            // Se o backend tiver rota de login tenta chamar, caso contrário valida localmente para fins acadêmicos
            try {
                const response = await fetch(`${this.serverUrl}${this.endpointLogin}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(login)
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data.token) {
                        this.persistToken(data.token, data.usuario || { nome: "Farmacêutico(a)", email: login.email }, true);
                        return true;
                    }
                }
            } catch {
                // Backend sem endpoint de login configurado ainda
            }

            // Fallback acadêmico: permite login direto se email e senha forem preenchidos
            if (login.email && login.senha) {
                this.persistToken("token-academico-farmacia", {
                    nome: login.email.split("@")[0].toUpperCase(),
                    email: login.email
                }, true);
                return true;
            }

            return false;
        } catch (error) {
            console.error("Erro no login:", error);
            return false;
        }
    }

    persistToken(token: string, usuario: { nome: string; email: string }, isAuth: boolean) {
        localStorage.setItem("token", token);
        localStorage.setItem("nome", usuario.nome);
        localStorage.setItem("email", usuario.email);
        localStorage.setItem("isAuth", isAuth.toString());
    }

    removeToken() {
        localStorage.removeItem("token");
        localStorage.removeItem("nome");
        localStorage.removeItem("email");
        localStorage.removeItem("isAuth");
    }

    checkTokenExpiry(): boolean {
        const token = localStorage.getItem("token");
        return Boolean(token);
    }
}

export default new AuthRequests();
