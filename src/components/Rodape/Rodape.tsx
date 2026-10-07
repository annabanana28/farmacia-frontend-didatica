import type { JSX } from "react";

function Rodape(): JSX.Element {
    return (
        <footer className="bg-slate-700 flex flex-col md:flex-row items-center justify-between gap-2 px-6 py-4">
            <p className="text-white text-xs sm:text-sm md:text-base text-center">
                Farmácia Didática - Todos os direitos reservados
            </p>
            <p className="text-white text-xs sm:text-sm md:text-base text-center">
                Projeto Acadêmico
            </p>
        </footer>
    );
}

export default Rodape;
