/* global document */

import { initFooter } from "./ui/footerUi.js";
import { initTheme } from "./ui/theme.js";
import { setupUI } from "./ui/uiLogic.js";

const app = document.getElementById("app");
app.innerHTML = "";

const header = document.createElement("header");
header.setAttribute("role", "banner");
app.appendChild(header);

const mainLandmark = document.createElement("main");
mainLandmark.setAttribute("role", "main");
app.appendChild(mainLandmark);

setupUI(header, mainLandmark);
initTheme(mainLandmark);
initFooter(app);
