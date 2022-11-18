//Array original
let arrayJson;
let arrayVehiculos=[];

function traerVehiculos()
{
    MostrarSpinner(true);
    let consulta = fetch('http://localhost/vehiculoAereoTerrestre.php',{
        method: "GET",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers :{
            'Content-Type' : 'application/json'
        },
        redirect: "follow",
        referrerPolicy : "no-referrer", 
        //body: JSON.stringify(personaje)
    });
    consulta.then(respuesta=>{
        MostrarSpinner(false);
        if(respuesta.status==200)
        {
            respuesta.json().then(objetoEnJson =>{
                arrayJson = objetoEnJson; 
                MostrarSpinner(false);
                CargaInformacionJSON();         
            }).catch(err => {
                alert (err);
                MostrarOcultarForm();  
            }) 
        }else{
            mensajeErrorForm.innerText="Error, no se pudo realizar la carga de datos!";
            mensajeErrorForm.style.display= "flex"; 
            MostrarOcultarForm(); 
            setTimeout(()=>{
                mensajeErrorForm.style.display= "none";
            },3000);
        }
    }).catch(err=>alert(err));
};


function traerPersonajes(){
    MostrarSpinner(true);
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function(){
        if(xhttp.readyState ==4) //Se espera a llegar al estado 4 y despues se valida el estado 200
        {
            if(xhttp.status == 200 )
            {
                console.log(xhttp.response)
                arrayJson = JSON.parse(xhttp.response); 
                MostrarSpinner(false);
                CargaInformacionJSON();      
            }else{
                MostrarSpinner(false);
                formularioVisible=true;
                MostrarOcultarForm();
                mensajeErrorForm.innerText="Error, no se pudo leer la base de datos";
                    mensajeErrorForm.style.display= "flex";   
            }
        }     
    };
xhttp.open("GET","http://localhost/personajes.php",true,"usuarios","pass");
xhttp.send();
};


async function modificarPersonaje(personaje,atributos)
{
    MostrarSpinner(true);
    let consulta = await fetch('http://localhost/personajes.php',{
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers :{
            'Content-Type' : 'application/json'
        },
        redirect: "follow",
        referrerPolicy : "no-referrer",
        body: JSON.stringify(personaje)
    });
    let texto = await consulta.text();
    if(consulta.status==400)
    {
        personaje.ActualizarDatos(atributos[0],atributos[1],atributos[2],atributos[3],atributos[4],atributos[5]);
        MostrarOcultarForm();      
        MostrarSpinner(false);
    }else{
        mensajeErrorForm.innerText="Error, no se pudo realizar la modificacion!";
        mensajeErrorForm.style.display= "flex"; 
        MostrarSpinner(false);
        MostrarOcultarForm(); 
        setTimeout(()=>{
            mensajeErrorForm.style.display= "none";
        },3000);
    }
}

async function eliminarPersonaje(personaje,indice)
{
    MostrarSpinner(true);
    let consulta = await fetch('http://localhost/personajes.php',{
        method: "DELETE",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers :{
            'Content-Type' : 'application/json'
        },
        redirect: "follow",
        referrerPolicy : "no-referrer",
        body: JSON.stringify(personaje)
    });
    let texto = await consulta.text();
    if(consulta.status!=400)
    {
        arrayPersonas.splice(indice,1);
        MostrarOcultarForm();      
        MostrarSpinner(false);
    }else{
        mensajeErrorForm.innerText="Error, no se pudo realizar la baja!";
        mensajeErrorForm.style.display= "flex"; 
        MostrarSpinner(false);
        MostrarOcultarForm(); 
        setTimeout(()=>{
            mensajeErrorForm.style.display= "none";
        },3000);
    }
}

//Variables
let formularioVisible=true;

//Selectores
let body = document.querySelector("body");
let comboBox = document.getElementById("select_filtro");
let tablaInformacion = document.getElementById("tabla");
let botonCalculo = document.getElementById("calcular_btn");
let botonAgregar = document.getElementById("agregar_btn");
let comboBoxAlta = document.getElementById("select_tipo");
let botonAlta = document.getElementById("alta_btn");
let botonModificar = document.getElementById("modificar_btn");
let botonEliminar = document.getElementById("eliminar_btn");
let botonCancelar = document.getElementById("cancelar_btn");
let etiquetaError = document.getElementById("mensaje_error");
let mensajeErrorForm = document.getElementById("etiquetaErrores");


