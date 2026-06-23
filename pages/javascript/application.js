const BASE_URL = "https://api.arcanai.uk"

class application {
    constructor() {
        // Form element
        this.applicationForm = document.getElementById('application-form');
        
        // Required fields
        this.usernameField = document.getElementById('username-field');
        this.passwordField = document.getElementById('password-field');
        this.confirmPasswordField = document.getElementById('confirm-password-field');
        this.emailField = document.getElementById('email-field');
        this.descriptionField = document.getElementById('description-field');

        // Form Fields Wrapper
        this.usernameWrapper = document.getElementById("username-wrapper")
        this.emailWrapper = document.getElementById("email-wrapper")
        
        // Optional fields
        this.foundUsField = document.getElementById('found-us-field');
        this.referralField = document.getElementById('referral-field');
        
        // Checkboxes
        this.tosCheck = document.getElementById('tos-check');
        this.guidelinesCheck = document.getElementById('guidelines-check');
        this.ageCheck = document.getElementById('age-check');
        
        // Submit button
        this.submitButton = document.getElementById('submit-application-button');

        // Calling for local data
        this.user = JSON.parse(localStorage.getItem('user'))?.id;

        // Field data storage
        this.usernamesData;
        this.emailsData;

        this.main()

        this.usernameField.addEventListener("input", (event) => {
            this.error(this.usernameWrapper, "This name is already in use.", "username", this.usernamesData)
        })

        this.confirmPasswordField.addEventListener("input", (event) => {
            const currentPassword = this.passwordField.value.trim()
            const validPasswordPattern;
        })

        this.emailField.addEventListener("input", () => {
            const currentEmail = this.emailField.value.trim().toLowerCase()
            const validEmailPattern = /^[^\s@]+@[^\s@]+\.(com|gov|edu|org|net)$/i
            const hasValidShape = validEmailPattern.test(currentEmail)

            const localPart = currentEmail.split("@")[0] || ""
            const localPartLongEnough = localPart.length >= 3

            const isValid = hasValidShape && localPartLongEnough

            console.log("Valid email?", isValid)

            if (!isValid) {
                const err = this.emailWrapper.querySelector(".err-wrap")
                if (err) {
                    err.remove()
                }
                return
            }

            this.error(
                this.emailWrapper,
                "This email is already in use, please change it, or login.",
                "email",
                this.emailsData
            )
        })

        // Initialize after listeners
        this.main()
    }

    main() {
        if (this.user != null) {
            alert("You cannot make a new account if you are logged in. Please logout.")
        } else {
            console.log("loading")
            this.fetchUserData()
        }
    }

    async fetchUserData() {
        try {
            const res = await fetch(`${BASE_URL}/accounts`);

            if (!res.ok) {
                throw new Error(`Network error: ${res.status} ${res.statusText}`);
            }

            const data = await res.json();

            const usernames = (data.accounts || []).map(account => account.username);
            const emails = (data.accounts || []).map(account => account.email)

            console.log("All usernames:", usernames);
            console.log("All emails:", emails)

            this.usernamesData = usernames;
            this.emailsData = emails

            return usernames, emails;
        } catch (err) {
            console.error("Failed to fetch accounts:", err);
            return [];
        }
    }

    error(parent, message, type, data) {
        let dataType;

        if (type === "username") dataType = this.usernameField;
        if (type === "email") dataType = this.emailField;
        if (type === "passwordCheck") dataType = this.confirmPasswordField

        const currentData = dataType.value.trim().toLowerCase();
        const taken = data.some(item => item.toLowerCase() === currentData);

        let err = parent.querySelector(".err-wrap");

        if (taken) {
            if (!err) {
                err = document.createElement("div");
                const errData = document.createElement("span");

                err.classList.add("err-wrap");
                errData.classList.add("err-data");
                errData.textContent = message;

                err.appendChild(errData);
                parent.appendChild(err);
            }
        } else {
            if (err) {
                err.remove();
            }
        }
    }
}

new application()