import { removeCss } from "../tools/cssRemove.js";
import { title } from "../tools/title.js";
import { luyval } from "./../library/luyval.js";
import { menu } from "./menu.js";
const copyPaste = str =>  {
    const textarea = document.createElement('textarea');
    textarea.value = str;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    alert('Texto copiado al portapapeles');
};
const facebook = () => copyPaste("https://www.facebook.com/profile.php?id=61566525224902");
const instagram = () => copyPaste("https://www.instagram.com/quesoscorralitosv/");
const whatsapp = () => copyPaste("https:wa.me/+50376935019");
export const initRs = () => {
    title("Redes Sociales");
    removeCss("./css/rs.css");
    luyval.event.click({
        fb: facebook,
        in: instagram,
        wa: whatsapp,
    });
    luyval.body(/*html*/`
        ${menu()}
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