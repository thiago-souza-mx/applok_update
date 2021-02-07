/***************************************************************
 * USER FUNCTIONS
 **************************************************************/
const UserActions = {};
const state = {};
state.Users = [];
state.Registers = [];

UserActions.setUser = props => {
  let newUser = {
    name: props.name,
    email: props.email,
    senha: props.senha,
    username: props.username
  }
  if (props.username) {
    //localStorage.setItem(props.username, JSON.stringify(newUser));

    state.Users.push(props.username);
    state.Registers.push(newUser);

    localStorage.setItem("listUsers", JSON.stringify(state.Users));
    localStorage.setItem("listRegisters", JSON.stringify(state.Registers));
    window.location.reload();
  }
}

UserActions.getUser = async username => {
  let user = {
    username: "admin@applok",
    senha: "root"
  }

  let resp = false
  if (user.username == username) {
    resp = user;
  }
  return resp;

  /*let list = localStorage.getItem("listRegisters");
  if(list !== null){  
      let resp = false      
      list = JSON.parse(list);
      list.forEach(user => {
          if( user.username == username ){            
              resp = user;             
          }         
      });
      return resp;
  }else
      return false;  */
}

UserActions.getStorage = (str) => {
  return localStorage.getItem(str);
}

module.exports = UserActions;