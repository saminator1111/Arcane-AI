const BASE_URL = "https://api.arcanai.uk";

class main {
    constructor() {
        this.profilePageWrapper = document.getElementById("profile-page-wrapper");
        this.profilePage = document.getElementById("profile-page");

        this.profileLeft = document.getElementById("profile-left");
        this.profilePictureContainer = document.getElementById("profile-picture-container");
        this.imgWrapper = document.getElementById("img-wrapper");
        this.profileImg = document.getElementById("profile-picture");
        this.profileUsername = document.getElementById("profile-username");
        this.profileBadge = document.getElementById("profile-badge");
        this.profileBioContainer = document.getElementById("profile-bio-container");
        this.profileDescription = document.getElementById("profile-bio");
        this.joinDateLabel = document.getElementById("join-date-label");
        this.joinDateValue = document.getElementById("join-date-value");
        this.profileStats = document.getElementById("profile-stats");
        this.editProfile = document.getElementById("edit-profile");
        this.editProfileButton = document.getElementById("edit-profile-button");
        this.editProfileIcon = document.getElementById("edit-profile-icon");

        this.profileCenter = document.getElementById("profile-center");
        this.centerPanel = document.getElementById("center-panel");
        this.profileTabsWrapper = document.getElementById("profile-tabs-wrapper");
        this.botsTab = document.getElementById("bots");
        this.favoritesTab = document.getElementById("favorites");
        this.activityTab = document.getElementById("activity");
        this.centerWrapper = document.getElementById("center-wrapper");
        this.topSection = document.getElementById("top-section");
        this.topSectionLeft = document.getElementById("top-section-left");
        this.topSectionTitle = document.getElementById("top-section-title");
        this.number = document.getElementById("number");
        this.topSectionRight = document.getElementById("top-section-right");
        this.dropdownButton = document.getElementById("dropdown-button");
        this.dropdownContent = document.getElementById("dropdown-content");
        this.botGrid = document.getElementById("bot-grid");
        this.loadMoreButton = document.getElementById("load-more-button");

        this.profileRight = document.getElementById("profile-right");
        this.topRightSection = document.getElementById("top-right-section");
        this.rightSectionTitleTop = document.getElementById("right-section-title-top");
        this.notificationBellIcon = document.getElementById("notification-bell-icon");
        this.notificationsContainer = document.getElementById("notifications-container");

        this.middleRightSection = document.getElementById("middle-right-section");
        this.rightSectionTitleMiddle = document.getElementById("right-section-title-middle");
        this.statusInfoIcon = document.getElementById("status-info-icon");
        this.statusContainer = document.getElementById("status-container");

        this.bottomRightSection = document.getElementById("bottom-right-section");
        this.rightSectionTitleBottom = document.getElementById("right-section-title-bottom");
        this.achievementsTrophyIcon = document.getElementById("achievements-trophy-icon");
        this.achievementsContainer = document.getElementById("achievements-container");

        this.tabs = document.querySelectorAll(".tab");

        this.profileId = new URLSearchParams(window.location.search).get("id");

        const savedUser = JSON.parse(localStorage.getItem("user"));
        this.user = savedUser?.account_id || savedUser?.id || localStorage.getItem("account_id");

        console.log("Profile ID from URL:", this.profileId);
        console.log("Logged in user:", this.user);

        if (!this.profileId) {
            console.error("Missing profile id in URL");
            return;
        }

        this.bindEvents();
        this.loadProfile();
    }

    bindEvents() {
        if (this.dropdownButton && this.dropdownContent) {
            this.dropdownButton.addEventListener("click", () => {
                this.dropdownContent.classList.toggle("show");
            });
        }

        if (this.botsTab) {
            this.botsTab.addEventListener("click", () => {
                this.selectTab("bots");
                this.loadBotsForProfile(this.profileId);
            });
        }

        if (this.favoritesTab) {
            this.favoritesTab.addEventListener("click", () => {
                this.selectTab("favorites");
                this.loadFavoritesForProfile(this.profileId);
            });
        }

        if (this.activityTab) {
            this.activityTab.addEventListener("click", () => {
                this.selectTab("activity");
                this.loadActivityForProfile(this.profileId);
            });
        }
    }

