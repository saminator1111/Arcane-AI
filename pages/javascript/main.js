const BASE_URL = "https://api.arcanai.uk";

class main {
    constructor() {
        this.bots = [];
        this.botwrapper = document.getElementById("bot-wrapper");

        this.loadBots();
    }

    loadBots() {
        console.log("FETCHING:", `${BASE_URL}/bots`);

        fetch(`${BASE_URL}/bots`)
            .then(res => res.json())
            .then(data => {
                console.log("bots from backend:", data);
                this.bots = data.bots || [];
                this.renderBots(this.bots);
            })
            .catch(err => {
                console.error("Failed to load bots:", err);
            });
    }

    renderBots(bots) {
        this.botwrapper.innerHTML = "";

        if (!bots || bots.length === 0) {
            this.botwrapper.textContent = "No bots found.";
            return;
        }

        bots.forEach(bot => {
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
                username.href = `pages/profile.html?id=${bot.account_id}`;
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

            this.botwrapper.appendChild(botLink);
        });
    }
}

const app = new main();