import React, {Component} from 'react';
import { AsyncStorage } from 'AsyncStorage';

export default class Home extends Component {
 
  
constructor(props) {
	super(props)
	this.state = {
		id : '',		
		email:'',
		password: '',
		stoken: '',
		userdata:'',
		basekey:'',
		errormsg: '',
		errormsgp: '',
		colorset: '',
		colorsetemail: ''
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
			  //checking basekey for session check method
				if(this.state.basekey != '' && typeof this.state.basekey!='undefined'){
					this.sessioncheck(this.state.stoken,this.state.basekey);
					this.context.router.push('Dashboard');
				}
			});
		});
	}

render() {
    return (
		<section className="container containerset">
			<div className = "row d-flex justify-content-center">
				<div className="form-group">
					<div className="input-group col-sm-4 col-md-4">
						Email : 
					</div>
					<div className="input-group col-sm-8 col-md-8">
					  <input
						type="text"
						placeholder="Enter email..."
						className="form-control" style= {{border:this.state.colorsetemail}}
						ref={ref => (this.email = ref)}
					  />
					</div>
					<div className="input-group col-sm-12 col-md-12 textcolor">{this.state.errormsg}</div>
				</div>
			</div>
			
			<div className = "row d-flex justify-content-center">
				<div className="form-group">
					<div className="input-group col-sm-4 col-md-4">
					  Password : 
					</div>
					<div className="input-group col-sm-8 col-md-8">
					  <input
						type="password"
						placeholder="Enter Password..."
						className="form-control" style= {{border:this.state.colorset}}
						ref={ref => (this.password = ref)}
					  />
					</div>
					<div className="input-group col-sm-12 col-md-12 textcolor">{this.state.errormsgp}</div>
				</div>
			</div>
			<div className = "row d-flex justify-content-center">
				<div className="col-sm-4">
					<input type="button" className="btn btn-primary" onClick={this.CheckTextInputIsEmptyOrNot.bind()}  value = "Login"/>
				</div>
			</div>
		</section>
    );
  }
  
/* ------------------------------------------------ Function start ---------------------------------------*/
  
	CheckTextInputIsEmptyOrNot = () => {
		try {
			let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,5})+$/ ; // email validation
			let email = this.email.value;
			let password = this.password.value;
			if(email == '' || reg.test(email)== false )
			{
				this.setState({errormsg: "Please enter valide email address"});
				this.setState({colorsetemail: "1px solid red"});
				setTimeout(
					function() {
						this.setState({errormsg: '',colorsetemail:''});
					}
					.bind(this),3000);
			  return false;
			}
			if(password == '')
			{
				this.setState({errormsgp: "Please enter valide password"});
				this.setState({colorset: "1px solid red"});
				setTimeout(
					function() {
						this.setState({errormsgp: '',colorset:''});
					}
					.bind(this),3000);
			  return false;
			}
			
			let formdata = 
			{
				email : email, password:password
			}

			let datafetch =
			{
				method: 'POST',
				body:  JSON.stringify(formdata),
				headers: 
				{
				  'Accept': 'application/json',
				  'Content-Type': 'application/json',
				},
			};
			//calling verify function start here
			fetch('https://us-central1-login-application-mindcrew.cloudfunctions.net/api/auth/verify', datafetch)
			.then(function(response) {
			if (!response.ok) { throw Error(response.statusText); } 
				return response;
			})
			.then(response => response.json())
			.then(responseJson =>
			{
				if(responseJson.status == 'true')
				{
					try {
						//setting local storage
						AsyncStorage.setItem('stoken', responseJson.stoken);
						AsyncStorage.setItem('basekey',responseJson.base64SigningKey);
						AsyncStorage.setItem('userdata',responseJson.data.token);
						this.setState({stoken:responseJson.stoken,userdata:responseJson.data, basekey:responseJson.base64SigningKey})
						this.context.router.push('Dashboard');
					}catch (error) {
					  console.error(error);
					  alert(error);
					}
				}else{
					alert("error");
				}
			});
		} catch (error) {
			console.error(error);
		}
	}
	
 /* ------------------------------------------------ Functio end ---------------------------------------*/
 /* ------------------------------------------------ Functio start ---------------------------------------*/
 /*
 pass token and base64 key for checking session is expired or not 
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
			//calling verify user function start here	
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
					this.context.router.push('Dashboard');
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
/* ------------------------------------------------ Functio end ---------------------------------------*/	
}

Home.contextTypes = {
  router: React.PropTypes.object.isRequired,
}
