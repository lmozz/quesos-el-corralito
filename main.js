import { luyval, $ } from "./library/luyval.js"
import { initProduct } from "./component/product.js";
luyval.init(() => {
    luyval.error("Lilian de Ramirez");
    luyval.log("Venta de Quesos El Corralito");
    luyval.warning("© 2024");
    luyval.title("Producto - Quesos el Corralito");
    luyval.denyConsole();
    luyval.denyDrag();
    luyval.denyRightClick();
    initProduct();
});