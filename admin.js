
/* =====================================
   PIXELCRAFT STUDIO — ADMIN AUTH
===================================== */

// Supabase Configuration
const SUPABASE_URL = "https://lcfwpnsbmnkmubmkcwmu.supabase.co";

const SUPABASE_ANON_KEY = "sb_publishable_yVsJv1Slv6oC8lzzLhhrFg_ZBdcLg80";

// Initialize Supabase
const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);

// Login Elements
const loginForm = document.querySelector("#adminLoginForm");
const loginStatus = document.querySelector("#loginStatus");
const togglePassword = document.querySelector("#togglePassword");
const passwordInput = document.querySelector("#adminPassword");

// Show / Hide Password
if (togglePassword && passwordInput) {

    togglePassword.addEventListener("click", () => {

        const isPassword = passwordInput.type === "password";

        passwordInput.type = isPassword ? "text" : "password";

        togglePassword.textContent = isPassword ? "Hide" : "Show";

        togglePassword.setAttribute(
            "aria-label",
            isPassword ? "Hide password" : "Show password"
        );

    });

}

// Admin Login
if (loginForm) {

    loginForm.addEventListener("submit", async (event) => {

        event.preventDefault();

        const email = document.querySelector("#adminEmail").value.trim();
        const password = passwordInput.value;

        const submitButton = loginForm.querySelector(
            'button[type="submit"]'
        );

        submitButton.disabled = true;
        submitButton.textContent = "Authenticating...";

        loginStatus.textContent = "";

        try {

            const { data, error } =
                await supabaseClient.auth.signInWithPassword({
                    email: email,
                    password: password
                });

            if (error) {
                throw error;
            }

            console.log("Admin login successful!");

            loginStatus.textContent = "Login successful! Opening dashboard...";

            window.location.href = "dashboard.html";

        } catch (error) {

            console.error("Admin Login Error:", error);

            loginStatus.textContent =
                "Invalid email or password. Please try again.";

        } finally {

            submitButton.disabled = false;
            submitButton.textContent = "Access Dashboard ↗";

        }

    });

}
