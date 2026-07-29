const GLOBAL_BASE_URL = "https://api.arcanai.uk";

const adminProfiles = ["571bd9ed-ec70-4a0e-8838-0f5657c42e9c"];

document.addEventListener("DOMContentLoaded", () => {
    loadNav();
});

function loadNav() {
    fetch("/pages/components/nav.html")
        .then(res => {
            console.log("NAV STATUS:", res.status);
            return res.text();
        })
        .then(html => {
            const navbarContainer = document.getElementById("navbar-container");

            if (!navbarContainer) {
                console.error("Navbar container not found");
                return;
            }

            navbarContainer.innerHTML = html;

            if (window.lucide) {
                lucide.createIcons();
            }

            setupNav();
        })
        .catch(err => {
            console.error("NAV LOAD FAILED:", err);
        });
}

function setupNav() {
    const profileBtn = document.getElementById("profile-btn");
    const profileMenu = document.getElementById("profile-menu");

    const notificationsBtn = document.getElementById("notifications-btn");
    const notificationsMenu = document.getElementById("notifications-dropdown");

    if (
        !profileBtn ||
        !profileMenu ||
        !notificationsBtn ||
        !notificationsMenu
    ) {
        console.error("One or more navbar elements were not found");
        return;
    }

    profileBtn.addEventListener("click", (event) => {
        event.stopPropagation();

        profileMenu.classList.toggle("hidden");
        notificationsMenu.classList.add("hidden");
    });

    notificationsBtn.addEventListener("click", (event) => {
        event.stopPropagation();

        notificationsMenu.classList.toggle("hidden");
        profileMenu.classList.add("hidden");
    });

    profileMenu.addEventListener("click", (event) => {
        event.stopPropagation();
    });

    notificationsMenu.addEventListener("click", (event) => {
        event.stopPropagation();
    });

    document.addEventListener("click", () => {
        profileMenu.classList.add("hidden");
        notificationsMenu.classList.add("hidden");
    });

    buildNav(profileMenu);
    buildNotifications(notificationsMenu);
}

function buildNotifications(notificationsMenu) {
    const user = Session.getUser();

    notificationsMenu.innerHTML = "";

    if (!user) {
        return;
    }

    const userId = user.account_id || user.id || localStorage.getItem("account_id");

    if (!userId) {
        console.error("User ID not found");
        return;
    }

    fetch(`${GLOBAL_BASE_URL}/profiles/${userId}/notifications`)
        .then(res => res.json())
        .then(data => {

            if (data.ok === false) {
                console.error("Failed to fetch notifications:", data.message);
            } else if (data.notifications.length === 0) {
                const noNotifications = document.createElement("div");
                noNotifications.classList.add("notification-item");
                noNotifications.textContent = "No notifications";
                notificationsMenu.appendChild(noNotifications);
            } else if (data.notifications.length > 0 && data.ok) {
                data.notifications.forEach(notification => {
                    const type = notification.type;
                    const message = notification.message;
                    const read = notification.read;

                    const notificationHolder = document.createElement("div");
                    notificationHolder.classList.add("notification-item");

                    const notificationWrapper = document.createElement("a");
                    notificationWrapper.href = "#";

                    notificationHolder.appendChild(notificationWrapper);
  
                    const notificationIcon = document.createElement("i");

                    const notificationLeft = document.createElement("div");
                    notificationLeft.classList.add("notification-left");

                    const notificationRight = document.createElement("div");
                    notificationRight.classList.add("notification-right");

                    notificationWrapper.appendChild(notificationLeft);
                    notificationWrapper.appendChild(notificationRight);

                    if (type === "new_account") {
                        notificationIcon.setAttribute("data-lucide", "user-plus");

                        notificationLeft.appendChild(notificationIcon);

                        const notificationHeader = document.createElement("h4");
                        notificationHeader.textContent = "New Account Registered";

                        notificationRight.appendChild(notificationHeader);

                        const notificationText = document.createElement("p");
                        notificationText.textContent = message;

                        notificationRight.appendChild(notificationText);
                    }

                    if (read === false) {
                        notificationHolder.classList.add("unread");
                    } else if (read === true) {
                        notificationHolder.classList.add("read");
                    }

                    notificationsMenu.appendChild(notificationHolder);

                    if (window.lucide) {
                        lucide.createIcons();
                    }

                })
            }
        })
}

