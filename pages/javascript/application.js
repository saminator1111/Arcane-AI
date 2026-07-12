const BASE_URL = "https://api.arcanai.uk";

class Application {
    constructor() {
        // Form element
        this.applicationForm = document.getElementById("application-form");

        // Required fields
        this.usernameField = document.getElementById("username-field");
        this.passwordField = document.getElementById("password-field");
        this.confirmPasswordField = document.getElementById("confirm-password-field");
        this.emailField = document.getElementById("email-field");
        this.descriptionField = document.getElementById("description-field");

        // Form fields wrapper
        this.usernameWrapper = document.getElementById("username-wrapper");
        this.emailWrapper = document.getElementById("email-wrapper");

        // Optional fields
        this.foundUsField = document.getElementById("found-us-field");
        this.referralField = document.getElementById("referral-field");

        // Checkboxes
        this.tosCheck = document.getElementById("tos-check");
        this.guidelinesCheck = document.getElementById("guidelines-check");
        this.ageCheck = document.getElementById("age-check");

        // Submit button
        this.submitButton = document.getElementById("submit-application-button");

        // Calling for local data
        const savedUser = JSON.parse(localStorage.getItem("user"));
        this.user = savedUser?.account_id || savedUser?.id || localStorage.getItem("account_id");

        // Field data storage
        this.usernamesData = [];
        this.emailsData = [];

        this.usernameField?.addEventListener("input", () => {
            this.error(
                this.usernameWrapper,
                "This name is already in use.",
                "username",
                this.usernamesData
            );
        });

        this.passwordField?.addEventListener("input", () => {
            this.validatePasswordMatch();
        });

        this.confirmPasswordField?.addEventListener("input", () => {
            this.validatePasswordMatch();
        });

        this.emailField?.addEventListener("input", () => {
            this.validateEmail();
        });

        this.applicationForm?.addEventListener("submit", (e) => {
            e.preventDefault();
            this.submitApplication();
        });

        if (this.user != null) {
            alert("You cannot make a new account if you are logged in. Please logout.");
        } else {
            console.log("loading");
            this.fetchUserData();
        }
    }

    async fetchUserData() {
        try {
            const res = await fetch(`${BASE_URL}/accounts`);

            if (!res.ok) {
                throw new Error(`Network error: ${res.status} ${res.statusText}`);
            }

            const data = await res.json();
            const accounts = data.accounts || [];

            const usernames = accounts.map((account) => account.username || "");
            const emails = accounts.map((account) => account.email || "");

            console.log("All usernames:", usernames);
            console.log("All emails:", emails);

            this.usernamesData = usernames;
            this.emailsData = emails;

            return { usernames, emails };
        } catch (err) {
            console.error("Failed to fetch accounts:", err);
            this.usernamesData = [];
            this.emailsData = [];
            return { usernames: [], emails: [] };
        }
    }

    validateEmail() {
        if (!this.emailField || !this.emailWrapper) {
            return;
        }

        const currentEmail = this.emailField.value.trim().toLowerCase();
        const validEmailPattern = /^[^ \t@]+@[^ \t@]+\.(com|gov|edu|org|net)$/i;
        const hasValidShape = validEmailPattern.test(currentEmail);

        const localPart = currentEmail.split("@")[0] || "";
        const localPartLongEnough = localPart.length >= 3;

        const isValid = hasValidShape && localPartLongEnough;

        console.log("Valid email?", isValid);

        if (!isValid) {
            this.removeError(this.emailWrapper);
            return;
        }

        this.error(
            this.emailWrapper,
            "This email is already in use, please change it, or login.",
            "email",
            this.emailsData || []
        );
    }

    validatePasswordMatch() {
        if (!this.passwordField || !this.confirmPasswordField) {
            return;
        }

        const password = this.passwordField.value.trim();
        const confirmPassword = this.confirmPasswordField.value.trim();
        const wrapper = this.confirmPasswordField.parentElement;

        if (!wrapper) {
            return;
        }

        if (confirmPassword.length === 0) {
            this.removeError(wrapper);
            return;
        }

        if (password !== confirmPassword) {
            this.showError(wrapper, "Passwords do not match.");
        } else {
            this.removeError(wrapper);
        }
    }

    error(parent, message, type, data) {
        if (!parent || !data || !Array.isArray(data)) {
            return;
        }

        let dataType;

        if (type === "username") dataType = this.usernameField;
        if (type === "email") dataType = this.emailField;
        if (type === "passwordCheck") dataType = this.confirmPasswordField;

        if (!dataType) {
            return;
        }

        const currentData = dataType.value.trim().toLowerCase();
        const taken = data.some((item) => String(item).toLowerCase() === currentData);

        if (taken) {
            this.showError(parent, message);
        } else {
            this.removeError(parent);
        }
    }

    showError(parent, message) {
        let err = parent.querySelector(".err-wrap");

        if (!err) {
            err = document.createElement("div");
            err.classList.add("err-wrap");
            parent.appendChild(err);
        }

        let errData = err.querySelector(".err-data");

        if (!errData) {
            errData = document.createElement("span");
            errData.classList.add("err-data");
            err.appendChild(errData);
        }

        errData.textContent = message;
    }

    removeError(parent) {
        const err = parent.querySelector(".err-wrap");

        if (err) {
            err.remove();
        }
    }

    submitApplication() {
        if (document.querySelector(".err-wrap")) {
            alert("I'm sorry, but you cannot submit the application due to errors in the forms. Please fix the errors and try again.");
            return;
        }

        if (!this.tosCheck.checked || !this.guidelinesCheck.checked || !this.ageCheck.checked) {
            alert("I'm sorry, but you cannot submit the application without agreeing to the Terms of Service, Guidelines, and confirming that you are over 18 years old.");
            return;
        }

        const profileDate = new Date().toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric"
        });

        const form = new FormData();

        form.append("username", this.usernameField.value.trim());
        form.append("email", this.emailField.value.trim());
        form.append("password", this.passwordField.value.trim());
        form.append("description", this.descriptionField.value.trim());
        form.append("profile_date", profileDate);

        if (this.foundUsField.value.trim()) {
            form.append("found_us", this.foundUsField.value.trim());
        }

        if (this.referralField.value.trim()) {
            form.append("referral", this.referralField.value.trim());
        }

        fetch(`${BASE_URL}/account_submit`, {
            method: "POST",
            body: form
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    alert("Your application has been submitted successfully! You can now log in.");
                    window.location.href = "login.html";
                } else {
                    alert(`Error submitting application: ${data.message || "Unknown error"}`);
                }
            })
            .catch(err => {
                console.error("Failed to submit application:", err);
                alert("Something went wrong while submitting your application.");
            });
    }
}

new Application();