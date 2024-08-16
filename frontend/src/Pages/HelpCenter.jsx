import React, { useEffect } from 'react'
import { useAuth } from '../Context/AuthContext';
import { useForm, ValidationError } from '@formspree/react';
import { ToastContainer, toast } from 'react-toastify';

const HelpCenter = () => {
    const { authUser } = useAuth();
    const [state, handleSubmit] = useForm("xqazpoej");
    const FAQ = [
        {
            question: "How can I categorize my expenses?",
            answer: "You can categorize your expenses by going to the \"Expense Categories\" section. In this section, you can create new categories by providing a name. These categories will help you organize your expenses and provide more detailed analytics."
        },
        {
            question: "What information is displayed on the Dashboard?",
            answer: "The Dashboard gives you an overview of your financial status. It includes a summary of your account details, a list of your expense categories, recent transactions, and highlights from the Analytics section. The Dashboard helps you quickly understand your financial health at a glance."
        },
        {
            question: "How do I add a new transaction?",
            answer: "To add a new transaction, go to the \"Transactions\" section. Select whether the transaction is an income or an expense. For expenses, choose the appropriate category from the list. Enter the amount, date, and any additional details, then save the transaction. This will ensure your records are up-to-date."
        },
        {
            question: "Can I edit or delete previously added transactions?",
            answer: "Yes, you can edit previously added transactions, but deletion is not supported. To edit a transaction, navigate to the \"Transactions\" section, find the transaction you want to modify, and select the edit option. Editing a transaction will automatically update the analytics section to reflect the changes. This ensures that your visual representations and overall financial overview remain accurate."
        },
        {
            question: "How do I add my account details?",
            answer: "To add your account details, navigate to the \"My Account\" section in the app. Here, you can input your account name, type, and other relevant details. Make sure to save your information before exiting the section to ensure your account is set up correctly."
        },
        {
            question: "How do I handle multiple accounts within the application?",
            answer: "The application allows you to manage multiple accounts by adding each one separately in the \"My Account\" section. Each account can have its own set of transactions and expense categories. When adding a transaction, you can select the account to which it belongs. The analytics and dashboard will aggregate data across all accounts."
        },
        {
            question: "Is there a way to import/export my transaction data for backup or analysis in other tools?",
            answer: "No, the application does not support importing or exporting transaction data for backup or analysis in other tools. If you need assistance with accessing or managing your data, please contact the admin. You can send an email using the \"Contact Us\" section in the app for further assistance."
        },
        {
            question: "Can I customize the analytics charts to focus on specific expense categories or time periods?",
            answer: "Yes, the analytics charts are highly customizable. You can filter the charts by specific expense categories, income sources, and time periods such as days, weeks, months, or years. This customization allows you to focus on particular aspects of your finances, helping you to gain more detailed insights and make informed decisions."
        },
        {
            question: "How does the app ensure the security and privacy of my financial data?",
            answer: "The app ensures the security and privacy of your financial data by not saving account details in the database. Account details are managed solely by the user and are added or edited directly within the app. This approach minimizes the risk of sensitive information being compromised. Additionally, the app implements encryption of data at rest and in transit, secure authentication methods, and follows industry-standard privacy practices to protect your transactions and other financial data."
        },
        {
            question: "Can I sync my transaction data across multiple devices?",
            answer: "No, the application does not support importing or exporting transaction data for backup or analysis in other tools. Similarly, the application does not support syncing transaction data across multiple devices. If you need assistance with accessing your data on different devices or managing your data, please contact the admin. You can send an email using the \"Contact Us\" section in the app for further assistance."
        }
    ]

    useEffect(() => {
        if (state.succeeded) {
            toast.success("Thanks for contacting us! We will get back to you shortly.", {
                theme: "dark",
                autoClose: 1000,
            });
        }
    }, [state.succeeded]);
    return (
        <>
            <main id="main" className='main'>
                <div className='pagetitle'>
                    <h1>Help Center</h1>
                </div>
                <div className="profilesetting container col-12 mt-4 mx-0 p-4 rounded shadow-sm border">
                    <h2 className="h4 h-sm-5">FAQs</h2>
                    <div className="accordion" id="accordionExample">
                        {
                            FAQ.map((items, index) => (
                                <div key={index} className="accordion-item">
                                    <h2 className="accordion-header">
                                        <button className="accordion-button shadow-none collapsed" type="button" data-bs-toggle="collapse" data-bs-target={`#collapse${index}`} aria-expanded="true" aria-controls={`collapse${index}`}>
                                            {items.question}
                                        </button>
                                    </h2>
                                    <div id={`collapse${index}`} className={`accordion-collapse collapse ${index === 0 ? 'show' : ''}`} data-bs-parent="#accordionExample">
                                        <div className="accordion-body" style={{ fontFamily: '"Merriweather", sans-serif', fontSize: "13px" }}>
                                            {items.answer}
                                        </div>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                    <h2 className="h4 h-sm-5 mt-5">Still have any questions? Contact us to get your answer!</h2>
                    <div className="row mt-5">
                        <div className="col-md-4 d-flex flex-column align-items-center">
                            <lottie-player src="https://lottie.host/a072cfb6-a6aa-4b6e-b5f5-187d6a23f6b0/QQD5MXqe9G.json" background="transparent" speed="1" style={{ height: "250px" }} loop autoplay></lottie-player>
                        </div>
                        <div className="col-md-8">
                            <div className="p-3 formInput">
                                <form onSubmit={handleSubmit}>
                                    <div className="form-group d-flex align-items-center mb-3">
                                        <label className='col-4'>Full Name:</label>
                                        <input
                                            type="text"
                                            style={{ fontFamily: '"Merriweather", sans-serif', fontSize: "13px" }}
                                            className="form-control shadow-none"
                                            placeholder='Enter your full name'
                                            value={authUser.fullName}
                                            autoComplete='off'
                                            name="name"
                                        />
                                    </div>
                                    <div className="form-group d-flex align-items-center mb-3">
                                        <label className='col-4'>Email-Id:</label>
                                        <input
                                            type="text"
                                            style={{ fontFamily: '"Merriweather", sans-serif', fontSize: "13px" }}
                                            disabled
                                            className="form-control shadow-none"
                                            placeholder='Enter your email-id'
                                            value={authUser.emailID}
                                            autoComplete='off'
                                            name="email"
                                        />
                                    </div>
                                    <div className="form-group d-flex align-items-center mb-3">
                                        <label className='col-4'>Message:</label>
                                        <textarea
                                            rows={7}
                                            className="form-control shadow-none"
                                            style={{ fontSize: "13px", fontFamily: '"Merriweather", sans-serif' }}
                                            placeholder="Leave your queries here"
                                            id="floatingTextarea"
                                            name="message"
                                            required
                                        ></textarea>
                                        <ValidationError
                                            prefix="Message"
                                            field="message"
                                            errors={state.errors}
                                        />
                                    </div>
                                    <div className="form-group mb-3">
                                        <button
                                            type="submit"
                                            style={{ marginBottom: "20px", width: "100%", backgroundColor: '#012970', color: 'white', fontFamily: '"Merriweather", sans-serif', fontSize: "12px" }}
                                            className="btn"
                                            disabled={state.submitting}
                                        >
                                            Send message
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <ToastContainer />
        </>
    )
}

export default HelpCenter
