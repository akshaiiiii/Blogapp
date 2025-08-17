const form=document.getElementById("loginform")
const signup=document.getElementById("signup")
alert("hai")
form.addEventListener("submit",async(e)=>{
    e.preventDefault()
    const username=form.username.value.trim()
    const password=form.password.value.trim()
    if(!username||!password ){
        error.textContent="enter username and password"
        return;
    }
    try{
        console.log("kfjak")
        const res=await fetch('/login',{
            method:'POST',
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify({username,password})
        })
        alert("hellooooo")
        const data=await res.json()
        if(res.ok && data.token){
            localStorage.setItem('token',data.token)
            window.location.href='/index.html'
        }
        else{
            alert("login failed")
        }

    }catch(err){
        alert("server error")
    
    }
})
signup.addEventListener("click",async(e)=>{
    e.preventDefault()
    const username=form.username.value.trim()
    const password=form.password.value.trim()
    if(!username||!password ){
        error.textContent="enter username and password"
        return;
    }
    try{
        const res=await fetch('/signup',{
            method:'POST',
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify({username,password})
        })
        const data=await res.json()
        if(res.ok){
            alert("user created succesfully")
            console.log(data)
        }
    }
    catch(err){
        error.textContent="can't signup"

    }
})