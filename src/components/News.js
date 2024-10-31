import React, { Component } from "react";
import Newsitem from "./Newsitem";
import Spinner from "./Spinner";
import PropTypes from "prop-types";
import { countryCodes } from './constants';
import halloweenGif from './halloween.gif';
import santaGif from './santa.gif';

export class News extends Component {
  static defaultProps = {
    pageSize: 12,
    country: "us",
    category: "business",
  };

  static propTypes = {
    pageSize: PropTypes.number,
    country: PropTypes.string,
    category: PropTypes.string,
    searchQuery: PropTypes.string,
    selectedDate: PropTypes.instanceOf(Date),
    setProgress: PropTypes.func.isRequired,
    sortOrder: PropTypes.string, // Add sortOrder prop
  };

  constructor() {
    super();
    this.state = {
      articles: [],
      loading: false,
      offset: 0,
      totalCount: 0,
      hasFetched: false,
      error: null,
      showGif: true,
      delayShowGif: false,
    };
    this.scrollHandler = this.throttle(this.handleScroll, 200);
    this.fetchArticles = this.fetchArticles.bind(this);
  }

  getSeasonalGif() {
    const currentMonth = new Date().getMonth();

    if (currentMonth === 9) {
        return halloweenGif; // Display Halloween GIF in October
    } else if (currentMonth === 11) {
        return santaGif; // Display Christmas GIF in December
    }

    return null; // Return null for other months
}


