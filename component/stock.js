import { luyval, $ } from "./../library/luyval.js";
import { menu } from "./menu.js";
import { gproduct, sproduct, adminPass, slist, glist } from "./key.js";
import { removeCss } from "../tools/cssRemove.js";
import { title } from "../tools/title.js";
let product = $(gproduct);
const renderProduct = () => {
    if (!product) return "";
    let html = /*html*/`
        <button class="pretty" new>Nuevo</button>
        <div class="product-container">
    `;
    product.forEach(_ => {
        html += /*html*/`
            <div class="product-item ${_.enable ? "" : "disabled"}" uuid="${_.uuid}">
                <input type="checkbox" onoff-product ${_.enable ? "checked" : ""} />
                <label title="Cambiar Nombre" edit-name>Nombre: </label> 
                <span>${_.name}</span><br />
                <label title="Cambiar Categoria" edit-category>Categoria: </label> 
                <span>${_.category}</span><br />
                <label title="Cambiar Precio" edit-price>Precio: </label> 
                <span>${_.price}</span><br />
                <label>Cantidad: </label><span>${_.quantity}</span>
                <div class="center">
                    <button class="pretty" enter>Entrar</button>
                </div>
            </div>
        `;
    });
    return /*html*/`
            ${html}
        </div>
    `;
};
const editProperty = (e, prop, message, error) => {
    let value = prompt(message, e.nextElementSibling.innerHTML);
    if (value == "" || value == null) return alert(error);
    let item = product.find(_ => _.uuid == luyval.e.get(e.parentElement, "uuid"));
    if (prop == "price") {
        if (isNaN(value)) return alert("Debe ingresar un numero");
        value = parseFloat(value);
    }
    item[prop] = value;
    $(sproduct, product);
    luyval.body(/*html*/`
        ${menu}
        <br />
        ${renderProduct()}
    `);
    if (prop == "price") {
        let price = $(glist);
        if (!price) price = [];
        price.unshift({
            date: luyval.date(),
            product: item.uuid,
            price: value,
        });
        $(slist, price);
    }
};
const enterProduct = e => {
    let uuid = luyval.e.get(e.parentElement.parentElement, "uuid");
    
};
const newProduct = () => {
    let name = prompt("Nombre del nuevo producto");
    if (name == "") return alert("No se ingreso ningun nombre");
    let uuid = luyval.randomCode(40);
    let category = prompt(`Categoria de ${name}`);
    if (category == "") return alert("No se ingreso ninguna categoria");
    if (!product) product = [];
    product.unshift({
        category: category,
        name: name,
        price: 0.0, 
        quantity: 0,
        uuid: uuid
    });
    $(sproduct, product);
    luyval.body(/*html*/`
        ${menu}
        <br />
        ${renderProduct()}
    `);
};
const onOffProduct = e => {
    let ok = confirm("Seguro que quiera habilitar/deshabilitar este producto");
    if (!ok) return;
    let item = product.find(_ => _.uuid == luyval.e.get(e.parentElement, "uuid"));
    item.enable = !item.enable;
    $(sproduct, product);
    luyval.body(/*html*/`
        ${menu}
        <br />
        ${renderProduct()}
    `);
};
export const initStock = async () => {
    title("Inventario");
    removeCss("./css/stock.css");
    luyval.body();
    await luyval.sleep(1);
    let html = "";
    let password = prompt("Ingrese la constraseña de administrador");
    if (password !== adminPass) {
        alert("Contraseña incorrecta");
    } else {
        luyval.event.click({
            edit_name: [ editProperty, "name", "Ingrese el nuevo nombre", "No se edito el nombre" ],
            edit_category: [ editProperty, "category", "Ingrese la nueva categoria", "No se edito la categoria" ],
            edit_price: [ editProperty, "price", "Ingrese el nuevo precio", "No se edito el precio" ] ,
            enter: enterProduct,
            new: newProduct,
            onoff_product: onOffProduct, 
        });
        html = renderProduct();
    }
    luyval.body(/*html*/`
        ${menu}
        <br />
        ${html}
    `);
};