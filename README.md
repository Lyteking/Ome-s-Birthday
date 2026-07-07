# 💖 Bubu's Birthday Website

A beautiful birthday site for Bubu, built with Next.js.

---

## Setup

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

---

## Adding your media files

Put all media files inside the `/public/media/` folder:

### Bubu's photo (hero section)
| File | Description |
|------|-------------|
| `public/media/bubu.jpg` | Bubu's portrait photo (displayed in the circular frame) |

### Gallery videos
| File |
|------|
| `public/media/vid1.mp4` |
| `public/media/vid2.mp4` |
| `public/media/vid3.mp4` |
| `public/media/vid4.mp4` |
| `public/media/vid5.mp4` |
| `public/media/vid6.mp4` |
| `public/media/vid7.mp4` |
| `public/media/vid8.mp4` |
| `public/media/vid9.mp4` |
| `public/media/vid10.mp4` |

### Gallery images
| File |
|------|
| `public/media/pic1.jpg` |
| `public/media/pic2.jpg` |
| `public/media/pic3.jpg` |
| `public/media/pic4.jpg` |
| `public/media/pic5.jpg` |

### Gift video (revealed when the gift box is clicked)
| File | Description |
|------|-------------|
| `public/media/gift.mp4` | The gift reveal video |

---

## Adding more gallery items

Open `app/page.jsx` and add more entries to the `GALLERY_ITEMS` array:

```js
const GALLERY_ITEMS = [
  { type: 'video', src: '/media/vid1.mp4' },
  { type: 'image', src: '/media/pic1.jpg', alt: 'Memory 1' },
  // ← add more here, as many as you want!
  { type: 'video', src: '/media/vid11.mp4' },
  { type: 'image', src: '/media/pic6.jpg', alt: 'Memory 6' },
];
```

The `MediaItem` component handles both videos and images automatically — no other changes needed.

---

## Customising the message

The heartfelt message is in `app/page.jsx` inside the `<div className={styles.cardBody}>` block.
Just edit the `<p>` tags to change the letter.

---

## Notes on videos
- All gallery videos play automatically, are muted, looped, and cannot be paused or fullscreened.
- The gift video also autoplays when the modal opens.
- Native video controls are hidden via CSS globally.
