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

onValue(ref(db, "/status"), (snapshot) => {
    if (snapshot.val() == true) {
        document.querySelector(".chime").play();

        document.querySelector(".none").style.animation = "fadeOut 1s ease-out forwards";
        setTimeout(() => {
            document.querySelector(".none").hidden = true;

            document.querySelector(".active").style.animation = "fadeIn 1s ease-out forwards";
            document.querySelector(".active").hidden = false;
        }, 1000);
    } else {
        document.querySelector(".chime").pause();
        document.querySelector(".chime").currentTime = 0;

        document.querySelector(".active").style.animation = "fadeOut 1s ease-out forwards";
        setTimeout(() => {
            document.querySelector(".active").hidden = true;

            document.querySelector(".none").style.animation = "fadeIn 1s ease-out forwards";
            document.querySelector(".none").hidden = false;
        }, 1000);
    }
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