    loadProfile() {
        const endpoint = `${BASE_URL}/profiles/${encodeURIComponent(this.profileId)}`;

        if (this.profileId === this.user) {
            this.addOwnerProfileControls();
        }

        fetch(endpoint)
            .then((res) => {
                if (!res.ok) {
                    throw new Error(`Network error: ${res.status} ${res.statusText}`);
                }

                return res.json();
            })
            .then((data) => {
                if (!data || data.ok !== true || !data.profile) {
                    throw new Error(data?.message || "Unable to load profile data");
                }

                this.populateProfile(data.profile, data.index);
                this.loadBotsForProfile(this.profileId);
                this.selectTab("bots");
            })
            .catch((err) => {
                console.error("Failed to load profile:", err);

                if (this.profileUsername) {
                    this.profileUsername.textContent = "Profile not found";
                }

                if (this.profileDescription) {
                    this.profileDescription.textContent = "Unable to load this profile.";
                }
            });
    }

    addOwnerProfileControls() {
        if (!this.imgWrapper || !this.profileImg) {
            return;
        }

        this.imgWrapper.style.position = "relative";

        this.profileImg.style.borderRadius = "50%";
        this.profileImg.style.border = "8px solid #3d1c6e";

        if (document.getElementById("edit-picture-button")) {
            return;
        }

        const editButton = document.createElement("button");
        editButton.id = "edit-picture-button";

        editButton.addEventListener("click", () => {
            console.log("Edit profile clicked");
        });

        const editIcon = document.createElement("i");
        editIcon.id = "edit-picture-icon";
        editIcon.setAttribute("data-lucide", "pencil");
        editButton.appendChild(editIcon);

        editButton.style.position = "absolute";
        editButton.style.bottom = "15px";
        editButton.style.right = "15px";
        editButton.style.width = "56px";
        editButton.style.height = "56px";
        editButton.style.padding = "0";
        editButton.style.borderRadius = "50%";
        editButton.style.display = "flex";
        editButton.style.alignItems = "center";
        editButton.style.justifyContent = "center";
        editButton.style.border = "4px solid #3d1c6e";
        editButton.style.background = "rgb(16, 19, 27)";
        editButton.style.color = "rgb(242, 238, 255)";
        editButton.style.zIndex = "2";
        editButton.style.boxSizing = "border-box";

        this.imgWrapper.appendChild(editButton);

        if (window.lucide) {
            lucide.createIcons();

            const svg = editButton.querySelector("svg");

            if (svg) {
                svg.style.width = "24px";
                svg.style.height = "24px";
                svg.style.strokeWidth = "2.2";
            }
        }
    }

    populateProfile(profile, index) {
        if (!profile) {
            console.error("populateProfile called with no profile data");
            return;
        }

        const display = profile.display || {};
        const legacy = profile.legacy || {};
        const stats = profile.stats || {};

        const username = display.username || display.name || index?.username || index?.name || "Unknown user";
        const bio = display.bio || "No bio available.";
        const joinDate = legacy.join_date || "Unknown";

        if (this.profileUsername) {
            this.profileUsername.textContent = username;
        }

        if (this.profileBadge) {
            this.profileBadge.textContent = display.badge || "";
        }

        if (this.profileDescription) {
            this.profileDescription.textContent = bio;
        }

        if (this.joinDateValue) {
            this.joinDateValue.textContent = joinDate;
        }

        if (this.profileImg) {
            if (index?.avatar_url) {
                this.profileImg.src = `${BASE_URL}${index.avatar_url}`;
            } else {
                this.profileImg.src = "/pages/stylesheets/assets/blankpfp.jpg";
            }
        }

        const statValues = this.profileStats?.querySelectorAll(".stat-row .stat-value");

        if (statValues && statValues.length >= 4) {
            statValues[0].textContent = stats.num_of_bots ?? 0;
            statValues[1].textContent = stats.num_of_followers ?? 0;
            statValues[2].textContent = stats.num_of_following ?? 0;
            statValues[3].textContent = stats.total_chats ?? 0;
        }
    }

    loadBotsForProfile(profileId) {
        const endpoint = `${BASE_URL}/bots`;

        fetch(endpoint)
            .then(res => res.json())
            .then(data => {
                console.log("Bots for profile:", data);

                this.profileData = (data.bots || []).filter(bot => bot.account_id === profileId);
                this.renderProfileBots(this.profileData);
            })
            .catch(err => {
                console.error("Failed to load bots for profile:", err);

                if (this.botGrid) {
                    this.botGrid.textContent = "Failed to load bots.";
                }
            });
    }

