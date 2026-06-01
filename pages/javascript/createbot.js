/*
CREATE BOT PAGE TODO

Core form:
[✔] Character name input
[✔] Chat name input
[✔] Tags input
[✔] Bio textarea
[✔] Personality textarea
[✔] Scenario textarea
[✔] First message textarea
[✔] Example dialogue textarea
[✔] Image upload input
[✔] Preview card exists
[✔] Settings panel exists
[✔] Submit button exists

HTML cleanup:
[✔] Fix typo: example_dialouge → example_dialogue later, but only if JS/backend updated too
[✔] Remove empty <div></div> after tag_list
[✔] Decide if tag_list should be a <li> or separate div; current JS may expect container behavior
[✔] Add name required marker visually
[✔] Add actual required attributes where needed
[✔] Add max lengths to fields where appropriate
[ ] Add source JSON upload section later
[ ] Add helper text for source JSON
[ ] Add toggle for second/helper AI source mode
[✔] Add hidden/default image fallback if no image uploaded
[ ] Add remove image button if not already in HTML
[✔] Add model setting explanation cleanup

Image upload:
[✔] File input exists
[✔] Preview card image exists
[✔] Add default bot image when no upload exists

--- cut things due to me not wanting to deal with file storage and other bs for now. ---

-- [ ] Make uploaded image show in upload dropzone too -- CUT
[ ] Add X/remove image button
[ ] Reset card image when removed
[ ] Reset file input when removed
[ ] Validate image type later
[ ] Validate image size later
[ ] Later restrict upload to png/jpg/webp
-- [ ] Backend should eventually store image file path instead of base64 -- CUT due to not needed for small database currently

Live preview:
[✔] Preview card exists
[✔] Name preview exists
[✔] Bio preview exists
[✔] Tags preview exists
[ ] Make chat name preview if needed
[ ] Limit card name to 1 line
[ ] Sanitize bio preview by stripping HTML
[ ] Clamp bio preview to 3 lines
[ ] Keep full bio for bot page
[ ] Card should show only visible tags that fit
[ ] Full tag list should still show under form
[ ] Add default placeholder if name empty
[ ] Add default placeholder if bio empty
[✔] Add token total on card or below form

Token counters:
[✔] Individual token elements exist
[✔] Confirm JS updates personality token count
[✔] Confirm JS updates scenario token count
[✔] Confirm JS updates first message token count
[✔] Confirm JS updates example dialogue token count
[✔] Add total token counter element
[✔] Add total token update function
[✔] Count all prompt-related fields together
[✔] Initialize total tokens on page load

Tags:
[✔] Hard tag registry exists in tags.js
[✔] Tag input exists
[✔] Suggestion box exists
[✔] Preview tag area exists
[✔] Decide final tag data format: store without #, display with #
[✔] Ensure autocomplete ignores #
[✔] Ensure typing “ro” finds romance
[✔] Ensure typing “#ro” also finds romance
[✔] Make suggestion box absolute, not page-pushing
[✔] Make #tags_box position relative
[✔] Style suggested tags as chips
[✔] Add “Create #tag” fallback
[ ] Add Enter key behavior for adding typed tag
[✔] Add click behavior for suggestions
[✔] Add duplicate toggle behavior
[ ] Add remove-on-click or X on chip
[ ] Add max tags? You said users can add many, but confirm if bot submit should have no limit
[ ] Card preview should hide overflow tags instead of growing
[✔] Full form tag list should show all selected tags
[ ] Submit selectedTags as JSON
[ ] Backend should store selected tags with bot
[ ] Later create tags.db for custom tags
[ ] Later load custom tags from backend into autocomplete
[ ] Later search homepage by tags

Settings:
[✔] Settings section exists
[✔] Settings collapse exists
[✔] Custom settings checkbox exists
[✔] Model select exists
[✔] Sliders exist
[✔] Number inputs exist
[✔] Make settings disabled by default
[✔] Grey out settings when custom settings off
[✔] Unlock settings when checkbox on
[ ] Submit null/default values when custom settings off
[✔] Submit actual values when custom settings on
[ ] Make model dropdown prettier
[✔] Decide if model should be disabled with custom settings off
[ ] Add helper text for “Use custom settings”
[ ] Add visual “using site defaults” message when off
[ ] Add second/helper AI toggle
[ ] Add JSON source upload field
[ ] Disable JSON upload unless helper AI toggle is on
[ ] Submit JSON file later
[ ] Backend stores JSON/source file later

CSS cleanup:
[✔] #suggested_tags currently position: relative; should likely be absolute
[✔] #tags_input does not need position: relative
[✔] Add #tags_box { position: relative; }
[✔] Add max height/overflow hidden for card tag area
[✔] Make .preview-tag match theme better
[✔] Add disabled settings CSS class
[✔] Style select#models
[✔] Style file/dropzone selected state
[ ] Make top-section responsive on mobile
[ ] Make preview card centered on mobile
[ ] Confirm nav spacing with createbot form
*/

