
const token=localStorage.getItem('token');
let userRole=null
if(token){
    try{
        console.log("i am here")
        const decode=jwt_decode(token)
        userRole=decode.role
    }catch(e){
        console.log("decoding failed")
        
    }
}
async function fetchposts(){
    try{
        const res=await fetch('/api/posts');
        if (!res.ok) {
            const text = await res.text();
            throw new Error(`Server error: ${text}`);
        }
    const posts=await res.json();
    posts.forEach(post => {
        const Blogs=document.querySelector('.Blogs')
        const container=document.createElement('div');
        container.className='blog-post';
        const title=document.createElement('div');
        title.className='title';
        const author=document.createElement('div');
        author.className='author';
        const con=document.createElement('div');
        con.className='post';
        container.appendChild(title);
        container.appendChild(author);
        container.appendChild(con);
        const body=document.querySelector('body');
        Blogs.appendChild(container);
        title.innerText=post.title;
        author.innerText=post.author;
        con.innerText=post.content;
        if(userRole==='admin'){
            const edit=document.createElement('button');
            edit.className='edit-button';
            edit.innerText='edit'
            edit.addEventListener('click', () => {
            window.location.href = `/public/edit.html?id=${post._id}`;
            })
    
    container.appendChild(edit);
        const del =document.createElement('button')
        del.className='delete';
        del.innerText='delete';
        del.addEventListener('click',async ()=>{
        try{
            const res=await fetch(`/api/posts/${post._id}`,{
                method:'DELETE'
                });
            if (res.ok){
                alert("post deleted sucessfully");
                location.reload();
            }
            else{
                alert("error deleting the post");
            }
        }
        catch(err){
                alert('cant delete the post',err);
        }
        });
        container.append(del);
    }
    });
    }catch(err){
        console.error('Error in fetchposts():', err.message);
    }
    
}
fetchposts();

    

