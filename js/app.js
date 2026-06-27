function showToast(title, text){
  const oldToast = document.querySelector(".toast");

  if(oldToast){
    oldToast.remove();
  }

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = `
    ${title}
    <small>${text}</small>
  `;

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("show");
  }, 50);

  setTimeout(() => {
    toast.classList.remove("show");
  }, 3200);

  setTimeout(() => {
    toast.remove();
  }, 3600);
}
const eventGrid = document.getElementById("eventGrid");
const searchInput = document.getElementById("searchInput");
const liveFeed = document.getElementById("liveFeed");
const randomText = document.getElementById("randomText");
const orb = document.getElementById("orb");

let currentFilter = "All";

function renderEvents(){
  if(!eventGrid) return;

  eventGrid.innerHTML = "";

  const searchValue = searchInput ? searchInput.value.toLowerCase() : "";

  events
    .filter(event => currentFilter === "All" || event.category === currentFilter)
    .filter(event =>
      event.title.toLowerCase().includes(searchValue) ||
      event.location.toLowerCase().includes(searchValue) ||
      event.category.toLowerCase().includes(searchValue)
    )
    .forEach(event => {
      const total = event.available + event.sold;
      const percent = Math.round((event.sold / total) * 100);
      const finalPrice = getFinalPrice(event);

      const card = document.createElement("div");
      card.className = "card";

      card.innerHTML = `
        <img src="${event.image}" alt="${event.title}">

        <div class="card-content">
          <span class="card-tag">${event.category}</span>

          ${event.discount > 0 ? `<div class="discount-badge">🔥 SAVE ${event.discount}%</div>` : ""}

          <h3>${event.title}</h3>

          <p class="location">📍 ${event.location}</p>
          <p class="date">📅 ${event.date}</p>

          <div class="stats">
            <span class="available">🎟 ${event.available} available</span>
            <span class="sold">🔥 ${event.sold} sold</span>
          </div>

          <div class="progress">
            <span style="width:${percent}%"></span>
          </div>

          <p class="price">
            ${finalPrice < event.price ? `<span class="old-price">$${event.price}</span>` : ""}
            $${finalPrice}
          </p>

          <button class="buy-btn" onclick="reserveTicket('${event.title}')">
  Quick Reserve
</button>

<button class="details-btn" onclick="openEventDetails('${event.title}')">
  View Seats & Details
</button>
        </div>
      `;

      eventGrid.appendChild(card);
    });
}

function filterEvents(category){
  currentFilter = category;
  renderEvents();
}

function randomEvent(){
  const event = events[Math.floor(Math.random() * events.length)];

  randomText.innerHTML = `
    Your next adventure: <strong>${event.title}</strong><br>
    📍 ${event.location}<br>
    📅 ${event.date}<br>
    💳 From $${getFinalPrice(event)}
  `;
}

function createLiveFeed(){
  if(!liveFeed) return;

  const people = ["Alex", "Mia", "Daniel", "Sofia", "Leo", "Emma", "Mark", "Nina"];
  const cities = ["Berlin", "Paris", "London", "Dubai", "Madrid", "Seoul", "Tokyo"];

  liveFeed.innerHTML = "";

  for(let i = 0; i < 6; i++){
    const person = people[Math.floor(Math.random() * people.length)];
    const city = cities[Math.floor(Math.random() * cities.length)];
    const event = events[Math.floor(Math.random() * events.length)];

    const item = document.createElement("div");
    item.innerHTML = `🎫 <strong>${person}</strong> from ${city} reserved <strong>${event.title}</strong>`;
    liveFeed.appendChild(item);
  }
}

if(searchInput){
  searchInput.addEventListener("input", renderEvents);
}

if(orb){
  orb.addEventListener("click", () => {
    orb.innerText = ["✨","🎟","🔥","💫","🎵","🏎","⚽"][Math.floor(Math.random() * 7)];
  });
}

renderAccount();
renderEvents();
renderTickets();
renderDeals();
createLiveFeed();

setInterval(createLiveFeed, 7000);
const videos = [
"videos/1.mp4",
"videos/2.mp4",
"videos/3.mp4",
"videos/4.mp4"
];

let currentVideo = 0;

const vibeVideo =
document.getElementById("vibeVideo");

if(vibeVideo){

setInterval(() => {

currentVideo++;

if(currentVideo >= videos.length){

currentVideo = 0;

}

vibeVideo.src =
videos[currentVideo];

vibeVideo.load();

vibeVideo.play();

}, 15000);

}
function openEventDetails(title){
  localStorage.setItem("selectedEventTitle", title);
  window.location.href = "event.html";
}