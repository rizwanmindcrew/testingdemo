import React, {Component} from 'react';
import { AsyncStorage } from 'AsyncStorage';

export default class User extends Component {

constructor(props) {
	super(props)
	this.state = {
		stoken:'',
		basekey:'',
		email : '',
		displayName : '',
		id : '',
		loaded: true
	}
}
	componentWillMount() {
		AsyncStorage.getItem('stoken', (err, result) => {
		this.setState({
			stoken: result
		  });
		});

		AsyncStorage.getItem('basekey', (err, result) => {
		this.setState({
			basekey: result
		  },()=>{
				if(this.state.basekey == ''){
					this.context.router.push('login');
				}else{
					this.sessioncheck(this.state.stoken,this.state.basekey);
				}
			});
		});
	}

  render() {
   return (
	  <div className="container">
        <div className="row d-flex justify-content-center">
          <h3>Dashboard</h3>
        </div>
		  <div className="d-flex justify-content-end">
			<input type="button" className="btn btn-primary" onClick={this.logout.bind()}  value = "Logout"/>
		  </div>
		  
		  <div className="row mt-3">
		  <table className ="table">
			<thead>
			  <tr>
				<th>id</th>
				<th>Email</th>
				<th>displayName</th>
			  </tr>
			</thead>
			<tbody>
			  <tr>
				<td>{this.state.id}</td>
				<td>{this.state.email}</td>
				<td>{this.state.displayName}</td>
			  </tr>
			</tbody>
		</table>
	 </div>
	</div>
	
	);
  }

/* ------------------------------------------------ Function start ---------------------------------------*/
/*
* getting user inforemation and set into table
*/ 
	getUserdata = (userdata) => {
		try {
			let formdata = 
				{
					token : this.state.userdata
				}
				let datafetch =
				{
					method: 'POST',
					body: JSON.stringify(formdata),
					 headers: 
					{
					  'Accept': 'application/json',
					  'Content-Type': 'application/json',
					},
				};
			//calling user information function start here
			fetch('https://us-central1-login-application-mindcrew.cloudfunctions.net/api/users/me', datafetch)
			.then(function(response) {
				
			if (!response.ok) { throw Error(response.statusText); } 
				return response;
			})
			.then(response => response.json())
			.then(responseJson =>
			{
				if(responseJson.status == 'true')
				{
					// set into local storage
					this.setState({email:responseJson.data[0].email,displayName:responseJson.data[0].displayName,id:responseJson.data[0].id})
				}else{
					AsyncStorage.setItem('stoken', '');
					AsyncStorage.setItem('basekey','');
					this.context.router.push('login');
				}
			});
		} catch (error) {
			console.error(error);
		}
	} 

/* ------------------------------------------------ Function end ---------------------------------------*/
/* ------------------------------------------------ Function start ---------------------------------------*/
/* 
* pass token and base64 key for checking session is expired or not 
*/
	sessioncheck = (stoken,basekey) =>{
		try {
			let formdata = 
				{
					stoken : this.state.stoken,base64:this.state.basekey
				}

				let datafetch =
				{
					method: 'POST',
					body: JSON.stringify(formdata),
					 headers: 
					{
					  'Accept': 'application/json',
					  'Content-Type': 'application/json',
					},
				};
				
			fetch('https://us-central1-login-application-mindcrew.cloudfunctions.net/api/auth/verifyuser', datafetch)
			.then(function(response) {
			if (!response.ok) { throw Error(response.statusText); } 
				return response;
			})
			.then(response => response.json())
			.then(responseJson =>
			{
				
			if(responseJson.status == 'true')
			{
			/* 
			* If session is not expired then fetch user information passingn user token
			*/
				AsyncStorage.getItem('userdata', (err, result) => {
					this.setState({
						userdata: result
					},()=>{
						/*
						* call function to get user informaiton
						*/
						this.getUserdata(this.state.userdata);
						this.context.router.push('Dashboard');
					});
				  });
			}else{
				AsyncStorage.setItem('stoken', '');
				AsyncStorage.setItem('basekey','');
				this.context.router.push('login');
			}
			});
		} catch (error) {
			console.error(error);
		}
	}

/* ------------------------------------------------ Function end ---------------------------------------*/

/* ------------------------------------------------ Function start ---------------------------------------*/
/*
* session destroy
*/ 
	logout = () =>{
		try {
			let formdata = 
				{
					userId : this.state.id,base64:this.state.basekey
				}

				let datafetch =
				{
					method: 'POST',
					body: JSON.stringify(formdata),
					 headers: 
					{
					  'Accept': 'application/json',
					  'Content-Type': 'application/json',
					},
				};
				
			fetch('https://us-central1-login-application-mindcrew.cloudfunctions.net/api/logout', datafetch)
			.then(function(response) {
			if (!response.ok) { throw Error(response.statusText); } 
				return response;
			})
			.then(response => response.json())
			.then(responseJson =>
			{
				if(responseJson.status == 'true')
				{
					AsyncStorage.setItem('stoken', '');
					AsyncStorage.setItem('basekey','');
					this.context.router.push('login');
				}else{
					AsyncStorage.setItem('stoken', '');
					AsyncStorage.setItem('basekey','');
					this.context.router.push('login');
				}
			});
		} catch (error) {
			console.error(error);
		}
	} 
/* ------------------------------------------------ Function end ---------------------------------------*/

}

User.contextTypes = {
  router: React.PropTypes.object.isRequired,
}