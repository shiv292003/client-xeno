import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = 'https://shiv-contact.cyclic.app/api';

// Login component
const Login = ({ handleLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };
  
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };
   
  // const goto = window.navigator

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLogin(username, password);
    // goto('/contacts') 
  };

  return (
    <div className='flex flex-col items-center justify-center mt-20 '>
      <form onSubmit={handleSubmit} className='p-10  bg-gray-300 flex flex-col gap-4 border-[10px] border-black rounded-xl '>
      <h2 className='text-3xl text-center font-bold '>Login</h2>
        <label className='font-medium flex flex-col gap-2'>
          Username:
          <input type="text" value={username} onChange={handleUsernameChange} className='p-3' />
        </label>
        {/* <br /> */}
        <label className='font-medium flex flex-col gap-2'>
          Password:
          <input type="password" value={password} onChange={handlePasswordChange} className='p-3'/>
        </label>
        {/* <br /> */}
        <button type="submit" className='p-4 border-2 border-white bg-slate-700 text-white hover:bg-black hover:text-blue-200 duration-75 rounded-xl font-bold text-lg '>Login</button>
      </form>
    </div>
  );
};

// Signup component
const Signup = ({ handleSignup }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSignup(username, password);
  };

  return (
    <div className='flex flex-col items-center justify-center mt-20 '>
      <form onSubmit={handleSubmit} className='p-10  bg-gray-300 flex flex-col gap-4 border-[10px] border-black rounded-xl'>
      <h2 className='text-3xl text-center font-bold '>Signup</h2>
        <label className='font-medium flex flex-col gap-2'>
          Username:
          <input type="text" value={username} onChange={handleUsernameChange} className='p-3' />
        </label>
        {/* <br /> */}
        <label className='font-medium flex flex-col gap-2'>
          Password:
          <input type="password" value={password} onChange={handlePasswordChange} className='p-3' />
        </label>
        {/* <br /> */}
        <button type="submit" className='p-4 border-2 border-white bg-slate-700 text-white hover:bg-black hover:text-blue-200 duration-75 rounded-xl font-bold text-lg '>Signup</button>
      </form>
    </div>
  );
};


 

