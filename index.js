const express = require("express")
const bodyParser = require("body-parser")
const nodemailer = require("nodemailer")

/* INICIO CONFIGS NODEMAILER */
/*1) Configurar los datos del servidor de email */
const miniOutlook = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'wilfrid.johnston85@ethereal.email',
        pass: 'GWxGxZ4kW99Qy8RUgP'
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

/* FIN DE CONFIGS NODEMAILER */
const server = express()

const port = 80

const public = express.static("public")

const json = bodyParser.json()

const urlencoded = bodyParser.urlencoded({ extended : false })
/* buscar archivos estaticos en el directorio /public*/

server.use( public )

server.use( json )

server.use( urlencoded )

server.listen( port )
/*Ejecutar endpoints customizados */
server.post("/enviar", function(request, response){
    let datos = {
        rta : "ok", 
        consulta : request.body
	}

//tarea 1) validar que no esten vacios antes de enviar el mail

if (datos.consulta.nombre == ""){

    response.json({
        rta: "Error",
        msg: "El nombre no puede estar vacio"
    })

} else if(datos.consulta.correo == "" || datos.consulta.correo.indexOf("@") == -1){

    response.json({
        rta: "Error",
        msg: "Ingrese un correo valido"
    })



} else if( datos.consulta.asunto == ""){

    response.json({

        rta: "Error",
        msg: "Elija un asunto"
    })
} else if (datos.consulta.mensaje.length < 50 || datos.consulta.mensaje.length > 200){

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
response.json( datos )

})


//tarea 2) definir un msj si sale bien o si sale mal en el response
	
//Envio de mail...