function MostrarSpinner(bool)
{
    let spinner = document.getElementById("spinnerId");
    let container = document.getElementById("mainCointaner");
    if(bool)
    {   
        spinner.style.display = "flex";
        container.style.display="none";
    }else{
        spinner.style.display = "none";
        container.style.display="block";
    }
}

//Asignacion de listeners
window.addEventListener("load",traerPersonajes);
window.addEventListener("load",CargarTablas);
comboBox.addEventListener("change",CargarTablas)
comboBoxAlta.addEventListener("change",OcultarCampos)
botonCalculo.addEventListener("click",CalcularEdadPromedio);
botonAgregar.addEventListener("click",MostrarOcultarForm);
botonAlta.addEventListener("click",AltaModificacion);
botonModificar.addEventListener("click",AltaModificacion);
botonEliminar.addEventListener("click",EliminarRegistro)

//Métodos automaticos
function CargaInformacionJSON()
{
    arrayJson.forEach(element => {
        if(element.hasOwnProperty("altMax"))
        {
            let nuevoAereo = new Aereo(element["id"],element["modelo"],element["anoFab"],element["velMax"],
            element["altMax"],element["autonomia"])
            arrayVehiculos.push(nuevoAereo);
        }else{
            let nuevoTerrestre = new Terrestre(element["id"],element["modelo"],element["anoFab"],element["velMax"],
            element["cantPue"],element["cantRue"]);
            arrayVehiculos.push(nuevoTerrestre);
        }
    });
    MostrarOcultarForm();
}

//ABM

function ValidarCampos(id,nombre,apellido,edad,alterego,ciudad,publicado,enemigo,robos,asesinatos)
{
    if(id==""||isNaN(id)){
        etiquetaError.style.display="flex";
        etiquetaError.innerText="Revisar el ID";
        return false;
    }
    if(nombre==""||!isNaN(nombre)){
        etiquetaError.style.display="flex";
        etiquetaError.innerText="Revisar el ID";
        return false;
    }
    if(apellido==""||!isNaN(apellido)){
        etiquetaError.style.display="flex";
        etiquetaError.innerText="Revisar el apellido";
        return false;
    }
    if(isNaN(edad)){
        etiquetaError.style.display="flex";
        etiquetaError.innerText="Revisar la edad";
        return false;
    }
    if(comboBoxAlta.value == "heroes")
    {
        if(alterego==""||!isNaN(alterego)){
            etiquetaError.style.display="flex";
            etiquetaError.innerText="Revisar el alter ego";
            return false;
        }
        if(ciudad==""||!isNaN(ciudad)){
            etiquetaError.style.display="flex";
            etiquetaError.innerText="Revisar la ciudad";
            return false;
        }
        if(publicado<1940||isNaN(publicado)){
            etiquetaError.style.display="flex";
            etiquetaError.innerText="Revisar la publicación";
            return false;
        }    
    }else
    {
        if(enemigo==""||!isNaN(enemigo)){
            etiquetaError.style.display="flex";
            etiquetaError.innerText="Revisar el enemigo";
            return false;
        }
        if(robos<1||isNaN(robos)){
            etiquetaError.style.display="flex";
            etiquetaError.innerText="Revisar los robos";
            return false;
        }
        if(asesinatos<1||isNaN(asesinatos)){
            etiquetaError.style.display="flex";
            etiquetaError.innerText="Revisar los asesinatos";
            return false;
        }
    }
    etiquetaError.style.display="none";
   return true;
}

function EncontrarUltimoId()
{
    let ultimoId=0;
    console.log(ultimoId);
    arrayPersonas.forEach(element => {
        if(element.id>ultimoId)
        {
            ultimoId=element.id;
        }
    });

    
    return ultimoId;
}

function EliminarRegistro()
{
    let id = document.getElementById("input_id").value;
    for (let index = 0; index < arrayPersonas.length; index++) {
        if(arrayPersonas[index].id == id)
        {
            eliminarPersonaje(arrayPersonas[index],index);
            break;
        }  
    }
}

