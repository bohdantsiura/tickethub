const accountBox = document.getElementById("accountBox");

let user = JSON.parse(
localStorage.getItem("tickethubUser")
);

function renderAccount(){

if(!accountBox) return;

if(!user){

accountBox.innerHTML = `

<h3 style="margin-bottom:20px;">
Create Account
</h3>

<input
id="userName"
placeholder="Your name">

<input
id="userEmail"
placeholder="Email">

<button onclick="registerUser()">
Create Account
</button>

`;

return;
}

accountBox.innerHTML = `

<div class="account-profile">

<h3>
👋 Welcome, ${user.name}
</h3>

<p>
Email: ${user.email}
</p>

<p>
Member since:
${user.joined}
</p>

<div class="first-discount">
🎁 First Purchase Discount:
20% OFF
</div>

<button
class="logout-btn"
onclick="logoutUser()">

Logout

</button>

</div>

`;
}

function registerUser(){

const name =
document.getElementById("userName").value;

const email =
document.getElementById("userEmail").value;

if(!name || !email){

showToast("Please fill all fields", "Name and email are required");
return;

}

user = {
name,
email,
joined:new Date().toLocaleDateString(),
firstDiscount:true
};

localStorage.setItem(
"tickethubUser",
JSON.stringify(user)
);

window.location.href = "account.html";
}

function logoutUser(){

localStorage.removeItem(
"tickethubUser"
);

location.reload();
}