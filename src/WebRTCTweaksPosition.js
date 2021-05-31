import * as log from "./utils/logging.js";

export default class WebRTCTweaksPosition {
  static onRenderCameraViews(cameraviews, html) {
    const cameraBox = html.find(`[data-user="${game.user.id}"]`);
    const element = cameraBox.find('[data-action="toggle-popout"]');
    WebRTCTweaksPosition.addPositionButton(element, cameraviews);
    WebRTCTweaksPosition.setStyle(cameraviews, html);
  }

  static onResize() {
    WebRTCTweaksPosition.setStyle(ui.webrtc, ui.webrtc.element);
  }

  static onSidebarCollapse() {
    WebRTCTweaksPosition.setStyle(ui.webrtc, ui.webrtc.element);
  }

  static async onCollapseSceneNavigation() {
    // Sleep for 300ms to give the bar time to collapse.
    // TODO: Remove this if the bug is fixed to call the hook after transition.
    await new Promise((r) => setTimeout(r, 300));
    WebRTCTweaksPosition.setStyle(ui.webrtc, ui.webrtc.element);
  }

  static setStyle(cameraviews, html) {
    const { dockPosition } = cameraviews.webrtc.settings.client;
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
      default:
        break;
    }
  }

  // Set the top to adjust for the nav bar
  static setTop(html, dockPosition) {
    let topPosition = ui.nav.element.offset().top;

    if (!ui.nav._collapsed && (!ui.sidebar._collapsed || dockPosition !== "right")) {
      topPosition += ui.nav.element.height();
    } else if (dockPosition !== "right") {
      const toggleElement = ui.nav.element.find("#nav-toggle");
      topPosition += toggleElement.height() + 10;
    }

    html.offset({ top: topPosition });
  }

  // Set the left to adjust for the side bar
  static setLeft(html) {
    let leftPosition = ui.sidebar.element.offset().left;
    leftPosition -= html.width() + 4;
    html.offset({ left: leftPosition });
  }

  // Set the width to adjust the height since flexbox doesn't handle this well in CSS
  static setWidth(cameraviews, html) {
    // Check if the player list is visible
    let hidePlayerList = true;
    if (cameraviews.webrtc.settings.client.dockPosition === "left") {
      hidePlayerList = cameraviews.webrtc.settings.client.hidePlayerList;
    }

    // Determine the desired width
    const desiredWidth = this.cameraViewsWidthFromWindowHeight(
      html.children().length,
      hidePlayerList,
    );

    // Set the width so that the height auto adjusts
    if (desiredWidth < this.cameraViewMaxWidth(cameraviews.webrtc.settings.client.dockSize)) {
      html.width(desiredWidth);
    }
  }

  static addPositionButton(element, cameraviews) {
    // Can't find it?
    if (element.length !== 1) {
      log.warn("Can't find CameraView toggle-popout element", element);
      return;
    }
    const positionButton = $('<a class="av-control toggle" title="Change Position"><i class="fas fa-arrows-alt"></i></a>');
    positionButton.on("click", (event) => WebRTCTweaksPosition.onPositionButtonClicked(event, cameraviews));
    element.after(positionButton);
  }

  static onPositionButtonClicked(event, cameraviews) {
    const cameraViews = cameraviews;
    const positions = ["top", "right", "bottom", "left"];
    const position = positions.indexOf(cameraviews.webrtc.settings.client.dockPosition);
    const nextPosition = position + 1 >= positions.length ? 0 : position + 1;
    cameraViews.webrtc.settings.client.dockPosition = positions[nextPosition];

    cameraViews.render(true);
  }

  static cameraViewHeightToWidth(height) {
    // Calculate desired width based on height with banner and padding
    const width = (height - 32.5) * (4 / 3);
    return width;
  }

  static cameraViewsWidthFromWindowHeight(cameraCount, hidePlayerList) {
    // Calculate desired width of the camera views based on the height of the window,
    //   number of users being displayed, and if the player list is visible
    let availableHeight = ui.hotbar.element.offset().top - (
      ui.nav.element.offset().top + ui.nav.element.height() + 4
    );
    if (!hidePlayerList) {
      availableHeight -= ui.players.element.height() - ui.hotbar.element.height() + 4;
    }
    const heightPerCamera = (availableHeight / cameraCount) - 4;
    const desiredWidth = this.cameraViewHeightToWidth(heightPerCamera);
    return desiredWidth;
  }

  static cameraViewMaxWidth(dockSize) {
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
}
