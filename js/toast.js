function showToast(title, text = "", type = "success"){
  const oldToast = document.querySelector(".toast");

  if(oldToast){
    oldToast.remove();
  }

  const icons = {
    success: "✅",
    error: "⚠️",
    info: "ℹ️",
    payment: "💳",
    ticket: "🎟"
  };

  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;

  toast.innerHTML = `
    <div class="toast-icon">${icons[type] || "🎟"}</div>

    <div>
      <strong>${title}</strong>
      ${text ? `<small>${text}</small>` : ""}
    </div>
  `;

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("show");
  }, 50);

  setTimeout(() => {
    toast.classList.remove("show");
  }, 3200);

  setTimeout(() => {
    toast.remove();
  }, 3600);
}