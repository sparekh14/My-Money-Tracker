
import './App.css';
import { useState } from 'react';

function App() {
  const [name, setName] = useState('');
  const [datetime, setDatetime] = useState('');
  const [description, setDescription] = useState('');

  function addNewTransaction(e) {
    e.preventDefault();
    const url = process.env.REACT_APP_API_URL + '/transaction';

    const price = name.split(' ')[0];


    fetch(url, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        price,
        name: name.substring(price.length + 1),
        datetime,
        description})
    }).then(res => {
      res.json().then(json => {
        setName('');
        setDatetime('');
        setDescription('');
        console.log('result',json);
      });
    });
  }

  return (
    <main>
      <h1>$400<span>.00</span></h1>
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
        <div className='transaction'>
          <div className='left'>
            <div className='name'>New TV</div>
            <div className='description'>Needed new TV</div>
          </div>
          <div className='right'>
            <div className='price red'>-$200</div>
            <div className='datetime'>2024-01-01 12:00</div>
          </div>
        </div>

        <div className='transaction'>
          <div className='left'>
            <div className='name'>Salary</div>
            <div className='description'>Needed new TV</div>
          </div>
          <div className='right'>
            <div className='price green'>+$700</div>
            <div className='datetime'>2024-01-01 12:00</div>
          </div>
        </div>

        <div className='transaction'>
          <div className='left'>
            <div className='name red'>New Shoes</div>
            <div className='description'>Needed new TV</div>
          </div>
          <div className='right'>
            <div className='price red'>-$200</div>
            <div className='datetime'>2024-01-01 12:00</div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default App;
