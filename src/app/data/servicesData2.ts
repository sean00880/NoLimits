export const lawncareServices = {
  services: [
    {
      id: "basic-lawn-mowing",
      name: "Basic Lawn Mowing",
      price: 70,
      pricing: {
        weekly: 55,
        "bi-weekly": 100,
        monthly: 65,
        "one-time": 70,
      },
      img: "/images/landscape1.jpg",
      description: [
        "Mowing front and back lawns",
        "Trimming edges and pathways",
        "Grass clipping cleanup",
      ],
    },
    {
      id: "hedge-trimming",
      name: "Hedge Trimming",
      price: 65,
      pricing: {
        weekly: 50,
        "bi-weekly": 90,
        monthly: 60,
        "one-time": 65,
      },
      img: "/images/shrub.jpg",
      description: [
        "Trimming and shaping of hedges",
        "Removal of trimmings",
        "Ensuring healthy hedge growth",
      ],
    },
    {
      id: "tree-weed-removal",
      name: "Tree/Weed Removal",
      price: 60,
      pricing: {
        weekly: 45,
        "bi-weekly": 75,
        monthly: 55,
        "one-time": 60,
      },
      img: "/images/treeremoval.jpg",
      description: [
        "Removing weeds and small trees from lawns",
        "Preventative treatments to inhibit regrowth",
        "Complete debris and stump cleanup",
      ],
    },
  ],
  packages: [
    {
      id: "lawn-care-comprehensive-package",
      name: "Lawn Care Comprehensive Package",
      price: 300,
      pricing: {
        weekly: 100,
        "bi-weekly": 240,
        monthly: 280,
        "one-time": 300,
      },
      img: "/images/lawncare2.png",
      servicesIncluded: [
        "basic-lawn-mowing",
        "hedge-trimming",
        "tree-weed-removal",
      ],
    },
  ],
};

export const pressureWashingServices = {
  services: [
    {
      id: "driveway-spot-cleaning",
      name: "Driveway Spot Cleaning",
      price: 120,
      pricing: {
        weekly: 75,
        "bi-weekly": 85,
        monthly: 100,
        "one-time": 120,
      },
      img: "/images/driveway.png",
      description: [
        "Targeted cleaning of driveway spots",
        "Oil and grease removal",
        "Eco-friendly methods",
      ],
    },
    {
      id: "patio-deck-cleaning",
      name: "Patio and Deck Cleaning",
      price: 150,
      pricing: {
        weekly: 90,
        "bi-weekly": 110,
        monthly: 130,
        "one-time": 150,
      },
      img: "/images/patiodeck.jpg",
      description: [
        "Pressure washing of patios and decks",
        "Mildew and algae removal",
        "Surface restoration",
      ],
    },
  ],
  packages: [
    {
      id: "full-exterior-cleaning-package",
      name: "Full Exterior Cleaning Package",
      price: 350,
      pricing: {
        weekly: 145,
        "bi-weekly": 280,
        monthly: 320,
        "one-time": 350,
      },
      img: "/images/pressurewash.jpg",
      servicesIncluded: ["driveway-spot-cleaning", "patio-deck-cleaning"],
    },
  ],
};

export const dumpRunServices = {
  services: [
    {
      id: "small-junk-pickup",
      name: "Small Junk Pickup",
      price: 100,
      pricing: {
        weekly: 50,
        "bi-weekly": 60,
        monthly: 75,
        "one-time": 100,
      },
      img: "/images/junk.webp",
      description: [
        "Pickup of small household items",
        "Eco-friendly disposal",
        "Recycling where applicable",
      ],
    },
    {
      id: "construction-debris-removal",
      name: "Construction Debris Removal",
      price: 600,
      pricing: {
        weekly: 400,
        "bi-weekly": 450,
        monthly: 500,
        "one-time": 600,
      },
      img: "/images/constructiondebris.jpg",
      description: [
        "Pickup and removal of construction waste",
        "Heavy-duty debris hauling",
        "Disposal of materials like wood, concrete, and metal",
      ],
    },
  ],
  packages: [
    {
      id: "complete-junk-removal-package",
      name: "Complete Junk Removal Package",
      price: 700,
      pricing: {
        weekly: 500,
        "bi-weekly": 550,
        monthly: 600,
        "one-time": 700,
      },
      img: "/images/junkremoval.jpg",
      servicesIncluded: [
        "small-junk-pickup",
        "construction-debris-removal",
      ],
    },
  ],
};

export const gardeningServices = {
  services: [
    {
      id: "planting",
      name: "Planting",
      price: 100,
      pricing: {
        weekly: 65,
        "bi-weekly": 75,
        monthly: 85,
        "one-time": 100,
      },
      img: "/images/planting.jpg",
      description: [
        "Planting seasonal flowers and plants",
        "Soil preparation",
        "Mulching and watering",
      ],
    },
    {
      id: "garden-bed-maintenance",
      name: "Garden Bed Maintenance",
      price: 95,
      pricing: {
        weekly: 55,
        "bi-weekly": 65,
        monthly: 80,
        "one-time": 95,
      },
      img: "/images/gardenbed.webp",
      description: [
        "Weeding and trimming plants",
        "Fertilizer application",
        "General cleanup",
      ],
    },
  ],
  packages: [
    {
      id: "complete-garden-package",
      name: "Complete Garden Package",
      price: 400,
      pricing: {
        weekly: 250,
        "bi-weekly": 300,
        monthly: 350,
        "one-time": 400,
      },
      img: "/images/gardening.webp",
      servicesIncluded: ["planting", "garden-bed-maintenance"],
    },
  ],
};
