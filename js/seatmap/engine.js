const SeatMapEngine = {
  event: null,
  data: null,
  selectedSeats: [],

  init(event, containerId) {
    this.event = event;
    this.selectedSeats = [];

    const container = document.getElementById(containerId);

    if (!container) {
      console.error("Seat map container not found:", containerId);
      return;
    }

    const layout = SeatMapLayouts.getLayout(event);
    this.data = SeatMapGenerator.generate(event, layout);

    container.innerHTML = SeatMapRenderer.render(this.data);

    this.updateStats();
    this.updateSelectedBox();
  },

  selectSeat(seat) {
    const exists = this.selectedSeats.find(
      item => item.code === seat.code
    );

    if (exists) {
      this.selectedSeats = this.selectedSeats.filter(
        item => item.code !== seat.code
      );
    } else {
      this.selectedSeats.push(seat);
    }

    this.updateSeatButtons();
    this.updateSelectedBox();
  },

  updateSeatButtons() {
    document.querySelectorAll(".seatmap-seat").forEach(button => {
      button.classList.remove("active");
    });

    this.selectedSeats.forEach(seat => {
      const selectedButton = [...document.querySelectorAll(".seatmap-seat")]
        .find(button => button.title.includes(seat.code));

      if (selectedButton) {
        selectedButton.classList.add("active");
      }
    });
  },

  updateSelectedBox() {
    const selectedBox = document.getElementById("selectedSeatBox");

    if (!selectedBox) return;

    if (this.selectedSeats.length === 0) {
      selectedBox.innerHTML = `
        Choose one or more available seats on the map.
      `;
      return;
    }

    const total = this.getTotalPrice();

    selectedBox.innerHTML = `
      <div class="selected-seat-list">
        ${this.selectedSeats.map(seat => `
          <div class="selected-seat-item">
            <span>${seat.code}</span>
            <small>${seat.sectionName} · ${seat.tier.toUpperCase()}</small>
            <strong>$${seat.price}</strong>
          </div>
        `).join("")}
      </div>

      <div class="selected-total">
        <span>${this.selectedSeats.length} ticket${this.selectedSeats.length > 1 ? "s" : ""}</span>
        <strong>Total: $${total}</strong>
      </div>
    `;
  },

  getTotalPrice() {
    return this.selectedSeats.reduce(
      (sum, seat) => sum + Number(seat.price),
      0
    );
  },

  getSelectedSeats() {
    return this.selectedSeats;
  },

  updateStats() {
    const total = document.getElementById("seatTotal");
    const available = document.getElementById("seatAvailable");
    const sold = document.getElementById("seatSold");

    if (!this.data) return;

    if (total) total.innerText = this.data.stats.total;
    if (available) available.innerText = this.data.stats.available;
    if (sold) sold.innerText = this.data.stats.sold;
  },

  reserveSelectedSeat() {
    const seats = this.getSelectedSeats();

    if (seats.length === 0) {
      showToast(
        "No seats selected",
        "Please choose at least one available seat before reserving.",
        "error"
      );
      return;
    }

    const tickets = JSON.parse(localStorage.getItem("tickets")) || [];

    const total = this.getTotalPrice();

    tickets.push({
      id: "TH-" + Math.floor(10000 + Math.random() * 90000),
      title: this.event.title,
      location: this.event.location,
      date: this.event.date,
      price: total,
      seats: seats.map(seat => seat.code),
      zones: [...new Set(seats.map(seat => seat.sectionName))],
      seatClasses: [...new Set(seats.map(seat => seat.tier.toUpperCase()))],
      status: "Awaiting payment",
      purchasedAt: new Date().toLocaleDateString()
    });

    localStorage.setItem("tickets", JSON.stringify(tickets));

    showToast(
      "Seats reserved",
      `${seats.length} ticket${seats.length > 1 ? "s" : ""} reserved for $${total}`,
      "ticket"
    );

    setTimeout(() => {
      window.location.href = "index.html#tickets";
    }, 1200);
  }
};