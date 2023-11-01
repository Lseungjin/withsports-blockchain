import React, { Component } from 'react';
<<<<<<< HEAD
import mvp from '../Ws.png';
=======
import mvp from '../Mvp.png';
>>>>>>> 4dba1e13636c5776dd7694a0d73b602c1d8fd18e
import './Main.css';

class Main extends Component{
    render() {
        return (
            <div id='content' className='main-container'>
                <img src={mvp} alt="Logo" className="logo" />
                <table className = 'table text-muted text-center'>
                    <thead>
                        <tr style={{color:'black'}}>
                            <th scope='col'>보낸 토큰</th>
                            <th scope='col'>Reward 토큰</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr style={{color:'black'}}>
                            <td>{window.web3.utils.fromWei(this.props.stakingBalance, 'Ether')} USDT</td>
                            <td>{window.web3.utils.fromWei(this.props.rwdBalance, 'Ether')} RWD</td>
                        </tr>
                    </tbody>
                </table>
                    <span className='balance-text'>
                        Balance: {window.web3.utils.fromWei(this.props.mvpBalance, 'Ether')}
                    </span>
                <div>
                    <div className='button-container'>
                        <button 
                            onClick={(event) =>{
                                event.preventDefault()
                                let amount
                                amount = window.web3.utils.toWei('1', 'Ether')
                                this.props.stakeTokens(amount)
                            }}
                            className='btn btn-send action-btn'>전송</button>
                        <button 
                            onClick={(event) =>{
                                event.preventDefault(
                                    this.props.unstakeTokens() 
                                )
                            }}
                            className='btn btn-take action-btn'>가져오기</button>
                    </div>
                </div>
            </div>
        )
    }
}


export default Main;
