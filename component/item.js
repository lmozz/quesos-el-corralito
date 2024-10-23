import { removeCss } from "../tools/cssRemove.js";
import { title } from "../tools/title.js";
import { luyval, $ } from "../library/luyval.js";
import { menu } from "./menu.js";
import { initStock } from "./stock.js";
import { glist } from "./key.js";
const backToProduct = () => initStock(false);
luyval.event.click({
    back: backToProduct,
});
export const initItem = uuid => {
    title("Lista de Precios");
    removeCss("./css/item.css");
    let list = $(glist);
    if (!list) list = [];
    list = list.filter(_ => _.product == uuid);
    let listHtml = /*html*/`
        <table>
            <thead>
                <tr>
                    <th>Cambio</th>
                    <th>Fecha</th>
                    <th>Precio</th>
                </tr>
            </thead>
            <tbody>
    `;
    let listCount = list.length;
    list.forEach(_ => {
        listHtml += /*html*/`
            <tr>
                <td>${listCount--}</td>
                <td>${_.date}</td>
                <td>$${_.price}</td>
            </tr>`;
    });
    listHtml += /*html*/`
            </tbody>
        </table>
    `;
    luyval.body(/*html*/`
        ${menu}
        <br />
        <button class="pretty" back>Regresar</button>
        ${listHtml}
    `);
};