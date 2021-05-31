import registerModuleSettings from "./registerModuleSettings.js";
import WebRTCTweaksPosition from "../WebRTCTweaksPosition.js";

/* -------------------------------------------- */
/*  Hook calls                                  */
/* -------------------------------------------- */

Hooks.once("init", () => {
  // Register module settings
  registerModuleSettings();
});

Hooks.on("ready", () => {
  Hooks.on("renderCameraViews", WebRTCTweaksPosition.onRenderCameraViews);
  Hooks.on("sidebarCollapse", WebRTCTweaksPosition.onSidebarCollapse);
  Hooks.on("collapseSceneNavigation", WebRTCTweaksPosition.onCollapseSceneNavigation);
  window.addEventListener("resize", WebRTCTweaksPosition.onResize);
});
