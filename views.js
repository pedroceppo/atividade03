const { fornecedores } = require('./dados');

function menu(usuarioLogado) {
    const loginOuLogout = usuarioLogado
        ? `<a href="/logout">Logout (${usuarioLogado})</a>`
        : `<a href="/login">Login</a>`;

    return `
    <nav>
        <a href="/">Home</a>
        <a href="/cadastro-fornecedor">Fornecedor</a>
        <a href="/cadastro-cliente">Cliente</a>
        ${loginOuLogout}
    </nav>`;
}

function layout(titulo, conteudo, usuarioLogado) {
    return `<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <title>${titulo}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 0; background: #f4f4f4; }
        nav { background: #333; padding: 10px 20px; }
        nav a { color: #fff; text-decoration: none; margin-right: 15px; }
        nav a:hover { text-decoration: underline; }
        .container { max-width: 800px; margin: 30px auto; background: #fff; padding: 25px; border-radius: 6px; }
        h1 { color: #333; }
        label { display: block; margin-top: 12px; font-weight: bold; }
        input[type=text], input[type=email], input[type=password] {
            width: 100%; padding: 7px; margin-top: 4px; box-sizing: border-box; border: 1px solid #ccc; border-radius: 4px;
        }
        button { margin-top: 15px; padding: 9px 20px; background: #333; color: #fff; border: none; border-radius: 4px; cursor: pointer; }
        button:hover { background: #555; }
        .erro { color: red; margin-top: 5px; }
        .sucesso { color: green; font-weight: bold; margin-bottom: 15px; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 13px; }
        th { background: #333; color: #fff; padding: 8px; text-align: left; }
        td { border: 1px solid #ddd; padding: 7px; }
        tr:nth-child(even) { background: #f9f9f9; }
    </style>
</head>
<body>
    ${menu(usuarioLogado)}
    <div class="container">
        <h1>${titulo}</h1>
        ${conteudo}
    </div>
</body>
</html>`;
}

function paginaHome(usuarioLogado) {
    return layout('Home', '<p>Bem-vindo ao sistema de cadastros.</p>', usuarioLogado);
}

function paginaLogin(erros, usuarioLogado) {
    const erroHtml = erros ? `<p class="erro">${erros}</p>` : '';
    const form = `
        ${erroHtml}
        <form method="POST" action="/login">
            <label>Usuário:</label>
            <input type="text" name="usuario">
            <label>Senha:</label>
            <input type="password" name="senha">
            <button type="submit">Entrar</button>
        </form>`;
    return layout('Login', form, usuarioLogado);
}

function paginaLogout(usuarioLogado) {
    return layout('Logout', '<p class="sucesso">Logout efetuado com sucesso!</p>', usuarioLogado);
}

function paginaLoginSucesso(nomeUsuario) {
    return layout('Login', `<p class="sucesso">Login efetuado com sucesso! Bem-vindo, ${nomeUsuario}.</p>`, nomeUsuario);
}

function paginaCadastroFornecedor(erros, dadosAnteriores, mensagemSucesso, usuarioLogado) {
    const campos = [
        { name: 'cnpj',         label: 'CNPJ' },
        { name: 'razaoSocial',  label: 'Razão Social / Nome do Fornecedor' },
        { name: 'nomeFantasia', label: 'Nome Fantasia' },
        { name: 'endereco',     label: 'Endereço' },
        { name: 'cidade',       label: 'Cidade' },
        { name: 'uf',           label: 'UF' },
        { name: 'cep',          label: 'CEP' },
        { name: 'email',        label: 'E-mail' },
        { name: 'telefone',     label: 'Telefone' },
    ];

    const sucessoHtml = mensagemSucesso ? `<p class="sucesso">${mensagemSucesso}</p>` : '';

    const inputsHtml = campos.map(campo => {
        const erro = erros && erros[campo.name] ? `<p class="erro">${erros[campo.name]}</p>` : '';
        const valor = dadosAnteriores && dadosAnteriores[campo.name] ? dadosAnteriores[campo.name] : '';
        return `
            <label>${campo.label}:</label>
            <input type="text" name="${campo.name}" value="${valor}">
            ${erro}`;
    }).join('');

    let tabelaHtml = '';
    if (fornecedores.length > 0) {
        const linhas = fornecedores.map(f => `
            <tr>
                <td>${f.cnpj}</td>
                <td>${f.razaoSocial}</td>
                <td>${f.nomeFantasia}</td>
                <td>${f.cidade}/${f.uf}</td>
                <td>${f.email}</td>
            </tr>`).join('');
        tabelaHtml = `
            <h2>Fornecedores Cadastrados</h2>
            <table>
                <tr>
                    <th>CNPJ</th><th>Razão Social</th><th>Nome Fantasia</th><th>Cidade/UF</th><th>E-mail</th>
                </tr>
                ${linhas}
            </table>`;
    }

    const conteudo = `
        ${sucessoHtml}
        <form method="POST" action="/cadastro-fornecedor">
            ${inputsHtml}
            <button type="submit">Cadastrar</button>
        </form>
        ${tabelaHtml}`;

    return layout('Cadastro de Fornecedor', conteudo, usuarioLogado);
}

function paginaCadastroCliente(usuarioLogado) {
    return layout('Cadastro de Cliente', '<p>Formulário de cadastro de cliente (em construção).</p>', usuarioLogado);
}

function pagina404(usuarioLogado) {
    return layout('Página não encontrada', '<p>A página que você buscou não existe.</p>', usuarioLogado);
}

module.exports = {
    paginaHome,
    paginaLogin,
    paginaLogout,
    paginaLoginSucesso,
    paginaCadastroFornecedor,
    paginaCadastroCliente,
    pagina404
};
