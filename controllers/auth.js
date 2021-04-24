
const {response} = require('express')
const bcript = require('bcryptjs');
const Usuario = require('../models/Usuario')
const { generarJWT } = require('../helpers/jwt')

const crearUsuario = async (req, res = response) => {    

    const { email, password } = req.body;
    
    try {
        let usuario = await Usuario.findOne({email})
        if( usuario ){
            return res.status(400).json({
                ok: false,
                msg: 'Un usuario existe con este correo'
            })
        }

        usuario = new Usuario( req.body );

        const salt = bcript.genSaltSync();
        usuario.password = bcript.hashSync( password, salt );

        await usuario.save(usuario)

        const token = await generarJWT( usuario._id, usuario.name )

        res.status(201).json({
            ok: true,
            uid: usuario._id,
            name: usuario.name,
            token
        }) 
        
    } catch (error) {
        console.log('crear usaurio', error);
        res.status(500).json({
            ok: false,
            msg: '',
        }) 
        
    }     
}

const loginUsuario = async (req, res = response) => {

    const { email, password } = req.body

    try {
        const usuario = await Usuario.findOne({email})
        if( !usuario ){
            return res.status(400).json({
                ok: false,
                msg: 'El usuario no existe con ese email'
            })
        } 

        const validPassword = bcript.compareSync( password, usuario.password )

        if( !validPassword ){
            return res.status(400).json({
              ok: false,
             msg: 'Password incorrecto'  
            })   
        }

        const token = await generarJWT( usuario._id, usuario.name )

        res.status(201).json({
            ok: true,
            uid: usuario._id,
            name: usuario.name,
            token
        })

    } catch (error) {
        console.log('login', error );
        res.status(500).json({
            ok: false,
            msg: '',
        }) 
    }
    
}

const revalidarToken = async (req, res = response ) => {

    const uid = req.uid;
    const name = req.name;

    const token = await generarJWT(uid, name )

    res.json({ ok: true,    
               uid,
               name,
               token })
}

module.exports = {
    crearUsuario,
    loginUsuario,
    revalidarToken
}