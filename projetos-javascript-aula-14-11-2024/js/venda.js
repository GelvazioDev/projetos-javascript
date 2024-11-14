function carregaProduto(){
    const idProduto = parseInt(document.querySelector("#produto_id").value);

    console.log("Carregando produto:" + idProduto);

    // Chamar a api e pegar os dados de produto
    const method = "GET";
    const rota = "produtos/" + idProduto;
    callApi(method, rota, function (data) {
        
        document.querySelector("#quantidade").value = 1;
        document.querySelector("#descricao").value = data.descricao;
        document.querySelector("#precounitario").value = data.preco;

        // Calcular o total do item
        atualizaTotalItem();

        // Envia o foco para o campo de quantidade
        document.querySelector("#quantidade").focus();
    });
}

function atualizaTotalItem(){
    // calcula na tela e seta o foco no botão adicionar
    const quantidade = parseInt(document.querySelector("#quantidade").value);
    const precounitario = document.querySelector("#precounitario").value;
    const totalItem = quantidade * precounitario;
    document.querySelector("#total-item").value = totalItem;

    // seta o foco no botão de adicionar item
    document.querySelector("#btn-adicionar-item").focus();
}

function adicionarItem(){
    // Atualizar o estoque do item - ver por ultimo 

    // Adiciona o item na tela    
    const idProduto = parseInt(document.querySelector("#produto_id").value);
    const quantidade = document.querySelector("#quantidade").value;
    const descricao = document.querySelector("#descricao").value;
    const precounitario = document.querySelector("#precounitario").value;
    const totalitem = document.querySelector("#total-item").value;

    // Atualizar o total da venda 
    const totalAtual = parseFloat(document.querySelector("#totalvenda").value);
    const novoTotalVenda = totalAtual + parseFloat(totalitem);

    document.querySelector("#totalvenda").value = formataNum(novoTotalVenda);

    let bodyItem = document.querySelector("#tabela-item-venda");
    bodyItem.innerHTML += `<tr>
                                <td>${idProduto}</td>
                                <td class="text-lg-start">${descricao}</td>
                                <td>${quantidade}</td>
                                <td>${precounitario}</td>
                                <td>${totalitem}</td>
                            </tr>`;
}

function fecharModal() {
    const modal = document.querySelector("dialog");
    modal.close();
    modal.style.display = "none";
}

function incluirVenda() {
    const modal = document.querySelector("dialog");
    modal.showModal();
    modal.style.display = "block";

    // limpar o codigo do produto
    document.querySelector("#codigo").value = "";
    // seta a ação para INCLUSAO
    document.querySelector("#ACAO").value = "ACAO_INCLUSAO";

    // limpa os dados antes de incluir
    document.querySelector("#descricao").value = "";
    document.querySelector("#precounitario").value = "";
    document.querySelector("#quantidade").value = "";

    const method = "GET";
    const rota = "vendas";
    let novoCodigo = 0;
    callApi(method, rota, function (data) {
        const proximoCodigo = parseInt(data.length) + 1;
        
        novoCodigo = parseInt(proximoCodigo);

        // Recebe os dados do servidor
        const aListaDados = data;

        // Percorrer o array e ver se nao tem um codigo maior
        aListaDados.forEach(function (data, key) {
            const codigo = data.id;
            if(codigo >= novoCodigo){
                novoCodigo = parseInt(codigo) + 1;
            }
        });

        console.log("Proximo codigo:" + novoCodigo);

        // Seta o proximo codigo na tela
        document.querySelector("#codigo").value = novoCodigo;
    });
}


function confirmarModalVenda() {
    // gravar a venda
    const idVenda     = document.querySelector("#codigo").value;
    const clicodigo   = document.querySelector("#cliente_id").value;
    const vendecodigo = document.querySelector("#vendedor_id").value;
    const condcodigo  = document.querySelector("#condpagto_id").value;
    const datavenda   = document.querySelector("#datavenda").value;
    const statusvenda = document.querySelector("#statusvenda").value;
    
    const acao = "ACAO_INCLUSAO";
    if (acao == "ACAO_INCLUSAO") {
        let body = {
            id:idVenda.toString()    
            ,clicodigo  
            ,vendecodigo
            ,condcodigo 
            ,datavenda  
            ,statusvenda
        };
        
        const method = "POST";
        const rota = "vendas";
        callApiPost(
            method,
            rota,
            function (data) {
                console.log("Venda gravado!" + JSON.stringify(data));
                fecharModal();
                // executaConsulta();
                
                // gravar os itens da venda apos gravar a venda - fazer depois
            },
            body
        );
    } else if (acao == "ACAO_ALTERACAO") {       
    }
}

function loadVendas(){
    if(validaSessaoSistema('PAGINA_DE_VENDAS')){
        // Carrega as vendas
        const method = "GET";
        const rota = "vendas";
        callApi(method, rota, function (data) {
            carregaTabelaConsulta(data);
        });
    }
}

function carregaTabelaConsulta(aListaDados) {
    // Se não for array, coloca como array
    if (!Array.isArray(aListaDados)) {
        aListaDados = new Array(aListaDados);
    }

    const tabela = document.querySelector("#tabela-vendas");
    tabela.innerHTML = "";
    aListaDados.forEach(function (data, key) {
        // {
        //     "id": "6",
        //     "clicodigo": "1",
        //     "vendecodigo": "1",
        //     "condcodigo": "1",
        //     "datavenda": "14/11/2024",
        //     "statusvenda": "ORCAMENTO"
        // },

        const codigo = data.id;
        
        // CHAMAR A API E PEGAR O NOME DO CLIENTE
        const clicodigo = data.clicodigo;

        // CHAMAR A API E PEGAR O NOME DO VENDEDOR
        const vendecodigo = data.vendecodigo;

        // CHAMAR A API E PEGAR A DESCRICAO DA CONDICAO DE PAGAMENTOS
        const condcodigo = data.condcodigo;

        const datavenda = data.datavenda;
        const statusvenda = data.statusvenda;
        
        const acoes = getAcoes(codigo);

        tabela.innerHTML +=
            `
        <tr>
            <td class="text-center">` +
            codigo +
            `</td>
            <td style="text-align: left;">` +
            clicodigo +
            `</td>
            <td class="text-center" style="text-align: right;">` +
            vendecodigo +
            `</td>
            <td class="text-center">` +
            condcodigo +
            `</td> 
            <td class="text-center">` +
            datavenda +
            `</td> 
            <td class="text-center">` +
            statusvenda +
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
                <button class="btn btn-warning" onclick="alterarVenda(` +
        codigo +
        `)">Alterar</button>
                <button  class="btn btn-danger" onclick="excluirVenda(` +
        codigo +
        `)">Excluir</button>
        </div>
    `
    );
}