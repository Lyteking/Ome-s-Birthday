'use client';

import { useState, useEffect, useRef } from 'react';
import MediaItem from '@/components/MediaItem';
import styles from './page.module.css';

const GALLERY_ITEMS = [
  { type: 'image', src: '/media/img1.jpg', alt: 'Memory 1', align: 'left', rotation: -3 },
  { type: 'image', src: '/media/img2.jpg', alt: 'Memory 2', align: 'right', rotation: 2 },
  { type: 'image', src: '/media/img3.jpg', alt: 'Memory 3', align: 'left', rotation: -1 },
  { type: 'image', src: '/media/img4.jpg', alt: 'Memory 4', align: 'right', rotation: 1 },
  { type: 'image', src: '/media/img5.jpg', alt: 'Memory 5', align: 'left', rotation: -2 },
  { type: 'image', src: '/media/img6.jpg', alt: 'Memory 6', align: 'right', rotation: 3 },
];

const HEARTS = Array.from({ length: 28 }, (_, i) => ({
  id: i,
  size: Math.random() * 18 + 8,
  left: Math.random() * 100,
  top: Math.random() * 100,
  delay: Math.random() * 5,
  duration: Math.random() * 4 + 3,
  shape: ['♥', '♡', '❤', '💕', '💗'][Math.floor(Math.random() * 5)],
  opacity: Math.random() * 0.15 + 0.04,
}));

const REASONS_TO_LOVE = [
  { id: 1, text: "The way your laughter completely lights up my entire world. 🌟", rotation: -2 },
  { id: 2, text: "In you, I found peace, love, joy, you’re the perfect representation of God’s love to me", rotation: 3 },
  { id: 3, text: "Your strength, how you carry us all with so much grace and love, Ome you are the best, I love you wholeheartedly 💖", rotation: -1 },
  { id: 4, text: "My Empress, Ome, the Queen of my heart, Happy birthday 🌹" , rotation: 2 }
];

