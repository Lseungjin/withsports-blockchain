import React, { Component } from 'react';
import mvp from '../Mvp.png';
import './Main.css';

class Main extends Component{
    render() {
        return (
            <div id='content' className='main-container'>
                <img src={mvp} alt="Logo" className="logo" />
                <table className = 'table text-muted text-center'>
                    <thead>
                        <tr style={{color:'black'}}>
                            <th scope='col'>MVP 토큰</th>
                            <th scope='col'>초기화 횟수</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr style={{color:'black'}}>
                            <td>{window.web3.utils.fromWei(this.props.stakingBalance, 'Ether')} USDT</td>
                            {/* replace count function */}
                            <td>{this.props.unstakeCount} 회</td>
                            {/*<td>{window.web3.utils.fromWei(this.props.rwdBalance, 'Ether')} RWD</td>*/}
                        </tr>
                    </tbody>
                </table>
                    <span className='balance-text'>
                        관리자 지갑 MVP토큰 개수: {window.web3.utils.fromWei(this.props.mvpBalance, 'Ether')}
                    </span>
                <div>
                    <div className='button-container'>
                        <button 
                            onClick={(event) =>{
                                event.preventDefault()
                                let amount
                                amount = window.web3.utils.toWei('10000', 'Ether')
                                this.props.stakeTokens(amount)
                            }}
                            className='btn btn-send action-btn'>전송</button>
                        <button 
                            onClick={(event) =>{
                                event.preventDefault(
                                    this.props.unstakeTokens()
                                    //this.props.issueTokens()
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