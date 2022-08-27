//imports
const express = require ('express')
const app = express()
const hbs = require('express-handlebars')
const bodyParser = require('body-parser')
const session = require('express-session')

//Importar model Usuario
const Usuario = require('./models/Usuario')

//Configuração do Handlebars
app.engine('hbs', hbs.engine({
    extname: 'hbs', 
    defaultLayout: 'main'
}))

app.set('view engine', 'hbs')

app.use(express.static('public'))

app.use(bodyParser.urlencoded({extended:false}))


//Confuguração das Sessions
app.use(session({
    secret:'123blablabla',
    resave: false,
    saveUninitialized: true
}))

//Configurações da Aplicação


//Configurações de Rotas
app.get('/', (req, res) => {
    if (req.session.errors) {
        let arrayErrors = req.session.errors
        req.session.errors = ""
        return res.render('index', {NavActiveCad:true, errors:arrayErrors})
    }

    if (req.session.success) {
        req.session.success = false
        return res.render('index', {NavActiveCad:true, MsgSuccces: true})
    }
    res.render('index', {NavActiveCad:true})
    
})

app.get('/users', (req, res) => {
    Usuario.findAll().then((valores) => {
        if (valores.length > 0) {
            res.render('users', {NavActiveUsers:true, table: true, usuarios: valores.map(valores => valores.toJSON()) } )
        } else {
            res.render('users', {NavActiveUsers:true, table: false} )
        }
        
    }).catch((err) => {
        console.log(`Houve um problema: ${err}`)
    })
    //res.render('users', {NavActiveUsers:true})
})

app.get('/editar', (req, res) => {
    res.render('editar')
})

app.post('/editar', (req, res) => {
    let id = req.body.id
    Usuario.findByPk(id).then((dados) => {
        return res.render('editar', {error: false, id: dados.id, nome: dados.nome, email: dados.email})
    }).catch((err) => {
        console.log(err)
        return res.render('editar', {error: true, problema: 'Não é possível editar esse registro!'})
    })  
})

app.post('/update', (req, res) => {
    //Valores vindos do formulário
    let nome = req.body.nome
    let email = req.body.email

    //Array que vai conter os erros
    const erros = []

    //Validação dos Campos
    
    /* Remover espaços em branco */
    nome = nome.trim()
    email.trim()

    /* Limpar caracteres especiais */
    nome = nome.replace(/[^A-zÀ-ú\s]/gi, '')
    nome = nome.trim()

    /* Verificar se está vazio ou não definido */
    if (nome == '' || typeof nome == undefined || nome == null) {
        erros.push({mensagem: "Campo nome não pode ser vazio!"})
    }

    /* Verificar se campo nome é válido (apenas letras)*/
    if(!/^[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ\s]+$/.test(nome)) {
        erros.push({mensagem:"Nome Inválido!"})
   }
   
   /* Verificar se está vazio ou não definido */
    if (email == '' || typeof email == undefined || email == null) {
        erros.push({mensagem: "Campo email não pode ser vazio!"})
    }

    /* Verificar se campo email é válido*/
    if (/^[a-z0-9.]+@[a-z0-9]+\.[a-z]+\.([a-z]+)?$/i.test(email)) {
        erros.push({mensagem:"Campo email Inválido!"})
    }

    if(erros.length > 0) {
        return res.status(400).send({status: 400, erro: erros})
    }

    //Sucesso (Nenhum Erro) - Atualizar registro no BD
    Usuario.update({
        nome: nome,
        email: email.toLowerCase()
    },
    {
        where: {
            id: req.body.id
        }
    }).then((resultado) => {
        console.log(resultado)
        return res.redirect('/users')
    }).catch((err) => {
        console.log(err)
    })
})

app.post('/del', (req, res) => {
    Usuario.destroy({
        where:{
            id: req.body.id
        }
    }).then((retorno) => {
        return res.redirect('/users')
    }).catch((err) => {
        console.log(err)
    })   
})

app.post('/cad', (req, res) => {
    //Valores vindos do formulário
    let nome = req.body.nome
    let email = req.body.email

    //Array que vai conter os erros
    const erros = []

    //Validação dos Campos
    
    /* Remover espaços em branco */
    nome = nome.trim()
    email.trim()

    /* Limpar caracteres especiais */
    nome = nome.replace(/[^A-zÀ-ú\s]/gi, '')
    nome = nome.trim()

    /* Verificar se está vazio ou não definido */
    if (nome == '' || typeof nome == undefined || nome == null) {
        erros.push({mensagem: "Campo nome não pode ser vazio!"})
    }

    /* Verificar se campo nome é válido (apenas letras)*/
    if(!/^[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ\s]+$/.test(nome)) {
        erros.push({mensagem:"Nome Inválido!"})
   }
   
   /* Verificar se está vazio ou não definido */
    if (email == '' || typeof email == undefined || email == null) {
        erros.push({mensagem: "Campo email não pode ser vazio!"})
    }

    /* Verificar se campo email é válido*/
    if (/^[a-z0-9.]+@[a-z0-9]+\.[a-z]+\.([a-z]+)?$/i.test(email)) {
        erros.push({mensagem:"Campo email Inválido!"})
    }

    if(erros.length > 0) {
        req.session.errors = erros
        req.session.success = false
        return res.redirect('/')
    }

    //Sucesso (Nenhum Erro) - Salvar no BD
    Usuario.create({
        nome: nome,
        email: email.toLowerCase()
    }).then(function() {
        console.log('Cadastrado com sucesso!') 
        req.session.success = true
        return res.redirect('/')
    }).catch(function(err) {
        console.log(`Ops, houve um erro: ${err}`)
    })
})

//Configurações dos Handlers de Erro


//Inicialização do Servidor
app.listen(3000, () => {
    console.log('Aplicação rodando na porta 3000!')
})