// Contacts component
const Contacts = ({handleUpdate, contacts, handleAddContact , setContacts}) => {

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [editingContactId, setEditingContactId] = useState(null);
 
  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePhoneNumberChange = (e) => {
    setPhoneNumber(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if(editingContactId)
    handleUpdate(editingContactId,name, email, phoneNumber);
    else
    handleAddContact(name, email, phoneNumber);
    setName('');
    setEmail('');
    setPhoneNumber('');
    
  };
   

  const handleEdit = (contact) => {
    setName(contact.name);
    setEmail(contact.email);
    setPhoneNumber(contact.phoneNumber);
    setEditingContactId(contact._id);
  };


  const handelDelete = async (key) =>{
    // const key = e.target.key;
    await axios.delete(`${API_BASE_URL}/contacts/${key}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    setContacts ( contacts.filter((item)=>
       item._id !== key
    ) )
    // console.log(e.target);
  }

  return (
    <div className='flex items-center justify-between p-10  '>
      <form onSubmit={handleSubmit} className='p-10  bg-gray-300 flex flex-col gap-4 border-[10px] border-black rounded-xl'>
      <h2 className='text-3xl text-center font-bold '>Contacts</h2>
        <label className='font-medium flex flex-col gap-2'>
          Name:
          <input type="text" value={name} onChange={handleNameChange} className='p-3' />
        </label>
        {/* <br /> */}
        <label className='font-medium flex flex-col gap-2'>
          Email:
          <input type="email" value={email} onChange={handleEmailChange} className='p-3'/>
        </label>
        {/* <br /> */}
        <label className='font-medium flex flex-col gap-2'>
          Phone Number:
          <input type="text" value={phoneNumber} onChange={handlePhoneNumberChange} className='p-3'/>
        </label>
        {/* <br /> */}
        <button type="submit" className='p-4 border-2 border-white bg-slate-700 text-white hover:bg-black hover:text-blue-200 duration-75 rounded-xl font-bold text-lg '>Add Contact</button>
      </form>

      <ul className='grid grid-cols-12 gap-4 px-4'>
        {contacts.map((contact) => (

          <li key={contact._id} className='p-2  bg-slate-400 border-t-2 col-span-3 '>
            <strong>Name:</strong> {contact.name}<br />
            <strong>Email:</strong> {contact.email}<br />
            <strong>Phone Number:</strong> {contact.phoneNumber}

            <button className='font-bold text-red-600' onClick={()=>handelDelete(contact._id)}>Delete</button> <span>&nbsp;</span>
            <button className='font-bold' onClick={() => handleEdit(contact)}>Edit</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

function App() {
  const [contacts, setContacts] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/contacts`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setContacts(response.data);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    }
  };

  const handleLogin = async (username, password) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/login`, { username, password });
      const { token } = response.data;
      localStorage.setItem('token', token);
      setIsLoggedIn(true);
      fetchContacts();
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  const handleSignup = async (username, password) => {
    try {
      await axios.post(`${API_BASE_URL}/register`, { username, password });
      handleLogin(username, password);
    } catch (error) {
      console.error('Error signing up:', error);
    }
  };

  const handleUpdate = async (editingContactId,name, email, phoneNumber) => {
    try {
      await axios.put(
        `${API_BASE_URL}/contacts/${editingContactId}`,
        { name, email, phoneNumber },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      fetchContacts();
    } catch (error) {
      console.error('Error adding contact:', error);
    }
  };

  const handleAddContact = async (name, email, phoneNumber) => {
    try {
      await axios.post(
        `${API_BASE_URL}/contacts`,
        { name, email, phoneNumber },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      fetchContacts();
    } catch (error) {
      console.error('Error adding contact:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setContacts([]);
  };

  return (
    <Router>
      <div className='bg-gradient-to-r from-slate-100 to-slate-500 h-[720px] '>
        <nav>
          <ul className='flex items-center gap-5 px-10 py-6 font-bold bg-black/70 text-white justify-center '>
            <li className='  hover:border-b-2 border-white duration-100 ease-in-out py-2 '>
              <Link to="/">Home</Link>
            </li>
            <li className='  hover:border-b-2 border-white duration-100 ease-in-out py-2 '>
              <Link to="/contacts">Contacts</Link>
            </li>
            {!isLoggedIn && (
              <>
                <li className='  hover:border-b-2 border-white duration-100 ease-in-out py-2 '>
                  <Link to="/login">Login</Link>
                </li>
                <li className='  hover:border-b-2 border-white duration-100 ease-in-out py-2 '>
                  <Link to="/signup">Signup</Link>
                </li>
              </>
            )}
            {isLoggedIn && (
              <li className='  hover:border-b-2 border-white duration-100 ease-in-out py-2 '>
                <button onClick={handleLogout}>Logout</button>
              </li>
            )}
          </ul>
        </nav>

        <Switch>
          <Route exact path="/">
            <h1 className='text-3xl text-center p-4 
            '>Welcome to the Contact App</h1>
            {!isLoggedIn ? (
              <p className=' flex justify-center text-center font-semibold'>Please login or signup to access your contacts.</p>
            ) : (
              <p className=' flex justify-center text-center font-semibold'>
                You are logged in. Go to <Link to="/contacts" className = 'px-1 bg-slate-100 font-bold'>Contacts</Link> to view and manage your
                contacts.
              </p>
            )}
          </Route>
          <Route path="/login">
            <Login handleLogin={handleLogin} />
          </Route>
          <Route path="/signup">
            <Signup handleSignup={handleSignup} />
          </Route>
          <Route path="/contacts">
            {!isLoggedIn ? (
              <p className=' flex justify-center item-center text-center font-semibold px-5 mt-20 text-2xl'>Please login or signup to access your contacts.</p>
            ) : (
              <Contacts
                contacts={contacts}
                setContacts = {setContacts}
                handleUpdate={handleUpdate}
                handleAddContact={handleAddContact}
              />
            )}
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
