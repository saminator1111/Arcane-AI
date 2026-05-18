class Login {
    constructor() {
        this.username = document.getElementById("username")
        this.password = document.getElementById("password")
        this.button = document.getElementById("submit")
        this.headerwrap = document.getElementById("header-wrapper")
        this.registerButton = document.getElementById("register")

        this.registerButton.addEventListener("click", () => {
            window.location.href = "pages/register.html"
        })

        this.button.addEventListener("click", (event) => {this.login(event)})

        this.username.addEventListener("keydown", (event) => {
            if (event.key === "Enter") this.login(event)
        })

        this.password.addEventListener("keydown", (event) => {
            if (event.key === "Enter") this.login(event)
        })
    }

    async login(event) {
        if (event) event.preventDefault()

        const username = this.username.value.trim()
        const password = this.password.value

        if (!username || !password) {
            this.showError("Enter your username and password.")
            return
        }

        this.setLoading(true)

        try {
            const res = await fetch("http://localhost:3000/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username: username,
                    password: password
                })
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.detail || "Login request failed.")
            }

            if (data.ok && data.account_id) {
                localStorage.setItem("account_id", String(data.account_id))
                localStorage.setItem("username", data.username || username)

                window.location.href = "pages/home.html"
                return
            }

            this.showError("Username or password is incorrect...")
        } catch (error) {
            this.showError("Could not log in. Make sure the server is running.")
            console.error(error)
        } finally {
            this.setLoading(false)
        }
    }

    showError(message) {
        let error = document.getElementById("error")

        if (!error) {
            error = document.createElement("div")
            error.id = "error"
            this.headerwrap.appendChild(error)
        }

        error.innerText = message
        error.style.color = "red"
    }

    setLoading(isLoading) {
        this.button.disabled = isLoading
        this.button.innerText = isLoading ? "Logging in..." : "Submit"
    }
}

new Login()
