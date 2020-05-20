class WebRTCTweaksAddExternal {
	static onRenderCameraViews(cameraviews, html, data) {
        WebRTCTweaksAddExternal.addExternalView(cameraviews);
    }

    static async addExternalView(cameraviews) {
        if (!cameraviews) return;

        console.log("WebRTCTweaks: cameraviews:", cameraviews);

        let connectedStreams = game.webrtc.client.getConnectedStreams();

        connectedStreams.forEach(stream => {
            if (!game.users.entities.find(u => u.id === stream.id)) {
                console.log("WebRTCTweaks: found external stream:", stream);
                //let externalCameraViewContent = 
                renderTemplate(ui.webrtc.template, this.getData(stream)).then(externalCameraViewContent => {
                    let externalCameraView = $(externalCameraViewContent);
                    //console.log("WebRTCTweaks: externalCameraView:", externalCameraView);
                    //console.log("WebRTCTweaks: externalCameraView[0].innerHTML:", externalCameraView[0].innerHTML);
                    cameraviews.element.append(externalCameraView[0].innerHTML);
                    
                    cameraviews.activateListeners(ui.webrtc.element);

                    game.webrtc.setVideoStream(stream.id, game.webrtc.client.getRemoteStreamForUserId(stream.id));
                    //game.webrtc.client.assignStreamToVideo(game.webrtc.client.getRemoteStreamForUserId(stream.id), cameraviews.getUserVideoElement(stream.id));
                    //game.webrtc.client.uiUpdateNeeded();
                });
            }
        });
        // let positionButton = $('<a class="av-control toggle" title="Change Position"><i class="fas fa-arrows-alt"></i></a>');
        // positionButton.on('click', (event) => WebRTCTweaksPosition.onPositionButtonClicked(event, cameraviews));
        // element.after(positionButton);


        
    }

    static getData(externalUser) {
        const settings = game.webrtc.settings;
    
        // Get the sorted array of connected users
        let users = [this._getDataForUser(externalUser)];
    
        // Define a dynamic class for the camera dock container which affects it's rendered style
        let dockClass = `camera-size-${game.webrtc.settings.dockSize} camera-position-${game.webrtc.settings.dockPosition}`;
        //if (!users.some(u => !u.settings.popout)) dockClass += " webrtc-dock-empty";
    
        // Alter the body class depending on whether the players list is hidden
        if (game.webrtc.settings.hidePlayerList) document.body.classList.add("players-hidden");
        else document.body.classList.remove("players-hidden");
    
        // Return data for rendering
        return {
          self: game.user,
          users: users,
          dockClass: dockClass,
          anyVideo: true, //game.webrtc.streamHasVideo(externalUser),
          muteAll: settings.muteAll
        };
      }
    
      /* -------------------------------------------- */
    
      /**
       * Get rendering template daa for one user
       * @param {User} user      The User to transform into rendering data
       * @return {Object}
       * @private
       */
      static _getDataForUser(user) {
    
        // Ensure the user has an active stream
        const stream = game.webrtc.client.getStreamForUser(user.id);
        const isConnected = !!stream; 
        if (!isConnected)
          return null;
    
        // Get data for the user
        const charname = user.id;
        //const settings = game.webrtc.settings.users[user.id];
        const isMuted = false; //!game.webrtc.isStreamAudioEnabled(stream);
        const isHidden = false; //!game.webrtc.isStreamVideoEnabled(stream);
        const hasVideo = true; //game.webrtc.streamHasVideo(stream);
        const hasAudio = true //game.webrtc.streamHasAudio(stream);
    
        // Return structured User data
        return {
          user: user,
          id: user.id,
          local: false,
          name: user.id,
          color: "#ffffff",
          colorAlpha: hexToRGBAString(colorStringToHex("#ffffff"), 0.20),
          charname: null,
          avatar: "icons/svg/mystery-man.svg",
          connected: isConnected,
          settings: null,
          volume: AudioHelper.volumeToInput(1),
          hasVideo: hasVideo,
          hasAudio: hasAudio,
          isMuted: isMuted,
          isHidden: isHidden,
          canToggleSources: game.user.isGM,
          videoToggleClass: ui.webrtc._getToggleIcon("toggle-video", !isHidden),
          videoToggleTooltip: ui.webrtc._getToggleTooltip("toggle-video", isHidden),
          audioToggleClass: ui.webrtc._getToggleIcon("toggle-audio", !isMuted),
          audioToggleTooltip: ui.webrtc._getToggleTooltip("toggle-audio", isMuted),
          videoToggleGlobalClass: ui.webrtc._getToggleIcon("block-video", true),
          videoToggleGlobalTooltip: ui.webrtc._getToggleTooltip("block-video", false),
          audioToggleGlobalClass: ui.webrtc._getToggleIcon("block-audio", true),
          audioToggleGlobalTooltip: ui.webrtc._getToggleTooltip("block-audio", false),
          cameraViewClass: [
            "camera-box-dock",
            hasVideo && isHidden ? "no-video" : null,
            hasAudio && isMuted ? "no-audio" : null
          ].filterJoin(" ")
        };
      }
}

Hooks.on('ready', () => {
    Hooks.on('renderCameraViews', WebRTCTweaksAddExternal.onRenderCameraViews);
});
