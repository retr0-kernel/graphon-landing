import { Link } from 'react-router-dom';
import { Compass, ArrowLeft } from 'lucide-react';
import styles from './styles.module.css';
import { ROUTES } from '../../config/routes';

export default function NotFound() {
  return (
    <div className={styles.page}>
      <div className={styles.orbOne} aria-hidden="true" />
      <div className={styles.orbTwo} aria-hidden="true" />

      <div className={styles.inner}>
        <div className={styles.code} aria-hidden="true">404</div>

        <div className={styles.copy}>
          <p className={styles.eyebrow}>Page not found</p>
          <h1 className={styles.title}>Lost in the graph</h1>
          <p className={styles.subtitle}>
            The route you're looking for doesn't exist or may have moved.
            Head back home and we'll point you in the right direction.
          </p>
        </div>

        <div className={styles.actions}>
          <Link to={ROUTES.home} className={styles.primaryBtn}>
            <ArrowLeft size={17} />
            Back to Home
          </Link>
          <Link to={ROUTES.docs} className={styles.ghostBtn}>
            <Compass size={17} />
            Explore Docs
          </Link>
        </div>
      </div>
    </div>
  );
}
