const SeatMapRenderer = {
  renderCenter(layout) {
    return `
      <div class="seatmap-center seatmap-center-${layout.type}">
        <strong>${layout.centerLabel}</strong>
        <span>${layout.description}</span>
      </div>
    `;
  },

  renderSeat(seat) {
    return `
      <button
        class="seatmap-seat ${seat.tier} ${seat.sold ? "sold" : ""}"
        ${seat.sold ? "disabled" : ""}
        title="${seat.sectionName} · ${seat.code} · $${seat.price}"
        onclick='SeatMapEngine.selectSeat(${JSON.stringify(seat)})'>
        ${seat.short}
      </button>
    `;
  },

  renderSection(section) {
    return `
      <div class="seatmap-section ${section.tier} shape-${section.shape}">
        <div class="seatmap-section-header">
          <h4>${section.name}</h4>
          <span>${section.tier.toUpperCase()} · $${section.priceAdd >= 0 ? "+" + section.priceAdd : section.priceAdd}</span>
        </div>

        <div class="seatmap-seats">
          ${section.seats.map(seat => this.renderSeat(seat)).join("")}
        </div>
      </div>
    `;
  },

  renderFootball(data) {
    const [north, south, east, west] = data.sections;

    return `
      <div class="seatmap-map football-map-v2">
        ${this.renderSection(north)}

        <div class="seatmap-stadium-row">
          ${this.renderSection(east)}
          ${this.renderCenter(data.layout)}
          ${this.renderSection(west)}
        </div>

        ${this.renderSection(south)}
      </div>
    `;
  },

  renderRace(data) {
    const [main, turnOne, back, general] = data.sections;

    return `
      <div class="seatmap-map race-map-v2">
        ${this.renderSection(main)}
        ${this.renderCenter(data.layout)}

        <div class="seatmap-two-cols">
          ${this.renderSection(turnOne)}
          ${this.renderSection(back)}
        </div>

        ${this.renderSection(general)}
      </div>
    `;
  },

  renderConcert(data) {
    const [pit, left, right, balcony] = data.sections;

    return `
      <div class="seatmap-map concert-map-v2">
        ${this.renderCenter(data.layout)}
        ${this.renderSection(pit)}

        <div class="seatmap-two-cols">
          ${this.renderSection(left)}
          ${this.renderSection(right)}
        </div>

        ${this.renderSection(balcony)}
      </div>
    `;
  },

  renderTennis(data) {
    const [courtA, courtB, upper] = data.sections;

    return `
      <div class="seatmap-map tennis-map-v2">
        ${this.renderSection(courtA)}
        ${this.renderCenter(data.layout)}
        ${this.renderSection(courtB)}
        ${this.renderSection(upper)}
      </div>
    `;
  },

  renderGeneric(data) {
    return `
      <div class="seatmap-map generic-map-v2">
        ${this.renderCenter(data.layout)}
        ${data.sections.map(section => this.renderSection(section)).join("")}
      </div>
    `;
  },

  render(data) {
    if (data.layout.type === "football") {
      return this.renderFootball(data);
    }

    if (data.layout.type === "race") {
      return this.renderRace(data);
    }

    if (data.layout.type === "concert") {
      return this.renderConcert(data);
    }

    if (data.layout.type === "tennis") {
      return this.renderTennis(data);
    }

    return this.renderGeneric(data);
  }
};