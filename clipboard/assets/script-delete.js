addEventListener("DOMContentLoaded", () => {


    // DELETE CLIPBOARDS
    // listen of the form submit to delete
    const formButton = document.querySelector("#submit");
    formButton.addEventListener("click", (e) => {
        e.preventDefault();

        // get the form
        const id = document.querySelector("#number");

        // check if id is empty
        if (id.value.trim() === "") {
            alert("Please enter a number");
        }
        // check if id is a number
        else{
            // post id to api using get
            let url = `https://clipboard-snyx.onrender.com/delete/${id.value.trim()}`;
            // let url = `http://127.0.0.1:5000/delete/${id.value.trim()}`;
            
            let headers = new Headers();
            headers.append('Access-Control-Allow-Origin', '*');
            headers.append('Access-Control-Allow-Credentials', 'true');
            headers.append('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT');
            headers.append('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
            
            fetch (url, {method: 'GET', headers: headers})
            .then(response => response.json())
            .then(data => {
                console.log(data);
                alert(data.msg);
                // on alert close reload the page
                window.location.reload();
            })
            
            
        }
        // clear the form
        id.value = "";

        

    });





    // GET CLIPBOARDS
    // get existing clipboards from api and return them
    const getClipboards = async () => {

        let headers = new Headers();
        headers.append('Access-Control-Allow-Origin', '*');
        headers.append('Access-Control-Allow-Credentials', 'true');
        headers.append('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT');
        headers.append('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
        
        // Production
        const response = await fetch("https://clipboard-snyx.onrender.com/api", {method: 'GET', headers: headers});
        // Development
        // const response = await fetch("http://127.0.0.1:5000/api", {method: 'GET', headers: headers});
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
        // allow overflow into next line
        pre.style.whiteSpace = "pre-wrap";
        listItem.appendChild(pre);
        

        // add hidden p tag to list item
        const hidden = document.createElement("p");
        hidden.className = "hidden";
        hidden.innerText = id;

        // add hidden p tag to list item
        listItem.appendChild(hidden);

        

        // add list item to list
        const clipboardListItem = document.querySelector(".list-group");
        clipboardListItem.prepend(listItem);


        return listItem;
    }



});