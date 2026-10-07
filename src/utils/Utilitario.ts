class Utilitario {
    // Formata a data no padrão DD/MM/AAAA
    formatarData(data: string | Date | undefined | null): string {
        if (!data) return "-";
        return new Date(data).toLocaleDateString("pt-br", { timeZone: "UTC" });
    }

    // Formata o CPF no padrão XXX.XXX.XXX-XX
    formatarCPF(cpf: string): string {
        const nums = cpf.replace(/\D/g, ""); // remove caracteres não numéricos
        if (nums.length <= 11) {
            return nums
                .replace(/(\d{3})(\d)/, "$1.$2")
                .replace(/(\d{3})(\d)/, "$1.$2")
                .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
        }
        return cpf;
    }

    // Valida CPF simples (11 dígitos)
    validarCPF(cpf: string): boolean {
        const nums = cpf.replace(/\D/g, "");
        return nums.length === 11;
    }

    // Formata o telefone no padrão (XX) X XXXX-XXXX ou (XX) XXXX-XXXX
    formatarTelefone(telefone: string): string {
        const nums = telefone.replace(/\D/g, "");
        if (nums.length === 11) {
            return nums.replace(/(\d{2})(\d{1})(\d{4})(\d{4})/, "($1) $2 $3-$4");
        } else if (nums.length === 10) {
            return nums.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
        }
        return telefone;
    }

    // Formata moeda no valor Real BRL
    formatarParaReal(valor: number | undefined | null): string {
        if (typeof valor !== "number") return "R$ 0,00";
        return new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL"
        }).format(valor);
    }

    // Remove as informações de hora de um objeto Date para preencher input type="date"
    formatarDataParaInput(data: string | Date | undefined | null): string {
        if (!data) return "";
        const d = new Date(data);
        return d.toISOString().split("T")[0];
    }

    // Valida um e-mail através de uma expressão regular
    validarEmail(email: string): boolean {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }
}

export default new Utilitario();
