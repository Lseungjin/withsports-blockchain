import React, {Component} from 'react';
import './App.css';
import Web3 from 'web3';
import Mvp from '../truffle_abis/Mvp.json'
import RWD from '../truffle_abis/RWD.json'
import Admin from '../truffle_abis/Admin.json'
import Main from './Main.js'
import Navbar from './Navbar.js'

class App extends Component{

    async UNSAFE_componentWillMount(){
        await this.loadWeb3()
        await this.loadBlockchainData()
    }
    async loadWeb3() {
        if(window.ethereum){
            window.web3 = new Web3(window.ethereum)
            await window.ethereum.enable()
        } else if(window.web3){
                window.web3 = new Web3(Window.web3.currentProvider)
            } else{
                window.alert('관리자님 이더리움 브라우저가 감지되지 않았습니다! MetaMask를 연결을 확인해 보세요!')
            }
        }

    async loadBlockchainData(){
        const web3 = window.web3
        const account = await web3.eth.getAccounts()
        this.setState({account: account[0]})
        const networkId = await web3.eth.net.getId()
        
        console.log(account) //정상적으로 불러오는지 확인용
        console.log(networkId, 'network Id') //정상적으로 불러오는지 확인용

        //Load Mvp Contract
        
        const mvpData = Mvp.networks[networkId]
        if(mvpData){
            const mvp = new web3.eth.Contract(Mvp.abi, mvpData.address)
            this.setState({mvp})
            let mvpBalance = await mvp.methods.balanceOf(this.state.account).call()
            this.setState({mvpBalance: mvpBalance.toString() })
            console.log({balance: mvpBalance})
        }else{
            window.alert('MVP 계약이 배포되지 않았습니다. - 네트워크 연결을 확인할 수 없어요.')
        }
        
        // TODO : 수정 필요
        // 로컬 스토리지에 저장된 횟수를 가져와 상태에 설정
        const unstakeCount = Number(localStorage.getItem('unstakeCount') || 0);
        this.setState({ unstakeCount });


        //Load RWD Contract
        const rwdData = RWD.networks[networkId]
        
        if(rwdData){
            const rwd = new web3.eth.Contract(RWD.abi, rwdData.address)
            this.setState({rwd})
            let rwdBalance = await rwd.methods.balanceOf(this.state.account).call()
            this.setState({rwdBalance: rwdBalance.toString() })
            console.log({rwdbalance: rwdBalance}) 
        }else{ 
            window.alert('RWD 계약이 배포되지 않았습니다. - 네트워크 연결을 확인할 수 없어요.') 
        }

        //Load Admin Contract
        const adminData = Admin.networks[networkId]
          if(adminData) {
            const admin = new web3.eth.Contract(Admin.abi, adminData.address)
            this.setState({admin})
            let stakingBalance = await admin.methods.stakingBalance(this.state.account).call()
            this.setState({ stakingBalance: stakingBalance.toString()})
          } else {
            window.alert("TokenForm contract not deployed to detect network")
          }

          this.setState({loading: false})
    }    

    //staking function
    stakeTokens = (amount) => {
        // 잔액이 0인지 확인
        if(this.state.mvpBalance === '0'){
            alert('잔액이 없습니다.')
            return;
        }
        this.setState({loading: true })
        this.state.mvp.methods.approve(this.state.admin._address, amount).send({from: this.state.account}).on('transactionHash', (hash) => {
        this.state.admin.methods.depositTokens(amount).send({from: this.state.account}).on('transactionHash', (hash) => {
        window.location.reload(); // page reload
            })
        })
        
    }

    //unstaking function
    unstakeTokens = () => {
        if ( this.state.mvpBalance !== '0' || this.state.stakingBalance === '0') {
            alert('가져올 수 없습니다.');
            return;
        }

        this.setState({loading: true })
        this.state.admin.methods.unstakeTokens().send({from: this.state.account}).on('transactionHash', (hash) => {
        // TODO: 수정 필요 
        // 로컬 스토리지에 저장된 횟수를 가져와서 1 증가시킨 후 다시 저장
        const unstakeCount = Number(localStorage.getItem('unstakeCount') || 0) + 1;
        localStorage.setItem('unstakeCount', unstakeCount.toString());
        window.location.reload(); // page reload
    })
        


    }
    //issueTokens function
    issueTokens = () => {
        this.setState({ loading: true });
        this.state.admin.methods.issueTokens().send({ from: this.state.account }).on('transactionHash', (hash) => {
            // this.setState({ loading: false });
            window.location.reload(); // page reload
        })
    }
    
    

