import React, { useEffect, useState } from 'react';
import TransactionComponent from '../Components/TransactionComponent';
import { returnPaginationRange } from '../utils/paginationUtils';
import { ToastContainer } from 'react-toastify';
import AddTransaction from '../Components/AddTransaction';
import { useAuth } from '../Context/AuthContext';
import axios from 'axios';

const Transactions = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [transaction, setTransactions] = useState([])
  const { authUser } = useAuth();

  useEffect(() => {
    axios.get(`http://localhost:7026/api/Transaction/${authUser.emailID}`)
      .then((result) => {
        setTransactions(result.data)
      })
      .catch((err) => console.log(err))
  })

  let totalPage = Math.ceil(transaction.length / limit)
  let arrayPagination = returnPaginationRange(totalPage, page, limit, 1);
  let pageNo;
  if (page <= totalPage) {
    pageNo = page;
  } else {
    setPage(totalPage);
    pageNo = page;
  }

  const handlePageChange = (value) => {
    if (value === "&laquo;" || value === "... ") {
      setPage(1);
    } else if (value === "&lsaquo;") {
      if (page !== 1) {
        setPage(page - 1)
      }
    } else if (value === "&rsaquo;") {
      if (page !== totalPage) {
        setPage(page + 1)
      }
    } else if (value === "&raquo;" || value === " ...") {
      setPage(totalPage)
    } else {
      setPage(value)
    }
  }

  const getCurrentPageTransactions = () => {
    if (!transaction || transaction.length === 0) {
      return [];
    }
    const start = Math.max((page - 1) * limit, 0); // Prevent negative start index
    const end = Math.min(start + limit, transaction.length); // Ensure end does not exceed transactions length
    return transaction.slice(start, end);
  };
  return (
    <>
      <ToastContainer />
      <main id="main" className='main'>
        <AddTransaction />
        <div className='pagetitle'>
          <h1>Transactions</h1>
        </div>

        <div className='mt-4'>
          <button style={{ backgroundColor: '#012970', color: 'white', fontFamily: '"Merriweather", sans-serif' }} type="button" className="btn d-lg-block d-none" data-bs-toggle="modal" data-bs-target="#addTransactionsModal">
            Add New Transaction
          </button>
          <button style={{ backgroundColor: '#012970', color: 'white', fontFamily: '"Merriweather", sans-serif' }} type="button" className="btn d-lg-none" data-bs-toggle="modal" data-bs-target="#addTransactionsModal">
            <i className="bi bi-plus"></i>
          </button>
        </div>

        <TransactionComponent users={getCurrentPageTransactions()} />
        <div className='pagination-container'>
          {/* Setting Page Limit */}
          <select onChange={(e) => setLimit(e.target.value)} className="select">
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="15">15</option>
          </select>
          {/* Pagination Section */}
          <ul className="pagination pagination-md justify-content-end">
            <li className="page-item"><span onClick={() => { handlePageChange("&laquo;") }} className="page-link">&laquo;</span></li>
            <li className="page-item"><span onClick={() => { handlePageChange("&lsaquo;") }} className="page-link">&lsaquo;</span></li>
            {
              arrayPagination.map((value, index) => {
                if (value === page) {
                  return <li key={index} className="page-item active"><span onClick={() => { handlePageChange(value) }} className="page-link">{value}</span></li>
                } else {
                  return <li key={index} className="page-item"><span onClick={() => { handlePageChange(value) }} className="page-link">{value}</span></li>
                }
              }
              )
            }
            <li className="page-item"><span onClick={() => { handlePageChange("&rsaquo;") }} className="page-link">&rsaquo;</span></li>
            <li className="page-item"><span onClick={() => { handlePageChange("&raquo;") }} className="page-link">&raquo;</span></li>
          </ul>
        </div>

      </main>

    </>
  );
}

export default Transactions;
