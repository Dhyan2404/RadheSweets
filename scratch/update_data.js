const fs = require('fs');
const path = require('path');

const dataJsPath = path.join(__dirname, '..', 'src', 'data.js');
let dataContent = fs.readFileSync(dataJsPath, 'utf8');

const branches = [
  { 
    id: "br-1", 
    code: "BR-SEC21-01", 
    name: "Sector 21 Flagship Sweets", 
    city: "Gandhinagar", 
    address: "Shop 14-16, Super Mall, Sector 21, Gandhinagar 382021",
    phone: "+91 79 2322 4310",
    email: "sector21@radhesweets.com",
    upiId: "radhesweets.sec21@oksbi",
    upiName: "Radhe Sweets Sector 21",
    gstin: "24AAACR1234F1Z8",
    fssai: "10721026000452",
    revenue: 48500, 
    orders: 132, 
    margin: "34.2%" 
  },
  { 
    id: "br-2", 
    code: "BR-KUD-02", 
    name: "Kudasan Premium Sweets & Farsan", 
    city: "Gandhinagar", 
    address: "GF-08, Pramukh Arcade, Near Reliance Cross Rd, Kudasan, Gandhinagar 382421",
    phone: "+91 79 2360 8890",
    email: "kudasan@radhesweets.com",
    upiId: "radhesweets.kudasan@okaxis",
    upiName: "Radhe Sweets Kudasan",
    gstin: "24AAACR1234F2Z7",
    fssai: "10721026000453",
    revenue: 39200, 
    orders: 98, 
    margin: "33.5%" 
  },
  { 
    id: "br-3", 
    code: "BR-INFO-03", 
    name: "Infocity IT Corridor Sweets", 
    city: "Gandhinagar", 
    address: "Food Court 02, Infocity Superstructure, GH-0 Rd, Gandhinagar 382007",
    phone: "+91 79 2321 2210",
    email: "infocity@radhesweets.com",
    upiId: "radhesweets.infocity@okicici",
    upiName: "Radhe Sweets Infocity",
    gstin: "24AAACR1234F3Z6",
    fssai: "10721026000454",
    revenue: 44100, 
    orders: 115, 
    margin: "35.0%" 
  },
  { 
    id: "br-4", 
    code: "BR-SAR-04", 
    name: "Sargasan Royal Confectionery", 
    city: "Gandhinagar", 
    address: "Block A, Swagat Holiday Mall, Sargasan Cross Road, Gandhinagar 382421",
    phone: "+91 79 2360 5540",
    email: "sargasan@radhesweets.com",
    upiId: "radhesweets.sargasan@okhdfc",
    upiName: "Radhe Sweets Sargasan",
    gstin: "24AAACR1234F4Z5",
    fssai: "10721026000455",
    revenue: 32800, 
    orders: 84, 
    margin: "32.8%" 
  },
  { 
    id: "br-5", 
    code: "BR-GIFT-05", 
    name: "GIFT City International Boutique", 
    city: "Gandhinagar", 
    address: "Concourse Level, Brigade International Fin. Centre, GIFT City, Gandhinagar 382355",
    phone: "+91 79 2390 1120",
    email: "giftcity@radhesweets.com",
    upiId: "radhesweets.giftcity@oksbi",
    upiName: "Radhe Sweets GIFT City",
    gstin: "24AAACR1234F5Z4",
    fssai: "10721026000456",
    revenue: 58400, 
    orders: 142, 
    margin: "36.5%" 
  },
  { 
    id: "br-6", 
    code: "BR-SEC11-06", 
    name: "Sector 11 Administrative Arcade", 
    city: "Gandhinagar", 
    address: "GF-11, Megh Malhar Complex, Cinema Road, Sector 11, Gandhinagar 382011",
    phone: "+91 79 2324 7780",
    email: "sector11@radhesweets.com",
    upiId: "radhesweets.sec11@okaxis",
    upiName: "Radhe Sweets Sector 11",
    gstin: "24AAACR1234F6Z3",
    fssai: "10721026000457",
    revenue: 29400, 
    orders: 76, 
    margin: "31.9%" 
  },
  { 
    id: "br-7", 
    code: "BR-SEC07-07", 
    name: "Sector 7 Heritage Sweets", 
    city: "Gandhinagar", 
    address: "Shop 4-5, Ch-3 Circle Market, Sector 7, Gandhinagar 382007",
    phone: "+91 79 2323 1190",
    email: "sector7@radhesweets.com",
    upiId: "radhesweets.sec7@okicici",
    upiName: "Radhe Sweets Sector 7",
    gstin: "24AAACR1234F7Z2",
    fssai: "10721026000458",
    revenue: 31600, 
    orders: 82, 
    margin: "33.1%" 
  },
  { 
    id: "br-8", 
    code: "BR-RAN-08", 
    name: "Randesan Riverside Sweets", 
    city: "Gandhinagar", 
    address: "Near Riverfront Walk, Pramukh Elegance, Randesan, Gandhinagar 382421",
    phone: "+91 79 2360 9930",
    email: "randesan@radhesweets.com",
    upiId: "radhesweets.randesan@okhdfc",
    upiName: "Radhe Sweets Randesan",
    gstin: "24AAACR1234F8Z1",
    fssai: "10721026000459",
    revenue: 27900, 
    orders: 71, 
    margin: "32.0%" 
  },
  { 
    id: "br-9", 
    code: "BR-SEC28-09", 
    name: "Sector 28 GIDC Sweets & Snacks", 
    city: "Gandhinagar", 
    address: "Plot 102, GIDC Commercial Plaza, Sector 28, Gandhinagar 382028",
    phone: "+91 79 2328 3340",
    email: "sector28@radhesweets.com",
    upiId: "radhesweets.sec28@oksbi",
    upiName: "Radhe Sweets Sector 28",
    gstin: "24AAACR1234F9Z0",
    fssai: "10721026000460",
    revenue: 35200, 
    orders: 94, 
    margin: "31.5%" 
  },
  { 
    id: "br-10", 
    code: "BR-VAV-10", 
    name: "Vavol Metro Confectionery", 
    city: "Gandhinagar", 
    address: "Shop 06, Shivalik Square, Vavol Cross Roads, Gandhinagar 382016",
    phone: "+91 79 2326 4410",
    email: "vavol@radhesweets.com",
    upiId: "radhesweets.vavol@okaxis",
    upiName: "Radhe Sweets Vavol",
    gstin: "24AAACR1234G1Z9",
    fssai: "10721026000461",
    revenue: 26100, 
    orders: 68, 
    margin: "32.4%" 
  },
  { 
    id: "br-11", 
    code: "BR-BHA-11", 
    name: "Bhaijipura Junction Mithai Hub", 
    city: "Gandhinagar", 
    address: "GF-03, Radhe Krishna Arcade, Koba-Gandhinagar Highway, Bhaijipura 382421",
    phone: "+91 79 2360 7720",
    email: "bhaijipura@radhesweets.com",
    upiId: "radhesweets.bhaijipura@okicici",
    upiName: "Radhe Sweets Bhaijipura",
    gstin: "24AAACR1234G2Z8",
    fssai: "10721026000462",
    revenue: 33500, 
    orders: 89, 
    margin: "33.8%" 
  }
];

