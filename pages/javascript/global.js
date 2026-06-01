const GLOBAL_BASE_URL = "https://api.arcanai.uk"

const adminProfiles = ["571bd9ed-ec70-4a0e-8838-0f5657c42e9c"]

document.addEventListener("DOMContentLoaded", () => {
    loadNav()
})

function loadNav() {
    fetch("/pages/components/nav.html")
        .then(res => {
            console.log("NAV STATUS:", res.status)
            return res.text()
        })
        .then(html => {
            document.getElementById("navbar-container").innerHTML = html
            if (window.lucide) {
                lucide.createIcons()
            }
            setupNav()
        })
        .catch(err => {
            console.error("NAV LOAD FAILED:", err)
        })
}

function setupNav() {

    const profileBtn = document.getElementById("profile-btn")
    const profileMenu = document.getElementById("profile-menu")

    if (!profileBtn || !profileMenu) {
        console.error("Nav elements not found")
        return
    }

    profileBtn.addEventListener("click", (e) => {
        e.stopPropagation()
        profileMenu.classList.toggle("hidden")
    })

    // click outside closes it
    document.addEventListener("click", () => {
        profileMenu.classList.add("hidden")
    })

    // prevent closing when clicking inside
    profileMenu.addEventListener("click", (e) => {
        e.stopPropagation()
    })

    buildNav(profileMenu)
}

function buildNav(profileMenu) {

    const user = Session.getUser()
    console.log(user)
    profileMenu.innerHTML = ""

    if (!user) {
        const el = document.createElement("a")
        el.classList.add("profile-item")
        el.textContent = "Login / Sign Up"
        el.href = "/pages/login.html"

        profileMenu.appendChild(el)
        return
    }

    const profile = document.createElement("a")
    profile.classList.add("profile-item")
    profile.href = `/pages/profile.html?id=${user.id}`
    
    const profileIcon = document.createElement("i")
    profileIcon.setAttribute("data-lucide", "user")

    const profileText = document.createElement("span")
    profileText.textContent = "Profile"

    profile.appendChild(profileIcon)
    profile.appendChild(profileText)

    profileMenu.appendChild(profile)

    const helperAI = document.createElement("a")
    helperAI.classList.add("profile-item")

    const helperIcon = document.createElement("i")
    helperIcon.setAttribute("data-lucide", "cpu")

    const helperText = document.createElement("span")
    helperText.textContent = "Helper AI"

    helperAI.appendChild(helperIcon)
    helperAI.appendChild(helperText)

    profileMenu.appendChild(helperAI)

    const myBots = document.createElement("a")
    myBots.classList.add("profile-item")

    const botsIcon = document.createElement("i")
    botsIcon.setAttribute("data-lucide", "bot")

    const botsText = document.createElement("span")
    botsText.textContent = "My Bots"

    myBots.appendChild(botsIcon)
    myBots.appendChild(botsText)

    profileMenu.appendChild(myBots)

    const settings = document.createElement("a")
    settings.classList.add("profile-item")

    const settingsIcon = document.createElement("i")
    settingsIcon.setAttribute("data-lucide", "settings")

    const settingsText = document.createElement("span")
    settingsText.textContent = "Settings"

    settings.appendChild(settingsIcon)
    settings.appendChild(settingsText)

    profileMenu.appendChild(settings)

    const personas = document.createElement("a")
    personas.classList.add("profile-item")

    const personasIcon = document.createElement("i")
    personasIcon.setAttribute("data-lucide", "venetian-mask")

    const personasText = document.createElement("span")
    personasText.textContent = "Personas"

    personas.appendChild(personasIcon)
    personas.appendChild(personasText)

    profileMenu.appendChild(personas)

    if (adminProfiles.includes(user.id)) {
        const adminPanel = document.createElement("a")
        adminPanel.classList.add("profile-item")

        const adminIcon = document.createElement("i")
        adminIcon.setAttribute("data-lucide", "shield-alert")

        const adminText = document.createElement("span")
        adminText.textContent = "Admin Panel"

        adminPanel.appendChild(adminIcon)
        adminPanel.appendChild(adminText)

        profileMenu.appendChild(adminPanel)
    }

    const logout = document.createElement("a")
    logout.classList.add("profile-item")
    logout.id = "logout-btn"

    const logoutIcon = document.createElement("i")
    logoutIcon.setAttribute("data-lucide", "log-out")

    const logoutText = document.createElement("span")
    logoutText.textContent = "Logout"

    logout.appendChild(logoutIcon)
    logout.appendChild(logoutText)

    profileMenu.appendChild(logout)

    logout.addEventListener("click", () => {
        localStorage.removeItem("user")
        window.location.href = "/index.html"
    })

    if (window.lucide) {
        lucide.createIcons()
    }
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