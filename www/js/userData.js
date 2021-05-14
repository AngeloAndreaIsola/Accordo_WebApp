var userData = {
    sid: null,
    uid: null, 
    username: null, 
    picture: null, 
    pversion: null,

    saveSid: function (sid){
        this.sid = sid

        localStorage.setItem("sid", sid);

        console.log("USERDATA: sid saved!");
        console.log("USERDATA: "+this.sid);
    },

    saveUserData: function(uid, username, picture, pversion){
        this.uid = uid
        this.username = username
        this.picture=picture
        this.pversion=pversion

        localStorage.setItem("uid", uid);
        localStorage.setItem("username", username);
        localStorage.setItem("picture", picture);
        localStorage.setItem("pversion", pversion);

        console.log("USERDATA: profile saved!");
    },

    loadUserData: function () {
        this.sid = localStorage.getItem("sid"),
        this.uid= localStorage.getItem("uid"),
        this.username= localStorage.getItem("username"),
        this.picture= localStorage.getItem("picture"),
        this.pversion=localStorage.getItem("pversion")
    }
}