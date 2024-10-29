import { luyval, $ } from "./../library/luyval.js";
import { menu } from "./menu.js";
import { gproduct, sproduct, slist, glist, gsale, ssale, gclose, sclose, gstock, sstock } from "./key.js";
import { removeCss } from "../tools/cssRemove.js";
import { title } from "../tools/title.js";
import { initItem } from "./item.js";
import { initClose } from "./close.js";
import { initEntry } from "./entry.js";
import { getRevenue } from "../tools/revenue.js";
let product = null;
const renderProduct = () => {
    let html = /*html*/`
        <br />
        <button class="pretty" new>Nuevo</button>
        <button class="pretty warn" add>Agregar a Inventario</button>
        <button class="pretty warn" entrys>Ver Ingresos</button>
        <button class="pretty err" close>Cerrar Dia</button>
        <button class="pretty err" see-closes>Ver Cierres</button>
    `;
    if (!product) return html;
    html += /*html*/`
        <div class="product-container">
    `;
    product.forEach(_ => {
        html += /*html*/`
            <div class="product-item ${_.enable ? "" : "disabled"}" uuid="${_.uuid}">
                <input type="checkbox" onoff-product ${_.enable ? "checked" : ""} />
                <label title="Cambiar Nombre" edit-name>Nombre: </label> 
                <span>${_.name}</span><br />
                <label title="Cambiar Categoria" edit-category>Categoria: </label> 
                <span>${_.category}</span><br />
                <label title="Cambiar Unidad de Medida" edit-measure>Medida: </label> 
                <span>${_.measure}</span><br />
                <label title="Cambiar Precio" edit-price>Precio: </label> 
                <span>${_.price}</span><br />
                <label>Cantidad: </label><span>${_.quantity}</span>
                <div class="center">
                    <button class="pretty-2" enter>Precios</button>
                    <button class="pretty-2 warn" add-item>Añadir</button>
                    <button class="pretty-2 err" remove-item>Eliminar</button>
                </div>
                <div class="none center">
                    <label>Cantidad: </label><input type="number" placeholder="Cant." /><br />
                    <label>Costo Unit: </label><input type="number" placeholder="Unit." />
                </div>
            </div>
        `;
    });
    return /*html*/`
            ${html}
        </div>
    `;
};
const editProperty = (e, prop, message, error) => {
    let value = prompt(message, e.nextElementSibling.innerHTML);
    if (value == "" || value == null) return alert(error);
    let item = product.find(_ => _.uuid == luyval.e.get(e.parentElement, "uuid"));
    if (prop == "price") {
        if (isNaN(value)) return alert("Debe ingresar un numero");
        value = parseFloat(value);
    }
    item[prop] = value;
    $(sproduct, product);
    luyval.body(/*html*/`
        ${menu()}
        ${renderProduct()}
    `);
    if (prop == "price") {
        let price = $(glist);
        if (!price) price = [];
        price.unshift({
            date: luyval.date(),
            product: item.uuid,
            price: value,
        });
        $(slist, price);
    }
};
const enterProduct = e => {
    let uuid = luyval.e.get(e.parentElement.parentElement, "uuid");
    initItem(uuid);
};
const newProduct = () => {
    let name = prompt("Nombre del nuevo producto");
    if ((name || "") == "") return alert("No se ingreso ningun nombre");
    let uuid = luyval.randomCode(40);
    let category = prompt(`Categoria de ${name}`);
    if ((category || "") == "") return alert("No se ingreso ninguna categoria");
    let measure = prompt(`Unidad de Medida de ${name}`);
    if ((measure || "") == "") return alert("No se ingreso ninguna unidad de medida");
    if (!product) product = [];
    product.unshift({
        category: category,
        name: name,
        measure: measure,
        price: 0.0, 
        quantity: 0,
        uuid: uuid
    });
    $(sproduct, product);
    luyval.body(/*html*/`
        ${menu()}
        ${renderProduct()}
    `);
};
const onOffProduct = e => {
    let ok = confirm("Seguro que quiera habilitar/deshabilitar este producto");
    if (!ok) return;
    let item = product.find(_ => _.uuid == luyval.e.get(e.parentElement, "uuid"));
    item.enable = !item.enable;
    $(sproduct, product);
    luyval.body(/*html*/`
        ${menu()}
        ${renderProduct()}
    `);
};
const addStock = () => {
    let sales = $(gsale);
    if (!sales) sales = [];
    sales = sales.filter(_ => !_.close);
    if (sales.length > 0) {
        return alert("Debe cerrar el dia para agregar un stock");
    }
    let selected = Array.from($(".selected"));
    if (selected.length == 0) return alert("No hay ningun producto que agregar");
    let stockLine = [];
    let total = 0.0;
    let totalPrice = 0.0;
    let flag = true;
    selected.forEach(_ => {
        let uuid = luyval.e.get(_.parentElement, "uuid");
        let quantity = _.children[1].value;
        let cost = _.children[4].value;
        let prod = product.find(_ => _.uuid == uuid);
        if (quantity < 1 || quantity == "" || quantity == null || isNaN(quantity)) {
            flag = false;
            alert(`La cantidad del producto ${prod.name} no es correcta`);
        }
        if (cost < 1 || cost == "" || cost == null || isNaN(cost)) {
            flag = false;
            alert(`Las unidades del producto ${prod.name} no es correcta`);
        }
        quantity = parseInt(quantity);
        cost = parseFloat(cost);
        stockLine.unshift({
            product: {
                price: prod.price,
                name: prod.name,
                category: prod.category,
                measure: prod.measure,
                uuid: prod.uuid, 
                total: parseFloat((quantity * prod.price).toFixed(2)),
            },
            quantity: quantity,
            cost: cost,
            total: parseFloat((quantity * cost).toFixed(2)),
            profit: parseFloat((quantity * prod.price) - (quantity * cost)).toFixed(2),
            revenue: getRevenue(quantity * prod.price, quantity * cost),
        });
        total += parseFloat((quantity * cost).toFixed(2));
        totalPrice += parseFloat((quantity * prod.price).toFixed(2));
    });
    if (!flag) return;
    let invoice = prompt("Ingrese el numero de factura");
    if (invoice == "" || invoice == null) return alert("No ingreso ningun numero de factura");
    let description = prompt("Ingrese una descripcion (opcional)");
    let mark = prompt("Sello de generacion de hacienda (opcional)");
    let linkMh = prompt("Link al MH (opcional)");
    let stock = $(gstock);
    if (!stock) stock= [];
    let stockWithInvoice = stock.find(_ => _.invoice == invoice);
    if (stockWithInvoice != null) {
        stockWithInvoice.total += total;
        stockWithInvoice.totalPrice += totalPrice;
        stockWithInvoice.profit = parseFloat(stockWithInvoice.totalPrice - stockWithInvoice.total).toFixed(2);
        stockWithInvoice.revenue = getRevenue(stockWithInvoice.totalPrice, stockWithInvoice.total);
        stockWithInvoice.line.unshift(...stockLine);
        stockLine.forEach(_ => {
            let prod = product.find(__ => __.uuid == _.product.uuid);
            prod.quantity += _.quantity;
        });
    } else {
        stock.unshift({
            date: luyval.date(),
            invoice: invoice,
            description: description,
            mark: mark,
            linkMh: linkMh,
            total: total,
            totalPrice: totalPrice,
            profit: parseFloat(totalPrice - total).toFixed(2),
            revenue: getRevenue(totalPrice, total),
            line: stockLine,
        });
        stockLine.forEach(_ => {
            let prod = product.find(__ => __.uuid == _.product.uuid);
            prod.quantity += _.quantity;
        });
    }
    $(sstock, stock);
    $(sproduct, product);
    luyval.body(/*html*/`
        ${menu()}
        ${renderProduct()}
    `);
};
const seeEntrys = () => initEntry();
const addItem = e => {
    let sales = $(gsale);
    if (!sales) sales = [];
    sales = sales.filter(_ => !_.close);
    if (sales.length > 0) {
        return alert("Debe cerrar el dia para agregar un stock");
    }
    if (e.innerHTML == "Añadir") {
        e.innerHTML = "Cancelar";
        e = e.parentElement.nextElementSibling;
        luyval.class.del(e, "none");
        luyval.class.add(e, "selected");
    } else {
        e.innerHTML = "Añadir";
        e = e.parentElement.nextElementSibling;
        luyval.class.add(e, "none");
        luyval.class.del(e, "selected");
        e.children[1].value = "";
        e.children[4].value = "";
    }
};
const seeClosesDay = () => initClose();
const closeDay = () => {
    let sales = $(gsale);
    if (!sales) sales = [];
    if (sales.length < 1) return alert("No hay ventas existentes");
    sales = sales.filter(_ => !_.close);
    if (sales.length < 1) return alert("No hay ventas abiertas");
    let close = $(gclose);
    if (!close) close = [];
    sales.forEach(sls => {
        sls.sale.forEach(s => {
            let prod = product.find(p => p.uuid == s.uuid);
            prod.quantity -= s.counter;
        });
        sls.close = true;
    });
    close.unshift({
        date: luyval.date(),
        products: product,
    });
    $(sclose, close);
    $(sproduct, product);
    let openSales = $(gsale);
    if (!openSales) openSales = [];
    openSales = openSales.filter(_ => _.close);
    $(ssale, [ ...sales, ...openSales ]);
    luyval.body(/*html*/`
        ${menu()}
        ${renderProduct()}
    `);
    alert(`El dia ${luyval.date()} se cerro existosamente`);
};
const removeItem = e => {
    if (!confirm("Esta seguro que desea eliminar el producto ?")) return;
    e = e.parentElement.parentElement;
    let uuid = luyval.e.get(e, "uuid");
    let prod = product.find(_ => _.uuid === uuid);
    let productName = prompt("Para validar la eliminacion de este producto; digite el nombre del producto");
    if ((productName || "") !== prod.name) return alert("El nombre del producto no es el mismo");
    let index = product.findIndex(_ => _.uuid === uuid);
    product.splice(index, 1);
    $(sproduct, product);
    luyval.body(/*html*/`
        ${menu()}
        ${renderProduct()}
    `);
};
const createEvents = () => {
    luyval.event.click({
        edit_name: [ editProperty, "name", "Ingrese el nuevo nombre", "No se edito el nombre" ],
        edit_category: [ editProperty, "category", "Ingrese la nueva categoria", "No se edito la categoria" ],
        edit_price: [ editProperty, "price", "Ingrese el nuevo precio", "No se edito el precio" ] ,
        edit_measure: [ editProperty, "measure", "Ingrese la nueva unidad de medida", "No se edito la unidad de medida" ],
        enter: enterProduct,
        new: newProduct,
        onoff_product: onOffProduct, 
        add_item: addItem,
        add: addStock,
        entrys: seeEntrys,
        close: closeDay,
        see_closes: seeClosesDay,
    });
    luyval.event.click2({
        remove_item: removeItem,
    })
};
export const initStock = () => {
    product = $(gproduct);
    title("Inventario");
    removeCss("./css/stock.css");
    luyval.body(/*html*/`
        ${menu()}
        ${renderProduct()}
    `);
    createEvents();
};