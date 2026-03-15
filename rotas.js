const { fornecedores, usuarios, sessoes } = require('./dados');
const views = require('./views');

function lerCorpo(req, callback) {
    let corpo = '';
    req.on('data', chunk => {
        corpo += chunk.toString();
    });
    req.on('end', () => {
        const params = {};
        if (corpo) {
            corpo.split('&').forEach(par => {
                const [chave, valor] = par.split('=');
                params[decodeURIComponent(chave)] = decodeURIComponent((valor || '').replace(/\+/g, ' '));
            });
        }
        callback(params);
    });
}

function pegarSessaoId(req) {
    const cookie = req.headers['cookie'] || '';
    const par = cookie.split(';').find(c => c.trim().startsWith('sessaoId='));
    return par ? par.trim().split('=')[1] : null;
}

function usuarioLogado(req) {
    const id = pegarSessaoId(req);
    return id && sessoes[id] ? sessoes[id] : null;
}

function processarRequisicao(req, res) {
    const url = req.url;
    const metodo = req.method;
    const usuario = usuarioLogado(req);

    if (url === '/' && metodo === 'GET') {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(views.paginaHome(usuario));
        return;
    }

    if (url === '/login' && metodo === 'GET') {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(views.paginaLogin(null, usuario));
        return;
    }

    if (url === '/login' && metodo === 'POST') {
        lerCorpo(req, (dados) => {
            const usuarioEncontrado = usuarios.find(
                u => u.usuario === dados.usuario && u.senha === dados.senha
            );

            if (!usuarioEncontrado) {
                res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
                res.end(views.paginaLogin('Usuário ou senha incorretos.', null));
                return;
            }

            const sessaoId = Date.now().toString();
            sessoes[sessaoId] = usuarioEncontrado.usuario;

            res.writeHead(200, {
                'Content-Type': 'text/html; charset=utf-8',
                'Set-Cookie': `sessaoId=${sessaoId}; Path=/`
            });
            res.end(views.paginaLoginSucesso(usuarioEncontrado.usuario));
        });
        return;
    }

    if (url === '/logout' && metodo === 'GET') {
        const id = pegarSessaoId(req);
        if (id) delete sessoes[id];

        res.writeHead(200, {
            'Content-Type': 'text/html; charset=utf-8',
            'Set-Cookie': 'sessaoId=; Max-Age=0; Path=/'
        });
        res.end(views.paginaLogout(null));
        return;
    }

    if (url === '/cadastro-fornecedor' && metodo === 'GET') {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(views.paginaCadastroFornecedor(null, null, null, usuario));
        return;
    }

    if (url === '/cadastro-fornecedor' && metodo === 'POST') {
        lerCorpo(req, (dados) => {
            const camposObrigatorios = [
                { name: 'cnpj',         label: 'CNPJ' },
                { name: 'razaoSocial',  label: 'Razão Social' },
                { name: 'nomeFantasia', label: 'Nome Fantasia' },
                { name: 'endereco',     label: 'Endereço' },
                { name: 'cidade',       label: 'Cidade' },
                { name: 'uf',           label: 'UF' },
                { name: 'cep',          label: 'CEP' },
                { name: 'email',        label: 'E-mail' },
                { name: 'telefone',     label: 'Telefone' },
            ];

            const erros = {};
            camposObrigatorios.forEach(campo => {
                if (!dados[campo.name] || dados[campo.name].trim() === '') {
                    erros[campo.name] = `O campo "${campo.label}" é obrigatório.`;
                }
            });

            if (Object.keys(erros).length > 0) {
                res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
                res.end(views.paginaCadastroFornecedor(erros, dados, null, usuario));
                return;
            }

            fornecedores.push({
                cnpj:         dados.cnpj.trim(),
                razaoSocial:  dados.razaoSocial.trim(),
                nomeFantasia: dados.nomeFantasia.trim(),
                endereco:     dados.endereco.trim(),
                cidade:       dados.cidade.trim(),
                uf:           dados.uf.trim(),
                cep:          dados.cep.trim(),
                email:        dados.email.trim(),
                telefone:     dados.telefone.trim(),
            });

            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end(views.paginaCadastroFornecedor(null, null, 'Fornecedor cadastrado com sucesso!', usuario));
        });
        return;
    }

    if (url === '/cadastro-cliente' && metodo === 'GET') {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(views.paginaCadastroCliente(usuario));
        return;
    }

    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(views.pagina404(usuario));
}

module.exports = { processarRequisicao };
