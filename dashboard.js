
/* =====================================
   PIXELCRAFT STUDIO — DASHBOARD
===================================== */

// Supabase Configuration
const SUPABASE_URL = "https://lcfwpnsbmnkmubmkcwmu.supabase.co";

const SUPABASE_ANON_KEY = "sb_publishable_yVsJv1Slv6oC8lzzLhhrFg_ZBdcLg80";

// Initialize Supabase
const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);


// Dashboard Elements
const totalEnquiries = document.querySelector("#totalEnquiries");
const recentEnquiries = document.querySelector("#recentEnquiries");
const totalServices = document.querySelector("#totalServices");

const tableBody = document.querySelector("#enquiriesTableBody");
const dashboardStatus = document.querySelector("#dashboardStatus");

const refreshButton = document.querySelector("#refreshButton");
const logoutButton = document.querySelector("#logoutButton");


// =====================================
// AUTHENTICATION CHECK
// =====================================


// =====================================
// AUTHENTICATION CHECK
// =====================================

async function checkAdminSession() {

    const { data, error } = await supabaseClient.auth.getSession();

    if (error || !data.session) {
        window.location.replace("admin.html");
        return false;
    }

    const adminUID = "97351209-7353-4d86-b50b-3dcd6596c2eb";

    const loggedInUID = data.session.user.id;

    if (loggedInUID !== adminUID) {
        await supabaseClient.auth.signOut();
        window.location.replace("admin.html");
        return false;
    }

    return true;
}


// =====================================
// CREATE TABLE CELL SAFELY
// =====================================

function createCell(value) {

    const cell = document.createElement("td");
    cell.textContent = value || "—";

    return cell;
}


// =====================================
// LOAD ENQUIRIES
// =====================================


