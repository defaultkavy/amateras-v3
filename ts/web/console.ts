const originUrl = window.location.protocol + '//' +  window.location.host + '/v3'
const sendButton = document.getElementById('send_button')
const messageBox = document.getElementById('message_box') as HTMLTextAreaElement
const guildSelector = document.getElementById('guild_selector') as HTMLSelectElement
const categorySelector = document.getElementById('category_selector') as HTMLSelectElement
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
        guildSelector.addEventListener('change', categoryBoxInit)
    }

    if (categorySelector) {
        categorySelector.addEventListener('change', channelBoxInit)
    }

    if (messageBox) {
        let virtualKeyboard = false
        messageBox.addEventListener('focus', (ev) => {
            window.addEventListener('resize', resize)
        })

        messageBox.addEventListener('blur', (ev) => {
            window.removeEventListener('resize', resize)
            virtualKeyboard = false
        })

        function resize() {
            virtualKeyboard = true
        }

        messageBox.addEventListener('keyup', (ev) => {

            if (!virtualKeyboard && ev.key === 'Enter') {
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

    await categoryBoxInit()

}

async function categoryBoxInit() {
    const data = await getDiscordData()
    const guild = data.guilds.find(guild => guild.id === guildSelector.selectedOptions[0].value)
    if (!guild) return
    while (categorySelector.firstChild) {
        categorySelector.removeChild(categorySelector.firstChild)
    }
    guild.categories.sort((a, b) => a.position - b.position)
    const selectOption = new Option
    selectOption.value = 'none'
    selectOption.innerText = 'Uncategory'
    categorySelector.appendChild(selectOption)
    for (const category of guild.categories) {
        const selectOption = new Option
        selectOption.value = category.id
        selectOption.innerText = category.name
        categorySelector.appendChild(selectOption)
    }

    await channelBoxInit()
}

async function channelBoxInit() {
    const data = await getDiscordData()
    const guild = data.guilds.find(guild => guild.id === guildSelector.selectedOptions[0].value)
    if (!guild) return
    const channels = guild.channels.filter(channel => {
        if (categorySelector.selectedOptions[0].value === 'none') {
            return !channel.parent
        } else {
            return channel.parent === categorySelector.selectedOptions[0].value
        }
    })
    channels.sort((a, b) => {
        if (a.position === undefined) return -1
        if (b.position === undefined) return 1
        return a.position - b.position
    })
    while (channelSelector.firstChild) {
        channelSelector.removeChild(channelSelector.firstChild)
    }
    for (const channel of channels) {
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
    channels: DiscordChannel[],
    categories: {
        id: string,
        name: string,
        position: number
    }[]
}

interface DiscordChannel {
    id: string,
    name: string,
    parent: string | null
    position: number | undefined
}