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
                        
                            <th scope='col'>사용자 총 투표 횟수</th>
                            <th scope='col'>투표 종료 횟수 </th>

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
                        투표 종료까지 남은 투표수: {window.web3.utils.fromWei(this.props.mvpBalance, 'Ether')}
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