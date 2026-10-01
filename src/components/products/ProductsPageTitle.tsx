import { useTranslation } from "react-i18next";

interface ProductsPageTitleProps {
  isScrolled: boolean;
}

const ProductsPageTitle = ({
  isScrolled
}: ProductsPageTitleProps) => {
  const { t } = useTranslation('products');
  return <>
      {/* Large transparent title on the right - inside main flow, not over footer */}
      <div className="absolute right-0 top-0 bottom-0 z-10 pointer-events-none">
        <div className="sticky top-1/2 -translate-y-1/2">
          <h1 className="text-8xl text-white/10 writing-mode-vertical md:text-7xl font-bold mx-[3px]">{t('productsTitle')}</h1>
        </div>
      </div>

      {/* Fixed Title that appears on scroll */}
      <div className={`fixed z-40 right-8 top-20 transition-opacity duration-300 ${isScrolled ? 'opacity-100' : 'opacity-0'}`}>
        
      </div>
    </>;
};
export default ProductsPageTitle;