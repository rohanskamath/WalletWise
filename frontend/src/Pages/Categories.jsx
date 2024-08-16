import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import AddCategory from "../Components/AddCategory";
import axios from "axios";
import { useAuth } from "../Context/AuthContext";

const Categories = () => {
  const [myCategory, setMyCategory] = useState([]);
  const [categories, setCategories] = useState([]);
  const { authUser } = useAuth();
  const [updateCategory, setUpdateCategory] = useState([]);

  const isSelected = (categoryName) =>
    myCategory.some((cat) => cat.catName === categoryName);

  const handleCategoryClick = (categoryName, id) => {
    if (!isSelected(categoryName)) {
      setMyCategory([...myCategory, { catName: categoryName }]);
      setUpdateCategory([
        ...updateCategory,
        { categoryId: id, emailID: authUser.emailID },
      ]);
    }
  };

  useEffect(() => {
    axios
      .get("http://localhost:7026/api/Category")
      .then((result) => {
        setCategories(result.data);
      })
      .catch((err) => console.log(err));
  });

  useEffect(() => {
    axios
      .get(`http://localhost:7026/api/CatMapUsers/${authUser.emailID}`)
      .then((result) => {
        if (result.status === 200) {
          setMyCategory(result.data);
        } else if (result.status === 202) {
          setMyCategory([]);
        }
      })
      .catch((err) => console.log(err));
  }, [authUser.emailID]);

  const handleSaveMyCategory = () => {
    axios
      .put("http://localhost:7026/api/CatMapUsers", updateCategory)
      .then((result) => {
        if (result.status === 200) {
          toast.success("Category Saved successfully", {
            theme: "dark",
            autoClose: 1000,
          });
        }
      })
      .catch((err) => {
        toast.error("Some Error Occured", {
          theme: "dark",
          autoClose: 1000,
        });
        console.log(err);
      });
  };

  return (
    <>
      <ToastContainer />
      <AddCategory />
      <main id="main" className="main">
        <div className="pagetitle">
          <h1>Expense Categories</h1>
        </div>
        <div className="container mt-4 mx-0">
          {categories && (
            <div className="row border rounded shadow-sm border">
              <div className="col p-3">
                <span className="text-start headings-side">
                  Standard Categories
                </span>
                <div className="mt-3">
                  {categories.map((category, index) => (
                    <span
                      key={index}
                      className={`badge mt-3 p-2 me-2 ${
                        isSelected(category.categoryName)
                          ? "background-badge-blocked text-blocked"
                          : "background-badge text-badge"
                      }`}
                      onClick={() =>
                        handleCategoryClick(
                          category.categoryName,
                          category.categoryId
                        )
                      }
                      style={{ cursor: "pointer" }}
                    >
                      {category.categoryName}
                    </span>
                  ))}
                  <button
                    type="button"
                    className="btn"
                    style={{
                      backgroundColor: "#012970",
                      color: "white",
                      fontFamily: '"Merriweather", sans-serif',
                      fontSize: "12px",
                    }}
                    data-bs-toggle="modal"
                    data-bs-target="#addCategoryModal"
                  >
                    <i className="bi bi-pencil-square"></i>
                  </button>
                </div>
              </div>
            </div>
          )}
          {myCategory.length > 0 && (
            <div className="row border rounded shadow-sm border mt-4">
              <div className="col p-3">
                <span className="text-start headings-side">My Categories</span>
                <div className="mt-3">
                  {myCategory.map((category, index) => (
                    <span
                      key={index}
                      className="background-badge-selected badge mt-3 p-2 me-2"
                    >
                      {category.catName}
                    </span>
                  ))}
                </div>
                <div className="d-flex justify-content-end mt-3">
                  <button
                    type="button"
                    style={{
                      border: "1px solid #012970",
                      backgroundColor: "white",
                      color: "#012970",
                      fontFamily: '"Merriweather", sans-serif',
                      fontSize: "12px",
                    }}
                    className="btn button-Save"
                    onClick={handleSaveMyCategory}
                  >
                    Save changes
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
};

export default Categories;
