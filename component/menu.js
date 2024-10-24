import { luyval, $ } from "./../library/luyval.js";
import { initProduct } from "./product.js";
import { initRs } from "./rs.js";
import { initSales } from "./sales.js";
import { initStock } from "./stock.js";
import { initBackUp } from "./backup.js";
import { adminPass, glogin, slogin, rlogin } from "./key.js";
const allowPass = () => {
    let login = $(glogin);
    if (login !== false) {
        if (login.key === adminPass) {
            return true;
        } else {
            $(rlogin);
            return false;
        }
    }
    let flag = (prompt("Ingrese la contraseña de administrador") || "") === adminPass;
    if (!flag) return false;
    $(slogin, {
        key: adminPass,
    });
    return true;
};
const goToSalePoint = () => initProduct();
const goToRs = () => initRs();
const goToSales = () => allowPass() ? initSales() : false;
const goToStock = () => allowPass() ? initStock() : false;
const goToBackUp = () => allowPass() ? initBackUp() : false;
const closeSession = () => {
    $(rlogin);
    goToSalePoint();
};
luyval.css.add("./css/menu.css");
luyval.event.click({
    sale_point: goToSalePoint,
    rs: goToRs,
    stock: goToStock,
    sales: goToSales,
    backup: goToBackUp,
    close_session: closeSession,
});
export const menu = () => {
    let login = $(glogin);
    let flag = false;
    if (login !== false) flag = login.key === adminPass;
    return /*html*/ `
        <nav class="menu-container${!flag ? "" : " root"}">
            <a sale-point class="menu-item">Punto de Venta</a>
            <a rs class="menu-item">Redes Sociales</a>
            <a stock class="menu-item ${!flag ? "red" : ""}">Inventario</a>
            <a sales class="menu-item ${!flag ? "red" : ""}">Ventas</a>
            <a backup class="menu-item ${!flag ? "red" : ""}">Backup</a>
            ${!flag ? "" : /*html*/`<a close-session class="menu-item">Cerrar Sesion</a>`}
        </nav>
    `
};