
import FullScreenProduct from "../FullScreenProduct";

type Product = {
  id: string;
  title: string;
  description: string;
  website_url: string;
  hero_image: string | null;
  image_url: string | null;
  slug: string;
};

interface ProductsDisplayProps {
  products: Product[];
  activeProductIndex: number;
}

const ProductsDisplay = ({ products, activeProductIndex }: ProductsDisplayProps) => {
  return (
    <div className="scrollbar-hide">
      {products?.map((product, index) => (
        <div id={product.id} key={product.id} className="product-section">
          <FullScreenProduct 
            product={product} 
            isActive={index === activeProductIndex} 
          />
        </div>
      ))}
    </div>
  );
};

export default ProductsDisplay;
