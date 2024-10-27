import React, { Component } from 'react';
import './About.css';
import Spinner from './Spinner';

export class About extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
    };
  }

  componentDidMount() {
    this.props.setProgress(10);
    document.title = 'About - Around Us';

    setTimeout(() => {
      this.setState({ loading: false });
      this.props.setProgress(100);
    }, 1000); // Adjust timeout duration as necessary
  }

  render() {
    if (this.state.loading) {
      return (
        <div className="spinner-container" style={{ 
          backgroundColor: 'white', 
          height: '100vh', // Full height to cover the viewport
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0, 
          zIndex: 9999 // Make sure it covers other content
        }}>
          <Spinner />
        </div>
      );
    }

    return (
      <div className="about-container">
        <h1 className="about-title" style={{ paddingTop: '70px', paddingBottom: '35px' }}>
          Welcome to <strong>Around Us</strong>!
        </h1>
        <p className="about-intro">
          At <strong>Around Us</strong>, we believe that knowledge is power, and staying informed is essential in today's fast-paced world. Our mission is to provide you with the latest news and insights from various categories, including Sports, Business, Health, Entertainment, Technology, and Science, all in one convenient place.
        </p>

        <h2 className="about-subtitle">What We Offer</h2>
        <ul className="about-list">
          <li><strong>Comprehensive Coverage:</strong> Whether you're a sports enthusiast, a tech-savvy individual, or someone who wants to stay updated on global affairs, we have something for everyone. Our carefully curated articles bring you the most relevant and engaging stories from around the globe.</li>
          <li><strong>User-Centric Design:</strong> We prioritize your experience. Our app features an intuitive interface, making it easy to navigate through categories and find the news that matters to you. Enjoy a seamless reading experience on both desktop and mobile devices.</li>
          <li><strong>Stay Informed, Stay Engaged:</strong> Knowledge shapes perspectives. We strive to empower our users with accurate and timely information, helping you make informed decisions in your daily life.</li>
          <li><strong>Community Focus:</strong> At <strong>Around Us</strong>, we are more than just a news app. We aim to foster a community of informed individuals who share a passion for staying updated on current events. Join us in discussions, share your thoughts, and connect with others who value the importance of knowledge.</li>
        </ul>

        <h2 className="about-subtitle">Join Us on This Journey</h2>
        <p className="about-join">
          We invite you to explore our app and immerse yourself in the wealth of information available at your fingertips. With <strong>Around Us</strong>, you're never out of the loop. Thank you for choosing us as your trusted news source. Together, let’s stay informed and make sense of the world around us!
        </p>

        {/* Footer */}
        <footer className="about-footer">
          <p>&copy; {new Date().getFullYear()} Around Us. All rights reserved.</p>
        </footer>
      </div>
    );
  }
}

export default About;
