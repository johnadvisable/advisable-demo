
const ProductsStyles = () => {
  return (
    <style>
      {`.writing-mode-vertical {
        writing-mode: vertical-rl;
        text-orientation: mixed;
        transform: rotate(180deg);
      }
      .scrollbar-hide::-webkit-scrollbar {
        display: none;
      }
      .scrollbar-hide {
        -ms-overflow-style: none;
        scrollbar-width: none;
      }`}
    </style>
  );
};

export default ProductsStyles;
