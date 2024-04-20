const express = require('express');
const dotenv = require('dotenv');
const multer = require('multer');
const {FieldValue, getFirestore} = require('firebase-admin/firestore')
const uuid = require('uuid')

const app = express();
const fs = require('fs');

const cors = require('cors');

//Botiga A6
const Sequelize = require("sequelize");
const {NOW} = require("sequelize");

app.use(cors());
app.use(express.json());
app.use(express.static("IMG"));

port = 3080;

app.listen(port, () => {
  console.log(`el port::${port} funciona`)
});

dotenv.config({path: "isma.env"});

const sequelize = new Sequelize(
  process.env.DB_DATABASE,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: 3308,
    dialect: 'mysql'
  }
);

const {getProductModel} = require('./src/product.model');
const Product = getProductModel(sequelize);

const {getCompraModel} = require('./src/compra.model');
const Compres = getCompraModel(sequelize);


sequelize.sync().then(() => {
  console.log('Base de dades sincroniotzada');
}).catch((error) => {
  console.error("No s'ha pogut sincronitzar", error);
});


app.get("/productes", async (req, res) => {
  Product.findAll().then((data) => {
    res.json(data)
  }).catch((error) => {
    console.error("Han fallat els productes", error)
  })

});


app.post('/compres', async (req, res) => {
  let date = new Date();
  const formattedDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
  console.log("formattedDate | ", formattedDate);

  const items = req.body.productes;
  const idFactura = uuid.v4();
  for (const item of items) {
    await Compres.create({
      idfactura: idFactura,
      usuari: item.usuari,
      idproducte: item.producte.idproducte,
      oferta: item.producte.oferta,
      quantitat: item.quantity,
      data: formattedDate,
      cost: item.producte.preu,
      moneda: item.coin
    }).catch((err) => {
      if (err) {
        console.error('Ha hagut un error ', err)
      }
    })
  }
});

app.get("/historialCompres", async (req, res) => {
  Compres.findAll().then((data) => {
    res.json(data)
  }).catch((error) => {
    console.error("Historial el producte | ", error)
  });
});

//Botiga A4


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'Imatges/');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({storage: storage});

// app.post('/signup', async (req, res) => {
//   const userResponse = await admin.auth().createUser({
//     email: req.body.email,
//     password: req.body.password,
//     emailVerified: false,
//     disabled: false,
//   });
//   res.json(userResponse);
// })


app.post('/login', async (req, res) => {
  const {email, password} = req.body;

  const user = await db.collection('clients')
    .where('email', '==', email)
    .where('password', '==', password)
    .get();


  if (user.empty) {

    return res.send(false);
  } else {
    const data = user.docs[0].data();
    console.log(typeof data)
    const info = {
      nomPersona: data.nom,
      emailPersona: data.email,
      contrasenyaPersona: data.password
    }
    return res.send(info);
  }
});

// app.post('/datausers', async (req, res) => {
//   await admin.auth().createUser({
//     Adreca: req.body.Adreca,
//     Cognoms: req.body.Cognoms,
//     Correu: req.body.Correu,
//     Nom: req.body.Nom,
//     Telefon: req.body.Telefon,
//     Rol: req.body.Rol
//   })
// })


app.post('/datausersdelete', (req, res) => {
  db.collection("book-net").doc("clients").update({
    clients: FieldValue.arrayRemove({
      Adreca: req.body.Adreca,
      Cognoms: req.body.Cognoms,
      Correu: req.body.Correu,
      Nom: req.body.Nom,
      Telefon: req.body.Telefon,
      Rol: req.body.Rol
    })
  })
})

app.post('/contacte', (req, res) => {
  let data = new Date();
  let dia = data.getDate();
  let mes = data.getMonth() + 1;
  let any = data.getFullYear();
  let hora = data.getHours();
  let minuts = data.getMinutes();
  let segons = data.getSeconds();
  let data_completa = `${dia}${mes}${any}${hora}${minuts}${segons}`;
  let fitxerContacte = fs.createWriteStream(`Contacte/${data_completa}_contacte.txt`);
  fitxerContacte.write(req.body.nom + "\n");
  fitxerContacte.write(req.body.correu + "\n");
  fitxerContacte.end(req.body.missatge);
})

app.get('/imatges/:nom', (req, res) => {
  const nomImatge = req.params.nom;
  const rutaImatge = `../IMG/${nomImatge}`;

  fs.access(rutaImatge, fs.constants.F_OK, (err) => {
    if (err) {
      res.status(404).send(`No s'ha trobat la foto`)
      return;
    }
    const stream = fs.createReadStream(rutaImatge);
    stream.pipe(res);
  })
});


