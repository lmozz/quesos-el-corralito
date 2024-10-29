import { removeCss } from "../tools/cssRemove.js";
import { title } from "../tools/title.js";
import { luyval, $ } from "../library/luyval.js";
import { menu } from "./menu.js";
import { initStock } from "./stock.js";
import { gproduct, gstock, sproduct, sstock } from "./key.js";
import { getRevenue } from "../tools/revenue.js";
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
const deleteInvoice = e => {
    if (!confirm("Esta seguro que desea eliminar esta factura ?")) return;
    let invoice = luyval.e.get(e, "invoice");
    let stocks = $(gstock);
    let stock = stocks.find(_ => _.invoice == invoice);
    if (stock.line.length > 0) return alert("Elimine los productos para eliminar la factura");
    let index = stocks.findIndex(_ => _.invoice == invoice);
    stocks.splice(index, 1);
    $(sstock, stocks);
    luyval.body(/*html*/`
        ${menu()}
        <br />
        <button class="pretty" back>Regresar</button>
        <button class="pretty" print>Imprimir</button>
        ${renderHtml()}
    `);
};
const deleteItem = e => {
    let productUuid = luyval.e.get(e, "uuid");
    if (!confirm("Esta seguro que desea eliminar este producto de la factura ?")) return;
    let invoice = luyval.e.get(e, "invoice");
    let stocks = $(gstock);
    let stock = stocks.find(_ => _.invoice == invoice);
    let index = stock.line.findIndex(_ => _.product.uuid == productUuid);
    let productLine = stock.line.find(_ => _.product.uuid == productUuid);
    stock.line.splice(index, 1);
    let total = 0.0;
    let totalPrice = 0.0;
    stock.line.forEach(_ => {
        total += parseFloat((_.quantity * _.cost).toFixed(2));
        totalPrice += parseFloat((_.quantity * _.product.price).toFixed(2));
    });
    stock.total = total;
    stock.totalPrice = totalPrice;
    stock.revenue = getRevenue(totalPrice, total);
    stock.profit = parseFloat(stock.totalPrice - stock.total).toFixed(2);
    $(sstock, stocks);
    let product = $(gproduct);
    let prod = product.find(_ => _.uuid == productUuid);
    prod.quantity -= productLine.quantity;
    $(sproduct, product);
    luyval.body(/*html*/`
        ${menu()}
        <br />
        <button class="pretty" back>Regresar</button>
        <button class="pretty" print>Imprimir</button>
        ${renderHtml()}
    `);
};
const editCost = e => {
    let productUuid = luyval.e.get(e, "uuid");
    let value = prompt("Digite el nuevo costo del producto");
    if ((value || "") == "") return alert("No se ingreso ningun nuevo costo");
    if (isNaN(value)) return alert("No se ingreso ninguna cantidad monetaria");
    let invoice = luyval.e.get(e, "invoice");
    let stocks = $(gstock);
    let stock = stocks.find(_ => _.invoice == invoice);
    let line = stock.line.find(_ => _.product.uuid == productUuid);
    line.cost = parseFloat(parseFloat(value).toFixed(2));
    line.total = parseFloat(value * line.quantity).toFixed(2);
    line.product.total = parseFloat(line.product.price * line.quantity).toFixed(2);
    line.profit = parseFloat(line.product.total - line.total).toFixed(2);
    let total = 0.0;
    stock.line.forEach(_ => {
        total += parseFloat((_.quantity * _.cost).toFixed(2));
    });
    line.revenue = getRevenue(line.product.price, line.cost);
    stock.total = total;
    stock.revenue = getRevenue(stock.totalPrice, stock.total);
    stock.profit = parseFloat(stock.totalPrice - stock.total).toFixed(2);
    $(sstock, stocks);
    luyval.body(/*html*/`
        ${menu()}
        <br />
        <button class="pretty" back>Regresar</button>
        <button class="pretty" print>Imprimir</button>
        ${renderHtml()}
    `);
};
const editQuantity = e => {
    let productUuid = luyval.e.get(e, "uuid");
    let value = prompt("Digite las entradas correctas del producto");
    if ((value || "") == "") return alert("No se ingreso ninguna nueva entrada");
    if (isNaN(value)) return alert("No se ingreso ninguna cantidad unitaria");
    let invoice = luyval.e.get(e, "invoice");
    let stocks = $(gstock);
    let stock = stocks.find(_ => _.invoice == invoice);
    let line = stock.line.find(_ => _.product.uuid == productUuid);
    let product = $(gproduct);
    let prod = product.find(_ => _.uuid == productUuid);
    prod.quantity -= line.quantity;
    prod.quantity += parseInt(value);
    line.quantity = parseInt(value);
    let total = 0.0;
    let totalPrice = 0.0;
    stock.line.forEach(_ => {
        _.total = parseFloat((_.quantity * _.cost).toFixed(2));
        _.product.total = parseFloat((_.quantity * _.product.price).toFixed(2));
        _.revenue = getRevenue(_.quantity * _.product.price,  _.quantity * _.cost);
        _.profit = parseFloat((_.quantity * _.product.price) - (_.quantity * _.cost)).toFixed(2);
        total += parseFloat((_.quantity * _.cost).toFixed(2));
        totalPrice += parseFloat((_.quantity * _.product.price).toFixed(2));
    });
    stock.total = total;
    stock.totalPrice = totalPrice;
    stock.revenue = getRevenue(totalPrice, total);
    stock.profit = parseFloat(stock.totalPrice - stock.total).toFixed(2);
    $(sproduct, product);
    $(sstock, stocks);
    luyval.body(/*html*/`
        ${menu()}
        <br />
        <button class="pretty" back>Regresar</button>
        <button class="pretty" print>Imprimir</button>
        ${renderHtml()}
    `);
};
const renderHtml = () => {
    let stock = $(gstock);
    if (!stock) stock = [];
    let listHtml = "";
    stock.forEach(_ => {
        listHtml += /*html*/`
            <div>
                <table>
                    <thead>
                        <tr>
                            <th></th>
                            <th>Categoria</th>
                            <th>Producto</th>
                            <th>Medida</th>
                            <th>Costo</th>
                            <th>Precio</th>
                            <th>Cantidad</th>
                            <th>Total C.</th>
                            <th>Total P.</th>
                            <th>Ganancia</th>
                            <th>Rentabilidad</th>
                        </tr>
                    </thead>
                    <tbody>
        `;
        _.line.forEach(__ => {
            listHtml += /*html*/`
                <tr>
                    <td><button class="pretty-2 err" del invoice="${_.invoice}" uuid="${__.product.uuid}">Eliminar</button></td>
                    <td>${__.product.category}</td>
                    <td>${__.product.name}</td>
                    <td>${__.product.measure}</td>
                    <td edit-cost class="td-selected" invoice="${_.invoice}" uuid="${__.product.uuid}">$${__.cost}</td>
                    <td>$${__.product.price}</td>
                    <td edit-quantity class="td-selected" invoice="${_.invoice}" uuid="${__.product.uuid}">${__.quantity}</td>
                    <td>$${__.total}</td>
                    <td>$${__.product.total}</td>
                    <td>$${__.profit}</td>
                    <td>${parseFloat(((__.product.total - __.total) / __.total)*100).toFixed(2)}%</td>
                </tr>
            `;
        });
        listHtml += /*html*/`
                    </tbody>
                    <tfoot>
                        <tr class="center">
                            <td colspan="11">
                                ${_.description} <a href="${_.linkMh == "" ? "#" : _.linkMh}">Ir MH</a> (${_.mark})
                            </td>
                        </tr>
                        <tr class="center">
                            <td colspan="2" del-invoice class="td-selected" invoice="${_.invoice}">
                                Factura ${_.invoice}
                            </td>
                            <td colspan="3">Fecha y Hora ${_.date}</td>
                            <td colspan="2">Costo Total $${_.total}</td>
                            <td colspan="2">Precio Total $${_.totalPrice}</td>
                            <td>Ganancia $${_.profit}</td>
                            <td>Rentabilidad ${_.revenue}%</td>
                        </tr>
                    </tfoot>
                </table>
            </div>
            <div class="page-break"></div>
        `;
    });
    html2print = listHtml;
    return listHtml;
}
export const initEntry = () => {
    title("Entradas de Inventario");
    removeCss("./css/item.css");
    luyval.body(/*html*/`
        ${menu()}
        <br />
        <button class="pretty" back>Regresar</button>
        <button class="pretty" print>Imprimir</button>
        ${renderHtml()}
    `);
    luyval.event.click({
        back: backToProduct,
        print: printPdf,
    });
    luyval.event.click2({
        del: deleteItem,
        edit_cost: editCost,
        del_invoice: deleteInvoice,
        edit_quantity: editQuantity,
    })
};