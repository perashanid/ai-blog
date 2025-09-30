const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const startPage = Math.max(1, currentPage - 2);
      const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
      
      if (startPage > 1) {
        pages.push(1);
        if (startPage > 2) pages.push('...');
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      
      if (endPage < totalPages) {
        if (endPage < totalPages - 1) pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  return (
    <div className="pagination-container">
      <div className="pagination">
        <button
          className="pagination-btn prev"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          ← Previous
        </button>
        
        <div className="page-numbers">
          {getPageNumbers().map((page, index) => (
            <button
              key={index}
              className={`page-btn ${page === currentPage ? 'active' : ''} ${page === '...' ? 'ellipsis' : ''}`}
              onClick={() => typeof page === 'number' && onPageChange(page)}
              disabled={page === '...'}
            >
              {page}
            </button>
          ))}
        </div>
        
        <button
          className="pagination-btn next"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next →
        </button>
      </div>
      
      <div className="pagination-info">
        Page {currentPage} of {totalPages}
      </div>
    </div>
  );
};

export default Pagination;