import { luyval, $ } from "./../library/luyval.js";
import { menu } from "./menu.js";
import { gsale, gproduct, sproduct, adminPass } from "./key.js";
let sales = $(gsale);
let product = $(gproduct);
const renderProduct = () => {
    if (!product) return "";
    let html = /*html*/`
        <button class="pretty">Nuevo</button>
        <button class="pretty warn">Contar Productos</button>
        <div class="product-container">
    `;
    product.forEach(_ => {
        html += /*html*/`
            <div class="product-item" uuid="${_.uuid}">
                <label title="Cambiar Nombre" edit-name>Nombre: </label> 
                <span>${_.name}</span><br />
                <label title="Cambiar Categoria" edit-category>Categoria: </label> 
                <span>${_.category}</span><br />
                <label title="Cambiar Precio" edit-price>Precio: </label> 
                <span>${_.price}</span><br />
                <label>Cantidad: </label><span>${_.quantity}</span><br /><br />
                <center><button class="pretty err">Agregar</button></center>
            </div>
        `;
    });
    return /*html*/`
            ${html}
        </div>
    `;
}
export const initStock = async () => {
    luyval.css.add("./css/stock.css");
    luyval.css.remove("./css/product.css");
    luyval.css.remove("./css/rs.css");
    luyval.css.remove("./css/sales.css");
    luyval.body();
    await luyval.sleep(1);
    let html = "";
    if (!product){
        alert("No hay productos que mostrar");
    } else {
        let password = prompt("Ingrese la constraseña de administrador");
        if (password !== adminPass) {
            alert("Contraseña incorrecta");
        } else {
            html = renderProduct();
        }
    }
    luyval.body(/*html*/`
        ${menu}
        <br />
        ${html}
    `);
}