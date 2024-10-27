import './App.css';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import News from './components/News';
import LoadingBar from 'react-top-loading-bar';
import React, { Component, useEffect } from 'react';
import About from './components/About';
import QuotesMarquee from './components/QuotesMarquee'; 

const Header = ({ bgColor, selectedCountry }) => {
    const category = useLocation().pathname.split('/')[1] || "general";
    const formattedCategory = category.charAt(0).toUpperCase() + category.slice(1);

    return (
        <div style={{
            textAlign: "center",
            padding: "10px 0 25px 0",
            backgroundColor: bgColor || "#e1bee7",
        }}>
            <h2 style={{
                fontSize: "2.5rem",
                color: "#6c757d",
                margin: "0 0 5px",
                fontWeight: "bold",
                textTransform: "uppercase",
            }}>
                The Daily Brief: Top Headlines for {formattedCategory} in {selectedCountry}
            </h2>
            <p style={{
                fontSize: "1.2rem",
                color: "#6c757d",
                margin: "0",
                padding: "1px 0 0px 0",
            }}>
                Stay updated with the latest news from around the world!
            </p>
        </div>
    );
};

const ConditionalHeader = ({ bgColor, selectedCountry }) => {
    const isAboutPage = useLocation().pathname === '/about';
    return !isAboutPage ? <Header bgColor={bgColor} selectedCountry={selectedCountry} /> : null;
};

class App extends Component {
    state = {
        progress: 0,
        sortOrder: 'newest',
        searchQuery: '',
        bgColor: 'white',
        selectedCountry: 'us',
        selectedCategory: 'general',
        selectedDate: null,
        articles: [],
        loading: true,
    };

    setProgress = (progress) => this.setState({ progress });

    handleSearch = (searchQuery) => this.setState({ searchQuery });

    changeBackgroundColor = (color) => {
        this.setState({ bgColor: color });
        document.body.style.backgroundColor = color;
    };

    changeCountry = (country) => this.setState({ selectedCountry: country, searchQuery: '' });

    changeCategory = (category) => this.setState({ selectedCategory: category, searchQuery: '' });

    changeSelectedDate = (date) => this.setState({ selectedDate: date });

    changeSortOrder = (order) => {
        this.setState({ sortOrder: order }, () => {
            // Fetch articles after changing sort order
            this.fetchArticlesForDate(this.state.selectedDate, this.state.searchQuery);
        });
    };

    componentDidMount() {
        document.body.style.backgroundColor = this.state.bgColor;
    }

    fetchArticlesForDate = async (date, keyword) => {
        if (!date) return;

        const utcDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
        const formattedDate = utcDate.toISOString().split('T')[0];
        const apiKey = process.env.REACT_APP_API_KEY;

        try {
            const response = await fetch(`https://api.mediastack.com/v1/news?access_key=${apiKey}&countries=${this.state.selectedCountry}&categories=${this.state.selectedCategory}&date=${formattedDate}&keywords=${encodeURIComponent(keyword)}`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();

            // Sort articles based on selected sortOrder
            const sortedArticles = this.sortArticles(data.data);
            this.setState({ articles: sortedArticles, loading: false });
        } catch (error) {
            console.error("Error fetching articles:", error);
            this.setState({ articles: [], loading: false });
        }
    };

    sortArticles = (articles) => {
        const { sortOrder } = this.state;

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

    render() {
        const { selectedCountry, searchQuery, bgColor, selectedCategory, selectedDate, progress, sortOrder } = this.state;

        return (
            <Router>
                <LoadingBar color='#0dcaf0' progress={progress} />
                <Navbar
                    onSearch={this.handleSearch}
                    changeBackgroundColor={this.changeBackgroundColor}
                    changeCountry={this.changeCountry}
                    changeCategory={this.changeCategory}
                    changeSelectedDate={this.changeSelectedDate}
                    fetchArticlesForDate={this.fetchArticlesForDate}
                    changeSortOrder={this.changeSortOrder}
                />
                
                <div style={{ marginTop: '58px' }}>
                    <QuotesMarquee />
                </div>

                <ConditionalHeader bgColor={bgColor} selectedCountry={selectedCountry} />
                
                <TitleUpdater />
                
                <Routes>
                    <Route path="/" element={<Navigate to="/general" />} />
                    {['general', 'business', 'entertainment', 'health', 'science', 'sports', 'technology'].map((category) => (
                        <Route 
                            key={category} 
                            path={`/${category}`} 
                            element={
                                <News 
                                    setProgress={this.setProgress} 
                                    country={selectedCountry} 
                                    category={category} 
                                    pageSize={12} 
                                    searchQuery={searchQuery} 
                                    bgColor={bgColor} 
                                    selectedCategory={selectedCategory} 
                                    selectedDate={selectedDate}
                                    sortOrder={sortOrder} // Pass sortOrder here
                                />} 
                        />
                    ))}
                    <Route path="/search" element={
                        <News 
                            setProgress={this.setProgress} 
                            country={selectedCountry} 
                            category="search" 
                            pageSize={12} 
                            searchQuery={new URLSearchParams(window.location.search).get('keywords')} 
                            bgColor={bgColor} 
                            selectedCategory={selectedCategory} 
                            selectedDate={selectedDate} 
                            sortOrder={sortOrder} // Pass sortOrder here
                        />} 
                    />
                    <Route path="/about" element={<About setProgress={this.setProgress} />} />
                </Routes>
            </Router>
        );
    }
}

const TitleUpdater = () => {
    const location = useLocation();

    useEffect(() => {
        const category = location.pathname.split('/')[1] || "general";
        const formattedCategory = category.charAt(0).toUpperCase() + category.slice(1);
        document.title = `${formattedCategory} - Around Us`;
    }, [location]);

    return null;
};

export default App;
