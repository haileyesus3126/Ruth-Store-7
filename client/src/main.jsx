import React from 'react';//Imports the React runtime so JSX can compile.
import ReactDOM from 'react-dom/client';//This is what connects React to the actual HTML DOM.The /client part is new in React 18 (before it was just react-dom).
import { BrowserRouter } from 'react-router-dom';//This enables routing (switching pages via URL without reloading).
import App from './App';//Imports your main App component.
import './index.css';//Imports the global stylesheet.
import "./styles/enhancements.css";
import "./styles/newsletter-enhancements.css";
import "./styles/product-enhancements.css";
import "./styles/recently-enhancements.css";
import "./styles/about-enhancements.css";
import "./styles/brands-enhancements.css";
import "./styles/cart-enhancements.css";
import "./styles/collection-enhancements.css";
import "./styles/contact-enhancements.css";
import "./styles/profile-enhancements.css";
import "./styles/holidays-enhancements.css";

import "./styles/interests-enhancements.css";
import "./styles/policy-enhancements.css";
import "./styles/auth-enhancements.css";
import "./styles/orders-enhancements.css";
import "./styles/place-order-enhancements.css";
import "./styles/wishlist-enhancements.css";


import ShopContextProvider from './context/ShopContext';//A Context Provider that shares data/functions (like cart, products, addToCart) with any component
//Think of it as your "global data store".

ReactDOM.createRoot(document.getElementById('root')).render(//document.getElementById('root') grabs <div id="root"></div> in index.html.
  <BrowserRouter>
  <ShopContextProvider>
    <App />
  </ShopContextProvider>
    
  </BrowserRouter>
);
