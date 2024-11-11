import { $, luyval } from "../library/luyval.js";
import { removeCss } from "../tools/cssRemove.js";
import { title } from "../tools/title.js";
import { gsale } from "./key.js";
import { menu } from "./menu.js";
import { renderSales } from "./sales.js";
export const initSalesDay = () => {
    title("Ventas");
    removeCss("./css/sales.css");
    let sales = $(gsale);
    if (!sales) sales = [];
    sales = sales.filter(_ => _.time.split(' ')[0] === luyval.date().split(" ")[0] && !_.close);
    let html = "";
    if (sales != false) {
        html = renderSales(sales, true);
    }
    luyval.body(/*html*/`
        ${menu()}
        <br />
        ${html}
    `);
}