/* global document */

import { setupUI } from "./uiLogic.js";
import { initTheme } from "./theme.js";

const app = document.getElementById("app");
app.innerHTML = "";

setupUI(app);
initTheme(app);