const customerNamesPerBranch = [
  // br-1 Sector 21
  [
    { name: "Jignesh Shah", phone: "+91 98250 11001", notes: "Prefers low-sugar sweets & extra silver vark", type: "VIP", tier: "VIP", points: 420, spent: 8450, orders: 28 },
    { name: "Riya Patel", phone: "+91 98250 11002", notes: "Likes fresh hot Gulab Jamun for family dinners", type: "Regular", tier: "Regular", points: 85, spent: 1250, orders: 3 },
    { name: "Amit Kumar", phone: "+91 98250 11003", notes: "Frequent corporate bulk order buyer", type: "VIP", tier: "VIP", points: 310, spent: 4320, orders: 12 },
    { name: "Priya Panchal", phone: "+91 98250 11004", notes: "Always requests gift box packaging", type: "Regular", tier: "Regular", points: 160, spent: 2890, orders: 7 },
    { name: "Neha Shah", phone: "+91 98250 11005", notes: "Regular weekend sweets purchaser", type: "Regular", tier: "Regular", points: 215, spent: 3410, orders: 9 },
    { name: "Meet Kothari", phone: "+91 98250 11006", notes: "New customer from online search", type: "New", tier: "New", points: 30, spent: 780, orders: 2 },
    { name: "Rakesh Thakkar", phone: "+91 98250 11007", notes: "Prefers Dry Fruit Barfi & Motichoor Ladoo", type: "Regular", tier: "Regular", points: 140, spent: 1950, orders: 5 },
    { name: "Harshil Vora", phone: "+91 98250 11008", notes: "Buys Kaju Katli for temple prasad", type: "Regular", tier: "Regular", points: 95, spent: 1420, orders: 4 },
    { name: "Dipti Trivedi", phone: "+91 98250 11009", notes: "Enjoys Bengali Rasgulla and Sandesh", type: "Regular", tier: "Regular", points: 110, spent: 1650, orders: 6 },
    { name: "Bhavesh Prajapati", phone: "+91 98250 11010", notes: "Loves Mohanthal and Pure Ghee Halwa", type: "VIP", tier: "VIP", points: 390, spent: 5120, orders: 14 }
  ],
  // br-2 Kudasan
  [
    { name: "Shailesh Patel", phone: "+91 98250 22001", notes: "Reliance cross road resident, orders bulk Farsan", type: "VIP", tier: "VIP", points: 450, spent: 9100, orders: 24 },
    { name: "Hiren Joshi", phone: "+91 98250 22002", notes: "Buys Kesar Peda every Tuesday", type: "Regular", tier: "Regular", points: 180, spent: 2350, orders: 8 },
    { name: "Alpa Desai", phone: "+91 98250 22003", notes: "Prefers sugar-free sweet hampers", type: "Regular", tier: "Regular", points: 125, spent: 1890, orders: 5 },
    { name: "Nilesh Soni", phone: "+91 98250 22004", notes: "Jeweler at Kudasan, buys Diwali sweet gift boxes", type: "VIP", tier: "VIP", points: 520, spent: 11400, orders: 31 },
    { name: "Bhavna Dave", phone: "+91 98250 22005", notes: "Enjoys Anjeer Barfi and Pistachio Roll", type: "Regular", tier: "Regular", points: 140, spent: 2100, orders: 7 },
    { name: "Chirag Modi", phone: "+91 98250 22006", notes: "Weekend Farsan buyer, likes Dhokla & Khandvi", type: "Regular", tier: "Regular", points: 90, spent: 1320, orders: 4 },
    { name: "Meena Rathod", phone: "+91 98250 22007", notes: "Buys Motichoor Ladoo for family birthdays", type: "Regular", tier: "Regular", points: 165, spent: 2450, orders: 6 },
    { name: "Chetan Parmar", phone: "+91 98250 22008", notes: "Loves Rasmalai on Sunday mornings", type: "Regular", tier: "Regular", points: 75, spent: 980, orders: 3 },
    { name: "Swati Chauhan", phone: "+91 98250 22009", notes: "Orders wedding announcement sweet gift trays", type: "VIP", tier: "VIP", points: 340, spent: 6700, orders: 15 },
    { name: "Pratik Raval", phone: "+91 98250 22010", notes: "Regular milk sweets consumer", type: "New", tier: "New", points: 40, spent: 650, orders: 2 }
  ],
  // br-3 Infocity
  [
    { name: "Rohan Mehta", phone: "+91 98250 33001", notes: "TCS Software Engineer, regular dessert buyer", type: "Regular", tier: "Regular", points: 190, spent: 2800, orders: 9 },
    { name: "Sneha Iyer", phone: "+91 98250 33002", notes: "Infocity IT Park, enjoys Mysore Pak & Mysore Halwa", type: "Regular", tier: "Regular", points: 145, spent: 2150, orders: 6 },
    { name: "Ankit Sharma", phone: "+91 98250 33003", notes: "Tech team celebration bulk box orders", type: "VIP", tier: "VIP", points: 480, spent: 9800, orders: 26 },
    { name: "Tanvi Kulkarni", phone: "+91 98250 33004", notes: "Prefers Kaju Katli and Dry Fruit bites", type: "Regular", tier: "Regular", points: 110, spent: 1620, orders: 5 },
    { name: "Kunal Verma", phone: "+91 98250 33005", notes: "Late evening sweet tooth, orders Rabdi & Jalebi", type: "Regular", tier: "Regular", points: 85, spent: 1190, orders: 4 },
    { name: "Pooja Nair", phone: "+91 98250 33006", notes: "Likes South Indian & Gujarati fusion sweets", type: "Regular", tier: "Regular", points: 130, spent: 1940, orders: 6 },
    { name: "Vikramaditya Singh", phone: "+91 98250 33007", notes: "Corporate Director, orders executive hampers", type: "VIP", tier: "VIP", points: 610, spent: 13500, orders: 34 },
    { name: "Radhika Agarwal", phone: "+91 98250 33008", notes: "Prefers low-calorie Bengali sweets", type: "Regular", tier: "Regular", points: 155, spent: 2280, orders: 7 },
    { name: "Siddharth Rao", phone: "+91 98250 33009", notes: "Startup founder, frequent counter coffee & snack buyer", type: "Regular", tier: "Regular", points: 95, spent: 1410, orders: 4 },
    { name: "Manisha Gupta", phone: "+91 98250 33010", notes: "New employee in Infocity Tower", type: "New", tier: "New", points: 35, spent: 540, orders: 2 }
  ],
  // br-4 Sargasan
  [
    { name: "Paresh Gadhvi", phone: "+91 98250 44001", notes: "Swagat Holiday Mall shopkeeper, daily patron", type: "VIP", tier: "VIP", points: 380, spent: 7600, orders: 22 },
    { name: "Kokila Ben Patel", phone: "+91 98250 44002", notes: "Buys Pure Ghee Sukhdi & Churma Ladoo", type: "Regular", tier: "Regular", points: 175, spent: 2600, orders: 8 },
    { name: "Bharatbhai Shah", phone: "+91 98250 44003", notes: "Sargasan cross road trader, high volume orders", type: "VIP", tier: "VIP", points: 430, spent: 8900, orders: 25 },
    { name: "Hetalben Dave", phone: "+91 98250 44004", notes: "Buys fresh Malai Peda for festivals", type: "Regular", tier: "Regular", points: 120, spent: 1750, orders: 5 },
    { name: "Dharmesh Suthar", phone: "+91 98250 44005", notes: "Contractor, orders sweets for staff weekly", type: "Regular", tier: "Regular", points: 210, spent: 3300, orders: 11 },
    { name: "Varsha Vaghela", phone: "+91 98250 44006", notes: "Likes Cham Cham and Ras Kadam", type: "Regular", tier: "Regular", points: 90, spent: 1280, orders: 4 },
    { name: "Alpesh Makwana", phone: "+91 98250 44007", notes: "Prefers spicy Farsan with sweet Mawa Peda", type: "Regular", tier: "Regular", points: 140, spent: 2050, orders: 6 },
    { name: "Tejal Pancholi", phone: "+91 98250 44008", notes: "Teacher at nearby school, festival gift packs", type: "Regular", tier: "Regular", points: 105, spent: 1540, orders: 5 },
    { name: "Gaurav Pandya", phone: "+91 98250 44009", notes: "Youth customer, loves chocolate barfi", type: "Regular", tier: "Regular", points: 80, spent: 1100, orders: 3 },
    { name: "Rekhaben Barot", phone: "+91 98250 44010", notes: "New resident in Sargasan society", type: "New", tier: "New", points: 25, spent: 480, orders: 1 }
  ],
  // br-5 GIFT City
  [
    { name: "Aditya Singhania", phone: "+91 98250 55001", notes: "International Banker, executive client gifts", type: "VIP", tier: "VIP", points: 720, spent: 16800, orders: 38 },
    { name: "Natasha Shroff", phone: "+91 98250 55002", notes: "Hedge Fund Analyst, orders artisanal pistachio mithai", type: "VIP", tier: "VIP", points: 490, spent: 10200, orders: 24 },
    { name: "Sameer Merchant", phone: "+91 98250 55003", notes: "Stockbroker, corporate festive hampers", type: "VIP", tier: "VIP", points: 550, spent: 12400, orders: 29 },
    { name: "Arundhati Roy", phone: "+91 98250 55004", notes: "Legal advisor in GIFT SEZ, prefers organic jaggery sweets", type: "Regular", tier: "Regular", points: 230, spent: 4100, orders: 11 },
    { name: "Kabir Dewan", phone: "+91 98250 55005", notes: "Fintech founder, weekly office sweet box", type: "VIP", tier: "VIP", points: 410, spent: 8500, orders: 19 },
    { name: "Zoya Kapadia", phone: "+91 98250 55006", notes: "Treasury manager, orders luxury dry fruit boxes", type: "Regular", tier: "Regular", points: 180, spent: 3200, orders: 8 },
    { name: "Farhan Batliwala", phone: "+91 98250 55007", notes: "GIFT City resident, loves fresh Malai sandwich", type: "Regular", tier: "Regular", points: 135, spent: 2100, orders: 6 },
    { name: "Simran Bhatia", phone: "+91 98250 55008", notes: "Risk consultant, buys Kesar Rasmalai on Fridays", type: "Regular", tier: "Regular", points: 160, spent: 2750, orders: 7 },
    { name: "Rishabh Mittal", phone: "+91 98250 55009", notes: "Commodity trader, bulk Diwali orders", type: "VIP", tier: "VIP", points: 640, spent: 14900, orders: 32 },
    { name: "Ananya Goenka", phone: "+91 98250 55010", notes: "New joiner in GIFT City tower 1", type: "New", tier: "New", points: 50, spent: 890, orders: 2 }
  ],
  // br-6 Sector 11
  [
    { name: "Kiritbhai Vyas", phone: "+91 98250 66001", notes: "Govt secretariat officer, orders for official events", type: "VIP", tier: "VIP", points: 360, spent: 6800, orders: 18 },
    { name: "Dakshaben Jani", phone: "+91 98250 66002", notes: "Buys Pure Ghee Peda for temple rituals", type: "Regular", tier: "Regular", points: 150, spent: 2200, orders: 7 },
    { name: "Jayesh Solanki", phone: "+91 98250 66003", notes: "Revenue department officer, festival boxes", type: "Regular", tier: "Regular", points: 210, spent: 3400, orders: 10 },
    { name: "Naynaben Shukla", phone: "+91 98250 66004", notes: "Likes low sugar Kaju rolls", type: "Regular", tier: "Regular", points: 115, spent: 1650, orders: 5 },
    { name: "Mukesh Chavda", phone: "+91 98250 66005", notes: "High court advocate, orders mithai for court wins", type: "VIP", tier: "VIP", points: 420, spent: 8100, orders: 21 },
    { name: "Hansaben Thaker", phone: "+91 98250 66006", notes: "Prefers traditional Magas and Mohanthal", type: "Regular", tier: "Regular", points: 130, spent: 1980, orders: 6 },
    { name: "Dilipbhai Ravat", phone: "+91 98250 66007", notes: "Civil supplies department employee", type: "Regular", tier: "Regular", points: 95, spent: 1380, orders: 4 },
    { name: "Parulben Bhatti", phone: "+91 98250 66008", notes: "Orders wedding announcement sweet cards", type: "Regular", tier: "Regular", points: 160, spent: 2500, orders: 7 },
    { name: "Govindbhai Chauhan", phone: "+91 98250 66009", notes: "Secretariat staff club coordinator", type: "VIP", tier: "VIP", points: 310, spent: 5400, orders: 14 },
    { name: "Shilpaben Oza", phone: "+91 98250 66010", notes: "New patron in Sector 11 staff quarters", type: "New", tier: "New", points: 30, spent: 490, orders: 1 }
  ],
  // br-7 Sector 7
  [
    { name: "Arvindbhai Brahmbhatt", phone: "+91 98250 77001", notes: "Old Gandhinagar resident, lifetime customer", type: "VIP", tier: "VIP", points: 510, spent: 10400, orders: 29 },
    { name: "Geeta Ben Somani", phone: "+91 98250 77002", notes: "Prefers Bikaneri Bhujia with Rasgulla", type: "Regular", tier: "Regular", points: 165, spent: 2450, orders: 8 },
    { name: "Hareshbhai Dholakia", phone: "+91 98250 77003", notes: "Ch-3 circle businessman, daily evening visitor", type: "VIP", tier: "VIP", points: 390, spent: 7200, orders: 20 },
    { name: "Urmilaben Baxi", phone: "+91 98250 77004", notes: "Enjoys Kesar Shrikhand and Basundi", type: "Regular", tier: "Regular", points: 140, spent: 2100, orders: 6 },
    { name: "Narendrabhai Mandalia", phone: "+91 98250 77005", notes: "Retired govt officer, orders for family pujas", type: "Regular", tier: "Regular", points: 185, spent: 2950, orders: 9 },
    { name: "Sarojben Mehta", phone: "+91 98250 77006", notes: "Buys Motichoor Ladoo and Dry Fruit Kachori", type: "Regular", tier: "Regular", points: 110, spent: 1600, orders: 5 },
    { name: "Vinodbhai Soni", phone: "+91 98250 77007", notes: "Traditional goldsmith in Sector 7", type: "Regular", tier: "Regular", points: 220, spent: 3800, orders: 11 },
    { name: "Kalpanaben Shah", phone: "+91 98250 77008", notes: "Prefers fresh Mawa Barfi without silver foil", type: "Regular", tier: "Regular", points: 135, spent: 1950, orders: 6 },
    { name: "Pankajbhai Trivedi", phone: "+91 98250 77009", notes: "Astrologer, orders prasad sweets on full moon", type: "Regular", tier: "Regular", points: 155, spent: 2300, orders: 7 },
    { name: "Minakshiben Pathak", phone: "+91 98250 77010", notes: "New customer near CH-3 garden", type: "New", tier: "New", points: 40, spent: 620, orders: 2 }
  ],
  // br-8 Randesan
  [
    { name: "Devang Patel", phone: "+91 98250 88001", notes: "Riverfront society chairman, community orders", type: "VIP", tier: "VIP", points: 440, spent: 8800, orders: 23 },
    { name: "Krishna Ben Vora", phone: "+91 98250 88002", notes: "Likes freshly baked confectionery & Nankhatai", type: "Regular", tier: "Regular", points: 150, spent: 2100, orders: 7 },
    { name: "Manharbhai Gandhi", phone: "+91 98250 88003", notes: "Pramukh Elegance resident, buys weekend sweets", type: "Regular", tier: "Regular", points: 190, spent: 3100, orders: 9 },
    { name: "Taraben Joshi", phone: "+91 98250 88004", notes: "Enjoys Rose Sandesh and Kaju Roll", type: "Regular", tier: "Regular", points: 120, spent: 1700, orders: 5 },
    { name: "Jagdishbhai Mistry", phone: "+91 98250 88005", notes: "Architect at Randesan, orders celebration boxes", type: "VIP", tier: "VIP", points: 370, spent: 6900, orders: 17 },
    { name: "Gitaben Panchal", phone: "+91 98250 88006", notes: "Prefers milk cake & Kalakand", type: "Regular", tier: "Regular", points: 105, spent: 1450, orders: 4 },
    { name: "Ashokbhai Parekh", phone: "+91 98250 88007", notes: "Buys Kaju Anjeer Roll for morning walk group", type: "Regular", tier: "Regular", points: 175, spent: 2750, orders: 8 },
    { name: "Bhavikaben Rana", phone: "+91 98250 88008", notes: "Loves Bengali Cham Cham & Malai roll", type: "Regular", tier: "Regular", points: 95, spent: 1350, orders: 4 },
    { name: "Sandipbhai Sheth", phone: "+91 98250 88009", notes: "Orders bulk dry fruits for overseas relatives", type: "VIP", tier: "VIP", points: 330, spent: 5800, orders: 13 },
    { name: "Vaishaliben Bhatt", phone: "+91 98250 88010", notes: "New customer visiting riverfront walkway", type: "New", tier: "New", points: 30, spent: 510, orders: 1 }
  ],
  // br-9 Sector 28
  [
    { name: "Mahendrabhai Patel", phone: "+91 98250 99001", notes: "GIDC Engineering unit owner, orders staff sweets", type: "VIP", tier: "VIP", points: 580, spent: 12600, orders: 30 },
    { name: "Sharda Ben Barot", phone: "+91 98250 99002", notes: "Prefers traditional Besan Ladoo & Ghooghra", type: "Regular", tier: "Regular", points: 160, spent: 2350, orders: 7 },
    { name: "Rajubhai Prajapati", phone: "+91 98250 99003", notes: "Ceramic factory director, Diwali gift cartons", type: "VIP", tier: "VIP", points: 460, spent: 9400, orders: 24 },
    { name: "Pushpaben Darji", phone: "+91 98250 99004", notes: "Buys fresh hot Jalebi on Sundays", type: "Regular", tier: "Regular", points: 110, spent: 1550, orders: 5 },
    { name: "Vipulbhai Luhar", phone: "+91 98250 99005", notes: "Steel fabrication unit head, monthly bulk orders", type: "VIP", tier: "VIP", points: 380, spent: 7300, orders: 18 },
    { name: "Kamlaben Rajput", phone: "+91 98250 99006", notes: "Enjoys Motichoor & Boondi Ladoo", type: "Regular", tier: "Regular", points: 125, spent: 1800, orders: 6 },
    { name: "Bharatbhai Suthar", phone: "+91 98250 99007", notes: "Furniture showroom manager, customer prasad", type: "Regular", tier: "Regular", points: 170, spent: 2650, orders: 8 },
    { name: "Hansaben Vankar", phone: "+91 98250 99008", notes: "Buys Kaju Katli for daughter's exams", type: "Regular", tier: "Regular", points: 90, spent: 1250, orders: 4 },
    { name: "Natubhai Senma", phone: "+91 98250 99009", notes: "GIDC transport contractor, festive packs", type: "Regular", tier: "Regular", points: 145, spent: 2200, orders: 6 },
    { name: "Jasodaben Raval", phone: "+91 98250 99010", notes: "New worker in electronics assembly hub", type: "New", tier: "New", points: 35, spent: 580, orders: 2 }
  ],
  // br-10 Vavol
  [
    { name: "Ashvinbhai Chaudhari", phone: "+91 98250 10001", notes: "Dairy cooperative secretary, buys large batches", type: "VIP", tier: "VIP", points: 410, spent: 7900, orders: 21 },
    { name: "Lilaben Desai", phone: "+91 98250 10002", notes: "Vavol town elder, orders for village religious gatherings", type: "Regular", tier: "Regular", points: 180, spent: 2700, orders: 8 },
    { name: "Kanubhai Rabari", phone: "+91 98250 10003", notes: "Pure milk supplier, prefers traditional Mawa sweets", type: "VIP", tier: "VIP", points: 470, spent: 9600, orders: 25 },
    { name: "Manjulaben Bharwad", phone: "+91 98250 10004", notes: "Buys Kesar Peda & Thabdi Peda", type: "Regular", tier: "Regular", points: 135, spent: 1950, orders: 6 },
    { name: "Dinesh Patel", phone: "+91 98250 10005", notes: "Vavol bypass petrol station owner, gift boxes", type: "VIP", tier: "VIP", points: 350, spent: 6500, orders: 16 },
    { name: "Shitalben Thakor", phone: "+91 98250 10006", notes: "Likes Gulab Jamun & Kala Jamun", type: "Regular", tier: "Regular", points: 105, spent: 1480, orders: 5 },
    { name: "Sanjaybhai Vaghela", phone: "+91 98250 10007", notes: "Local transport operator, sweet packs for drivers", type: "Regular", tier: "Regular", points: 160, spent: 2400, orders: 7 },
    { name: "Pinkiben Chauhan", phone: "+91 98250 10008", notes: "Enjoys Chocolate Barfi and Dry Fruit Bite", type: "Regular", tier: "Regular", points: 95, spent: 1320, orders: 4 },
    { name: "Hasmukhbhai Zala", phone: "+91 98250 10009", notes: "Agriculture produce commission agent", type: "Regular", tier: "Regular", points: 195, spent: 3100, orders: 9 },
    { name: "Jyotsnaben Parmar", phone: "+91 98250 10010", notes: "New customer near Vavol railway gate", type: "New", tier: "New", points: 25, spent: 460, orders: 1 }
  ],
  // br-11 Bhaijipura
  [
    { name: "Bhupatbhai Solanki", phone: "+91 98250 11101", notes: "Koba highway hotel owner, regular Bulk buyer", type: "VIP", tier: "VIP", points: 530, spent: 11200, orders: 27 },
    { name: "Kailashben Rathod", phone: "+91 98250 11102", notes: "Enjoys Kaju Katli & Anjeer Halwa", type: "Regular", tier: "Regular", points: 170, spent: 2550, orders: 8 },
    { name: "Lalitbhai Makwana", phone: "+91 98250 11103", notes: "Bhaijipura crossroads trader, daily tea & farsan", type: "VIP", tier: "VIP", points: 390, spent: 7400, orders: 19 },
    { name: "Shantaben Maru", phone: "+91 98250 11104", notes: "Buys Pure Desi Ghee Mohanthal for pooja", type: "Regular", tier: "Regular", points: 140, spent: 2050, orders: 6 },
    { name: "Maheshbhai Dabhi", phone: "+91 98250 11105", notes: "PDPU student hostel warden, snacks for events", type: "VIP", tier: "VIP", points: 420, spent: 8300, orders: 22 },
    { name: "Ranjanben Mori", phone: "+91 98250 11106", notes: "Likes Bengali Malai Roll & Rasgulla", type: "Regular", tier: "Regular", points: 115, spent: 1680, orders: 5 },
    { name: "Gordhanbhai Vala", phone: "+91 98250 11107", notes: "Highway fuel station manager, gift packs", type: "Regular", tier: "Regular", points: 185, spent: 2900, orders: 8 },
    { name: "Bhavanaben Chavda", phone: "+91 98250 11108", notes: "Buys Motichoor Ladoo & Dry fruit sweets", type: "Regular", tier: "Regular", points: 100, spent: 1400, orders: 4 },
    { name: "Pravinbhai Gohel", phone: "+91 98250 11109", notes: "Civil engineer at nearby highway bridge site", type: "Regular", tier: "Regular", points: 150, spent: 2300, orders: 7 },
    { name: "Champaben Vegda", phone: "+91 98250 11110", notes: "New customer near GNLU circle", type: "New", tier: "New", points: 30, spent: 520, orders: 1 }
  ]
];

