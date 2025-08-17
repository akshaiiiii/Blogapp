const item=document.getElementById('postform')
 if(item){
     item.addEventListener("submit",async function(e){
     e.preventDefault()
     const form=new FormData(this)
     const post={
     title:form.get('title'),
     author:form.get('author'),
     content:form.get('content')
     }
     try{
         const res=await fetch('/api/posts',{
             method:'POST',
             headers:{
                 'Content-Type':'application/json'
             },
             body:JSON.stringify(post)
         })
         const result= await res.json()
         if(res.ok){
             alert('Post submitted successfully!');
             window.location.href='/index.html';
         }
         else{
             alert("something went wrong")
         }
     }
     catch(err){
         console.error('Error submitting form:', err);
         alert('Something  went wrong..in the catch block');

     }

 })
 }