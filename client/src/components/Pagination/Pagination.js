import React from 'react';
import _ from "lodash";
import PropTypes from 'prop-types';
import "./Pagination.css";

const Pagination = (props) => {
    const { itemsCount, pageSize, currentPage, onPageChange } = props;

    const pagesCount = Math.ceil(itemsCount / pageSize);
    if (pagesCount === 1) return null;
    const pages = _.range(1, pagesCount + 1);

    if (pagesCount === 0) {
        return null;
    }

    return (
        <nav className="pagination" role="navigation" aria-label="pagination">
            <button className="pagination-previous" disabled={ currentPage === 1 } onClick={() => onPageChange(currentPage - 1)}>Previous</button>
            <button className="pagination-next" disabled={ currentPage === pagesCount } onClick={() => onPageChange(currentPage + 1)}>Next page</button>
            <ul className="pagination-list">
                {
                    pages.map(page =>
                        <li key={page}>
                            <button className={ page === currentPage ? "pagination-link is-current" : "pagination-link" } onClick={() => onPageChange(page)}>{page}</button>
                        </li>)
                }
            </ul>
        </nav>
    );
}

Pagination.propTypes = {
    itemsCount: PropTypes.number.isRequired,
    pageSize: PropTypes.number.isRequired,
    currentPage: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
};

export default Pagination;