const BASE_URL = "https://api.arcanai.uk"


class main {
    constructor() {

        // for the main page get elements

        this.form = document.getElementById("create-bot-form")
        this.pfp = document.getElementById("pfpupload")
        this.cardPfp = document.getElementById("card-pfp")
        this.characterName = document.getElementById("character_name")
        this.chatName = document.getElementById("chat_name")
        this.tagsInput = document.getElementById("tags_input")
        this.tag_list = document.getElementById("tag_list")
        this.suggestbox = document.getElementById("suggested_tags")
        this.bio = document.getElementById("bio")
        this.personality = document.getElementById("personality")
        this.scenario = document.getElementById("scenario")
        this.firstMessage = document.getElementById("first_message_input")
        this.exampleDialogue = document.getElementById("example_dialogue_input")
        this.settingsHeader = document.getElementById("settings-header")
        this.settingsContent = document.getElementById("settings-content")
        this.useCustomSettings = document.getElementById("useCustomSettings")
        this.tokenCard = document.getElementById("tokenCard")
        this.personalityTokens = document.getElementById("personality_tokens")
        this.scenarioTokens = document.getElementById("scenario_tokens")
        this.firstMessageTokens = document.getElementById("first_message_tokens")
        this.exampleDialogueTokens = document.getElementById("example_dialogue_tokens")
        this.preview_name = document.getElementById("preview_name")
        this.bioCard = document.getElementById("preview_bio")
        this.preview_tags = document.getElementById("preview_tags")


        // Variables to hold data inside the class

        this.totalTokens = 0
        this.fullbio = ""
        this.selectedTags = []
        this.defaultPfp = "stylesheets/assets/blankpfp.jpg"
        this.bypass = 0

        // settings page get elements

        this.model = document.getElementById("models")

        this.temp = document.getElementById("temperature")
        this.tempNum = document.getElementById("temperatureNum")

        this.topP = document.getElementById("top_p")
        this.topPNum = document.getElementById("top_pNum")

        this.topK = document.getElementById("top_k")
        this.topKNum = document.getElementById("top_kNum")

        this.repetitionPenalty = document.getElementById("repetition_penalty")
        this.repetitionPenaltyNum = document.getElementById("repetition_penaltyNum")

        this.frequencyPenalty = document.getElementById("frequency_penalty")
        this.frequencyPenaltyNum = document.getElementById("frequency_penaltyNum")

        this.presencePenalty = document.getElementById("presence_penalty")
        this.presencePenaltyNum = document.getElementById("presence_penaltyNum")

        this.contextMessages = document.getElementById("context_messages")
        this.contextMessagesNum = document.getElementById("context_messagesNum")


        this.settingInputs = [
            this.model,

            this.temp,
            this.tempNum,

            this.topP,
            this.topPNum,

            this.topK,
            this.topKNum,

            this.repetitionPenalty,
            this.repetitionPenaltyNum,

            this.frequencyPenalty,
            this.frequencyPenaltyNum,

            this.presencePenalty,
            this.presencePenaltyNum,

            this.contextMessages,
            this.contextMessagesNum
        ]

        this.toggleCustomSettings()

        this.useCustomSettings.addEventListener("change", () => {
            this.toggleCustomSettings()
        })

        // sync all values
        this.sync(this.temp, this.tempNum)
        this.sync(this.topP, this.topPNum)
        this.sync(this.topK, this.topKNum)
        this.sync(this.repetitionPenalty, this.repetitionPenaltyNum)
        this.sync(this.frequencyPenalty, this.frequencyPenaltyNum)
        this.sync(this.presencePenalty, this.presencePenaltyNum)
        this.sync(this.contextMessages, this.contextMessagesNum)

        this.updateSliderFill(this.temp)
        this.updateSliderFill(this.topP)
        this.updateSliderFill(this.topK)
        this.updateSliderFill(this.repetitionPenalty)
        this.updateSliderFill(this.frequencyPenalty)
        this.updateSliderFill(this.presencePenalty)
        this.updateSliderFill(this.contextMessages)

        this.updateTokenCounter(this.personality, this.personalityTokens)
        this.updateTokenCounter(this.scenario, this.scenarioTokens)
        this.updateTokenCounter(this.firstMessage, this.firstMessageTokens)
        this.updateTokenCounter(this.exampleDialogue, this.exampleDialogueTokens)

        // Event listeners
        this.settingsHeader.addEventListener("click", () => {
            if (this.settingsContent.style.maxHeight) {
                this.settingsContent.style.maxHeight = null
            } else {
                this.settingsContent.style.maxHeight = this.settingsContent.scrollHeight + "px"
            }
        })
        this.form.addEventListener("submit", (e) => {
            e.preventDefault();
            console.log("submitted")
            this.submit()
        })

        this.personality.addEventListener("input", () => {
            this.updateTokenCounter(this.personality, this.personalityTokens)
        })

        this.scenario.addEventListener("input", () => {
            this.updateTokenCounter(this.scenario, this.scenarioTokens)
        })

        this.firstMessage.addEventListener("input", () => {
            this.updateTokenCounter(this.firstMessage, this.firstMessageTokens)
        })

        this.exampleDialogue.addEventListener("input", () => {
            this.updateTokenCounter(this.exampleDialogue, this.exampleDialogueTokens)
        })
        this.characterName.addEventListener("input", () => {
            this.updateCardData()
        }) 
        this.bio.addEventListener("input", () => {
            this.updateCardData()
            this.fullbio = this.bio.value
        })
        this.pfp.addEventListener("change", () => {
            if (this.pfp.files && this.pfp.files[0]) {

                const file = this.pfp.files[0]
                const reader = new FileReader()

                reader.onload = () => {
                    const imgURL = reader.result

                    // update card image
                    document.querySelector(".card-pfp").src = imgURL

                }

                reader.readAsDataURL(file)
            }
        })

        this.tagsInput.addEventListener("input", () => {
            let input = this.tagsInput.value.toLowerCase().replace("#", "")

            this.suggestbox.innerHTML = ""
            this.suggestbox.style.display = "block"

            let matches

            if (input.length === 0) {
                // 👇 SHOW ALL TAGS
                matches = tags
            } else {
                // 👇 FILTER TAGS
                matches = tags.filter(tag =>
                    tag.name.toLowerCase().replace("#", "").startsWith(input)
                )
            }

            // 👇 if no matches and user typed something → create option
            if (matches.length === 0 && input.length > 0) {
                const create = document.createElement("div")
                create.textContent = `Create #${input}`
                create.classList.add("suggested-tag")

                create.addEventListener("click", () => {
                    this.addTag(input, true)
                })

                this.suggestbox.appendChild(create)
                return
            }

            // 👇 render tags
            matches.forEach(tag => {
                const el = document.createElement("div")
                el.textContent = tag.name
                el.classList.add("suggested-tag")

                el.addEventListener("click", () => {
                    const clean = tag.name.replace("#", "")
                    this.addTag(clean, false)
                })

                this.suggestbox.appendChild(el)
            })
        })
        this.tagsInput.addEventListener("focus", () => {
            this.tagsInput.dispatchEvent(new Event("input"))
        })

        this.tagsInput.addEventListener("blur", () => {
            setTimeout(() => {
                this.suggestbox.innerHTML = ""
            }, 150)
        })

        this.tagsInput.addEventListener("focus", () => {
            this.suggestbox.style.display = "block"
        })

        document.addEventListener("click", (e) => {
            if (
                !this.tagsInput.contains(e.target) &&
                !this.suggestbox.contains(e.target)
            ) {
                this.suggestbox.style.display = "none"
            }
        })

    }

