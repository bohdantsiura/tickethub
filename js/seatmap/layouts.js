const SeatMapLayouts = {
  getVenueType(event) {
    if (event.category === "Motorsport") return "race";
    if (event.category === "Football") return "football";
    if (event.category === "Tennis") return "tennis";
    if (event.category === "Basketball") return "basketball";
    if (event.category === "Sports") return "arena";
    if (event.category === "Concert") return "concert";
    if (event.category === "Esports") return "esports";
    return "festival";
  },

  getLayout(event) {
    const type = this.getVenueType(event);

    const layouts = {
      concert: {
        type: "concert",
        title: "Concert Arena",
        centerLabel: "🎤 MAIN STAGE",
        description: "Stage-focused arena with VIP pit, gold floor and balcony sections.",
        sections: [
          { id: "VIP-PIT", name: "VIP Fan Pit", tier: "vip", priceAdd: 160, rows: ["A", "B", "C"], seatsPerRow: 24, shape: "arc" },
          { id: "GOLD-L", name: "Gold Floor Left", tier: "gold", priceAdd: 90, rows: ["D", "E", "F", "G"], seatsPerRow: 22, shape: "left" },
          { id: "GOLD-R", name: "Gold Floor Right", tier: "gold", priceAdd: 90, rows: ["H", "J", "K", "L"], seatsPerRow: 22, shape: "right" },
          { id: "BALCONY", name: "Standard Balcony", tier: "standard", priceAdd: 0, rows: ["M", "N", "P", "Q"], seatsPerRow: 28, shape: "wide" }
        ]
      },

      football: {
        type: "football",
        title: "Football Stadium",
        centerLabel: "⚽ FOOTBALL FIELD",
        description: "Large stadium with four stands around the pitch.",
        sections: [
          { id: "NORTH", name: "North Stand", tier: "standard", priceAdd: 0, rows: ["A", "B", "C", "D"], seatsPerRow: 28, shape: "top" },
          { id: "SOUTH", name: "South Stand", tier: "standard", priceAdd: 0, rows: ["E", "F", "G", "H"], seatsPerRow: 28, shape: "bottom" },
          { id: "EAST", name: "East Gold Stand", tier: "gold", priceAdd: 70, rows: ["J", "K", "L"], seatsPerRow: 24, shape: "side" },
          { id: "WEST", name: "West VIP Stand", tier: "vip", priceAdd: 150, rows: ["M", "N"], seatsPerRow: 22, shape: "side" }
        ]
      },

      race: {
        type: "race",
        title: "Racing Circuit",
        centerLabel: "🏎 RACING TRACK",
        description: "Circuit layout with main grandstand, turn seats and general admission.",
        sections: [
          { id: "MAIN", name: "Main Grandstand", tier: "vip", priceAdd: 180, rows: ["A", "B", "C"], seatsPerRow: 30, shape: "top" },
          { id: "TURN1", name: "Turn 1 Grandstand", tier: "gold", priceAdd: 100, rows: ["D", "E", "F"], seatsPerRow: 28, shape: "side" },
          { id: "BACK", name: "Back Straight Stand", tier: "standard", priceAdd: 0, rows: ["G", "H", "J"], seatsPerRow: 26, shape: "side" },
          { id: "GA", name: "General Admission", tier: "standard", priceAdd: -30, rows: ["K", "L"], seatsPerRow: 30, shape: "bottom" }
        ]
      },

      tennis: {
        type: "tennis",
        title: "Tennis Court",
        centerLabel: "🎾 TENNIS COURT",
        description: "Court layout with premium courtside and upper ring seating.",
        sections: [
          { id: "COURTSIDE-A", name: "Courtside A", tier: "vip", priceAdd: 130, rows: ["A", "B"], seatsPerRow: 18, shape: "top" },
          { id: "COURTSIDE-B", name: "Courtside B", tier: "gold", priceAdd: 70, rows: ["C", "D"], seatsPerRow: 18, shape: "bottom" },
          { id: "UPPER", name: "Upper Ring", tier: "standard", priceAdd: 0, rows: ["E", "F", "G"], seatsPerRow: 22, shape: "wide" }
        ]
      },

      arena: {
        type: "arena",
        title: "Indoor Arena",
        centerLabel: "🥊 MAIN RING",
        description: "Compact sports arena with floor seats, lower bowl and upper bowl.",
        sections: [
          { id: "FLOOR", name: "Floor Seats", tier: "vip", priceAdd: 160, rows: ["A", "B"], seatsPerRow: 20, shape: "front" },
          { id: "LOWER", name: "Lower Bowl", tier: "gold", priceAdd: 80, rows: ["C", "D", "E"], seatsPerRow: 22, shape: "middle" },
          { id: "UPPER", name: "Upper Bowl", tier: "standard", priceAdd: 0, rows: ["F", "G", "H", "J"], seatsPerRow: 24, shape: "back" }
        ]
      },

      basketball: {
        type: "basketball",
        title: "Basketball Arena",
        centerLabel: "🏀 BASKETBALL COURT",
        description: "Indoor court with floor, lower bowl and upper seating.",
        sections: [
          { id: "COURTSIDE", name: "Courtside VIP", tier: "vip", priceAdd: 170, rows: ["A", "B"], seatsPerRow: 20, shape: "front" },
          { id: "LOWER", name: "Lower Bowl", tier: "gold", priceAdd: 85, rows: ["C", "D", "E"], seatsPerRow: 24, shape: "middle" },
          { id: "UPPER", name: "Upper Bowl", tier: "standard", priceAdd: 0, rows: ["F", "G", "H"], seatsPerRow: 26, shape: "back" }
        ]
      },

      esports: {
        type: "esports",
        title: "Esports Arena",
        centerLabel: "🎮 MAIN SCREEN",
        description: "Screen-focused arena with VIP screen view and LAN areas.",
        sections: [
          { id: "VIP", name: "VIP Screen View", tier: "vip", priceAdd: 100, rows: ["A", "B"], seatsPerRow: 22, shape: "front" },
          { id: "LAN", name: "Gold LAN Area", tier: "gold", priceAdd: 50, rows: ["C", "D", "E"], seatsPerRow: 22, shape: "middle" },
          { id: "STD", name: "Standard Arena", tier: "standard", priceAdd: 0, rows: ["F", "G", "H"], seatsPerRow: 24, shape: "back" }
        ]
      },

      festival: {
        type: "festival",
        title: "Festival Ground",
        centerLabel: "🎪 MAIN AREA",
        description: "Open venue with VIP, Gold and Standard field zones.",
        sections: [
          { id: "VIP", name: "VIP Festival Zone", tier: "vip", priceAdd: 120, rows: ["A", "B"], seatsPerRow: 24, shape: "front" },
          { id: "GOLD", name: "Gold Comfort Zone", tier: "gold", priceAdd: 60, rows: ["C", "D", "E"], seatsPerRow: 26, shape: "middle" },
          { id: "STD", name: "Standard Field Zone", tier: "standard", priceAdd: 0, rows: ["F", "G", "H", "J"], seatsPerRow: 28, shape: "back" }
        ]
      }
    };

    return layouts[type] || layouts.festival;
  }
};