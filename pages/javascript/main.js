class main {
    constructor() {
        // ===== STATE =====
        this.bots = []

        // ===== ELEMENTS =====
        this.search = document.getElementById("searchBox")
        this.botList = document.querySelector(".botList")

        // ===== INITIAL SETUP =====
        this.loadBots()

        // ===== EVENT LISTENERS =====
        this.search.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                e.preventDefault()
                this.searchBots()
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
        this.botList.innerHTML = ""

        if (!bots || bots.length === 0) {
            this.botList.textContent = "No bots found."
            return
        }

        console.log("render these bots:", bots)
    }

    searchBots() {
        const searchValue = this.search.value.trim().toLowerCase()

        console.log("searching:", searchValue)

        // We will filter bots here after rendering works
    }
}

const app = new main()