const events = [
  { title:"Austrian Grand Prix", category:"Motorsport", location:"Spielberg, Austria", date:"28 Jun 2026", price:149, available:1240, sold:8750, image:"https://images.unsplash.com/photo-1503376780353-7e6692767b70" },
  { title:"British Grand Prix", category:"Motorsport", location:"Silverstone, UK", date:"05 Jul 2026", price:179, available:980, sold:11200, image:"https://images.unsplash.com/photo-1492144534655-ae79c964c9d7" },
  { title:"Champions League Final", category:"Football", location:"London, UK", date:"30 May 2026", price:220, available:430, sold:64000, image:"https://images.unsplash.com/photo-1547347298-4074fc3086f0" },
  { title:"El Clasico Night", category:"Football", location:"Madrid, Spain", date:"18 Apr 2026", price:135, available:720, sold:73100, image:"https://images.unsplash.com/photo-1522778119026-d647f0596c20" },
  { title:"Summer Music Festival", category:"Concert", location:"Berlin, Germany", date:"14 Sep 2026", price:89, available:2300, sold:18900, image:"https://images.unsplash.com/photo-1501386761578-eac5c94b800a" },
  { title:"Rock Legends Night", category:"Concert", location:"Prague, Czech Republic", date:"22 Aug 2026", price:75, available:1560, sold:9800, image:"https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b" },
  { title:"Electronic Universe", category:"Festival", location:"Amsterdam, Netherlands", date:"09 Oct 2026", price:110, available:1980, sold:14300, image:"https://images.unsplash.com/photo-1470225620780-dba8ba36b745" },
  { title:"Wimbledon Finals", category:"Tennis", location:"London, UK", date:"12 Jul 2026", price:160, available:350, sold:14300, image:"https://images.unsplash.com/photo-1622279457486-62dcc4a431d6" },
  { title:"Esports Masters", category:"Esports", location:"Seoul, South Korea", date:"17 Oct 2026", price:55, available:4200, sold:22000, image:"https://images.unsplash.com/photo-1542751371-adc38448a05e" },
  { title:"NBA Global Game", category:"Basketball", location:"Paris, France", date:"21 Jan 2026", price:125, available:860, sold:18400, image:"https://images.unsplash.com/photo-1546519638-68e109498ffc" },
  { title:"MotoGP Weekend", category:"Motorsport", location:"Mugello, Italy", date:"07 Jun 2026", price:99, available:1750, sold:9400, image:"https://images.unsplash.com/photo-1558981806-ec527fa84c39" },
  { title:"Food & Wine Expo", category:"Festival", location:"Barcelona, Spain", date:"03 May 2026", price:45, available:3200, sold:6700, image:"https://images.unsplash.com/photo-1555939594-58d7cb561ad1" },
  { title:"Tokyo Neon Festival", category:"Festival", location:"Tokyo, Japan", date:"19 Nov 2026", price:95, available:2100, sold:12900, image:"https://images.unsplash.com/photo-1542051841857-5f90071e7989" },
  { title:"Dubai Racing Night", category:"Motorsport", location:"Dubai, UAE", date:"08 Dec 2026", price:188, available:640, sold:7800, image:"https://images.unsplash.com/photo-1542362567-b07e54358753" },
  { title:"Miami Beach Concert", category:"Concert", location:"Miami, USA", date:"04 Aug 2026", price:99, available:1750, sold:16400, image:"https://images.unsplash.com/photo-1514525253161-7a46d19cd819" }
];

const eventGrid = document.getElementById("eventGrid");
const ticketContainer = document.getElementById("ticketContainer");
const searchInput = document.getElementById("searchInput");
const liveFeed = document.getElementById("liveFeed");
const randomText = document.getElementById("randomText");
const orb = document.getElementById("orb");

let currentFilter = "All";
let purchasedTickets = JSON.parse(localStorage.getItem("tickets")) || [];

function saveTickets(){
  localStorage.setItem("tickets", JSON.stringify(purchasedTickets));
}

function renderEvents(){
  eventGrid.innerHTML = "";

  const searchValue = searchInput.value.toLowerCase();

  events
    .filter(event => currentFilter === "All" || event.category === currentFilter)
    .filter(event =>
      event.title.toLowerCase().includes(searchValue) ||
      event.location.toLowerCase().includes(searchValue) ||
      event.category.toLowerCase().includes(searchValue)
    )
    .forEach((event, index) => {
      const total = event.available + event.sold;
      const percent = Math.round((event.sold / total) * 100);

      const card = document.createElement("div");
      card.className = "card";

      card.innerHTML = `
        <img src="${event.image}" alt="${event.title}">
        <div class="card-content">
          <span class="card-tag">${event.category}</span>
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

          <p class="price">From $${event.price}</p>

          <button class="buy-btn" onclick="reserveTicket('${event.title}')">
            Reserve Ticket
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

function reserveTicket(title){
  const event = events.find(e => e.title === title);

  if(!event || event.available <= 0){
    alert("Sorry, this event is sold out.");
    return;
  }

  event.available--;
  event.sold++;

  purchasedTickets.push({
    id: "TH-" + Math.floor(10000 + Math.random() * 90000),
    title: event.title,
    location: event.location,
    date: event.date,
    price: event.price,
    status: "Awaiting payment",
    purchasedAt: new Date().toLocaleDateString()
  });

  saveTickets();
  renderEvents();
  renderTickets();

  document.getElementById("tickets").scrollIntoView();
}

function payTicket(id){
  localStorage.setItem("selectedTicketId", id);
  window.location.href = "payment.html";
}

function deleteTicket(id){
  purchasedTickets = purchasedTickets.filter(t => t.id !== id);
  saveTickets();
  renderTickets();
}

function renderTickets(){
  ticketContainer.innerHTML = "";

  if(purchasedTickets.length === 0){
    ticketContainer.innerHTML = `<p class="empty">No tickets selected yet.</p>`;
    return;
  }

  purchasedTickets.forEach(ticket => {
    const paid = ticket.status.includes("Paid");

    const card = document.createElement("div");
    card.className = "ticket-card";

    card.innerHTML = `
      <div>
        <h3>${ticket.title}</h3>
        <p>Order: ${ticket.id}</p>
        <p>📍 ${ticket.location}</p>
        <p>📅 Event date: ${ticket.date}</p>
        <p>💳 Price: $${ticket.price}</p>
        <p>🕒 Reserved: ${ticket.purchasedAt}</p>
        <span class="ticket-status ${paid ? "status-paid" : "status-waiting"}">
          ${ticket.status}
        </span>
      </div>

      <div class="ticket-actions">
        ${paid
          ? `<button class="demo-btn" onclick="viewTicket('${ticket.id}')">View Digital Ticket</button>`
          : `<button class="pay-btn" onclick="payTicket('${ticket.id}')">Pay Online</button>`
        }

        <button class="delete-btn" onclick="deleteTicket('${ticket.id}')">
          Delete Ticket
        </button>
      </div>
    `;

    ticketContainer.appendChild(card);
  });
}

function randomEvent(){
  const event = events[Math.floor(Math.random() * events.length)];
  randomText.innerHTML = `
    Your next adventure: <strong>${event.title}</strong><br>
    📍 ${event.location}<br>
    📅 ${event.date}<br>
    💳 From $${event.price}
  `;
}

function createLiveFeed(){
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
function viewTicket(id){
  localStorage.setItem("selectedTicketId", id);
  window.location.href = "ticket.html";
}
renderEvents();
renderTickets();
createLiveFeed();

setInterval(createLiveFeed, 7000);