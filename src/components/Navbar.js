import React, {Component} from 'react';

class Navbar extends Component{
    render() {
        return (
            <nav className='navbar navbar-dark fixed-top shadow p-0' style={{
                background : 'black',
                height : '50px'
            }}>
            <a href="/" className='navbar-brand col-sm-3 col-md-2 mr-0'
            style={{color : 'white'}}>
            &nbsp; 관리자 TokenSystem (Decentralized)
            </a>
            <ul className='navbar-nav px-3'>
                <li className='text-nowrap d-none nav-item d-sm-none d-sm-block'>
                    <small style={{color:'white'}}>
                        ACCOUNT NUMBER : {this.props.account}
                    </small>
                </li>
            </ul>
            </nav>
        )
    }
}
export default Navbar;