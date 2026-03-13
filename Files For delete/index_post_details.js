const baseUrl = 'https://tarmeezacademy.com/api/v1';
let currentPage = 1
let lastPage = 1

//================ Infinite Scrool ================//
window.addEventListener("scroll", function() {
    const endOfPage = window.innerHeight + window.pageYOffset  >= document.body.offsetHeight
    //let endOfPage = window.innerHeight + window.scrollY  >= document.body.scrollHeight
    // console.log(endOfPage)
    if (endOfPage && currentPage < lastPage){
        currentPage = currentPage + 1
        getPosts(false,currentPage )
    }
} )

setupUI()

getPosts()


async function getPosts(reload = true,page = 1) {
    try {
        let response = await fetch(baseUrl+`/posts?limit=15&page=${page}`)
        const data = await response.json() 
        const Posts = data.data ;
        //console.log(data.meta.last_page )
        lastPage = data.meta.last_page 
        //console.log(Posts)
        if ( reload  ){
            document.getElementById("posts").innerHTML = ""
        }
        // document.getElementById("posts").innerHTML = ""
        for ( Post of Posts ){
            const author = Post.author;
            let postTitle = ""

            if ( Post.title != null ){
                postTitle = Post.title ;
            }
            //console.log(Post.tags)
            
            // console.log(Post.image);
            let content =  `
                <!-- Post -->
                    <div class="card shadow" >
                        <div class="card-header">
                            <img class="rounded-circle border-2" src="${author.profile_image}" style="height: 30px; width: 30px;"  alt="...">
                            <b>${author.username}</b>
                        </div>
                        <div class="card-body" onclick="window.location.href='postDetails.html'">
                            <img class="w-100" src="${Post.image}" >
                            <h6 style="color: #86848b;" class="mt-1">${Post.created_at}</h6>
                            <h5 >${postTitle}</h5>
                            <p >${Post.body}</p>
                            <hr>
                            <div class="d-flex flex-row ">
                                <span class="material-symbols-outlined">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen" viewBox="0 0 16 16">
                                        <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z"/>
                                    </svg>
                                    <span>
                                        (${Post.comments_count}) Comments
                                    </span>                                    
                                </span>
                                <span id="post-tags-${Post.id}">
                                    <p class="btn btn-sm rounded-5" style="background-color: gray; color: white">
                                        Policy
                                    </p>
                                    <p class="btn btn-sm rounded-5" style="background-color: gray; color: white">
                                        Policy
                                    </p>
                                </span> 
                            </div>
                        </div>
                    </div>
                <!--// Post //-->
            `
            document.getElementById("posts").innerHTML += content

            const currentPostTagsId = `post-tags-${Post.id}`

            document.getElementById(currentPostTagsId).innerHTML = ""

            for ( tag of Post.tags ) {
                console.log(tag.name)
                let tagsContent = `
                    <p class="btn btn-sm rounded-5" style="background-color: gray; color: white">
                        ${tag.name}
                    </p>
                `
                document.getElementById(currentPostTagsId).innerHTML += tagsContent
            }
        }
        
        return data
    }
    catch(error) {
        console.error('Could not get user data:', error);
    }
}

async function getfPosts() {
    const Users = await getUsers()
    const Usersdata = Users.data ;
    //console.log(Users.data)
    for( User of Usersdata ){
        //console.log(User)
        let response = await fetch(baseUrl+"/posts/"+userId)
        let data = await response.json() 
        
        //console.log(data
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

function CreateNewPostClicked(){
    const title = document.getElementById("post-title-input").value
    const body = document.getElementById("post-body-input").value       // .value ki yebda input naw3ouu text 
    const image = document.getElementById("post-image-input").files[0]     // .files hiya function w ahna hachetna ken b file loul hetheka a3lech khtarna .files[0]
    const token = localStorage.getItem("token")

    let formData = new FormData()                   // nesta3mlou el form data ki hachetna b file donc nbadlou el params b formdata

    formData.append("body",body)
    formData.append("title",title)
    formData.append("image",image)
    
    const url = baseUrl+"/posts" ;
    
    const headers = {
        "content-Type": "multipart/form-data",      // hethi zeda nektbopuha khater kbal kena nab3athou json ama taw formData so lezemna nkoloulou
        "authorization" : `Bearer ${token}`
    }
    axios.post(url,formData, {
        headers : headers
    } )
    .then(function (response) {
        // console.log(response);
        const modal =  document.getElementById("create-post-Modal")
        const modalInstance = bootstrap.Modal.getInstance(modal)
        modalInstance.hide()
        showAlert("New Post Has Benn Created")
        getPosts()
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
        addBtn.style.setProperty("display","none","important")
    }else { // for logged in user
        loginBtn.style.display = "none"
        registerBtn.style.display = "none"
        logoutBtn.style.display = "block"
        userDiv.style.setProperty("display","flex","important")
        addBtn.style.setProperty("display","block","important")
        const user = getCurrentUser()
        
        document.getElementById("nav-username").innerHTML = "@" + user.name
        document.getElementById("nav-user-image").src = user.profile_image
        
    }
}

function getCurrentUser(){
    let user = null
    const storageUser = localStorage.getItem("user")

    if ( storageUser != null ){
        user = JSON.parse(storageUser)
    }

    return user 
}