async function loadEnquiries() {

    refreshButton.disabled = true;
    refreshButton.textContent = "Loading...";
    dashboardStatus.textContent = "Fetching enquiries...";

    try {

        const { data, error } = await supabaseClient
            .from("enquiries")
            .select("id, created_at, name, email, phone, service, budget, message, status")
            .order("created_at", { ascending: false });

        if (error) throw error;

        const allEnquiries = data || [];

const searchTerm = document
    .querySelector("#enquirySearch")
    .value.trim().toLowerCase();

const selectedStatus = document
    .querySelector("#statusFilter")
    .value;

const enquiries = allEnquiries.filter(item => {

    const matchesSearch =
        (item.name || "").toLowerCase().includes(searchTerm) ||
        (item.email || "").toLowerCase().includes(searchTerm) ||
        (item.phone || "").toLowerCase().includes(searchTerm) ||
        (item.service || "").toLowerCase().includes(searchTerm);

    const matchesStatus =
        selectedStatus === "All" ||
        (item.status || "New") === selectedStatus;

    return matchesSearch && matchesStatus;

});

         // UPDATE DASHBOARD STATISTICS

         
// =====================================
// RECENT ACTIVITY
// =====================================

const recentActivityList = document.querySelector("#recentActivityList");

recentActivityList.replaceChildren();

const recentItems = [...allEnquiries].slice(0, 5);

if (recentItems.length === 0) {

    const emptyMessage = document.createElement("p");
    emptyMessage.className = "empty-state";
    emptyMessage.textContent = "No recent enquiries yet.";

    recentActivityList.appendChild(emptyMessage);

} else {

    recentItems.forEach(item => {

        const activityItem = document.createElement("div");
        activityItem.className = "activity-item";

        const activityInfo = document.createElement("div");
        activityInfo.className = "activity-info";

        const customerName = document.createElement("strong");
        customerName.textContent = item.name || "Unknown Customer";

        const serviceName = document.createElement("p");
        serviceName.textContent = item.service || "Service not specified";

        const activityDate = document.createElement("small");
        activityDate.textContent = item.created_at
            ? new Date(item.created_at).toLocaleString("en-IN")
            : "Date unavailable";

        const activityStatus = document.createElement("span");
        activityStatus.className = "activity-status";
        activityStatus.textContent = item.status || "New";

        activityInfo.append(customerName, serviceName, activityDate);
        activityItem.append(activityInfo, activityStatus);

        recentActivityList.appendChild(activityItem);

    });

}


totalEnquiries.textContent = allEnquiries.length;

document.querySelector("#newEnquiries").textContent =
    allEnquiries.filter(item => (item.status || "New") === "New").length;

document.querySelector("#contactedEnquiries").textContent =
    allEnquiries.filter(item => item.status === "Contacted").length;

document.querySelector("#completedEnquiries").textContent =
    allEnquiries.filter(item => item.status === "Completed").length;
    
        tableBody.replaceChildren();

        if (enquiries.length === 0) {

            const row = document.createElement("tr");
            const cell = document.createElement("td");

            cell.colSpan = 6;
            cell.className = "empty-state";
            cell.textContent = "No enquiries received yet.";

            row.appendChild(cell);
            tableBody.appendChild(row);

        } else {

            enquiries.forEach(item => {

                const row = document.createElement("tr");

                const clientCell = document.createElement("td");

                const clientName = document.createElement("strong");
                clientName.textContent = item.name || "Unknown";

                const clientEmail = document.createElement("small");
                clientEmail.textContent = item.email || "No email";
                clientEmail.style.display = "block";
                clientEmail.style.marginTop = "5px";
                clientEmail.style.color = "#aaa2b8";

                const clientPhone = document.createElement("small");
clientPhone.textContent = item.phone
    ? item.phone
    : "No phone number";

clientPhone.style.display = "block";
clientPhone.style.marginTop = "5px";
clientPhone.style.color = "#00d9ff";

clientCell.append(clientName, clientEmail, clientPhone);

                const serviceCell = createCell(item.service);
                const budgetCell = createCell(item.budget);

                const dateCell = createCell(
                    item.created_at
                        ? new Date(item.created_at).toLocaleDateString("en-IN")
                        : "—"
                );

                const messageCell = createCell(item.message);

                // STATUS DROPDOWN
                const statusCell = document.createElement("td");
                const statusSelect = document.createElement("select");

                const statuses = [
                    "New",
                    "Contacted",
                    "In Progress",
                    "Completed"
                ];

                statuses.forEach(status => {
                    const option = document.createElement("option");
                    option.value = status;
                    option.textContent = status;
                    statusSelect.appendChild(option);
                });

                const currentStatus = item.status || "New";
                statusSelect.value = currentStatus;

                statusSelect.addEventListener("change", async () => {

                    const newStatus = statusSelect.value;
                    statusSelect.disabled = true;

                    const { error } = await supabaseClient
                        .from("enquiries")
                        .update({ status: newStatus })
                        .eq("id", item.id);

                    if (error) {

                        console.error("Status Update Error:", error);
                        statusSelect.value = currentStatus;
                        dashboardStatus.textContent =
                            "Unable to update status. Please try again.";

                    } else {

                        item.status = newStatus;
                        dashboardStatus.textContent =
                            `Enquiry status updated to ${newStatus}.`;

                    }

                    statusSelect.disabled = false;

                });

                statusCell.appendChild(statusSelect);

                // VIEW DETAILS BUTTON
const actionsCell = document.createElement("td");

const viewButton = document.createElement("button");
viewButton.type = "button";
viewButton.className = "view-details-btn";
viewButton.textContent = "View Details";

viewButton.addEventListener("click", () => {
    openEnquiryDetails(item);
});

actionsCell.appendChild(viewButton);


// WHATSAPP QUICK ACTION
const whatsappButton = document.createElement("button");

whatsappButton.type = "button";
whatsappButton.className = "whatsapp-action-btn";
whatsappButton.textContent = "WhatsApp";

whatsappButton.disabled = !item.phone;

whatsappButton.addEventListener("click", () => {

    let phone = (item.phone || "").replace(/\D/g, "");

    // Add India country code for 10-digit numbers
    if (phone.length === 10) {
        phone = "91" + phone;
    } else if (phone.startsWith("0") && phone.length === 11) {
        phone = "91" + phone.slice(1);
    }

    if (!phone) return;

    const message =
        `Hello ${item.name || "there"}, this is PixelCraft Studio regarding your enquiry for ${item.service || "our services"}.`;

    const whatsappURL =
        `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

    window.open(whatsappURL, "_blank");

});

actionsCell.appendChild(whatsappButton);


// EMAIL QUICK ACTION
const emailButton = document.createElement("button");

emailButton.type = "button";
emailButton.className = "email-action-btn";
emailButton.textContent = "Email";

emailButton.disabled = !item.email;

emailButton.addEventListener("click", () => {

    if (!item.email) return;

    const subject = "Regarding your PixelCraft Studio enquiry";

    const body =
        `Hello ${item.name || "there"},\n\nThank you for contacting PixelCraft Studio. We are getting in touch regarding your enquiry for ${item.service || "our services"}.\n\nRegards,\nPixelCraft Studio`;

    const mailtoURL =
        `mailto:${item.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    window.location.href = mailtoURL;

});

actionsCell.appendChild(emailButton);


// DELETE BUTTON
const deleteButton = document.createElement("button");

deleteButton.type = "button";
deleteButton.className = "delete-enquiry-btn";
deleteButton.textContent = "Delete";

deleteButton.addEventListener("click", async () => {

    const confirmDelete = confirm(
        `Are you sure you want to delete the enquiry from ${item.name}?`
    );

    if (!confirmDelete) return;

    deleteButton.disabled = true;
    deleteButton.textContent = "Deleting...";

    try {

        const { error } = await supabaseClient
            .from("enquiries")
            .delete()
            .eq("id", item.id);

        if (error) throw error;

        dashboardStatus.textContent = "Enquiry deleted successfully.";

        await loadEnquiries();

    } catch (error) {

        console.error("Delete Error:", error);

        dashboardStatus.textContent =
            "Unable to delete enquiry. Please try again.";

        deleteButton.disabled = false;
        deleteButton.textContent = "Delete";

    }

});

actionsCell.appendChild(deleteButton);

               row.append(
    clientCell,
    serviceCell,
    budgetCell,
    dateCell,
    messageCell,
    statusCell,
    actionsCell
);
                tableBody.appendChild(row);

            });

        }

        dashboardStatus.textContent =
            `Successfully loaded ${enquiries.length} enquiries.`;

    } catch (error) {

        console.error("Dashboard Error:", error);

        dashboardStatus.textContent =
            "Unable to load enquiries. Check your access permissions.";

        tableBody.replaceChildren();

        const row = document.createElement("tr");
        const cell = document.createElement("td");

        cell.colSpan = 6;
        cell.className = "empty-state";
        cell.textContent = "Unable to load enquiries.";

        row.appendChild(cell);
        tableBody.appendChild(row);

    } finally {

        refreshButton.disabled = false;
        refreshButton.textContent = "↻ Refresh";

    }

}


// =====================================
// REFRESH BUTTON
// =====================================

refreshButton.addEventListener("click", loadEnquiries);


// =====================================
// LOGOUT
// =====================================

logoutButton.addEventListener("click", async () => {

    logoutButton.disabled = true;
    logoutButton.textContent = "Logging out...";

    const { error } = await supabaseClient.auth.signOut();

    if (error) {

        console.error("Logout Error:", error);

        logoutButton.disabled = false;
        logoutButton.textContent = "↪ Logout";

        dashboardStatus.textContent = "Unable to logout. Please try again.";

        return;
    }

    window.location.replace("admin.html");

});


// =====================================
// START DASHBOARD
// =====================================

async function initializeDashboard() {

    const isAuthenticated = await checkAdminSession();

    if (!isAuthenticated) {
        return;
    }

    await loadEnquiries();

}

initializeDashboard();

// =====================================
// ENQUIRY DETAILS MODAL
// =====================================

const enquiryModal = document.querySelector("#enquiryModal");
const closeEnquiryModal = document.querySelector("#closeEnquiryModal");

function openEnquiryDetails(item) {

    document.querySelector("#detailName").textContent = item.name || "—";
    document.querySelector("#detailEmail").textContent = item.email || "—";
    document.querySelector("#detailPhone").textContent = item.phone || "—";
    document.querySelector("#detailService").textContent = item.service || "—";
    document.querySelector("#detailBudget").textContent = item.budget || "—";
    document.querySelector("#detailMessage").textContent = item.message || "No message provided";

    document.querySelector("#detailDate").textContent =
        item.created_at
            ? new Date(item.created_at).toLocaleString("en-IN")
            : "—";

    enquiryModal.classList.add("show");
    enquiryModal.setAttribute("aria-hidden", "false");
}

function hideEnquiryModal() {
    enquiryModal.classList.remove("show");
    enquiryModal.setAttribute("aria-hidden", "true");
}

closeEnquiryModal.addEventListener("click", hideEnquiryModal);

enquiryModal.addEventListener("click", (event) => {
    if (event.target === enquiryModal) {
        hideEnquiryModal();
    }
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && enquiryModal.classList.contains("show")) {
        hideEnquiryModal();
    }
});


