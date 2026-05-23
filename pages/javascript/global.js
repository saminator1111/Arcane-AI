const GLOBAL_BASE_URL = "https://clinton-indicate-kept-nottingham.trycloudflare.com"

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

    // ✅ FIXED toggle
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

    // 🔴 NOT LOGGED IN
    if (!user) {
        const el = document.createElement("a")
        el.classList.add("profile-item")
        el.textContent = "Login / Sign Up"
        el.href = "/index.html"

        profileMenu.appendChild(el)
        return
    }

    // 🟢 LOGGED IN

    const profile = document.createElement("a")
    profile.classList.add("profile-item")
    profile.textContent = "Profile"
    profile.href = `/pages/profile.html?id=${user.id}`
    profileMenu.appendChild(profile)

    const notif = document.createElement("a")
    notif.classList.add("profile-item")
    notif.textContent = "Notifications"
    profileMenu.appendChild(notif)

    const settings = document.createElement("a")
    settings.classList.add("profile-item")
    settings.textContent = "Settings"
    profileMenu.appendChild(settings)

    const personas = document.createElement("a")
    personas.classList.add("profile-item")
    personas.textContent = "Personas"
    profileMenu.appendChild(personas)

    if (adminProfiles.includes(user.id)) {
        const admin = document.createElement("a")
        admin.classList.add("profile-item")
        admin.textContent = "Admin Panel"
        profileMenu.appendChild(admin)
    }

    const logout = document.createElement("a")
    logout.classList.add("profile-item")
    logout.textContent = "Logout"
    profileMenu.appendChild(logout)
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