// Generate 110 Customers
const customers = [];
let custIndex = 1001;
branches.forEach((b, bIdx) => {
  const custList = customerNamesPerBranch[bIdx];
  custList.forEach((c) => {
    customers.push({
      id: `CUST-${custIndex}`,
      name: c.name,
      phone: c.phone,
      email: `${c.name.toLowerCase().replace(/[^a-z]/g, '')}@gmail.com`,
      address: `${b.address}`,
      branchId: b.id,
      branchName: b.name,
      type: c.type,
      tier: c.tier,
      loyaltyPoints: c.points,
      totalOrders: c.orders,
      totalSpent: c.spent,
      notes: c.notes
    });
    custIndex++;
  });
});

// Generate 33 Staff (3 per branch)
const staff = [];
let staffIndex = 1;
branches.forEach((b, bIdx) => {
  // 1. Branch Manager
  staff.push({
    id: `st-${staffIndex}`,
    name: `${['Ramesh', 'Sanjay', 'Pravin', 'Dharmesh', 'Harish', 'Kishore', 'Mukesh', 'Chetan', 'Haresh', 'Gautam', 'Jitendra'][bIdx]} Patel`,
    phone: `+91 98765 ${String(10000 + staffIndex).slice(1)}`,
    role: "Branch Store Manager",
    department: "Store Operations",
    branchId: b.id,
    branchName: b.name,
    joiningDate: "10 Jan 2023",
    baseSalary: 38000,
    salaryType: "Monthly",
    advancesTaken: 0,
    salaryStatus: "Paid",
    lastPaidDate: "30 Sep 2026",
    attendanceToday: "Present",
    leavesTakenThisMonth: 0,
    leavesAllowedPerMonth: 2,
    totalLeavesBalance: 12,
    aadharNumber: `XXXX-XXXX-${1000 + staffIndex}`,
    emergencyContact: `+91 98765 99887 (Family)`,
    status: "Active",
    leaveHistory: [],
    salaryHistory: []
  });
  staffIndex++;

  // 2. Senior Cashier
  staff.push({
    id: `st-${staffIndex}`,
    name: `${['Bhavik', 'Nitin', 'Alkesh', 'Pratik', 'Mayur', 'Krunal', 'Rahul', 'Hardik', 'Tushar', 'Amit', 'Jignesh'][bIdx]} Shah`,
    phone: `+91 98765 ${String(10000 + staffIndex).slice(1)}`,
    role: "Senior Counter Cashier",
    department: "Sales Counter",
    branchId: b.id,
    branchName: b.name,
    joiningDate: "15 Mar 2023",
    baseSalary: 24000,
    salaryType: "Monthly",
    advancesTaken: 0,
    salaryStatus: "Paid",
    lastPaidDate: "30 Sep 2026",
    attendanceToday: "Present",
    leavesTakenThisMonth: 1,
    leavesAllowedPerMonth: 2,
    totalLeavesBalance: 10,
    aadharNumber: `XXXX-XXXX-${1000 + staffIndex}`,
    emergencyContact: `+91 98765 88776 (Brother)`,
    status: "Active",
    leaveHistory: [],
    salaryHistory: []
  });
  staffIndex++;

  // 3. Head Halwai / Craftsman
  staff.push({
    id: `st-${staffIndex}`,
    name: `${['Rameshwar', 'Mukesh', 'Hitesh', 'Kailash', 'Gopal', 'Radheshyam', 'Shankar', 'Dinesh', 'Mohanlal', 'Ramprasad', 'Babulal'][bIdx]} Prajapati`,
    phone: `+91 98765 ${String(10000 + staffIndex).slice(1)}`,
    role: "Master Halwai & Confectioner",
    department: "Kitchen / Halwai",
    branchId: b.id,
    branchName: b.name,
    joiningDate: "01 Jun 2022",
    baseSalary: 32000,
    salaryType: "Monthly",
    advancesTaken: 1500,
    salaryStatus: "Pending",
    lastPaidDate: "31 Aug 2026",
    attendanceToday: "Present",
    leavesTakenThisMonth: 0,
    leavesAllowedPerMonth: 2,
    totalLeavesBalance: 14,
    aadharNumber: `XXXX-XXXX-${1000 + staffIndex}`,
    emergencyContact: `+91 98765 77665 (Father)`,
    status: "Active",
    leaveHistory: [],
    salaryHistory: []
  });
  staffIndex++;
});