// =====================================
// DASHBOARD VIEW NAVIGATION
// =====================================

const viewLinks = document.querySelectorAll("[data-view-link]");
const viewSections = document.querySelectorAll("[data-view]");

viewLinks.forEach((link) => {

    link.addEventListener("click", (event) => {

        event.preventDefault();

        const targetView = link.dataset.viewLink;

        // Hide all sections
        viewSections.forEach((section) => {
            section.classList.remove("active-view");
        });

        // Remove active state from all links
        viewLinks.forEach((navLink) => {
            navLink.classList.remove("active");
        });

        // Show selected section
        const selectedSection = document.querySelector(
            `[data-view="${targetView}"]`
        );

        if (selectedSection) {
            selectedSection.classList.add("active-view");
            link.classList.add("active");
        }

        // Update URL
        history.replaceState(null, "", `#${targetView}`);

    });

});

// =====================================
// ENQUIRY SEARCH & FILTER
// =====================================

const enquirySearch = document.querySelector("#enquirySearch");
const statusFilter = document.querySelector("#statusFilter");

enquirySearch.addEventListener("input", () => {
    loadEnquiries();
});

statusFilter.addEventListener("change", () => {
    loadEnquiries();
});


// =====================================
// EXPORT ENQUIRIES AS CSV
// =====================================

