
// =====================================
// 1. LOGIN PAGE
// =====================================

var selectedRole = "Customer";

function selectRole(role) {
    selectedRole = role;

    document.getElementById("selectedRole").innerHTML =
        "Login as " + role;
}

var loginForm = document.getElementById("loginForm");

if (loginForm != null) {

    loginForm.addEventListener("submit", function(event) {

        event.preventDefault();

        var email = document.getElementById("email").value.trim().toLowerCase();
        var password = document.getElementById("password").value;
        var error = document.getElementById("errorMessage");

        if (email == "" || password == "") {
            error.innerHTML = "Please fill in all fields.";
            return;
        }

        // DEMO LOGIN ACCOUNTS

        var demoAccounts = [
            {
                email: "iftekhar@gmail.com",
                password: "123456",
                role: "Admin",
                dashboard: "admin-dashboard.html"
            },
            {
                email: "rohan@gmail.com",
                password: "123456",
                role: "Customer",
                dashboard: "customer-profile.html"
            },
            {
                email: "rafi@gmail.com",
                password: "123456",
                role: "Rider",
                dashboard: "rider-dashboard.html"
            }
        ];

        var loginSuccess = false;

        // CHECK DEMO ACCOUNTS

        for (var i = 0; i < demoAccounts.length; i++) {

            if (
                demoAccounts[i].email == email &&
                demoAccounts[i].password == password &&
                demoAccounts[i].role == selectedRole
            ) {

                loginSuccess = true;

                localStorage.setItem("currentUserEmail", email);
                localStorage.setItem("currentUserRole", selectedRole);

                window.location.href = demoAccounts[i].dashboard;

                break;
            }
        }

        // CHECK REGISTERED CUSTOMER OR RIDER ACCOUNTS

        if (loginSuccess == false && selectedRole != "Admin") {

            var accounts = JSON.parse(
                localStorage.getItem("foodiegoAccounts")
            ) || [];

            for (var j = 0; j < accounts.length; j++) {

                if (
                    accounts[j].email.toLowerCase() == email &&
                    accounts[j].password == password &&
                    accounts[j].role == selectedRole
                ) {

                    loginSuccess = true;

                    localStorage.setItem("currentUserEmail", email);
                    localStorage.setItem("currentUserRole", selectedRole);

                    if (selectedRole == "Customer") {
                        window.location.href = "customer-profile.html";
                    }

                    else if (selectedRole == "Rider") {
                        window.location.href = "rider-dashboard.html";
                    }

                    break;
                }
            }
        }

        if (loginSuccess == false) {

            error.innerHTML =
                "Invalid email, password or selected role.";

        }

    });
}


// =====================================
// 2. CUSTOMER REGISTRATION PAGE
// =====================================

var customerForm = document.getElementById("customerForm");

if (customerForm != null) {

    customerForm.addEventListener("submit", function(event) {

        event.preventDefault();

        var name = document.getElementById("customerName").value;
        var email = document.getElementById("customerEmail").value.trim();
        var phone = document.getElementById("customerPhone").value;
        var password = document.getElementById("customerPassword").value;
        var message = document.getElementById("customerMessage");

        if (name == "" || email == "" || phone == "" || password == "") {

            message.innerHTML = "Please fill in all fields.";

        }

        else if (email.includes("@") == false ||
                 email.includes(".") == false) {

            message.innerHTML = "Please enter a valid email address.";

        }

        else if (isNaN(phone) || phone.length != 11) {

            message.innerHTML = "Please enter a valid 11-digit phone number.";

        }

        else if (password.length < 6) {

            message.innerHTML = "Password must contain at least 6 characters.";

        }

        else {

            var accounts = JSON.parse(
                localStorage.getItem("foodiegoAccounts")
            ) || [];

            var accountExists = false;

            for (var i = 0; i < accounts.length; i++) {

                if (accounts[i].email == email) {
                    accountExists = true;
                }
            }

            if (accountExists == true) {

                message.innerHTML = "This email is already registered.";

            }

            else {

                var newAccount = {
                    name: name,
                    email: email,
                    phone: phone,
                    password: password,
                    role: "Customer"
                };

                accounts.push(newAccount);

                localStorage.setItem(
                    "foodiegoAccounts",
                    JSON.stringify(accounts)
                );

                localStorage.setItem("currentUserEmail", email);

                message.innerHTML =
                    'Registration successful! <a href="register-customer-profile.html">Continue to Delivery Profile</a>';

            }
        }

    });
}


// =====================================
// 3. CUSTOMER DELIVERY PROFILE PAGE
// =====================================

var profileForm = document.getElementById("profileForm");

