# 💍 Master Wedding Invitation — Customization Guide

This is your master template. All original animations and sections remain 100% intact:
- ✨ **Temple Doors Opening Animation**
- 📜 **Family Introduction & Mantra**
- 👫 **Meet the Couple**
- 🖼️ **Photo Gallery (4 moments)**
- 🌸 **Parallax Quote Banner**
- 📖 **Our Story Milestones**
- 🗓️ **Events / Schedule**
- 🗺️ **Venue & Google Maps**
- 💌 **Blessings Wall**
- 🎵 **Ambient Background Music**

---

## ⚡ The 2 Places to Change Stuff for Any Client:

1. 📝 **`src/wedding.config.ts`** — Change all names, dates, parents, venue, events, story, quotes & music.
2. 🖼️ **`public/client-images/`** — Drop your client's photos here with the matching filenames.

---

## 🖼️ 1. How to Replace Pictures & Music

Open the folder **`public/client-images/`** and replace the images with your client's photos:

| File Name | Section | Recommended Size / Aspect Ratio |
| :--- | :--- | :--- |
| **`bride.jpg`** | "Meet the couple" Bride portrait | Vertical / Portrait (4:5) |
| **`groom.jpg`** | "Meet the couple" Groom portrait | Vertical / Portrait (4:5) |
| **`banner.jpg`** | Parallax quote banner across the page | Widescreen Landscape |
| **`gallery-1.jpg`** | Our Gallery (Top Left Tall) | Vertical / Portrait |
| **`gallery-2.jpg`** | Our Gallery (Top Right) | Square or Landscape |
| **`gallery-3.jpg`** | Our Gallery (Middle Right) | Square or Landscape |
| **`gallery-4.jpg`** | Our Gallery (Bottom Wide) | Horizontal / Widescreen |
| **`story-1.jpg`** | Our Story #1 (e.g. 2019) | Landscape (4:3) |
| **`story-2.jpg`** | Our Story #2 (e.g. 2022) | Landscape (4:3) |
| **`story-3.jpg`** | Our Story #3 (e.g. 2026) | Landscape (4:3) |
| **`story-4.jpg`** | Our Story #4 (e.g. 2027) | Landscape (4:3) |
| **`music.mp3`** | Ambient background audio track | MP3 audio |

---

## 📝 2. How to Change Names, Dates, Maps & Text

Open **`src/wedding.config.ts`**. It is cleanly organized into 9 sections:

### 1. Couple & Parents:
```ts
couple: {
  bride: 'Aarthi',
  groom: 'Nikhil',
  hashtag: '#AarthiWedsNikhil',
  brideRole: 'The bride',
  brideParentsNote: 'Daughter of Mr. & Mrs. Raghavan, Madurai.',
  groomRole: 'The groom',
  groomParentsNote: 'Son of Mr. & Mrs. Sundaram, Chennai.',
}
```

### 2. Dates & Muhurtham:
```ts
date: {
  label: 'Sunday, 14 February 2027',
  short: '14 . 02 . 2027',
  muhurtham: 'Muhurtham at 9:45 AM',
}
```

### 3. Venue & Google Maps:
```ts
venue: {
  name: 'Sri Kalyana Mandapam',
  city: 'Madurai, Tamil Nadu',
  cityName: 'Madurai', // Updates "Join us in [City]"
  description: 'Follow the golden path to Sri Kalyana Mandapam...',
  mapsSearchUrl: 'https://www.google.com/maps/...',
  mapsEmbedUrl: 'https://www.google.com/maps?...',
}
```

### 4. Parallax Banner Quote:
```ts
banner: {
  image: '/client-images/banner.jpg',
  quote: 'Two families, one thread, and a morning we’ll remember for the rest of our lives.',
}
```

### 5. Events List:
Add, edit, or remove any celebrations in the `events: [...]` array.

### 6. Our Story Milestones:
Add, edit, or remove timeline years, titles, and stories in the `story: [...]` array.

---

## 🚀 3. How to Duplicate for a New Client

```powershell
1. Copy the `vows-on-canvas` folder
2. Rename the new folder to your client's name (e.g. `Client weds Client`)
3. Open `src/wedding.config.ts` in the new folder and enter their details
4. Drop their photos into `public/client-images/`
5. Open terminal in the new folder and run `vercel --prod`
```
