const Sequelize = require('sequelize')
const sequelize = new Sequelize('node_exemplo', 'root', '', {
    host: "127.0.0.1",
    dialect: 'mysql',
    define: {
        charset: 'utf8',
        collate: 'utf8_general_ci',
        timestamps: true
    },
    logging: false
})

module.exports = {Sequelize, sequelize}

/*
sequelize.authenticate().then(function() {
    console.log('Conectado com Sucesso com o BD!')
}).catch(function(err) {
    console.log('Falha ao acessar o BD:'+ err)
})
*/
