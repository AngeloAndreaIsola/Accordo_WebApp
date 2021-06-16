var sid = localStorage.getItem('sid')

function Modal() {
    var listeners = [];
    var channels = []
    // To retrieve the data
    this.getData = function () {
        return channels;
    };

    this.saveChannels = function (response) {
        channels = []
        var json = JSON.parse(response);
        var channels_list = json.channels;

        channels_list.forEach(element => {
            var channel = {
                ctitle: element.ctitle,
                mine: element.mine
            }

            channels.push(channel)

        });
        notifyAllObservers()

        console.log("All channles save into model");
        console.log(channels);
    }

    // To change the data by any action
    this.modifyData = function (string) {
        // (posts.length === 1) ? posts.push(string): posts.unshift(string);
        // stateChanged = true;
        // notifyAllObservers();

        console.log("Aggiungendo : " + string);
        const channel = {
            id: channels.length > 0 ? channels[channels.length - 1].id + 1 : 1,
            text: string,
        }
        channels.push(channel)
        notifyAllObservers();
    };

    // Notifies all observers
    function notifyAllObservers() {
        var i;
        for (i = 0; i < listeners.length; i++) {
            listeners[i].notify();
        }
    }
    // Requires to register all observers
    this.addObserver = function (listener) {
        listeners.push(listener);
    };
}

// View is created with modal
function View(m) {
    this.modal = m;

    // The root element
    this.app = getElement('#root')

    // The title of the app
    // this.title = createElement('h1')
    // this.title.textContent = 'Posts'
    this.title = getElement('#title')

    // The form, with a [type="text"] input, and a submit button
    // this.form = createElement('form')
    this.form = getElement('#form')

    //The settings button
    this.settings = getElement('#settingsButton')

    //refresh button
    this.refresh = getElement('#refreshButton')

    // this.input = createElement('input')
    // this.input.type = 'text'
    // this.input.placeholder = 'Add post'
    // this.input.name = 'post'

    this.input = getElement('#inputChannel')

    // this.submitButton = createElement('button')
    // this.submitButton.textContent = 'Submit'
    this.submitButton = getElement('#addPostButton')

    // The visual representation of the todo list
    this.channelList = createElement('ul', 'channels-list')

    // Append the input and submit button to the form
    //this.form.append(this.input, this.submitButton)

    // Append the title, form, and todo list to the app
    this.app.append(this.channelList) //this.form, this.title,



    this.display = function () {
        var channels = this.modal.getData();

        // Delete all nodes
        while (this.channelList.firstChild) {
            this.channelList.removeChild(this.channelList.firstChild)
        }

        var i;
        for (i = 0; i < channels.length; i++) {
            //console.log("****************************************************");
            //console.log("Posts: " + posts[i].text);
            //console.log("****************************************************");

            const li = createElement('li')
            li.id = channels[i].id

            // The posts item text will be in a contenteditable span
            const span = createElement('span', 'channel')

            span.textContent = channels[i].ctitle
            li.append(span)

            // Append nodes to the post list
            this.channelList.append(li)
        }

        $('.channel').on("click", function (event) {
            event.preventDefault()
            console.log("Click on channel: " + $(this).text());


            var modelChannel = new ModelChannel($(this).text());
            var consoleView = new ViewChannel(modelChannel);
            var controllerChannel = new ControllerChannel(modelChannel, consoleView);
            //consoleView.pressButton();
            //consoleView.pressButton("JS dominates the web world");
            //consoleView.pressButton("JQuery is a useful library of JS");
            controllerChannel.getPosts()

            controllerChannel.updateView()

            showScreen('#channelScreen')

            event.stopPropagation()
        });

        this.settings.addEventListener('click', event => {
            event.preventDefault()

            //if (event.target && event.target.nodeName == "svg") {
            //handler()
            //}

            showscreen('#settingsScreen')
        })

    };
    //Adding external simulation of user sending input 
    this.pressButton = function (string) {
        // change the state of modal
        this.modal.modifyData(string);
    };
}


function Controller(m, v) {
    this.view = v;
    this.modal = m;
    this.modal.addObserver(this);


    // Updates the view
    this.updateView = function () {
        console.log("Updating view");
        this.view.display();
    };
    // When notifies by the modal send the request of update 
    this.notify = function () {
        // state has changed
        this.updateView();
    };

    this.getWall = function () {
        console.log("wall sid: " + sid + " this.sid= " + this.sid);
        comunicationController.getWall(sid, (response) => {
            console.log("Call %22getWall%22 succeded");

            //SALVA LISTA CANALI NEL MODEL
            m.saveChannels(response)

        })
    }

    v.form.addEventListener('submit', event => {
        event.preventDefault()

        console.log("Click on add channel");
        console.log("Channel input value: " + v.input.value);
        if (v.input.value && v.input.value.length < 20) {

            //m.modifyData(this.input.value)
            comunicationController.addChannel(sid, v.input.value, () => {
                console.log("Adding channel: " + v.input.value);
                console.log("Call %22addChannel%22 succeded");

                //this.refreshWallModel()
                v.input.value = ''
                this.getWall()
            })


        }else{
            console.error("Title too long");
        }
    })

    v.refresh.addEventListener('click', event =>{
        event.preventDefault()
        event.stopPropagation()

        this.getWall()
    })





}

// Create an element with an optional CSS class
function createElement(tag, className) {
    const element = document.createElement(tag)
    if (className) element.classList.add(className)

    return element
}

// Retrieve an element from the DOM
function getElement(selector) {
    const element = document.querySelector(selector)

    return element
}

function showScreen(idToShow) {
    $(".screen").hide()
    $(idToShow).show()
}