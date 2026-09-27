/**
 * =======================================================================
 * 💍 WEDDING INVITATION — MASTER CLIENT CONFIGURATION FILE
 * =======================================================================
 * To customize this website for any client, EDIT THIS FILE ONLY!
 * 
 * 1. Replace photos in `public/client-images/` using the same names:
 *     - bride.jpg (Bride portrait)
 *     - groom.jpg (Groom portrait)
 *     - banner.jpg (Parallax quote banner)
 *     - gallery-1.jpg to gallery-4.jpg (Gallery moments)
 *     - story-1.jpg to story-4.jpg (Story milestones)
 *     - music.mp3 (Background music)
 * 
 * 2. Edit all names, dates, parents, events, and venue details below.
 * =======================================================================
 */

export const weddingConfig = {
  // -------------------------------------------------------------
  // 1. COUPLE & PARENTS INFORMATION
  // -------------------------------------------------------------
  couple: {
    bride: 'Inchara',
    groom: 'Kalyan',
    hashtag: '#IncharaWedsKalyan',

    brideRole: 'The bride',
    brideParentsNote: 'Daughter of Mr. & Mrs. [Parents Name], [City].',
    bridePhoto: '/client-images/bride.jpg',
    bridePhotoAlt: 'Inchara, the bride',

    groomRole: 'The groom',
    groomParentsNote: 'Son of Mr. & Mrs. [Parents Name], [City].',
    groomPhoto: '/client-images/groom.jpg',
    groomPhotoAlt: 'Kalyan, the groom',
  },

  // -------------------------------------------------------------
  // 2. DATES & CEREMONY TIME
  // -------------------------------------------------------------
  date: {
    label: 'Sunday, 14 February 2027',
    short: '14 . 02 . 2027',
    muhurtham: 'Muhurtham at 9:45 AM',
  },

  // -------------------------------------------------------------
  // 3. INVITATION MESSAGE & FAMILY HOSTS
  // -------------------------------------------------------------
  invitation: {
    sanskritMantra: 'Om Sri Ganeshaya Namaha',
    invitationLine: 'With the blessings of our families, we invite you to share in the joy of our wedding.',
    familyLine: `The Families of Inchara & Kalyan
warmly invite you to celebrate
the union of two hearts`,
    doorsButtonText: 'Tap to open the doors',
    doorsSubText: 'Music will play softly',
  },

  // -------------------------------------------------------------
  // 4. VENUE & GOOGLE MAPS LOCATION
  // -------------------------------------------------------------
  venue: {
    name: 'Sri Kalyana Mandapam',
    city: 'Madurai, Tamil Nadu',
    cityName: 'Madurai', // Shows in "Join us in [City]"
    locationUnderMap: 'Madurai · Tamil Nadu · 22 . 11 . 2026', // Text displayed directly under the map frame
    description: 'Follow the golden path to Sri Kalyana Mandapam, where our families will be waiting to welcome you.',
    
    // Direct link when clicking "Open in maps" (leave empty to auto-generate from venue + city)
    mapsSearchUrl: 'https://www.google.com/maps/search/Sri%20Kalyana%20Mandapam%20Madurai%2C%20Tamil%20Nadu',
    
    // Interactive Google Maps iframe URL
    mapsEmbedUrl: 'https://www.google.com/maps?q=Sri%20Kalyana%20Mandapam%20Madurai%2C%20Tamil%20Nadu&output=embed',
  },

  // -------------------------------------------------------------
  // 5. PARALLAX QUOTE BANNER
  // -------------------------------------------------------------
  banner: {
    image: '/client-images/banner.jpg',
    alt: 'The couple exchanging jasmine flowers',
    quote: 'Two families, one thread, and a morning we’ll remember for the rest of our lives.',
  },

  // -------------------------------------------------------------
  // 6. PHOTO GALLERY
  // -------------------------------------------------------------
  gallery: [
    {
      image: '/client-images/gallery-1.jpg',
      alt: 'The couple walking through a temple corridor',
    },
    {
      image: '/client-images/gallery-2.jpg',
      alt: 'The couple laughing together',
    },
    {
      image: '/client-images/gallery-3.jpg',
      alt: 'Hands with mehndi holding a jasmine garland',
    },
    {
      image: '/client-images/gallery-4.jpg',
      alt: 'The couple under a flower-decorated mandapam at dusk',
    },
  ],

  // -------------------------------------------------------------
  // 7. OUR STORY (MILESTONES)
  // -------------------------------------------------------------
  story: [
    {
      year: '2019',
      title: 'A crowded train',
      text: 'One shared seat from Chennai to Madurai, and a conversation that never really ended.',
      image: '/client-images/story-1.jpg',
      alt: 'Two cups of coffee beside a train window',
    },
    {
      year: '2022',
      title: 'Two cities',
      text: 'Long calls, longer letters, and a promise to meet halfway every single month.',
      image: '/client-images/story-2.jpg',
      alt: 'Handwritten letters tied with a maroon ribbon',
    },
    {
      year: '2026',
      title: 'The question',
      text: 'Asked on a terrace under jasmine lights, answered before the sentence finished.',
      image: '/client-images/story-3.jpg',
      alt: 'A jasmine-decorated terrace at dusk',
    },
    {
      year: '2027',
      title: 'The day',
      text: 'Surrounded by jasmine, bells, and everyone who brought us to this moment.',
      image: '/client-images/story-4.jpg',
      alt: 'Traditional wedding details',
    },
  ],

  // -------------------------------------------------------------
  // 8. ORDER OF CELEBRATIONS / EVENTS
  // -------------------------------------------------------------
  events: [
    {
      name: 'Nichayathartham',
      day: 'Friday, 12 Feb',
      time: '6:00 PM',
      place: 'Family Home, Madurai',
      note: 'Engagement, followed by dinner',
    },
    {
      name: 'Mehndi & Sangeet',
      day: 'Saturday, 13 Feb',
      time: '4:00 PM',
      place: 'Mandapam Lawns',
      note: 'Henna, music and a lot of dancing',
    },
    {
      name: 'Muhurtham',
      day: 'Sunday, 14 Feb',
      time: '9:45 AM',
      place: 'Sri Kalyana Mandapam',
      note: 'The wedding ceremony',
    },
    {
      name: 'Reception',
      day: 'Sunday, 14 Feb',
      time: '7:00 PM',
      place: 'Mandapam Hall',
      note: 'Dinner and celebrations',
    },
  ],

  // -------------------------------------------------------------
  // 9. BACKGROUND MUSIC
  // -------------------------------------------------------------
  music: {
    audioUrl: '/client-images/music.mp3',
  },

  // -------------------------------------------------------------
  // 10. RSVP & DATABASE (SUPABASE & GOOGLE SHEETS)
  // -------------------------------------------------------------
  rsvp: {
    enabled: true,
    // Supabase project credentials (paste client-specific Supabase credentials here)
    supabaseUrl: 'https://lyukxpzpcjedvrkwrcur.supabase.co',
    supabaseAnonKey: 'sb_publishable_7USKYo1sBAT7p3_kqWdrqg_RCxNm3yd',
    supabaseTable: 'rsvps',

    // Google Sheets Webhook URL (paste deployed Google Apps Script URL here)
    googleSheetWebhookUrl: 'https://script.google.com/macros/s/AKfycbwLV_52cSrJPWpsMfFJrY4xZ-3iCV8WPR5612i-v9qB_koaaX1u6QfOU3tq5fDLq1b-Mg/exec',
  },
};

// Backwards-compatible export for existing components
export const weddingData = {
  ...weddingConfig.couple,
  ...weddingConfig.date,
  dateLabel: weddingConfig.date.label,
  dateShort: weddingConfig.date.short,
  muhurtham: weddingConfig.date.muhurtham,
  venue: weddingConfig.venue.name,
  city: weddingConfig.venue.city,
  cityName: weddingConfig.venue.cityName,
  invitationLine: weddingConfig.invitation.invitationLine,
  familyLine: weddingConfig.invitation.familyLine,
  events: weddingConfig.events,
  story: weddingConfig.story,
  banner: weddingConfig.banner,
  gallery: weddingConfig.gallery,
};
