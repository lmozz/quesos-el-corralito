import { luyval, $ } from "./../library/luyval.js";
import { menu } from "./menu.js";
import { gsale, adminPass, ssale } from "./key.js";
import { removeCss } from "../tools/cssRemove.js";
import { title } from "../tools/title.js";
const formatDate = dateStr => dateStr.split(" ")[0];
const groupSalesByDate = data => {
    return data.reduce((acc, sale) => {
        const date = formatDate(sale.time);
        if (!acc[date]) acc[date] = [];
        acc[date].push(sale);
        return acc;
    }, {});
};
const generateHTML = groupedSales => {
    let html = '';
    Object.keys(groupedSales).forEach(date => {
        html += `<h1>${date}</h1>`;
        groupedSales[date].forEach(sale => {
            html += /*html*/`
            <div><strong class="sale" delete uuid="${sale.uuid}">Fecha${sale.close ? " cerrada" : ""}:</strong> ${sale.time}</div>
            <div><strong>Total:</strong> <strong>$${sale.total.toFixed(2)}</strong></div>
            <div><strong class="title" rename uuid="${sale.uuid}">Titulo:</strong> ${sale.title}</div>
            <table>
                <thead class="${sale.close ? "close" : ""}">
                    <tr>
                        <th>Producto</th>
                        <th>Cantidad</th>
                        <th>Precio Unitario</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody class="${sale.close ? "close" : ""}">
                    ${sale.sale.map(item => `
                        <tr>
                            <td>${item.name}</td>
                            <td>${item.counter}</td>
                            <td>$${item.price.toFixed(2)}</td>
                            <td>$${item.total.toFixed(2)}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            `;
        });
    });
    return html;
};
const renderSales = data => {
    if (data != false) {
        const groupedSales = groupSalesByDate(data);
        const html = generateHTML(groupedSales);
        return html;
    } else {
        return "";
    }
};
const renameSale = e => {
    let title = prompt("Ingrese el nombre de esta venta");
    if (title == "") return alert("No se le asigno ningun nombre");
    let sales = $(gsale);
    let sale = sales.find(_ => _.uuid === luyval.e.get(e, "uuid"));
    sale.title = title;
    $(ssale, sales);
    luyval.body(/*html*/`
        ${menu}
        <br />
        ${renderSales(sales)}
    `);
}
const deleteSale = e => {
    let sales = $(gsale);
    let sale2delete = sales.find(_ => _.uuid == luyval.e.get(e, "uuid"));
    if (sale2delete.close) {
        return alert("No puede eliminar una venta cuyo dia este cerrado");
    }
    let ok = confirm("Esta seguro que desea eliminar esta venta ?");
    if (!ok) return;
    let index = sales.findIndex(_ => _.uuid == luyval.e.get(e, "uuid"));
    sales.splice(index, 1);
    $(ssale, sales);
    luyval.body(/*html*/`
        ${menu}
        <br />
        ${renderSales(sales)}
    `);
}
export const initSales = async () => {
    title("Productos");
    removeCss("./css/sales.css");
    luyval.body();
    await luyval.sleep(0.25);
    let sales = $(gsale);
    let html = "";
    if (!sales) {
        alert("No hay ventas que mostrar");
    } else {
        let password = prompt("Ingrese la constraseña de administrador");
        if (password !== adminPass) {
            alert("Contraseña incorrecta");
        } else {
            html = renderSales(sales);
            luyval.event.click({
                delete: deleteSale,
                rename: renameSale,
            });
        }
    }
    luyval.body(/*html*/`
        ${menu}
        <br />
        ${html}
    `);
}