function AltaModificacion()
{
    comboBoxAlta.disabled = false;
    let id = document.getElementById("input_id").value;
    let nombre = document.getElementById("input_nombre").value;
    let apellido = document.getElementById("input_apellido").value;
    let edad = parseInt(document.getElementById("input_edad").value);
    let alterego = document.getElementById("input_alterEgo").value;
    let ciudad = document.getElementById("input_ciudad").value;
    let publicado = parseInt(document.getElementById("input_publicacion").value);
    let enemigo = document.getElementById("input_enemigo").value;
    let robos = document.getElementById("input_robos").value;
    let asesinatos = parseInt(document.getElementById("input_asesinatos").value);
    if(ValidarCampos(EncontrarUltimoId() + 1,nombre,apellido,edad,alterego,ciudad,publicado,enemigo,robos,asesinatos))
    {
        if(comboBoxAlta.value == "heroes")
        {
            if(id=="")
            {
                let HeroeAux = new Heroe(EncontrarUltimoId() + 1, nombre,apellido,edad,alterego,ciudad,publicado);
                cargarPersonaje(HeroeAux);
            }else{
                let heroeModificar = arrayPersonas.filter(element=>element.id==id);
                modificarPersonaje(heroeModificar[0],[nombre,apellido,edad,alterego,ciudad,publicado]);
            }
        }else
        {
            if(id=="")
            {            
                let VillanoAux = new Villano(nombre,apellido,edad,enemigo,robos,asesinatos);
                cargarPersonaje(VillanoAux);
            }else{
                let VillanoModificar = arrayPersonas.filter(element=>{ if(element.id==id) return element});
                modificarPersonaje(VillanoModificar[0],[nombre,apellido,edad,enemigo,robos,asesinatos]);
            }
        }
    }
   
}

function CargarTablas()
{
    tablaInformacion.innerHTML=""; 
    etiquetaError.style.display="none";
    CargarTitulos();
    arrayFiltrado = arrayPersonas.filter(element => FiltrarPorComboBox(element));
    arrayFiltrado.map(element=>CrearRegistros(element));  
}

function AbrirFormModificacion(fila,tipo)
{
    if(fila.cells[4].innerText=="N/A")
    {
        comboBoxAlta.value="villanos";
    }else{
        comboBoxAlta.value="heroes";
    }
    comboBoxAlta.disabled = true;
    MostrarOcultarForm()
    document.getElementById("input_id").value= fila.cells[0].innerText;
    document.getElementById("input_nombre").value =fila.cells[1].innerText;
    document.getElementById("input_apellido").value =fila.cells[2].innerText;
    document.getElementById("input_edad").value=fila.cells[3].innerText;
    document.getElementById("input_alterEgo").value=fila.cells[4].innerText;
    document.getElementById("input_ciudad").value=fila.cells[5].innerText;
    document.getElementById("input_publicacion").value=fila.cells[6].innerText;
    document.getElementById("input_enemigo").value=fila.cells[7].innerText;
    document.getElementById("input_robos").value=fila.cells[8].innerText;
    document.getElementById("input_asesinatos").value=fila.cells[9].innerText;
    botonAlta.style.display="none";
    botonCancelar.style.display="none";
    if(tipo==="mod")
    {
        botonModificar.style.display="inherit";
    }else{
        botonEliminar.style.display="inherit";
    }
}

function CrearRegistros(element)
{
    let filaTabla = document.createElement("tr");
    let celdaId = document.createElement("td");
    let celdaModelo= document.createElement("td");
    let celdaAnoFab = document.createElement("td");
    let celdaVelMax = document.createElement("td");
    let celdaAltMax = document.createElement("td");
    let celdaAutonomia =document.createElement("td");
    let celdaCantPue = document.createElement("td");
    let centaCantRue = document.createElement("td");
    let celdaModificar = document.createElement("td");
    let celdaEliminar = document.createElement("td");

    let botonModificar = document.createElement("button");
    botonModificar.innerText="Modificar"
    let botonEliminar = document.createElement("button");
    botonEliminar.innerText="Eliminar"
    filaTabla.appendChild(celdaId);
    filaTabla.appendChild(celdaModelo);
    filaTabla.appendChild(celdaAnoFab);
    filaTabla.appendChild(celdaVelMax);
    filaTabla.appendChild(celdaAltMax);
    filaTabla.appendChild(celdaAutonomia);
    filaTabla.appendChild(celdaCantPue);
    filaTabla.appendChild(centaCantRue);
    filaTabla.appendChild(celdaModificar);
    filaTabla.appendChild(celdaEliminar);
    botonModificar.addEventListener("click",() =>AbrirFormModificacion(filaTabla, "mod"));
    botonEliminar.addEventListener("click",() =>AbrirFormModificacion(filaTabla, "sup"));

    celdaId.innerText=element.id;
    celdaModelo.innerText=element.modelo;   
    celdaAnoFab.innerText=element.anoFab;   
    celdaVelMax.innerText=element.velMax;
    celdaAltMax.innerText= element instanceof Aereo ? element.altMax : "N/A"   
    celdaAutonomia.innerText=element instanceof Aereo ? element.autonomia : "N/A"   
    celdaCantPue.innerText=element instanceof Terrestre ? element.cantPue : "N/A"   
    centaCantRue.innerText= element instanceof Terrestre ? element.cantRue : "N/A"   
    celdaModificar.appendChild(botonModificar);
    celdaEliminar.appendChild(botonEliminar);
   
    tablaInformacion.appendChild(filaTabla);
}


