import React, { useState, useRef, useEffect } from "react"; 
import { Link, useNavigate } from "react-router-dom";
import { countryCodes, codeToCountryName } from './constants';
import searchImage from './search.png'; 
import earthGif from './earth.gif'; 
import calendarImage from './calendar.png'; 
import DatePicker from "react-datepicker"; 
import "react-datepicker/dist/react-datepicker.css"; 

const Navbar = React.memo(({ 
  fetchArticlesForDate, 
  changeSelectedDate, 
  changeCountry, 
  onSearch, 
  changeCategory, 
  changeBackgroundColor,
  changeSortOrder, // Added sort order change function
  articles // Assuming articles are passed down as props
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [hoveredBrand, setHoveredBrand] = useState(false); 
  const [hoveredCalendar, setHoveredCalendar] = useState(false); 
  const [hoveredSearch, setHoveredSearch] = useState(false); 
  const navigate = useNavigate();
  const navbarRef = useRef(null);

  const getResponsiveStyles = () => {
    if (window.innerWidth <= 576) {
      return { fontSize: '0.75rem', padding: '0.25rem 0.5rem' };
    } else if (window.innerWidth <= 768) {
      return { fontSize: '0.875rem', padding: '0.4rem 0.8rem' };
    }
    return { fontSize: '0.85rem', padding: '0.7rem 0.3rem' };
  };

  const { fontSize, padding } = getResponsiveStyles();

  const dropdownButtonStyle = {
    color: "#ced4da",
    padding: "0",
    height: "38px",
    transition: "all 0.3s ease",
    fontSize,
    fontFamily: 'Arial, sans-serif',    
    marginRight: '5px',
  };

  const dropdownMenuStyle = {
    backgroundColor: "black",
    color: "#ced4da",
    maxHeight: "300px",
    overflowY: "auto",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    fontFamily: 'Arial, sans-serif',
    fontSize: '0.9rem',
  };

  const dropdownItemStyle = {
    color: "#ced4da",
    fontSize: '0.9rem',
    padding: '10px 15px',
    transition: "background-color 0.3s ease",
  };

  const linkStyle = {
    color: "#ced4da",
    fontSize,
    padding,
    transition: "transform 0.3s ease, color 0.3s ease",
    textDecoration: 'none',
    margin: '0 5px',
  };

  const linkHoverStyle = {
    transform: "scale(1.1)",
    color: "#0dcaf0",
  };

  const renderSortMenu = () => (
    <li className="nav-item dropdown">
      <button
        className="btn dropdown-toggle"
        type="button"
        id="dropdownSortButton"
        data-bs-toggle="dropdown"
        aria-expanded="false"
        style={dropdownButtonStyle}
      >
        Sort By
      </button>
      <ul className="dropdown-menu dropdown-menu-dark" style={dropdownMenuStyle} aria-labelledby="dropdownSortButton">
        <li>
          <Link
            className="dropdown-item"
            to="#"
            style={dropdownItemStyle}
            onClick={() => changeSortOrder('newest')}
          >
            Newest
          </Link>
        </li>
        <li>
          <Link
            className="dropdown-item"
            to="#"
            style={dropdownItemStyle}
            onClick={() => changeSortOrder('oldest')}
          >
            Oldest
          </Link>
        </li>
        <li>
          <Link
            className="dropdown-item"
            to="#"
            style={dropdownItemStyle}
            onClick={() => changeSortOrder('popular')}
          >
            Most Popular
          </Link>
        </li>
      </ul>
    </li>
  );

  const renderDropdownMenu = (items, onClickHandler, title) => (
    <li className="nav-item dropdown">
      <button
        className="btn dropdown-toggle"
        type="button"
        id={`dropdown${title}Button`}
        data-bs-toggle="dropdown"
        aria-expanded="false"
        style={dropdownButtonStyle}
      >
        Select {title}
      </button>
      <ul
        className="dropdown-menu dropdown-menu-dark"
        aria-labelledby={`dropdown${title}Button`}
        style={dropdownMenuStyle}
      >
        {Object.entries(items).map(([name, code]) => (
          <li key={code}>
            <Link
              className="dropdown-item"
              to="#"
              style={dropdownItemStyle}
              onClick={() => {
                const countryCode = codeToCountryName[code];
                onClickHandler(countryCode);
                handleLinkClick('/general', 'general');
              }}
            >
              {name}
            </Link>
          </li>
        ))}
      </ul>
    </li>
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navbarRef.current && !navbarRef.current.contains(event.target)) {
        setIsExpanded(false);
        setShowCalendar(false);
      }
    };

    if (isExpanded || showCalendar) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isExpanded, showCalendar]);

  const handleSearch = (event) => {
    setKeyword(event.target.value.toLowerCase());
  };

  const handleToggle = () => {
    setIsExpanded((prev) => !prev);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    const sanitizedKeyword = keyword.trim().replace(/\s+/g, '');
    if (sanitizedKeyword) {
      navigate(`/search?keywords=${encodeURIComponent(sanitizedKeyword)}`);
      onSearch(sanitizedKeyword);
      setIsExpanded(false);
    }
  };

  const handleLinkClick = (path, category) => {
    setIsExpanded(false);
    navigate(path);
    changeCategory(category);
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setShowCalendar(false);
    changeSelectedDate(date);
  };

  return (
    <nav className="navbar navbar-expand-sm fixed-top" style={{ backgroundColor: "black" }} ref={navbarRef}>
      <div className="container-fluid d-flex align-items-center">
      
        <Link
          className="navbar-brand"
          to="/about"
          style={{ 
            color: "#0dcaf0",
            backgroundImage: `url(${earthGif})`,
            backgroundSize: '50px 45px',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            padding: '10px 20px',
            borderRadius: '5px',
            transform: hoveredBrand ? "scale(1.1)" : "scale(1)",
            transition: "transform 0.3s ease",
            fontSize,
          }}
          onMouseEnter={() => setHoveredBrand(true)} 
          onMouseLeave={() => setHoveredBrand(false)} 
        >
          <strong>Around Us</strong>
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded={isExpanded}
          aria-label="Toggle navigation"
          onClick={handleToggle}
          style={{ marginLeft: 'auto', width: '40px', height: '40px', zIndex: 1 }}
        >
          <span className="navbar-toggler-icon" style={{ backgroundColor: "white", borderRadius: "7px", transition: "background-color 0.3s ease", boxShadow: "0 0 5px white", display: 'block', width: '100%', height: '100%' }}></span>
        </button>

        <div className={`collapse navbar-collapse ${isExpanded ? "show" : ""}`} id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-sm-0" style={{ display: 'flex', alignItems: 'center' }}>
            {["general", "business", "entertainment", "health", "science", "sports", "technology"].map((category) => (
              <li className="nav-item" key={category}>
                <Link
                  className="nav-link"
                  to={`/${category}`}
                  style={{
                    ...linkStyle,
                    transform: hoveredCategory === category ? linkHoverStyle.transform : "scale(1)",
                    color: hoveredCategory === category ? linkHoverStyle.color : linkStyle.color,
                  }}
                  onMouseEnter={() => setHoveredCategory(category)}
                  onMouseLeave={() => setHoveredCategory(null)}
                  onClick={() => handleLinkClick(`/${category}`, category)}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </Link>
              </li>
            ))}
            <div className="d-flex" style={{ paddingTop: "3px" }}>
              {renderDropdownMenu(countryCodes, changeCountry, "Country")}
              {renderSortMenu()} {/* Render the sort menu here */}
            </div>
          </ul>
          
          <div className="calendar-container" style={{ marginLeft: "10px" }}>
            <button
              className="btn btn-secondary"
              onClick={() => setShowCalendar(!showCalendar)}
              onMouseEnter={() => setHoveredCalendar(true)}
              onMouseLeave={() => setHoveredCalendar(false)}
              style={{
                paddingRight: "1rem",
                backgroundColor: "transparent",
                border: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "transform 0.3s ease",
                transform: hoveredCalendar ? "scale(1.1)" : "scale(1)",
              }}
            >
              <img
                src={calendarImage}
                alt="Calendar"
                style={{
                  width: '33px',
                  height: '33px',
                  borderRadius: '20%',
                  transition: "transform 0.3s ease",
                }}
              />
            </button>

            {showCalendar && (
              <div style={{ position: 'absolute', zIndex: 1000 }}>
                <DatePicker
                  selected={selectedDate}
                  onChange={handleDateSelect}
                  inline
                />
              </div>
            )}
          </div>

          <form className="d-flex" role="search" onSubmit={handleSearchSubmit}>
            <input
              className="form-control me-2"
              type="search"
              placeholder="Search"
              aria-label="Search"
              onChange={handleSearch}
              value={keyword}
              style={{ fontSize }}
            />
            <img
              src={searchImage}
              alt="Search"
              style={{
                cursor: 'pointer',
                width: '30px',
                height: '30px',
                alignSelf: 'center',
                transform: `${hoveredSearch ? "scale(1.1)" : "scale(1)"} scaleX(-1)`,
                transition: "transform 0.3s ease",
              }}
              onMouseEnter={() => setHoveredSearch(true)}
              onMouseLeave={() => setHoveredSearch(false)}
              onClick={handleSearchSubmit}
            />
          </form>

          <div style={{ display: "flex", marginLeft: "10px" }}>
            {["white", "#e1bee7", "#ffccbc", "#b2f2e2", "#343a40"].map((color) => (
              <div
                key={color}
                style={{
                  backgroundColor: color,
                  width: "20px",
                  height: "20px",
                  cursor: "pointer",
                  borderRadius: "50%",
                  margin: "0 2px",
                  transition: "transform 0.3s ease",
                  transform: color === "#e1bee7" ? "scale(1.2)" : "scale(1)"
                }}
                onClick={() => changeBackgroundColor(color)}
                onMouseEnter={(e) => e.target.style.transform = "scale(1.2)"}
                onMouseLeave={(e) => e.target.style.transform = "scale(1)"}
              ></div>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
});

export default Navbar;
