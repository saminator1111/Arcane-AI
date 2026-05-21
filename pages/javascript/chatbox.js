/*
CHAT PAGE TODO

HTML:
[✔] Chat container exists
[✔] Text input exists
[✔] Send button exists
[✔] Home link exists

[ ] Replace <style ref="style.css"></style> with real stylesheet link
[ ] Add global nav
[ ] Add chatbox.css
[ ] Add bot info header area
[ ] Add bot avatar/name area
[ ] Add message list container styling
[ ] Add user message styling
[ ] Add bot message styling
[ ] Add input bar styling
[ ] Add mobile layout
[ ] Add loading/typing indicator
[ ] Add settings drawer/button inside chat later

JS:
[✔] Gets input/button/chat elements
[✔] Click sends message
[✔] Enter sends message
[✔] Fetches /chat
[✔] Appends user message

[ ] Prevent sending empty messages
[ ] Disable send button while waiting
[ ] Append bot reply from backend
[ ] Show loading/typing bubble
[ ] Catch fetch errors
[ ] Auto-scroll chat to bottom
[ ] Read bot id from URL
[ ] Fetch bot data by id
[ ] Load bot first message
[ ] Store chat history locally or backend later
[ ] Send bot id with chat request
[ ] Send current persona later
[ ] Send custom chat settings later
[ ] Add reopen previous chats later
[ ] Add message timestamps later
[ ] Add markdown/basic formatting later
*/


const BASE_URL = "https://clinton-indicate-kept-nottingham.trycloudflare.com"

class chatbox {
    constructor() {

        this.state = {
            messageSent: false
        }

        this.input = document.getElementById("textinput");
        this.button = document.getElementById("sendBtn");
        this.chat = document.getElementById("chat")

        this.button.addEventListener("click", () => {this.sendMessage();})
        this.input.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                e.preventDefault()
                this.sendMessage()
            }
        })

    }

    sendMessage() {
        fetch(`${BASE_URL}/chat`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: this.input.value
            })
        })
        .then(res => res.json())
        .then(data => {
            console.log(data)
            let value = this.input.value
            this.loadMessage(value)
            this.input.value = ""
        });
    }

    loadMessage(message) {
        const div = document.createElement("div");
        div.innerText = message
        this.chat.appendChild(div)
    };
}

const app = new chatbox()