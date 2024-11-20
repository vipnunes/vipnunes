var dev_mode = false;

// dom content loaded
document.addEventListener("DOMContentLoaded", () => {

    // Development Mode
    if (dev_mode) {
        console.log("--Development Mode--");
        var BASE_URL = 'http://127.0.0.1:5000'
        devmode = document.getElementById("devmode");
        devmode.style.display = "block";
    }
    else{
        console.log("--Production--");
        var BASE_URL = 'https://clipboard-snyx.onrender.com'
    }

    // DARK MODE
    // dark mode toggle
    const toggle = document.getElementById('dark-mode-toggle');

    function toggleDarkMode(state) {
        document.documentElement.classList.toggle("dark-mode", state);
    }

    // check preference
    var preference = localStorage.getItem("dark-mode");
    if (preference === null) {
        preference = window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    console.log(preference);

    // if preference is true
    if (preference == 'true' || preference == true) {
        toggle.checked = true;
        dark();
    } else {
        light();
    }

    // when the toggle is clicked
    toggle.addEventListener('click', function() {
        // if the toggle is checked
        if (toggle.checked) {
            console.log('checked');
            dark();
        } else {
            console.log('unchecked');
            light();
        }
        save_preference();
        
    });


    function dark() {

        toggleDarkMode(true);

        // change the logo
        const logo = document.querySelector("#logo");
        logo.src = "assets/logo-dark.png";

        // change the github
        const github = document.querySelector("#github-logo");
        github.src = "assets/github-dark.png";

        // change the copy to clipboard icon
        const copy = document.querySelectorAll(".copy-to-clipboard-img");
        copy.forEach(element => {
            element.src = "assets/clip-dark.png";
        });


        
    };

    function light(){
        toggleDarkMode(false);

        // change the logo
        const logo = document.querySelector("#logo");
        logo.src = "assets/logo.png";

        // change the github
        const github = document.querySelector("#github-logo");
        github.src = "assets/github.png";

        // change the copy to clipboard icon
        const copy = document.querySelectorAll(".copy-to-clipboard-img");
        copy.forEach(element => {
            element.src = "assets/clip.png";
        });

        

    }

    save_preference = () => {
        localStorage.setItem("dark-mode", toggle.checked);
    };



    // INPUT

    // adjust textarea based on content size
    const textarea = document.querySelector("#text");

    // continuous check for textarea content size
    textarea.addEventListener("input", () => {

        // get the no of lines
        const lines = textarea.value.split("\n").length;

        // get the no of characters
        const characters = textarea.value.length;

        console.log(characters);

        // check if the textarea is empty or has only spaces and new lines or has only one line
        if ((textarea.value.trim() === "" || lines === 1 || textarea.value.trim() === "\n") && characters < 100) {
            textarea.style.height = "6rem";
            console.log("empty");
        }
        // check if the textarea has more than 10 lines
        else if (lines > 10 || characters > 800) {
            textarea.style.height = "16rem";
            console.log("more than 10");
        }
        else{
            var newHeight = 0;
            
            characterLines = Math.floor(characters / 80);
            

            newHeight = characterLines + lines;
            

            console.log("more than 1");

            // compute the new height
            newHeight += 6;

            // cap the height at 16rem
            if (newHeight > 16) {
                newHeight = 16;
            }

            // set the height of the textarea
            textarea.style.height = `${newHeight}rem`;
        }
    });

    // check on delete key press
    textarea.addEventListener("keydown", (e) => {
        // check if the key pressed is the delete key
        if (e.keyCode === 8) {

            // get the no of lines
            const lines = textarea.value.split("\n").length;

            // check if the textarea is empty or has only spaces and new lines or has only one line
            if (textarea.value.trim() === "" || lines === 1 || textarea.value.trim() === "\n" || textarea.value.trim() === "\n\n" || textarea.value.trim() === "\n\n\n") {
                textarea.style.height = "6rem";
                return;
            }
            
            // compute the new height
            const newLines = lines + 6;
            // set the height of the textarea
            textarea.style.height = `${newLines}rem`;
        }
    });




    // ADD CLIPBOARDS
    // add a clipboard to the api
    const formButton = document.querySelector("#submit");
    formButton.addEventListener("click", (e) => {
        e.preventDefault();

        // get the form
        const content = document.querySelector("#text");

        // check if the form is empty
        if (content.value.trim() === "") {
            alert("Please enter some text");
        }
        else{
            // data to send to api
            const data = {
                "body": content.value.trim()
            };
            
            // post the clipboard to the api
            fetch(BASE_URL+ "/api", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            })
            .then(response => {
                console.log(response);
            })
            .catch(error => {
                console.log(error);
            });

            // clear the form
            content.value = "";

            // add the clipboard to the list
            createClipboardListItem(data.body);

        }
        
    });




    // GET CLIPBOARDS

    // get existing clipboards from api and return them
    const getClipboards = async () => {

        let headers = new Headers();
        headers.append('Access-Control-Allow-Origin', '*');
        headers.append('Access-Control-Allow-Credentials', 'true');
        headers.append('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT');
        headers.append('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
        
        const response = await fetch(BASE_URL+"/api", {method: 'GET', headers: headers});
        const data = await response.json();
        return data;
    };

    getClipboards().then(data => {
        var clipboards = data;
        var clips = Object.values(clipboards);
        // get keys
        var keys = Object.keys(clipboards);

        // console.log(keys, clips);


        // loop through the clipboards and add them to the list
        for (let i = 0; i < clips.length; i++) {
            
            // check if clip[i] is not null
            if (clips[i] === null) {
                continue;
            }

            console.log(`${keys[i]}: ${clips[i]}`);
        

            // add the clips to the list
            createClipboardListItem(clips[i], keys[i]);


        }
        // remove loading list item
        const loading = document.querySelector("#loading");
        loading.remove();

    });

    // create a clipboard list item
    const createClipboardListItem = (clipboard, id) => {
        // create the list item
        const listItem = document.createElement("li");
        listItem.className = "list-group-item d-flex justify-content-between align-items-center";
        

        // create a xmp tag
        const pre = document.createElement("pre");
        pre.innerText = clipboard;
        pre.className = "pre mt-2 mb-2";
        // allow overflow into next line
        pre.style.whiteSpace = "pre-wrap";
        listItem.appendChild(pre);
        

        // add hidden p tag to list item
        const hidden = document.createElement("p");
        hidden.className = "hidden";
        hidden.style.display = "none";
        hidden.innerText = id;

        // add hidden p tag to list item
        listItem.appendChild(hidden);

        // add button to list item
        const button = document.createElement("button");
        button.className = "badge rounded-pill copy-to-clipboard-button";

        // add img to span
        const img = document.createElement("img");

        // check for dark mode
        const toggle = document.querySelector("#dark-mode-toggle").checked;
        if (toggle) {
            img.src = "assets/clip-dark.png";
        } else {
            img.src = "assets/clip.png";
        }
        img.className = "img-fluid";
        img.alt = "copy";
        img.className = "copy-to-clipboard-img";
        button.appendChild(img);

        // add span to list item
        listItem.appendChild(button);

        // add list item to list
        const clipboardListItem = document.querySelector(".list-group");
        clipboardListItem.prepend(listItem);


        return listItem;
    }



    // COPY TO CLIPBOARD
    document.addEventListener("click", (e) => {
        // check if the target is the copy button by class containing copy-to-clipboard
        if (e.target.classList.contains("copy-to-clipboard-button") ) {
            
            // get the clipboard text
            const clipboardText = e.target.parentElement.innerText;

            // save to clipboard
            navigator.clipboard.writeText(clipboardText).then(() => {
            });

            const clip_html = e.target.parentElement.innerHTML;
            
            const parent = e.target.parentElement;

            // change the text to copied
            e.target.parentElement.innerText = "Copied!";
            setTimeout(function () {
                parent.innerHTML = clip_html;
            }, 800); 

        }
        else if (e.target.classList.contains("copy-to-clipboard-img")) {

            // get the clipboard text
            const clipboardText = e.target.parentElement.parentElement.innerText;

            // save to clipboard
            navigator.clipboard.writeText(clipboardText).then(() => {
                console.log("copied to clipboard");
            });
            
            const clip_html = e.target.parentElement.parentElement.innerHTML;

            const parent = e.target.parentElement.parentElement;
            
            // change the text to copied
            e.target.parentElement.parentElement.innerText = "Copied!";
            setTimeout(function () {
                parent.innerHTML = clip_html;
            }
            , 800);

        }

    });




        
    


});
