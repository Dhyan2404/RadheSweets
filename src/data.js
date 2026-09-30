// Radhe Sweets - Comprehensive Seed Data & Store Schema

export const initialData = {
  shopInfo: {
    name: "Radhe Sweets",
    subName: "SWEETS & MORE",
    motto: "Sweet Moments With Radhe Krishna",
    owner: "Admin (AS)",
    phone: "+91 98765 43210",
    email: "contact@radhesweets.com",
    address: "Shop No. 12-14, Shivalik Plaza, IIM Road, Ahmedabad, Gujarat 380015",
    gstin: "24AAACR1234F1Z8",
    fssai: "10721026000452",
    upiId: "radhesweets@oksbi",
    currency: "₹",
    date: "25 Sep 2026"
  },

  branches: [
    { id: "br-1", code: "BR-NAV-01", name: "Navrangpura Flagship", city: "Ahmedabad", revenue: 42850, orders: 126, margin: "34.1%" },
    { id: "br-2", code: "BR-SAT-02", name: "Satellite Luxury Boutique", city: "Ahmedabad", revenue: 31400, orders: 88, margin: "36.5%" },
    { id: "br-3", code: "BR-SGH-03", name: "SG Highway Central Kitchen", city: "Ahmedabad", revenue: 58200, orders: 174, margin: "31.8%" }
  ],
  parkedBills: [
    { id: "park-1", label: "Token #14 (Mr. Patel)", time: "10:15 AM", itemsCount: 2, total: 360, items: [
      { name: "Kaju Katli", qty: 0.5, unit: "kg", rate: 450, total: 225 },
      { name: "Special Punjabi Samosa", qty: 3, unit: "pcs", rate: 45, total: 135 }
    ]}
  ],

  rawMaterials: [
    { id: "rm-1", name: "Whole Goan Cashews (W320)", stock: 85, unit: "kg", unitCost: 250, reorderLevel: 25, expiry: "15 Dec 2026", isPerishable: false },
    { id: "rm-2", name: "Fresh Mawa / Khoya", stock: 18, unit: "kg", unitCost: 120, reorderLevel: 20, expiry: "28 Sep 2026", isPerishable: true },
    { id: "rm-3", name: "Fresh Paneer / Chhena", stock: 12, unit: "kg", unitCost: 180, reorderLevel: 15, expiry: "27 Sep 2026", isPerishable: true },
    { id: "rm-4", name: "Shuddh Desi Ghee (Bilona)", stock: 140, unit: "kg", unitCost: 620, reorderLevel: 40, expiry: "30 Mar 2027", isPerishable: false },
    { id: "rm-5", name: "Double Sulphur Sugar", stock: 210, unit: "kg", unitCost: 42, reorderLevel: 50, expiry: "10 Jan 2027", isPerishable: false },
    { id: "rm-6", name: "Kashmiri Mongra Saffron", stock: 120, unit: "grams", unitCost: 220, reorderLevel: 30, expiry: "20 May 2027", isPerishable: false },
    { id: "rm-7", name: "Eco Sweet Box (1kg Gold Emboss)", stock: 650, unit: "boxes", unitCost: 18, reorderLevel: 100, expiry: "N/A", isPerishable: false },
    { id: "rm-8", name: "Eco Sweet Box (500g)", stock: 820, unit: "boxes", unitCost: 12, reorderLevel: 150, expiry: "N/A", isPerishable: false }
  ],

  advanceOrders: [
    {
      id: "ADV-2026-001",
      customerName: "Patel Family Wedding",
      customerPhone: "+91 98765 67890",
      eventDate: "05 Oct 2026",
      eventType: "Wedding Catering",
      itemsSummary: "50kg Kaju Katli, 50kg Motichoor Ladoo (Pure Ghee)",
      totalAmount: 30500,
      depositPaid: 15000,
      balanceDue: 15500,
      status: "Confirmed"
    },
    {
      id: "ADV-2026-002",
      customerName: "Reliance Petro Corporate Gifting",
      customerPhone: "+91 98765 12345",
      eventDate: "12 Oct 2026",
      eventType: "Corporate Festival Hampers",
      itemsSummary: "120 Artisanal Dry Fruit Sweet Boxes (1kg each)",
      totalAmount: 54000,
      depositPaid: 54000,
      balanceDue: 0,
      status: "Completed"
    },
    {
      id: "ADV-2026-003",
      customerName: "Mehta Griha Pravesh",
      customerPhone: "+91 98765 43210",
      eventDate: "18 Oct 2026",
      eventType: "House Warming",
      itemsSummary: "20kg Dry Fruit Barfi, 10kg Kesar Peda",
      totalAmount: 12200,
      depositPaid: 5000,
      balanceDue: 7200,
      status: "Confirmed"
    }
  ],

  zReports: [
    {
      id: "ZR-20260925-01",
      shift: "Morning Counter Shift (08:00 AM - 02:00 PM)",
      cashier: "Anand Shah (AS)",
      openingFloat: 5000,
      expectedCash: 18450,
      countedCash: 18450,
      variance: 0,
      upiTotal: 14200,
      cardTotal: 6200,
      totalSales: 38850,
      status: "Balanced"
    }
  ],

  auditLogs: [
    { time: "10:28 AM", user: "Admin (AS)", action: "Bill Settled", details: "Order #SA00129 created for ₹565 (Cash)" },
    { time: "10:15 AM", user: "Admin (AS)", action: "Bill Parked", details: "Parked bill Token #14 (Patel) during counter rush" },
    { time: "09:40 AM", user: "Head Chef", action: "Batch Logged", details: "Fresh batch recorded: 10kg Kaju Katli (Consumed 7kg Cashews, 3.5kg Sugar)" },
    { time: "08:00 AM", user: "Admin (AS)", action: "Drawer Opened", details: "Opening cash float verified: ₹5,000" }
  ],

  kpis: {
    customers: { value: 184, change: "+12% today", isUp: true, sub: "today" },
    sales: { value: 42850, change: "+8.4%", isUp: true, formatted: "₹42,850" },
    orders: { value: 126, change: "+9.2%", isUp: true, formatted: "126" },
    profit: { value: 14620, change: "34.1% margin", isUp: true, formatted: "₹14,620" },
    cost: { value: 28230, change: "65.9%", isUp: false, formatted: "₹28,230" },
    returning: { value: 76, change: "+41.3%", isUp: true, formatted: "76", sub: "customers" }
  },

  orderStatusCounts: {
    delivered: 68,
    processing: 26,
    pending: 24,
    canceled: 8,
    total: 126
  },

  salesOverview: [
    { day: "1 Sep", amount: 14500 },
    { day: "5 Sep", amount: 21000 },
    { day: "10 Sep", amount: 18500 },
    { day: "15 Sep", amount: 32000 },
    { day: "20 Sep", amount: 28000 },
    { day: "25 Sep", amount: 42850 },
    { day: "30 Sep", amount: 48000 }
  ],

  categories: ["All", "Sweets", "Snacks", "Beverages"],

  sweets: [
    {
      id: "sw-1",
      name: "Kaju Katli",
      tagline: "Dry Fruit Sweet",
      category: "Sweets",
      pricePerKg: 450,
      costPrice: 280,
      grossMargin: "37.8%",
      stock: 45,
      unit: "kg",
      stockStatus: "In Stock",
      badge: "In Stock",
      code: "KK",
      description: "Signature diamond-cut cashews cooked in rich sugar syrup with authentic edible silver vark.",
      image: "./assets/kaju_katli.png",
      fallbackImage: "./assets/kaju_katli.png"
    },
    {
      id: "sw-2",
      name: "Rasgulla",
      tagline: "Chhena / Bengali",
      category: "Sweets",
      pricePerKg: 320,
      costPrice: 195,
      grossMargin: "39.1%",
      stock: 38,
      unit: "kg",
      stockStatus: "In Stock",
      badge: "In Stock",
      code: "RG",
      description: "Tender, spongy fresh cottage cheese chhena dumplings soaked in delicate fragrant cardamom syrup.",
      image: "./assets/rasgulla.png",
      fallbackImage: "./assets/rasgulla.png"
    },
    {
      id: "sw-3",
      name: "Gulab Jamun",
      tagline: "Mawa Sweet",
      category: "Sweets",
      pricePerKg: 180,
      costPrice: 105,
      grossMargin: "41.7%",
      stock: 52,
      unit: "kg",
      stockStatus: "In Stock",
      badge: "In Stock",
      code: "GJ",
      description: "Classic golden fried khoya dumplings immersed in warm rose petal and green cardamom infused sugar nectar.",
      image: "./assets/gulab_jamun.png",
      fallbackImage: "./assets/gulab_jamun.png"
    },
    {
      id: "sw-4",
      name: "Motichoor Ladoo",
      tagline: "Desi Ghee",
      category: "Sweets",
      pricePerKg: 160,
      costPrice: 98,
      grossMargin: "38.8%",
      stock: 8,
      unit: "kg",
      stockStatus: "Low Stock",
      badge: "Low Stock",
      code: "ML",
      description: "Melt-in-mouth tiny besan pearls fried in pure Shuddh Desi Ghee, infused with saffron and crunchy melon seeds.",
      image: "./assets/motichoor_ladoo.png",
      fallbackImage: "./assets/motichoor_ladoo.png"
    },
    {
      id: "sw-5",
      name: "Kesar Peda",
      tagline: "Special Milk Peda",
      category: "Sweets",
      pricePerKg: 380,
      costPrice: 235,
      grossMargin: "38.2%",
      stock: 12,
      unit: "kg",
      stockStatus: "Low Stock",
      badge: "Low Stock",
      code: "KP",
      description: "Traditional milk fudge prepared from fresh mawa, scented with pure Kashmiri saffron and garnished with pistachios.",
      image: "./assets/kesar_peda.png",
      fallbackImage: "./assets/kesar_peda.png"
    },
    {
      id: "sw-6",
      name: "Dry Fruit Barfi",
      tagline: "Dry Fruit Sweet",
      category: "Sweets",
      pricePerKg: 420,
      costPrice: 260,
      grossMargin: "38.1%",
      stock: 28,
      unit: "kg",
      stockStatus: "In Stock",
      badge: "In Stock",
      code: "DF",
      description: "Nutritious sugar-free artisanal barfi packed with figs (anjeer), almonds, cashews, raisins, and organic honey.",
      image: "./assets/dry_fruit_barfi.png",
      fallbackImage: "./assets/dry_fruit_barfi.png"
    },
    {
      id: "sw-7",
      name: "Milk Cake",
      tagline: "Caramelized Mawa",
      category: "Sweets",
      pricePerKg: 300,
      costPrice: 185,
      grossMargin: "38.3%",
      stock: 34,
      unit: "kg",
      stockStatus: "In Stock",
      badge: "In Stock",
      code: "MC",
      description: "Traditional dual-toned Alwar style caramelized mawa confection with rich granular texture and buttery aroma.",
      image: "./assets/milk_cake.png",
      fallbackImage: "./assets/milk_cake.png"
    },
    {
      id: "sw-8",
      name: "Soan Papdi",
      tagline: "Desi Ghee",
      category: "Sweets",
      pricePerKg: 200,
      costPrice: 120,
      grossMargin: "40.0%",
      stock: 40,
      unit: "kg",
      stockStatus: "In Stock",
      badge: "In Stock",
      code: "SP",
      description: "Crisp, flaky, and layered traditional sweet confection that dissolves effortlessly on your tongue.",
      image: "./assets/soan_papdi.png",
      fallbackImage: "./assets/soan_papdi.png"
    },
    {
      id: "sw-9",
      name: "Special Punjabi Samosa",
      tagline: "Crisp Fried Farsan",
      category: "Snacks",
      pricePerKg: 180,
      costPrice: 95,
      grossMargin: "47.2%",
      stock: 50,
      unit: "kg",
      stockStatus: "In Stock",
      badge: "In Stock",
      code: "SM",
      description: "Crispy triangular pastry stuffed with spicy spiced potatoes, green peas, and whole roasted coriander.",
      image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80",
      fallbackImage: "https://images.unsplash.com/photo-1601050690117-94f5f6fa8bd7?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: "sw-10",
      name: "Khasta Moong Dal Kachori",
      tagline: "Spiced Farsan",
      category: "Snacks",
      pricePerKg: 220,
      costPrice: 120,
      grossMargin: "45.5%",
      stock: 35,
      unit: "kg",
      stockStatus: "In Stock",
      badge: "In Stock",
      code: "KC",
      description: "Flaky deep-fried puffed pastry packed with aromatic yellow lentil stuffing and tangy amchur spices.",
      image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80",
      fallbackImage: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: "sw-11",
      name: "Special Masala Chai",
      tagline: "Kulhad Indian Tea",
      category: "Beverages",
      pricePerKg: 120,
      costPrice: 50,
      grossMargin: "58.3%",
      stock: 100,
      unit: "litres",
      stockStatus: "In Stock",
      badge: "In Stock",
      code: "CH",
      description: "Freshly brewed full-cream milk tea with crushed ginger, green cardamom, cloves, and cinnamon.",
      image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80",
      fallbackImage: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: "sw-12",
      name: "Kesar Mango Lassi",
      tagline: "Thick Chilled Yogurt",
      category: "Beverages",
      pricePerKg: 160,
      costPrice: 75,
      grossMargin: "53.1%",
      stock: 40,
      unit: "litres",
      stockStatus: "In Stock",
      badge: "In Stock",
      code: "ML",
      description: "Creamy Gujarati curd blended with rich Alphonso mango pulp and saffron threads, served super chilled.",
      image: "https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=600&q=80",
      fallbackImage: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80"
    }
  ],

  customers: [
    {
      id: "cust-1",
      name: "Jignesh Shah",
      phone: "+91 98765 67890",
      email: "jignesh@gmail.com",
      address: "B-402, Samruddhi Heights, Satellite, Ahmedabad, Gujarat",
      type: "VIP",
      tier: "VIP",
      loyaltyPoints: 420,
      khataBalance: 1250,
      creditLimit: 10000,
      totalOrders: 28,
      totalSpent: 8450,
      notes: "Preferred customer. Prefers low-sugar sweets and extra silver vark."
    },
    {
      id: "cust-2",
      name: "Riya Patel",
      phone: "+91 98765 43210",
      email: "riya@gmail.com",
      address: "12, Shanti Niketan, Alkapuri, Vadodara, Gujarat",
      type: "Regular",
      tier: "Regular",
      loyaltyPoints: 85,
      khataBalance: 0,
      creditLimit: 5000,
      totalOrders: 3,
      totalSpent: 1250,
      notes: "Likes fresh hot Gulab Jamun for family dinners."
    },
    {
      id: "cust-3",
      name: "Amit Kumar",
      phone: "+91 98765 12345",
      email: "amit@gmail.com",
      address: "78, Ring Road, Vesu, Surat, Gujarat",
      type: "Regular",
      tier: "Regular",
      loyaltyPoints: 310,
      khataBalance: 4200,
      creditLimit: 15000,
      totalOrders: 12,
      totalSpent: 4320,
      notes: "Frequent corporate bulk order buyer."
    },
    {
      id: "cust-4",
      name: "Priya Panchal",
      phone: "+91 98765 11122",
      email: "priya@gmail.com",
      address: "301, Pushpak Flats, Vastrapur, Ahmedabad",
      type: "Regular",
      tier: "Regular",
      loyaltyPoints: 160,
      khataBalance: 0,
      creditLimit: 5000,
      totalOrders: 7,
      totalSpent: 2890,
      notes: "Always requests gift box packaging."
    },
    {
      id: "cust-5",
      name: "Neha Shah",
      phone: "+91 98765 77665",
      email: "neha@gmail.com",
      address: "Sector 21, Gandhinagar, Gujarat",
      type: "Regular",
      tier: "Regular",
      loyaltyPoints: 215,
      khataBalance: 850,
      creditLimit: 7500,
      totalOrders: 9,
      totalSpent: 3410,
      notes: "Regular weekend sweets purchaser."
    },
    {
      id: "cust-6",
      name: "Meet Kothari",
      phone: "+91 98765 99887",
      email: "meet@gmail.com",
      address: "55, Navrangpura, Ahmedabad",
      type: "New",
      tier: "New",
      loyaltyPoints: 30,
      khataBalance: 0,
      creditLimit: 2000,
      totalOrders: 2,
      totalSpent: 780,
      notes: "New customer from online search."
    },
    {
      id: "cust-7",
      name: "Rakesh Thakkar",
      phone: "+91 98765 11223",
      email: "rakesh@gmail.com",
      address: "Kalawad Road, Rajkot, Gujarat",
      type: "Regular",
      tier: "Regular",
      loyaltyPoints: 140,
      khataBalance: 0,
      creditLimit: 5000,
      totalOrders: 5,
      totalSpent: 1950,
      notes: "Prefers Dry Fruit Barfi & Motichoor Ladoo."
    }
  ],

  orders: [
    {
      id: "SA00129",
      date: "25 Sep 2026, 10:28 AM",
      customerId: "cust-1",
      customerName: "Jignesh Shah",
      customerPhone: "+91 98765 67890",
      customerAddress: "Ahmedabad, Gujarat",
      itemsCount: 3,
      total: 565,
      subtotal: 565,
      discount: 0,
      tax: 0,
      paymentMethod: "Cash",
      status: "Completed",
      notes: "Special packing for festival gifting.",
      items: [
        { name: "Kaju Katli", quantity: 0.5, unit: "kg", rate: 450, total: 225 },
        { name: "Gulab Jamun", quantity: 1, unit: "kg", rate: 180, total: 180 },
        { name: "Motichoor Ladoo", quantity: 1, unit: "kg", rate: 160, total: 160 }
      ]
    },
    {
      id: "SA00128",
      date: "25 Sep 2026, 10:15 AM",
      customerId: "cust-2",
      customerName: "Riya Patel",
      customerPhone: "+91 98765 43210",
      customerAddress: "Vadodara, Gujarat",
      itemsCount: 3,
      total: 450,
      subtotal: 450,
      discount: 0,
      tax: 0,
      paymentMethod: "UPI",
      status: "Completed",
      notes: "Immediate counter delivery.",
      items: [
        { name: "Kaju Katli", quantity: 1, unit: "kg", rate: 450, total: 450 }
      ]
    },
    {
      id: "SA00127",
      date: "24 Sep 2026, 7:30 PM",
      customerId: "cust-3",
      customerName: "Amit Kumar",
      customerPhone: "+91 98765 12345",
      customerAddress: "Surat, Gujarat",
      itemsCount: 4,
      total: 320,
      subtotal: 320,
      discount: 0,
      tax: 0,
      paymentMethod: "Cash",
      status: "Pending",
      notes: "Awaiting pickup after 8 PM.",
      items: [
        { name: "Rasgulla", quantity: 1, unit: "kg", rate: 320, total: 320 }
      ]
    },
    {
      id: "SA00126",
      date: "24 Sep 2026, 5:10 PM",
      customerId: "cust-4",
      customerName: "Priya Panchal",
      customerPhone: "+91 98765 11122",
      customerAddress: "Ahmedabad, Gujarat",
      itemsCount: 8,
      total: 620,
      subtotal: 620,
      discount: 0,
      tax: 0,
      paymentMethod: "Card",
      status: "Completed",
      notes: "Corporate anniversary celebration.",
      items: [
        { name: "Dry Fruit Barfi", quantity: 1, unit: "kg", rate: 420, total: 420 },
        { name: "Soan Papdi", quantity: 1, unit: "kg", rate: 200, total: 200 }
      ]
    },
    {
      id: "SA00125",
      date: "23 Sep 2026, 2:45 PM",
      customerId: "cust-5",
      customerName: "Neha Shah",
      customerPhone: "+91 98765 77665",
      customerAddress: "Gandhinagar, Gujarat",
      itemsCount: 3,
      total: 290,
      subtotal: 290,
      discount: 0,
      tax: 0,
      paymentMethod: "UPI",
      status: "Canceled",
      notes: "Customer canceled prior to packing.",
      items: [
        { name: "Motichoor Ladoo", quantity: 1, unit: "kg", rate: 160, total: 160 },
        { name: "Gulab Jamun", quantity: 0.5, unit: "kg", rate: 180, total: 90 },
        { name: "Special Punjabi Samosa", quantity: 2, unit: "pcs", rate: 20, total: 40 }
      ]
    }
  ],

  expenses: {
    total: 28230,
    change: "+5.6% from last month",
    breakdown: [
      { category: "Raw Materials", amount: 12450, percentage: 44.1, color: "#C86D3B" },
      { category: "Utilities", amount: 5320, percentage: 18.8, color: "#DDA15E" },
      { category: "Staff Salary", amount: 6000, percentage: 21.3, color: "#10B981" },
      { category: "Marketing", amount: 2460, percentage: 8.7, color: "#0284C7" },
      { category: "Other", amount: 2000, percentage: 7.1, color: "#8B5CF6" }
    ],
    items: [
      { id: "exp-1", date: "25 Sep", description: "Raw Materials Purchase (Pure Ghee & Mawa)", category: "Raw Materials", amount: 12450, status: "Paid" },
      { id: "exp-2", date: "22 Sep", description: "Utilities (Electricity & Commercial Gas)", category: "Utilities", amount: 5320, status: "Paid" },
      { id: "exp-3", date: "20 Sep", description: "Staff Salary (Kitchen Halwai & Counter Staff)", category: "Staff Salary", amount: 6000, status: "Paid" },
      { id: "exp-4", date: "18 Sep", description: "Marketing & Festive Banners", category: "Marketing", amount: 2460, status: "Paid" },
      { id: "exp-5", date: "15 Sep", description: "Eco Sweet Packaging Boxes & Bags", category: "Other", amount: 2000, status: "Paid" }
    ]
  },

  analytics: {
    salesByChannel: {
      onlineOrders: { amount: 18240, percentage: 42.6 },
      storeOrders: { amount: 24610, percentage: 57.4 }
    },
    avgOrderValue: 340,
    avgOrderChange: "+5.1%",
    totalOrdersCount: 126,
    ordersGrowth: "+9.2%"
  }
};
