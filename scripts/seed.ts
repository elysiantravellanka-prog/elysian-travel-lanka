import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import Destination from '../src/models/Destination';
import TourPackage from '../src/models/TourPackage';
import Testimonial from '../src/models/Testimonial';

const MONGODB_URI = process.env.MONGODB_URI || '';

const destinations = [
    {
        name: 'Sigiriya',
        description: 'Discover the ancient rock fortress, a UNESCO World Heritage site standing majestically amidst lush forests. Climb the Lion Rock for breathtaking panoramic views and explore the historic water gardens.',
        image: 'https://images.unsplash.com/photo-1580181128419-7eb7f7afe51e?q=80&w=1000',
        highlights: ['Lion Rock Fortress', 'Ancient Frescoes', 'Water Gardens', 'Pidurangala Rock']
    },
    {
        name: 'Ella',
        description: 'A charming hill country village famous for its spectacular nature, tea plantations, and the iconic Nine Arch Bridge. Perfect for hiking, relaxation, and enjoying cool mountain air.',
        image: 'https://images.unsplash.com/photo-1590123629690-9a31e0a4c1c4?q=80&w=1000',
        highlights: ['Nine Arch Bridge', 'Little Adams Peak', 'Ella Rock', 'Ravana Falls']
    },
    {
        name: 'Galle Fort',
        description: 'Walk through history in this fortified old city founded by Portuguese colonists. Cobblestone streets, Dutch-colonial buildings, and stylish cafes make it a cultural gem.',
        image: 'https://images.unsplash.com/photo-1625736300986-a5e6a6b0c9a0?q=80&w=1000',
        highlights: ['Galle Lighthouse', 'Dutch Reformed Church', 'Maritime Museum', 'Rampart Walls']
    },
    {
        name: 'Yala National Park',
        description: 'The premier destination for wildlife enthusiasts. Home to the highest density of leopards in the world, along with elephants, sloth bears, and diverse bird life.',
        image: 'https://images.unsplash.com/photo-1535941339077-2dd1c7963098?q=80&w=1000',
        highlights: ['Leopard Safaris', 'Elephant Herds', 'Bird Watching', 'Jungle Camping']
    },
    {
        name: 'Mirissa',
        description: 'A tropical paradise known for its crescent-shaped beach, vibrant nightlife, and as one of the world\'s best locations for blue whale watching.',
        image: 'https://images.unsplash.com/photo-1578005343520-e4d5a6c13e96?q=80&w=1000',
        highlights: ['Whale Watching', 'Coconut Tree Hill', 'Secret Beach', 'Surfing']
    },
    {
        name: 'Kandy',
        description: 'The cultural capital of Sri Lanka, surrounded by mountains and tea plantations. Home to the sacred Temple of the Tooth Relic and the scenic Kandy Lake.',
        image: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?q=80&w=1000',
        highlights: ['Temple of the Tooth', 'Royal Botanical Gardens', 'Kandy Lake', 'Cultural Shows']
    }
];

