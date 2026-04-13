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

            let user = getCurrentUser()
            
            let isMyPost = user != null && user.id == Post.author.id

            let buttonDisplay = isMyPost ? "block" : "none"


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

                            <button class="btn btn-secondary" style="float: right; display: ${buttonDisplay};" onclick="editPostBtnClicked('${encodeURIComponent(JSON.stringify(Post))}')">edit</button>
                        </div>
                        <div class="card-body" onclick="postClicked(${Post.id})" style="cursor: pointer">
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


function CreateNewPostClicked(){
    let postId = document.getElementById("post-id-input").value
    let isCreate =  postId == null || postId == "false" || postId == "" 
    // console.log(isCreate)
    

    const title = document.getElementById("post-title-input").value
    const body = document.getElementById("post-body-input").value       // .value ki yebda input naw3ouu text 
    const image = document.getElementById("post-image-input").files[0]     // .files hiya function w ahna hachetna ken b file loul hetheka a3lech khtarna .files[0]
    const token = localStorage.getItem("token")

    let formData = new FormData()                   // nesta3mlou el form data ki hachetna b file donc nbadlou el params b formdata

    formData.append("body",body)
    formData.append("title",title)
    formData.append("image",image)
    
    let url = ""
    
    const headers = {
        "content-Type": "multipart/form-data",      // hethi zeda nektbopuha khater kbal kena nab3athou json ama taw formData so lezemna nkoloulou
        "authorization" : `Bearer ${token}`
    }

    if ( isCreate ){
        url = baseUrl+"/posts" ;
        
    }else {
        formData.append("_method","put")     // 7ata n3aytou lel update method 7asb rest api convention lezemna n3aytou lel method put ama 7asb el backend implementation ken yest3mlou post m3a _method put aw ken yest3mlou put direct

        url = baseUrl+`/posts/${postId}`
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

function postClicked(postId){
    //alert(postId)
    window.location = `postDetails.html?postId=${postId}`
}

function editPostBtnClicked(postObject){
    // alert("edit")
    // alert(postId)
    let post = JSON.parse(decodeURIComponent(postObject))
    // console.log(post)
    document.getElementById("post-id-input").value = post.id
    document.getElementById("post-modal-title").innerHTML = "Edit Post"
    document.getElementById("create-post-btn").innerHTML = "Update"
    document.getElementById("post-title-input").value = post.title
    document.getElementById("post-body-input").value = post.body
    let postModal = new bootstrap.Modal(document.getElementById("create-post-Modal"), {

    })
    postModal.toggle()
}

function addPostClicked(){
    
    document.getElementById("post-id-input").value = ""
    document.getElementById("post-modal-title").innerHTML = "Create A New Post"
    document.getElementById("create-post-btn").innerHTML = "Create"
    let postModal = new bootstrap.Modal(document.getElementById("create-post-Modal"), {

    })
    postModal.toggle()
}