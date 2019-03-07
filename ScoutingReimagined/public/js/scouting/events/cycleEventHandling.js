function Cycle() {
    return {
        "teamNumber": teamNumber,
        "gameId": gameId,
        "eventName": "cycle",
        "startTime": Math.round(gameVideo.currentTime - autonomousStartTime),// videoCurrentTime,
        "matchPart": (gameVideo.currentTime - autonomousStartTime) < 15 ? "autonomous" : "teleop",
        "endTime": 0,
        "status": null, // Can be: "success" || "fail"
        "failReason": null,
        "pickup": null,
        "place": null,
        "timeTook":0,
        "competition": competition
    }
}

var cycle = null;

function start_cycle() {
    hideAllButtons();
    cycle = Cycle();

    fillEventsDivWithObjects([
        {
            type: 'button',
            value: 'start pickup'
        }
    ], pickup_start)
}

var pickup = pickup || PickUp();

function pickup_start(iscycle) {
    pickup = PickUp();
    hideAllButtons();
    pickup_type();
}

function pickup_type() {
    fillEventsDivWithObjects([
        {
            type: 'button',
            value: 'Hatch Panel'
        },
        {
            type: 'button',
            value: 'Cargo'
        }
    ], pickup_location);
}

function pickup_location(pickup_type) {
    pickup.type = pickup_type;
    fillEventsDivWithObjects([
        {
            type: 'button',
            value: 'Floor'
        },
        {
            type: 'button',
            value: 'Feeder'
        }
    ], pickup_status);
}

function pickup_status(pickup_location) {
    pickup.location = pickup_location;
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
    ], pickup_finish);
}

function pickup_finish(pickup_status) {
    pickup.endTime = Math.round(gameVideo.currentTime - autonomousStartTime);

    if (pickup_status === 'Success') {
        pickup.status = pickup_status;
        delete pickup.failReason;  // Prevent ElasticSearch from indexing this value
    } else {
        pickup.status = 'Failure';
        pickup.failReason = pickup_status;

        hideAllButtons();
        cycle.pickup = pickup;
        cycle.endTime = Math.round(gameVideo.currentTime - autonomousStartTime);
        cycle.status = 'Failure';
        cycle.failReason = pickup_status;
        delete cycle.place;

        sendEvent(cycle);
        initializeEvents();
    }

    fillEventsDivWithObjects([
        {
            type: 'button',
            value: 'Start Place'
        }
    ], Bplaceit_start)
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var place = null;

function Bplaceit_start(s) {

    place = Place();
    hideAllButtons();
    place_location(pickup.type);

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
            value: 'Cargoship'
        }
    ], place_level);
}

function place_level(loc) {
    place.location = loc;
    if (place.location == 'Cargoship') {
        place_status(1);
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

        ], place_status);

    }
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
            value: ['Failed because of interruption',
            'Failed because of mechanical failure',
            'failed because driver mistake']
        }
    ], place_finish)
}


function place_finish(status) {
    hideAllButtons();
    place.endTime = Math.round(gameVideo.currentTime - autonomousStartTime);
    if (status === 'Success') {
        place.status = status;
        cycle.status = status;
        delete cycle.failReason;
        delete place.failReason; // Prevent ElasticSearch from indexing this value
    } else {
        place.status = 'Failure';
        cycle.status = 'Failure';
        cycle.failReason = status;
        place.failReason = status;
    }

    console.log("cycle", cycle);
    cycle.pickup = pickup;
    cycle.place = place;
    cycle.timeTook = Math.round(place.endTime-pickup.startTime);
    cycle.endTime = place.endTime;
    sendEvent(cycle);
    initializeEvents();
}
