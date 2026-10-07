import type { JSX } from "react";
import BoasVindas from "../../components/BoasVindas/BoasVindas";
import Navegacao from "../../components/Navegacao/Navegacao";
import Rodape from "../../components/Rodape/Rodape";

function PHome(): JSX.Element {
    return (
        <div className="min-h-screen flex flex-col">
            <Navegacao />
            <BoasVindas />
            <Rodape />
        </div>
    );
}

export default PHome;
