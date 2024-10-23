import { luyval, $ } from "./../library/luyval.js";
import { initProduct } from "./product.js";
import { initRs } from "./rs.js";
import { initSales } from "./sales.js";
import { initStock } from "./stock.js";
import { adminPass, gsale, gproduct, glist, gclose, gstock } from "./key.js";
const goToSalePoint = () => initProduct();
const goToRs = () => initRs();
const goToSales = () => initSales();
const goToStock = () => initStock();
const makeBackUp = () => {
    let password = prompt("Ingrese la constraseña de administrador");
    if (password !== adminPass) {
        alert("Contraseña incorrecta");
        return;
    }
    let sales = $(gsale);
    let products = $(gproduct);
    let list = $(glist);
    let close = $(gclose);
    let stock = $(gstock);
    if (sales != false) {
        luyval.json.download(sales, `BACKUP-${luyval.date(true)}-SALE`);
    }
    if (products != false) {
        luyval.json.download(products, `BACKUP-${luyval.date(true)}-PRODUCT`);
    }
    if (list != false) {
        luyval.json.download(list, `BACKUP-${luyval.date(true)}-LIST`);
    }
    if (close != false) {
        luyval.json.download(close, `BACKUP-${luyval.date(true)}-CLOSE`);
    }
    if (stock != false) {
        luyval.json.download(stock, `BACKUP-${luyval.date(true)}-STOCK`);
    }
};
luyval.css.add("./css/menu.css");
luyval.event.click({
    sale_point: goToSalePoint,
    rs: goToRs,
    stock: goToStock,
    sales: goToSales,
    backup: makeBackUp,
});
export const menu = /*html*/ `
    <nav class="menu-container">
        <a sale-point class="menu-item">Punto de Venta</a>
        <a rs class="menu-item">Redes Sociales</a>
        <a stock class="menu-item red">Inventario</a>
        <a sales class="menu-item red">Ventas</a>
        <a backup class="menu-item red">Backup</a>
    </nav>
`;