
import './App.css';
import { useEffect, useState } from 'react';

function App() {
  const [name, setName] = useState('');
  const [datetime, setDatetime] = useState('');
  const [description, setDescription] = useState('');
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    getTransactions().then(setTransactions);
  }, [])

  function formatDateTime(datetimeStr) {
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };
    const date = new Date(datetimeStr);
    return date.toLocaleString(undefined, options);
  }

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

  let balance = 0;
  for (const transaction of transactions) {
    balance += transaction.price;
  }

  balance = balance.toFixed(2);
  const cents = balance.split('.')[1];
  balance = balance.split('.')[0];

  return (
    <main>
      <h1>${balance}<span>.{cents}</span></h1>
      <form onSubmit={addNewTransaction}>
        <div className='basics'>
          <input type="text" 
                 value={name}
                 onChange={e => setName(e.target.value)}
                 placeholder={"+200 TV"} />
          <input type="datetime-local"
                 value={datetime}
                 onChange={e => setDatetime(e.target.value)} />
        </div>
        <div className='description'>
          <input type="text" 
                 value={description}
                 onChange={e => setDescription(e.target.value)}
                 placeholder={"Description"} />
        </div>
        <button type="submit">Add Transaction</button>
      </form>

      <div className='transactions'>
        {transactions.length > 0 && transactions.map(transaction => (
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
          </div>
          </div>
        ))}
      </div>
    </main>
  );
}

export default App;
