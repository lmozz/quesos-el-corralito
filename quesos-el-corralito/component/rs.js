import { luyval } from "/quesos-el-corralito/library/luyval.js";
import { menu } from "/quesos-el-corralito/component/menu.js";
const copyPaste = str =>  {
    const textarea = document.createElement('textarea');
    textarea.value = str;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    alert('Texto copiado al portapapeles');
}
const facebook = () => copyPaste("https://www.facebook.com/profile.php?id=61566525224902");
const instagram = () => copyPaste("https://www.instagram.com/quesoscorralitosv/");
const whatsapp = () => copyPaste("https://www.instagram.com/quesoscorralitosv/");
export const initRs = () => {
    luyval.css.add("/quesos-el-corralito/css/rs.css");
    luyval.css.remove("/quesos-el-corralito/css/product.css");
    luyval.css.remove("/quesos-el-corralito/css/sales.css");
    luyval.css.remove("/quesos-el-corralito/css/stock.css");
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
                <img src="/quesos-el-corralito/img/facebook.png" alt="Facebook" />
                <button fb>Copiar Enlace</button>
            </div>
            <div class="social-card">
                <h1>Instagram</h1>
                <img src="/quesos-el-corralito/img/instagram.png" alt="Instagram" />
                <button in>Copiar Enlace</button>
            </div>
            <div class="social-card">
                <h1>WhatsApp</h1>
                <img src="/quesos-el-corralito/img/whatsapp.png" alt="WhatsApp" />
                <button wa>Copiar Enlace</button>
            </div>
        </div>
    `);
}