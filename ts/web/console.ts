
const sendButton = document.getElementById('send_button')
if (sendButton) {
    sendButton.addEventListener('click', (ev) => {
        post(window.location.protocol + '//' +  window.location.hostname + ':30/amateras-console', {
            channel: '',
            content: ''
        })
    })
}

async function post(host: string, data: {}) {
    var xhttp = new XMLHttpRequest();
    return new Promise(resolve => {
        xhttp.onreadystatechange = function() {
            if (this.status === 404) {
                
            }
            if (this.readyState === 4 && this.status == 200) {
                resolve(this.responseText);
            }
        };
        xhttp.open("POST", host, true);
        xhttp.setRequestHeader("Content-Type", "application/json");
        xhttp.send(JSON.stringify(data));
    })
}