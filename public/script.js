const token = localStorage.getItem('token');
let userRole = null;

if (token) {
    try {
        console.log("i am here")
        const decode = jwt_decode(token);
        userRole = decode.role;
    } catch (e) {
        console.log("decoding failed")
    }
}

async function fetchposts() {
    try {
        const res = await fetch('/api/posts');
        if (!res.ok) {
            const text = await res.text();
            throw new Error(`Server error: ${text}`);
        }

        const posts = await res.json();

        posts.forEach(post => {
            const Blogs = document.querySelector('.Blogs');

            const container = document.createElement('div');
            container.className = 'blog-post';

            // ✅ Properly create the title container
            const title_container = document.createElement('div');
            title_container.className = 'title-container';

            const title = document.createElement('div');
            title.className = 'title';
            title.innerText = post.title;

            title_container.appendChild(title);

            if (userRole === 'admin') {
                const button_container = document.createElement('div');
                button_container.className = "button-container";

                const edit = document.createElement('button');
                edit.className = 'edit-button';
                edit.innerText = 'edit';
                edit.addEventListener('click', () => {
                    window.location.href = `/public/edit.html?id=${post._id}`;
                });

                const del = document.createElement('button');
                del.className = 'delete-button';
                del.innerText = 'delete';
                del.addEventListener('click', async () => {
                    try {
                        const res = await fetch(`/api/posts/${post._id}`, {
                            method: 'DELETE'
                        });
                        if (res.ok) {
                            alert("Post deleted successfully");
                            location.reload();
                        } else {
                            alert("Error deleting the post");
                        }
                    } catch (err) {
                        alert('Can’t delete the post', err);
                    }
                });

                button_container.appendChild(edit);
                button_container.appendChild(del);
                title_container.appendChild(button_container);
            }

            const author = document.createElement('div');
            author.className = 'author';
            author.innerText = post.author;

            const con = document.createElement('div');
            con.className = 'post';
            con.innerText = post.content;

            container.appendChild(title_container);
            container.appendChild(author);
            container.appendChild(con);

            Blogs.appendChild(container);
        });
    } catch (err) {
        console.error('Error in fetchposts():', err.message);
    }
}

if (window.location.pathname.endsWith('/index.html') || window.location.pathname === '/') {
    fetchposts();
}
