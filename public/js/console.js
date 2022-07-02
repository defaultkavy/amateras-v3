import { Client } from "./Client";
new Client();
// import { DiscordMessageOptions } from "./_MessageBox"
// export = {}
// const module = {}
// const originUrl = window.location.protocol + '//' +  window.location.host + '/v3'
// const sendButton = document.getElementById('send_button')
// const replyBox = document.getElementById('reply_box') as HTMLInputElement
// const messageInput = document.getElementById('message_box') as HTMLTextAreaElement
// const guildSelector = document.getElementById('guild_selector') as HTMLSelectElement
// const categorySelector = document.getElementById('category_selector') as HTMLSelectElement
// const channelSelector = document.getElementById('channel_selector') as HTMLSelectElement
// const statusText = document.getElementById('status') as HTMLSpanElement
// const messagesWrapper = document.querySelector('messages') as HTMLElement
// const replyClearButton = document.querySelector('#clear_button') as HTMLSpanElement
// const app = document.getElementById('amateras_console') as HTMLDivElement
// let lastmessage = ''
// let reply = false
// document.body.style.backgroundColor = '#36393f'
// init()
// async function init() {
//     eventHandler()
//     await contentInit()
//     connect()
// }
// function connect() {
//     const sse = new EventSource('/stream')
//     sse.addEventListener('message', (ev) => {
//         const data = JSON.parse(ev.data)
//         if (data.type === 'update') {
//             messagesWrapperInit()
//         }
//     })
// }
// function eventHandler() {
//     if (sendButton && messageInput) {
//         sendButton.addEventListener('click', send)
//     }
//     if (guildSelector) {
//         guildSelector.addEventListener('change', categoryBoxInit)
//     }
//     if (categorySelector) {
//         categorySelector.addEventListener('change', channelBoxInit)
//     }
//     if (channelSelector) {
//         channelSelector.addEventListener('change', messagesWrapperInit)
//     }
//     if (messageInput) {
//         let virtualKeyboard = false
//         messageInput.addEventListener('focus', (ev) => {
//             window.addEventListener('resize', resize)
//         })
//         messageInput.addEventListener('blur', (ev) => {
//             window.removeEventListener('resize', resize)
//             virtualKeyboard = false
//         })
//         function resize() {
//             virtualKeyboard = true
//         }
//         messageInput.addEventListener('keyup', (ev) => {
//             if (!virtualKeyboard && ev.key === 'Enter') {
//                 if (!ev.shiftKey) send()
//             }
//         })
//     }
//     if (replyBox) {
//         replyBox.addEventListener('blur', replyBoxCheck)
//     }
//     if (replyClearButton) {
//         replyClearButton.addEventListener('click', (ev) => {
//             replyBox.value = ''
//             replyBoxCheck()
//         })
//     }
// }
// function replyBoxCheck() {
//     if (replyBox.value !== '') {
//         if (!replyBox.value.match(/(https?:\/\/)?(www\.)?(discord.com)\/channels\/[0-9]\d+\/[0-9]\d+\/[0-9]\d+/)) {
//             replyBox.style.borderColor = '#ff0000'
//             reply = false
//         } else {
//             replyBox.style.borderColor = 'lime'
//             reply = true
//         }
//     } else {
//         replyBox.style.borderColor = 'grey'
//         reply = false
//     }
// }
// async function getDiscordData() {
//     return await (await fetch(originUrl + '/console-data')).json() as DiscordData
// }
// async function getChannelMessages(guildId: string, channelId: string) {
//     return await (await fetch(originUrl + '/console-data' + `/${guildId}/${channelId}/messages`)).json() as DiscordChannelMessages
// }
// async function contentInit() {
//     const data = await getDiscordData()
//     if (guildSelector && channelSelector) {
//         for (const guild of data.guilds) {
//             const selectOption = new Option
//             selectOption.value = guild.id
//             selectOption.innerText = guild.name
//             guildSelector.appendChild(selectOption)
//             selectOption.addEventListener('select', (ev) => {
//             })
//         }
//     }
//     await categoryBoxInit()
// }
// async function categoryBoxInit() {
//     const data = await getDiscordData()
//     const guild = data.guilds.find(guild => guild.id === guildSelector.selectedOptions[0].value)
//     if (!guild) return
//     while (categorySelector.firstChild) {
//         categorySelector.removeChild(categorySelector.firstChild)
//     }
//     guild.categories.sort((a, b) => a.position - b.position)
//     const selectOption = new Option
//     selectOption.value = 'none'
//     selectOption.innerText = 'Uncategory'
//     categorySelector.appendChild(selectOption)
//     for (const category of guild.categories) {
//         const selectOption = new Option
//         selectOption.value = category.id
//         selectOption.innerText = category.name
//         categorySelector.appendChild(selectOption)
//     }
//     await channelBoxInit()
// }
// async function channelBoxInit() {
//     const data = await getDiscordData()
//     const guild = data.guilds.find(guild => guild.id === guildSelector.selectedOptions[0].value)
//     if (!guild) return
//     const channels = guild.channels.filter(channel => {
//         if (categorySelector.selectedOptions[0].value === 'none') {
//             return !channel.parent
//         } else {
//             return channel.parent === categorySelector.selectedOptions[0].value
//         }
//     })
//     channels.sort((a, b) => {
//         if (a.position === undefined) return -1
//         if (b.position === undefined) return 1
//         return a.position - b.position
//     })
//     while (channelSelector.firstChild) {
//         channelSelector.removeChild(channelSelector.firstChild)
//     }
//     for (const channel of channels) {
//         const selectOption = new Option
//         selectOption.value = channel.id
//         selectOption.innerText = channel.name
//         channelSelector.appendChild(selectOption)
//     }
//     messagesWrapperInit()
// }
// async function messagesWrapperInit() {
//     replyBox.value = ''
//     replyBoxCheck()
//     if (!messagesWrapper) return
//     const data = await getChannelMessages(guildSelector.value, channelSelector.value)
//     data.messages.sort((a, b) => a.timestamps - b.timestamps)
//     if (lastmessage === data.messages[data.messages.length - 1].id) return
//     lastmessage = data.messages[data.messages.length - 1].id
//     while (messagesWrapper.firstChild) {
//         messagesWrapper.removeChild(messagesWrapper.firstChild)
//     }
//     for (const message of data.messages) {
//         const messageBox = new Message(message)
//         messagesWrapper.appendChild(messageBox.node)
//     }
//     messagesWrapper.scrollTop = messagesWrapper.scrollHeight
// }
// async function send() {
//     if (messageInput.value === '') return
//     const content = messageInput.value
//     messageInput.value = ''
//     const status = await post(originUrl + '/console', {
//         guild: guildSelector.value,
//         channel: channelSelector.value,
//         content: content,
//         reply: reply ? replyBox.value : undefined
//     })
//     if (statusText) {
//         statusText.innerText = status as string
//         setTimeout(() => {
//             statusText.innerText = ''
//         }, 2000);
//     }
// }
// async function post(host: string, data: {}) {
//     var xhttp = new XMLHttpRequest();
//     return new Promise(resolve => {
//         xhttp.onreadystatechange = function() {
//             if (this.status === 404) {
//             }
//             if (this.readyState === 4 && this.status == 200) {
//                 resolve(this.responseText);
//             }
//         };
//         xhttp.open("POST", host, true);
//         xhttp.setRequestHeader("Content-Type", "application/json");
//         xhttp.send(JSON.stringify(data));
//     })
// }
// interface DiscordData {
//     guilds: DiscordGuild[]
// }
// interface DiscordGuild {
//     id: string,
//     name: string,
//     channels: DiscordChannel[],
//     categories: {
//         id: string,
//         name: string,
//         position: number
//     }[]
// }
// interface DiscordChannel {
//     id: string,
//     name: string,
//     parent: string | null
//     position: number | undefined
// }
// interface DiscordChannelMessages {
//     channel: string,
//     guild: string,
//     messages: DiscordMessageOptions[]
// }
//# sourceMappingURL=console.js.map