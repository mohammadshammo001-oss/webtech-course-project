
// ==========================================
// 1. Rider Approval
// ==========================================

function approveRider(button) {
    let row = button.parentElement.parentElement;

    alert("Rider approved successfully!");

    row.cells[3].innerHTML =
        '<span class="status delivered">Approved</span>';
}

function rejectRider(button) {
    let row = button.parentElement.parentElement;

    alert("Rider application rejected!");

    row.cells[3].innerHTML =
        '<span class="status rejected">Rejected</span>';
}


// ==========================================
// 2. Add New Product
// ==========================================

let productForm = document.getElementById("productForm");

if (productForm) {

    productForm.addEventListener("submit", function(event) {

        event.preventDefault();

        let name = document.getElementById("productName").value;
        let price = document.getElementById("productPrice").value;

        let table = document.getElementById("productTable");

        let newRow = table.insertRow();

        newRow.innerHTML = `
            <td>${name}</td>
            <td>New Product</td>
            <td>৳ ${Number(price).toLocaleString("en-BD")}</td>
            <td><span class="status delivered">Available</span></td>
        `;

        alert("Product added successfully!");

        productForm.reset();

    });
}


// ==========================================
// 3. Rider Accept Order
// ==========================================

function acceptDelivery(button) {

    let row = button.parentElement.parentElement;

    alert("Order accepted successfully!");

    row.cells[4].innerHTML =
        '<span class="status delivered">Accepted</span>';

    let count = document.getElementById("availableCount");

    if (count) {
        count.innerText = Number(count.innerText) - 1;
    }
}


// ==========================================
// 4. Customer Reorder
// ==========================================

function reorder() {

    alert("Your reorder request has been submitted!");

}


// ==========================================
// 5. Order Tracking
// ==========================================

let currentStep = 2;

function updateTracking() {

    let steps = document.querySelectorAll(".step");

    let status = document.getElementById("trackingStatus");

    if (currentStep < 4) {

        currentStep++;

        for (let i = 0; i < steps.length; i++) {

            if (i < currentStep) {
                steps[i].classList.add("completed");
            }

        }

        let messages = [
            "Your order is confirmed.",
            "Your order is being prepared.",
            "Rider has picked up your order.",
            "Your order has been delivered!"
        ];

        if (status) {
            status.innerText = messages[currentStep - 1];
        }

    } else {

        alert("Your order has already been delivered!");

    }

}


// ==========================================
// 6. Login Role Selection
// ==========================================

let selectedRole = "Customer";

function selectRole(role) {

    selectedRole = role;

    let roleText = document.getElementById("selectedRole");

    if (roleText) {
        roleText.innerText = "Login as " + role;
    }

}


// ==========================================
// 7. Login Form and Dashboard Redirect
// ==========================================

let loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", function(event) {

        event.preventDefault();

        let email = document.getElementById("email").value;
        let password = document.getElementById("password").value;

        let errorMessage = document.getElementById("errorMessage");

        if (email.trim() === "" || password.trim() === "") {

            errorMessage.innerText =
                "Please enter email and password.";

            return;
        }

        errorMessage.innerText = "";

        if (selectedRole === "Customer") {

            window.location.href = "customer-profile.html";

        }

        else if (selectedRole === "Rider") {

            window.location.href = "rider-dashboard.html";

        }

        else if (selectedRole === "Admin") {

            window.location.href = "admin-dashboard.html";

        }

    });

}
