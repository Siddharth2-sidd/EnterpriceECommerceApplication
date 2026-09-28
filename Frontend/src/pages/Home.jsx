import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1> Welcome to Enterprise ECommerce </h1>
          <p> Discover quality products at great prices.  </p>
          <Link  to="/products"  className="hero-button"> Shop Now </Link>
        </div>
      </section>

      {/* Features */}
      <section className="features-section">
        <div className="feature-card">
          <h3>Quality Products</h3>
          <p> Find products from trusted brands. </p>
        </div>

        <div className="feature-card">
          <h3>Secure Payment</h3>
          <p> Safe and secure checkout experience.</p>
        </div>

        <div className="feature-card">
          <h3>Fast Delivery</h3>
          <p> Get your orders delivered quickly. </p>
        </div>
      </section>

      {/* Product CTA */}
      <section className="products-cta">
        <h2> Explore Our Products </h2>
        <p>  Browse our complete product catalog. </p>
        <Link to="/products" className="cta-button" > View Products </Link>
      </section>

    </div>
  );
};

export default Home;