function validaSessaoSistema(){
    const usuario_logado = sessionStorage.getItem("usuario_logado");
    const token_logado = sessionStorage.getItem("token_logado");
    
    const token_verificar = "54a80097f23822cb26b6d5a980968601" + usuario_logado;
    console.log("usuario_logado: " + usuario_logado);    
    console.log("token_logado  : " + token_logado);
    console.log("tokenverificar: " + token_verificar);
    
    
    // valida o token logado
    if (token_logado == "54a80097f23822cb26b6d5a980968601" + usuario_logado) { 
        const email_usuario_logado = sessionStorage.getItem("email_usuario_logado");
        
        document.querySelector("#email_usuario_logado").value = email_usuario_logado;       
        
        return true;
    }

    window.location.href = "login.html";

    return false;    
}

function confirmarLogin(){
    const email = document.querySelector("#email").value;
    const senha = document.querySelector("#senha").value;

    const body = {
        email: email,
        senha: senha,
    };

    callApiPost(
        "POST",
        "usuarios",
        function (data) {
            // VALIDAR LOGIN
            validarLoginSistema(data, email, senha);
        },
        body
    );
}

function validarLoginSistema(aListaDados, email, senha){
    // Se não for array, coloca como array
    if (!Array.isArray(aListaDados)) {
        aListaDados = new Array(aListaDados);
    }

    let valida = false;
    let dadosUsuario = "";
    let email_usuario_logado = "";
    aListaDados.forEach(function (data, key) {
        // percorre os usuarios e valida a senha e email
        if(data.email == email && data.senha == senha){
            valida = true;
            dadosUsuario = data.id;
            email_usuario_logado = data.email;
        }
    });

    if(valida){
        // SETA O TOKEN
        sessionStorage.setItem(
            "token_logado",
            "54a80097f23822cb26b6d5a980968601" + dadosUsuario
        );

        // SETA O USUARIO LOGADO
        sessionStorage.setItem("usuario_logado", dadosUsuario);
        sessionStorage.setItem("email_usuario_logado", email_usuario_logado);
        
        // REDIRECIONA PARA A HOME
        window.location.href = "produtos.html";
    } else {
        alert("Usuário ou senha não conferem!")
    }
}

function cadastrarLogin(){
    alert("Implementar...");
}

function logout(){
    sessionStorage.removeItem(
        "token_logado"        
    );

    sessionStorage.removeItem(
        "usuario_logado"        
    );

    window.location.href = "produtos.html";
}