    addTag(tagName, isNew) {
        const clean = tagName.toLowerCase().replace("#", "").trim()

        if (clean.length === 0) return

        const existsIndex = this.selectedTags.indexOf(clean)

        // If tag already exists, remove it
        if (existsIndex !== -1) {
            this.selectedTags.splice(existsIndex, 1)
        } else {
            if (this.selectedTags.length >= 10) return

            this.selectedTags.push(clean)

            // If this is a brand new tag, add it to autocomplete registry
            if (isNew) {
                tags.push({
                    name: `#${clean}`,
                    color: "white"
                })
            }
        }

        this.renderTags()

        this.tagsInput.value = ""
        this.suggestbox.innerHTML = ""
    }

    createTagChip(tag) {
        const chip = document.createElement("span")

        chip.textContent = `#${tag}`
        chip.classList.add("preview-tag")

        // clicking an already-selected tag removes it
        chip.addEventListener("click", () => {
            const index = this.selectedTags.indexOf(tag)

            if (index !== -1) {
                this.selectedTags.splice(index, 1)
                this.renderTags()
            }
        })

        return chip
    }

    renderTags() {
        this.preview_tags.innerHTML = ""
        this.tag_list.innerHTML = ""

        if (this.selectedTags.length === 0) {
            this.preview_tags.textContent = "tags go here"
            this.tag_list.textContent = "No tags added yet"
            return
        }

        this.selectedTags.forEach(tag => {
            const cardChip = this.createTagChip(tag)
            const listChip = this.createTagChip(tag)

            this.preview_tags.appendChild(cardChip)
            this.tag_list.appendChild(listChip)
        })
    }

