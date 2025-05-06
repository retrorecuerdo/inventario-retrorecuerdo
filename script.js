// Conexión con tu backend de Apps Script
const API_URL = 'https://script.google.com/macros/s/AKfycbzI0IoSpo5q2oAPZQZMs64ZTNyeRG_8am08t-bs-524cahXZMNGeZUTedH5tRualTXBBQ/exec';

// Función para guardar producto
async function guardarProducto() {
  const datos = obtenerDatosFormulario();
  datos.accion = 'guardar';
  await enviarDatos(datos);
}

// Función para modificar producto
async function modificarProducto() {
  const datos = obtenerDatosFormulario();
  datos.accion = 'modificar';
  await enviarDatos(datos);
}

// Función para consultar por código
async function consultarPorCodigo() {
  const codigo = document.getElementById('codigo').value;
  if (!codigo) return alert('Ingresa un código');

  const respuesta = await fetch(API_URL + '?accion=consultar&codigo=' + encodeURIComponent(codigo));
  const data = await respuesta.json();

  mostrarResultadoConsulta(data);
}

// Recolecta los datos del formulario
function obtenerDatosFormulario() {
  return {
    codigo: document.getElementById('codigo').value,
    producto: document.getElementById('producto').value,
    categoria: document.getElementById('categoria').value,
    cantidad: document.getElementById('cantidad').value,
    ubicacion: document.getElementById('ubicacion').value,
    laminas: document.getElementById('laminas').value,
    particular: document.getElementById('particular').value,
    "precio base": document.getElementById('precio base').value,
    "%ignacio": document.getElementById('%ignacio').value,
    "%emanuel": document.getElementById('%emanuel').value,
    "%retrorecuredo": document.getElementById('%retrorecuredo').value,
    "precio final": document.getElementById('precio final').value,
    estado: document.getElementById('estado').value,
    publicado: document.getElementById('publicado').value,
    observacion: document.getElementById('observacion').value
  };
}

// Envía los datos al backend
async function enviarDatos(datos) {
  const respuesta = await fetch(API_URL, {
    method: 'POST',
    body: JSON.stringify(datos),
    headers: {
      'Content-Type': 'application/json'
    }
  });

  const resultado = await respuesta.json();
  alert(resultado.mensaje);
  actualizarUltimos();
}

// Muestra el resultado de la consulta por código
function mostrarResultadoConsulta(data) {
  const contenedor = document.getElementById('datosConsulta');
  if (!data || !data.codigo) {
    contenedor.innerHTML = 'Producto no encontrado';
    return;
  }
  contenedor.innerHTML = `
    <strong>Producto:</strong> ${data.producto}<br>
    <strong>Categoría:</strong> ${data.categoria}<br>
    <strong>Precio final:</strong> $${data["precio final"]}<br>
    <strong>Publicado:</strong> ${data.publicado}<br>
    <strong>Estado:</strong> ${data.estado}<br>
  `;
}

// Muestra los últimos 5 productos guardados
async function actualizarUltimos() {
  const res = await fetch(API_URL + '?accion=ultimos');
  const lista = await res.json();
  const ul = document.getElementById('listaUltimos');
  ul.innerHTML = '';
  lista.forEach(item => {
    const li = document.createElement('li');
    li.textContent = `${item.codigo} - ${item.producto}`;
    ul.appendChild(li);
  });
}

// Ejecuta al cargar la página
document.addEventListener('DOMContentLoaded', actualizarUltimos);
