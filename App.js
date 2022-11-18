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


function cargarVehiculo(vehiculo){
    MostrarSpinner(true);
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function(){
        if(xhttp.readyState ==4) //Se espera a llegar al estado 4 y despues se valida el estado 200
        {
            if(xhttp.status == 200 )
            {
                console.log(xhttp.response);
                MostrarSpinner(false);
                vehiculo.id = JSON.parse(xhttp.response)["id"];
                arrayVehiculos.push(vehiculo); 
                MostrarOcultarForm();
            }else{
                MostrarSpinner(false);
                formularioVisible=true;
                MostrarOcultarForm();
                mensajeErrorForm.innerText="Error, no se pudo realizar el alta";
                    mensajeErrorForm.style.display= "flex";   
            }
        }     
    };
xhttp.open("PUT","http://localhost/vehiculoAereoTerrestre.php",true);
xhttp.setRequestHeader('Content-Type' , 'application/json');
xhttp.send(JSON.stringify(vehiculo));
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
        arrayVehiculos.splice(indice,1);
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
window.addEventListener("load",traerVehiculos);
window.addEventListener("load",CargarTablas);
comboBox.addEventListener("change",CargarTablas)
comboBoxAlta.addEventListener("change",OcultarCampos)
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

function ValidarCampos(id,modelo,anoFab,velMax,altaMax,autonomia,cantPue,cantRue)
{
    if(id==""||isNaN(id)||id<1){
        etiquetaError.style.display="flex";
        etiquetaError.innerText="Revisar el ID";
        return false;
    }
    if(modelo==""||!isNaN(modelo)){
        etiquetaError.style.display="flex";
        etiquetaError.innerText="Revisar el Modelo";
        return false;
    }
    if(anoFab<1940||isNaN(anoFab)){
        etiquetaError.style.display="flex";
        etiquetaError.innerText="Revisar el Ano de fabricacion";
        return false;
    }
    if(isNaN(velMax)||velMax<1){
        etiquetaError.style.display="flex";
        etiquetaError.innerText="Revisar la velocidad maxima";
        return false;
    }
    if(comboBoxAlta.value == "aereos")
    {
        if(isNaN(altaMax)||altaMax<1){
            etiquetaError.style.display="flex";
            etiquetaError.innerText="Revisar la altura maxima";
            return false;
        }
        if(isNaN(autonomia)||autonomia<1){
            etiquetaError.style.display="flex";
            etiquetaError.innerText="Revisar la autonomia";
            return false;
        }  
    }else
    {
        if(isNaN(cantPue)||cantPue<1){
            etiquetaError.style.display="flex";
            etiquetaError.innerText="Revisar la cantidad de puertas";
            return false;
        }  
        if(isNaN(cantRue)||cantRue<1){
            etiquetaError.style.display="flex";
            etiquetaError.innerText="Revisar la cantidad de ruedas";
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
    arrayVehiculos.forEach(element => {
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
    for (let index = 0; index < arrayVehiculos.length; index++) {
        if(arrayVehiculos[index].id == id)
        {
            eliminarPersonaje(arrayVehiculos[index],index);
            break;
        }  
    }
}

function AltaModificacion()
{
    comboBoxAlta.disabled = false;
    let id = document.getElementById("input_id").value;
    let modelo = document.getElementById("input_modelo").value;
    let anoFab = parseInt(document.getElementById("input_anoFab").value);
    let velMax = document.getElementById("input_velocidadMax").value;
    let altMax = document.getElementById("input_altMax").value;
    let autonomia = document.getElementById("input_autonomia").value;
    let cantPue = document.getElementById("input_cantPue").value;
    let cantRue = document.getElementById("input_cantRue").value;
    if(ValidarCampos(EncontrarUltimoId()+1,modelo,anoFab,velMax,altMax,autonomia,cantPue,cantRue))
    {
        if(comboBoxAlta.value == "aereos")
        {
            if(id=="")
            {
                let AereoAux = new Aereo(EncontrarUltimoId() + 1, modelo,anoFab,velMax,altMax,autonomia);
                cargarVehiculo(AereoAux);
            }else{
                let AeroModificar = arrayVehiculos.filter(element=>element.id==id);
                modificarVehiculo(heroeModificar[0],[nombre,apellido,edad,alterego,ciudad,publicado]);
            }
        }else
        {
            if(id=="")
            {            
                let TerrestreAux = new Terrestre(EncontrarUltimoId() + 1,modelo,anoFab,velMax,cantPue,cantRue);
                cargarVehiculo(TerrestreAux);
            }else{
                let VillanoModificar = arrayVehiculos.filter(element=>{ if(element.id==id) return element});
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
    arrayFiltrado = arrayVehiculos.filter(element => FiltrarPorComboBox(element));
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
    let celdaModelo= document.createElement("th");
    let celdaAnoFab = document.createElement("th");
    let celdaVelMax = document.createElement("th");
    let celdaAltaMax = document.createElement("th");
    let celtaAutonomia =document.createElement("th");
    let celdaCantPue = document.createElement("th");
    let celdaCantRue = document.createElement("th");
    let celdaModificar = document.createElement("th");
    let celdaEliminar = document.createElement("th");

    filaTitulos.appendChild(celdaId);
    filaTitulos.appendChild(celdaModelo);
    filaTitulos.appendChild(celdaAnoFab);
    filaTitulos.appendChild(celdaVelMax);
    filaTitulos.appendChild(celdaAltaMax);
    filaTitulos.appendChild(celtaAutonomia);
    filaTitulos.appendChild(celdaCantPue);
    filaTitulos.appendChild(celdaCantRue);
    filaTitulos.appendChild(celdaModificar);
    filaTitulos.appendChild(celdaEliminar);

    celdaId.innerText="ID";
    celdaModelo.innerText="Modelo";
    celdaAnoFab.innerText="Ano Fabricacion";
    celdaVelMax.innerText="Velocidad Maxima";
    celdaAltaMax.innerText="Altura Maxima";
    celtaAutonomia.innerText="Autonomia";
    celdaCantPue.innerText="Cantidad Puertas";
    celdaCantRue.innerText="Cantidad Ruedas";
    celdaModificar.innerText="Modificar";
    celdaEliminar.innerText="Eliminar";

    tablaInformacion.appendChild(filaTitulos);
}

//Filtros
function FiltrarPorComboBox(element){
    switch(comboBox.value){
        case "todos":
            return true;
        case "aereos":
            return(element instanceof(Aereo))
        case "terrestres":
            return(element instanceof(Terrestre))
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
        case "aereos":
            document.querySelector(".input_alta_aereo").style.visibility = "visible";
            document.querySelector(".input_alta_terrestre").style.visibility = "hidden";
            break;
        case "terrestres":
            document.querySelector(".input_alta_aereo").style.visibility = "hidden";
            document.querySelector(".input_alta_terrestre").style.visibility = "visible";
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