    updateCardData() {
        const name = this.characterName.value
        const bio = this.bio.value
        const tags = [] // you can implement tag input and push tags into this array


        this.preview_name.innerHTML = `<strong>${name}</strong>`
        this.bioCard.textContent = bio

        if (name.length === 0) {
            this.preview_name.innerHTML = `<strong>Character Name</strong>`
        }
        if (bio.length === 0) {
            this.bioCard.textContent = "short description goes here"
        }

    }

    updateTokenCounter(inputelement, outputelement) {
        const text = inputelement.value

        const tokens = this.getTokens(text)

        outputelement.textContent = `${tokens} tokens`

        const total = 
            this.getTokens(this.personality.value) +
            this.getTokens(this.scenario.value) +
            this.getTokens(this.firstMessage.value) +
            this.getTokens(this.exampleDialogue.value)

        this.totalTokens = total
        this.tokenCard.textContent = `${total} tokens`

    }

    getTokens(text) {
        return Math.floor(text.length / 4)
    }

    toggleCustomSettings() {
        const enabled = this.useCustomSettings.checked

        this.settingInputs.forEach(input => {
            input.disabled = !enabled

            if (input.type === "range") {
                this.updateSliderFill(input)
            }
        })
    }

    updateSliderFill(slider) {
        if (slider.disabled) {
            slider.style.background = "#202226"
            return
        }

        const min = slider.min || 0
        const max = slider.max || 100
        const val = slider.value

        const percent = ((val - min) / (max - min)) * 100

        slider.style.background = `linear-gradient(to right, #9b87f5 ${percent}%, #2b2e34 ${percent}%)`
    }

    sync(range, number) {
        // slider → number (always safe)
        range.addEventListener("input", () => {
            number.value = range.value
            this.updateSliderFill(range)
        })

        // number → slider (only if valid)
        number.addEventListener("input", () => {
            let val = parseFloat(number.value)

            if (!isNaN(val)) {
                range.value = val
                this.updateSliderFill(range)
            }
        })

        // FINAL clamp when user leaves field
        number.addEventListener("blur", () => {
            let val = parseFloat(number.value)

            const min = parseFloat(number.min)
            const max = parseFloat(number.max)

            if (isNaN(val)) val = min

            if (val > max) val = max
            if (val < min) val = min

            number.value = val
            range.value = val

            this.updateSliderFill(range)
        })
    }

    analyzeBot() {
        const issues = []

        if (this.personality.value.length < 200) {
            issues.push("WARNING: Bot personality is less than 200. This can cause issues with personality. Press submit to bypass.")
        }

        if (this.scenario.value.length < 200) {
            issues.push("WARNING: Scenario is less than 200 characters. This can create problems with setting. Press submit to bypass.")
        }

        if (this.exampleDialogue.value.length < 200) {
            issues.push("WARNING: Example dialogue is too short for realistic responses.")
        }

        if (this.firstMessage.value.length < 200) {
            issues.push("WARNING: The first message is less than 200 characters. This can cause issues with AI setting. Press submit to bypass.")
        }

        return issues
    }

    submit() {

        const accountId = localStorage.getItem("account_id")

        if (!accountId) {
            alert("You must be logged in to create a bot.")

            window.location.href = "../index.html"
            return
        }

        const issues = this.analyzeBot()

        if (issues.length > 0 && this.bypass === 0) {
            alert(issues.join("\n"))
            this.bypass = 1
            return
        }

        const form = new FormData()

        form.append("account_id", accountId)
        form.append("name", this.characterName.value)
        form.append("chatName", this.chatName.value)
        form.append("description", this.bio.value)
        form.append("personality", this.personality.value)
        form.append("scenario", this.scenario.value)
        form.append("firstMessage", this.firstMessage.value)
        form.append("exampleDialogue", this.exampleDialogue.value)
        form.append("temp", this.temp.value)
        form.append("topP", this.topP.value)
        form.append("topK", this.topK.value)
        form.append("repetitionPenalty", this.repetitionPenalty.value)
        form.append("frequencyPenalty", this.frequencyPenalty.value)
        form.append("presencePenalty", this.presencePenalty.value)
        form.append("contextMessages", this.contextMessages.value)
        form.append("tags", JSON.stringify(this.selectedTags))
        form.append("model", this.model.value)


        if (this.pfp.files.length > 0) {
            form.append("image", this.pfp.files[0])
        }
        

        fetch(`${BASE_URL}/submit`, {
            method: "POST",
            body: form
        })
        .then(res => res.json())
        .then(data => {if (data.ok) {this.bypass = 0, window.location.href = "home.html"}})

    }

}

new main()