export default function BirthdayPage() {
  const audioRef = useRef(null);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [letterOpen, setLetterOpen] = useState(false);

  // Game States
  const [gameModal, setGameModal] = useState(false);
  const [gameActive, setGameActive] = useState(false);
  const [gameDone, setGameDone] = useState(false);
  const [score, setScore] = useState(0);
  const [finalScore, setFinalScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [hearts, setHearts] = useState([]);
  const gameAreaRef = useRef(null);
  const heartIdRef = useRef(0);
  const spawnRef = useRef(null);
  const timerRef = useRef(null);

  // Cake States
  const [cakeBlown, setCakeBlown] = useState(false);
  const [cakePasswordOpen, setCakePasswordOpen] = useState(false);
  const [wishCardOpen, setWishCardOpen] = useState(false);
  const [cakeAnswer, setCakeAnswer] = useState('');
  const [cakeError, setCakeError] = useState(false);
  const [userWishText, setUserWishText] = useState('');

  // Hero interactive elements
  const [heroHearts, setHeroHearts] = useState([]);

  const toggleAudio = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audioPlaying) {
      audio.pause();
      setAudioPlaying(false);
    } else {
      audio.play().catch(() => {});
      setAudioPlaying(true);
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const tryPlay = () => {
      audio.play().then(() => setAudioPlaying(true)).catch(() => {});
    };
    setTimeout(tryPlay, 800);
  }, []);

  const spawnHeroHeartAnimation = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const newH = {
      id: Date.now() + Math.random(),
      x,
      y,
      shape: ['❤️', '💖', '✨', '🌸', '💕'][Math.floor(Math.random() * 5)]
    };
    setHeroHearts((prev) => [...prev, newH]);
    setTimeout(() => {
      setHeroHearts((prev) => prev.filter((h) => h.id !== newH.id));
    }, 1200);
  };

  const clickHeart = (id) => {
    setHearts((prev) => prev.filter((h) => h.id !== id));
    setScore((s) => s + 1);
  };

  const spawnHeart = (currentScore) => {
    const shapes = ['❤️', '💕', '💗', '💓', '💖', '🩷'];
    const id = heartIdRef.current++;
    const newHeart = {
      id,
      x: Math.random() * 85,
      y: Math.random() * 80,
      size: Math.random() * 20 + 24,
      shape: shapes[Math.floor(Math.random() * shapes.length)],
    };
    setHearts((prev) => [...prev, newHeart]);
    const lifetime = Math.max(600, 1800 - currentScore * 25);
    setTimeout(() => {
      setHearts((prev) => prev.filter((h) => h.id !== id));
    }, lifetime);
  };

  useEffect(() => {
    if (!gameActive) return;
    setScore(0);
    setHearts([]);
    setTimeLeft(30);
    heartIdRef.current = 0;

    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          clearTimeout(spawnRef.current);
          setGameActive(false);
          setGameDone(true);
          setHearts([]);
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    let spawnDelay = 800;
    const scheduleSpawn = () => {
      spawnRef.current = setTimeout(() => {
        setScore((currentScore) => {
          spawnHeart(currentScore);
          spawnDelay = Math.max(200, 800 - Math.floor(currentScore / 5) * 80);
          return currentScore;
        });
        scheduleSpawn();
      }, spawnDelay);
    };
    scheduleSpawn();

    return () => {
      clearInterval(timerRef.current);
      clearTimeout(spawnRef.current);
    };
  }, [gameActive]);

  useEffect(() => {
    if (gameDone) setFinalScore(score);
  }, [gameDone]);

  const checkCakeAnswer = () => {
    if (cakeAnswer.trim().toLowerCase() === 'blue') {
      setCakePasswordOpen(false);
      setCakeBlown(true);
      setCakeAnswer('');
      setCakeError(false);
      setTimeout(() => setWishCardOpen(true), 800);
    } else {
      setCakeError(true);
    }
  };

  const handleSaveAndDownloadWishImage = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 520;
    const ctx = canvas.getContext('2d');

    const bannerGrad = ctx.createLinearGradient(0, 0, 600, 0);
    bannerGrad.addColorStop(0, '#7a1f3d');
    bannerGrad.addColorStop(0.6, '#9e3557');
    bannerGrad.addColorStop(1, '#c94e6a');
    ctx.fillStyle = bannerGrad;
    ctx.fillRect(0, 0, 600, 80);

    ctx.fillStyle = '#f5e0b5';
    ctx.font = 'italic 24px Georgia';
    ctx.fillText('💌  Ome\'s Birthday Wish Card', 40, 48);

    ctx.fillStyle = '#fffdf9';
    ctx.fillRect(0, 80, 600, 440);

    ctx.strokeStyle = 'rgba(232, 116, 138, 0.15)';
    ctx.lineWidth = 1;
    for (let y = 110; y < 460; y += 32) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(600, y);
      ctx.stroke();
    }

    ctx.strokeStyle = 'rgba(232, 116, 138, 0.4)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(52, 80);
    ctx.lineTo(52, 520);
    ctx.stroke();

    ctx.fillStyle = '#3d1a27';
    ctx.font = '20px Georgia';
    const textContent = userWishText.trim() || "I wish for infinite beautiful days filled with love and laughter...";
    
    const words = textContent.split(' ');
    let line = '';
    let currentY = 142;
    const maxWidth = 500;
    const marginLeft = 74;

    for (let n = 0; n < words.length; n++) {
      let testLine = line + words[n] + ' ';
      let metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && n > 0) {
        ctx.fillText(line, marginLeft, currentY);
        line = words[n] + ' ';
        currentY += 32;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, marginLeft, currentY);

    ctx.fillStyle = '#7a1f3d';
    ctx.font = 'italic 18px Georgia';
    ctx.fillText('— with all my love, Your Ife 🌹', 320, 470);

    const link = document.createElement('a');
    link.download = `Ome_Birthday_Wish.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    setWishCardOpen(false);
  };

  return (
    <main className={styles.main}>
      <audio ref={audioRef} src="/media/song.mp3" loop />

      <div className={styles.heartsLayer} aria-hidden="true">
        {HEARTS.map((h) => (
          <span
            key={h.id}
            className={styles.floatingHeart}
            style={{
              fontSize: `${h.size}px`,
              left: `${h.left}%`,
              top: `${h.top}%`,
              opacity: h.opacity,
              animationDelay: `${h.delay}s`,
              animationDuration: `${h.duration}s`,
            }}
          >
            {h.shape}
          </span>
        ))}
      </div>

      <button
        className={`${styles.musicBtn} ${audioPlaying ? styles.musicBtnPlaying : ''}`}
        onClick={toggleAudio}
        aria-label={audioPlaying ? 'Pause music' : 'Play music'}
      >
        <span className={styles.musicIcon}>{audioPlaying ? '🎵' : '🎶'}</span>
        <span className={styles.musicLabel}>{audioPlaying ? 'MUTED' : 'PLAY'}</span>
      </button>

      {/* ── SECTION 1: Hero Section ── */}
      <section className={styles.hero} onClick={spawnHeroHeartAnimation}>
        <div className={styles.heroFrame}>
          {heroHearts.map((hh) => (
            <span
              key={hh.id}
              className={styles.heroBurstHeart}
              style={{ left: `${hh.x}px`, top: `${hh.y}px` }}
            >
              {hh.shape}
            </span>
          ))}
          
          <h1 className={styles.heroTitle}>
            <span className={styles.happyText}>Happy Birthday,</span> <br />
            <span className={styles.bubuWord}>Ome ✨</span>
          </h1>
          
          <p className={styles.heroTapHint}>✨ tap anywhere for love sparkle effects ✨</p>
          
          <div className={styles.aestheticPhotoContainer}>
            <div className={styles.photoFrame}>
              <div className={styles.photoInner}>
                <img
                  src="/media/ese.jpg"
                  alt="My Ome"
                  className={styles.photo}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div className={styles.photoPlaceholderOriginal}>
                  <span>🌸</span>
                  <p>Place Ome&apos;s photo as<br /><code>/public/media/bubu.jpg</code></p>
                </div>
              </div>
              <div className={styles.photoRing} />
              <div className={styles.photoRing2} />
            </div>
            
            <div className={styles.balloonsWrap} aria-hidden="true">
              <div className={`${styles.balloon} ${styles.balloonLeft}`}>
                <svg viewBox="0 0 60 80" xmlns="http://www.w3.org/2000/svg" className={styles.balloonSvg}>
                  <ellipse cx="30" cy="30" rx="26" ry="30" fill="#e8748a" opacity="0.95"/>
                  <ellipse cx="22" cy="18" rx="8" ry="6" fill="rgba(255,255,255,0.4)"/>
                  <polygon points="27,59 30,68 33,59" fill="#e8748a"/>
                  <line x1="30" y1="68" x2="30" y2="130" stroke="#c94e6a" strokeWidth="1.5" strokeDasharray="4 2"/>
                </svg>
                <span className={styles.balloonTag}>💖</span>
              </div>
              <div className={`${styles.balloon} ${styles.balloonRight}`}>
                <svg viewBox="0 0 60 80" xmlns="http://www.w3.org/2000/svg" className={styles.balloonSvg}>
                  <ellipse cx="30" cy="30" rx="26" ry="30" fill="#f0b4bf" opacity="0.95"/>
                  <ellipse cx="22" cy="18" rx="8" ry="6" fill="rgba(255,255,255,0.4)"/>
                  <polygon points="27,59 30,68 33,59" fill="#f0b4bf"/>
                  <line x1="30" y1="68" x2="30" y2="130" stroke="#b8873a" strokeWidth="1.5" strokeDasharray="4 2"/>
                </svg>
                <span className={styles.balloonTag}>🎀</span>
              </div>
            </div>
          </div>

          <div className={styles.dateLabel}>Birthday: 7th of July 🌸</div>
          <p className={styles.heroSignature}>Lovingly curated by Your Ife ❤️</p>
        </div>
      </section>

      {/* ── SECTION 2: Envelope Section ── */}
      <section className={styles.letterSection}>
        <div className={styles.sectionDivider}>
          <span>01</span>
          <hr />
          <span>THE LETTER</span>
        </div>
        
        <div className={styles.envelopeWrap}>
          <button
            className={styles.envelope}
            onClick={() => setLetterOpen(true)}
            aria-label="Open letter"
          >
            <span className={styles.envFlap} />
            <span className={styles.envBody}>
              <span className={styles.envHeart}>💝</span>
              <span className={styles.envLabel}>Tap to open letter</span>
            </span>
          </button>
        </div>
      </section>

      {/* ── Envelope Letter Modal ── */}
      {letterOpen && (
        <div
          className={styles.letterModalBackdrop}
          onClick={(e) => { if (e.target === e.currentTarget) setLetterOpen(false); }}
        >
          <div className={styles.letterModal}>
            <button
              className={styles.letterModalClose}
              onClick={() => setLetterOpen(false)}
              aria-label="Close"
            >
              ×
            </button>

            <div className={styles.messageCard}>
              <div className={styles.paperLines} aria-hidden="true">
                {Array.from({ length: 22 }).map((_, i) => (
                  <div key={i} className={styles.paperLine} />
                ))}
              </div>

              <div className={styles.cardTop}>
                <span className={styles.cardHeartDeco}>💌</span>
                <h2 className={styles.cardTitle}>A letter for you, my love</h2>
              </div>

              <div className={styles.cardBody}>
                <p>Letter to the Queen of my heart.</p>
                <p>
                  Adun aye mi. The one who gave my life sweetness. It has been such a beauty doing life with you and I will choose to do life with you over and over again. Thank you for all you do for me and Zoe. Thank you for always being there anytime and everytime. We do not take you for granted at all. 
On this day that you have added a year to your age, I pray the blessings of God upon you. Wisdom for exploit and greatness.
                </p>
                <p className={styles.cardSign}>
                  Happy birthday to you OME! <br/>I love you so much. 🌹
                </p>
              </div>

              <div className={styles.cardSeal}>💝</div>
            </div>
          </div>
        </div>
      )}

      {/* ── SECTION 3: Album Section (Staggered Polaroid Layout Restored) ── */}
      <section className={styles.albumSection}>
        <div className={styles.sectionDivider}>
          <span>02</span>
          <hr />
          <span>THE ALBUM</span>
        </div>
        <h2 className={styles.albumHeading}>Prized Moments</h2>
        
        <div className={styles.screenshotGalleryContainer}>
          {GALLERY_ITEMS.map((item, i) => (
            <div 
              key={i} 
              className={`${styles.screenshotWrapper} ${styles[item.align]}`}
              style={{ '--rotation': `${item.rotation}deg` }}
            >
              <div className={styles.polaroidCard}>
                <span className={styles.polaroidRibbon}>🎀</span>
                <div className={styles.polaroidImageArea}>
                  <MediaItem type={item.type} src={item.src} alt={item.alt} />
                </div>
                <div className={styles.polaroidCaption}>
                  <span className={styles.polaroidHeart}>♥</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── SECTION 4: Notes Grid ── */}
      <section className={styles.loveNotesSection}>
        <div className={styles.sectionDivider}>
          <span>03</span>
          <hr />
          <span>LOVE LANGUAGE</span>
        </div>
        <h2 className={styles.notesHeading}>Little Reminders ✨</h2>
        <div className={styles.notesGrid}>
          {REASONS_TO_LOVE.map((note) => (
            <div 
              key={note.id} 
              className={styles.loveNoteCard}
              style={{ transform: `rotate(${note.rotation}deg)` }}
            >
              <span className={styles.tape} />
              <p>{note.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── SECTION 5: Activities Grid ── */}
      <section className={styles.activitiesSection}>
        <div className={styles.sectionDivider}>
          <span>04</span>
          <hr />
          <span>INTERACTIVES</span>
        </div>

        <div className={styles.whiteActivityGrid}>
          {/* Cake Block */}
          <div className={styles.minimalBlock}>
            <h3>Make a wish, Ome 🎂</h3>
            <div className={styles.cakeWrap}>
              {!cakeBlown && (
                <div className={styles.flameWrap}>
                  <div className={styles.flameOuter} />
                  <div className={styles.flameInner} />
                </div>
              )}
              <div className={styles.candle}>
                {cakeBlown && <span className={styles.candleSmoke} />}
              </div>
              <svg viewBox="0 0 200 120" className={styles.cakeSvg} xmlns="http://www.w3.org/2000/svg">
                <rect x="10" y="70" width="180" height="50" rx="8" fill="#f5a0b5"/>
                <rect x="10" y="70" width="180" height="14" rx="4" fill="#f7bac8"/>
                {[25,50,75,100,125,150,170].map((x, i) => (
                  <ellipse key={i} cx={x} cy="70" rx="7" ry="5" fill="white" opacity="0.85"/>
                ))}
                <rect x="45" y="35" width="110" height="40" rx="8" fill="#e8748a"/>
                <rect x="45" y="35" width="110" height="12" rx="4" fill="#f0a0b8"/>
                {[58,80,102,124,142].map((x, i) => (
                  <ellipse key={i} cx={x} cy="35" rx="6" ry="4" fill="white" opacity="0.85"/>
                ))}
                <circle cx="50" cy="90" r="5" fill="#d4a85a"/>
                <circle cx="100" cy="95" r="5" fill="#d4a85a"/>
                <circle cx="150" cy="90" r="5" fill="#d4a85a"/>
                <text x="100" y="60" textAnchor="middle" fontSize="11" fill="white" fontFamily="Georgia" fontStyle="italic">Happy Birthday</text>
                <ellipse cx="100" cy="120" rx="100" ry="8" fill="#f5c6d0" opacity="0.5"/>
              </svg>
            </div>
            {!cakeBlown ? (
              <button className={styles.actionBtn} onClick={() => setCakePasswordOpen(true)}>
                🌬️ Blow it out
              </button>
            ) : (
              <button className={styles.actionBtn} onClick={() => setWishCardOpen(true)}>
                🌟 View Wish Card
              </button>
            )}
          </div>

          {/* Game Block */}
          <div className={styles.minimalBlock}>
            <h3>Heart Collector 🎮</h3>
            <p className={styles.blockDesc}>Prove how much you love me 💕</p>
            <button className={styles.actionBtn} onClick={() => { setGameModal(true); setGameActive(true); }}>
              Start Game
            </button>
          </div>
        </div>
      </section>

      {/* Cake Password Modal */}
      {cakePasswordOpen && (
        <div className={styles.modalBackdrop} onClick={() => setCakePasswordOpen(false)}>
          <div className={styles.cleanPromptModal} onClick={(e) => e.stopPropagation()}>
            <h3>🔐 Before you blow…</h3>
            <p className={styles.cakeQuestionText}>Color of the dress she wore on our first official dinner together</p>
            <input
              className={cakeError ? styles.inputError : ''}
              type="text"
              placeholder="Enter the color…"
              value={cakeAnswer}
              onChange={(e) => { setCakeAnswer(e.target.value); setCakeError(false); }}
              onKeyDown={(e) => e.key === 'Enter' && checkCakeAnswer()}
            />
            {cakeError && <p className={styles.errorMsg}>That&apos;s not right, try again 💔</p>}
            <button className={styles.submitBtn} onClick={checkCakeAnswer}>Submit 💕</button>
          </div>
        </div>
      )}

      {/* Wish Card Modal */}
      {wishCardOpen && (
        <div className={styles.modalBackdrop} onClick={() => setWishCardOpen(false)}>
          <div className={styles.letterModal} onClick={(e) => e.stopPropagation()}>
            <button className={styles.letterModalClose} onClick={() => setWishCardOpen(false)}>✕</button>
            <div className={styles.messageCard}>
              <div className={styles.paperLines} aria-hidden="true">
                {Array.from({ length: 14 }).map((_, i) => (
                  <div key={i} className={styles.paperLine} />
                ))}
              </div>

              <div className={styles.cardTop}>
                <span className={styles.cardHeartDeco}>✨</span>
                <h2 className={styles.cardTitle}>Make Your Wish</h2>
              </div>

              <div className={styles.cardBody}>
                <p className={styles.wishCardInstruction}>
                  Write your wish below, then tap Save Wish to save it directly into your phone photos! 💖
                </p>
                <textarea
                  className={styles.wishTextareaSheet}
                  placeholder="I wish for..."
                  rows={4}
                  value={userWishText}
                  onChange={(e) => setUserWishText(e.target.value)}
                />
                <p className={styles.cardSign} style={{ textAlign: 'right' }}>— with all my love, Your Ife 🌹</p>
              </div>

              <div style={{ padding: '0 44px 30px' }}>
                <button className={styles.submitBtn} onClick={handleSaveAndDownloadWishImage}>
                  Save Wish 💾
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Game Modal */}
      {gameModal && (
        <div className={styles.modalBackdrop}>
          <div className={styles.gameWindow} onClick={(e) => e.stopPropagation()}>
            <p className={styles.gameInstruction}>Click as many hearts as possible before time runs out 💖</p>
            {gameActive && (
              <>
                <div className={styles.gameHeader}>
                  <span>SCORE: {score}</span>
                  <span>⏱ {timeLeft}s</span>
                </div>
                <div className={styles.cleanGameArea} ref={gameAreaRef}>
                  {hearts.map((h) => (
                    <button
                      key={h.id}
                      className={styles.catchingHeart}
                      style={{ left: `${h.x}%`, top: `${h.y}%`, fontSize: `${h.size}px` }}
                      onClick={() => clickHeart(h.id)}
                    >
                      {h.shape}
                    </button>
                  ))}
                </div>
              </>
            )}
            {gameDone && (
              <div className={styles.gameFinished}>
                <p style={{ fontSize: '3rem' }}>💔</p>
                <h3 className={styles.finalScoreLabel}>You scored {finalScore}</h3>
                <p style={{ fontStyle: 'italic', color: '#a69194', marginBottom: '20px' }}>so your love is limited uh? It is well.</p>
                <div className={styles.btnRow}>
                  <button className={styles.submitBtn} onClick={() => { setGameDone(false); setGameActive(true); }}>Try again 💪</button>
                  <button className={styles.secondaryBtn} onClick={() => setGameModal(false)}>Give up 😞</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}