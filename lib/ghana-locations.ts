export const GHANA_REGIONS: Record<string, string[]> = {
  "Greater Accra": [
    "East Legon", "Spintex", "Osu", "Cantonments", "Labone", "Airport Residential",
    "Adabraka", "Accra New Town", "Asylum Down", "Dzorwulu", "Roman Ridge",
    "North Labone", "South Labone", "Abelemkpe", "Kanda", "North Ridge",
    "Kotobabi", "Nima", "Maamobi", "Tesano", "Achimota", "Legon", "Haatso",
    "Madina", "Adentan", "Dome", "Kwabenya", "Abokobi", "Pokuase", "Ofankor",
    "Dansoman", "Darkuman", "Kaneshie", "Mamprobi", "Korle-Bu", "Abossey Okai",
    "Circle", "Tudu", "Agbogbloshie", "Chorkor", "Jamestown", "La", "Teshie",
    "Nungua", "Tema", "Community 1", "Community 2", "Community 3", "Community 4",
    "Community 5", "Community 6", "Community 7", "Community 8", "Community 9",
    "Community 10", "Community 11", "Community 12", "Community 18", "Community 22",
    "Ashaiman", "Valco Flats", "Sakumono", "Lashibi", "Baatsona", "Oblogo",
    "Weija", "Kasoa", "Gbawe", "Ablekuma", "Ogbodjo", "Kokomlemle", "Lartebiokorshie",
    "Bubuashie", "Odorkor", "Avenor"
  ],
  "Ashanti": [
    "Adum", "Bantama", "Asokwa", "Nhyiaeso", "Kwadaso", "Old Tafo", "New Tafo",
    "Suame", "Asawasi", "Dichemso", "Manhyia", "Aboabo", "Dakodwom",
    "Fante Newtown", "Ayigya", "Bomso", "Kotei", "Emena", "Tanoso",
    "Bekwai", "Ejisu", "Juaben", "Konongo", "Mampong", "Obuasi",
    "Agogo", "Tepa", "Goaso", "Kintampo"
  ],
  "Western": [
    "Takoradi", "Sekondi", "Effia", "Kojokrom", "Essikadu", "Kwesimintsim",
    "New Takoradi", "Fijai", "Axim", "Tarkwa", "Prestea", "Bogoso",
    "Wassa Akropong", "Daboase", "Mpohor", "Shama"
  ],
  "Central": [
    "Cape Coast", "Elmina", "Assin Fosu", "Agona Swedru", "Winneba",
    "Mankessim", "Anomabo", "Saltpond", "Dunkwa-on-Offin", "Twifo Praso",
    "Kasoa", "Buduburam", "Awutu Beraku"
  ],
  "Volta": [
    "Ho", "Hohoe", "Keta", "Aflao", "Denu", "Anloga", "Kpando",
    "Jasikan", "Kadjebi", "Nkwanta", "Sogakofe", "Akatsi", "Ave Dakpa"
  ],
  "Eastern": [
    "Koforidua", "Nkawkaw", "Suhum", "Nsawam", "Akim Oda", "Akim Tafo",
    "Kade", "Mpraeso", "Abetifi", "Mamfe", "Akropong", "Aburi",
    "Somanya", "Kpong", "Akosombo"
  ],
  "Northern": [
    "Tamale", "Savelugu", "Yendi", "Bimbilla", "Gushegu", "Karaga",
    "Tolon", "Kumbungu", "Sagnarigu", "Vittin", "Kukuo", "Gbanyamale"
  ],
  "Upper East": [
    "Bolgatanga", "Bawku", "Navrongo", "Zebilla", "Sandema", "Bongo",
    "Zuarungu", "Sirigu", "Fumbisi"
  ],
  "Upper West": [
    "Wa", "Lawra", "Tumu", "Jirapa", "Nandom", "Kaleo", "Funsi",
    "Nadowli", "Wechiau", "Issa"
  ],
  "Brong-Ahafo": [
    "Sunyani", "Techiman", "Berekum", "Dormaa Ahenkro", "Kintampo",
    "Wenchi", "Nkoranza", "Atebubu", "Prang", "Yeji"
  ],
  "Oti": [
    "Dambai", "Kadjebi", "Jasikan", "Nkwanta South", "Nkwanta North",
    "Kpassa", "Buem"
  ],
  "Bono East": [
    "Techiman", "Atebubu", "Kintampo", "Nkoranza", "Yeji", "Prang",
    "Jema", "Busunya"
  ],
  "Ahafo": [
    "Goaso", "Kukuom", "Duayaw Nkwanta", "Hwidiem", "Mim", "Acherensua"
  ],
  "Savannah": [
    "Damongo", "Buipe", "Salaga", "Yapei", "Tolon", "Bole", "Sawla"
  ],
  "North East": [
    "Nalerigu", "Gambaga", "Walewale", "Chereponi", "Bunkpurugu", "Yunyoo"
  ],
  "Western North": [
    "Sefwi Wiawso", "Bibiani", "Sefwi Bekwai", "Juaboso", "Bodi",
    "Aowin", "Enchi"
  ],
};

export const ROOM_TYPES = [
  "Single Room",
  "Chamber and Hall",
  "Self-Contained",
  "One Bedroom",
  "Two Bedroom",
  "Three Bedroom",
  "Apartment",
  "Studio",
  "Boys Quarters",
  "Compound House Room",
] as const;

export type RoomType = typeof ROOM_TYPES[number];

export const AMENITIES = [
  "Water Tank",
  "Borehole",
  "Generator",
  "Prepaid Meter",
  "Security Guard",
  "CCTV",
  "Gated Community",
  "Tiled Floor",
  "Ceiling Fan",
  "Air Conditioning",
  "Veranda",
  "Compound",
  "Parking",
  "Kitchen",
  "Indoor Toilet",
  "Outdoor Toilet",
  "Bathroom",
  "Furnished",
  "Internet/WiFi",
  "Close to Market",
  "Close to Hospital",
  "Close to School",
  "Main Road Access",
] as const;

export type Amenity = typeof AMENITIES[number];

export const PRICE_RANGES = [
  { label: "Under GHS 500", min: 0, max: 500 },
  { label: "GHS 500 - 1,000", min: 500, max: 1000 },
  { label: "GHS 1,000 - 2,000", min: 1000, max: 2000 },
  { label: "GHS 2,000 - 3,500", min: 2000, max: 3500 },
  { label: "GHS 3,500 - 5,000", min: 3500, max: 5000 },
  { label: "GHS 5,000 - 10,000", min: 5000, max: 10000 },
  { label: "Above GHS 10,000", min: 10000, max: Infinity },
] as const;

export const TYPICAL_PRICES: Record<RoomType, { min: number; max: number }> = {
  "Single Room": { min: 200, max: 600 },
  "Chamber and Hall": { min: 400, max: 900 },
  "Self-Contained": { min: 600, max: 1500 },
  "One Bedroom": { min: 800, max: 2000 },
  "Two Bedroom": { min: 1200, max: 3500 },
  "Three Bedroom": { min: 2000, max: 6000 },
  "Apartment": { min: 1500, max: 8000 },
  "Studio": { min: 700, max: 2000 },
  "Boys Quarters": { min: 300, max: 800 },
  "Compound House Room": { min: 150, max: 500 },
};
