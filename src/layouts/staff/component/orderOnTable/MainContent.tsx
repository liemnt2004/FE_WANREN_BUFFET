import React from 'react';
import ProductList from './ProductList';
import ProductModel from '../../../../models/StaffModels/ProductModel';

interface MainContentProps {
  content:
  | 'hotpot'
  | 'meat'
  | 'seafood'
  | 'meatballs'
  | 'vegetables'
  | 'noodles'
  | 'buffet_tickets'
  | 'dessert'
  | 'mixers'
  | 'cold_towel'
  | 'soft_drinks'
  | 'beer'
  | 'wine'
  | 'mushroom';
  cartItems: { product: ProductModel; quantity: number; note: string; totalPrice: number }[];
  setCartItems: React.Dispatch<React.SetStateAction<{ product: ProductModel; quantity: number; note: string; totalPrice: number }[]>>;
  area: 'Table' | 'GDeli';
}

const MainContent: React.FC<MainContentProps> = ({ content, cartItems, setCartItems, area }) => {
  return (
    <main className="main" id="main">
      <ProductList category={content} cartItems={cartItems} setCartItems={setCartItems} area={area} />
    </main>
  );
};

export default MainContent;
