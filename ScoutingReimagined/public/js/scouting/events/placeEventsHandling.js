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
        "side": null, //can be: "Left || Right || Middle [if location is Cargo Airship"] 
        "status": null, // Can be: "success" || "fail"
        "failReason": null, // Can be: TODO: add fail reasons codes for shooting events
        "competition": competition
    }
}

var place = null;

function placeit_start() {
    place = Place();
    hideAllButtons();
    place_what();
}

function place_what() {
    fillEventsDivWithObjects([
        {
            type: 'button',
            value: 'Hatch Panel'
        },
        {
            type: 'button',
            value: 'Cargo'
        }

    ], place_location);
}

function place_location(type) {
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
            value: 'Cargo Airship'
        }
    ], place_side);
}
function place_side(location) {
    place.location = location;
    if
    if (location == "Cargo Airship" && place.type != "Cargo") {
        fillEventsDivWithObjects([
            {
                type: 'button',
                value: 'Left'
            },
            {
                type: 'button',
                value: 'Right'
            },
            {
                type: 'button',
                value: 'Middle'
            }
        ], place_level);
    } else if (place.type != "Cargo") {
        fillEventsDivWithObjects([
            {
                type: 'button',
                value: 'Left'
            },
            {
                type: 'button',
                value: 'Right'
            }
        ], place_level);

    } else {
        place_level(null);
    }

}
function place_level(side) {
    if (place.location == 'Cargo Airship') {
        return place_status(1);
    }
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

    ], place_status)
}
function place_status(level) {
    place.level = level;
    fillEventsDivWithObjects([
        {
            type: 'button',
            value: 'Success'
        },
        {
            type: 'buttonSelect',
            value: ['Failed because of interruption', 'Failed because of mechanical failure', 'failed because it fell']
        }
    ], place_finish)
}


function place_finish(status) {
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