    constructor(props){
        super(props)
        this.state ={
            account: '0x0',
            mvp: {},
            //rwd: {},
            admin: {},
            mvpBalance: '0',
            rwdBalance: '0',
            stakingBalance: '0',
            loading: true,
            // TODO:  수정 필요
            unstakeCount: 0
        }
    }

    //Our React Code goes in here!
    render() {
        let content
        {this.state.loading ? content = 
        <p id='loader' className='text-center' style={{margin:'30px', color:'white'}}>
        Loding PLEASE...</p>: content = 
        <Main
            mvpBalance={this.state.mvpBalance}
            //rwdBalance={this.state.rwdBalance}
            stakingBalance={this.state.stakingBalance}
            stakeTokens={this.stakeTokens}
            unstakeTokens={this.unstakeTokens}
            issueTokens={this.issueTokens}
            // TODO : 수정 필요
            unstakeCount={this.state.unstakeCount}
        />}
        return (
            <div className='App' style={{position:'relative'}}>
                <div style={{positiona:'absoulte'}}>
                </div>
                <Navbar account={this.state.account}/>
                <div className='container-fluid mt-5'>
                    <div className='row'>
                        <main role='main' className='col-lg-12 ml-auto mr-auto' style={{maxWidth:'600px', minHeight:'100vm'}}>
                            <div>
                                {content}
                            </div>
                        </main>
                    </div>
                </div>
            </div>
        )
    }
}
export default App;



















