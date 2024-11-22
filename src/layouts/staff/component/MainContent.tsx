import React from 'react';
import TableList from './TableList'; // Make sure this import points to the correct path

interface MainContentProps {
  content: 'home' | '2nd_floor' | 'gdeli' | 'setting';
}

const MainContent: React.FC<MainContentProps> = ({ content }) => {
  return (
    <main className="main" id='main'>
      {content === 'home' && <TableList area="home" />}
      {content === '2nd_floor' && <TableList area="2nd_floor" />}
      {content === 'gdeli' && <TableList area="gdeli" />}
      {content === 'setting' && <h1>Cài Đặt</h1>}
    </main>
  );
};

export default MainContent;
