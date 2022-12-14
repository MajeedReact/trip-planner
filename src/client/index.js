import { handleSubmit } from "./js/formHandler";
import { calculateDays } from "./js/calculateDays";
import { removeTrip } from "./js/formHandler";
import { loadTrip } from "./js/formHandler";

import "./styles/resets.scss";
import "./styles/base.scss";
import "./styles/footer.scss";
import "./styles/form.scss";
import "./styles/header.scss";

import logo from "./icons/creative-flyer.png";
import pin from "./icons/pin.gif";
import placeholder from "./icons/placeholder-image.jpg";
const logoImg = document.getElementById("logo");
const pinImg = document.getElementById("pin-gif");
const placeholderImg = document.getElementById("trip-img");
logoImg.src = logo;
pinImg.src = pin;
placeholderImg.src = placeholder;

export { handleSubmit, calculateDays, removeTrip, loadTrip };
