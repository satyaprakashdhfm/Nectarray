/**
 * Domains on the Elements tab: for each kind of business, real websites to
 * look at before building one. Taken from the industry research, with the
 * sites from our own reference document scored highest. The admin can edit
 * any domain's list; the saved list then replaces the one here.
 *
 * Score is out of 5: how much the site is worth copying from. Unscored
 * sites are simply the leaders in that domain.
 */

export type DomainSite = {
  name: string;
  url: string;
  score?: number;
  note?: string;
};

export type WebDomain = {
  id: string;
  label: string;
  industry: string;
  sites: DomainSite[];
};

type Row = [name: string, url: string, score?: number, note?: string];

const site = ([name, url, score, note]: Row): DomainSite => ({
  name,
  url,
  ...(score ? { score } : {}),
  ...(note ? { note } : {}),
});

const RAW: [industry: string, id: string, label: string, rows: Row[]][] = [
  // Retail and e-commerce
  ["Retail and e-commerce", "ecommerce", "E-commerce and marketplaces", [
    ["Wakefit", "https://www.wakefit.co/", 5, "Complete e-commerce reference: category-heavy hero, promo banners, product discovery."],
    ["Alibaba", "https://www.alibaba.com/", 4, "Category-heavy hero for B2B: category sidebar, search, sourcing banners."],
    ["Makro", "https://www.makro.co.za/", 4, "Category icon row with a big banner and two side banners."],
    ["Amazon", "https://www.amazon.in/"],
    ["eBay", "https://www.ebay.com/"],
    ["Rakuten", "https://www.rakuten.com/"],
    ["Mercado Libre", "https://www.mercadolibre.com/"],
  ]],
  ["Retail and e-commerce", "grocery", "Grocery and supermarkets", [
    ["BigBasket", "https://www.bigbasket.com/"],
    ["Walmart", "https://www.walmart.com/"],
    ["Kroger", "https://www.kroger.com/"],
    ["Carrefour", "https://www.carrefour.com/"],
    ["Tesco", "https://www.tesco.com/"],
  ]],
  ["Retail and e-commerce", "luxury-retail", "Luxury retail", [
    ["LVMH", "https://www.lvmh.com/", 5, "Luxury brand-focused hero: full-bleed slideshow, centred logo."],
    ["Prada", "https://www.prada.com/ww/en.html", 4, "Big logo over editorial imagery; navigation changes on scroll."],
    ["Hermès", "https://www.hermes.com/"],
    ["Kering", "https://www.kering.com/"],
    ["Richemont", "https://www.richemont.com/"],
  ]],
  ["Retail and e-commerce", "wholesale", "Wholesale clubs", [
    ["Makro", "https://www.makro.co.za/", 4],
    ["Costco", "https://www.costco.com/"],
    ["Sam's Club", "https://www.samsclub.com/"],
    ["Metro AG", "https://www.metroag.de/en"],
    ["BJ's Wholesale", "https://www.bjs.com/"],
  ]],

  // Finance
  ["Finance and banking", "banks", "Banks", [
    ["JPMorgan Chase", "https://www.jpmorganchase.com/"],
    ["ICBC", "https://www.icbc-ltd.com/"],
    ["Bank of America", "https://www.bankofamerica.com/"],
    ["HSBC", "https://www.hsbc.com/"],
    ["Citigroup", "https://www.citigroup.com/"],
  ]],
  ["Finance and banking", "payments", "Fintech and payments", [
    ["Mastercard", "https://www.mastercard.com/in/en.html", 5, "End to end a good full website: take the whole site as the reference."],
    ["Visa", "https://www.visa.com/"],
    ["PayPal", "https://www.paypal.com/"],
    ["Block (Square)", "https://block.xyz/", 3, "Square's inset hero with oversized type and a floating video bar."],
    ["Ant Group", "https://www.antgroup.com/en"],
  ]],
  ["Finance and banking", "asset-management", "Asset management", [
    ["BlackRock", "https://www.blackrock.com/"],
    ["Vanguard", "https://www.vanguard.com/"],
    ["State Street", "https://www.statestreet.com/"],
    ["Fidelity", "https://www.fidelity.com/"],
    ["Allianz Global Investors", "https://www.allianzgi.com/"],
  ]],

  // Insurance
  ["Insurance", "life-insurance", "Life and health insurance", [
    ["Prudential plc", "https://www.prudentialplc.com/", 4, "Hero with a quick-links bar: \"I am looking for…\" with icons."],
    ["MetLife", "https://www.metlife.com/"],
    ["AIA Group", "https://www.aia.com/"],
    ["Ping An", "https://group.pingan.com/"],
    ["China Life", "https://www.chinalife.com.cn/"],
    ["Zurich", "https://www.zurich.com/"],
  ]],
  ["Insurance", "general-insurance", "Property and casualty", [
    ["Allianz", "https://www.allianz.com/"],
    ["AXA", "https://www.axa.com/"],
    ["Berkshire Hathaway", "https://www.berkshirehathaway.com/"],
    ["Progressive", "https://www.progressive.com/"],
    ["GEICO", "https://www.geico.com/"],
  ]],
  ["Insurance", "health-insurance", "Health insurance", [
    ["UnitedHealth Group", "https://www.unitedhealthgroup.com/"],
    ["Elevance Health", "https://www.elevancehealth.com/"],
    ["Aetna", "https://www.aetna.com/"],
    ["Cigna", "https://www.cigna.com/"],
    ["Humana", "https://www.humana.com/"],
  ]],
  ["Insurance", "reinsurance", "Reinsurance", [
    ["Munich Re", "https://www.munichre.com/"],
    ["Swiss Re", "https://www.swissre.com/"],
    ["SCOR", "https://www.scor.com/"],
    ["Hannover Re", "https://www.hannover-re.com/"],
    ["Lloyd's", "https://www.lloyds.com/"],
  ]],

  // Healthcare
  ["Healthcare and pharma", "pharma", "Pharmaceuticals", [
    ["Pfizer", "https://www.pfizer.com/"],
    ["Johnson & Johnson", "https://www.jnj.com/"],
    ["Roche", "https://www.roche.com/"],
    ["Novartis", "https://www.novartis.com/"],
    ["Merck", "https://www.merck.com/"],
  ]],
  ["Healthcare and pharma", "hospitals", "Hospitals and providers", [
    ["Apollo Hospitals", "https://www.apollohospitals.com/"],
    ["UnitedHealth Group", "https://www.unitedhealthgroup.com/"],
    ["HCA Healthcare", "https://hcahealthcare.com/"],
    ["Bupa", "https://www.bupa.com/"],
    ["Kaiser Permanente", "https://www.kaiserpermanente.org/"],
  ]],
  ["Healthcare and pharma", "medical-devices", "Medical devices", [
    ["Medtronic", "https://www.medtronic.com/"],
    ["GE HealthCare", "https://www.gehealthcare.com/"],
    ["Siemens Healthineers", "https://www.siemens-healthineers.com/"],
    ["Philips", "https://www.philips.com/healthcare"],
    ["J&J MedTech", "https://www.jnjmedtech.com/"],
  ]],
  ["Healthcare and pharma", "biotech", "Biotech and research", [
    ["Amgen", "https://www.amgen.com/"],
    ["Gilead", "https://www.gilead.com/"],
    ["Regeneron", "https://www.regeneron.com/"],
    ["Illumina", "https://www.illumina.com/"],
    ["Moderna", "https://www.modernatx.com/"],
    ["BioNTech", "https://www.biontech.com/"],
    ["Lonza", "https://www.lonza.com/"],
  ]],

  // Technology
  ["Technology", "big-tech", "Big tech", [
    ["Apple", "https://www.apple.com/", 5, "Product reveal hero: the iPhone opening as you scroll."],
    ["Samsung", "https://www.samsung.com/in/", 5, "3D-perspective body background: the flowing 3D ribbon."],
    ["Google", "https://about.google/"],
    ["Microsoft", "https://www.microsoft.com/"],
    ["Amazon", "https://www.aboutamazon.com/"],
  ]],
  ["Technology", "enterprise", "Enterprise and cloud", [
    ["Tencent", "https://www.tencent.com/", 4, "Scroll-linked zoom reveal that reverses on scroll up."],
    ["IBM", "https://www.ibm.com/"],
    ["Oracle", "https://www.oracle.com/"],
    ["SAP", "https://www.sap.com/"],
    ["Accenture", "https://www.accenture.com/"],
  ]],
  ["Technology", "semiconductors", "Semiconductors", [
    ["NVIDIA", "https://www.nvidia.com/", 5, "Split carousel: description on the left, article cards slide on the right."],
    ["Qualcomm", "https://www.qualcomm.com/", 4, "White and grey palette with one blue: clean enough for a legal app."],
    ["Intel", "https://www.intel.com/"],
    ["TSMC", "https://www.tsmc.com/"],
    ["Broadcom", "https://www.broadcom.com/"],
  ]],
  ["Technology", "internet", "Social and internet services", [
    ["Meta", "https://www.meta.com/"],
    ["Netflix", "https://www.netflix.com/"],
    ["ByteDance", "https://www.bytedance.com/"],
    ["Booking Holdings", "https://www.bookingholdings.com/"],
  ]],

  // Consumer electronics
  ["Consumer electronics", "phones", "Smartphones and devices", [
    ["Apple", "https://www.apple.com/in/", 5],
    ["Samsung", "https://www.samsung.com/in/", 5],
    ["Xiaomi", "https://www.mi.com/in/"],
    ["OnePlus", "https://www.oneplus.in/"],
    ["Huawei", "https://consumer.huawei.com/"],
  ]],
  ["Consumer electronics", "computers", "Computers and hardware", [
    ["HP", "https://www.hp.com/"],
    ["Dell", "https://www.dell.com/"],
    ["Lenovo", "https://www.lenovo.com/"],
    ["ASUS", "https://www.asus.com/"],
    ["Acer", "https://www.acer.com/"],
  ]],
  ["Consumer electronics", "home-electronics", "Home electronics", [
    ["Sony", "https://www.sony.com/"],
    ["LG", "https://www.lg.com/"],
    ["Panasonic", "https://www.panasonic.com/"],
    ["Philips", "https://www.philips.com/"],
    ["Bose", "https://www.bose.com/"],
  ]],
  ["Consumer electronics", "wearables", "Wearables", [
    ["Garmin", "https://www.garmin.com/"],
    ["Fitbit", "https://www.fitbit.com/"],
    ["Apple Watch", "https://www.apple.com/watch/"],
    ["Galaxy Watch", "https://www.samsung.com/in/watches/"],
  ]],

  // Travel
  ["Travel and hospitality", "airlines", "Airlines", [
    ["Emirates", "https://www.emirates.com/"],
    ["Singapore Airlines", "https://www.singaporeair.com/"],
    ["Lufthansa", "https://www.lufthansa.com/"],
    ["Delta", "https://www.delta.com/"],
    ["American Airlines", "https://www.aa.com/"],
  ]],
  ["Travel and hospitality", "hotels", "Hotels and resorts", [
    ["Marriott", "https://www.marriott.com/"],
    ["Hilton", "https://www.hilton.com/"],
    ["Hyatt", "https://www.hyatt.com/"],
    ["Accor", "https://all.accor.com/"],
    ["IHG", "https://www.ihg.com/"],
  ]],
  ["Travel and hospitality", "online-travel", "Online travel", [
    ["MakeMyTrip", "https://www.makemytrip.com/"],
    ["Booking.com", "https://www.booking.com/"],
    ["Airbnb", "https://www.airbnb.com/"],
    ["Expedia", "https://www.expedia.com/"],
    ["Trip.com", "https://www.trip.com/"],
  ]],
  ["Travel and hospitality", "restaurants", "Restaurants", [
    ["McDonald's", "https://www.mcdonalds.com/"],
    ["Starbucks", "https://www.starbucks.com/"],
    ["Domino's", "https://www.dominos.co.in/"],
    ["Yum! Brands", "https://www.yum.com/"],
    ["Chipotle", "https://www.chipotle.com/"],
  ]],

  // Food and beverage
  ["Food and beverage", "beverages", "Beverages", [
    ["Coca-Cola", "https://www.coca-colacompany.com/", 5, "Bidirectional brand marquee: logo rows scrolling in opposite directions."],
    ["PepsiCo", "https://www.pepsico.com/", 4, "Brand marquee, same pattern as Coca-Cola."],
    ["Nestlé", "https://www.nestle.com/"],
    ["AB InBev", "https://www.ab-inbev.com/"],
    ["Heineken", "https://www.theheinekencompany.com/"],
  ]],
  ["Food and beverage", "food-products", "Food products", [
    ["Nestlé", "https://www.nestle.com/"],
    ["Danone", "https://www.danone.com/"],
    ["Tyson Foods", "https://www.tysonfoods.com/"],
    ["ADM", "https://www.adm.com/"],
  ]],

  // Education
  ["Education", "universities", "Universities", [
    ["Harvard", "https://www.harvard.edu/"],
    ["Stanford", "https://www.stanford.edu/"],
    ["Oxford", "https://www.ox.ac.uk/"],
    ["Cambridge", "https://www.cam.ac.uk/"],
    ["Tsinghua", "https://www.tsinghua.edu.cn/en/"],
  ]],
  ["Education", "edtech", "EdTech and e-learning", [
    ["Coursera", "https://www.coursera.org/"],
    ["Khan Academy", "https://www.khanacademy.org/"],
    ["Udemy", "https://www.udemy.com/"],
    ["Unacademy", "https://unacademy.com/"],
    ["BYJU'S", "https://byjus.com/"],
    ["edX", "https://www.edx.org/"],
    ["Pearson", "https://www.pearson.com/"],
  ]],
  ["Education", "k12", "K-12 education", [
    ["Scholastic", "https://www.scholastic.com/"],
    ["McGraw Hill", "https://www.mheducation.com/"],
    ["Tata ClassEdge", "https://www.tataclassedge.com/"],
    ["Teach For All", "https://teachforall.org/"],
  ]],

  // Real estate and construction
  ["Real estate and construction", "property-portals", "Property portals", [
    ["MagicBricks", "https://www.magicbricks.com/"],
    ["99acres", "https://www.99acres.com/"],
    ["Zillow", "https://www.zillow.com/"],
    ["Rightmove", "https://www.rightmove.co.uk/"],
    ["Realtor.com", "https://www.realtor.com/"],
  ]],
  ["Real estate and construction", "developers", "Real estate developers", [
    ["DLF", "https://www.dlf.in/"],
    ["Emaar", "https://www.emaar.com/"],
    ["Brookfield", "https://www.brookfield.com/"],
    ["Sun Hung Kai Properties", "https://www.shkp.com/"],
  ]],
  ["Real estate and construction", "commercial-real-estate", "Commercial real estate", [
    ["CBRE", "https://www.cbre.com/"],
    ["JLL", "https://www.jll.com/"],
    ["Colliers", "https://www.colliers.com/"],
    ["Savills", "https://www.savills.com/"],
    ["Cushman & Wakefield", "https://www.cushmanwakefield.com/"],
  ]],
  ["Real estate and construction", "construction", "Construction and materials", [
    ["Bechtel", "https://www.bechtel.com/"],
    ["Vinci", "https://www.vinci.com/"],
    ["Skanska", "https://www.skanska.com/"],
    ["Holcim", "https://www.holcim.com/"],
    ["Saint-Gobain", "https://www.saint-gobain.com/"],
    ["Caterpillar", "https://www.cat.com/"],
    ["Komatsu", "https://www.komatsu.com/"],
  ]],

  // Automotive
  ["Automotive", "car-makers", "Car makers", [
    ["Tesla", "https://www.tesla.com/"],
    ["Toyota", "https://global.toyota/"],
    ["Volkswagen Group", "https://www.volkswagen-group.com/"],
    ["Hyundai", "https://www.hyundai.com/"],
    ["General Motors", "https://www.gm.com/"],
  ]],
  ["Automotive", "auto-parts", "Auto parts", [
    ["Bosch", "https://www.bosch.com/"],
    ["Denso", "https://www.denso.com/"],
    ["Continental", "https://www.continental.com/"],
    ["ZF", "https://www.zf.com/"],
    ["Magna", "https://www.magna.com/"],
  ]],
  ["Automotive", "mobility", "EV and mobility", [
    ["BYD", "https://www.byd.com/"],
    ["NIO", "https://www.nio.com/"],
    ["Uber", "https://www.uber.com/"],
    ["DiDi", "https://www.didiglobal.com/"],
    ["CarMax", "https://www.carmax.com/"],
  ]],

  // Media and gaming
  ["Media and entertainment", "streaming", "Streaming and broadcast", [
    ["Netflix", "https://www.netflix.com/"],
    ["Disney", "https://thewaltdisneycompany.com/"],
    ["BBC", "https://www.bbc.co.uk/"],
    ["Sony Pictures", "https://www.sonypictures.com/"],
    ["Comcast", "https://corporate.comcast.com/"],
  ]],
  ["Media and entertainment", "music", "Film and music", [
    ["Universal Music", "https://www.universalmusic.com/"],
    ["Warner Music", "https://www.wmg.com/"],
    ["Sony Music", "https://www.sonymusic.com/"],
    ["Paramount", "https://www.paramount.com/"],
    ["Lionsgate", "https://www.lionsgate.com/"],
  ]],
  ["Media and entertainment", "news", "News and publishing", [
    ["The New York Times", "https://www.nytimes.com/"],
    ["Reuters", "https://www.reuters.com/"],
    ["Penguin Random House", "https://www.penguinrandomhouse.com/"],
    ["Vox Media", "https://www.voxmedia.com/"],
  ]],
  ["Media and entertainment", "gaming", "Gaming and eSports", [
    ["PlayStation", "https://www.playstation.com/"],
    ["Xbox", "https://www.xbox.com/"],
    ["Nintendo", "https://www.nintendo.com/"],
    ["Riot Games", "https://www.riotgames.com/"],
    ["Epic Games", "https://www.epicgames.com/"],
    ["Supercell", "https://supercell.com/"],
    ["Steam", "https://store.steampowered.com/"],
  ]],

  // Fashion
  ["Fashion and beauty", "fast-fashion", "Fast fashion", [
    ["Zara", "https://www.zara.com/"],
    ["H&M", "https://www.hm.com/"],
    ["Uniqlo", "https://www.uniqlo.com/"],
    ["Shein", "https://www.shein.com/"],
    ["Gap", "https://www.gap.com/"],
  ]],
  ["Fashion and beauty", "sportswear", "Sportswear", [
    ["Nike", "https://www.nike.com/in/"],
    ["Adidas", "https://www.adidas.co.in/"],
    ["Puma", "https://in.puma.com/"],
    ["Lululemon", "https://shop.lululemon.com/"],
    ["Under Armour", "https://www.underarmour.com/"],
  ]],
  ["Fashion and beauty", "luxury-fashion", "Luxury fashion", [
    ["Louis Vuitton", "https://www.louisvuitton.com/"],
    ["Prada", "https://www.prada.com/ww/en.html", 4],
    ["Gucci", "https://www.gucci.com/"],
    ["Chanel", "https://www.chanel.com/"],
    ["Hermès", "https://www.hermes.com/"],
  ]],
  ["Fashion and beauty", "accessories", "Footwear and accessories", [
    ["Fossil", "https://www.fossil.in/", 4],
    ["Skechers", "https://www.skechers.com/"],
    ["ASICS", "https://www.asics.com/"],
    ["Tapestry (Coach)", "https://www.tapestry.com/"],
  ]],
  ["Fashion and beauty", "beauty", "Cosmetics and skincare", [
    ["L'Oréal", "https://www.loreal.com/en/", 5, "Horizontal card carousel driven by vertical scroll, with opacity on the cards."],
    ["Estée Lauder", "https://www.elcompanies.com/"],
    ["Shiseido", "https://corp.shiseido.com/"],
    ["Dior", "https://www.dior.com/"],
    ["Amorepacific", "https://www.apgroup.com/"],
  ]],
  ["Fashion and beauty", "personal-care", "Personal care", [
    ["Unilever", "https://www.unilever.com/"],
    ["Procter & Gamble", "https://www.pg.com/"],
    ["Colgate-Palmolive", "https://www.colgatepalmolive.com/"],
    ["Reckitt", "https://www.reckitt.com/"],
    ["Beiersdorf", "https://www.beiersdorf.com/"],
  ]],

  // Sports
  ["Sports and fitness", "sports-media", "Sports leagues and media", [
    ["NFL", "https://www.nfl.com/", 5, "Cinematic / 3D-perspective body background: the stadium with a vanishing point."],
    ["FIFA", "https://www.fifa.com/"],
    ["Olympics", "https://www.olympics.com/"],
    ["ESPN", "https://www.espn.com/"],
    ["PGA Tour", "https://www.pgatour.com/"],
  ]],
  ["Sports and fitness", "sporting-goods", "Sporting goods", [
    ["Decathlon", "https://www.decathlon.in/"],
    ["Nike", "https://www.nike.com/in/"],
    ["Adidas", "https://www.adidas.co.in/"],
    ["Puma", "https://in.puma.com/"],
  ]],
  ["Sports and fitness", "fitness", "Gyms and fitness equipment", [
    ["Peloton", "https://www.onepeloton.com/"],
    ["Technogym", "https://www.technogym.com/"],
    ["Anytime Fitness", "https://www.anytimefitness.com/"],
    ["Planet Fitness", "https://www.planetfitness.com/"],
    ["Gold's Gym", "https://www.goldsgym.com/"],
  ]],

  // Logistics and transport
  ["Logistics and transport", "courier", "Courier and parcel", [
    ["DHL", "https://www.dhl.com/"],
    ["FedEx", "https://www.fedex.com/"],
    ["UPS", "https://www.ups.com/"],
    ["Aramex", "https://www.aramex.com/"],
  ]],
  ["Logistics and transport", "shipping", "Shipping and freight", [
    ["Maersk", "https://www.maersk.com/"],
    ["MSC", "https://www.msc.com/"],
    ["CMA CGM", "https://www.cma-cgm.com/"],
    ["Hapag-Lloyd", "https://www.hapag-lloyd.com/"],
    ["Kuehne+Nagel", "https://www.kuehne-nagel.com/"],
    ["DSV", "https://www.dsv.com/"],
  ]],
  ["Logistics and transport", "airports-rail", "Airports and railways", [
    ["Changi Airport", "https://www.changiairport.com/"],
    ["Heathrow", "https://www.heathrow.com/"],
    ["Indian Railways", "https://indianrailways.gov.in/"],
    ["Deutsche Bahn", "https://www.deutschebahn.com/"],
    ["Union Pacific", "https://www.up.com/"],
  ]],

  // Energy and telecom
  ["Energy and utilities", "oil-gas", "Oil and gas", [
    ["Shell", "https://www.shell.com/"],
    ["BP", "https://www.bp.com/"],
    ["Aramco", "https://www.aramco.com/"],
    ["ExxonMobil", "https://corporate.exxonmobil.com/"],
    ["Chevron", "https://www.chevron.com/"],
  ]],
  ["Energy and utilities", "renewables", "Renewables and power", [
    ["Ørsted", "https://orsted.com/"],
    ["Vestas", "https://www.vestas.com/"],
    ["NextEra Energy", "https://www.nexteraenergy.com/"],
    ["First Solar", "https://www.firstsolar.com/"],
    ["Enel", "https://www.enel.com/"],
    ["EDF", "https://www.edf.fr/en"],
  ]],
  ["Energy and utilities", "water", "Water and waste", [
    ["Veolia", "https://www.veolia.com/"],
    ["Suez", "https://www.suez.com/"],
    ["American Water", "https://www.amwater.com/"],
    ["Singapore PUB", "https://www.pub.gov.sg/"],
  ]],
  ["Telecom", "telecom", "Telecom operators", [
    ["Vodafone", "https://www.vodafone.com/"],
    ["AT&T", "https://www.att.com/"],
    ["Verizon", "https://www.verizon.com/"],
    ["BT", "https://www.bt.com/"],
    ["NTT Docomo", "https://www.docomo.ne.jp/english/"],
  ]],
  ["Telecom", "network", "Network equipment and satellite", [
    ["Cisco", "https://www.cisco.com/"],
    ["Ericsson", "https://www.ericsson.com/"],
    ["Nokia", "https://www.nokia.com/"],
    ["Huawei", "https://www.huawei.com/"],
    ["Starlink", "https://www.starlink.com/"],
  ]],

  // Aerospace, agriculture, industry
  ["Aerospace and defence", "aerospace", "Aerospace and space", [
    ["Airbus", "https://www.airbus.com/"],
    ["Boeing", "https://www.boeing.com/"],
    ["SpaceX", "https://www.spacex.com/"],
    ["Blue Origin", "https://www.blueorigin.com/"],
    ["Rolls-Royce", "https://www.rolls-royce.com/"],
    ["Lockheed Martin", "https://www.lockheedmartin.com/"],
  ]],
  ["Aerospace and defence", "defence", "Defence", [
    ["BAE Systems", "https://www.baesystems.com/"],
    ["Thales", "https://www.thalesgroup.com/"],
    ["Safran", "https://www.safran-group.com/"],
    ["RTX", "https://www.rtx.com/"],
    ["General Dynamics", "https://www.gd.com/"],
  ]],
  ["Agriculture", "agribusiness", "Agribusiness and agritech", [
    ["John Deere", "https://www.deere.com/"],
    ["Cargill", "https://www.cargill.com/"],
    ["Syngenta", "https://www.syngenta.com/"],
    ["Corteva", "https://www.corteva.com/"],
    ["Bayer Crop Science", "https://www.cropscience.bayer.com/"],
    ["Trimble", "https://www.trimble.com/"],
  ]],
  ["Mining and chemicals", "mining", "Mining and metals", [
    ["BHP", "https://www.bhp.com/"],
    ["Rio Tinto", "https://www.riotinto.com/"],
    ["Vale", "https://vale.com/"],
    ["ArcelorMittal", "https://corporate.arcelormittal.com/"],
    ["Newmont", "https://www.newmont.com/"],
  ]],
  ["Mining and chemicals", "chemicals", "Chemicals", [
    ["BASF", "https://www.basf.com/"],
    ["Dow", "https://www.dow.com/"],
    ["3M", "https://www.3m.com/"],
    ["Henkel", "https://www.henkel.com/"],
    ["AkzoNobel", "https://www.akzonobel.com/"],
  ]],

  // Services and public sector
  ["Professional services", "consulting", "Consulting and audit", [
    ["McKinsey", "https://www.mckinsey.com/"],
    ["BCG", "https://www.bcg.com/"],
    ["Bain", "https://www.bain.com/"],
    ["Deloitte", "https://www.deloitte.com/"],
    ["PwC", "https://www.pwc.com/"],
    ["EY", "https://www.ey.com/"],
    ["KPMG", "https://kpmg.com/"],
  ]],
  ["Professional services", "legal", "Law firms", [
    ["Baker McKenzie", "https://www.bakermckenzie.com/"],
    ["Clifford Chance", "https://www.cliffordchance.com/"],
    ["Latham & Watkins", "https://www.lw.com/"],
    ["DLA Piper", "https://www.dlapiper.com/"],
    ["A&O Shearman", "https://www.aoshearman.com/"],
  ]],
  ["Professional services", "advertising", "Advertising and marketing", [
    ["WPP", "https://www.wpp.com/"],
    ["Publicis", "https://www.publicisgroupe.com/"],
    ["Omnicom", "https://www.omnicomgroup.com/"],
    ["Dentsu", "https://www.dentsu.com/"],
    ["HubSpot", "https://www.hubspot.com/"],
    ["Mailchimp", "https://mailchimp.com/"],
  ]],
  ["Nonprofit and government", "international", "International organisations", [
    ["United Nations", "https://www.un.org/"],
    ["World Bank", "https://www.worldbank.org/"],
    ["WHO", "https://www.who.int/"],
    ["IMF", "https://www.imf.org/"],
    ["Red Cross (ICRC)", "https://www.icrc.org/"],
  ]],
  ["Nonprofit and government", "ngos", "NGOs and foundations", [
    ["Gates Foundation", "https://www.gatesfoundation.org/"],
    ["UNICEF", "https://www.unicef.org/"],
    ["WWF", "https://www.worldwildlife.org/"],
    ["Doctors Without Borders", "https://www.msf.org/"],
    ["Amnesty International", "https://www.amnesty.org/"],
  ]],
  ["Nonprofit and government", "government", "Government", [
    ["Government of India", "https://www.india.gov.in/"],
    ["GOV.UK", "https://www.gov.uk/"],
    ["USA.gov", "https://www.usa.gov/"],
    ["European Union", "https://european-union.europa.eu/"],
    ["Australian Government", "https://www.australia.gov.au/"],
  ]],
];

export const WEB_DOMAINS: WebDomain[] = RAW.map(
  ([industry, id, label, rows]) => ({
    id,
    label,
    industry,
    sites: rows.map(site),
  }),
);

/** Domains grouped under their industry, in order, for the dropdown. */
export const DOMAIN_INDUSTRIES: { industry: string; domains: WebDomain[] }[] =
  WEB_DOMAINS.reduce<{ industry: string; domains: WebDomain[] }[]>(
    (groups, d) => {
      const last = groups.at(-1);
      if (last?.industry === d.industry) last.domains.push(d);
      else groups.push({ industry: d.industry, domains: [d] });
      return groups;
    },
    [],
  );

/** Highest score first; unscored sites keep their order after them. */
export const byScore = (sites: DomainSite[]) =>
  sites
    .map((s, i) => ({ s, i }))
    .sort((a, b) => (b.s.score ?? 0) - (a.s.score ?? 0) || a.i - b.i)
    .map(({ s }) => s);