function CargarTitulos()
{
    let filaTitulos = document.createElement("tr");
    let celdaId = document.createElement("th");
    let celdaNombre= document.createElement("th");
    let celdaApellido = document.createElement("th");
    let celdaEdad = document.createElement("th");
    let celdaalterego = document.createElement("th");
    let celdaCiudad =document.createElement("th");
    let celdaPublicado = document.createElement("th");
    let celdaEnemigo = document.createElement("th");
    let celdaRobos = document.createElement("th");
    let celdaAsesinatos = document.createElement("th");
    let celdaModificar = document.createElement("th");
    let celdaEliminar = document.createElement("th");

    filaTitulos.appendChild(celdaId);
    filaTitulos.appendChild(celdaNombre);
    filaTitulos.appendChild(celdaApellido);
    filaTitulos.appendChild(celdaEdad);
    filaTitulos.appendChild(celdaalterego);
    filaTitulos.appendChild(celdaCiudad);
    filaTitulos.appendChild(celdaPublicado);
    filaTitulos.appendChild(celdaEnemigo);
    filaTitulos.appendChild(celdaRobos);
    filaTitulos.appendChild(celdaAsesinatos);
    filaTitulos.appendChild(celdaModificar);
    filaTitulos.appendChild(celdaEliminar);

    celdaId.innerText="ID";
    celdaNombre.innerText="Nombre";
    celdaApellido.innerText="Apellido";
    celdaEdad.innerText="Edad";
    celdaalterego.innerText="alterego";
    celdaCiudad.innerText="Ciudad";
    celdaPublicado.innerText="Publicado";
    celdaEnemigo.innerText="Enemigo";
    celdaRobos.innerText="Robos";
    celdaAsesinatos.innerText="Asesinatos";
    celdaModificar.innerText="Modificar";
    celdaEliminar.innerText="Eliminar";

    tablaInformacion.appendChild(filaTitulos);
    let titulosColumnas = document.querySelectorAll('th');
    titulosColumnas.forEach(element => {
    element.addEventListener("click",OrdernarColumnas);
    });
}

//Calculos
function CalcularEdadPromedio()
{
    let acumulador=0;
    let arrayFiltrado = arrayPersonas.filter(element => FiltrarPorComboBox(element));
    acumulador = arrayFiltrado.reduce((sumaParcial, a) => sumaParcial + a.edad, 0);
    document.getElementById("textbox_calculo").value = (acumulador/arrayPersonas.length).toFixed(2);   
}

