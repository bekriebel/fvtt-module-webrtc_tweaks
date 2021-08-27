import registerModuleSettings from "./registerModuleSettings";
import WebRTCTweaksPosition from "../WebRTCTweaksPosition";

/* -------------------------------------------- */
/*  Hook calls                                  */
/* -------------------------------------------- */

Hooks.once("init", () => {
  // Register module settings
  registerModuleSettings();
});

Hooks.on("ready", () => {
  Hooks.on("renderCameraViews", WebRTCTweaksPosition.onRenderCameraViews);
  Hooks.on("collapseSidebar", WebRTCTweaksPosition.onCollapseSidebar);
  Hooks.on("sidebarCollapse", WebRTCTweaksPosition.onCollapseSidebar); // Legacy name
  Hooks.on(
    "collapseSceneNavigation",
    WebRTCTweaksPosition.onCollapseSceneNavigation
  );
  window.addEventListener("resize", WebRTCTweaksPosition.onResize);
});
