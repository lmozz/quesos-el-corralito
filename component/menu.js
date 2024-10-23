import { luyval, $ } from "./../library/luyval.js";
import { initProduct } from "./product.js";
import { initRs } from "./rs.js";
import { initSales } from "./sales.js";
import { initStock } from "./stock.js";
import { adminPass, gsale, gproduct, glist, gclose, gstock, glogin, slogin, rlogin } from "./key.js";
const goToSalePoint = () => initProduct();
const goToRs = () => initRs();
const goToSales = () => allowPass() ? initSales() : false;
const goToStock = () => allowPass() ? initStock() : false;
const allowPass = () => {
    let login = $(glogin);
    if (login !== false) {
        if (login.key === adminPass) {
            return true;
        } else {
            return false;
        }
    }
    let flag = (prompt("Ingrese la contraseña de administrador") || "") === adminPass;
    console.log(flag);
    if (!flag) return false;
    $(slogin, {
        key: adminPass,
    });
    return true;
};
const makeBackUp = () => {
    if (!allowPass()) return alert("No se pudo iniciar sesion");
    let sales = $(gsale);
    let products = $(gproduct);
    let list = $(glist);
    let close = $(gclose);
    let stock = $(gstock);
    if (sales != false) {
        luyval.json.download(sales, `BACKUP-${luyval.date(true)}---SALE---`);
    }
    if (products != false) {
        luyval.json.download(products, `BACKUP-${luyval.date(true)}---PRODUCT---`);
    }
    if (list != false) {
        luyval.json.download(list, `BACKUP-${luyval.date(true)}---LIST---`);
    }
    if (close != false) {
        luyval.json.download(close, `BACKUP-${luyval.date(true)}---CLOSE---`);
    }
    if (stock != false) {
        luyval.json.download(stock, `BACKUP-${luyval.date(true)}---STOCK---`);
    }
};
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
    backup: makeBackUp,
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