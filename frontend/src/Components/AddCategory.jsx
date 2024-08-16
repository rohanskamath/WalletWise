import React, { useRef, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify';

const AddCategory = () => {
    const [newCategory, setNewCategory] = useState({
        categoryId: 0,
        categoryName: ""
    })
    const [errors, setErrors] = useState({})
    const closeButtonRef = useRef(null);

    const autoCloseClick = () => {
        closeButtonRef.current.click();
    }

    const validateCategory = () => {
        const categoryError = {};
        if (newCategory.categoryName.trim() === "") {
            categoryError.errMsg = "* Category name field is required";
            setErrors(categoryError)
            return false;
        }
        setErrors({});
        return true;
    };

    const HandleCloseCategory=()=>{
        setErrors({})
        setNewCategory({ categoryId: 0, categoryName: "" });
    }

    const handleAddCategory = () => {

        if (!validateCategory()) {
            return;
        }
        autoCloseClick();
        axios.post("http://localhost:7026/api/Category/Add", newCategory)
            .then((result) => {
                if (result.status === 201) {
                    toast.success("New Category added successfully", {
                        theme: "dark",
                        autoClose: 1000,
                    });
                    setNewCategory({ categoryId: 0, categoryName: "" });
                } else {
                    toast.error(result.data, {
                        theme: "dark",
                        autoClose: 1000,
                    });
                }
            })
            .catch((err) => console.log(err))
    }
    return (
        <>
            <div className="modal fade" id="addCategoryModal" data-bs-backdrop="static" tabIndex="-1" aria-labelledby="categoryModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="categoryModalLabel">Add New Category</h1>
                            <button ref={closeButtonRef} type="button" className="btn-close shadow-none" data-bs-dismiss="modal" aria-label="Close" onClick={HandleCloseCategory}></button>
                        </div>
                        <div className="modal-body">
                            <div className="input-group">
                                <span className="input-group-text" style={{ fontSize: "13px", fontFamily: '"Merriweather", sans-serif' }}>Category Name</span>
                                <input type="text" style={{ fontSize: "13px", fontFamily: '"Merriweather", sans-serif' }} className="form-control shadow-none" placeholder="Enter category name" value={newCategory.categoryName} onChange={(e) => setNewCategory({ ...newCategory, categoryName: e.target.value })} />
                            </div>
                            {errors.errMsg && <div className="validations" style={{ color: 'red' }}>{errors.errMsg}</div>}
                            <div className="d-flex justify-content-end mt-3">
                                <button type="button" style={{ backgroundColor: '#012970', color: 'white', fontFamily: '"Merriweather", sans-serif', fontSize: "12px" }} className="btn" onClick={handleAddCategory}>Save changes</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AddCategory
