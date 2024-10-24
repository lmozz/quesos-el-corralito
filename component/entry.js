import { removeCss } from "../tools/cssRemove.js";
import { title } from "../tools/title.js";
import { luyval, $ } from "../library/luyval.js";
import { menu } from "./menu.js";
import { initStock } from "./stock.js";
import { gstock } from "./key.js";
let html2print = "";
const backToProduct = () => initStock();
const printPdf = () => {
    let stocks = $(gstock);
    if (!stocks) stocks = [];
    const printWindow = window.open('', '', 'width=800,height=600');
    let content = /*html*/`
        <html>
            <head>
                <title>Facturas-${luyval.date(true)}</title>
                <style>
                    @media print {
                        @page { margin: 20mm; }
                        body { margin: 0; }
                    }
                    table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-bottom: 20px;
                    }
                    th, td {
                        border: 1px solid #000;
                        padding: 8px;
                        text-align: left;
                    }
                    tfoot td {
                        border: 1px solid #000;
                        font-weight: bold;
                    }
                    .page-break {
                        page-break-after: always;
                    }
                    .close-invoice {
                        color: crimson;
                    } 
                    .open-invoice {
                        color: blue;
                    } 
                </style>
            </head>
            <body>
                ${html2print}
            </body>
        </html>
    `;
    printWindow.document.write(content);
    printWindow.document.close();
    printWindow.onload = function () {
        printWindow.focus();
        printWindow.print();
        printWindow.onafterprint = function () {
            printWindow.close();
        };
    };
};
export const initEntry = () => {
    title("Entradas de Inventario");
    removeCss("./css/item.css");
    let stock = $(gstock);
    if (!stock) stock = [];
    let listHtml = "";
    stock.forEach(_ => {
        listHtml += /*html*/`
            <div>
                <table>
                    <thead>
                        <tr>
                            <th>Producto</th>
                            <th>Costo</th>
                            <th>Cantidad</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
        `;
        _.line.forEach(__ => {
            listHtml += /*html*/`
                <tr>
                    <td>${__.product.name}</td>
                    <td>$${__.price}</td>
                    <td>${__.quantity}</td>
                    <td>$${__.total}</td>
                </tr>
            `;
        });
        listHtml += /*html*/`
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colspan="3">Fecha y Hora</td>
                            <td>${_.date}</td>
                        </tr>
                        <tr>
                            <td colspan="3">Factura</td>
                            <td>${_.invoice}</td>
                        </tr>
                        <tr>
                            <td colspan="3">Total</td>
                            <td>$${_.total}</td>
                        </tr>
                        <tr>
                            <td colspan="4">
                                ${_.description} <a href="${_.linkMh == "" ? "#" : _.linkMh}">Ir MH</a> (${_.mark})
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </div>
            <div class="page-break"></div>
        `;
    });
    luyval.body(/*html*/`
        ${menu()}
        <br />
        <button class="pretty" back>Regresar</button>
        <button class="pretty" print>Imprimir</button>
        ${listHtml}
    `);
    luyval.event.click({
        back: backToProduct,
        print: printPdf,
    });
    html2print = listHtml;
};