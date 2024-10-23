import { removeCss } from "../tools/cssRemove.js";
import { title } from "../tools/title.js";
import { luyval, $ } from "../library/luyval.js";
import { menu } from "./menu.js";
import { initStock } from "./stock.js";
import { gclose } from "./key.js";
let html2print = "";
const backToProduct = () => initStock();
const printPdf = () => {
    let closes = $(gclose);
    if (!closes) closes = [];
    const printWindow = window.open('', '', 'width=800,height=600');
    let content = /*html*/`
        <html>
            <head>
                <title>Cierres-${luyval.date(true)}</title>
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
                        font-weight: bold;
                    }
                    .page-break {
                        page-break-after: always;
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
export const initClose = () => {
    title("Dias Cerrados");
    removeCss("./css/item.css");
    let list = $(gclose);
    if (!list) list = [];
    let listHtml = "";
    list.forEach(_ => {
        listHtml += /*html*/`
            <div>
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
        print: printPdf
    });
    html2print = listHtml;
};