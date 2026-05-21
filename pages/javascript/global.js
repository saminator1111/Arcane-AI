const profileBtn = document.getElementById("profile-btn")
const profileMenu = document.getElementById("profile-menu")
const BASE_URL = "https://clinton-indicate-kept-nottingham.trycloudflare.com"

const adminProfiles = [1]

// toggle menu
profileBtn.addEventListener("click", (e) => {
    e.stopPropagation() // prevents instant close
    profileMenu.classList.toggle("hidden")
})

// click outside closes it
document.addEventListener("click", () => {
    profileMenu.classList.add("hidden")
})

// prevent clicking inside from closing
profileMenu.addEventListener("click", (e) => {
    e.stopPropagation()
})

function initialize() {
    fetch(`${BASE_URL}/user`)
        .then(res => res.json())
        .then(data => {
            console.log("user data loaded.")

            user = data.user

            if (data.user == null || !data.user.username) {
                console.log("no user logged in.")
                return
            }
        })

        fetch(`${BASE_URL}/bots`)
            .then(res => res.json())
            .then(data => {
                console.log("bots from backend:", data)
                this.bots = data.bots
                // we will render bots here after we get rendering working
        })
}

function buildNav() {

    const user = Session.getUser()
    profileMenu.innerHTML = ""

    if (!user) {
        const el = document.createElement("div")

        el.classList.add("profile-item")

        el.textContent = "login / Sign Up"

        profileMenu.appendChild(el)

        return
    }


    const el = document.createElement("div")

    el.classList.add("profile-item")

    el.textContent = "Profile"

    profileMenu.appendChild(el)

    const el2 = document.createElement("div")

    el2.classList.add("profile-item")

    el2.textContent = "Notifications"

    profileMenu.appendChild(el2)

    const el3 = document.createElement("div")

    el3.classList.add("profile-item")

    el3.textContent = "Settings"

    profileMenu.appendChild(el3)

    const el4 = document.createElement("div")

    el4.classList.add("profile-item")

    el4.textContent = "Personas"

    profileMenu.appendChild(el4)

    if (adminProfiles.includes(user.id)) {

        const el5 = document.createElement("div")

        el5.classList.add("profile-item")

        el5.textContent = "Admin Panel"

        profileMenu.appendChild(el5)

    }

    return
}

class Session {

    static getUser() {

        const raw = localStorage.getItem("user")

        if (!raw) return null

        return JSON.parse(raw)

    }

    static isLoggedIn() {

        return this.getUser() !== null
    }

}