import React, {Component} from 'react';
import './App.css';
import Web3 from 'web3';
import Ws from '../truffle_abis/Ws.json'
import RWD from '../truffle_abis/RWD.json'
import Admin from '../truffle_abis/Admin.json'
import Main from './Main.js'

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
                window.alert('no ethereum browser detected! you can Check out MetaMask!')
            }
        }

    async loadBlockchainData(){
        const web3 = window.web3
        const account = await web3.eth.getAccounts()
        this.setState({account: account[0]})
        const networkId = await web3.eth.net.getId()
        
        console.log(account) //정상적으로 불러오는지 확인용
        console.log(networkId, 'network Id') //정상적으로 불러오는지 확인용

        //Load Ws Contract
        
        const wsData = Ws.networks[networkId]
        if(wsData){
            const ws = new web3.eth.Contract(Ws.abi, wsData.address)
            this.setState({ws})
            let wsBalance = await ws.methods.balanceOf(this.state.account).call()
            this.setState({wsBalance: wsBalance.toString() })
            console.log({balance: wsBalance})
        }else{
            window.alert('Error! ws contract not deployed - no detect network!')
        }
        
        //Load RWD Contract
        const rwdData = RWD.networks[networkId]
        
        if(rwdData){
            const rwd = new web3.eth.Contract(RWD.abi, rwdData.address)
            this.setState({rwd})
            let rwdBalance = await rwd.methods.balanceOf(this.state.account).call()
            this.setState({rwdBalance: rwdBalance.toString() })
            //console.log({rwdbalance: rwdBalance}) 
        }else{ 
            window.alert('Error! RWD contract not deployed - no detect network!') 
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
        this.setState({loading: true })
        this.state.ws.methods.approve(this.state.admin._address, amount).send({from: this.state.account}).on('transactionHash', (hash) => {
          this.state.admin.methods.depositTokens(amount).send({from: this.state.account}).on('transactionHash', (hash) => {
            this.setState({loading:false})
          })
        }) 
    }

    //unstaking function
    unstakeTokens = () => {
        this.setState({loading: true })
        this.state.admin.methods.unstakeTokens().send({from: this.state.account}).on('transactionHash', (hash) => {
          this.setState({loading:false})
        }) 
    }

    constructor(props){
        super(props)
        this.state ={
            account: '0x0',
            ws: {},
            rwd: {},
            admin: {},
            wsBalance: '0',
            rwdBalance: '0',
            stakingBalance: '0',
            loading: true
        }
    }

    //Our React Code goes in here!
    render() {
        let content
        {this.state.loading ? content = 
        <p id='loader' className='text-center' style={{margin:'30px', color:'white'}}>
        Loding PLEASE...</p>: content = 
        <Main
            wsBalance={this.state.wsBalance}
            rwdBalance={this.state.rwdBalance}
            stakingBalance={this.state.stakingBalance}
            stakeTokens={this.stakeTokens}
            unstakeTokens={this.unstakeTokens}
        />}
        return (
            <div className='App' style={{position:'relative'}}>
                <div style={{positiona:'absoulte'}}>
                </div>
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