import { removeCss } from "../tools/cssRemove.js";
import { title } from "../tools/title.js";
import { luyval, $ } from "../library/luyval.js";
import { menu } from "./menu.js";
import { initStock } from "./stock.js";
import { gclose } from "./key.js";
const backToProduct = () => initStock(false);
luyval.event.click({
    back: backToProduct,
});
export const initClose = () => {
    title("Dias Cerrados");
    removeCss("./css/item.css");
    let list = $(gclose);
    if (!list) list = [];
    let listHtml = "";
    list.forEach(_ => {
        listHtml += /*html*/`
            <h4>${_.date}</h4>
            <table>
                <thead>
                    <tr>
                        <th>Categoria</th>
                        <th>Habilitado</th>
                        <th>Nombre</th>
                        <th>Precio</th>
                        <th>Cantidad</th>
                    </tr>
                </thead>
                <tbody>
        `;
        _.products.forEach(__ => {
            listHtml += /*html*/`
                <tr>
                    <td>${__.category}</td>
                    <td>${__.enable ? "Si" : "No"}</td>
                    <td>${__.name}</td>
                    <td>$${__.price}</td>
                    <td>${__.quantity}</td>
                </tr>
            `;
        });
        listHtml += /*html*/`
                </tbody>
            </table>
        `;
    });
    luyval.body(/*html*/`
        ${menu}
        <br />
        <button class="pretty" back>Regresar</button>
        ${listHtml}
    `);
};