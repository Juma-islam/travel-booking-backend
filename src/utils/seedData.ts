/**
 * SEED SCRIPT — 20 professional packages
 * Run: npx tsx src/utils/seedData.ts
 */
import dotenv from 'dotenv';
import connectDB from '../config/db.ts';
import User from '../models/user.model.ts';
import Destination from '../models/destination.model.ts';
import Package from '../models/package.model.ts';

dotenv.config();

const destinations = [
  { name: 'Bali', country: 'Indonesia', description: 'Tropical paradise with stunning temples, rice terraces, and world-class beaches.', imageUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800', isTrending: true },
  { name: 'Paris', country: 'France', description: 'The City of Light — Eiffel Tower, world-class cuisine, art museums, and romantic boulevards.', imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800', isTrending: true },
  { name: 'Tokyo', country: 'Japan', description: 'A perfect blend of ancient tradition and futuristic technology.', imageUrl: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800', isTrending: true },
  { name: 'Santorini', country: 'Greece', description: 'Iconic white-washed buildings, blue-domed churches, and breathtaking sunsets.', imageUrl: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800', isTrending: false },
  { name: 'Maldives', country: 'Maldives', description: 'Crystal-clear turquoise waters, overwater bungalows, and vibrant coral reefs.', imageUrl: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800', isTrending: true },
  { name: 'Dubai', country: 'UAE', description: 'Ultra-modern skyline, luxury shopping, desert safaris, and world records.', imageUrl: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800', isTrending: true },
  { name: "Cox's Bazar", country: 'Bangladesh', description: "World's longest natural sea beach stretching 120km.", imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800', isTrending: false },
  { name: 'New York', country: 'USA', description: 'The city that never sleeps — Times Square, Central Park, Broadway shows.', imageUrl: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800', isTrending: false },
  { name: 'Rome', country: 'Italy', description: 'The Eternal City — Colosseum, Vatican, and world-famous Italian cuisine.', imageUrl: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800', isTrending: false },
  { name: 'Bangkok', country: 'Thailand', description: 'Vibrant street life, ornate temples, and incredible street food.', imageUrl: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=800', isTrending: true },
];

function buildPackages(destMap: Record<string, string>, adminId: string) {
  return [
    // ── Bali ──
    {
      user: adminId, title: 'Bali Paradise Escape', destination: destMap['Bali'],
      description: 'Experience the magic of Bali with this all-inclusive package. Explore ancient temples, rice terraces, and pristine beaches. Includes guided tours, luxury resort stay, and authentic Balinese cuisine.',
      price: 899, duration: { days: 7, nights: 6 },
      images: ['https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800', 'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=800'],
      category: 'relaxation', inclusions: ['Round-trip flights', 'Luxury resort (6 nights)', 'Daily breakfast', 'Temple tours', 'Rice terrace trek', 'Airport transfers'],
      exclusions: ['Visa fees', 'Travel insurance', 'Personal expenses'],
      rating: 4.8, numReviews: 124, isPopular: true, maxGuests: 20, bookedSlots: 14, isAvailable: true,
      cancellationPolicy: 'moderate', host: { name: 'Bali Dream Tours', responseRate: 98, totalTours: 450, joinedYear: 2019 },
      coordinates: { lat: -8.3405, lng: 115.0920 },
    },
    {
      user: adminId, title: 'Bali Honeymoon Special', destination: destMap['Bali'],
      description: 'A romantic getaway designed for couples. Private villa with pool, couples spa, sunset dinner on the beach, and a private boat tour.',
      price: 1499, duration: { days: 10, nights: 9 },
      images: ['https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=800'],
      category: 'couple', inclusions: ['Private pool villa', 'Couples spa', 'Sunset dinner', 'Private boat tour', 'Flower decoration', 'Airport transfers'],
      exclusions: ['Flights', 'Visa', 'Extra activities'],
      rating: 4.9, numReviews: 87, isPopular: true, maxGuests: 2, bookedSlots: 1, isAvailable: true,
      cancellationPolicy: 'flexible', host: { name: 'Bali Romance', responseRate: 100, totalTours: 200, joinedYear: 2020 },
      coordinates: { lat: -8.3405, lng: 115.0920 },
    },
    // ── Paris ──
    {
      user: adminId, title: 'Paris City of Love', destination: destMap['Paris'],
      description: 'Discover the romance of Paris with guided tours of the Eiffel Tower, Louvre Museum, and Versailles Palace. Includes Seine River cruise and wine tasting.',
      price: 1299, duration: { days: 6, nights: 5 },
      images: ['https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800', 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800'],
      category: 'couple', inclusions: ['4-star hotel (5 nights)', 'Eiffel Tower tickets', 'Louvre Museum entry', 'Seine River cruise', 'Wine tasting', 'City tour'],
      exclusions: ['Flights', 'Meals', 'Personal shopping'],
      rating: 4.7, numReviews: 203, isPopular: true, maxGuests: 15, bookedSlots: 8, isAvailable: true,
      cancellationPolicy: 'moderate', host: { name: 'Paris Prestige Tours', responseRate: 96, totalTours: 380, joinedYear: 2018 },
      coordinates: { lat: 48.8566, lng: 2.3522 },
    },
    {
      user: adminId, title: 'European Adventure — Paris, Rome & Barcelona', destination: destMap['Paris'],
      description: 'The ultimate European adventure covering three iconic cities. Explore art, history, food, and architecture across France, Italy, and Spain.',
      price: 2499, duration: { days: 12, nights: 11 },
      images: ['https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800'],
      category: 'adventure', inclusions: ['Hotels (11 nights)', 'Inter-city trains', 'Guided city tours', 'Museum entries', 'Welcome dinner', 'Airport transfers'],
      exclusions: ['International flights', 'Travel insurance', 'Personal expenses'],
      rating: 4.9, numReviews: 156, isPopular: true, maxGuests: 20, bookedSlots: 18, isAvailable: true,
      cancellationPolicy: 'strict', host: { name: 'Euro Explorer', responseRate: 97, totalTours: 520, joinedYear: 2017 },
      coordinates: { lat: 48.8566, lng: 2.3522 },
    },
    // ── Tokyo ──
    {
      user: adminId, title: 'Tokyo Cultural Discovery', destination: destMap['Tokyo'],
      description: 'Immerse yourself in Japanese culture — from ancient shrines to futuristic technology. Visit Shibuya, Akihabara, Mount Fuji, and traditional tea ceremonies.',
      price: 1599, duration: { days: 8, nights: 7 },
      images: ['https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800', 'https://images.unsplash.com/photo-1513407030348-c983a97b98d8?w=800'],
      category: 'adventure', inclusions: ['Hotel (7 nights)', 'JR Pass (7 days)', 'Mount Fuji day trip', 'Tea ceremony', 'Sushi making class', 'City tour'],
      exclusions: ['International flights', 'Visa', 'Personal meals'],
      rating: 4.8, numReviews: 178, isPopular: true, maxGuests: 12, bookedSlots: 7, isAvailable: true,
      cancellationPolicy: 'moderate', host: { name: 'Japan Insider Tours', responseRate: 99, totalTours: 310, joinedYear: 2019 },
      coordinates: { lat: 35.6762, lng: 139.6503 },
    },
    {
      user: adminId, title: 'Japan Family Adventure', destination: destMap['Tokyo'],
      description: 'A family-friendly Japan tour with visits to Disneyland Tokyo, teamLab digital art museum, anime studios, and kid-friendly cultural experiences.',
      price: 2199, duration: { days: 10, nights: 9 },
      images: ['https://images.unsplash.com/photo-1513407030348-c983a97b98d8?w=800'],
      category: 'family', inclusions: ['Family hotel (9 nights)', 'Disneyland tickets', 'teamLab entry', 'JR Pass', 'Anime studio tour', 'All transfers'],
      exclusions: ['International flights', 'Meals', 'Souvenirs'],
      rating: 4.7, numReviews: 92, isPopular: false, maxGuests: 30, bookedSlots: 12, isAvailable: true,
      cancellationPolicy: 'flexible', host: { name: 'Japan Family Tours', responseRate: 95, totalTours: 180, joinedYear: 2020 },
      coordinates: { lat: 35.6762, lng: 139.6503 },
    },
    // ── Santorini ──
    {
      user: adminId, title: 'Santorini Sunset Romance', destination: destMap['Santorini'],
      description: 'Experience the iconic blue domes and white-washed buildings of Santorini. Includes wine tours, catamaran cruise, and the famous Oia sunset.',
      price: 1799, duration: { days: 7, nights: 6 },
      images: ['https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800', 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800'],
      category: 'couple', inclusions: ['Boutique hotel (6 nights)', 'Catamaran cruise', 'Wine tasting tour', 'Oia sunset tour', 'Breakfast daily', 'Airport transfers'],
      exclusions: ['Flights', 'Lunch & dinner', 'Personal expenses'],
      rating: 4.9, numReviews: 145, isPopular: true, maxGuests: 10, bookedSlots: 9, isAvailable: true,
      cancellationPolicy: 'moderate', host: { name: 'Greek Island Escapes', responseRate: 100, totalTours: 260, joinedYear: 2018 },
      coordinates: { lat: 36.3932, lng: 25.4615 },
    },
    // ── Maldives ──
    {
      user: adminId, title: 'Maldives Luxury Overwater Villa', destination: destMap['Maldives'],
      description: 'Stay in a stunning overwater bungalow surrounded by crystal-clear turquoise water. Includes snorkeling, dolphin watching, and private beach dining.',
      price: 3299, duration: { days: 7, nights: 6 },
      images: ['https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800', 'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=800'],
      category: 'relaxation', inclusions: ['Overwater villa (6 nights)', 'All meals', 'Snorkeling gear', 'Dolphin cruise', 'Seaplane transfer', 'Spa session'],
      exclusions: ['International flights', 'Alcohol', 'Extra water sports'],
      rating: 5.0, numReviews: 67, isPopular: true, maxGuests: 2, bookedSlots: 2, isAvailable: false,
      cancellationPolicy: 'strict', host: { name: 'Maldives Luxury Resorts', responseRate: 100, totalTours: 150, joinedYear: 2019 },
      coordinates: { lat: 3.2028, lng: 73.2207 },
    },
    {
      user: adminId, title: 'Maldives Budget Beach Getaway', destination: destMap['Maldives'],
      description: 'Experience the Maldives without breaking the bank. Stay on a local island, enjoy pristine beaches, snorkeling, and authentic Maldivian food.',
      price: 1199, duration: { days: 5, nights: 4 },
      images: ['https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=800'],
      category: 'solo', inclusions: ['Guesthouse (4 nights)', 'Breakfast', 'Snorkeling trip', 'Island hopping', 'Airport speedboat'],
      exclusions: ['Flights', 'Lunch & dinner', 'Diving'],
      rating: 4.5, numReviews: 89, isPopular: false, maxGuests: 15, bookedSlots: 5, isAvailable: true,
      cancellationPolicy: 'flexible', host: { name: 'Local Maldives Tours', responseRate: 94, totalTours: 120, joinedYear: 2021 },
      coordinates: { lat: 3.2028, lng: 73.2207 },
    },
    // ── Dubai ──
    {
      user: adminId, title: 'Dubai Luxury Experience', destination: destMap['Dubai'],
      description: 'Experience the best of Dubai — Burj Khalifa, desert safari, Dubai Mall, Palm Jumeirah, and a dhow cruise dinner on Dubai Creek.',
      price: 1899, duration: { days: 6, nights: 5 },
      images: ['https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800', 'https://images.unsplash.com/photo-1518684079-3c830dcef090?w=800'],
      category: 'adventure', inclusions: ['5-star hotel (5 nights)', 'Burj Khalifa tickets', 'Desert safari', 'Dhow cruise dinner', 'City tour', 'Airport transfers'],
      exclusions: ['Flights', 'Visa', 'Personal shopping'],
      rating: 4.6, numReviews: 134, isPopular: true, maxGuests: 20, bookedSlots: 11, isAvailable: true,
      cancellationPolicy: 'moderate', host: { name: 'Dubai Elite Tours', responseRate: 97, totalTours: 420, joinedYear: 2018 },
      coordinates: { lat: 25.2048, lng: 55.2708 },
    },
    {
      user: adminId, title: 'Dubai Family Fun Package', destination: destMap['Dubai'],
      description: 'A complete family vacation in Dubai with visits to IMG Worlds of Adventure, Aquaventure Waterpark, Dubai Frame, and Global Village.',
      price: 2399, duration: { days: 7, nights: 6 },
      images: ['https://images.unsplash.com/photo-1518684079-3c830dcef090?w=800'],
      category: 'family', inclusions: ['Family hotel (6 nights)', 'IMG Worlds tickets', 'Aquaventure passes', 'Dubai Frame entry', 'Desert safari', 'All transfers'],
      exclusions: ['Flights', 'Visa', 'Meals'],
      rating: 4.7, numReviews: 98, isPopular: false, maxGuests: 25, bookedSlots: 10, isAvailable: true,
      cancellationPolicy: 'moderate', host: { name: 'Dubai Elite Tours', responseRate: 97, totalTours: 420, joinedYear: 2018 },
      coordinates: { lat: 25.2048, lng: 55.2708 },
    },
    // ── Cox's Bazar ──
    {
      user: adminId, title: "Cox's Bazar Beach Holiday", destination: destMap["Cox's Bazar"],
      description: "Explore the world's longest natural sea beach. Enjoy fresh seafood, beach walks, Himchari waterfall, and local Buddhist temples.",
      price: 299, duration: { days: 4, nights: 3 },
      images: ['https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800'],
      category: 'relaxation', inclusions: ['Hotel (3 nights)', 'Breakfast', 'Beach tour', 'Himchari trip', 'Inani beach visit', 'Local transport'],
      exclusions: ["Dhaka-Cox's Bazar transport", 'Lunch & dinner', 'Personal expenses'],
      rating: 4.4, numReviews: 211, isPopular: false, maxGuests: 25, bookedSlots: 8, isAvailable: true,
      cancellationPolicy: 'flexible', host: { name: 'Bangladesh Travel Co.', responseRate: 92, totalTours: 350, joinedYear: 2020 },
      coordinates: { lat: 21.4272, lng: 92.0058 },
    },
    {
      user: adminId, title: "Cox's Bazar Family Package", destination: destMap["Cox's Bazar"],
      description: "A complete family vacation at Cox's Bazar with beach activities, boat rides, seafood feasts, and visits to nearby islands.",
      price: 499, duration: { days: 5, nights: 4 },
      images: ['https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800'],
      category: 'family', inclusions: ['Family hotel (4 nights)', 'All meals', 'Boat ride', 'Saint Martin day trip', 'Beach activities', 'Transport'],
      exclusions: ["Dhaka-Cox's Bazar bus/flight", 'Souvenirs'],
      rating: 4.6, numReviews: 178, isPopular: true, maxGuests: 30, bookedSlots: 15, isAvailable: true,
      cancellationPolicy: 'moderate', host: { name: 'Bangladesh Travel Co.', responseRate: 92, totalTours: 350, joinedYear: 2020 },
      coordinates: { lat: 21.4272, lng: 92.0058 },
    },
    // ── New York ──
    {
      user: adminId, title: 'New York City Explorer', destination: destMap['New York'],
      description: 'The ultimate NYC experience — Times Square, Central Park, Statue of Liberty, Brooklyn Bridge, and Broadway show.',
      price: 2099, duration: { days: 7, nights: 6 },
      images: ['https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800'],
      category: 'adventure', inclusions: ['Manhattan hotel (6 nights)', 'Statue of Liberty ferry', 'Broadway show ticket', 'City bus tour', 'Central Park tour', 'Airport transfers'],
      exclusions: ['International flights', 'Meals', 'Museum entries'],
      rating: 4.7, numReviews: 198, isPopular: false, maxGuests: 20, bookedSlots: 6, isAvailable: true,
      cancellationPolicy: 'moderate', host: { name: 'NYC Discovery Tours', responseRate: 96, totalTours: 480, joinedYear: 2017 },
      coordinates: { lat: 40.7128, lng: -74.0060 },
    },
    {
      user: adminId, title: 'New York Solo Adventure', destination: destMap['New York'],
      description: 'Perfect for solo travelers — explore NYC at your own pace with a curated guide, hop-on hop-off bus pass, and free time to discover hidden gems.',
      price: 1299, duration: { days: 5, nights: 4 },
      images: ['https://images.unsplash.com/photo-1534430480872-3498386e7856?w=800'],
      category: 'solo', inclusions: ['Midtown hotel (4 nights)', 'Hop-on hop-off bus pass', 'NYC guidebook', 'Welcome dinner', 'Airport transfers'],
      exclusions: ['International flights', 'Meals', 'Museum entries'],
      rating: 4.5, numReviews: 112, isPopular: false, maxGuests: 1, bookedSlots: 0, isAvailable: true,
      cancellationPolicy: 'flexible', host: { name: 'NYC Discovery Tours', responseRate: 96, totalTours: 480, joinedYear: 2017 },
      coordinates: { lat: 40.7128, lng: -74.0060 },
    },
    // ── Rome ──
    {
      user: adminId, title: 'Rome Eternal City Tour', destination: destMap['Rome'],
      description: 'Walk through 2,000 years of history — Colosseum, Vatican Museums, Sistine Chapel, Trevi Fountain, and authentic Roman cuisine.',
      price: 1399, duration: { days: 6, nights: 5 },
      images: ['https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800'],
      category: 'adventure', inclusions: ['Boutique hotel (5 nights)', 'Colosseum skip-the-line', 'Vatican guided tour', 'Cooking class', 'Wine tasting', 'Airport transfers'],
      exclusions: ['Flights', 'Meals', 'Personal expenses'],
      rating: 4.8, numReviews: 167, isPopular: true, maxGuests: 15, bookedSlots: 9, isAvailable: true,
      cancellationPolicy: 'moderate', host: { name: 'Italia Bella Tours', responseRate: 98, totalTours: 290, joinedYear: 2018 },
      coordinates: { lat: 41.9028, lng: 12.4964 },
    },
    {
      user: adminId, title: 'Italy Family Vacation', destination: destMap['Rome'],
      description: 'A magical family trip through Italy — Rome, Florence, and Venice. Kid-friendly activities, gelato tours, and gondola rides.',
      price: 2799, duration: { days: 10, nights: 9 },
      images: ['https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=800'],
      category: 'family', inclusions: ['Hotels (9 nights)', 'Inter-city trains', 'Guided tours', 'Gondola ride', 'Gelato tour', 'All transfers'],
      exclusions: ['International flights', 'Meals', 'Museum entries'],
      rating: 4.7, numReviews: 143, isPopular: false, maxGuests: 25, bookedSlots: 7, isAvailable: true,
      cancellationPolicy: 'moderate', host: { name: 'Italia Bella Tours', responseRate: 98, totalTours: 290, joinedYear: 2018 },
      coordinates: { lat: 41.9028, lng: 12.4964 },
    },
    // ── Bangkok ──
    {
      user: adminId, title: 'Bangkok Street Food & Temples', destination: destMap['Bangkok'],
      description: 'Discover Bangkok through its incredible street food scene, ornate temples, floating markets, and vibrant nightlife.',
      price: 799, duration: { days: 6, nights: 5 },
      images: ['https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=800'],
      category: 'adventure', inclusions: ['Hotel (5 nights)', 'Street food tour', 'Temple tour', 'Floating market trip', 'Tuk-tuk ride', 'Airport transfers'],
      exclusions: ['Flights', 'Visa', 'Personal meals'],
      rating: 4.6, numReviews: 189, isPopular: true, maxGuests: 15, bookedSlots: 10, isAvailable: true,
      cancellationPolicy: 'flexible', host: { name: 'Thai Adventure Tours', responseRate: 95, totalTours: 380, joinedYear: 2019 },
      coordinates: { lat: 13.7563, lng: 100.5018 },
    },
    {
      user: adminId, title: 'Thailand Island Hopping', destination: destMap['Bangkok'],
      description: 'Explore the best of Thailand — Bangkok city, Chiang Mai temples, Phuket beaches, and Phi Phi Islands. The ultimate Thai experience.',
      price: 1599, duration: { days: 12, nights: 11 },
      images: ['https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=800'],
      category: 'adventure', inclusions: ['Hotels (11 nights)', 'Domestic flights', 'Island boat tours', 'Elephant sanctuary', 'Cooking class', 'All transfers'],
      exclusions: ['International flights', 'Visa', 'Personal expenses'],
      rating: 4.8, numReviews: 221, isPopular: true, maxGuests: 20, bookedSlots: 16, isAvailable: true,
      cancellationPolicy: 'moderate', host: { name: 'Thai Adventure Tours', responseRate: 95, totalTours: 380, joinedYear: 2019 },
      coordinates: { lat: 13.7563, lng: 100.5018 },
    },
    {
      user: adminId, title: 'Bangkok Luxury Spa Retreat', destination: destMap['Bangkok'],
      description: 'A luxurious wellness retreat in Bangkok — 5-star spa hotel, Thai massage sessions, yoga classes, and healthy cuisine.',
      price: 1299, duration: { days: 5, nights: 4 },
      images: ['https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800'],
      category: 'relaxation', inclusions: ['5-star spa hotel (4 nights)', 'Daily Thai massage', 'Yoga sessions', 'Healthy meals', 'Temple tour', 'Airport transfers'],
      exclusions: ['Flights', 'Visa', 'Extra treatments'],
      rating: 4.9, numReviews: 76, isPopular: false, maxGuests: 10, bookedSlots: 4, isAvailable: true,
      cancellationPolicy: 'flexible', host: { name: 'Thai Wellness Retreats', responseRate: 100, totalTours: 95, joinedYear: 2021 },
      coordinates: { lat: 13.7563, lng: 100.5018 },
    },
  ];
}

async function seed() {
  try {
    await connectDB();
    console.log('✅ Connected to MongoDB');

    let admin = await User.findOne({ role: 'admin' });
    if (!admin) {
      admin = await User.create({ name: 'Admin', email: 'admin@travelai.com', password: 'Admin123!', role: 'admin' });
      console.log('✅ Admin created: admin@travelai.com / Admin123!');
    } else {
      console.log('✅ Admin found:', admin.email);
    }

    await Destination.deleteMany({});
    await Package.deleteMany({});
    console.log('🗑️  Cleared existing data');

    const createdDests = await Destination.insertMany(destinations);
    console.log(`✅ ${createdDests.length} destinations created`);

    const destMap: Record<string, string> = {};
    createdDests.forEach((d) => { destMap[d.name] = d._id.toString(); });

    const packages = buildPackages(destMap, admin._id.toString());
    const createdPkgs = await Package.insertMany(packages);
    console.log(`✅ ${createdPkgs.length} packages created`);

    console.log('\n🎉 Seed complete!');
    console.log(`   Destinations: ${createdDests.length}`);
    console.log(`   Packages: ${createdPkgs.length}`);
    console.log('\n📋 Destinations:');
    createdDests.forEach((d) => console.log(`   - ${d.name}, ${d.country}`));

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
}

seed();
