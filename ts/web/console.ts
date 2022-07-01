const originUrl = window.location.protocol + '//' +  window.location.hostname + ':' + '30'
const sendButton = document.getElementById('send_button')
const messageBox = document.getElementById('message_box') as HTMLTextAreaElement
const guildSelector = document.getElementById('guild_selector') as HTMLSelectElement
const channelSelector = document.getElementById('channel_selector') as HTMLSelectElement
const statusText = document.getElementById('status') as HTMLSpanElement
init()

async function init() {
    eventHandler()
    await contentInit()
}

function eventHandler() {
    if (sendButton && messageBox) {
        sendButton.addEventListener('click', send)
    }

    if (guildSelector) {
        guildSelector.addEventListener('change', channelBoxInit)
    }

    if (messageBox) {
        messageBox.addEventListener('keyup', (ev) => {
            if (ev.key === 'Enter') {
                if (!ev.shiftKey) send()
            }
        })
    }
}

async function getDiscordData() {
    return await (await fetch(originUrl + '/console-data')).json() as DiscordData
    
}

async function contentInit() {
    const data = await getDiscordData()
    console.debug(data)
    if (guildSelector && channelSelector) {
        for (const guild of data.guilds) {
            const selectOption = new Option
            selectOption.value = guild.id
            selectOption.innerText = guild.name
            guildSelector.appendChild(selectOption)

            selectOption.addEventListener('select', (ev) => {
            })
        }
    }

    channelBoxInit()

}

async function channelBoxInit() {
    const data = await getDiscordData()
    const guild = data.guilds.find(guild => guild.id === guildSelector.selectedOptions[0].value)
    if (!guild) return
    while (channelSelector.firstChild) {
        channelSelector.removeChild(channelSelector.firstChild)
    }
    for (const channel of guild.channels) {
        const selectOption = new Option
        selectOption.value = channel.id
        selectOption.innerText = channel.name
        channelSelector.appendChild(selectOption)
    }
}

async function send() {
    if (messageBox.value === '') return
    const content = messageBox.value
    messageBox.value = ''
    const status = await post(originUrl + '/console', {
        guild: guildSelector.value,
        channel: channelSelector.value,
        content: content
    })

    if (statusText) {
        statusText.innerText = status as string
        setTimeout(() => {
            statusText.innerText = ''
        }, 2000);
    }
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

interface DiscordData {
    guilds: DiscordGuild[]
}

interface DiscordGuild {
    id: string,
    name: string,
    channels: DiscordChannel[]
}

interface DiscordChannel {
    id: string,
    name: string
}