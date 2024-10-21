import { luyval, $ } from "/quesos-el-corralito/library/luyval.js";
import { initProduct } from "/quesos-el-corralito/component/product.js";
import { initRs } from "/quesos-el-corralito/component/rs.js";
import { initSales } from "/quesos-el-corralito/component/sales.js";
import { initStock } from "/quesos-el-corralito/component/stock.js";
import { gsale, gproduct, adminPass } from "/quesos-el-corralito/component/key.js";
luyval.css.add("/quesos-el-corralito/css/menu.css");
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
    if (sales != false) {
        luyval.json.download(sales, `BACKUP-${luyval.date(true)}-SALE`);
    }
    if (products != false) {
        luyval.json.download(products, `BACKUP-${luyval.date(true)}-PRODUCT`);
    }
}
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