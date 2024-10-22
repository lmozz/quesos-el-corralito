import { title } from "../tools/title.js";
export const initRs = () => {
    title("Item");
    removeCss("./css/item.css");
    luyval.event.click({
        fb: facebook,
        in: instagram,
        wa: whatsapp,
    });
    luyval.body(/*html*/`
        ${menu}
        <div class="container">
            <div class="social-card">
                <h1>FaceBook</h1>
                <img src="./img/facebook.png" alt="Facebook" />
                <button fb>Copiar Enlace</button>
            </div>
            <div class="social-card">
                <h1>Instagram</h1>
                <img src="./img/instagram.png" alt="Instagram" />
                <button in>Copiar Enlace</button>
            </div>
            <div class="social-card">
                <h1>WhatsApp</h1>
                <img src="./img/whatsapp.png" alt="WhatsApp" />
                <button wa>Copiar Enlace</button>
            </div>
        </div>
    `);
};