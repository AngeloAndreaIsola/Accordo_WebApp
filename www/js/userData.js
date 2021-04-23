var userData = {
    sid: null,
    uid: null, 
    username: null, 
    picture: null, 
    pversion: null,

    saveSid: function (sid){
        this.sid = sid

        console.log("USERDATA: sid saved!");
        console.log("USERDATA: "+this.sid);
    },

    saveUserData: function(uid, username, picture, pversion){
        this.uid = uid
        this.username = username
        this.picture=picture
        this.pversion=pversion

        console.log("USERDATA: profile saved!");
    }
}