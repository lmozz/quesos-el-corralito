
import { luyval, $ } from "./../library/luyval.js";
import { menu } from "./menu.js";
import { gproduct, gsale, ssale } from "./key.js";
let order = [];
export const initProduct = () => {
    luyval.title("Producto - Quesos el Corralito");
    luyval.css.add("./css/product.css");
    luyval.css.remove("./css/rs.css");
    luyval.css.remove("./css/sales.css");
    luyval.css.remove("./css/stock.css");
    let products = $(gproduct);
    products = products.filter(_ => _.quantity > 0 && _.enable);
    if (!products) {
        alert("No hay ningun producto para vender");
    }
    if (products != false) {
        luyval.event.click({
            more: upload,
            minus: download,
            goto_print: print,
        });
        luyval.event.click2({
            save: saveDoc,
            erase: eraseDoc,
        });
    }
    luyval.body(/*html*/`
        ${menu}
        <br />
        ${generateHTML(products)}
    `);
}
export const generateHTML = products => {
    if (!products) return "";
    const categories = products.reduce((acc, product) => {
        const { category, name, uuid, price } = product;
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push({ name, uuid, price });
        return acc;
    }, {});
    let html = /*html*/`
        <div id="sale-point">
        <button save class="pretty">Guardar</button>
        <button goto-print class="pretty warn">Imprimir</button>
        <button erase class="pretty err">Borrar</button>
    `;
    for (const [category, products] of Object.entries(categories)) {
        html += /*html*/`
            <div class="category">
                <h3>${category}</h3>
                ${products.map(_ => /*html*/`
                    <div class="product" uuid="${_.uuid}" counter="0">
                        <strong>(0) </strong>
                        <strong>${_.name} $${_.price}</strong>
                        <button more>+</button>
                        <button minus>-</button>
                    </div>
                `).join('')}
            </div>
        `;
    }
    return /*html*/`
            ${html}
        </div>
        <div id="invoice">
            <h1>Orden</h1>
            <table>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Prod</th>
                        <th>Prec</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody id="order"></tbody>
                <tfoot>
                    <tr>
                        <td colspan="3">Total</td>
                        <td>$<strong id="total"></strong></td>
                    </tr>
                </tfoot>
            </table>
        </div>
    `;
};
export const eraseDoc = (_, pass = false) => {
    if (!pass){
        if (order.length == 0) return;
        let ask = confirm("Esta seguro que desea borrar la operacion actual");
        if (ask) {
            order = [];
            let products = $(gproduct);
            luyval.body(/*html*/`
                ${menu}
                <br />
                ${generateHTML(products)}
            `);
        }
    } else {
        order = [];
        let products = $(gproduct);
        luyval.body(/*html*/`
            ${menu}
            <br />
            ${generateHTML(products)}
        `);
    }
}
export const print = () => {
    if (order.length < 1) return;
    const divToPrint = document.getElementById('invoice');
    const newWindow = window.open('', '', 'height=400,width=600');
    newWindow.document.write('<html><head><title>Imprimir</title>');
    newWindow.document.write('<style>body { font-family: Arial, sans-serif; }</style>'); 
    newWindow.document.write('</head><body>');
    newWindow.document.write(divToPrint.outerHTML);
    newWindow.document.write('</body></html>');
    newWindow.document.close();
    newWindow.print();
    newWindow.onafterprint = function() {
        newWindow.close();
    };
}
export const invoice = () => {
    let html = "";
    let total = 0;
    order.forEach(_ => {
        html += /*html*/`
            <tr>
                <td>${_.counter}</td>
                <td>${_.name}</td>
                <td>${_.price}</td>
                <td>${(_.counter * _.price).toFixed(2)}</td>
            </tr>
        `;
        total += _.counter * _.price;
    });
    $("#order").innerHTML = html;
    $("#total").innerHTML = total.toFixed(2);
}
export const saveDoc = () => {
    if (order.length == 0) return;
    let newOrders = [];
    order.forEach(_ => {
        newOrders.unshift({
            counter: _.counter,
            name: _.name,
            price: _.price,
            total: parseFloat((_.counter * _.price).toFixed(2)),
        });
    });
    let newOrder = {
        time: luyval.date(),
        total: parseFloat($("#total").innerHTML),
        sale: newOrders,
    };
    let sales = $(gsale);
    if (!sales) {
        sales = [];
    } 
    sales.unshift(newOrder);
    $(ssale, sales);
    eraseDoc(null, true);
    alert(`Venta #${sales.length} guardada correctamente`);
}
export const upload = e => {
    let counter = parseInt(luyval.e.get(e.parentElement, "counter"));
    counter++;
    luyval.e.set(e.parentElement, "counter", counter);
    e.parentElement.firstElementChild.innerHTML = `(${counter})`;
    let uuid = luyval.e.get(e.parentElement, "uuid");
    let product = $(gproduct).find(_ => _.uuid == uuid);
    let existingProduct = order.find(_ => _.uuid === product.uuid);
    if (!existingProduct) {
        order.unshift({
            name: product.name,
            uuid: product.uuid,
            price: product.price,
            counter: 1,
        });
    } else {
        existingProduct.counter = counter;
    }
    invoice();
}
export const download = e => {
    let counter = parseInt(luyval.e.get(e.parentElement, "counter"));
    counter--;
    if (counter < 0) return;
    luyval.e.set(e.parentElement, "counter", counter);
    e.parentElement.firstElementChild.innerHTML = `(${counter})`;
    let uuid = luyval.e.get(e.parentElement, "uuid");
    let product = $(gproduct).find(_ => _.uuid == uuid);
    let existingProduct = order.find(_ => _.uuid === product.uuid);
    if (existingProduct) {
        existingProduct.counter = counter;
    } 
    if (counter == 0) {
        let index = order.findIndex(product => product.uuid === uuid);
        order.splice(index, 1);
    }
    invoice();
}