const tours = [
    {
        title: 'Wild Sri Lanka Adventure',
        slug: 'wild-sri-lanka-adventure',
        price: 2500,
        duration: '10 Days',
        category: 'Wildlife',
        description: 'An immersive journey into the heart of Sri Lanka\'s wilderness. Encounter leopards in Yala, vast buffalo herds in Udawalawe, and trekking through the pristine Sinharaja Rainforest.',
        images: [
            'https://images.unsplash.com/photo-1535941339077-2dd1c7963098?q=80&w=1000',
            'https://images.unsplash.com/photo-1580181128419-7eb7f7afe51e?q=80&w=1000'
        ],
        itinerary: [
            { day: 1, title: 'Arrival & Negombo', description: 'Welcome to Sri Lanka. Relax at the beach.' },
            { day: 2, title: 'Willpattu Safari', description: 'Game drive in the land of lakes.' },
            { day: 3, title: 'Habarana', description: 'Nature connect and village life.' },
            { day: 4, title: 'Sigiriya Climb', description: 'Morning climb and transfer to Kandy.' },
            { day: 5, title: 'Kandy to Nuwara Eliya', description: 'Scenic train ride through tea country.' },
            { day: 6, title: 'Horton Plains', description: 'Trek to Worlds End.' },
            { day: 7, title: 'Yala National Park', description: 'Evening leopard safari.' },
            { day: 8, title: 'Yala Morning Safari', description: 'Full day wildlife exploration.' },
            { day: 9, title: 'Galle Fort', description: 'Sunset on the ramparts.' },
            { day: 10, title: 'Departure', description: 'Transfer to airport.' }
        ],
        inclusions: ['Luxury Accommodation', 'Private Guide', 'Jeep Safaris', 'Entrance Fees'],
        exclusions: ['International Flights', 'Tips', 'Personal Expenses'],
        isFeatured: true
    },
    {
        title: 'Cultural Triangle Heritage',
        slug: 'cultural-triangle-heritage',
        price: 1800,
        duration: '7 Days',
        category: 'Cultural',
        description: 'Step back in time to explore the ancient capitals of Anuradhapura and Polonnaruwa, marvel at the cave temples of Dambulla, and experience the sacred city of Kandy.',
        images: [
            'https://images.unsplash.com/photo-1580181128419-7eb7f7afe51e?q=80&w=1000',
            'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?q=80&w=1000'
        ],
        itinerary: [
            { day: 1, title: 'Arrival', description: 'Transfer to cultural center.' },
            { day: 2, title: 'Anuradhapura', description: 'Explore ancient ruins.' },
            { day: 3, title: 'Sigiriya & Dambulla', description: 'Rock fortress and cave temple.' },
            { day: 4, title: 'Polonnaruwa', description: 'Medieval capital tour.' },
            { day: 5, title: 'Kandy', description: 'Temple of the Tooth Relic.' },
            { day: 6, title: 'Cultural Show', description: 'Traditional Kandyan dance.' },
            { day: 7, title: 'Departure', description: 'Airport transfer.' }
        ],
        inclusions: ['Heritage Hotel Stays', 'Cultural Guide', 'All Entry Tickets', 'Breakfast & Dinner'],
        exclusions: ['Flights', 'Lunch', 'Drinks'],
        isFeatured: true
    },
    {
        title: 'Luxury Beach Retreat',
        slug: 'luxury-beach-retreat',
        price: 3200,
        duration: '8 Days',
        category: 'Beach',
        description: 'Unwind on the golden sands of the south coast. From private villas in Mirissa to the colonial charm of Galle, this is the ultimate relaxation package.',
        images: [
            'https://images.unsplash.com/photo-1578005343520-e4d5a6c13e96?q=80&w=1000',
            'https://images.unsplash.com/photo-1625736300986-a5e6a6b0c9a0?q=80&w=1000'
        ],
        itinerary: [
            { day: 1, title: 'Arrival', description: 'Private transfer to Bentota.' },
            { day: 2, title: 'Bentota Beach', description: 'Water sports and relaxation.' },
            { day: 3, title: 'Hikkaduwa', description: 'Coral reef snorkeling.' },
            { day: 4, title: 'Galle Fort', description: 'Shopping and dining.' },
            { day: 5, title: 'Mirissa', description: 'Whale watching private cruise.' },
            { day: 6, title: 'Tangalle', description: 'Secluded luxury villa stay.' },
            { day: 7, title: 'Spa Day', description: 'Ayurvedic wellness treatments.' },
            { day: 8, title: 'Departure', description: 'Luxury ride to airport.' }
        ],
        inclusions: ['5-Star Beach Resorts', 'Private Yacht Tour', 'Spa Treatments', 'Full Board'],
        exclusions: ['Shopping', 'Alcoholic Beverages'],
        isFeatured: true
    },
    {
        title: 'Honeymoon in Paradise',
        slug: 'honeymoon-in-paradise',
        price: 4500,
        duration: '12 Days',
        category: 'Honeymoon',
        description: 'The perfect romantic getaway. Candlelit dinners, private plunge pools, scenic train rides, and sunsets over the Indian Ocean.',
        images: [
            'https://images.unsplash.com/photo-1578005343520-e4d5a6c13e96?q=80&w=1000',
            'https://images.unsplash.com/photo-1590123629690-9a31e0a4c1c4?q=80&w=1000'
        ],
        itinerary: [
            { day: 1, title: 'Negombo', description: 'Romantic dinner by the lagoon.' },
            { day: 2, title: 'Sigiriya', description: 'Luxury eco-lodge stay.' },
            { day: 3, title: 'Kandy', description: 'Royal botanical gardens walk.' },
            { day: 4, title: 'Nuwara Eliya', description: 'High tea at the Grand Hotel.' },
            { day: 5, title: 'Train to Ella', description: 'Scenic First Class journey.' },
            { day: 6, title: 'Ella', description: 'Private waterfall trek.' },
            { day: 7, title: 'Yala', description: 'Glamping under the stars.' },
            { day: 8, title: 'Tangalle', description: 'Beachfront pool villa.' },
            { day: 9, title: 'Tangalle', description: 'Private beach picnic.' },
            { day: 10, title: 'Galle', description: 'Sunset cruise.' },
            { day: 11, title: 'Colombo', description: 'City lights and shopping.' },
            { day: 12, title: 'Departure', description: 'Memories to last a lifetime.' }
        ],
        inclusions: ['Honeymoon Suites', 'Couples Massage', 'Romantic Dinners', 'Private Driver'],
        exclusions: ['Flights', 'Souvenirs'],
        isFeatured: true
    },
    {
        title: 'Essence of Ceylon',
        slug: 'essence-of-ceylon',
        price: 2100,
        duration: '9 Days',
        category: 'Heritage',
        description: 'A balanced mix of culture, nature, and relaxation. Experience the tea culture, spice gardens, and the warmth of Sri Lankan hospitality.',
        images: [
            'https://images.unsplash.com/photo-1625736300986-a5e6a6b0c9a0?q=80&w=1000',
            'https://images.unsplash.com/photo-1580181128419-7eb7f7afe51e?q=80&w=1000'
        ],
        itinerary: [
            { day: 1, title: 'Colombo', description: 'City tour and street food.' },
            { day: 2, title: 'Dambulla', description: 'Cave temple visit.' },
            { day: 3, title: 'Polonnaruwa', description: 'Bicycle tour of ruins.' },
            { day: 4, title: 'Matale', description: 'Spice garden tour en route to Kandy.' },
            { day: 5, title: 'Kandy', description: 'Traditional dance and fire walking.' },
            { day: 6, title: 'Nuwara Eliya', description: 'Tea factory visit and tasting.' },
            { day: 7, title: 'Udawalawe', description: 'Elephant transit home visit.' },
            { day: 8, title: 'Bentota', description: 'River safari.' },
            { day: 9, title: 'Departure', description: 'Airport drop.' }
        ],
        inclusions: ['Boutique Hotels', 'AC Vehicle', 'Guide', 'Half Board'],
        exclusions: ['Lunch', 'Tips'],
        isFeatured: true
    },
    {
        title: 'Ramayana Trail',
        slug: 'ramayana-trail',
        price: 2800,
        duration: '11 Days',
        category: 'Cultural',
        description: 'Follow the legendary path of Lord Rama and Sita. Visit sacred temples and sites mentioned in the epic Ramayana.',
        images: [
            'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?q=80&w=1000',
            'https://images.unsplash.com/photo-1625736300986-a5e6a6b0c9a0?q=80&w=1000'
        ],
        itinerary: [
            { day: 1, title: 'Negombo', description: 'Arrival.' },
            { day: 2, title: 'Munneswaram', description: 'Visit Munneswaram Temple.' },
            { day: 3, title: 'Kandy', description: 'Temple of the Tooth.' },
            { day: 4, title: 'Nuwara Eliya', description: 'Seetha Amman Temple.' },
            { day: 5, title: 'Nuwara Eliya', description: 'Hakgala Botanical Gardens (Ashok Vatika).' },
            { day: 6, title: 'Ella', description: 'Ravana Falls and Cave.' },
            { day: 7, title: 'Kataragama', description: 'Kataragama Temple.' },
            { day: 8, title: 'Ussangoda', description: 'Legendary landing site.' },
            { day: 9, title: 'Rumassala', description: 'Sanctuary area.' },
            { day: 10, title: 'Colombo', description: 'Kelaniya Temple.' },
            { day: 11, title: 'Departure', description: 'Transfer to airport.' }
        ],
        inclusions: ['Vegetarian Friendly Meals', 'Expert Guide', 'All Temple Entries', 'Comfortable Transport'],
        exclusions: ['Flights', 'Donations'],
        isFeatured: true
    }
];

