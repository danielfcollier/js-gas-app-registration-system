var customerData;

function loadView(options) {
    const id = options.id || "app";
    const callback = options.callback || function () { };

    loadingStart();
    google.script.run.withSuccessHandler(html => {
        document.getElementById(id).innerHTML = html;
        loadingEnd();
        callback(options.params || null);
    })[options.func]();
}

function setDataForSearch() {
    loadingStart();
    google.script.run.withSuccessHandler(dataReturned => {
        customerData = dataReturned.slice();
        loadingEnd();
    }).getDataForSearch();
}

function search() {
    const searchInput = document.getElementById("search-input").value.toString().toLowerCase().trim();
    const searchWords = searchInput.split(/\s+/);
    const searchColumns = [1, 2];

    const searchResults = searchInput === "" ? [] : customerData.filter(r => {
        return searchWords.every(word => {
            return searchColumns.some(colIndex => {
                return r[colIndex].toString().toLowerCase().indexOf(word) !== -1
            });
        });
    });


    //document.getElementById("search-counter").textContent = "0";

    const searchResultsBox = document.getElementById("search-results");
    const templateBox = document.getElementById("row-template");
    const template = templateBox.content;

    searchResultsBox.innerHTML = "";

    searchResults.forEach(r => {
        const row = template.cloneNode(true);
        const customerIdColumn = row.querySelector(".customerId");
        const firstNameColumn = row.querySelector(".firstName");
        const lastNameColumn = row.querySelector(".lastName");
        const deleteButton = row.querySelector(".delete-button");
        const editButton = row.querySelector(".edit-button");

        customerIdColumn.textContent = r[0];
        deleteButton.dataset.customerId = r[0];
        editButton.dataset.customerId = r[0];
        firstNameColumn.textContent = r[1];
        lastNameColumn.textContent = r[2];

        searchResultsBox.appendChild(row)
    });
}

function displayConfirmationDelete(event) {
    if (event.target.dataset.buttonState === "delete") {
        event.target.previousElementSibling.classList.remove("d-none");
        event.target.textContent = "Cancel";
        event.target.dataset.buttonState = "cancel";
    }
    else {
        event.target.previousElementSibling.classList.add("d-none");
        event.target.textContent = "Delete";
        event.target.dataset.buttonState = "delete";
    }
}

function deleteCustomer(event) {
    const custId = event.target.dataset.customerId.toString().toLowerCase();
    loadingStart();
    google.script.run.withSuccessHandler(() => {
        event.target.closest(".result-box").remove();
        const ids = customerData.map(r => r[0].toString().toLowerCase());
        const index = ids.indexOf(custId);
        customerData.splice(index, 1);
        loadingEnd();
    }).deleteById(custId);
}

function afterEditViewLoads(params) {
    // custId: event.target.dataset.customerId
    loadingStart();
    document.getElementById("customer-id").value = params.custId;
    google.script.run.withSuccessHandler(customerInfo => {
        document.getElementById("first-name").value = customerInfo.firstName;
        document.getElementById("last-name").value = customerInfo.lastName;
        document.getElementById("phone-number").value = customerInfo.phoneNumber;
        loadingEnd();
    }).getCustomerById(params.custId);
}

function editCustomer() {
    const customerInfo = {};
    customerInfo.id = document.getElementById("customer-id").value;
    customerInfo.firstName = document.getElementById("first-name").value;
    customerInfo.lastName = document.getElementById("last-name").value;
    customerInfo.phoneNumber = document.getElementById("phone-number").value;

    loadingStart();
    google.script.run.withSuccessHandler(result => {

        document.getElementById("save-success-alert").classList.remove("invisible");
        setTimeout(() => {
            document.getElementById("save-success-alert").classList.add("invisible");
            document.getElementById("first-name").value = "";
            document.getElementById("last-name").value = "";
            document.getElementById("phone-number").value = "";
            loadingEnd();
            loadSearchView();
        }, 4000);

    }).editCustomerById(customerInfo);
}

function addCustomer() {
    const customerInfo = {};

    customerInfo.firstName = document.getElementById("first-name").value;
    customerInfo.lastName = document.getElementById("last-name").value;
    customerInfo.phoneNumber = document.getElementById("phone-number").value;

    loadingStart();
    google.script.run.withSuccessHandler( () => {

        document.getElementById("first-name").value = "";
        document.getElementById("last-name").value = "";
        document.getElementById("phone-number").value = "";

        document.getElementById("save-success-alert").classList.remove("invisible");
        setTimeout(() => {
            document.getElementById("save-success-alert").classList.add("invisible");
        }, 4000);
        loadingEnd();
    }).addCustomer(customerInfo);

}


function loadSearchView() {
    loadView({ func: "loadSearchView", callback: setDataForSearch });
}

function loadAddCustomerView() {
    loadView({ func: "loadAddCustomerView" });
}

function loadEditCustomerView(event) {
    loadView({
        func: "loadEditCustomerView",
        callback: afterEditViewLoads,
        params: {
            custId: event.target.dataset.customerId
        }
    });
}

function activeTabChange(event) {
    const navLinks = document.querySelectorAll(".main-nav .nav-link");

    navLinks.forEach(linkElement => {
        linkElement.classList.remove("active");
    });

    event.target.classList.add("active");
}

function loadingStart() {
    document.getElementById("loading").classList.remove("invisible");
}


function loadingEnd() {
    document.getElementById("loading").classList.add("invisible");
}

document.getElementById("search-link").addEventListener("click", loadSearchView);
document.getElementById("add-customer-link").addEventListener("click", loadAddCustomerView);

function inputEventHandler(event) {
    if (event.target.matches("#search-input")) {
        search();
    }
}

function clickEventHandler(event) {
    if (event.target.matches(".delete-button")) {
        deleteCustomer(event);
    }

    if (event.target.matches(".before-delete-button")) {
        displayConfirmationDelete(event);
    }

    if (event.target.matches(".edit-button")) {
        loadEditCustomerView(event)
    }

    if (event.target.matches("#save-changes")) {
        editCustomer();
    }

    if (event.target.matches("#cancel-changes")) {
        loadSearchView();
    }

    if (event.target.matches("#add-customer-button")) {
        addCustomer();
    }
}

function navClickEventHandler(event) {
    if (event.target.matches(".nav-link")) {
        activeTabChange(event);
    }
}

document.getElementById("app").addEventListener("input", inputEventHandler);
document.getElementById("app").addEventListener("click", clickEventHandler);
document.getElementById("navigation").addEventListener("click", navClickEventHandler);
document.addEventListener("DOMContentLoaded", loadSearchView);