import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding data...');

  // Seed Tour Categories
  const category = await prisma.tourCategory.create({
    data: {
      name: 'Adventure',
      description: 'Exciting and adventurous tours for thrill-seekers.',
      image: 'https://example.com/adventure.jpg',
      slug: 'adventure',
    },
  });

  // Seed Destinations
  const destination = await prisma.destination.create({
    data: {
      name: 'Everest Base Camp',
      country: 'Nepal',
      city: 'Kathmandu',
      description: 'A thrilling trek to the base camp of Mount Everest.',
      images: ['https://example.com/everest1.jpg', 'https://example.com/everest2.jpg'],
      latitude: 28.0026,
      longitude: 86.8528,
    },
  });

  // Seed Tour Guides
  const tourGuide = await prisma.tourGuide.create({
    data: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '+123456789',
      language: ['English', 'Spanish'],
      expertise: ['Mountaineering', 'Trekking'],
      rating: 4.8,
      profileImage: 'https://example.com/john.jpg',
      bio: 'An experienced guide with over 10 years of trekking expertise.',
      documents: ['https://example.com/certificate.jpg'],
    },
  });

  // Seed Tour
  const tour = await prisma.tour.create({
    data: {
      title: 'Everest Base Camp Trek',
      slug: 'everest-base-camp-trek',
      description: 'An adventurous trek to the Everest Base Camp.',
      highlights: ['Amazing views', 'Thrilling experience', 'Professional guides'],
      duration: 14,
      maxGroupSize: 15,
      minAge: 12,
      difficulty: 'CHALLENGING',
      destinationId: destination.id,
      categoryId: category.id,
      basePrice: 1500.0,
      images: ['https://example.com/everest-tour1.jpg', 'https://example.com/everest-tour2.jpg'],
      itinerary: [
        { day: 1, description: 'Arrival in Kathmandu' },
        { day: 2, description: 'Fly to Lukla and trek to Phakding' },
      ],
      included: ['Guides', 'Accommodation', 'Meals'],
      excluded: ['Travel insurance', 'International airfare'],
      cancellationPolicy: 'Full refund if cancelled 30 days before departure.',
      tourGuides: {
        connect: { id: tourGuide.id },
      },
    },
  });

  // Seed Tour Schedule
  const tourSchedule = await prisma.tourSchedule.create({
    data: {
      tourId: tour.id,
      startDate: new Date('2025-01-01'),
      endDate: new Date('2025-01-15'),
      price: 1600.0,
      availableSeats: 10,
      guides: {
        connect: { id: tourGuide.id },
      },
      status: 'UPCOMING',
    },
  });

  // Seed Tour Booking
  const booking = await prisma.tourBooking.create({
    data: {
      bookingRef: 'BOOK12345',
      tourId: tour.id,
      scheduleId: tourSchedule.id,
      totalAmount: 1600.0,
      status: 'CONFIRMED',
      participants: [{ name: 'Alice', age: 25 }, { name: 'Bob', age: 28 }],
      contactInfo: { email: 'alice@example.com', phone: '+987654321' },
      paymentStatus: 'COMPLETED',
      paymentDetails: {
        transactionId: 'PAY12345',
        method: 'Credit Card',
        amount: 1600.0,
      },
    },
  });

  // Seed Tour Review
  await prisma.tourReview.create({
    data: {
      tourId: tour.id,
      bookingId: booking.id,
      rating: 5.0,
      review: 'Amazing experience! Highly recommended.',
      images: ['https://example.com/review1.jpg'],
      isVerified: true,
    },
  });

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