  componentDidMount() {
    this.fetchArticles();
    this.updateDocumentTitle();
    window.addEventListener("scroll", this.scrollHandler);

    setTimeout(() => {
      this.setState({ delayShowGif: true });
    }, 3000);

    setTimeout(() => {
      this.setState({ showGif: false });
    }, 7500);
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.scrollHandler);
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.country !== this.props.country ||
      prevProps.category !== this.props.category ||
      prevProps.searchQuery !== this.props.searchQuery ||
      prevProps.selectedDate !== this.props.selectedDate ||
      prevProps.sortOrder !== this.props.sortOrder // Check for sortOrder change
    ) {
      this.resetArticles();
    }
  }

 resetArticles = () => {
    const defaultCategory = 'general'; // Set a valid default category
    this.setState({ 
      articles: [], 
      offset: 0, 
      hasFetched: false, 
      localSearchQuery: '', // Reset local search query here
      selectedDate: null, 
      category: defaultCategory // Set a valid default category
    }, this.fetchArticles);
};

  handleScroll = () => {
    const { loading, offset, totalCount } = this.state;
    if (loading || offset >= totalCount) return;

    const { scrollTop, scrollHeight } = document.documentElement;
    const viewportHeight = window.innerHeight;

    if (scrollTop + viewportHeight >= scrollHeight - 300) {
      this.setState(
        (prevState) => ({
          offset: prevState.offset + this.props.pageSize,
          loading: true,
        }),
        this.fetchArticles
      );
    }
  };

  throttle = (func, limit) => {
    let lastFunc;
    let lastRan;
    return function (...args) {
      if (!lastRan) {
        func.apply(this, args);
        lastRan = Date.now();
      } else {
        clearTimeout(lastFunc);
        lastFunc = setTimeout(() => {
          if (Date.now() - lastRan >= limit) {
            func.apply(this, args);
            lastRan = Date.now();
          }
        }, limit - (Date.now() - lastRan));
      }
    };
  };

  fetchArticles = async () => {
    const { offset } = this.state;
    const { setProgress, category, searchQuery, selectedDate } = this.props;

    setProgress(10);
    const countryCode = countryCodes[this.props.country] || "us";
    const apiKey = process.env.REACT_APP_API_KEY;

    const dateString = selectedDate ? selectedDate.toISOString().split('T')[0] : '';
    const url = searchQuery
      ? `https://api.mediastack.com/v1/news?access_key=${apiKey}&countries=${countryCode}&keywords=${encodeURIComponent(searchQuery)}&date=${dateString}&offset=${offset}&limit=${this.props.pageSize * 3}`
      : `https://api.mediastack.com/v1/news?access_key=${apiKey}&countries=${countryCode}&categories=${category}&date=${dateString}&offset=${offset}&limit=${this.props.pageSize * 3}`;

    this.setState({ loading: true, error: null });

    try {
      await new Promise((resolve) => setTimeout(resolve, 500)); // 500 ms delay
      const response = await fetch(url);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`HTTP error! Status: ${response.status}, Details: ${JSON.stringify(errorData)}`);
      }
      const parsedData = await response.json();
      this.updateArticles(parsedData);
    } catch (error) {
      console.error("Error fetching the news articles:", error);
      this.setState({ loading: false, hasFetched: true, error: error.message });
    } finally {
      setProgress(100);
    }
  };

  updateArticles = (parsedData) => {
    const seenArticles = new Set();
    const newArticles = [];

    parsedData.data.forEach((article) => {
      const key = `${article.published_at}-${article.title}`;
      if (!seenArticles.has(key) && article.image) {
        seenArticles.add(key);
        newArticles.push(article);
      }
    });

    const uniqueArticles = [...this.state.articles, ...newArticles].filter((article, index, self) =>
      index === self.findIndex((a) =>
        a.title === article.title && a.published_at === article.published_at
      )
    );

    // Sort articles based on sortOrder prop
    const sortedArticles = this.sortArticles(uniqueArticles);

    this.setState({
      articles: sortedArticles,
      totalCount: parsedData.pagination.total,
      loading: false,
      hasFetched: true,
    });
  };

  sortArticles = (articles) => {
    const { sortOrder } = this.props;

    return articles.sort((a, b) => {
      switch (sortOrder) {
        case 'newest':
          return new Date(b.published_at) - new Date(a.published_at);
        case 'oldest':
          return new Date(a.published_at) - new Date(b.published_at);
        case 'popular':
          return b.popularity - a.popularity; // assuming 'popularity' is a property
        default:
          return 0;
      }
    });
  };

  updateDocumentTitle = () => {
    const categoryTitle = this.props.category.charAt(0).toUpperCase() + this.props.category.slice(1);
    document.title = `${categoryTitle} - Around Us`;
  };

  getFilteredArticles = () => {
    const { articles } = this.state;
    const { searchQuery } = this.props;

    if (!searchQuery) return articles;

    return articles.filter(article => {
      const titleMatch = article.title.toLowerCase().includes(searchQuery.toLowerCase());
      const descriptionMatch = article.description ? article.description.toLowerCase().includes(searchQuery.toLowerCase()) : false;
      return titleMatch || descriptionMatch;
    });
  };

  render() {
    const { bgColor } = this.props;
    const { loading, hasFetched, error, showGif, delayShowGif } = this.state;
    const filteredArticles = this.getFilteredArticles();

    return (
      <div className="container" style={{ backgroundColor: bgColor || 'white', position: 'relative' }}>
        {delayShowGif && showGif && (
          <div
            className="text-center"
            style={{
              position: 'fixed',
              top: '70%',
              left: '40%',
              transform: 'translateX(-50%)',
              zIndex: 1000,
              margin: '20px 0',
            }}
          >
            <img
              src={this.getSeasonalGif()} // Call the method to get the seasonal GIF
              alt="Seasonal GIF"
              style={{ maxHeight: '170px', width: 'auto' }}
            />
          </div>
        )}

        <div className="row">
          {error && <div className="col-12 text-center text-danger">{error}</div>}
          {filteredArticles.length > 0 ? (
            filteredArticles.map((element, index) => (
              <div className="col-12 col-sm-6 col-md-4" key={`${element.url}-${index}`}>
                <Newsitem
                  title={element.title}
                  description={element.description}
                  imgurl={element.image}
                  newsurl={element.url}
                  author={element.author || "Unknown Author"}
                  publishedAt={element.published_at}
                  country={element.country}
                />
              </div>
            ))
          ) : (
            !loading && hasFetched && (
              <div className="col-12 text-center">No articles found</div>
            )
          )}
        </div>

        {loading && (
          <div className="text-center" style={{ margin: '20px 0' }}>
            <Spinner />
          </div>
        )}
      </div>
    );
  }
}

export default News;