const testimonials = [
    {
        name: 'Sarah & James',
        location: 'United Kingdom',
        rating: 5,
        message: 'The most incredible honeymoon we could have imagined. Elysian Travels took care of every single detail. The private dinner in Yala was a highlight!',
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200'
    },
    {
        name: 'Michael Chen',
        location: 'Singapore',
        rating: 5,
        message: 'As a solo traveler, I felt safe and welcomed everywhere. The guide was knowledgeable and the itinerary was perfect. Highly recommended.',
        image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200'
    },
    {
        name: 'The Andersons',
        location: 'Australia',
        rating: 5,
        message: 'A perfect family vacation. The kids loved the elephants and the beaches. The hotels were all child-friendly and luxurious.',
        image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200'
    },
    {
        name: 'Emma Dubois',
        location: 'France',
        rating: 4,
        message: 'Beautiful country and excellent service. The train ride to Ella is a must-do. Thank you for organizing such a seamless trip.',
        image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=200'
    },
    {
        name: 'David Smith',
        location: 'USA',
        rating: 5,
        message: 'Luxury at its finest. The boutique hotels selected were charming and the food was outstanding. Will definitely return.',
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200'
    },
    {
        name: 'Priya Patel',
        location: 'India',
        rating: 5,
        message: 'We loved the Ramayana Trail tour. It was spiritually uplifting and well organized. The driver was very polite and helpful.',
        image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200'
    }
];