app.post('/log', (req, res) => {
  let data = new Date();
  let dia = data.getDate();
  let mes = data.getMonth() + 1;
  let any = data.getFullYear();
  let hora = data.getHours();
  let minuts = data.getMinutes();
  let segons = data.getSeconds();
  let data_completa = `${dia}${mes}${any}${hora}${minuts}${segons}`;
  fs.writeFileSync(`log/${req.body.log}.log`, `${data_completa} ${req.body.text}\n`, {flag: 'a+'});
})

// const {FieldValue} = require("firebase-admin/firestore");
var admin = require("firebase-admin");
var serviceAccount = require("./botiga-61177-firebase-adminsdk-a1p5h-93c0cd1ace.json");
// const {getFirestore} = require("firebase-admin/firestore");
const stream = require("stream");
const ap = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
const db = ap.firestore();

app.get('/api/firebase', async (req, res) => {
  const conn = db.collection("iniciar-registrar").doc("8X8qyKzfzPYPdqlUA6Ut");
  const doc = await conn.get();
  const document = doc.data();
  res.json(document);
});

app.post("/register", async (req, res) => {
  if (req.body) {
    try {
      const conn = db.collection("iniciar-registrar").doc("8X8qyKzfzPYPdqlUA6Ut");
      const doc = await conn.get();
      let usersArray = doc.get("client")
      usersArray.push(req.body.user);

      const updatedDoc = await conn.update("client", usersArray);
      res.status(200).send({
        message: "correctly inserted :)"
      });
    } catch (e) {
      console.log(`error | ${e}`);
    }
  }
});


app.get("/dadescompres", async (req, res) => {

});

app.post("/crearProducte", async (req, res) => {
  if (req.body) {
    let producte = req.body.producte

    await Product.create({
      idproducte: producte.idproducte,
      nom: producte.nom,
      preu: producte.preu,
      img: producte.img,
      tipus: producte.tipus,
      createdAt: producte.createdAt,
      updatedAt: producte.updatedAt,
      oferta: producte.oferta,
    }).then(() => {
      res.status(200).send({
        code: 200,
        message: "producte successfully created!"
      })
    }).catch((error) => {
      console.log("Error inserting producte, ", error);
    });
  }
})

// app.post('/api/login',async (req,res)=> {
//
//   const dades = req.body.json;
//
//   console.log(dades)
//     dades.forEach(function(dada) {
//       db.collection('iniciar-registre').doc('yWikbVf2wyCyqnyRkE8z').set(
//         {
//           clients: FieldValue.arrayUnion({
//             nom: dada.nom,
//             email: dada.correu,
//             password: dada.contrasenya
//           })
//         }, {merge: true}).then(r => {
//         console.log("dades inserides")
//       }).catch((err) => {
//         if (err) {
//           console.error(err)
//         }
//       })
//     })
// })
/*



baseDades();
async function baseDades() {



}

app.post('/registrar', async (req, res) => {
  const respostaUser = await admin.auth().createUser({
    email: req.body.email,
    password: req.body.password,
    emailVerified: false,
    disabled: false,
  })
  res.json(respostaUser);
});

app.post('/datausers', async (req, res) => {
  db.collection('iniciar-registrar').doc('8X8qyKzfzPYPdqlUA6Ut').set(
    {
      client: FieldValue.arrayUnion({
        Nom: req.body.nom,
        email: req.body.correu,
        password: 'patata'
      })
    }, {merge: true}).then(r => {
      console.log("dades inserides");
    })
});


//Contacte log
app.post('/api/escriure', (req, res) => {
  const correu = req.body.email;
  const name = req.body.name;
  const missatge = req.body.missatge;
  const now = Date.now();
  const nomArxiu = correu + `${now}.txt`;
  console.log(nomArxiu);

  fs.appendFile("C:\\IdeaProjects\\botiga_js\\src\\Messages\\" + nomArxiu, ' ', (error) => {
    if (error) throw error;
    else console.log("Arxiu creat");
  })

  const writableStream = fs.createWriteStream("C:\\IdeaProjects\\botiga_js\\src\\Messages\\" + nomArxiu)
  console.log("Test");
  writableStream.write("Correu: " + toString() + correu + "\n");
  writableStream.write("Nom: " + toString() + name + "\n");
  writableStream.write("Missatge: " + toString() + missatge + "\n");

})



*/


/*
app.post('/api/formulario', (req, res) => {

  const datos = req.body;


  const nombreArchivo = `datos_${new Date().toISOString()}.txt`;


  fs.writeFile(nombreArchivo, JSON.stringify(datos), (error) => {
    if (error) {
      console.error(`Error al escribir en el archivo ${nombreArchivo}: ${error}`);
      res.status(500).send('Error interno del servidor');
    } else {
      console.log(`Los datos se han guardado en el archivo ${nombreArchivo}`);
      res.status(200).send('Los datos se han guardado correctamente');
    }
  });
});*/
