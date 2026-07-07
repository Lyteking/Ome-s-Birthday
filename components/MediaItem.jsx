'use client';

import { useRef, useEffect } from 'react';
import styles from './MediaItem.module.css';

export default function MediaItem({ type, src, alt = 'Memory', rotation, index = 0 }) {
  const videoRef = useRef(null);

  const autoRotations = ['-6deg', '4deg', '-3deg', '7deg', '-5deg', '3deg', '-8deg', '5deg', '-2deg', '6deg'];
  const finalRotation = rotation ?? autoRotations[index % autoRotations.length];

  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;

    vid.muted = true;
    vid.loop = true;
    vid.playsInline = true;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            vid.play().catch(() => {});
          } else {
            vid.pause();
          }
        });
      },
      { threshold: 0.25 }
    );

    observer.observe(vid);

    return () => {
      observer.disconnect();
      vid.pause();
    };
  }, []);

  return (
    <div
      className={styles.mediaWrapper}
      style={{
        '--rotation': finalRotation,
        '--ml': index % 2 === 0 ? '16px' : 'auto',
        '--mr': index % 2 === 0 ? 'auto' : '16px',
      }}
    >
      <div className={styles.polaroid}>
        {type === 'video' ? (
          <video
            ref={videoRef}
            src={src}
            className={styles.media}
            muted
            loop
            playsInline
            disablePictureInPicture
            controlsList="nodownload nofullscreen noremoteplayback"
            onContextMenu={(e) => e.preventDefault()}
          />
        ) : (
          <img src={src} alt={alt} className={styles.media} draggable={false} />
        )}
        <div className={styles.polaroidCaption}>
          <span className={styles.heartDot}>♥</span>
        </div>
      </div>
    </div>
  );
    }