async function seed() {
    if (!MONGODB_URI) {
        console.error('Please set MONGODB_URI environment variable');
        process.exit(1);
    }

    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        // Admin User (keeping existing logic)
        const AdminUserSchema = new mongoose.Schema({
            username: String,
            email: { type: String, unique: true },
            password: String,
            role: { type: String, default: 'admin' },
        });

        const AdminUser = mongoose.models.AdminUser || mongoose.model('AdminUser', AdminUserSchema);
        const existingAdmin = await AdminUser.findOne({ email: 'admin@vistalanka.com' });

        if (existingAdmin) {
            console.log('Admin user already exists');
        } else {
            const hashedPassword = await bcrypt.hash('Admin@1234', 10);
            await AdminUser.create({
                username: 'Admin',
                email: 'admin@vistalanka.com',
                password: hashedPassword,
                role: 'super-admin',
            });
            console.log('Admin user created successfully');
        }

        // --- Seed Destinations ---
        console.log('Seeding Destinations...');
        await Destination.deleteMany({}); // Optional: Clear existing
        await Destination.insertMany(destinations);
        console.log('Destinations seeded');

        // --- Seed Tours ---
        console.log('Seeding Tour Packages...');
        await TourPackage.deleteMany({}); // Optional: Clear existing
        await TourPackage.insertMany(tours);
        console.log('Tour Packages seeded');

        // --- Seed Testimonials ---
        console.log('Seeding Testimonials...');
        await Testimonial.deleteMany({}); // Optional: Clear existing
        await Testimonial.insertMany(testimonials);
        console.log('Testimonials seeded');

        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
}

seed();
