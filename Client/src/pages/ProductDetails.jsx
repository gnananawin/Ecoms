import { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { Link, useParams } from "react-router-dom";
import { assets } from "../assets/assets";
import ProductCard from "../components/ProductCard";

const ProductDetails = () => {
  const { products, currency, addToCart, navigate } = useAppContext();
  const { id } = useParams();

  const [relatedProducts, setRelatedProducts] = useState([]);
  const [thumbnail, setThumbnail] = useState(null);

  const product = products.find((item) => item._id === id);

  useEffect(() => {
    if (products.length > 0 && product) {
      console.log("Current product:", product);
      console.log("All products:", products);

      const filtered = products.filter(
        (item) =>
          item.category?.toLowerCase() === product.category?.toLowerCase() &&
          item._id !== product._id
      );

      console.log("Filtered related products:", filtered);
      setRelatedProducts(filtered.slice(0, 5));
    }
  }, [products, product]);

  useEffect(() => {
    if (product?.image?.[0]) {
      setThumbnail(product.image[0]);
    }
  }, [product]);

  if (!product) {
    return (
      <div className="text-center mt-10 text-lg text-gray-500">
        Product not found or still loading...
      </div>
    );
  }

  return (
    <div className="mt-12">
      <p>
        <Link to="/">Home</Link> /{" "}
        <Link to="/products">Products</Link> /{" "}
        <Link to={`/products/${product.category}`}>{product.category}</Link> /{" "}
        <span className="text-indigo-500">{product.name}</span>
      </p>

      <div className="flex flex-col md:flex-row gap-10 mt-6">
        <div className="flex gap-3">
          <div className="flex flex-col gap-3">
            {product.image.map((img, i) => (
              <img
                key={i}
                src={img}
                onClick={() => setThumbnail(img)}
                className="w-20 h-20 object-cover border cursor-pointer rounded"
              />
            ))}
          </div>
          <img
            src={thumbnail || product.image[0]}
            className="w-72 h-72 object-cover border rounded"
            alt="Product"
          />
        </div>

        <div className="flex-1 text-sm">
          <h1 className="text-3xl font-bold">{product.name}</h1>

          <div className="flex items-center mt-2 mb-4 gap-1 text-yellow-500">
            {Array(5)
              .fill()
              .map((_, i) => (
                <img
                  key={i}
                  src={i < 4 ? assets.star_icon : assets.star_dull_icon}
                  className="w-4"
                  alt="star"
                />
              ))}
            <span className="ml-2 text-gray-600">(4)</span>
          </div>

          <p className="line-through text-gray-500">
            MRP: {currency}
            {product.price}
          </p>
          <p className="text-2xl font-semibold">
            Offer: {currency}
            {product.offerPrice}
          </p>

          <p className="mt-6 font-medium">About Product:</p>
          <ul className="list-disc ml-5 text-gray-600">
            {(Array.isArray(product.description)
              ? product.description
              : [product.description]
            ).map((desc, i) => (
              <li key={i}>{desc}</li>
            ))}
          </ul>

          <div className="flex gap-4 mt-8">
            <button
              onClick={() => addToCart(product._id)}
              className="bg-gray-100 px-5 py-2 rounded hover:bg-gray-200"
            >
              Add to Cart
            </button>
            <button
              onClick={() => {
                addToCart(product._id);
                navigate("/cart");
              }}
              className="bg-primary text-white px-5 py-2 rounded hover:bg-primary-dull"
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>

      <div className="mt-20">
        <h2 className="text-2xl font-semibold text-center">Related Products</h2>
        <div className="w-20 h-0.5 bg-primary mx-auto my-2"></div>
        {relatedProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-6">
            {relatedProducts.map((item) => (
              <ProductCard key={item._id} product={item} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 mt-6">
            No related products found.
          </p>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
