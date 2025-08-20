function getid(){
    const param=new URLSearchParams(window.location.search);
    return param.get('id')
}
async function getpost(post_id){
    try{
        const res=await fetch('/api/posts')
        const posts=await res.json()
        return posts.find(post=>post._id===post_id)
    }catch(err){
        console.log("failed to fetch posts",err);

    }
}
async function updatepost(post_id,updateddata){
    const token = localStorage.getItem('token');
    try{
        console.log(post_id)
        const res=await fetch(`/api/posts/${post_id}`,{
        method:'PUT',
        headers:{
            'Content-Type':'application/json',
            'Authorization': `Bearer ${token}` 
        },
        body:JSON.stringify(updateddata)
    })   
    result=await res.json()
    if (res.ok){
        alert('Post updated successfully!');
        window.location.href = '/index.html';
    }else{
        alert('Failed to update post: ' + result.message)
    }

    }catch(err){
        console.error('Error updating post:', err);
        alert('Something went wrong.');
    }
   
}
const id=getid()
const form = document.getElementById('editform');
if (form && id){
    (async()=>{
        post=await getpost(id)
        if (post) {
            document.getElementById('title').value = post.title;
            document.getElementById('author').value = post.author;
            document.getElementById('content').value = post.content;
        } else {
            alert('Post not found!');
        }
    })();   
}

form.addEventListener("submit",async(e)=>{
    e.preventDefault()
    const updatedData = {
      title: document.getElementById('title').value,
      author: document.getElementById('author').value,
      content: document.getElementById('content').value
    };
    await updatepost(id,updatedData)

})