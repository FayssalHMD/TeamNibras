console.log("JS is running!");


import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { getFirestore, collection, addDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyBrKXZhEbRWWGajrAHK1RzcR1Rl-LT4Kno",
    authDomain: "hotel-booking-6c266.firebaseapp.com",
    projectId: "hotel-booking-6c266",
    storageBucket: "hotel-booking-6c266.firebasestorage.app",
    messagingSenderId: "317653149057",
    appId: "1:317653149057:web:d99c412a742415eeff3480"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);


function bookRoom(name, price) {
  const nights = prompt(`How many nights do you want to book "${name}"?`);
  if (nights && !isNaN(nights)) {
    const total = price * parseInt(nights);
    alert(`You've booked "${name}" for ${nights} nights. Total: $${total}`);
  } else {
    alert("Please enter a valid number of nights.");
  }
}



document.getElementById("login-btn").addEventListener("click", () => {
  const provider = new GoogleAuthProvider();
  signInWithPopup(auth, provider)
    .then((result) => {
      const user = result.user;
      alert(`Welcome ${user.displayName}!`);
    })
    .catch((error) => {
      console.error(error);
      alert("Login failed.");
    });
});


document.getElementById("listing-form").addEventListener("submit", (e) => {
  e.preventDefault();

  const title = document.getElementById("room-title").value;
  const price = document.getElementById("room-price").value;
  const image = document.getElementById("room-img").value;

  addDoc(collection(db, "listings"), {
    title,
    price,
    image
  })
    .then(() => {
      alert("Listing added!");
      document.getElementById("listing-form").reset();
    })
    .catch((error) => {
      console.error("Error adding listing: ", error);
    });
});


const listingsContainer = document.getElementById("listings");

function renderListing(doc) {
  const data = doc.data();
  const card = document.createElement("div");
  card.className = "bg-white rounded-2xl shadow p-4 max-w-sm m-4";

  
  const numericPrice = parseFloat(data.price.replace(/[^0-9.]/g, ""));


  card.innerHTML = `
    <img src="${data.image}" alt="${data.title}" class="w-full h-48 object-cover rounded-lg">
    <h3 class="text-lg font-semibold mt-2">${data.title}</h3>
    <p class="text-gray-600">${data.price}</p>
    <button class="mt-2 bg-pink-500 hover:bg-pink-600 text-white py-2 px-4 rounded book-now-btn">
      Book Now
    </button>
  `;

  
  const button = card.querySelector(".book-now-btn");
  button.addEventListener("click", () => {
    bookRoom(data.title, numericPrice);
  });

  listingsContainer.appendChild(card);
}


onSnapshot(collection(db, "listings"), (snapshot) => {
  listingsContainer.innerHTML = ""; 
  snapshot.forEach((doc) => {
    renderListing(doc);
  });
});

