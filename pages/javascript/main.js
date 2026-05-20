class main {
    constructor() {
        // ===== STATE =====
        this.bots = []

        // ===== ELEMENTS =====
        this.search = document.getElementById("searchBox")
        this.botwrapper = document.getElementById("bot-wrapper")

        // ===== INITIAL SETUP =====
        this.loadBots()

        // ===== EVENT LISTENERS =====
        this.search.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                if (this.search.value) {
                    e.preventDefault()
                    this.searchBots()
                } else {
                    if (this.search.value === "") {
                        this.renderBots(this.bots)
                    }
                }
            }
        })
    }

    loadBots() {
        fetch("http://localhost:3000/bots")
            .then(res => res.json())
            .then(data => {
                console.log("bots from backend:", data)

                this.bots = data.bots

                this.renderBots(this.bots)
            })
            .catch(err => {
                console.error("Failed to load bots:", err)
            })
    }

    renderBots(bots) {
        this.botwrapper.innerHTML = ""

        if (!bots || bots.length === 0) {
            this.botList.textContent = "No bots found."
            return
        }

        // console.log("render these bots:", bots)

        bots.forEach(bot => {
            const botCard = document.createElement("div")

            botCard.classList.add("bot-card")

            const cardNameBar = document.createElement("div")

            cardNameBar.classList.add("card-name-bar")

            const title = document.createElement("strong")

            title.textContent = bot.name

            cardNameBar.appendChild(title)

            botCard.appendChild(cardNameBar)

            const image = document.createElement("img")

            image.classList.add("bot-image")

            image.src = bot.image

            botCard.appendChild(image)

            const bot_tags = document.createElement("div")

            bot_tags.classList.add("card-tags")

            const tags = bot.tags || []

            tags.forEach(tag => {
                const tag_item = document.createElement("span")

                tag_item.textContent = tag

                tag_item.classList.add("tag")

                bot_tags.appendChild(tag_item)

                botCard.appendChild(bot_tags)
            })


            this.botwrapper.appendChild(botCard)
        });
    }

    searchBots() {
        const searchValue = this.search.value.trim().toLowerCase()

        console.log("searching:", searchValue)

        // We will filter bots here after rendering works
    }
}

const app = new main()