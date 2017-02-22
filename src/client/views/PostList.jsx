/** @jsx Inferno */
import Inferno from 'inferno';
import Component from 'inferno-component';
import { Link } from 'inferno-router';

class PostList extends Component {
  componentDidMount() {
    document.title = 'Blog - A Talk To me';
    window.scrollTo(0, 0);

    this.fetchPosts(this.props.tag, this.props.currentPage);
  }

  fetchPosts(tag = '', currentPage = 1) {
    this.props.update({ fetching: true });

    fetch(`/blog?json=true&page=${currentPage}&tag=${tag}`)
      .then(res => res.json())
      .then(({ success, result }) => {
        if (success) {
          this.props.update({
            ...result,
            fetching: false,
          });
        }
      });
  }

  render() {
    const { totalPages, currentPage, tag, posts } = this.props;
    const prevPage = currentPage - 1;
    const nextPage = currentPage + 1;
    const hasPrevPage = prevPage > 0;
    const hasNextPage = nextPage <= totalPages;

    return (
      <main className="app-main blog">
        <ul className="article-list">
          {posts.map(post => (
            <li className="article-item">
              <section className="article-item-left">
                <time>{post.date}</time>
              </section>
              <section className="article-item-right">
                <Link class="article-item-title" to={`/blog/${post.name}`}>
                  <h2>{post.title}</h2>
                </Link>
              </section>
            </li>
          ))}
        </ul>

        <nav className="article-list-pager">
          {hasPrevPage ? (
            <Link
              className="article-list-prev" to={`/blog?tag=${tag}&page=${prevPage}`}
              dangerouslySetInnerHTML={{ __html: '<svg><use xlink:href="/icons.svg#icon-arrow-left" /></svg>' }}
              onClick={() => this.fetchPosts(tag, prevPage)}
            />
          ) : null}
          {hasNextPage ? (
            <Link
              className="article-list-next" to={`/blog?tag=${tag}&page=${nextPage}`}
              dangerouslySetInnerHTML={{ __html: '<svg><use xlink:href="/icons.svg#icon-arrow-right" /></svg>' }}
              onClick={() => this.fetchPosts(tag, nextPage)}
            />
          ) : null}
        </nav>
      </main>
    );
  }
}

export default PostList;
