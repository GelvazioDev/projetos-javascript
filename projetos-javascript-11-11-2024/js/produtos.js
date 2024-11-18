function loadProdutos(){
    const method = "GET";
    const rota = "produtos";
    callApi(method, rota, function (data) {
        carregaTabelaConsulta(data);
    });
}

function carregaTabelaConsulta(aListaDados) {
    // Se não for array, coloca como array
    if (!Array.isArray(aListaDados)) {
        aListaDados = new Array(aListaDados);
    }

    const tabela = document.querySelector("#consulta-produto");
    tabela.innerHTML = "";
    aListaDados.forEach(function (data, key) {
        const codigo    = data.id;
        const descricao = data.descricao;
        const preco     = data.preco;
        const estoque   = data.estoque;
        
        const acoes = getAcoes(codigo);

        tabela.innerHTML +=
            `
        <tr>
            <td class="text-center">` +
            codigo +
            `</td>
            <td style="text-align: left;">` +
            descricao +
            `</td>
            <td class="text-center" style="text-align: right;">` +
            preco +
            `</td>
            <td class="text-center">` +
            estoque +
            `</td>           
            <td>` +
            acoes +
            `</td>
        </tr>
        `;
    });
}

function getAcoes(codigo) {
    return (
        `<div class="acoes text-center">
                <button class="btn btn-warning" onclick="alterarProduto(` +
        codigo +
        `)">Alterar</button>
                <button  class="btn btn-danger" onclick="excluirProduto(` +
        codigo +
        `)">Excluir</button>
        </div>
    `
    );
}

function excluirProduto(codigo){
    const method = "DELETE";
    const rota = "produtos/" + codigo;
    callApi(method, rota, function (data) {
        loadProdutos();
    });
}
