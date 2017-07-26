import Inferno from 'inferno';
import { Link } from 'inferno-router';
import styles from './pager.css';

export default function Pager({ page, total, tag }) {
  const PER_PAGE = 5;
  const prevPage = page - 1;
  const nextPage = page + 1;
  const hasPrevPage = prevPage > 0;
  const hasNextPage = nextPage <= Math.ceil(total / PER_PAGE);

  return (
    <nav className={styles.pager}>
      {hasPrevPage ? (
        <Link
          className={styles.prev}
          to={`/blog?tag=${tag}&page=${prevPage}`}
          title="上一页"
        >
          <svg><use xlinkHref="#icon-arrow-left" /></svg>
          <span>上一页</span>
        </Link>
      ) : null}

      {hasNextPage ? (
        <Link
          className={styles.next}
          to={`/blog?tag=${tag}&page=${nextPage}`}
          title="下一页"
        >
          <svg><use xlinkHref="#icon-arrow-right" /></svg>
          <span>下一页</span>
        </Link>
      ) : null}
    </nav>
  );
}