console.log(`Generated: ${branches.length} Branches, ${customers.length} Customers, ${staff.length} Staff`);

// Replace branches in data.js
const branchBlockRegex = /branches:\s*\[[\s\S]*?\n\s*\],\s*\n\s*parkedBills:/;
const newBranchStr = `branches: ${JSON.stringify(branches, null, 4)},\n\n  parkedBills:`;
dataContent = dataContent.replace(branchBlockRegex, newBranchStr);

// Replace staff in data.js
const staffBlockRegex = /staff:\s*\[[\s\S]*?\n\s*\],\s*\n\s*kpis:/;
const newStaffStr = `staff: ${JSON.stringify(staff, null, 4)},\n\n  kpis:`;
dataContent = dataContent.replace(staffBlockRegex, newStaffStr);

// Replace customers in data.js
const custBlockRegex = /customers:\s*\[[\s\S]*?\n\s*\],\s*\n\s*orders:/;
const newCustStr = `customers: ${JSON.stringify(customers, null, 4)},\n\n  orders:`;
dataContent = dataContent.replace(custBlockRegex, newCustStr);

fs.writeFileSync(dataJsPath, dataContent, 'utf8');
console.log('Successfully updated src/data.js with 11 Gandhinagar branches, 110 customers, 33 staff!');
