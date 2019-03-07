function Place() {
    return {
        "teamNumber": teamNumber,
        "gameId": gameId,
        "eventName": "place",
        "startTime": Math.round(gameVideo.currentTime - autonomousStartTime),// videoCurrentTime,
        "matchPart": (gameVideo.currentTime - autonomousStartTime) < 15 ? "autonomous" : "teleop",
        "endTime": null,
        "type": null, //can be: "Hatch Panel" || "Cargo"
        "location": null, // Can be: "Left Rocket" || "Right Rocket" || "Cargo Airship"
        "level": -1, //can be: 1 || 2 || 3 (1||2 if location is Cargo Airship)
        "status": null, // Can be: "success" || "fail"
        "failReason": null, // Can be: TODO: add fail reasons codes for shooting events
        "competition": competition
    }
}

var place = null;

function placeit_start() {
    place = Place();
    hideAllButtons();
    _place_what();
}

function _place_what() {
    fillEventsDivWithObjects([
        {
            type: 'button',
            value: 'Hatch Panel'
        },
        {
            type: 'button',
            value: 'Cargo'
        }

    ], _place_location);
}

function _place_location(type) {
    place.type = type;
    fillEventsDivWithObjects([
        {
            type: 'button',
            value: 'Left Rocket'
        },
        {
            type: 'button',
            value: 'Right Rocket'
        },
        {
            type: 'button',
            value: 'Cargoship'
        }
    ], _place_level);
}

function _place_level(loc) {
    place.location = loc

    if (place.location == 'Cargoship') {
        _place_status(1);
    }
    else {
        fillEventsDivWithObjects([
            {
                type: 'button',
                value: 1
            },
            {
                type: 'button',
                value: 2
            },
            {
                type: 'button',
                value: 3
            }

        ], _place_status);

    }
}
function _place_status(level) {
    place.level = level;
    fillEventsDivWithObjects([
        {
            type: 'button',
            value: 'Success'
        },
        {
            type: 'buttonSelect',
            value: ['Failed because of interruption',
             'Failed because of mechanical failure',
             'Failed because driver mistake']
        }
    ], _place_finish)
}


function _place_finish(status) {
    place.endTime = Math.round(gameVideo.currentTime - autonomousStartTime);
    if (status === 'Success') {
        place.status = status;
        delete place.failReason; // Prevent ElasticSearch from indexing this value
    } else {
        place.status = 'Failure';
        place.failReason = status;
    }
    sendEvent(place);
    initializeEvents();
}
