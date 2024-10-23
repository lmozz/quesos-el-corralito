import { luyval } from "../library/luyval.js";
export const removeCss = (str = "") => {
    luyval.css.remove("./css/product.css");
    luyval.css.remove("./css/rs.css");
    luyval.css.remove("./css/sales.css");
    luyval.css.remove("./css/item.css");
    if ((str || "") !== "") luyval.css.add(str);
}