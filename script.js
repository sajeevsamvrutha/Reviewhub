let currentCategory = 'Movies';
let currentItem = null;
let media = [...movies, ...tvShows, ...books];

window.onload = function(){
    let user = localStorage.getItem('user');
    if(user) goTo('listPage'); else goTo('loginPage');
    render();
};

function goTo(id){
    document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
    document.getElementById(id).classList.add('active');
}

function signup(){
    let u = signupUsername.value.trim();
    let p = signupPassword.value;
    if(!u || !p) return alert("Fill details");
    localStorage.setItem('account_'+u, p);
    goTo('loginPage');
}

function login(){
    let u = loginUsername.value;
    let p = loginPassword.value;
    if(localStorage.getItem('account_'+u) === p){
        localStorage.setItem('user', u);
        goTo('listPage');
        render();
    } else alert("Invalid");
}

function logout(){
    localStorage.removeItem('user');
    goTo('loginPage');
}

function setCategory(cat){
    currentCategory = cat;
    render();
}

function getReviews(){
    return JSON.parse(localStorage.getItem('reviews')) || [];
}

function render(){
    categoryTitle.innerText = currentCategory;
    mediaGrid.innerHTML = '';

    let reviews = getReviews();

    media.filter(m=>m.category===currentCategory).forEach(m=>{
        let r = reviews.filter(x=>x.id===m.id);
        let avg = r.length ? (r.reduce((a,b)=>a+Number(b.rating),0)/r.length).toFixed(1) : 'No ratings';

        mediaGrid.innerHTML += `
        <div class='card' onclick='openDetail(${m.id})'>
        <img src='${m.img}'>
        <h4>${m.title}</h4>
        <p>⭐ ${avg}</p>
        <p>${r.length} reviews</p>
        </div>`;
    });
}

function openDetail(id){
    currentItem = media.find(m=>m.id===id);
    goTo('detailPage');

    detailTitle.innerText=currentItem.title;
    detailImg.src=currentItem.img;
    detailDesc.innerText=currentItem.desc;

    renderReviews();
}

function renderReviews(){
    reviews.innerHTML='';
    getReviews().filter(r=>r.id===currentItem.id)
    .forEach(r=>{
        reviews.innerHTML+=`<p>${r.user}: ${r.comment}</p>`;
    });
}

function addReview(){
    let all = getReviews();
    all.push({
        id: currentItem.id,
        user: localStorage.getItem('user'),
        comment: comment.value,
        rating: rating.value
    });
    localStorage.setItem('reviews', JSON.stringify(all));
    comment.value='';
    renderReviews();
    render();
}
