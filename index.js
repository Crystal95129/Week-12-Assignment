//class of Camp, added Image URL to upgrade the project using MockAPI prefixed data support. 

class Camp {
    constructor(name, imageURL){
        this.name = name;
        this.campImage = imageURL
        this.sessions = [];
    }

    addSession(name, age){
        this.sessions.push(new Session(name, age));
    }
}

// class of Session
class Session {
    constructor(name, age){
        this.name = name;
        this.age = age;
    }
}


// class for camp functions like display camps, add camps,create camp,delete camp. 
class CampService{
    static url = 'https://6698482702f3150fb6708748.mockapi.io/Promineo_Tech_API/camps';

    static getAllCamps(){
        return $.get(this.url);
    }

    static getCamp(id) {
        return $.get(this.url + `/${id}`);
    }

    static createCamp(camp){
        return $.post(this.url, camp);
    }

    static updateCamp(camp, newSession) {
// console.log("Updating camp with new session...", camp, "new session data...", newSession);
    let campId = camp._id

        return $.ajax({
            url: this.url + `/${campId}/session`,
            dataType: 'json',
            data: JSON.stringify(newSession),
            contentType: 'application/json',
            type: 'POST'
        });
    }

    /*
    deleting a session takes the camp id and the id of the session
    ie. camp and sessionToDelete
    */
    static deleteSession(camp, sessionToDelete) {
// console.log("Updating camp with new session...", camp, "new session data...", sessionToDelete);to test the delete function for session,testing.
        let campId = camp._id

        // CTRL + / will create a single line comment.
                return $.ajax({
                    url: this.url + `/${campId}/session/${sessionToDelete}`,
                    dataType: 'json',
                    // data: JSON.stringify(sessionToDelete),
                    contentType: 'application/json',
                    type: 'DELETE'
                });
            }

    static deleteCamp(id){
        return $.ajax({
            url: this.url + `/${id}`,
            type: 'DELETE'
        });
    }
}


//DOM Manager to call up JQuery functions.

class DOMManager {
    static camps;

    static getAllCamps(){
        CampService.getAllCamps().then(camps => this.render(camps));
    }

    static createCamp(name, campImage){
        CampService.createCamp(new Camp(name, campImage))
        .then(() => {
            return CampService.getAllCamps();
        })
        .then((camps) => this.render(camps));
    }

    static deleteCamp(id){

        CampService.deleteCamp(id)
        .then(()=> {
            return CampService.getAllCamps();
        })
        .then((camps) => this.render(camps));
    }

    static addSession(id){
// console.log("adding a session...", id); to display added session, testing. 

        for (let camp of this.camps){
            if(camp._id == id){
                camp.sessions.push(new Session($(`#${camp._id}-session-name`).val(), $(`#${camp._id}-session-age`).val()));
                
                let newSessionData = {
                    name: $(`#${camp._id}-session-name`).val(),
                    age: $(`#${camp._id}-session-age`).val()
                }

                // console.log("Camp Sessions:", camp);
                
                CampService.updateCamp(camp, newSessionData) 
                .then(() => {
                    return CampService.getAllCamps();
                })
                .then((camps) => this.render(camps));
            }
        }
    }

    static deleteSession(campId, sessionId) {
// console.log("Deleting a session....", campId, sessionId);

        for (let camp of this.camps) {
            if (camp._id == campId) {
                for (let session of camp.sessions){
                    console.log("Session:", session);
                    if (session.sessionId == sessionId) {
                        camp.sessions.splice(camp.sessions.indexOf(session), 1);
                        CampService.deleteSession(camp, sessionId)
                        .then(()=> {
                            return CampService.getAllCamps();
                        })
                        .then((camps) => this.render(camps));
                    }
                }
            }
        }
    }

    static render(camps){
        this.camps = camps;
        $('#app').empty();
        for(let camp of camps) {
// console.log("Camp:", camp);

            $('#app').prepend(
                `<div id="${camp._id}" class="card">
                    <div class="card-header">
                        <h2>${camp.name}</h2>
                        <img src=${camp.campImage} style="width: 25%;"/>
                        <button class="btn btn-danger" onclick="DOMManager.deleteCamp('${camp._id}')">Delete</button>
                    </div><br>
                    <div class="card-body">
                        <div class="card">
                            <div class="row">
                                <h4>Add New Session</h4>
                                <div class="col-sm">
                                 <input type="text" id="${camp._id}-session-name" class="form-control" placeholder="Session Name">
                                </div>
                                <div class="col-sm">
                                <input type="text" id="${camp._id}-session-age" class="form-control" placeholder="Session Age">
                                </div>
                            </div>
                            <button id="${camp._id}-new-session" onclick="DOMManager.addSession('${camp._id}')" class="btn btn-primary form-control">Add</button>
                        </div>
                    </div>
                </div><br>`
            );
            for (let session of camp.sessions) {
// console.log("Session:", session);

                $(`#${camp._id}`).find('.card-body').append(
                    `<p>
                    <span id="name-${camp._id}"><strong>Name: </strong> ${session.name}</span>
                    <span id="age-${camp._id}"><strong>Age: </strong> ${session.age}</span>
                    <button class="btn btn-danger" onclick="DOMManager.deleteSession('${camp._id}', '${session.sessionId}')">Delete Session</button>
                    `
                )
            }
        }
    }
}

$('#create-new-camp').on("click", () => {
    //when creating a camp, takes in with jquery val() method a name and image url
    DOMManager.createCamp($('#new-camp-name').val(), $('#camp-image-url').val());
    $('#new-camp-name').val('');
});

DOMManager.getAllCamps(); 