/*import React, {Component} from 'react';
import './App.css';
import Web3 from 'web3';

import Main from './Main.js'
import Navbar from './Navbar.js'


class App extends Component{

    async UNSAFE_componentWillMount(){
        await this.loadWeb3()
        await this.loadBlockchainData()
    }
    async loadWeb3() {
        if(window.ethereum){
            window.web3 = new Web3(window.ethereum)
            await window.ethereum.enable()
        } else if(window.web3){
                window.web3 = new Web3(Window.web3.currentProvider)
            } else{
                window.alert('관리자님 이더리움 브라우저가 감지되지 않았습니다! MetaMask를 연결을 확인해 보세요!')
            }
        }

    async loadBlockchainData(){
        const web3 = window.web3
        const account = await web3.eth.getAccounts()
        this.setState({account: account[0]})
        const networkId = '11155111';

        const MvpAddress = "0x39d3FB2fbF1cd742E9700bF7750702486862dB28";
        const Mvpabi = [
            {"inputs":[],"stateMutability":"nonpayable","type":"constructor"},
            {"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"_owner","type":"address"},{"indexed":true,"internalType":"address","name":"_spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"_value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"_from","type":"address"},{"indexed":true,"internalType":"address","name":"_to","type":"address"},{"indexed":false,"internalType":"uint256","name":"_value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_spender","type":"address"},{"internalType":"uint256","name":"_value","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"success","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_to","type":"address"},{"internalType":"uint256","name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"success","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_from","type":"address"},{"internalType":"address","name":"_to","type":"address"},{"internalType":"uint256","name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"success","type":"bool"}],"stateMutability":"nonpayable","type":"function"}];
        const Mvp = new web3.eth.Contract(Mvpabi, MvpAddress);
        this.setState({Mvp});
        const RWDAddress = "0x5225ad55ad7ed9056b824eeca8e499bd831b5435";
        const RWDabi = [
            {"inputs":[],"stateMutability":"nonpayable","type":"constructor"},
            {"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"_owner","type":"address"},{"indexed":true,"internalType":"address","name":"_spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"_value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"_from","type":"address"},{"indexed":true,"internalType":"address","name":"_to","type":"address"},{"indexed":false,"internalType":"uint256","name":"_value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"_spender","type":"address"},{"internalType":"uint256","name":"_value","type":"uint256"}],"name":"Approve","outputs":[{"internalType":"bool","name":"success","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"sybol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_to","type":"address"},{"internalType":"uint256","name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"success","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_from","type":"address"},{"internalType":"address","name":"_to","type":"address"},{"internalType":"uint256","name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"success","type":"bool"}],"stateMutability":"nonpayable","type":"function"}];
        const RWD = new web3.eth.Contract(RWDabi,RWDAddress);
        this.setState({RWD});

        const AdminAddress = "0x4958d118da55cf629f8bc7d93bf1784f9f72f4c5";
        const Adminabi = [
            {"inputs":[{"internalType":"contract RWD","name":"_rwd","type":"address"},
            {"internalType":"contract Mvp","name":"_mvp","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"depositTokens","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"hasStaked","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"isStaking","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"issueTokens","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"mvp","outputs":[{"internalType":"contract Mvp","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"rwd","outputs":[{"internalType":"contract RWD","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"stakers","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"stakingBalance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"unstakeTokens","outputs":[],"stateMutability":"nonpayable","type":"function"}];
        const Admin = new web3.eth.Contract(Adminabi, AdminAddress);
        this.setState({Admin});
        
        
        console.log(account) //정상적으로 불러오는지 확인용
        console.log(networkId, 'network Id') //정상적으로 불러오는지 확인용

        //Load Mvp Contract
        
        //Load Mvp Contract
        const mvp = new web3.eth.Contract(Mvpabi, MvpAddress);
        this.setState({mvp});
        let mvpBalance = await mvp.methods.balanceOf(this.state.account).call();
        this.setState({mvpBalance: mvpBalance.toString()});
        console.log({balance: mvpBalance});

        
        // TODO : 수정 필요
        // 로컬 스토리지에 저장된 횟수를 가져와 상태에 설정
        const unstakeCount = Number(localStorage.getItem('unstakeCount') || 0);
        this.setState({ unstakeCount });


        //Load RWD Contract
        const rwd = new web3.eth.Contract(RWDabi, RWDAddress);
        this.setState({rwd});
        let rwdBalance = await rwd.methods.balanceOf(this.state.account).call();
        this.setState({rwdBalance: rwdBalance.toString()});
        console.log({rwdbalance: rwdBalance});
        


        //Load Admin Contract
        const admin = new web3.eth.Contract(Adminabi, AdminAddress);
        this.setState({admin})
        let stakingBalance = await admin.methods.stakingBalance(this.state.account).call()
        this.setState({ stakingBalance: stakingBalance.toString()})

        this.setState({loading: false})

          
    }    

    //staking function
    stakeTokens = (amount) => {
        // 잔액이 0인지 확인
        if(this.state.mvpBalance === '0'){
            alert('잔액이 없습니다.')
            return;
        }
        this.setState({loading: true })
        this.state.mvp.methods.approve(this.state.admin._address, amount).send({from: this.state.account}).on('transactionHash', (hash) => {
        this.state.admin.methods.depositTokens(amount).send({from: this.state.account}).on('transactionHash', (hash) => {
            
        window.location.reload(); // page reload
            })
        })
        
    }

    //unstaking function
    unstakeTokens = () => {

        if ( this.state.mvpBalance !== '0' || this.state.stakingBalance === '0') {
            alert('가져올 수 없습니다.');
            return;
        }

        this.setState({loading: true })
        this.state.admin.methods.unstakeTokens().send({from: this.state.account}).on('transactionHash', (hash) => {
        // TODO: 수정 필요 
        // 로컬 스토리지에 저장된 횟수를 가져와서 1 증가시킨 후 다시 저장
        const unstakeCount = Number(localStorage.getItem('unstakeCount') || 0) + 1;
        localStorage.setItem('unstakeCount', unstakeCount.toString());
        window.location.reload(); // page reload
    })
        


    }
    //issueTokens function
    issueTokens = () => {
        this.setState({ loading: true });
        this.state.admin.methods.issueTokens().send({ from: this.state.account }).on('transactionHash', (hash) => {
            // this.setState({ loading: false });
            window.location.reload(); // page reload
        })
    }
    
    

    constructor(props){
        super(props)
        this.state ={
            account: '0x0',
            mvp: {},
            //rwd: {},
            admin: {},
            mvpBalance: '0',
            rwdBalance: '0',
            stakingBalance: '0',
            loading: true,
            // TODO:  수정 필요
            unstakeCount: 0
        }
    }

    //Our React Code goes in here!
    render() {
        let content
        {this.state.loading ? content = 
        <p id='loader' className='text-center' style={{margin:'30px', color:'white'}}>
        Loding PLEASE...</p>: content = 
        <Main
            mvpBalance={this.state.mvpBalance}
            //rwdBalance={this.state.rwdBalance}
            stakingBalance={this.state.stakingBalance}
            stakeTokens={this.stakeTokens}
            unstakeTokens={this.unstakeTokens}
            issueTokens={this.issueTokens}
            // TODO : 수정 필요
            unstakeCount={this.state.unstakeCount}
        />}
        return (
            <div className='App' style={{position:'relative'}}>
                <div style={{positiona:'absoulte'}}>
                </div>
                <Navbar account={this.state.account}/>
                <div className='container-fluid mt-5'>
                    <div className='row'>
                        <main role='main' className='col-lg-12 ml-auto mr-auto' style={{maxWidth:'600px', minHeight:'100vm'}}>
                            <div>
                                {content}
                            </div>
                        </main>
                    </div>
                </div>
            </div>
        )
    }
}
export default App;*/