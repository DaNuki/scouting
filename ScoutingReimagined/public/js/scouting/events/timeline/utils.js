var u_id = 0;
var events = [];

function addBatchEventsToTimeline(events) {

}

function addEventToTimeline(event) {
    var timeline = document.getElementById("timeline");

    // Event Entry:
    // <li>
    //   <div class="timeline-badge"><i class="glyphicon glyphicon-check"></i></div>
    //   <div class="timeline-panel">
    //     <div class="timeline-heading">
    //       <h4 class="timeline-title">Mussum ipsum cacilds</h4>
    //       <p><small class="text-muted"><i class="glyphicon glyphicon-time"></i> 11 hours ago via Twitter</small></p>
    //     </div>
    //     <div class="timeline-body">
    //       <p>Mussum ipsum cacilds, vidis litro abertis. Consetis adipiscings elitis. Pra lá , depois divoltis porris, paradis. Paisis, filhis, espiritis santis. Mé faiz elementum girarzis, nisi eros vermeio, in elementis mé pra quem é amistosis quis leo. Manduma pindureta quium dia nois paga. Sapien in monti palavris qui num significa nadis i pareci latim. Interessantiss quisso pudia ce receita de bolis, mais bolis eu num gostis.</p>
    //     </div>
    //   </div>
    // </li>
    var index = InsertEventToList(event.startTime);
    console.log("index", index);
    var eventEntry = createEventEntry(event, u_id, index);
    timeline.insertBefore(eventEntry, timeline.children[index]);
    u_id++;
    timeline.scrollTop = timeline.scrollHeight;
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function createEventEntry(event, unique_id, index) {
    var eventEntry = document.createElement("li");
    var success;
    if (event.status) {
        success = event.status === "Success";
        console.log("STATUS:", event.status);
    } else {
        success = event.recovered;
    }
    var badge = createBadge(event.eventName, success);
    var panel = createPanel(event, unique_id, index);
    eventEntry.appendChild(badge);
    eventEntry.appendChild(panel);
    eventEntry.id = "eventEntry-" + unique_id;
    return eventEntry;
}

function createBadge(eventName, success) {
    var mapping = {
        "chassisFight": "fa-chain-broken",
        "climb": "fa-arrow-circle-o-up",
        "gearplace": "fa-cogs",
        "pickup": "fa-download",
        "shooting": "fa-bullseye",
        "stuck": "fa-wheelchair",
        "comment": "fa-profile"
    };

    var color = success ? "success" : "danger";
    var badge = document.createElement("div");
    badge.className = "timeline-badge " + color;
    var icon = document.createElement("span");
    // Get glyphicon based on the event type
    icon.className = "fa " + mapping[eventName];
    badge.appendChild(icon);
    return badge;
}

function createPanel(event, unique_id, index) {
    var panel = document.createElement("div");
    panel.className = "timeline-panel";
    var panelHeading = createHeading(event);
    var panelBody = createBody(event, unique_id, index);
    panel.appendChild(panelHeading);
    panel.appendChild(panelBody);
    return panel;
}

function createHeading(event) {
    var panelHeading = document.createElement("div");
    panelHeading.className = "timeline-heading";
    var h4 = document.createElement("h4");
    h4.className = "timeline-title";
    h4.textContent = getHeadingContent(event);
    panelHeading.appendChild(h4);
    return panelHeading;
}

function getHeadingContent(event) {
    return capitalizeFirstLetter(event.eventName);
}


function createBody(event, unique_id, index) {
    var panelBody = document.createElement("div");
    panelBody.className = "timeline-body";
    var p = document.createElement("p");
    p.textContent = getBodyContent(event);
    panelBody.appendChild(p);
    var icon = document.createElement("span");
    icon.className = "fa fa-ban fa-2x";
    icon.style = "color: red; cursor: pointer; cursor: hand;";
    icon.onclick = function () {
        deleteEvent(event)
            .done(function (data) {
                console.log(data);
                var timeline = document.getElementById("timeline");
                timeline.removeChild(document.getElementById("eventEntry-" + unique_id));
                removeEventFromList(index);
            });
    };
    panelBody.appendChild(icon);
    return panelBody;
}


function getBodyContent(event) {
    var timeTook = event.endTime - event.startTime;
    switch (event.eventName) {
        case "stuck":
            return "Robot stuck for " + timeTook + " seconds," +
                " reason: " + event.reason + ". " +
                "Eventually, he " + (event.recovered ? "recovered" : "did not recover") + ".";
        case "cycle":
            return "started cycle " + ". " +
                "Event " + (event.failReason ? event.failReason : "Succeeded") + "." +
                " Took " + timeTook + " seconds, started on " + new Date(event.startTime * 1000).toISOString().substr(14, 5) + ".";
        case "place":
            return "Attempted placing " + event.type + " on " + event.location + ". " +
                "Event " + (event.failReason ? event.failReason : "Succeeded") + "." +
                " Took " + timeTook + " seconds, started on " + new Date(event.startTime * 1000).toISOString().substr(14, 5) + ".";
        case "climb":
            return "Attempted climbing " + (event.matchPart == "autonomous" ? "Down. " : "Up. ") +
                "Event " + (event.failReason ? event.failReason : "Succeeded") + "." +
                " Took " + timeTook + " seconds, started on " + new Date(event.startTime * 1000).toISOString().substr(14, 5) + ".";
        case "chassisFight":
            return (event.initiated ? "Initiated" : "Endured") + " fight. " +
                "They " + (event.status == 'Success' ? "won" : "lost") + " the fight." +
                "Fight took " + timeTook + " seconds, started on " + new Date(event.startTime * 1000).toISOString().substr(14, 5) + ".";
        case "pickup":
            return "Attempted Picking up " + event.type.toLowerCase() + " from the " + event.location.toLowerCase() + "." +
                "Event " + (event.failReason ? event.failReason : "Succeeded") + "." +
                "Took " + timeTook + " seconds, started on " + new Date(event.startTime * 1000).toISOString().substr(14, 5) + ".";
        case "comment":
            return "Scouter comment: " + event.content;
        default:
            return "No description could be provided";
    }
}


function deleteEvent(event) {
    console.log('Deleting event: ' + JSON.stringify(event));

    return $.ajax({
        type: 'DELETE',
        url: '/event',
        data: event
    });
}

function initializeTimeline(g_id, t_number) {
    console.log("g_id", g_id, "t_number", t_number);
    $.ajax({
        type: 'GET',
        url: '/event',
        data: {
            "gameId": g_id,
            "teamNumber": t_number
        },
        success: function (result) {
            for (var i = 0; i < result.length; i++) {
                addEventToTimeline(result[i]);
            }
        }
    });
}



function InsertEventToList(startTime) {
    for (var i = 0; i < events.length; i++) {
        if (startTime <= events[i]) {
            console.log('"sorted" events before splice: ' + events);
            console.log(typeof startTime, "is smaller than", typeof events[i]);
            events.splice(i, 0, startTime);
            console.log('"sorted" events: ' + events);
            return i;
        }
    }
    events.push(startTime);
    console.log('"sorted" events: ' + events);
    return events.length - 1;
}

function removeEventFromList(index) {
    events.splice(index, 1);
}
