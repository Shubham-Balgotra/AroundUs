import React, { Component } from 'react';
import noImg from './noImg.jpg';

export class Newsitem extends Component {
  extractPublisher(url) {
    const regex = /^(?:https?:\/\/)?(?:www\.)?([^/]+)/i;
    const match = url.match(regex);
    if (match && match[1]) {
      const publisher = match[1].split('.')[0].toLowerCase();
      return publisher
        .replace(/([a-z])([A-Z])/g, '$1 $2') // Lowercase followed by Uppercase
        .replace(/(\d)([A-Za-z])/g, '$1 $2') // Number followed by letter
        .toUpperCase();
    }
    return "Unknown publisher";
  }

  truncateText(text, limit) {
    if (!text) return "";
    const words = text.split(' ');
    return words.length > limit ? words.slice(0, limit).join(' ') + '...' : text;
  }

  render() {
    const { title, description, imgurl, newsurl, author, publishedAt, /*country*/ } = this.props;
    const publisherName = newsurl ? this.extractPublisher(newsurl) : "Unknown publisher";

    const cardStyle = {
      marginBottom: '30px',
      position: 'relative',
      border: '1px solid #e0e0e0',
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
      overflow: 'hidden',
      transition: 'box-shadow 0.3s ease',
    };

    const imgStyle = {
      width: '100%',
      height: '200px', // Set a fixed height
      objectFit: 'cover', // Maintain aspect ratio and cover the area
      borderBottom: '1px solid #e0e0e0',
    };

    const badgeStyle = {
      position: 'absolute',
      top: '10px',
      right: '10px',
      padding: '5px 10px',
      fontSize: '0.75rem',
      fontWeight: 'bold',
      borderRadius: '12px',
    };

    const bodyStyle = {
      padding: '15px',
    };

    const buttonStyle = {
      color: '#fff',
      borderRadius: '5px',
      padding: '8px 12px',
      textDecoration: 'none',
    };

    return (
      <div
        className="card"
        style={cardStyle}
        onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 255, 255, 0.5)')}
        onMouseLeave={(e) => (e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.2)')}
      >
        <img
          src={imgurl || noImg}
          className="card-img-top"
          alt="News Thumbnail"
          style={imgStyle}
        />

        {/* Badge for news article publisher */}
        <span className="badge rounded-pill text-bg-danger" style={badgeStyle}>
          {publisherName}
        </span>

        <div className="card-body" style={bodyStyle}>
          <h5 className="card-title" style={{ fontSize: '1.25rem', marginBottom: '10px', color: '#343a40' }}>
            {title || "Unknown title"}
          </h5>
          <p className="card-text" style={{ marginBottom: '15px', color: '#6c757d' }}>
            {this.truncateText(description, 20)} {/* Limit description to 20 words */}
          </p>
          {publishedAt && (
            <p className="card-text" style={{ color: "grey", fontSize: '0.9rem' }}>
              <strong>Published at:</strong> {new Date(publishedAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}
            </p>
          )}
          <p className="card-text" style={{ color: "grey", fontSize: '0.9rem' }}>
            <strong>Author:</strong> {author || "Unknown Author"}
          </p>
          {/* <p className="card-text" style={{ color: "grey", fontSize: '0.9rem' }}>
            <strong>Country:</strong> {country || "NaN"}
          </p> */}
          {newsurl ? (
            <a
              href={newsurl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-dark btn-sm"
              style={buttonStyle}
            >
              Read more
            </a>
          ) : (
            <button className="btn btn-sm btn-secondary" disabled style={{ borderRadius: '5px', padding: '8px 12px' }}>
              Link not available
            </button>
          )}
        </div>
      </div>
    );
  }
}

export default Newsitem;
