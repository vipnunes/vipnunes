addEventListener("DOMContentLoaded", function() {

    // check for form submission
    document.getElementById("qr-form").addEventListener("submit", function(e) {
        // prevent default form submission
        e.preventDefault();

        var modal = document.getElementById("myModal");
        var span = document.getElementsByClassName("close")[0];

        // get form data
        var formdata = new FormData(this);

        var img_format = formdata.get("format");
        console.log(img_format);

        // convert colors to hex
        formdata.set("bgcolor", formdata.get("bgcolor").replace("#", ""));
        formdata.set("color", formdata.get("color").replace("#", ""));

        // form url
        var url = "https://api.qrserver.com/v1/create-qr-code/";

        // fetch url using parameters
        var img_src= url + "?" + new URLSearchParams(formdata);

        console.log(img_src);

        // remove previous qr result
        document.getElementById("qr-result").innerHTML = "";

        if (img_format == "eps") {
            // download automatically
            var a = document.createElement("a");
            a.href = img_src;
            a.download = "qr-code.eps";
            a.click();
            alert("QR Code downloaded as qrcode.eps");
        }
        else{
            var img = document.createElement("img");
            img.src = img_src;
            img.alt = "QR Code";
            img.className = "img-fluid";
            img.id = "qr-img";
            document.getElementById("qr-result").appendChild(img);
            // When the user clicks on the button, open the modal
            modal.style.display = "block";
        }
        

    
        // When the user clicks on <span> (x), close the modal
        span.onclick = function () {
            modal.style.display = "none";
        };
    
        // When the user clicks anywhere outside of the modal, close it
        window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
        };
    });



});