if (profileForm != null) {

    var currentEmail = localStorage.getItem("currentUserEmail");

    var savedAccounts = JSON.parse(
        localStorage.getItem("foodiegoAccounts")
    ) || [];

    var currentCustomer = null;

    for (var i = 0; i < savedAccounts.length; i++) {

        if (savedAccounts[i].email == currentEmail &&
            savedAccounts[i].role == "Customer") {

            currentCustomer = savedAccounts[i];
            break;
        }
    }

    // LOAD SAVED DELIVERY ADDRESS

    if (currentCustomer != null &&
        currentCustomer.deliveryAddress != null) {

        document.getElementById("houseNumber").value =
            currentCustomer.deliveryAddress.house;

        document.getElementById("roadNumber").value =
            currentCustomer.deliveryAddress.road;

        document.getElementById("blockNumber").value =
            currentCustomer.deliveryAddress.block;

        document.getElementById("landmark").value =
            currentCustomer.deliveryAddress.landmark;

        document.getElementById("deliveryArea").value =
            currentCustomer.deliveryAddress.area;

    }


    // SAVE DELIVERY ADDRESS

    profileForm.addEventListener("submit", function(event) {

        event.preventDefault();

        var house = document.getElementById("houseNumber").value;
        var road = document.getElementById("roadNumber").value;
        var block = document.getElementById("blockNumber").value;
        var landmark = document.getElementById("landmark").value;
        var area = document.getElementById("deliveryArea").value;

        var message = document.getElementById("profileMessage");

        var currentEmail = localStorage.getItem("currentUserEmail");

        if (currentEmail == null) {

            message.innerHTML = "Please log in as a Customer first.";

        }

        else if (house == "" || road == "" || block == "" || area == "") {

            message.innerHTML = "Please fill in all required fields.";

        }

        else {

            var accounts = JSON.parse(
                localStorage.getItem("foodiegoAccounts")
            ) || [];

            var customerFound = false;

            for (var i = 0; i < accounts.length; i++) {

                if (accounts[i].email == currentEmail &&
                    accounts[i].role == "Customer") {

                    accounts[i].deliveryAddress = {
                        house: house,
                        road: road,
                        block: block,
                        landmark: landmark,
                        area: area
                    };

                    customerFound = true;
                    break;
                }
            }

            if (customerFound == true) {

                localStorage.setItem(
                    "foodiegoAccounts",
                    JSON.stringify(accounts)
                );

                message.innerHTML =
                    "Delivery profile saved successfully!";

            }

            else {

                message.innerHTML =
                    "Customer account not found. Please log in again.";

            }
        }

    });

}


// =====================================
// 4. RIDER REGISTRATION PAGE
// =====================================

var riderForm = document.getElementById("riderForm");

if (riderForm != null) {

    riderForm.addEventListener("submit", function(event) {

        event.preventDefault();

        var name = document.getElementById("riderName").value;
        var email = document.getElementById("riderEmail").value.trim();
        var password = document.getElementById("riderPassword").value;
        var nid = document.getElementById("riderNID").value;
        var vehicle = document.getElementById("vehicleType").value;
        var license = document.getElementById("licenseNumber").value;

        var message = document.getElementById("riderMessage");

        if (name == "" || email == "" || password == "" ||
            nid == "" || vehicle == "" || license == "") {

            message.innerHTML = "Please fill in all fields.";

        }

        else if (email.includes("@") == false ||
                 email.includes(".") == false) {

            message.innerHTML = "Please enter a valid email address.";

        }

        else if (password.length < 6) {

            message.innerHTML = "Password must contain at least 6 characters.";

        }

        else if (isNaN(nid) || nid.length < 10 || nid.length > 17) {

            message.innerHTML = "Please enter a valid NID number.";

        }

        else if (license.length < 5 || license.length > 20) {

            message.innerHTML = "Please enter a valid license number.";

        }

        else {

            var accounts = JSON.parse(
                localStorage.getItem("foodiegoAccounts")
            ) || [];

            var accountExists = false;

            for (var i = 0; i < accounts.length; i++) {

                if (accounts[i].email == email) {
                    accountExists = true;
                }
            }

            if (accountExists == true) {

                message.innerHTML = "This email is already registered.";

            }

            else {

                var newAccount = {
                    name: name,
                    email: email,
                    password: password,
                    role: "Rider",
                    nid: nid,
                    vehicle: vehicle,
                    license: license
                };

                accounts.push(newAccount);

                localStorage.setItem(
                    "foodiegoAccounts",
                    JSON.stringify(accounts)
                );

                message.innerHTML = "Rider registration successful!";

            }
        }

    });

}
