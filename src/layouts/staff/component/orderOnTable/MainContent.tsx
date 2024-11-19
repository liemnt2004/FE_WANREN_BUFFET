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
  | 'mushroom'
  | 'wine';
  cartItems: { product: ProductModel; quantity: number; note: string; totalPrice: number }[];
  setCartItems: React.Dispatch<
    React.SetStateAction<{ product: ProductModel; quantity: number; note: string; totalPrice: number }[]>
  >;
  area: 'Table' | 'GDeli';
}

const MainContent: React.FC<MainContentProps> = ({ content, cartItems, setCartItems, area }) => {
  return (
    <main className="main" id='main'>
      {content === 'hotpot' && <ProductList category={'hotpot'} cartItems={cartItems} setCartItems={setCartItems} area={area}/>}
      {content === 'meat' && <ProductList category={'meat'} cartItems={cartItems} setCartItems={setCartItems} area={area}/>}
      {content === 'seafood' && <ProductList category={'seafood'} cartItems={cartItems} setCartItems={setCartItems} area={area}/>}
      {content === 'meatballs' && <ProductList category={'meatballs'} cartItems={cartItems} setCartItems={setCartItems} area={area}/>}
      {content === 'vegetables' && <ProductList category={'vegetables'} cartItems={cartItems} setCartItems={setCartItems} area={area}/>}
      {content === 'noodles' && <ProductList category={'noodles'} cartItems={cartItems} setCartItems={setCartItems} area={area}/>}
      {content === 'buffet_tickets' && <ProductList category={'buffet_tickets'} cartItems={cartItems} setCartItems={setCartItems} area={area}/>}
      {content === 'dessert' && <ProductList category={'dessert'} cartItems={cartItems} setCartItems={setCartItems} area={area}/>}
      {content === 'mixers' && <ProductList category={'mixers'} cartItems={cartItems} setCartItems={setCartItems} area={area}/>}
      {content === 'cold_towel' && <ProductList category={'cold_towel'} cartItems={cartItems} setCartItems={setCartItems} area={area}/>}
      {content === 'soft_drinks' && <ProductList category={'soft_drinks'} cartItems={cartItems} setCartItems={setCartItems} area={area}/>}
      {content === 'beer' && <ProductList category={'beer'} cartItems={cartItems} setCartItems={setCartItems} area={area}/>}
      {content === 'wine' && <ProductList category={'wine'} cartItems={cartItems} setCartItems={setCartItems} area={area}/>}
      {content === 'mushroom' && <ProductList category={'mushroom'} cartItems={cartItems} setCartItems={setCartItems} area={area}/>}
    </main>
  );
};

export default MainContent;
