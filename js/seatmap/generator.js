const SeatMapGenerator = {
  randomFromSeed(text) {
    let seed = 0;

    for (let i = 0; i < text.length; i++) {
      seed = (seed * 31 + text.charCodeAt(i)) % 1000000;
    }

    return Math.abs(Math.sin(seed) * 10000) % 1;
  },

  isPairProtected(number) {
    return (
      number === 6 ||
      number === 7 ||
      number === 14 ||
      number === 15 ||
      number === 22 ||
      number === 23
    );
  },

  getSoldChance(tier) {
    if (tier === "vip") return 0.72;
    if (tier === "gold") return 0.64;
    return 0.55;
  },

  isSold(eventTitle, sectionId, row, number, tier) {
    if (this.isPairProtected(number)) {
      return false;
    }

    const key = `${eventTitle}-${sectionId}-${row}-${number}`;
    const chance = this.getSoldChance(tier);

    return this.randomFromSeed(key) < chance;
  },

  createSeat(event, section, row, number) {
    const price = Math.max(10, event.price + section.priceAdd);

    return {
      code: `${section.id}-${row}${number}`,
      short: `${row}${number}`,
      sectionId: section.id,
      sectionName: section.name,
      tier: section.tier,
      price,
      row,
      number,
      sold: this.isSold(
        event.title,
        section.id,
        row,
        number,
        section.tier
      )
    };
  },

  generateSection(event, section) {
    const seats = [];

    section.rows.forEach(row => {
      for (let number = 1; number <= section.seatsPerRow; number++) {
        seats.push(
          this.createSeat(event, section, row, number)
        );
      }
    });

    return {
      ...section,
      seats
    };
  },

  generate(event, layout) {
    const sections = layout.sections.map(section =>
      this.generateSection(event, section)
    );

    const allSeats = sections.flatMap(section => section.seats);

    const soldSeats = allSeats.filter(seat => seat.sold);
    const availableSeats = allSeats.filter(seat => !seat.sold);

    return {
      event,
      layout,
      sections,
      stats: {
        total: allSeats.length,
        sold: soldSeats.length,
        available: availableSeats.length
      }
    };
  }
};