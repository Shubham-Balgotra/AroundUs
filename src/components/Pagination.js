import React, { Component } from 'react';

export class Pagination extends Component {
  render() {
    const { currentPage, totalPages, onPageChange, loading } = this.props;

    return (
      <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0' }}>
        <nav aria-label="...">
          <ul className="pagination" style={{ display: 'flex', listStyleType: 'none', padding: 0 }}>
            {/* Previous Button */}
            <li className={`page-item ${currentPage === 1 || loading ? 'disabled' : ''}`}>
              <a 
                className="page-link" 
                onClick={() => !loading && currentPage > 1 && onPageChange(currentPage - 1)} 
                style={{ cursor: currentPage === 1 || loading ? 'default' : 'pointer' }}
              >
                &larr; Previous
              </a>
            </li>

            {/* Page Numbers */}
            {[...Array(totalPages)].map((_, index) => {
              const page = index + 1;
              return (
                <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                  <a 
                    className="page-link" 
                    onClick={() => !loading && onPageChange(page)} 
                    style={{ cursor: currentPage === page || loading ? 'default' : 'pointer' }}
                  >
                    {page}
                  </a>
                </li>
              );
            })}

            {/* Next Button */}
            <li className={`page-item ${currentPage === totalPages || loading ? 'disabled' : ''}`}>
              <a 
                className="page-link" 
                onClick={() => !loading && currentPage < totalPages && onPageChange(currentPage + 1)} 
                style={{ cursor: currentPage === totalPages || loading ? 'default' : 'pointer' }}
              >
                Next &rarr; 
              </a>
            </li>
          </ul>
        </nav>
      </div>
    );
  }
}

export default Pagination;
