const ticketContainer =
document.getElementById("ticketContainer");

const dealsGrid =
document.getElementById("dealsGrid");

let purchasedTickets =
JSON.parse(
localStorage.getItem("tickets")
) || [];

function saveTickets(){

localStorage.setItem(
"tickets",
JSON.stringify(purchasedTickets)
);

}

function getFinalPrice(event){

let price = event.price;

if(event.discount){

price =
Math.round(
price * (1 - event.discount / 100)
);

}

if(user && user.firstDiscount){

price =
Math.round(price * 0.8);

}

return price;
}

function reserveTicket(title){
  openEventDetails(title);
}

function payTicket(id){

localStorage.setItem(
"selectedTicketId",
id
);

window.location.href =
"payment.html";

}

function viewTicket(id){

localStorage.setItem(
"selectedTicketId",
id
);

window.location.href =
"ticket.html";

}

function deleteTicket(id){

purchasedTickets =
purchasedTickets.filter(
ticket => ticket.id !== id
);

saveTickets();

renderTickets();

}

function renderTickets(){

if(!ticketContainer){

return;
}

ticketContainer.innerHTML = "";

if(
purchasedTickets.length === 0
){

ticketContainer.innerHTML = `

<p class="empty">
No tickets selected yet.
</p>

`;

return;
}

purchasedTickets.forEach(ticket => {

const paid =
ticket.status.includes("Paid");

const card =
document.createElement("div");

card.className =
"ticket-card";

card.innerHTML = `

<div>

<h3>${ticket.title}</h3>

<p>
Order: ${ticket.id}
</p>

<p>
📍 ${ticket.location}
</p>

<p>
📅 ${ticket.date}
</p>

<p>
💳 $${ticket.price}
</p>

<p>
Reserved:
${ticket.purchasedAt}
</p>

<span class="ticket-status ${
paid
? "status-paid"
: "status-waiting"
}">
${ticket.status}
</span>

</div>

<div class="ticket-actions">

${
paid
?

`
<button
class="details-btn"
onclick="openEventDetails('${ticket.title}')">

View Event Details

</button>
<button
class="demo-btn"
onclick="viewTicket('${ticket.id}')">

View Digital Ticket

</button>
`

:

`
<button
class="pay-btn"
onclick="payTicket('${ticket.id}')">

Pay Online

</button>
`
}

<button
class="delete-btn"
onclick="deleteTicket('${ticket.id}')">

Delete Ticket

</button>

</div>

`;

ticketContainer.appendChild(card);

});

}

function renderDeals(){

if(!dealsGrid){

return;
}

dealsGrid.innerHTML = "";

const deals =
events.filter(
event => event.discount > 0
);

deals.forEach(event => {

const card =
document.createElement("div");

card.className =
"card";

const discountedPrice =
Math.round(
event.price *
(1 - event.discount / 100)
);

card.innerHTML = `

<img
src="${event.image}">

<div class="card-content">

<div class="discount-badge">

🔥 SAVE ${event.discount}%

</div>

<h3>${event.title}</h3>

<p class="location">

📍 ${event.location}

</p>

<p class="date">

📅 ${event.date}

</p>

<p class="price">

<span class="old-price">

$${event.price}

</span>

$${discountedPrice}

</p>

<button class="buy-btn" onclick="openEventDetails('${event.title}')">
  Choose Seats
</button>
<button
class="details-btn"
onclick="openEventDetails('${event.title}')">

View Seats & Details

</button>

</div>

`;

dealsGrid.appendChild(card);

});

}

renderTickets();
renderDeals();