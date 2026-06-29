import { type CSSProperties } from 'react';
import styles from './styles.module.css';
import { CONTACT_PAGE_DATA, getGmailComposeUrl } from './data';
import { useInView } from '../../hooks/useInView';

export default function ContactUs() {
  const { ref: heroRef, visible: heroVisible } = useInView<HTMLDivElement>();
  const { ref: cardsRef, visible: cardsVisible } = useInView<HTMLDivElement>();

  const delay = (ms: number): CSSProperties => ({ '--delay': `${ms}ms` } as CSSProperties);

  return (
    <div className={styles.page}>
      <div className={styles.orbOne} aria-hidden="true" />
      <div className={styles.orbTwo} aria-hidden="true" />

      <div className={styles.inner}>
        <section
          ref={heroRef}
          className={`${styles.hero} ${styles.reveal} ${heroVisible ? styles.inView : ''}`}
        >
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>{CONTACT_PAGE_DATA.eyebrow}</p>
            <h1 className={styles.title}>{CONTACT_PAGE_DATA.title}</h1>
            <p className={styles.subtitle}>{CONTACT_PAGE_DATA.subtitle}</p>
          </div>

          <div className={`${styles.heroPanel} glass-panel`}>
            <span className={`material-symbols-outlined ${styles.heroIcon}`}>alternate_email</span>
            <p className={styles.panelLabel}>{CONTACT_PAGE_DATA.primaryEmailLabel}</p>
            <a
              href={getGmailComposeUrl(CONTACT_PAGE_DATA.primaryEmail)}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.panelEmail}
            >
              {CONTACT_PAGE_DATA.primaryEmail}
            </a>
            <p className={styles.panelText}>{CONTACT_PAGE_DATA.primaryEmailNote}</p>
          </div>
        </section>

        <section ref={cardsRef} className={styles.teamGrid} aria-label="Developer contacts">
          {CONTACT_PAGE_DATA.developers.map((developer, index) => (
            <article
              key={developer.email}
              className={`${styles.devCard} glow-card ${styles.revealScale} ${cardsVisible ? styles.inView : ''}`}
              style={delay(index * 140)}
            >
              <div className={styles.photoFrame}>
                <img src={developer.image} alt={developer.imageAlt} className={styles.devPhoto} />
              </div>

              <div className={styles.devContent}>
                <div>
                  <p className={styles.devRole}>{developer.role}</p>
                  <h2 className={styles.devName}>{developer.name}</h2>
                </div>

                <div className={styles.contactStack}>
                  <a
                    href={getGmailComposeUrl(developer.email)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.contactItem}
                  >
                    <span className="material-symbols-outlined">mail</span>
                    {developer.email}
                  </a>
                  <a
                    href={developer.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.contactItem}
                  >
                    <span className="material-symbols-outlined">work</span>
                    LinkedIn profile
                  </a>
                  <a href={`tel:${developer.phone.replace(/\s/g, '')}`} className={styles.contactItem}>
                    <span className="material-symbols-outlined">call</span>
                    {developer.phone}
                  </a>
                </div>
              </div>
            </article>
          ))}
        </section>
      </div>
    </div>
  );
}
