export default interface ProdutoDTO {
    idProduto?: number;
    descricao: string;
    preco: number;
    qtdEstoque: number;
    qtdMinEstoque: number;
    validade?: string | Date | null;
    emAlerta?: boolean;
}
