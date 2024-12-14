import React from 'react';
import TableList from './TableList'; 
import InfoSetting from './InfoSetting';

interface MainContentProps {
  content: 'home' | '2nd_floor' | 'gdeli' | 'setting' | 'theme';
}

const MainContent: React.FC<MainContentProps> = ({ content }) => {
  return (
    <main className="main" id='main'>
      {content === 'home' && <TableList area="home" />}
      {content === '2nd_floor' && <TableList area="2nd_floor" />}
      {content === 'gdeli' && <TableList area="gdeli" />}
      {content === 'setting' && <InfoSetting/>}
    </main>
  );
};

export default MainContent;
