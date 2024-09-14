
import './App.css';
import { useEffect, useState } from 'react';

function App() {
  const [name, setName] = useState('');
  const [datetime, setDatetime] = useState('');
  const [description, setDescription] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentTransactionId, setCurrentTransactionId] = useState(null);

  useEffect(() => {
    getTransactions().then((data) => setTransactions(data.reverse()));
  }, []);

  async function getTransactions() {
    const url = process.env.REACT_APP_API_URL + '/transactions';
    const response = await fetch(url);
    return await response.json();
  }

  async function addNewTransaction(e) {
    e.preventDefault();
    const url = process.env.REACT_APP_API_URL + '/transaction';
    const price = parseFloat(name.split(' ')[0]);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          price,
          name: name.substring(price.toString().length + 1),
          datetime,
          description,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Server Error:', errorData);
        return;
      }

      const newTransaction = await response.json();
      setTransactions((prevTransactions) => [...prevTransactions, newTransaction]);
      setName('');
      setDatetime('');
      setDescription('');
      console.log('Result:', newTransaction);
    } catch (error) {
      console.error('Fetch Error:', error);
    }
  }

  async function updateTransaction(e) {
    e.preventDefault();
    const url = `${process.env.REACT_APP_API_URL}/transaction/${currentTransactionId}`;
    const price = parseFloat(name.split(' ')[0]);

    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          price,
          name: name.substring(price.toString().length + 1),
          datetime,
          description,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Server Error:', errorData);
        return;
      }

      const updatedTransaction = await response.json();
      setTransactions((prevTransactions) =>
        prevTransactions.map((transaction) =>
          transaction._id === updatedTransaction._id ? updatedTransaction : transaction
        )
      );
      setName('');
      setDatetime('');
      setDescription('');
      setIsEditing(false);
      setCurrentTransactionId(null);
      console.log('Updated:', updatedTransaction);
    } catch (error) {
      console.error('Fetch Error:', error);
    }
  }

  async function deleteTransaction(id) {
    const url = `${process.env.REACT_APP_API_URL}/transaction/${id}`;

    try {
      const response = await fetch(url, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Server Error:', errorData);
        return;
      }

      const result = await response.json();
      setTransactions((prevTransactions) =>
        prevTransactions.filter((transaction) => transaction._id !== id)
      );

      if (isEditing && currentTransactionId === id) {
        setIsEditing(false);
        setCurrentTransactionId(null);
        setName('');
        setDatetime('');
        setDescription('');
      }

      console.log(result.message);
    } catch (error) {
      console.error('Fetch Error:', error);
    }
  }

  function initiateEdit(transaction) {
    setIsEditing(true);
    setCurrentTransactionId(transaction._id);
    setName(`${transaction.price} ${transaction.name}`);
    setDatetime(transaction.datetime.slice(0, 16)); // Adjusting for datetime-local input
    setDescription(transaction.description);
  }

  function formatDateTime(datetimeStr) {
    const date = new Date(datetimeStr);
    if (isNaN(date)) return 'Invalid Date';
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };
    return date.toLocaleString(undefined, options);
  }

  let balance = 0;
  for (const transaction of transactions) {
    balance += transaction.price;
  }

  balance = balance.toFixed(2);
  const cents = balance.split('.')[1];
  balance = balance.split('.')[0];

  return (
    <main>
      <h1>
        ${balance}
        <span>.{cents}</span>
      </h1>
      <form onSubmit={isEditing ? updateTransaction : addNewTransaction}>
        <div className='basics'>
          <input
            type='text'
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={'+200 TV'}
            required
          />
          <input
            type='datetime-local'
            value={datetime}
            onChange={(e) => setDatetime(e.target.value)}
            required
          />
        </div>
        <div className='description'>
          <input
            type='text'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={'Description'}
            required
          />
        </div>
        <button type='submit'>{isEditing ? 'Update Transaction' : 'Add Transaction'}</button>
        {isEditing && (
          <button
            type='button'
            onClick={() => {
              setIsEditing(false);
              setCurrentTransactionId(null);
              setName('');
              setDatetime('');
              setDescription('');
            }}
          >
            Cancel
          </button>
        )}
      </form>

      <div className='transactions'>
        {transactions.length > 0 &&
          transactions.map((transaction) => (
            <div className='transaction' key={transaction._id}>
              <div className='left'>
                <div className='name'>{transaction.name}</div>
                <div className='description'>{transaction.description}</div>
              </div>
              <div className='right'>
                <div className={'price ' + (transaction.price < 0 ? 'red' : 'green')}>
                  {transaction.price}
                </div>
                <div className='datetime'>{formatDateTime(transaction.datetime)}</div>
                <button onClick={() => initiateEdit(transaction)}>Edit</button>
                <button onClick={() => deleteTransaction(transaction._id)}>Delete</button>
              </div>
            </div>
          ))}
      </div>
    </main>
  );
}

export default App;