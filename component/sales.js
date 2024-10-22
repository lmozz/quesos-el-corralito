import { luyval, $ } from "./../library/luyval.js";
import { menu } from "./menu.js";
import { gsale, adminPass } from "./key.js";
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
            <div><strong class="sale" delete>Fecha:</strong> ${sale.time}</div>
            <div><strong>Total:</strong> $${sale.total.toFixed(2)}</div>
            <table>
                <thead>
                    <tr>
                        <th>Producto</th>
                        <th>Cantidad</th>
                        <th>Precio Unitario</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
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
export const initSales = async () => {
    title("Productos");
    removeCss("./css/sales.css");
    luyval.body();
    await luyval.sleep(1);
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
        }
    }
    luyval.body(/*html*/`
        ${menu}
        <br />
        ${html}
    `);
}