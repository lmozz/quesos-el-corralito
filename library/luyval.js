"use strict";
let memoryEvent = {
    click: { event: null, flag: false },
    change: { event: null, flag: false },
    keyup: { event: null, flag: false },
    blur: { event: null, flag: false },
    dblclick: { event: null, flag: false },
    focus: { event: null, flag: false },
};
const universal = new (class universalVariables {
    format(str) {
        return "FileSystemWritableFileStream" + str;
    }
    global() {
        return this.format("Global");
    }
})();
const handlerEvent = (e, action) => {
    const verifyParent = (element, keyValue) => {
        element = element.target;
        let _counter = -1,
            _flag = false;
        while (true) {
            _counter++;
            if (element.getAttribute(keyValue) !== null) {
                _flag = true;
                break;
            } else {
                element = element.parentElement;
                if (!Boolean(element)) {
                    break;
                }
            }
        }
        return { counter: _counter, flag: _flag };
    };
    let keys = Object.keys(memoryEvent[action].event);
    let values = Object.values(memoryEvent[action].event);
    for (let i = 0; i < keys.length; i++) {
        let key = keys[i].replaceAll("_", "-");
        let parent = verifyParent(e, key);
        if (parent.flag) {
            e = e.target;
            for (let q = 0; q < parent.counter; q++) {
                e = e.parentElement;
            }
            if (!Array.isArray(values[i])) {
                values[i](e);
            } else {
                eval(
                    (() => {
                        let answer = "values[i][0](e";
                        for (let q = 1; q < values[i].length; q++) {
                            if (typeof values[i][q] === "string") {
                                answer += ',"' + values[i][q] + '"';
                            } else {
                                answer += "," + values[i][q];
                            }
                        }
                        answer += ")";
                        return answer;
                    })()
                );
            }
            break;
        }
    }
};
const privateEvent = (event, json) => {
    memoryEvent[event].event = !Boolean(memoryEvent[event].event)
        ? json
        : { ...memoryEvent[event].event, ...json };
    if (!memoryEvent[event].flag) {
        memoryEvent[event].flag = true;
        $("html")[0].addEventListener(event, (e) => handlerEvent(e, event));
    }
};
export const $ = (key, value = "") => {
    if (key[0] === "#") {
        return document.getElementById(key.substring(1));
    } else if (key[0] === ".") {
        return document.getElementsByClassName(key.substring(1));
    } else if (key[0] === "@") {
        return document.getElementsByClassName(key.substring(1));
    } else if (key[0] === "!") {
        localStorage.removeItem(key.substring(1));
    } else if (key[0] === "<") {
        return localStorage.getItem(key.substring(1)) !== null
            ? JSON.parse(localStorage.getItem(key.substring(1)))
            : false;
    } else if (key[0] === ">") {
        localStorage.setItem(key.substring(1), JSON.stringify(value));
    } else if (key[0] === "*") {
        let element = document.querySelectorAll("[" + key.substring(1) + "]");
        return typeof (element.length) === "undefined" ? element[0] : element;
    } else {
        return document.getElementsByTagName(key);
    }
};
const global = {
    set: (global) => (window[universal.global()] = global),
    get: () => window[universal.global()],
};
const luyvalConsole = () => {
    const privateConfLuyval = {
        console: {
            font: "font-size: 14px;",
            padding: "padding: 5px;",
            radius: "border-radius: 10px;",
            log: {
                color: "color:#515A5A;",
                back: "background-color:#CCD1D1;",
            },
            error: {
                color: "color:#943126;",
                back: "background-color:#F5B7B1;",
            },
            warning: {
                color: "color:#935116;",
                back: "background-color:#FAD7A0;",
            },
        }
    };
    const _privateLuyval = {
        init: (func) => (window.onload = () => func()),
        console: async (str, style) => {
            setTimeout(
                console.log.bind(
                    console,
                    "%c%s",
                    await new Promise((resolve) => {
                        let conf = privateConfLuyval.console;
                        let answer = conf.font + conf.padding + conf.radius;
                        if (style === "l") {
                            answer += conf.log.back + conf.log.color;
                        } else if (style === "e") {
                            answer += conf.error.back + conf.error.color;
                        } else if (style === "w") {
                            answer += conf.warning.back + conf.warning.color;
                        }
                        resolve(answer);
                    }),
                    str
                )
            );
        },
        tools: {
            date: (raw = false) => {
                const date = new Date();
                const day = String(date.getDate()).padStart(2, '0');
                const month = String(date.getMonth() + 1).padStart(2, '0'); 
                const year = date.getFullYear();
                const hours = String(date.getHours()).padStart(2, '0');
                const minutes = String(date.getMinutes()).padStart(2, '0');
                const seconds = String(date.getSeconds()).padStart(2, '0');
                if (!raw){
                    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
                } else {
                    return `${day}${month}${year}${hours}${minutes}${seconds}`;
                }
            },
            denyConsole: () => {
                document.addEventListener('keydown', function (event) {
                    if (event.ctrlKey && event.shiftKey && (event.key === 'I' || event.key === 'i')) {
                        event.preventDefault();
                    }
                    if (event.key === 'F12') {
                        event.preventDefault();
                    }
                });
            },
            denyRightClick: () => document.oncontextmenu = () => false,
            denyDrag: () => {
                document.addEventListener('dragstart', function (evt) {
                    if (evt.target.tagName == 'IMG' || evt.target.tagName == 'A') {
                        evt.preventDefault();
                    }
                });
            },
            randomCode: number => {
                let answer = "";
                let string = "qweOWIEURYTLAKrtSJDsjdhfgmznxyuioplakPQbcvHF1928GMZNXBCV037465".split("");
                for (let i = 0; i < number; i++) {
                    let random = Math.floor(Math.random() * (string.length - 0)) + 0;
                    answer += string[random];
                }
                return answer;
            },
            shorten: (characters, sentence, points) => {
                let result = "";
                if (characters > 0 && sentence !== "") {
                    let flag = (sentence.length > characters) ? true : false;
                    if (flag) {
                        for (let i = 0; i < characters; i++) {
                            result += sentence[i];
                        }
                        if (points) {
                            result += "...";
                        }
                    } else {
                        result = sentence;
                    }
                }
                return result;
            },
            sleep: async (timeout) => (
                await new Promise(async (resolve) => {
                    if (!Boolean(timeout)) {
                        timeout = 0.5;
                    }
                    timeout *= 1000;
                    setTimeout(() => resolve(true), timeout);
                })
            ),
            title: str => $("title")[0].innerHTML = str,
            coin: (number, flag, decimal, toNumber = false) => {
                if (flag) {
                    number = parseFloat(number.toString()).toFixed(decimal);
                    number = number.toString();
                    let _decimal = number.split(".")[1];
                    let tens = number.split(".")[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                    let money = !toNumber ? "$" : "";
                    return money + tens + "." + _decimal;
                } else {
                    let answer = "";
                    if (!toNumber) {
                        number = number.split("$")[1];
                    }
                    let _number = number.split(",");
                    for (let i = 0; i < _number.length; i++) {
                        answer += _number[i];
                    }
                    answer = parseFloat(answer);
                    return answer;
                }
            },
            number: async function (number, flag, decimal) {
                return this.coin(number, flag, decimal, true);
            },
            int: str => parseInt(str),
            float: (str, decimal) => {
                let answer = parseFloat(str);
                if (decimal === false) {
                    return answer;
                } else {
                    answer = answer.toFixed(decimal);
                    answer = parseFloat(answer);
                    return answer;
                }
            },
            string: str => str.toString(),
            css: {
                add: href => {
                    const existingLink = document.querySelector(`link[href="${href}"]`);
                    if (!existingLink) {
                        const link = document.createElement("link");
                        link.rel = "stylesheet";
                        link.href = href;
                        document.head.appendChild(link);
                    }
                },
                remove: hrefs => {
                    if (!Array.isArray(hrefs)) {
                        hrefs = [hrefs];
                    }
                    hrefs.forEach(href => {
                        const link = document.querySelector(`link[href="${href}"]`);
                        if (link) {
                            link.parentNode.removeChild(link);
                        }
                    });
                },
            },
        },
        json: {
            load: async function (url) {
                return await new Promise(async (resolve) => {
                    let answer = await fetch(url + ".json?v=" + this.randomCode(10));
                    resolve(await answer.json());
                });
            },
            download: (object, fileName) => {
                const data = JSON.stringify(object, null, 2);
                const blob = new Blob([data], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `${fileName}.json`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
            },         
        },
        body: {
            write: (str) => $("body")[0].innerHTML = str,
        },
        dom: {
            set: (strAttribute, key, value) => {
                let element = typeof (strAttribute) === "string" ? $(strAttribute) : strAttribute;
                if (typeof (element.length) === "undefined") {
                    element.setAttribute(key, value);
                } else {
                    for (let i = 0; i < element.length; i++) {
                        element[i].setAttribute(key, value);
                    }
                }
            },
            get: (strAttribute, key) => {
                let element = typeof (strAttribute) === "string" ? $(strAttribute) : strAttribute;
                if (typeof (element.length) === "undefined") {
                    return element.getAttribute(key);
                } else {
                    let answer = [];
                    for (let i = 0; i < element.length; i++) {
                        answer.push(element[i].getAttribute(key));
                    }
                    return answer;
                }
            },
            del: (strAttribute, key) => {
                let element = typeof (strAttribute) === "string" ? $(strAttribute) : strAttribute;
                if (typeof (element.length) === "undefined") {
                    element.removeAttribute(key, value);
                } else {
                    for (let i = 0; i < element.length; i++) {
                        element[i].removeAttribute(key, value);
                    }
                }
            },
            display: (strAttribute, display) => {
                let style = element.getAttribute(style);
                if (!Boolean(style)) {
                    style = "";
                }
                let answer = style === "" ? "display:" + display + ";" : ";display:" + display + ";";
                let element = typeof (strAttribute) === "string" ? $(strAttribute) : strAttribute;
                if (typeof (element.length) === "undefined") {
                    element.setAttribute("style", style + answer);
                } else {
                    for (let i = 0; i < element.length; i++) {
                        element[i].setAttribute("style", style + answer);
                    }
                }
            },
            class: (strAttribute, str, action) => {
                let element = typeof (strAttribute) === "string" ? $(strAttribute) : strAttribute;
                str = str.split(" ");
                if (typeof (element.length) === "undefined") {
                    for (let i = 0; i < str.length; i++) {
                        element.classList[action](str[i]);
                    }
                } else {
                    for (let i = 0; i < element.length; i++) {
                        for (let q = 0; q < str.length; q++) {
                            element[i].classList[action](str[q]);
                        }
                    }
                }
            },
            classGet: function strAttribute(strAttribute) {
                let element = typeof (strAttribute) === "string" ? $(strAttribute) : strAttribute;
                if (typeof (element.length) === "undefined") {
                    let answer = element.getAttribute("class");
                    if (Boolean(answer)) {
                        return answer;
                    }
                    return "";
                } else {
                    let answers = [];
                    for (let i = 0; i < element.length; i++) {
                        let answer = element[i].getAttribute("class");
                        if (Boolean(answer)) {
                            answers.push(answer);
                        } else {
                            answers.push("");
                        }
                    }
                    return answers;
                }
            }
        },
    };
    return { privateLuyval: _privateLuyval, };
};
const globalPrivateLuyval = luyvalConsole().privateLuyval;
export const luyval = {
    init: (func) => globalPrivateLuyval.init(func),
    log: (str) => globalPrivateLuyval.console(str, "l"),
    error: (str) => globalPrivateLuyval.console(str, "e"),
    warning: (str) => globalPrivateLuyval.console(str, "w"),
    denyRightClick: () => globalPrivateLuyval.tools.denyRightClick(),
    denyConsole: () => globalPrivateLuyval.tools.denyConsole(),
    denyDrag: () => globalPrivateLuyval.tools.denyDrag(),
    randomCode: number => globalPrivateLuyval.tools.randomCode(number),
    shorten: (str, quantity, point) => globalPrivateLuyval.tools.shorten(str, quantity, point),
    sleep: async (second) => await globalPrivateLuyval.tools.sleep(second),
    title: str => globalPrivateLuyval.tools.title(str),
    coin: (number, flag = true, decimal = 2) => globalPrivateLuyval.tools.coin(number, flag, decimal),
    number: (number, flag = true, decimal = 2) => globalPrivateLuyval.tools.number(number, flag, decimal),
    int: str => globalPrivateLuyval.tools.int(str),
    float: (str, decimal = false) => globalPrivateLuyval.tools.float(str, decimal),
    string: str => globalPrivateLuyval.tools.string(str),
    date: raw => globalPrivateLuyval.tools.date(raw),
    goto: a => window.location.replace(a),
    body: (str = "") => globalPrivateLuyval.body.write(str),
    json: {
        load: async (url) => await globalPrivateLuyval.json.load(url),
        download: async (json, fileName) => globalPrivateLuyval.json.download(json, fileName),
    },
    css: {
        add: href => globalPrivateLuyval.tools.css.add(href),
        remove: href => globalPrivateLuyval.tools.css.remove(href),
    },
    e: {
        set: (strAttribute, key, value = "") => globalPrivateLuyval.dom.set(strAttribute, key, value),
        get: (strAttribute, key) => globalPrivateLuyval.dom.get(strAttribute, key),
        del: (strAttribute, key) => globalPrivateLuyval.dom.del(strAttribute, key),
    },
    d: {
        none: strAttribute => globalPrivateLuyval.dom.display(strAttribute, "none"),
        block: strAttribute => globalPrivateLuyval.dom.display(strAttribute, "block"),
        iblock: strAttribute => globalPrivateLuyval.dom.display(strAttribute, "inline-block"),
        flex: strAttribute => globalPrivateLuyval.dom.display(strAttribute, "flex"),
        iflex: strAttribute => globalPrivateLuyval.dom.display(strAttribute, "inline-flex"),
    },
    class: {
        add: (strAttribute, str) => globalPrivateLuyval.dom.class(strAttribute, str, "add"),
        del: (strAttribute, str) => globalPrivateLuyval.dom.class(strAttribute, str, "remove"),
        get: strAttribute => globalPrivateLuyval.dom.classGet(strAttribute),
    },
    event: {
        click: (json) => privateEvent("click", json),
        change: (json) => privateEvent("change", json),
        keyup: (json) => privateEvent("keyup", json),
        blur: (json) => privateEvent("blur", json),
        click2: (json) => privateEvent("dblclick", json),
        focus: (json) => privateEvent("focus", json),
    }
};