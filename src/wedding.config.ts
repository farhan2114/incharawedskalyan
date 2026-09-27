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
    bride: 'Inchara N Shetty',
    groom: 'Kalyan Kumar Reddy',
    hashtag: '#IncharaWedsKalyan',

    brideRole: 'The bride',
    brideParentsNote: 'Daughter of Sri Naveen Kumar & Smt. Mallika (Late).',
    bridePhoto: '/client-images/bride.jpg',
    bridePhotoAlt: 'Inchara N Shetty, the bride',

    groomRole: 'The groom',
    groomParentsNote: 'Son of Sri Devireddy Gangireddy & Smt. Nagalakshmi.',
    groomPhoto: '/client-images/groom.jpg',
    groomPhotoAlt: 'Kalyan Kumar Reddy, the groom',
  },

  // -------------------------------------------------------------
  // 2. DATES & CEREMONY TIME
  // -------------------------------------------------------------
  date: {
    label: 'Friday, 30 October 2026',
    short: '30 . 10 . 2026',
    muhurtham: 'Muhurtham at 10:00 AM',
    targetIso: '2026-10-30T10:00:00+05:30',
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
    name: 'ANASUYA - Where Celebrations Meet the Shore',
    city: 'Kapu, Karnataka',
    cityName: 'Kapu', // Shows in "Join us in [City]"
    locationUnderMap: 'Kapu · Karnataka · 30 . 10 . 2026', // Text displayed directly under the map frame
    description: 'Follow the coastal road to ANASUYA, where celebrations meet the shore and our families will be waiting to welcome you.',
    
    // Direct link when clicking "Open in maps" (leave empty to auto-generate from venue + city)
    mapsSearchUrl: 'https://maps.app.goo.gl/pbMTxqMfVejvqKmq8',
    
    // Interactive Google Maps iframe URL
    mapsEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3884.186157662472!2d74.74074567542118!3d13.213626257529466!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bbcb100573b99c7%3A0x1711fa25cb9e72a8!2sANASUYA%20-%20where%20celebrations%20meet%20the%20shore!5e0!3m2!1sen!2sin!4v1790508398407!5m2!1sen!2sin',
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
      alt: 'Moments of celebration',
    },
    {
      image: '/client-images/gallery-2.jpg',
      alt: 'Together in joy',
    },
  ],

  // -------------------------------------------------------------
  // 7. OUR STORY (MILESTONES)
  // -------------------------------------------------------------
  story: [],

  // -------------------------------------------------------------
  // 8. ORDER OF CELEBRATIONS / EVENTS (First 3 events, no reception)
  // -------------------------------------------------------------
  events: [
    {
      name: 'Nichayathartham',
      day: 'Thursday, 29 Oct',
      time: '6:00 PM',
      place: 'Family Home, Kapu',
      note: 'Engagement, followed by dinner',
    },
    {
      name: 'Mehndi & Sangeet',
      day: 'Thursday, 29 Oct',
      time: '8:00 PM',
      place: 'Celebration Lawns, Kapu',
      note: 'Henna, music and a lot of dancing',
    },
    {
      name: 'Muhurtham',
      day: 'Friday, 30 Oct',
      time: '10:00 AM',
      place: 'ANASUYA, Kapu',
      note: 'The auspicious wedding ceremony',
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
