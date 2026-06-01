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

        this.bindEvents();
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
        });

        if (this.topSectionTitle) {
            this.topSectionTitle.textContent =
                tabId === 'bots' ? 'My Bots' : tabId === 'favorites' ? 'Favorites' : 'Activity';
        }
    }
}

new main();
