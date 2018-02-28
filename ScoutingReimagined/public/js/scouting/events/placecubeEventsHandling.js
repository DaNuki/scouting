function PlaceCube() {
    return {
        "teamNumber": teamNumber,
        "gameId": gameId,
        "eventName": "placecube",
        "startTime": Math.round(gameVideo.currentTime - autonomousStartTime),// videoCurrentTime,
        "matchPart": (gameVideo.currentTime - autonomousStartTime) < 15 ? "autonomous" : "teleop",
        "endTime": null,
        "location": null, // Can be: "switch" || "scale"
        "status": null, // Can be: "success" || "fail"
        "isConquering": null,
        "failReason": null, // Can be: TODO: add fail reasons codes for shooting events
        "competition": competition
    }
}

var placecube = null;

function placecube_start() {
    placecube = PlaceCube();
    hideAllButtons();
    placecube_location();
}

function placecube_location() {
    fillEventsDivWithObjects([
        {
            type: 'button',
            value: 'Switch'
        },
        {
            type: 'button',
            value: 'Scale'
        }
    ], placecube_status);
}

function placecube_status(location) {
    placecube.location = location;
    fillEventsDivWithObjects([
        {
            type: 'button',
            value: 'Success'
        },
        {
            type:'buttonSelect',
            value: ['Failed because of interruption', 'Failed because of mechanical failure','failed because cube fell']
        }
    ], shooting_finish)
}


function placecube_finish(status) {
    placecube.endTime = Math.round(gameVideo.currentTime - autonomousStartTime);
    if (status === 'Success') {
        placecube.status = status;
        delete placecube.failReason; // Prevent ElasticSearch from indexing this value
        placecube_isConquering();
    } else {
        placecube.status = 'Failure';
        placecube.failReason = status;
        sendEvent(placecube);
        initializeEvents();
    }

}

function placecube_isConquering(){
    fillEventsDivWithObjects([
        {
            type: 'button',
            value: 'conquered'
        },
        {
            type: 'button',
            value: 'not conquered'
        }
    ], placecube_conqueringFinished);
}
function placecube_conqueringFinished(isConquering){
    placecube.isConquering=isConquering;
    sendEvent(placecube);
    initializeEvents();

}