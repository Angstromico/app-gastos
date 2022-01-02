const form = document.getElementById('agregar-gasto');
const listaGastos = document.querySelector('#gastos ul');

//Events
listeners();
function listeners() {
  document.addEventListener('DOMContentLoaded', obtenerPresupuesto);
  form.addEventListener('submit', agregarGastos);
}
//Classes
class Presupuesto {
  constructor(presupuesto) {
    this.presupuesto = Number(presupuesto);
    this.restante = Number(presupuesto);
    this.gastos = [];
  }
  nuevoGasto(gasto) {
    this.gastos = [...this.gastos, gasto];
    this.restarRestante();
    ui.gastosLista(this.gastos);
  }
  restarRestante() {
    let acumulado = 0;
    let restante = Number(document.getElementById('restante').textContent);
    const gastados = this.gastos.forEach((gasto) => {
      acumulado += gasto.cantidad;
    });

    restante -= acumulado;
    ui.ingresarRestante(restante);
    this.alertaPresupuesto();
  }
  alertaPresupuesto() {
    const presupuesto = document.getElementById('total').textContent,
      restante = document.getElementById('restante').textContent,
      presupuestoOBJ = { presupuesto, restante };
    ui.revisarPresupuesto(presupuestoOBJ);
  }
}
class UI {
  ingresarPresupuesto(cantidad) {
    const { presupuesto, restante } = cantidad;
    document.getElementById('total').textContent = presupuesto;
    document.getElementById('restante').textContent = restante;
  }
  ingresarRestante(cantidad) {
    document.getElementById('restante').textContent = cantidad;
  }
  alerta(mensaje, tipo = 'correcto') {
    const div = document.createElement('DIV');
    div.classList.add('alert', 'text-center', 'desvanecedor');
    if (tipo === 'error') {
      div.classList.add('alert-danger');
    } else {
      div.classList.add('alert-success');
    }
    div.textContent = mensaje;
    document.querySelector('.primario').insertBefore(div, form);
    setTimeout(() => {
      div.remove();
    }, 5000);
  }
  gastosLista(gastos) {
    gastos.forEach((realizado) => {
      const { gasto, cantidad, id } = realizado;
      const li = document.createElement('LI');
      li.className =
        'list-group-item d-flex justify-content-between align-items-center';
      li.id = id;
      li.innerHTML = `
      ${gasto} <span class="badge badge-primary badge-pill"> $${cantidad}</span>
      `;
      const btn = document.createElement('BUTTON');
      btn.className = 'btn btn-danger borrar-gasto';
      btn.innerHTML = `Eliminar &times`;
      btn.onclick = () => eliminarGasto(id, cantidad);
      li.append(btn);
      listaGastos.append(li);
    });
  }
  revisarPresupuesto(presupuestoHTML) {
    const { presupuesto, restante } = presupuestoHTML;
    const divRestante = document.querySelector('.restante');

    //Revisar que porcentaje del presupuesto se ha gastado
    if (presupuesto / 4 > restante) {
      divRestante.classList.remove('alert-success', 'alert-warning');
      divRestante.classList.add('alert-danger');
    } else if (presupuesto / 2 > restante) {
      divRestante.classList.replace('alert-success', 'alert-warning');
    } else {
      divRestante.classList.remove('alert-warning', 'alert-danger');
      divRestante.classList.add('alert-success');
    }
  }
}
let classPresupuesto; //Se crea para despues asignarle la clase presupuesto
const ui = new UI();
//Funciones
function obtenerPresupuesto() {
  const presupuesto = prompt('Dinos tu Presupuesto');
  if (
    presupuesto === '' ||
    presupuesto === null ||
    !presupuesto ||
    isNaN(presupuesto) ||
    presupuesto <= 0
  ) {
    alert(
      'Debes poner un número superior a 0 cuando se te pida el presupuesto'
    );
    window.location.reload();
  }
  classPresupuesto = new Presupuesto(presupuesto);
  ui.ingresarPresupuesto(classPresupuesto);
}
function agregarGastos(e) {
  e.preventDefault();
  const gasto = document.getElementById('gasto').value;
  const cantidad = Number(document.getElementById('cantidad').value);
  if (!gasto || !cantidad) {
    ui.alerta('Debe ingresar ambos campos', 'error');
    return;
  } else if (
    cantidad > Number(document.getElementById('restante').textContent)
  ) {
    ui.alerta('No tienes presupuesto para realizar ese gasto', 'error');
    return;
  }
  ui.alerta('Su información se agrego correctamente');
  //Generar objeto con gastos
  const gastosInfo = { gasto, cantidad, id: Date.now() };
  classPresupuesto = new Presupuesto().nuevoGasto(gastosInfo);

  form.reset();
}
function eliminarGasto(id, cantidad) {
  const eliminado = document.getElementById(`${id}`),
    restante = document.getElementById('restante'),
    presupuesto = document.getElementById('total').textContent;

  restante.innerHTML = `${cantidad + Number(restante.textContent)} `;
  presupuestoObj = {
    presupuesto: Number(presupuesto),
    restante: Number(restante.textContent),
  };

  ui.revisarPresupuesto(presupuestoObj);
  eliminado.remove();
}
