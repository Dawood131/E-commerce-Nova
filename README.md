<h2>Nova E-commerce</h2>

<p><strong>Nova</strong> is a modern, full-featured E-commerce platform built from scratch using <strong>React</strong> and <strong>Redux</strong>. Designed with real-world shopping experiences in mind, Nova provides a smooth, responsive, and intuitive interface for users to browse, search, and purchase products seamlessly.</p>

<h3>Key Features:</h3>
<ul>
  <li><strong>User Authentication:</strong> Secure sign-up, sign-in, and password recovery flows.</li>
  <li><strong>Product Browsing:</strong> Category-wise and collection-wise product listings with search functionality.</li>
  <li><strong>Product Details:</strong> Detailed product pages with carousel images, descriptions, and pricing.</li>
  <li><strong>Shopping Cart & Checkout:</strong> Add to cart, update quantities, and complete purchases with a clean checkout process.</li>
  <li><strong>Wishlist:</strong> Save favorite products for later.</li>
  <li><strong>Order Tracking:</strong> Track your orders in real-time with an easy-to-use interface.</li>
  <li><strong>Responsive Design:</strong> Fully responsive UI for mobile, tablet, and desktop screens.</li>
  <li><strong>State Management:</strong> Built with Redux for efficient state handling across the app.</li>
  <li><strong>Reusable Components:</strong> Modular components for faster development and easier maintenance.</li>
</ul>

<h3>Tech Stack:</h3>
<ul>
  <li><strong>Frontend:</strong> React, Redux</li>
  <li><strong>Styling:</strong> CSS</li>
  <li><strong>State Management:</strong> Redux Toolkit</li>
  <li><strong>Other:</strong> Responsive design, modular component architecture</li>
</ul>

<p><strong>Nova</strong> isn’t just a demo—it’s a project that replicates a real-world E-commerce experience, demonstrating advanced front-end skills, component-based architecture, and attention to UI/UX details.</p>

```.
├── app
│   ├── router.jsx
│   └── store.js
├── assets
│   └── Icons.jsx
├── features
│   ├── Auth
│   │   └── pages
│   │       ├── ForgotPassword.jsx
│   │       ├── SignIn.jsx
│   │       └── SignUp.jsx
│   ├── Cart
│   │   ├── pages
│   │   │   ├── Cart.jsx
│   │   │   └── Checkout.jsx
│   │   ├── cartDrawerSlice.js
│   │   └── cartSlice.js
│   ├── Home
│   │   └── pages
│   │       └── Home.jsx
│   ├── Order
│   │   └── pages
│   │       └── TrackOrder.jsx
│   ├── Products
│   │   ├── components
│   │   │   ├── ProductCard.jsx
│   │   │   ├── ProductCarousel.jsx
│   │   │   └── ProductList.jsx
│   │   ├── data
│   │   │   └── products.js
│   │   ├── pages
│   │   │   ├── Category.jsx
│   │   │   ├── Collection.jsx
│   │   │   ├── ProductPage.jsx
│   │   │   └── Search.jsx
│   │   └── productsSlice.js
│   └── Wishlist
│       ├── pages
│       │   └── Wishlist.jsx
│       └── wishlistSlice.js
├── local
│   └── structure.txt
├── shared
│   ├── components
│   │   ├── Carousel.jsx
│   │   ├── Header.jsx
│   │   ├── PageNotFound.jsx
│   │   ├── Process.jsx
│   │   ├── TopbarTrackorder.jsx
│   │   └── UiModal.jsx
│   ├── Layout
│   │   ├── Footer.jsx
│   │   └── Navbar.jsx
│   └── ui
│       ├── Headings.jsx
│       ├── MainBtn.jsx
│       └── uiModalSlice.js
├── Analytics.js
├── App.jsx
├── index.css
└── main.jsx
```
