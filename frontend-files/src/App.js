
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import Cursor from './cursoranimation';

function App() {
  // State to manage form data, invoices, selected invoice, and customers
  const [formData, setFormData] = useState({
    customerName: '',
    tax: 0,
    tip: 0,
    items: [{ itemName: '', quantity: 1, price: 0 }],

  });
  const [invoices, setInvoices] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    fetchAllInvoices();
  }, []);

  // Fetch all invoices and extract unique customer names
  const fetchAllInvoices = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/invoices');
      setInvoices(response.data);
      const uniqueCustomers = [...new Set(response.data.map(invoice => invoice.customerName))];
      setCustomers(uniqueCustomers);
    } catch (error) {
      console.error(error);
    }
  };

  // Handle input change for form fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle input change for item fields
  const handleItemChange = (index, e) => {
    const { name, value } = e.target;
    const items = [...formData.items];
    items[index][name] = value;
    setFormData({ ...formData, items });
  };

  // Add a new item to the invoice
  const addItem = () => {
    setFormData({ ...formData, items: [...formData.items, { itemName: '', quantity: 1, price: 0 }] });
  };

  // Create a new invoice by sending a POST request
  const createInvoice = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/invoices', formData);
      setInvoices([...invoices, response.data]);
      setFormData({
        customerName: '',
        tax: 0,
        tip: 0,
        items: [{ itemName: '', quantity: 1, price: 0 }],

      });
      fetchAllInvoices(); // Refresh customers list
    } catch (error) {
      console.error(error);
    }
  };

  // Retrieve an invoice by ID
  const getInvoice = async (invoiceId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/invoices/${invoiceId}`);
      setSelectedInvoice(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  // Delete an invoice by ID
  const deleteInvoice = async (invoiceId) => {
    try {
      await axios.delete(`http://localhost:5000/api/invoices/${invoiceId}`);
      setInvoices(invoices.filter(invoice => invoice._id !== invoiceId));
      setSelectedInvoice(null);
      fetchAllInvoices(); // Refresh customers list
    } catch (error) {
      console.error(error);
    }
  };

  // Calculate the total amount for an invoice
  const calculateTotalAmount = (invoice) => {
    if (invoice) {
      const itemTotal = invoice.items.reduce((acc, item) => acc + item.quantity * item.price, 0);
      return itemTotal + invoice.tax + invoice.tip;
    }
    return 0;
  };

  // Print the selected customer's invoice details
  // const handlePrint = (customerName) => {
  //   const customerInvoices = invoices.filter(invoice => invoice.customerName === customerName);
  //   if (customerInvoices.length > 0) {
  //     setSelectedInvoice(customerInvoices[0]);
  //   }
  // };



  // Print the selected customer's invoice details
  // const handlePrint = (customerName, userId) => {
  //   const customerInvoices = invoices.filter(invoice => invoice.customerName === customerName && invoice.userId === userId);
  //   let totalAmount = 0;
  //   const billDetails = customerInvoices.map(invoice => {
  //     totalAmount += calculateTotalAmount(invoice);
  //     return `
  //     Customer Name: ${invoice.customerName}
  //     User ID: ${invoice.userId}
  //     Total Amount: ${calculateTotalAmount(invoice)}
  //     ${invoice.items.map(item => `Item: ${item.itemName}, Quantity: ${item.quantity}, Price: ${item.price}`).join('\n')}
  //     Tax: ${invoice.tax}
  //     Tip: ${invoice.tip}
  //     -------------------------------
  //   `;
  //   }).join('\n');
  //   // Append total amount to bill details
  //   const totalBillDetails = `${billDetails}Total: ${totalAmount}`;
  //   alert(`Bill Details:${totalBillDetails}`);
  // };



  // const handlePrint = (customerName, userId) => {
  //   const currentDate = new Date().toLocaleDateString();
  //   const currentTime = new Date().toLocaleTimeString();
  //   const customerInvoices = invoices.filter(invoice => invoice.customerName === customerName && invoice.userId === userId);
  //   let totalAmount = 0;
  //   const billDetails = customerInvoices.map(invoice => {
  //     totalAmount += calculateTotalAmount(invoice);
  //     return `
  //     Customer Name: ${invoice.customerName}
  //     User ID: ${invoice.userId}
  //     Date: ${currentDate}
  //     Time: ${currentTime}
  //     Total Amount: ${calculateTotalAmount(invoice)}
  //     ${invoice.items.map(item => `Item: ${item.itemName}, Quantity: ${item.quantity}, Price: ${item.price}`).join('\n')}
  //     Tax: ${invoice.tax}
  //     Tip: ${invoice.tip}
  //     -------------------------------
  //   `;
  //   }).join('\n');
  //   // Append total amount to bill details
  //   const totalBillDetails = `${billDetails}Total: ${totalAmount}`;
  //   alert(`Bill Details:${totalBillDetails}`);
  // };


  const handlePrint = (customerName, userId) => {
    const currentDate = new Date().toLocaleDateString();
    const currentTime = new Date().toLocaleTimeString();
    const customerInvoices = invoices.filter(invoice => invoice.customerName === customerName && invoice.userId === userId);
    let totalAmount = 0;
    const billDetails = customerInvoices.map(invoice => {
      totalAmount += calculateTotalAmount(invoice);
      return `
      <div>
        <p>Customer Name: ${invoice.customerName}</p>
        <p>User ID: ${invoice.userId}</p>
        <p>Date: ${currentDate}</p>
        <p>Time: ${currentTime}</p>
        <p>Total Amount: ${calculateTotalAmount(invoice)}</p>
        <div>
          ${invoice.items.map(item => `<p>Item: ${item.itemName}, Quantity: ${item.quantity}, Price: ${item.price}</p>`).join('')}
        </div>
        <p>Tax: ${invoice.tax}</p>
        <p>Tip: ${invoice.tip}</p>
        <hr>
      </div>
    `;
    }).join('');
    // Append total amount to bill details
    const totalBillDetails = `
      <div>
        ${billDetails}
        <p>Total: ${totalAmount}</p>
      </div>
    `;

    // Open a new window and print the bill
    const printWindow = window.open('', '', 'width=800,height=600');
    printWindow.document.write(`
      <html>
        <head>
          <title>Bill Details</title>
        </head>
        <body>
          ${totalBillDetails}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };



  // Calculate the total amount for the selected customer
  const handleBill = (customerName) => {
    const customerInvoices = invoices.filter(invoice => invoice.customerName === customerName);
    const totalAmount = customerInvoices.reduce((acc, invoice) => acc + calculateTotalAmount(invoice), 0);
    alert(`Total Amount for ${customerName}: ${totalAmount}`);
  };

  // Delete all invoices for the selected customer
  const handleDelete = (customerName) => {
    const customerInvoices = invoices.filter(invoice => invoice.customerName === customerName);
    customerInvoices.forEach(invoice => deleteInvoice(invoice._id));
  };

  return (
    <div className="App">
      <Cursor></Cursor>
      {/* <h1>Invoice Management</h1> */}
      <div className="form">
        <h1>Invoice Management</h1>
        <input name="customerName" value={formData.customerName} onChange={handleChange} placeholder="Customer Name" />
        <input type="number" name="tax" value={formData.tax} onChange={handleChange} placeholder="Tax" />
        <input type="number" name="tip" value={formData.tip} onChange={handleChange} placeholder="Tip" />
        {/* <input name="userId" value={formData.userId} onChange={handleChange} placeholder="User ID" /> */}
        {formData.items.map((item, index) => (
          <div key={index} className="item">
            <input name="itemName" value={item.itemName} onChange={(e) => handleItemChange(index, e)} placeholder="Item Name" />
            <input type="number" name="quantity" value={item.quantity} onChange={(e) => handleItemChange(index, e)} placeholder="Quantity" />
            <input type="number" name="price" value={item.price} onChange={(e) => handleItemChange(index, e)} placeholder="Price" />
          </div>
        ))}
        <button onClick={addItem}>Add Item</button>
        <button onClick={createInvoice}>Create Invoice</button>
      </div>

      <div className="customer-invoices">
        <h2>Customers and Invoices</h2>
        {customers.map((customerName, index) => (
          <div key={index} className="customer-section">
            <h3>Customer Name: {customerName}</h3>
            <div className="invoice-actions">
              <button onClick={() => handlePrint(customerName)} className='printbtn'>Print</button>
              <button onClick={() => handleBill(customerName)} className='totalbtn'>Total Bill</button>
              <button onClick={() => handleDelete(customerName)} className='deletebtn'>Delete</button>
            </div>
          </div>
        ))}
      </div>

      {selectedInvoice && (
        <div className="invoice-details">
          <h2>Invoice Details</h2>
          <p>Customer Name: {selectedInvoice.customerName}</p>
          {selectedInvoice.items.map((item, index) => (
            <div key={index}>
              <p>Item Name: {item.itemName}</p>
              <p>Quantity: {item.quantity}</p>
              <p>Price: {item.price}</p>
            </div>
          ))}
          <p>Tax: {selectedInvoice.tax}</p>
          <p>Tip: {selectedInvoice.tip}</p>
          <p>Total Amount: {calculateTotalAmount(selectedInvoice)}</p>
        </div>
      )}
    </div>
  );
}

export default App;
