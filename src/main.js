/* global document */

import { setupUI } from "./uiLogic.js";
import { initTheme } from "./theme.js";

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
