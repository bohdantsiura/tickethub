const SeatMapV2 = (() => {
  let selectedSeat = null;

  function venueType(event) {
    if (event.category === "Motorsport") return "race";
    if (event.category === "Football") return "football";
    if (event.category === "Tennis") return "tennis";
    if (event.category === "Basketball") return "basketball";
    if (event.category === "Sports") return "arena";
    if (event.category === "Concert") return "concert";
    if (event.category === "Esports") return "esports";
    return "festival";
  }

  function randomFromSeed(text) {
    let seed = 0;

    for (let i = 0; i < text.length; i++) {
      seed = (seed * 31 + text.charCodeAt(i)) % 1000000;
    }

    return Math.abs(Math.sin(seed) * 10000) % 1;
  }

  function isPairProtected(number) {
    return (
      number === 6 ||
      number === 7 ||
      number === 14 ||
      number === 15 ||
      number === 22 ||
      number === 23
    );
  }

  function isSold(eventTitle, sectionId, row, number) {
    if (isPairProtected(number)) return false;

    const key = `${eventTitle}-${sectionId}-${row}-${number}`;
    return randomFromSeed(key) < 0.6;
  }

  function createSeat(section, row, number, eventTitle) {
    return {
      code: `${section.id}-${row}${number}`,
      short: `${row}${number}`,
      sectionId: section.id,
      sectionName: section.name,
      type: section.type,
      price: section.price,
      row,
      number,
      sold: isSold(eventTitle, section.id, row, number)
    };
  }

  function getSections(event) {
    const type = venueType(event);

    if (type === "concert") {
      return [
        { id: "PIT", name: "VIP Fan Pit", type: "vip", price: event.price + 160, rows: ["A", "B"], count: 24 },
        { id: "FLOOR-L", name: "Gold Floor Left", type: "gold", price: event.price + 90, rows: ["C", "D", "E"], count: 22 },
        { id: "FLOOR-R", name: "Gold Floor Right", type: "gold", price: event.price + 90, rows: ["F", "G", "H"], count: 22 },
        { id: "BALCONY", name: "Standard Balcony", type: "standard", price: event.price, rows: ["J", "K", "L", "M"], count: 26 }
      ];
    }

    if (type === "football") {
      return [
        { id: "NORTH", name: "North Stand", type: "standard", price: event.price, rows: ["A", "B", "C", "D"], count: 26 },
        { id: "SOUTH", name: "South Stand", type: "standard", price: event.price, rows: ["E", "F", "G", "H"], count: 26 },
        { id: "EAST", name: "East Gold Stand", type: "gold", price: event.price + 70, rows: ["J", "K", "L"], count: 24 },
        { id: "WEST", name: "West VIP Stand", type: "vip", price: event.price + 150, rows: ["M", "N"], count: 22 }
      ];
    }

    if (type === "race") {
      return [
        { id: "MAIN", name: "Main Grandstand", type: "vip", price: event.price + 180, rows: ["A", "B", "C"], count: 28 },
        { id: "TURN1", name: "Turn 1 Grandstand", type: "gold", price: event.price + 100, rows: ["D", "E", "F"], count: 28 },
        { id: "BACK", name: "Back Straight Stand", type: "standard", price: event.price, rows: ["G", "H", "J"], count: 26 },
        { id: "GA", name: "General Admission", type: "standard", price: event.price - 30, rows: ["K", "L"], count: 30 }
      ];
    }

    if (type === "tennis") {
      return [
        { id: "COURT-A", name: "Court Side A", type: "vip", price: event.price + 130, rows: ["A", "B"], count: 18 },
        { id: "COURT-B", name: "Court Side B", type: "gold", price: event.price + 70, rows: ["C", "D"], count: 18 },
        { id: "UPPER", name: "Upper Ring", type: "standard", price: event.price, rows: ["E", "F", "G"], count: 22 }
      ];
    }

    if (type === "arena" || type === "basketball") {
      return [
        { id: "FLOOR", name: "Floor Seats", type: "vip", price: event.price + 160, rows: ["A", "B"], count: 20 },
        { id: "LOWER", name: "Lower Bowl", type: "gold", price: event.price + 80, rows: ["C", "D", "E"], count: 22 },
        { id: "UPPER", name: "Upper Bowl", type: "standard", price: event.price, rows: ["F", "G", "H", "J"], count: 24 }
      ];
    }

    if (type === "esports") {
      return [
        { id: "VIP", name: "VIP Screen View", type: "vip", price: event.price + 100, rows: ["A", "B"], count: 22 },
        { id: "LAN", name: "Gold LAN Area", type: "gold", price: event.price + 50, rows: ["C", "D", "E"], count: 22 },
        { id: "STD", name: "Standard Arena", type: "standard", price: event.price, rows: ["F", "G", "H"], count: 24 }
      ];
    }

    return [
      { id: "VIP", name: "VIP Festival Zone", type: "vip", price: event.price + 120, rows: ["A", "B"], count: 24 },
      { id: "GOLD", name: "Gold Comfort Zone", type: "gold", price: event.price + 60, rows: ["C", "D", "E"], count: 26 },
      { id: "STD", name: "Standard Field Zone", type: "standard", price: event.price, rows: ["F", "G", "H", "J"], count: 28 }
    ];
  }

  function center(type) {
    const labels = {
      concert: "🎤 MAIN STAGE",
      football: "⚽ FOOTBALL FIELD",
      race: "🏎 RACING TRACK",
      tennis: "🎾 TENNIS COURT",
      basketball: "🏀 COURT",
      arena: "🥊 MAIN RING",
      esports: "🎮 MAIN SCREEN",
      festival: "🎪 MAIN AREA"
    };

    return `<div class="v2-center v2-${type}-center"><strong>${labels[type]}</strong></div>`;
  }

  function sectionHTML(section, eventTitle) {
    const seats = [];

    section.rows.forEach(row => {
      for (let i = 1; i <= section.count; i++) {
        seats.push(createSeat(section, row, i, eventTitle));
      }
    });

    return `
      <div class="v2-section ${section.type}">
        <div class="v2-section-title">
          <h4>${section.name}</h4>
          <span>${section.type.toUpperCase()} · $${section.price}</span>
        </div>

        <div class="v2-seats">
          ${seats.map(seat => `
            <button
              class="v2-seat ${seat.type} ${seat.sold ? "sold" : ""}"
              ${seat.sold ? "disabled" : ""}
              title="${seat.sectionName} · ${seat.code} · $${seat.price}"
              onclick='SeatMapV2.select(${JSON.stringify(seat)})'>
              ${seat.short}
            </button>
          `).join("")}
        </div>
      </div>
    `;
  }

  function mapHTML(event) {
    const type = venueType(event);
    const sections = getSections(event);

    if (type === "football") {
      return `
        <div class="v2-map football-layout">
          ${sectionHTML(sections[0], event.title)}
          <div class="v2-middle">
            ${sectionHTML(sections[2], event.title)}
            ${center(type)}
            ${sectionHTML(sections[3], event.title)}
          </div>
          ${sectionHTML(sections[1], event.title)}
        </div>
      `;
    }

    if (type === "race") {
      return `
        <div class="v2-map race-layout">
          ${sectionHTML(sections[0], event.title)}
          ${center(type)}
          <div class="v2-two-cols">
            ${sectionHTML(sections[1], event.title)}
            ${sectionHTML(sections[2], event.title)}
          </div>
          ${sectionHTML(sections[3], event.title)}
        </div>
      `;
    }

    if (type === "concert") {
      return `
        <div class="v2-map concert-layout">
          ${center(type)}
          ${sectionHTML(sections[0], event.title)}
          <div class="v2-two-cols">
            ${sectionHTML(sections[1], event.title)}
            ${sectionHTML(sections[2], event.title)}
          </div>
          ${sectionHTML(sections[3], event.title)}
        </div>
      `;
    }

    if (type === "tennis") {
      return `
        <div class="v2-map tennis-layout">
          ${sectionHTML(sections[0], event.title)}
          ${center(type)}
          ${sectionHTML(sections[1], event.title)}
          ${sectionHTML(sections[2], event.title)}
        </div>
      `;
    }

    return `
      <div class="v2-map generic-layout">
        ${center(type)}
        ${sections.map(section => sectionHTML(section, event.title)).join("")}
      </div>
    `;
  }

  function render(event, container) {
    selectedSeat = null;

    container.innerHTML = mapHTML(event);
  }

  function select(seat) {
    selectedSeat = seat;

    document.querySelectorAll(".v2-seat").forEach(btn => {
      btn.classList.remove("active");
    });

    const btn = [...document.querySelectorAll(".v2-seat")]
      .find(button => button.title.includes(seat.code));

    if (btn) btn.classList.add("active");

    const selectedSeatBox = document.getElementById("selectedSeatBox");

    if (selectedSeatBox) {
      selectedSeatBox.innerHTML = `
        <p><strong>${seat.code}</strong></p>
        <p>Zone: ${seat.sectionName}</p>
        <p>Class: ${seat.type.toUpperCase()}</p>
        <p>Price: $${seat.price}</p>
      `;
    }
  }

  function getSelectedSeat() {
    return selectedSeat;
  }

  return {
    render,
    select,
    getSelectedSeat,
    venueType
  };
})();