    loadFavoritesForProfile(profileId) {
        this.renderProfileFavorites([]);
    }

    loadActivityForProfile(profileId) {
        if (!this.botGrid) {
            return;
        }

        this.botGrid.innerHTML = "";
        this.botGrid.textContent = "No activity found.";
    }

    renderProfileFavorites(favorites) {
        if (!this.botGrid) {
            return;
        }

        this.botGrid.innerHTML = "";

        if (!favorites || favorites.length === 0) {
            this.botGrid.textContent = "No favorites found.";
            return;
        }

        favorites.forEach(bot => {
            const botCard = this.createBotCard(bot, false);
            this.botGrid.appendChild(botCard);
        });
    }

    renderProfileBots(bots) {
        if (!this.botGrid) {
            return;
        }

        this.botGrid.innerHTML = "";

        if (!bots || bots.length === 0) {
            this.botGrid.textContent = "No bots found.";
            return;
        }

        bots.forEach(bot => {
            const isOwner = this.profileId === this.user;

            if (!isOwner && bot.approved === false) {
                return;
            }

            const botCard = this.createBotCard(bot, isOwner);
            this.botGrid.appendChild(botCard);
        });
    }

    createBotCard(bot, showOwnerStatus) {
        const botLink = document.createElement("a");
        botLink.href = `bot.html?id=${bot.bot_id}`;
        botLink.classList.add("bot-link");

        const botCard = document.createElement("div");
        botCard.classList.add("bot-card");

        botLink.appendChild(botCard);

        const title_wrapper = document.createElement("div");
        title_wrapper.classList.add("title-wrapper");

        const title = document.createElement("strong");
        title.textContent = bot.name || "Untitled Bot";
        title_wrapper.appendChild(title);

        botCard.appendChild(title_wrapper);

        const image = document.createElement("img");
        image.classList.add("bot-image");

        if (bot.image_url) {
            image.src = `${BASE_URL}${bot.image_url}`;
        } else {
            image.src = "/pages/stylesheets/assets/blankpfp.jpg";
        }

        botCard.appendChild(image);

        const username_wrapper = document.createElement("div");
        username_wrapper.classList.add("username-wrapper");

        const username = document.createElement("a");

        if (bot.account_id && bot.username) {
            username.href = `profile.html?id=${bot.account_id}`;
            username.textContent = `@${bot.username}`;
        } else {
            username.href = "#";
            username.textContent = "@unknown";
        }

        username_wrapper.appendChild(username);
        botCard.appendChild(username_wrapper);

        const bot_tags = document.createElement("div");
        bot_tags.classList.add("card-tags");

        const tags = bot.tags;

        if (!tags || tags.length === 0) {
            const tag_item = document.createElement("span");
            tag_item.textContent = "notags";
            tag_item.classList.add("tag");
            bot_tags.appendChild(tag_item);
        } else {
            tags.forEach(tag => {
                const tag_item = document.createElement("span");
                tag_item.textContent = tag;
                tag_item.classList.add("tag");
                bot_tags.appendChild(tag_item);
            });
        }

        botCard.appendChild(bot_tags);

        const desc_wrapper = document.createElement("div");
        desc_wrapper.classList.add("desc-wrapper");

        const desc = document.createElement("p");
        desc.textContent = bot.description || "No description";
        desc_wrapper.appendChild(desc);

        botCard.appendChild(desc_wrapper);

        if (showOwnerStatus) {
            const statusBadge = document.createElement("span");

            if (bot.verified === true || bot.approved === true || bot.is_searchable === true) {
                statusBadge.classList.add("verified-badge");
                statusBadge.textContent = "Verified";
            } else {
                statusBadge.classList.add("unverified-badge");
                statusBadge.textContent = "Pending";
            }

            botCard.appendChild(statusBadge);
        }

        return botLink;
    }

    selectTab(tabId) {
        const tabs = [this.botsTab, this.favoritesTab, this.activityTab];

        tabs.forEach((tab) => {
            if (!tab) return;

            tab.classList.toggle("active", tab.id === tabId);
            tab.setAttribute("aria-selected", tab.id === tabId ? "true" : "false");
        });

        if (this.topSectionTitle) {
            this.topSectionTitle.textContent =
                tabId === "bots" ? "My Bots" : tabId === "favorites" ? "Favorites" : "Activity";
        }
    }
}

new main();