const exportEnquiriesBtn = document.querySelector("#exportEnquiriesBtn");

exportEnquiriesBtn.addEventListener("click", async () => {

    exportEnquiriesBtn.disabled = true;
    exportEnquiriesBtn.textContent = "Preparing...";

    try {

        const { data, error } = await supabaseClient
            .from("enquiries")
            .select("id, created_at, name, email, phone, service, budget, message, status")
            .order("created_at", { ascending: false });

        if (error) throw error;

        if (!data || data.length === 0) {
            dashboardStatus.textContent = "No enquiries available to export.";
            return;
        }

        const headers = [
            "ID",
            "Date",
            "Name",
            "Email",
            "Phone",
            "Service",
            "Budget",
            "Message",
            "Status"
        ];

        const escapeCSV = (value) =>
            `"${String(value ?? "").replace(/"/g, '""')}"`;

        const rows = data.map(item => [
            item.id,
            item.created_at,
            item.name,
            item.email,
            item.phone,
            item.service,
            item.budget,
            item.message,
            item.status || "New"
        ]);

        const csvContent = [
            headers,
            ...rows
        ].map(row => row.map(escapeCSV).join(",")).join("\r\n");

        const blob = new Blob(
            ["\uFEFF" + csvContent],
            { type: "text/csv;charset=utf-8;" }
        );

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.href = url;
        link.download = "PixelCraft_Enquiries.csv";

        document.body.appendChild(link);
        link.click();
        link.remove();

        URL.revokeObjectURL(url);

        dashboardStatus.textContent =
            "Enquiries exported successfully!";

    } catch (error) {

        console.error("Export Error:", error);

        dashboardStatus.textContent =
            "Unable to export enquiries. Please try again.";

    } finally {

        exportEnquiriesBtn.disabled = false;
        exportEnquiriesBtn.textContent = "↓ Export CSV";

    }

});
