const BASE_URL = "https://api.arcanai.uk"

class main {
    constructor() {
        this.profilePageWrapper = document.getElementById('profile-page-wrapper');
        this.profilePage = document.getElementById('profile-page');

        this.profileLeft = document.getElementById('profile-left');
        this.profilePictureContainer = document.getElementById('profile-picture-container');
        this.imgWrapper = document.getElementById('img-wrapper');
        this.profileImg = document.getElementById('profile-picture');
        this.profileUsername = document.getElementById('profile-username');
        this.profileBadge = document.getElementById('profile-badge');
        this.profileBioContainer = document.getElementById('profile-bio-container');
        this.profileDescription = document.getElementById('profile-bio');
        this.joinDateLabel = document.getElementById('join-date-label');
        this.joinDateValue = document.getElementById('join-date-value');
        this.profileStats = document.getElementById('profile-stats');
        this.editProfile = document.getElementById('edit-profile');
        this.editProfileButton = document.getElementById('edit-profile-button');
        this.editProfileIcon = document.getElementById('edit-profile-icon');

        this.profileCenter = document.getElementById('profile-center');
        this.centerPanel = document.getElementById('center-panel');
        this.profileTabsWrapper = document.getElementById('profile-tabs-wrapper');
        this.botsTab = document.getElementById('bots');
        this.favoritesTab = document.getElementById('favorites');
        this.activityTab = document.getElementById('activity');
        this.centerWrapper = document.getElementById('center-wrapper');
        this.topSection = document.getElementById('top-section');
        this.topSectionLeft = document.getElementById('top-section-left');
        this.topSectionTitle = document.getElementById('top-section-title');
        this.number = document.getElementById('number');
        this.topSectionRight = document.getElementById('top-section-right');
        this.dropdownButton = document.getElementById('dropdown-button');
        this.dropdownContent = document.getElementById('dropdown-content');
        this.botGrid = document.getElementById('bot-grid');
        this.loadMoreButton = document.getElementById('load-more-button');

        this.profileRight = document.getElementById('profile-right');
        this.topRightSection = document.getElementById('top-right-section');
        this.rightSectionTitleTop = document.getElementById('right-section-title-top');
        this.notificationBellIcon = document.getElementById('notification-bell-icon');
        this.notificationsContainer = document.getElementById('notifications-container');

        this.middleRightSection = document.getElementById('middle-right-section');
        this.rightSectionTitleMiddle = document.getElementById('right-section-title-middle');
        this.statusInfoIcon = document.getElementById('status-info-icon');
        this.statusContainer = document.getElementById('status-container');

        this.bottomRightSection = document.getElementById('bottom-right-section');
        this.rightSectionTitleBottom = document.getElementById('right-section-title-bottom');
        this.achievementsTrophyIcon = document.getElementById('achievements-trophy-icon');
        this.achievementsContainer = document.getElementById('achievements-container');

        this.tabs = document.querySelectorAll('.tab');

        this.profileId = new URLSearchParams(window.location.search).get('id');
        this.user = JSON.parse(localStorage.getItem('user'))?.id;

        console.log("Profile ID from pull:", this.user);
        
        if (!this.profileId) {
            console.error("Missing profile id in URL");
            return;
        }

        this.botsTab.addEventListener('click', () => {
            this.loadBotsForProfile(this.profileId);
        });

        this.favoritesTab.addEventListener('click', () => {
            this.loadFavoritesForProfile(this.profileId);
        });
        this.activityTab.addEventListener('click', () => {
            this.loadActivityForProfile(this.profileId);
        });

        this.bindEvents();
        this.loadProfile();
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
            })
    }

    loadFavoritesForProfile(profileId) {
        const endpoint = `${BASE_URL}/accounts/${encodeURIComponent(profileId)}`;

        fetch(endpoint)
            .then(res => res.json())
            .then(data => {
                this.profileData = data.account.favoriteBots || [];
                this.renderProfileFavorites(this.profileData);
            })
            .catch(err => {
                console.error("Failed to load favorites for profile:", err);
            })
            }

    renderProfileFavorites(favorites) {

        this.botGrid.innerHTML = "";

        if (!favorites || favorites.length === 0) {
            this.botGrid.textContent = "No favorites found.";
            return;
        }

        favorites.forEach(bot => {
            const botLink = document.createElement("a")
            botLink.href = `bot.html?id=${bot.id}`
            botLink.classList.add("bot-link")

            const botCard = document.createElement("div")
            botCard.classList.add("bot-card")

            botLink.appendChild(botCard)

            const title_wrapper = document.createElement("div")
            title_wrapper.classList.add("title-wrapper")

            const title = document.createElement("strong")
            title.textContent = bot.name
            title_wrapper.appendChild(title)

            botCard.appendChild(title_wrapper)

            if (!bot.image) {
                const image = document.createElement("img")
                image.classList.add("bot-image")
                image.src = "/pages/stylesheets/assets/blankpfp.jpg"
                botCard.appendChild(image)
            } else {
                const image = document.createElement("img")
                image.classList.add("bot-image")
                image.src = bot.image
                botCard.appendChild(image)
            }

            const username_wrapper = document.createElement("div")
            username_wrapper.classList.add("username-wrapper")

            const username = document.createElement("a")

            username.href = `profile.html?id=${bot.account_id}`

            username.textContent = `@${bot.username}`
            username_wrapper.appendChild(username)

            botCard.appendChild(username_wrapper)


            const bot_tags = document.createElement("div")
            bot_tags.classList.add("card-tags")

            const tags = bot.tags

            if (!tags || tags.length === 0) {
                const tag_item = document.createElement("span")
                tag_item.textContent = "notags"
                tag_item.classList.add("tag")
                bot_tags.appendChild(tag_item)
            } else {
                tags.forEach(tag => {
                    const tag_item = document.createElement("span")
                    tag_item.textContent = tag
                    tag_item.classList.add("tag")
                    bot_tags.appendChild(tag_item)
                })
            }

            botCard.appendChild(bot_tags)

            const desc_wrapper = document.createElement("div")
            desc_wrapper.classList.add("desc-wrapper")

            const desc = document.createElement("p")
            desc.textContent = bot.description || "No description"
            desc_wrapper.appendChild(desc)

            botCard.appendChild(desc_wrapper)

            this.botGrid.appendChild(botLink)
        })
    }

    renderProfileBots(bots) {
        this.botGrid.innerHTML = "";

        if (!bots || bots.length === 0) {
            this.botGrid.textContent = "No bots found.";
            return;
        }

        bots.forEach(bot => {

            if (this.profileId !== this.user) {
                if (bot.approved === false) {
                    return;
                }
            } else if (this.profileId === this.user) {
                const botLink = document.createElement("a")
                botLink.href = `bot.html?id=${bot.id}`
                botLink.classList.add("bot-link")

                const botCard = document.createElement("div")
                botCard.classList.add("bot-card")

                botLink.appendChild(botCard)

                const title_wrapper = document.createElement("div")
                title_wrapper.classList.add("title-wrapper")

                const title = document.createElement("strong")
                title.textContent = bot.name
                title_wrapper.appendChild(title)

                botCard.appendChild(title_wrapper)

                if (!bot.image) {
                    const image = document.createElement("img")
                    image.classList.add("bot-image")
                    image.src = "/pages/stylesheets/assets/blankpfp.jpg"
                    botCard.appendChild(image)
                } else {
                    const image = document.createElement("img")
                    image.classList.add("bot-image")
                    image.src = bot.image
                    botCard.appendChild(image)
                }

                const username_wrapper = document.createElement("div")
                username_wrapper.classList.add("username-wrapper")

                const username = document.createElement("a")

                username.href = `profile.html?id=${bot.account_id}`

                username.textContent = `@${bot.username}`
                username_wrapper.appendChild(username)

                botCard.appendChild(username_wrapper)


                const bot_tags = document.createElement("div")
                bot_tags.classList.add("card-tags")

                const tags = bot.tags

                if (!tags || tags.length === 0) {
                    const tag_item = document.createElement("span")
                    tag_item.textContent = "notags"
                    tag_item.classList.add("tag")
                    bot_tags.appendChild(tag_item)
                } else {
                    tags.forEach(tag => {
                        const tag_item = document.createElement("span")
                        tag_item.textContent = tag
                        tag_item.classList.add("tag")
                        bot_tags.appendChild(tag_item)
                    })
                }

                botCard.appendChild(bot_tags)

                const desc_wrapper = document.createElement("div")
                desc_wrapper.classList.add("desc-wrapper")

                const desc = document.createElement("p")
                desc.textContent = bot.description || "No description"
                desc_wrapper.appendChild(desc)

                botCard.appendChild(desc_wrapper)

                if (bot.verified === true) {
                    const verifiedBadge = document.createElement("span")
                    verifiedBadge.classList.add("verified-badge")
                    verifiedBadge.textContent = "Verified"
                    botCard.appendChild(verifiedBadge)
                } else {
                    const unverifiedBadge = document.createElement("span")
                    unverifiedBadge.classList.add("unverified-badge")
                    unverifiedBadge.textContent = "Pending"
                    botCard.appendChild(unverifiedBadge)
                }

                this.botGrid.appendChild(botLink)

                this.botGrid.appendChild(botLink)
            } else {
                const botLink = document.createElement("a")
                botLink.href = `bot.html?id=${bot.id}`
                botLink.classList.add("bot-link")

                const botCard = document.createElement("div")
                botCard.classList.add("bot-card")

                botLink.appendChild(botCard)

                const title_wrapper = document.createElement("div")
                title_wrapper.classList.add("title-wrapper")

                const title = document.createElement("strong")
                title.textContent = bot.name
                title_wrapper.appendChild(title)

                botCard.appendChild(title_wrapper)

                if (!bot.image) {
                    const image = document.createElement("img")
                    image.classList.add("bot-image")
                    image.src = "/pages/stylesheets/assets/blankpfp.jpg"
                    botCard.appendChild(image)
                } else {
                    const image = document.createElement("img")
                    image.classList.add("bot-image")
                    image.src = bot.image
                    botCard.appendChild(image)
                }

                const username_wrapper = document.createElement("div")
                username_wrapper.classList.add("username-wrapper")

                const username = document.createElement("a")

                username.href = `profile.html?id=${bot.account_id}`

                username.textContent = `@${bot.username}`
                username_wrapper.appendChild(username)

                botCard.appendChild(username_wrapper)


                const bot_tags = document.createElement("div")
                bot_tags.classList.add("card-tags")

                const tags = bot.tags

                if (!tags || tags.length === 0) {
                    const tag_item = document.createElement("span")
                    tag_item.textContent = "notags"
                    tag_item.classList.add("tag")
                    bot_tags.appendChild(tag_item)
                } else {
                    tags.forEach(tag => {
                        const tag_item = document.createElement("span")
                        tag_item.textContent = tag
                        tag_item.classList.add("tag")
                        bot_tags.appendChild(tag_item)
                    })
                }

                botCard.appendChild(bot_tags)

                const desc_wrapper = document.createElement("div")
                desc_wrapper.classList.add("desc-wrapper")

                const desc = document.createElement("p")
                desc.textContent = bot.description || "No description"
                desc_wrapper.appendChild(desc)

                botCard.appendChild(desc_wrapper)

                if (bot.verified === true) {
                    const verifiedBadge = document.createElement("span")
                    verifiedBadge.classList.add("verified-badge")
                    verifiedBadge.textContent = "Verified"
                    botCard.appendChild(verifiedBadge)
                } else {
                    const unverifiedBadge = document.createElement("span")
                    unverifiedBadge.classList.add("unverified-badge")
                    unverifiedBadge.textContent = "Pending"
                    botCard.appendChild(unverifiedBadge)
                }

                this.botGrid.appendChild(botLink)

                this.botGrid.appendChild(botLink)
            }
        })
    }

    loadProfile() {
        const endpoint = `${BASE_URL}/accounts/${encodeURIComponent(this.profileId)}`;

        if (this.profileId === this.user) {
            this.imgWrapper.style.position = "relative";

            this.profileImg.style.borderRadius = "50%";
            this.profileImg.style.border = "8px solid #3d1c6e";

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

        fetch(endpoint)
            .then((res) => {
                if (!res.ok) {
                    throw new Error(`Network error: ${res.status} ${res.statusText}`);
                }
                return res.json();
            })
            .then((data) => {
                if (!data || data.ok !== true || !data.account) {
                    throw new Error(data?.message || 'Unable to load profile data');
                }
                this.populateProfile(data.account);
                this.loadBotsForProfile(this.profileId);
                this.selectTab("bots");
            })
            .catch((err) => {
                console.error('Failed to load profile:', err);
            });

    }

    bindEvents() {
        if (this.dropdownButton && this.dropdownContent) {
            this.dropdownButton.addEventListener('click', () => {
                this.dropdownContent.classList.toggle('show');
            });
        }

        if (this.botsTab) {
            this.botsTab.addEventListener('click', () => this.selectTab('bots'));
        }

        if (this.favoritesTab) {
            this.favoritesTab.addEventListener('click', () => this.selectTab('favorites'));
        }

        if (this.activityTab) {
            this.activityTab.addEventListener('click', () => this.selectTab('activity'));
        }
    }

    selectTab(tabId) {
        const tabs = [this.botsTab, this.favoritesTab, this.activityTab];
        tabs.forEach((tab) => {
            if (!tab) return;
            tab.classList.toggle('active', tab.id === tabId);
            tab.setAttribute('aria-selected', tab.id === tabId ? 'true' : 'false');
        });

        if (this.topSectionTitle) {
            this.topSectionTitle.textContent =
                tabId === 'bots' ? 'My Bots' : tabId === 'favorites' ? 'Favorites' : 'Activity';
        }
    }

    populateProfile(account) {
        if (!account) {
            console.error('populateProfile called with no account data');
            return;
        }

        this.profileUsername.textContent = account.username || 'Unknown user';
        this.profileBadge.textContent = account.badge || '';
        this.profileDescription.textContent = account.bio || 'No bio available.';
        this.joinDateValue.textContent = account.joinDate || 'Unknown';
        this.profileImg.src = account.profilePhoto || '/pages/stylesheets/assets/blankpfp.jpg';

        const stats = {
            numofBots: account.numofBots ?? 0,
            numofFollowers: account.numofFollowers ?? 0,
            numofFollowing: account.numofFollowing ?? 0,
            totalChats: account.totalChats ?? 0,
        };

        const statValues = this.profileStats?.querySelectorAll('.stat-row .stat-value');
        if (statValues && statValues.length >= 4) {
            statValues[0].textContent = stats.numofBots;
            statValues[1].textContent = stats.numofFollowers;
            statValues[2].textContent = stats.numofFollowing;
            statValues[3].textContent = stats.totalChats;
        }
    }
}

new main();
