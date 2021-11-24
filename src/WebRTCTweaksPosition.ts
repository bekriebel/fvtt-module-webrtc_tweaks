import { getGame } from "./utils/helpers";
import * as log from "./utils/logging";

export default class WebRTCTweaksPosition {
  // Is the FVTT server version 9. TODO: Remove if we drop support for lower versions
  static isVersion9(): boolean {
    return isNewerVersion(getGame().version || getGame().data.version, "9");
  }

  static addPositionButton(
    element: JQuery<HTMLElement>,
    cameraviews: CameraViews
  ): void {
    // Can't find it?
    if (element.length !== 1) {
      log.warn("Can't find CameraView toggle-popout element", element);
      return;
    }
    const positionButton = $(
      '<a class="av-control toggle" title="Change Position"><i class="fas fa-arrows-alt"></i></a>'
    );
    positionButton.on("click", (event) =>
      WebRTCTweaksPosition.onPositionButtonClicked(event, cameraviews)
    );
    element.after(positionButton);
  }

  static cameraViewHeightToWidth(height: number): number {
    // Calculate desired width based on height with banner and padding
    const width = (height - 32.5) * (4 / 3);
    return width;
  }

  static cameraViewMaxWidth(dockSize: string | undefined): number {
    let maxWidth = 320;
    switch (dockSize) {
      case "large":
        maxWidth = 320;
        break;
      case "medium":
        maxWidth = 240;
        break;
      case "small":
        maxWidth = 160;
        break;
      default:
        break;
    }
    return maxWidth;
  }

  static cameraViewsWidthFromWindowHeight(
    cameraCount: number,
    hidePlayerList: boolean
  ): number {
    // Calculate desired width of the camera views based on the height of the window,
    //   number of users being displayed, and if the player list is visible
    const hotbarOffsetTop = ui.hotbar?.element.offset()?.top || 0;
    const navOffsetTop = ui.nav?.element.offset()?.top || 0;
    const navHeight = ui.nav?.element.height() || 0;
    let availableHeight = hotbarOffsetTop - (navOffsetTop + navHeight + 4);
    if (!hidePlayerList) {
      const playersHeight = ui.players?.element.height() || 0;
      const hotbarHeight = ui.hotbar?.element.height() || 0;
      availableHeight -= playersHeight - hotbarHeight + 4;
    }
    const heightPerCamera = availableHeight / cameraCount - 4;
    const desiredWidth = this.cameraViewHeightToWidth(heightPerCamera);
    return desiredWidth;
  }

  static async onCollapseSceneNavigation(): Promise<void> {
    // Sleep for 300ms to give the bar time to collapse.
    // TODO: Remove this if the bug is fixed to call the hook after transition.
    await new Promise((r) => setTimeout(r, 300));
    if (ui.webrtc) WebRTCTweaksPosition.setStyle(ui.webrtc, ui.webrtc?.element);
  }

  static onCollapseSidebar(): void {
    if (ui.webrtc) WebRTCTweaksPosition.setStyle(ui.webrtc, ui.webrtc?.element);
  }

  static onPositionButtonClicked(
    event: JQuery.ClickEvent,
    cameraviews: CameraViews
  ): void {
    const cameraViews = cameraviews;
    const positions = ["top", "right", "bottom", "left"];
    const position = positions.indexOf(
      cameraviews.webrtc?.settings.client.dockPosition || "bottom"
    );
    const nextPosition = position + 1 >= positions.length ? 0 : position + 1;
    if (cameraViews.webrtc)
      cameraViews.webrtc.settings.client.dockPosition = positions[nextPosition];

    cameraViews.render(true);
  }

  static onRenderCameraViews(
    cameraviews: CameraViews,
    html: JQuery<HTMLElement>
  ): void {
    const cameraBox = html.find(`[data-user="${getGame().user?.id}"]`);
    const element = cameraBox.find('[data-action="toggle-popout"]');
    WebRTCTweaksPosition.addPositionButton(element, cameraviews);
    WebRTCTweaksPosition.setStyle(cameraviews, html);
  }

  static onResize(): void {
    if (ui.webrtc) WebRTCTweaksPosition.setStyle(ui.webrtc, ui.webrtc?.element);
  }

  // Set the left to adjust for the side bar
  static setLeft(html: JQuery<HTMLElement>): void {
    let leftPosition = ui.sidebar?.element.offset()?.left;
    const htmlWidth = html.width();
    if (leftPosition && htmlWidth) leftPosition -= htmlWidth + 4;
    if (leftPosition) html.offset({ left: leftPosition });
  }

  static setStyle(cameraviews: CameraViews, html: JQuery<HTMLElement>): void {
    const clientSettings = cameraviews.webrtc?.settings.client;
    if (!clientSettings) {
      log.warn("Cannot find WebRTC Client settings; skipping setStyle");
      return;
    }

    const { dockPosition } = clientSettings;
    switch (dockPosition) {
      case "left":
        this.setTop(html, dockPosition);
        this.setWidth(cameraviews, html);
        break;
      case "top":
        this.setTop(html, dockPosition);
        break;
      case "right":
        this.setTop(html, dockPosition);
        this.setWidth(cameraviews, html);
        this.setLeft(html);
        break;
      case "bottom":
        this.setBottom(html);
        break;
      default:
        break;
    }
  }

  static setBottom(html: JQuery<HTMLElement>): void {
    if (this.isVersion9()) {
      const uiBottom = document.getElementById("ui-bottom");
      if (uiBottom) {
        html.prependTo(uiBottom);
      }
    }
  }

  // Set the top to adjust for the nav bar
  static setTop(html: JQuery<HTMLElement>, dockPosition: string): void {
    if (this.isVersion9()) {
      const uiTop = document.getElementById("ui-top");
      if (uiTop) {
        html.appendTo(uiTop);
      }
    } else {
      let topPosition = ui.nav?.element.offset()?.top;
      if (!topPosition) {
        log.warn("Unable to determine top position; skipping setTops");
        return;
      }
      if (
        !ui.nav?.element.hasClass("collapsed") &&
        (!ui.sidebar?.element.hasClass("collapsed") || dockPosition !== "right")
      ) {
        const navHeight = ui.nav?.element.height();
        if (navHeight) topPosition += navHeight;
      } else if (dockPosition !== "right") {
        const toggleElement = ui.nav?.element.find("#nav-toggle");
        const toggleElementHeight = toggleElement?.height();
        if (toggleElementHeight) topPosition += toggleElementHeight + 10;
      }
      html.offset({ top: topPosition });
    }
  }

  // Set the width to adjust the height since flexbox doesn't handle this well in CSS
  static setWidth(cameraviews: CameraViews, html: JQuery<HTMLElement>): void {
    // Check if the player list is visible
    let hidePlayerList = true;
    if (cameraviews.webrtc?.settings.client.dockPosition === "left") {
      hidePlayerList = cameraviews.webrtc.settings.client.hidePlayerList;
    }

    // Determine the desired width
    const desiredWidth = this.cameraViewsWidthFromWindowHeight(
      html.children().length,
      hidePlayerList
    );

    // Set the width so that the height auto adjusts
    if (
      desiredWidth <
      this.cameraViewMaxWidth(cameraviews.webrtc?.settings.client.dockSize)
    ) {
      html.width(desiredWidth);
    }
  }
}