function buildNav(profileMenu) {
    const user = Session.getUser();
    console.log(user);

    profileMenu.innerHTML = "";

    if (!user) {
        const el = document.createElement("a");
        el.classList.add("profile-item");
        el.textContent = "Login / Sign Up";
        el.href = "/pages/login.html";

        profileMenu.appendChild(el);
        return;
    }

    const userId = user.account_id || user.id || localStorage.getItem("account_id");

    const profile = document.createElement("a");
    profile.classList.add("profile-item");
    profile.href = `/pages/profile.html?id=${userId}`;

    const profileIcon = document.createElement("i");
    profileIcon.setAttribute("data-lucide", "user");

    const profileText = document.createElement("span");
    profileText.textContent = "Profile";

    profile.appendChild(profileIcon);
    profile.appendChild(profileText);

    profileMenu.appendChild(profile);

    const helperAI = document.createElement("a");
    helperAI.classList.add("profile-item");
    helperAI.href = "#";

    const helperIcon = document.createElement("i");
    helperIcon.setAttribute("data-lucide", "cpu");

    const helperText = document.createElement("span");
    helperText.textContent = "Helper AI";

    helperAI.appendChild(helperIcon);
    helperAI.appendChild(helperText);

    profileMenu.appendChild(helperAI);

    const myBots = document.createElement("a");
    myBots.classList.add("profile-item");
    myBots.href = `/pages/profile.html?id=${userId}`;

    const botsIcon = document.createElement("i");
    botsIcon.setAttribute("data-lucide", "bot");

    const botsText = document.createElement("span");
    botsText.textContent = "My Bots";

    myBots.appendChild(botsIcon);
    myBots.appendChild(botsText);

    profileMenu.appendChild(myBots);

    const settings = document.createElement("a");
    settings.classList.add("profile-item");
    settings.href = "#";

    const settingsIcon = document.createElement("i");
    settingsIcon.setAttribute("data-lucide", "settings");

    const settingsText = document.createElement("span");
    settingsText.textContent = "Settings";

    settings.appendChild(settingsIcon);
    settings.appendChild(settingsText);

    profileMenu.appendChild(settings);

    const personas = document.createElement("a");
    personas.classList.add("profile-item");
    personas.href = "#";

    const personasIcon = document.createElement("i");
    personasIcon.setAttribute("data-lucide", "venetian-mask");

    const personasText = document.createElement("span");
    personasText.textContent = "Personas";

    personas.appendChild(personasIcon);
    personas.appendChild(personasText);

    profileMenu.appendChild(personas);

    if (adminProfiles.includes(userId)) {
        const adminPanel = document.createElement("a");
        adminPanel.classList.add("profile-item");
        adminPanel.href = "#";

        const adminIcon = document.createElement("i");
        adminIcon.setAttribute("data-lucide", "shield-alert");

        const adminText = document.createElement("span");
        adminText.textContent = "Admin Panel";

        adminPanel.appendChild(adminIcon);
        adminPanel.appendChild(adminText);

        profileMenu.appendChild(adminPanel);
    }

    const logout = document.createElement("a");
    logout.classList.add("profile-item");
    logout.id = "logout-btn";
    logout.href = "#";

    const logoutIcon = document.createElement("i");
    logoutIcon.setAttribute("data-lucide", "log-out");

    const logoutText = document.createElement("span");
    logoutText.textContent = "Logout";

    logout.appendChild(logoutIcon);
    logout.appendChild(logoutText);

    profileMenu.appendChild(logout);

    logout.addEventListener("click", (e) => {
        e.preventDefault();

        localStorage.removeItem("user");
        localStorage.removeItem("account_id");

        window.location.href = "/index.html";
    });

    if (window.lucide) {
        lucide.createIcons();
    }
}

class Session {
    static getUser() {
        const raw = localStorage.getItem("user");

        if (!raw) {
            return null;
        }

        try {
            return JSON.parse(raw);
        } catch (err) {
            console.error("Bad user data in localStorage:", err);

            localStorage.removeItem("user");
            localStorage.removeItem("account_id");

            return null;
        }
    }

    static isLoggedIn() {
        return this.getUser() !== null;
    }
}