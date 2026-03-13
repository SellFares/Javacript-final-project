const baseUrl = 'https://tarmeezacademy.com/api/v1';

function setupUI() {
    const token = localStorage.getItem("token")
    // console.log(token)
    /*
    // zeyda methode tarmezz channel
    const logginDiv = document.getElementById("logged-in-div")
    const loggoutDiv = document.getElementById("loggout-div")
    if ( token == null ){       // user is guest( not logged in)
        logginDiv.style.setProperty("display","block","important")
        loggoutDiv.style.setProperty("display","none","important")
    }else {
        logginDiv.style.setProperty("display","none","important")
        loggoutDiv.style.setProperty("display","block","important")
    }
    */
    const loginBtn = document.getElementById("login-btn")
    const registerBtn = document.getElementById("register-btn")
    const logoutBtn = document.getElementById("logout-btn")
    const userDiv = document.getElementById("user-div")
    const addBtn = document.getElementById("add-btn")

    if ( token == null ){       // user is guest( not logged in)
        loginBtn.style.display = "block"
        registerBtn.style.display = "block"
        logoutBtn.style.display = "none"
        userDiv.style.setProperty("display","none","important")
        if ( addBtn != null ){
            addBtn.style.setProperty("display","none","important")
        }
        
    }else { // for logged in user
        loginBtn.style.display = "none"
        registerBtn.style.display = "none"
        logoutBtn.style.display = "block"
        userDiv.style.setProperty("display","flex","important")
        if ( addBtn != null ){
            addBtn.style.setProperty("display","none","important")
        }
        const user = getCurrentUser()
        
        document.getElementById("nav-username").innerHTML = "@" + user.name
        document.getElementById("nav-user-image").src = user.profile_image
        
    }
}

function LoginBtnClicked() {
    const username = document.getElementById("username-input").value
    const password = document.getElementById("password-input").value
    
    const params = {
        "username" : username,
        "password" : password
    }

    const url = baseUrl+"/login" ;

    axios.post(url,params )
    .then(function (response) {
        //console.log(response.data.token);
        localStorage.setItem("token",response.data.token)
        localStorage.setItem("user",JSON.stringify(response.data.user))     // khater el user hoa json so lezemna nsaviwh ka string  

        console.log(response.data.user.profile_image)

        // bech yetsaker el login modal wakt yenjah login
        const modal =  document.getElementById("login-Modal")
        const modalInstance = bootstrap.Modal.getInstance(modal)
        modalInstance.hide()
        showAlert("user logged in successfully","success")
        setupUI()
    })
    .catch(function (error) {
        console.log(error);
    });

}

function RegisterBtnClicked() {
    const name = document.getElementById("register-name-input").value
    const username = document.getElementById("register-username-input").value
    const password = document.getElementById("register-password-input").value
    const image = document.getElementById("register-image-input").files[0]
    
    // console.log(name, "  ", username , "  " , password)

    /*const params = {
        "username" : username,
        "password" : password,
        "name" : name
    }*/

    let formData = new FormData()

    formData.append("username",username)
    formData.append("password",password)
    formData.append("image",image)
    formData.append("name",name)

    const url = baseUrl+"/register" ;
    const headers = {
        "content-Type": "multipart/form-data"
    }

    axios.post(url,formData, {
        headers: headers
    } )
    .then(function (response) {
        //console.log(response.data.token);
        localStorage.setItem("token",response.data.token)
        localStorage.setItem("user",JSON.stringify(response.data.user))     // khater el user hoa json so lezemna nsaviwh ka string  

        // bech yetsaker el login modal wakt yenjah login
        const modal =  document.getElementById("register-Modal")
        const modalInstance = bootstrap.Modal.getInstance(modal)
        modalInstance.hide()
        showAlert("New user Registred in successfully")
        setupUI()
    })
    .catch(function (error) {
        const message = error.response.data.message 
        showAlert(message, "danger")
        //console.log(error);
    });
}

function logout(){
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    showAlert("logged out successfully",)
    setupUI()
}


function showAlert(customMessage,type="success") {
    const alertPlaceholder = document.getElementById('success-alert')
    const appendAlert = (message, type) => {
        const wrapper = document.createElement('div')
        wrapper.innerHTML = [
            `<div class="alert alert-${type} alert-dismissible" role="alert">`,
            `   <div>${message}</div>`,
            '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
            '</div>'
        ].join('')

        alertPlaceholder.append(wrapper)
    }

    appendAlert(customMessage, type)

    // todo : hetha bech nsakrou el alert
    setTimeout(() => {
        const alert = bootstrap.Alert.getOrCreateInstance('#success-alert')
        // alert.close()
    }, 2000);      
}


function getCurrentUser(){
    let user = null
    const storageUser = localStorage.getItem("user")

    if ( storageUser != null ){
        user = JSON.parse(storageUser)
    }

    return user 
}