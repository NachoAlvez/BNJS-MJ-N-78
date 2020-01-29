const express = require("express")
const bodyParser = require("body-parser")
const nodemailer = require("nodemailer")
const multer = require("multer")
const joi = require("@hapi/joi")
const hbs = require("nodemailer-express-handlebars")


/* INICIO CONFIGS NODEMAILER */
/*1) Configurar los datos del servidor de email */
const miniOutlook = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'hyman.mraz@ethereal.email',
        pass: 'u3YEJ156Rs9bFZ4HBt'
    }
});

// 2) Verificar conexion con el servidor de email

miniOutlook.verify(function(error, ok){

    if(error){ //<--si fallo
        console.log("AHHHHHHHHH")
        console.log(error)

    }else{ //<-- si salio bien

        console.log("Ready Player One")

    }

})
//3) Asignar motor de plantilla "Handlebars"
const render = {
    viewEngine :{
        layoutsDir :"templates/",
        partialsDir : "templates/",
        defaultLayout : false,
        extName : ".hbs"
    },
    viewPath : "templates/",
    extName : ".hbs"
}
miniOutlook.use("compile", hbs(render))

/* FIN DE CONFIGS NODEMAILER */
const server = express()

const port = 80

const public = express.static("public")

const json = bodyParser.json()

const urlencoded = bodyParser.urlencoded({ extended : false })

const upload = multer()
/* buscar archivos estaticos en el directorio /public*/

server.use( public )

server.use( json )

server.use( urlencoded )

server.use( upload.array() )

server.listen( port )
/*Ejecutar endpoints customizados */
server.post("/enviar", function(request, response){
    let datos = {
        rta : "ok", 
        consulta : request.body
	}

//tarea 1) validar que no esten vacios antes de enviar el mail
//aca deberia validar

//tarea : Implementar el sistema de plantillas handlebars + envio del email 
//https://www.npmjs.com/package/nodemailer-express-handlebars

const schema = joi.object({
    nombre :joi.string().alphanum().min(4).max(25).required(),
    correo :joi.string().email({
        minDomainSegments : 2, 
        tlds : {
            allow : ["com","net", "org"]
        }
        }).required(),
    asunto : joi.string().alphanum().valid("ax45", "ax38", "ax67", "ax14").required(),
    mensaje :joi.string().min(50).max(200).required(),
    fecha : joi.date().timestamp("unix")
})

let validacion = schema.validate(datos.consulta)

if ( validacion.error ){
    response.json( validacion.error )

} else {
    miniOutlook.sendMail({
        from : datos.consulta.correo,
        to : "nnacho.alvez@hotmail.com",
        subject : datos.consulta.asunto,
       // html : "<strong>" + datos.consulta.mensaje + "</strong>"
        template : "prueba",
        context : datos.consulta

        }, function(error, info){
 
            let msg = error ? "Su consulta no pudo ser enviada :'(" : "Gracias por su consulta :D"

            response.json ({msg})

        })

}

response.json({ msg : "Gracias por su consulta!"})

response.end("mira la consola...")

/*
if (datos.consulta.nombre == ""  || datos.consulta.nombre == null){

    response.json({
        rta: "Error",
        msg: "El nombre no puede estar vacio"
    })

} else if(datos.consulta.correo == "" || datos.consulta.correo.indexOf("@") == -1 || datos.consulta.correo == null){

    response.json({
        rta: "Error",
        msg: "Ingrese un correo valido"
    })



} else if( datos.consulta.asunto == "" || datos.consulta.asunto == null){

    response.json({

        rta: "Error",
        msg: "Elija un asunto"
    })
} else if (datos.consulta.mensaje.length < 50 || datos.consulta.mensaje.length > 200 || datos.consulta.mensaje.length == null){

    response.json ({
        rta: "Error",
        msg: "Ingrese un mensaje entre 50 y 200 caracteres"
    })
} else 
    miniOutlook.sendMail({
	from : datos.consulta.correo,
	to : "nnacho.alvez@hotmail.com",
	subject : datos.consulta.asunto,
	html : "<strong>" + datos.consulta.mensaje + "</strong>"
    })
    
    */
//response.json( datos )

})


//tarea 2) definir un msj si sale bien o si sale mal en el response
	
//Envio de mail...