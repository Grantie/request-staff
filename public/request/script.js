import { initializeApp } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-app.js";
import { getDatabase, ref, set, onValue, get } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyD5sU3YVNYm4ZBRtXX_889qulCj2cYPESs",
    authDomain: "request-staff.firebaseapp.com",
    databaseURL: "https://request-staff-default-rtdb.firebaseio.com",
    projectId: "request-staff",
    storageBucket: "request-staff.appspot.com",
    messagingSenderId: "1029522537052",
    appId: "1:1029522537052:web:fa14b20b24c0d8f38c8499"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

var addBy = 5;
var currentWidth = 0;

var clickingAllowed = true;

document.addEventListener("click", () => {
    if (clickingAllowed == false) return false;

    if (currentWidth == null) {
        currentWidth = 0;
    }

    var changeTo = currentWidth + addBy;

    document.querySelector(".progressBar").style.width = `${changeTo}%`;
    currentWidth = changeTo;

    if (currentWidth >= 100) {
        clickingAllowed = false;

        setTimeout(() => {
            set(ref(db, "/status"), true);
        }, 1000);
    }
});

onValue(ref(db, "/status"), (snapshot) => {
    if (snapshot.val() == true) {
        clickingAllowed = false;
        document.querySelector(".progressBar").style.width = `0%`;
        currentWidth = 0;

        document.querySelector(".request").style.animation = "fadeOut 1s ease-out forwards";
        setTimeout(() => {
            document.querySelector(".request").hidden = true;

            document.querySelector(".confirmation").style.animation = "fadeIn 1s ease-out forwards";
            document.querySelector(".confirmation").hidden = false;
        }, 1000);
    } else {
        clickingAllowed = true;

        document.querySelector(".confirmation").style.animation = "fadeOut 1s ease-out forwards";
        setTimeout(() => {
            document.querySelector(".confirmation").hidden = true;

            document.querySelector(".request").style.animation = "fadeIn 1s ease-out forwards";
            document.querySelector(".request").hidden = false;
        }, 1000);
    }
});

setInterval(() => {
    if (currentWidth >= 0 && clickingAllowed != false) {
        var changeTo = currentWidth - addBy;

        document.querySelector(".progressBar").style.width = `${changeTo}%`;
        currentWidth = changeTo;
    }
}, 1000);

document.addEventListener("selectstart", (e) => {
    e.preventDefault();
    return false;
});

document.querySelector(".enterPassBtn").addEventListener("click", async () => {
    const { value: input } = await Swal.fire({
        icon: "question",
        title: "Password Required",
        text: "A password is required to cancel this request.",
        input: "password",
        inputPlaceholder: "Enter password...",
        confirmButtonText: "Cancel Request"
    });
    get(ref(db, "/pass")).then((snapshot) => {
        if (snapshot.val() == input) {
            set(ref(db, "/status"), false);
        } else {
            Swal.fire({
                icon: "error",
                title: "Incorrect Password",
                text: "The password you have entered was incorrect. This request has not been canceled.",
                confirmButtonText: "Close"
            });
        }
    });
});