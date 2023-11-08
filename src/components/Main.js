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
<<<<<<< HEAD
                            <th scope='col'>사용자 총 투표 횟수</th>
                            <th scope='col'>투표 종료 횟수 </th>
=======
                            <th scope='col'>MVP 토큰</th>
                            <th scope='col'>초기화 횟수</th>
>>>>>>> d88427921c509080ef66fd3b6c422b1eb12db1e7
                        </tr>
                    </thead>
                    <tbody>
                        <tr style={{color:'black'}}>
                            <td>{window.web3.utils.fromWei(this.props.stakingBalance, 'Ether')} USDT</td>
                            {/* replace count function ... 수정 필요 */}
                            <td>{this.props.unstakeCount} 회</td>
                            {/*<td>{window.web3.utils.fromWei(this.props.rwdBalance, 'Ether')} RWD</td>*/}
                        </tr>
                    </tbody>
                </table>
                    <span className='balance-text'>
<<<<<<< HEAD
                        투표 종료까지 남은 투표수: {window.web3.utils.fromWei(this.props.mvpBalance, 'Ether')}
=======
                        관리자 지갑 MVP토큰 개수: {window.web3.utils.fromWei(this.props.mvpBalance, 'Ether')}
>>>>>>> d88427921c509080ef66fd3b6c422b1eb12db1e7
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
                            className='btn btn-send action-btn'>사용자 총 투표 횟수 증가시키기</button>
                        <button 
                            onClick={(event) =>{
                                event.preventDefault(
                                    this.props.unstakeTokens()
                                    //this.props.issueTokens()
                                )
                            }}
                            className='btn btn-take action-btn'>투표 종료 횟수 증가시키기</button>
                    </div>
                </div>
            </div>
        )
    }
}


export default Main;