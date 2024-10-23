import { luyval, $ } from "../library/luyval.js";
import { removeCss } from "../tools/cssRemove.js";
import { title } from "../tools/title.js";
import { gsale, gproduct, glist, gclose, gstock, ssale, sproduct, slist, sclose, sstock } from "./key.js";
import { menu } from "./menu.js";
const makeBackUp = () => {
    if (!confirm("Seguro que quieres descargar las bases de esta version ?")) return;
    let name = "";
    let nameFiles = prompt("Ingresa un nombre para tus datos (opcional)");
    if ((nameFiles || "") !== "") name = `${nameFiles}-`;
    let sales = $(gsale);
    let products = $(gproduct);
    let list = $(glist);
    let close = $(gclose);
    let stock = $(gstock);
    luyval.json.download({
        sale: sales ? sales : [],
        product: products ? products : [],
        list: list ? list : [],
        close: close ? close : [],
        stock: stock ? stock : [],
    }, `${name}BACKUP-${luyval.date(true)}`);
};
const loadData = e => e.nextElementSibling.click();
const saveData = e => {
    let file = e.files[0];
    const fileExtension = file.name.split('.').pop().toLowerCase();
    if (fileExtension !== 'json') return alert("El archivo seleccionado no es un JSON");
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            let json = JSON.parse(e.target.result);
            if (!confirm("Seguro que quiere cargar y reemplazar los datos existentes por los nuevos ?")) return;
            $(ssale, json.sale);
            $(sproduct, json.product);
            $(slist, json.list);
            $(sclose, json.close);
            $(sstock, json.stock);
            alert("El navegador se reiniciara para cargar los datos");
            window.location.reload();
        } catch (error) {
            alert("Hubo un error tratando de leer la informacion del JSON");
        }
    };
    reader.readAsText(file);
};
export const initBackUp = () => {
    title("Gestion de Datos");
    removeCss();
    luyval.body(/*html*/`
        ${menu()}
        <br /><br />
        <div class="center">
            <button class="pretty" download>Descargar</button>
            <br /><br />
            <button class="pretty warn" load>Carga de Datos</button>
            <input type="file" accept=".json" class="none" save />
            <br /><br />
        </div>
    `);
    luyval.event.click2({
        download: makeBackUp,
        load: loadData,
    });
    luyval.event.change({
        save: saveData,
    })
};