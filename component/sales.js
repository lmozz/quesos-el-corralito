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
    let html = /*html*/`
        <br />
        <button class="pretty" print-pdf-close>Pdf Cerradas</button>
        <button class="pretty" print-pdf-open>Pdf Abiertas</button>
        <button class="pretty" print-pdf-global>Pdf</button>
    `;
    Object.keys(groupedSales).forEach(date => {
        html += `<h1 class="title-date">${date}</h1>`;
        groupedSales[date].forEach(sale => {
            html += /*html*/`
            <table>
                <thead class="${sale.close ? "close" : ""}">
                    <tr>
                        <th class="title" rename uuid="${sale.uuid}" colspan="4">Titulo: ${sale.title == null || sale.title == "" ? "" : sale.title}</th>
                    </tr>
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
                <tfoot>
                    <tr>
                        <td colspan="3">Total</td>
                        <td>$${sale.total.toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td colspan="3" delete uuid="${sale.uuid}" class="sale">Fecha</td>
                        <td>${sale.time}</td>
                    </tr>
                </tfoot>
            </table>
            <hr /><br />
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
    let sales = $(gsale);
    let sale2delete = sales.find(_ => _.uuid == luyval.e.get(e, "uuid"));
    if (sale2delete.close) {
        return alert("No puede renombrar una venta cuyo dia este cerrado");
    }
    let title = prompt("Ingrese el nombre de esta venta");
    if (title == "") return alert("No se le asigno ningun nombre");
    let sale = sales.find(_ => _.uuid === luyval.e.get(e, "uuid"));
    sale.title = title;
    $(ssale, sales);
    luyval.body(/*html*/`
        ${menu()}
        <br />
        ${renderSales(sales)}
    `);
};
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
        ${menu()}
        <br />
        ${renderSales(sales)}
    `);
};
const printPdf = (_, kind) => {
    let invoices = $(gsale);
    if (!invoices) invoices = [];
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
    `;
    invoices.forEach((invoice, index) => {
        if (invoice.close === kind || kind == null) {
            content += /*html*/`
                <div>
                <h2 class="${invoice.close ? "close-invoice" : "open-invoice"}">Factura ${index + 1}</h2>
                <p>Fecha y Hora: ${invoice.time}</p>
                <p>Título: ${invoice.title || 'Sin título'}</p>
                <table>
                    <thead>
                    <tr>
                        <th>Producto</th>
                        <th>Cantidad</th>
                        <th>Precio</th>
                        <th>Total</th>
                    </tr>
                    </thead>
                    <tbody>
            `;
            invoice.sale.forEach(item => {
                content += /*html*/`
                    <tr>
                        <td>${item.name}</td>
                        <td>${item.counter}</td>
                        <td>$${item.price.toFixed(2)}</td>
                        <td>$${item.total.toFixed(2)}</td>
                    </tr>
                `;
            });
            content += /*html*/`
                    </tbody>
                    <tfoot>
                    <tr>
                        <td colspan="3">Total de la Venta</td>
                        <td>$${invoice.total.toFixed(2)}</td>
                    </tr>
                    </tfoot>
                </table>
                </div>
                <div class="page-break"></div>
            `; 
        }
    });
    content += /*html*/`
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
export const initSales = () => {
    title("Ventas");
    removeCss("./css/sales.css");
    let sales = $(gsale);
    let html = "";
    if (!sales) {
        alert("No hay ventas que mostrar");
    } else {
        html = renderSales(sales);
        luyval.event.click({
            delete: deleteSale,
            rename: renameSale,
            print_pdf_open: [ printPdf, false ],
            print_pdf_close: [ printPdf, true ],
            print_pdf_global: [ printPdf, null ],
        });
    }
    luyval.body(/*html*/`
        ${menu()}
        <br />
        ${html}
    `);
};