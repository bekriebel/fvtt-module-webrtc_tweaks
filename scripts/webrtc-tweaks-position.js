class WebRTCTweaksPosition {
	static onRenderCameraViews(cameraviews, html, data) {
        let element = html.find('[data-action="change-size"]');
        WebRTCTweaksPosition.addPositionButton(element, cameraviews);
    }

    static addPositionButton(element, cameraviews) {
        // Can't find it?
        if (element.length != 1) {
            console.log("WebRTCTweaks: Can't find CameraView change-size element", element);
            return;
        }
        let positionButton = $('<a class="av-control toggle" title="Change Position"><i class="fas fa-arrows-alt"></i></a>');
        positionButton.on('click', (event) => WebRTCTweaksPosition.onPositionButtonClicked(event, cameraviews));
        element.after(positionButton);
    }

    static onPositionButtonClicked(event, cameraviews) {
        const positions = ["top", "right", "bottom", "left"];
        const position = positions.indexOf(cameraviews.webrtc.settings.dockPosition);
        const nextPosition = position+1 >= positions.length ? 0 : position+1;
        cameraviews.webrtc.settings.dockPosition = positions[nextPosition];

        cameraviews.render(true);
    }
}

Hooks.on('ready', () => {
    Hooks.on('renderCameraViews', WebRTCTweaksPosition.onRenderCameraViews);
    Hooks.on('renderWebRTCTweaksCameraViews', WebRTCTweaksPosition.onRenderCameraViews);
});