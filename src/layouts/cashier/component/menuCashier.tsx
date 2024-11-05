import styled from 'styled-components';
import '../assets/css/cashierMenu.css';
import Logo from '../assets/img/logo2.png';



const StyledWrapperSearch = styled.div`
  .input[type = "text"] {
    display: block;
    color: rgb(34, 34, 34);
    background: linear-gradient(142.99deg, rgba(233, 222, 250, 0.63) 15.53%, rgba(251, 252, 219, 0.63) 88.19%);
    box-shadow: 0px 12px 24px -1px rgba(0, 0, 0,0.18);
    border-color: rgba(7, 4, 14, 0);
    border-radius: 50px;
    block-size: 20px;
    margin: 7px auto;
    padding: 18px 15px;
    outline: none;
    text-align: center;
    width: 500px;
    transition: 0.5s;
  }

  .input[type = "text"]:hover {
    width: 580px;
  }

  .input[type = "text"]:focus {
    width: 660px;
  }`;


  const StyledWrapperMenu = styled.div`
  #navbody {
    width: 300px;
    height: 60px;
    background-color: rgb(255, 255, 255);
    border-radius: 40px;
    box-shadow: 0px 10px 15px rgba(0, 0, 0, 0.041);
    align-items: center;
    justify-content: center;
    display: flex;
  }

  .ul {
    list-style: none;
    width: 100%;
    background-color: transparent;
    display: flex;
    justify-content: space-between;
  }

  .ul .li {
    display: inline-block;
  }

  .radio {
    display: none;
  }

  .svg {
    width: 70px;
    height: 70px;
    opacity: 80%;
    cursor: pointer;
    padding: 13px 20px;
    transition: 0.2s;
  }

  .ul .li .svg:hover {
    transition: 0.1s;
    color: #0d6efd;
    position: relative;
    margin-top: -4px;
    opacity: 100%;
  }

  .radio:checked + label .li .svg {
    color: #0d6efd;
    fill-rule: evenodd;
  }`;



const menuCashier = () => {
    return(
        
<div className="d-flex align-items-center justify-content-between p-3 border rounded shadow-lg">
    {/* Logo bên trái */}
    <div className="logo d-flex align-items-center">
        
        <img src={Logo} alt="Warent-Buffet" style={{width:125}} />
    </div>
    
    {/* Khung tìm kiếm ở giữa */}
    
    <StyledWrapperSearch>
      <input type="text" name="text" placeholder="Tìm kiếm từ khóa!" className="input" />
    </StyledWrapperSearch>
    
    
    {/* User và Settings ở bên phải */}
    <div className="d-flex align-items-center">



    <StyledWrapperMenu>
      <div id="navbody">
        <form action="#" className='d-flex align-items-center p-0 m-0'>
          <ul className="ul p-0 m-0">
            <input defaultChecked name="rad" className="radio" id="choose1" type="radio" />
            <label htmlFor="choose1">
              <li className="li">
                <svg viewBox="0 0 24 24" fill="none" height={24} width={24} xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="svg w-6 h-6 text-gray-800 dark:text-white">
                  <path d="m4 12 8-8 8 8M6 10.5V19a1 1 0 0 0 1 1h3v-3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3h3a1 1 0 0 0 1-1v-8.5" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" stroke="currentColor" />
                </svg>
              </li>
            </label>
            <input className="radio" name="rad" id="choose2" type="radio" />
            <label htmlFor="choose2">
              <li className="li">
                <svg viewBox="0 0 24 24" fill="none" height={24} width={24} xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="svg w-6 h-6 text-gray-800 dark:text-white">
                  <path d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z" strokeWidth={2} strokeLinecap="round" stroke="currentColor" />
                </svg>
              </li>
            </label>
            <input className="radio" name="rad" id="choose3" type="radio" />
            <label htmlFor="choose3">
              <li className="li">
              <svg viewBox="0 0 24 24" fill="none" height={24} width={24} xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="svg w-6 h-6 text-gray-800 dark:text-white">
                <path d="M21 12c0 4.97-4.03 9-9 9a9.933 9.933 0 0 1-4.74-1.2L3 21l1.2-4.26A9.933 9.933 0 0 1 3 12c0-4.97 4.03-9 9-9s9 4.03 9 9Z" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" stroke="currentColor" />
                </svg>

              </li>
            </label>
            <input className="radio" name="rad" id="choose4" type="radio" />
            <label htmlFor="choose4">
              <li className="li">
                <svg viewBox="0 0 24 24" fill="none" height={24} width={24} xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="svg w-6 h-6 text-gray-800 dark:text-white">
                  <path d="M10 19H5a1 1 0 0 1-1-1v-1a3 3 0 0 1 3-3h2m10 1a3 3 0 0 1-3 3m3-3a3 3 0 0 0-3-3m3 3h1m-4 3a3 3 0 0 1-3-3m3 3v1m-3-4a3 3 0 0 1 3-3m-3 3h-1m4-3v-1m-2.121 1.879-.707-.707m5.656 5.656-.707-.707m-4.242 0-.707.707m5.656-5.656-.707.707M12 8a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" strokeWidth={2} strokeLinejoin="round" strokeLinecap="square" stroke="currentColor" />
                </svg>
              </li>
            </label>
          </ul>
        </form>
      </div>
    </StyledWrapperMenu>


    </div>
</div>


        
    )  
}
export default menuCashier