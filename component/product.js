
import { luyval, $ } from "./../library/luyval.js";
import { menu } from "./menu.js";
import { removeCss } from "../tools/cssRemove.js";
import { gproduct, gsale, ssale } from "./key.js";
import { title } from "../tools/title.js";
import { initSalesDay } from "./sales_day.js";
let order = [];
export const initProduct = () => {
    title("Punto de Venta");
    removeCss("./css/product.css");
    let products = $(gproduct);
    if (!products) products = [];
    products = products.filter(_ => _.quantity > 0 && _.enable);
    if (!products) {
        alert("No hay ningun producto para vender");
    }
    if (products != false) {
        luyval.event.click({
            more: upload,
            minus: download,
            goto_print: print,
            view_category: viewCategory,
            sales_day: salesDay,
            client_money: clientMoney,
        });
        luyval.event.click2({
            save: saveDoc,
            erase: eraseDoc,
        });
        luyval.event.keyup({
            client_money: clientMoney,
        });
    }
    luyval.body(/*html*/`
        ${menu()}
        <br />
        ${generateHTML(products)}
    `);
};
const clientMoney = e => {
    let total = $("#total").innerHTML;
    if (total == "" || total == "0.00") {
        e.value = "";
        return;
    }
    if ($("#given-money").value == "") {
        e.value = "";
        $("#turned").innerHTML = "0";
        return;
    }
    verifyReturned();
};
const salesDay = () => {
    initSalesDay();
};
const viewCategory = e => {
    e = e.nextElementSibling;
    let classs = luyval.e.get(e, "class");
    if (!classs.includes("none")) {
        luyval.class.add(e, "none");
        return;
    }
    let categorys = Array.from($(".category-product"));
    categorys.forEach(_ => luyval.class.add(_, "none"));
    luyval.class.del(e, "none");
};
export const generateHTML = products => {
    if (!products) return "";
    const categories = products.reduce((acc, product) => {
        const { category, name, uuid, price, measure } = product;
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push({ name, uuid, price, measure });
        return acc;
    }, {});
    let html = /*html*/`
        <div id="sale-point">
            <button save class="pretty">Guardar</button>
            <button goto-print class="pretty warn">Imprimir</button>
            <button erase class="pretty err">Borrar</button>
            <br />
            <button sales-day class="pretty-2 warn">Ver Ventas del Dia</button>
            <input type="number" placeholder="Dinero Dado" class="floaty" client-money id="given-money" />
            <label><strong>Vuelto: $</strong><label id="turned">0</label></label>
    `;
    for (const [category, products] of Object.entries(categories)) {
        html += /*html*/`
            <div class="category">
                <h3 class="category-one" view-category>${category}</h3>
                <div class="category-product none">
                    ${products.map(_ => /*html*/`
                        <div class="product" uuid="${_.uuid}" counter="0">
                            <strong class="quantity">(0) </strong>
                            <strong>
                                <span class="measure">${_.measure}</span> 
                                ${_.name} 
                                <span class="money">$${_.price}</span></strong>
                            <button more class="control-quantity">+</button>
                            <button minus class="control-quantity">-</button>
                        </div>
                    `).join('')}
                </div>
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
            products = products.filter(_ => _.quantity > 0 && _.enable);
            luyval.body(/*html*/`
                ${menu()}
                <br />
                ${generateHTML(products)}
            `);
        }
    } else {
        order = [];
        let products = $(gproduct);
        products = products.filter(_ => _.quantity > 0 && _.enable);
        luyval.body(/*html*/`
            ${menu()}
            <br />
            ${generateHTML(products)}
        `);
    }
};
export const print = () => {
    if (order.length < 1) return;
    const divToPrint = document.getElementById('invoice');
    const newWindow = window.open('', '', 'height=400,width=600');
    newWindow.document.write(/*html*/`
        <html>
            <head>
                <title>Orden ${luyval.date(true)}</title>
                <style>
                    * {
                        font-family: Arial, sans-serif;
                        font-size: 60px;
                    }
                    table {
                        width: 100%;
                    }
                    img {
                        width: 100%;
                        height: auto;
                    }
                </style>
                <body>
                    ${divToPrint.outerHTML}
                </body>
            </head>
        </html>    
    `);
    newWindow.document.close();
    newWindow.print();
    newWindow.onafterprint = function() {
        newWindow.close();
    };
};
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
    verifyReturned();
};
export const saveDoc = () => {
    if (order.length == 0) return;
    let newOrders = [];
    order.forEach(_ => {
        newOrders.unshift({
            counter: _.counter,
            uuid: _.uuid,
            name: _.name,
            price: _.price,
            total: parseFloat((_.counter * _.price).toFixed(2)),
        });
    });
    let newOrder = {
        close: false,
        title: "",
        uuid: luyval.randomCode(50),
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
};
const verifyReturned = () => {
    let total = $("#total").innerHTML;
    if (total == "" || total == "0.00") {
        $("#given-money").value = "";
        $("#turned").innerHTML = "0";
    }
    let givenMoney = $("#given-money").value;
    if (isNaN(givenMoney) || givenMoney == "") return;
    givenMoney = parseFloat(givenMoney);
    total = parseFloat(total);
    $("#turned").innerHTML = (parseFloat(givenMoney - total).toFixed(2)).toString();
};
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
            name: `${product.measure} ${product.name}`,
            uuid: product.uuid,
            price: product.price,
            counter: 1,
        });
    } else {
        existingProduct.counter = counter;
    }
    invoice();
};
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
};