//Ordenamiento
function OrdernarColumnas(e)
{
    let criterio = e.currentTarget.innerText;
    criterio=criterio.toLowerCase();
    
    switch (criterio) {
    case "id":
        arrayPersonas = arrayPersonas.sort((a, b) => a.id - b.id);
        break;
    case "nombre":
        arrayPersonas = arrayPersonas.sort((a,b) => (a.nombre> b.nombre) ? 1 : ((b.nombre > a.nombre) ? -1 : 0))
        break;
    case "apellido":
        arrayPersonas = arrayPersonas.sort((a, b) => (a.apellido> b.apellido) ? 1 : ((b.apellido > a.apellido) ? -1 : 0))
        break;
    case "edad":
        arrayPersonas = arrayPersonas.sort((a, b) => a.edad - b.edad);
        break; 
    case "alterego":
        arrayPersonas = arrayPersonas.sort((a, b) => (a.alterego> b.alterego) ? 1 : ((b.alterego > a.alterego) ? -1 : 0))
        break;
    case "ciudad":
        arrayPersonas = arrayPersonas.sort((a, b) => (a.ciudad> b.ciudad) ? 1 : ((b.ciudad > a.ciudad) ? -1 : 0))
        break;
    case "publicado":
        arrayPersonas = arrayPersonas.sort((a,b)=>a.publicado-b.publicado);
        break;
    case "enemigo":
        arrayPersonas = arrayPersonas.sort((a, b) => (a.enemigo> b.enemigo) ? 1 : ((b.enemigo > a.enemigo) ? -1 : 0))
        break;
    case "robos":
        arrayPersonas = arrayPersonas.sort((a,b)=>a.robos-b.robos);
        break;
    case "asesinatos":
        arrayPersonas = arrayPersonas.sort((a,b)=>a.asesinatos-b.asesinatos);
        break;                                 
    }
    CargarTablas();
}


//Filtros
function FiltrarPorComboBox(element){
    switch(comboBox.value){
        case "todos":
            return true;
        case "heroes":
            return(element instanceof(Heroe))
        case "villanos":
            return(element instanceof(Villano))
    }
}

//Mostrar Ocultar

function MostrarOcultarForm()
{
    if(formularioVisible)
    {
        document.querySelector(".container_formulario").style.display="none";
        document.querySelector(".container_tabla").style.display="block";
        botonAgregar.innerText = "Agregar";
        document.getElementById("formularioAlta").reset();
        CargarTablas();
        comboBoxAlta.disabled=false;
        formularioVisible=false;
    }else{
        OcultarCampos()
        document.querySelector(".container_formulario").style.display="block";
        document.querySelector(".container_tabla").style.display="none";
        botonAgregar.innerText = "Ocultar";
        formularioVisible=true;
        botonAlta.style.display="inherit";
        botonCancelar.style.display="none";
        botonEliminar.style.display="none";
        botonModificar.style.display="none";
    }
}

function OcultarCampos()
{
    switch(comboBoxAlta.value){
        case "heroes":
            document.querySelector(".input_alta_heroe").style.visibility = "visible";
            document.querySelector(".input_alta_villano").style.visibility = "hidden";
            break;
        case "villanos":
            document.querySelector(".input_alta_heroe").style.visibility = "hidden";
            document.querySelector(".input_alta_villano").style.visibility = "visible";
            break;
    }
}

//Clases

class Vehiculo{
    id;
    modelo;
    anoFab;
    velMax;
    
    constructor (id,modelo,anoFab,velMax)
    {
        this.id=id;
        this.modelo=modelo;
        this.anoFab=anoFab;
        this.velMax=velMax;
    }

    toString() {
            return `ID: ${this.id} - Modelo: ${this.modelo} - Ano Fabricacion: ${this.anoFab} - Velocidad Maxima ${this.velMax}\n `;
    }
   
}


class Aereo extends Vehiculo{
    
    altMax;
    autonomia;

    constructor(id,modelo,anoFab,velMax,altMax,autonomia)
    {
        super(id,modelo,anoFab,velMax);
        this.altMax=altMax;
        this.autonomia=autonomia;
    }

    toString()
    {
        return `${super.toString()} altura maxima: ${this.altMax} - Autonomia ${this.autonomia}`;
    }

    ActualizarDatos(modelo,anoFab,velMax,altMax,autonomia)
    {
        this.modelo=modelo;
        this.anoFab=anoFab;
        this.velMax=velMax;
        this.altMax=altMax;
        this.autonomia=autonomia;
    }
}

class Terrestre extends Vehiculo {

    cantPue;
    cantRue;

    constructor(id,modelo,anoFab,velMax,cantPue,cantRue)
    {
        super(id,modelo,anoFab,velMax);
        this.cantPue=cantPue;
        this.cantRue=cantRue;
    }

    toString()
    {
        return `${super.toString()} Cantidad puertas: ${this.cantPue} - Cantidad Ruedas ${this.cantRue}`;
    }

    ActualizarDatos(modelo,anoFab,velMax,cantPue,cantRue)
    {
        this.modelo=modelo;
        this.anoFab=anoFab;
        this.velMax=velMax;
        this.cantPue=cantPue;
        this.cantRue=cantRue;
    }
}