var contacts = [
  { id: 1,  name: "Shankar",   mobile: "9121973868", email: "shankar@gmail.com",   fav: true  },
  { id: 2,  name: "Abhiram",   mobile: "9014834981", email: "abhiram@gmail.com",  fav: false  },
  { id: 3,  name: "Ramu",      mobile: "9731247680", email: "ramu@gmail.com",      fav: true  },
  { id: 4,  name: "Mahesh",    mobile: "9656486893", email: "mahesh@gmail.com",    fav: false },
  { id: 5,  name: "Yashwanth", mobile: "9567812340", email: "yashwanth@gmail.com", fav: true },
  { id: 6,  name: "Surya",     mobile: "9475961230", email: "surya@gmail.com",     fav: false },
  { id: 7,  name: "Jayanth",   mobile: "9345612340", email: "jayanth@gmail.com",    fav: false },
  { id: 8,  name: "Sunil",     mobile: "8855015230", email: "sunil@gmail.com",     fav: true },
  { id: 9,  name: "Venkat",    mobile: "7786490120", email: "venkat@gmail.com",      fav: false },
  { id: 10, name: "Praveen",   mobile: "9000876580", email: "praveen@gmail.com",    fav: true }
];

var editId    = null;
var sortOrder = "asc";

// SVG icons
var svgPhone = "<svg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.9 19.79 19.79 0 0 1 1.64 5.27 2 2 0 0 1 3.62 3h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 10.9a16 16 0 0 0 6.16 6.16l1.06-1.06a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z'/></svg>";

var svgEmail = "<svg width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z'/><polyline points='22,6 12,13 2,6'/></svg>";

var svgEdit = "<svg width='15' height='15' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7'/><path d='M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z'/></svg>";

var svgDelete = "<svg width='15' height='15' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='3 6 5 6 21 6'/><path d='M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6'/><path d='M10 11v6'/><path d='M14 11v6'/><path d='M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2'/></svg>";

// avatar colors based on first letter
var colors = ["#3b82f6", "#8b5cf6", "#10b981", "#f59e0b", "#ef4444", "#06b6d4", "#ec4899"];

function getColor(name) {
  return colors[name.charCodeAt(0) % colors.length];
}

function setSort(order) {
  sortOrder = order;
  document.getElementById("btnAZ").classList.toggle("active", order == "asc");
  document.getElementById("btnZA").classList.toggle("active", order == "desc");
  renderAll();
}

function toggleSort() {
  setSort(sortOrder == "asc" ? "desc" : "asc");
}

function openModal() {
  editId = null;
  document.getElementById("inputName").value  = "";
  document.getElementById("inputMobile").value = "";
  document.getElementById("inputEmail").value  = "";
  document.getElementById("errName").textContent   = "";
  document.getElementById("errMobile").textContent = "";
  document.getElementById("errEmail").textContent  = "";
  document.getElementById("modalHeading").textContent = "Add Contact";
  document.getElementById("saveBtn").textContent      = "Add Contact";
  document.getElementById("modalBg").classList.add("show");
  setTimeout(function() { document.getElementById("inputName").focus(); }, 50);
}

function closeModal() {
  editId = null;
  document.getElementById("modalBg").classList.remove("show");
}

function saveContact() {
  var name   = document.getElementById("inputName").value.trim();
  var mobile = document.getElementById("inputMobile").value.trim();
  var email  = document.getElementById("inputEmail").value.trim();

  // clear old error messages first
  document.getElementById("errName").textContent   = "";
  document.getElementById("errMobile").textContent = "";
  document.getElementById("errEmail").textContent  = "";

  var hasError = false;

  if (name == "") {
    document.getElementById("errName").textContent = "Name is required.";
    hasError = true;
  }

  // checking if mobile contains only numbers
  if (mobile == "") {
    document.getElementById("errMobile").textContent = "Mobile is required.";
    hasError = true;
  } else if (isNaN(mobile) || mobile.indexOf(" ") > -1) {
    document.getElementById("errMobile").textContent = "Only digits allowed.";
    hasError = true;
  }

  if (email != "" && email.indexOf("@") == -1) {
    document.getElementById("errEmail").textContent = "Enter a valid email.";
    hasError = true;
  }

  if (hasError) return;

  if (editId != null) {
    for (var i = 0; i < contacts.length; i++) {
      if (contacts[i].id == editId) {
        contacts[i].name   = name;
        contacts[i].mobile = mobile;
        contacts[i].email  = email;
        break;
      }
    }
  } else {
    var newContact = {
      id:     Date.now(),
      name:   name,
      mobile: mobile,
      email:  email,
      fav:    false
    };
    contacts.push(newContact);
  }

  closeModal();
  renderAll();
}

function editContact(id) {
  for (var i = 0; i < contacts.length; i++) {
    if (contacts[i].id == id) {
      editId = contacts[i].id;

      // fill all fields so user can edit name, mobile and email
      document.getElementById("inputName").value   = contacts[i].name;
      document.getElementById("inputMobile").value = contacts[i].mobile;
      document.getElementById("inputEmail").value  = contacts[i].email;

      document.getElementById("errName").textContent   = "";
      document.getElementById("errMobile").textContent = "";
      document.getElementById("errEmail").textContent  = "";

      document.getElementById("modalHeading").textContent = "Edit Contact";
      document.getElementById("saveBtn").textContent      = "Save Changes";

      document.getElementById("modalBg").classList.add("show");
      setTimeout(function() { document.getElementById("inputName").focus(); }, 50);
      break;
    }
  }
}

function deleteContact(id) {
  if (!confirm("Are you sure you want to delete?")) return;
  var updated = [];
  for (var i = 0; i < contacts.length; i++) {
    if (contacts[i].id != id) updated.push(contacts[i]);
  }
  contacts = updated;
  renderAll();
}

function toggleFav(id) {
  for (var i = 0; i < contacts.length; i++) {
    if (contacts[i].id == id) {
      contacts[i].fav = !contacts[i].fav;
      break;
    }
  }
  renderAll();
}

// groups a list by the first letter of name
function groupByLetter(list) {
  var groups = {};
  for (var i = 0; i < list.length; i++) {
    var letter = list[i].name[0].toUpperCase();
    if (!groups[letter]) groups[letter] = [];
    groups[letter].push(list[i]);
  }
  return groups;
}

function renderAll() {
  var query = document.getElementById("searchBox").value.toLowerCase();

  // filter based on search input
  var filtered = [];
  for (var i = 0; i < contacts.length; i++) {
    var c = contacts[i];
    var matchName   = c.name.toLowerCase().indexOf(query) > -1;
    var matchMobile = c.mobile.indexOf(query) > -1;
    var matchEmail  = c.email.toLowerCase().indexOf(query) > -1;
    if (matchName || matchMobile || matchEmail) {
      filtered.push(c);
    }
  }

  // sort alphabetically
  filtered.sort(function(a, b) {
    if (sortOrder == "asc") return a.name.localeCompare(b.name);
    return b.name.localeCompare(a.name);
  });

  document.getElementById("countLabel").textContent = contacts.length + " Contacts";

  renderSidebar(filtered);
  renderMainPanel(filtered);
}

function renderSidebar(list) {
  var sb = document.getElementById("sidebarList");
  sb.innerHTML = "";

  if (list.length == 0) {
    sb.innerHTML = "<p style='color:#ccc;font-size:13px;margin-top:8px;'>No contacts</p>";
    return;
  }

  var groups = groupByLetter(list);
  var letters = Object.keys(groups).sort(function(a, b) {
    return sortOrder == "asc" ? a.localeCompare(b) : b.localeCompare(a);
  });

  for (var i = 0; i < letters.length; i++) {
    var l = letters[i];
    sb.innerHTML += "<div class='sb-alpha'>" + l + "</div>";

    for (var j = 0; j < groups[l].length; j++) {
      var c  = groups[l][j];
      var bg = getColor(c.name);
      var starHtml = c.fav ? "<span class='sb-star'>&#9733;</span>" : "";

      sb.innerHTML +=
        "<div class='sb-card' onclick='editContact(" + c.id + ")'>" +
          "<div class='sb-avatar' style='background:" + bg + "'>" + c.name[0] + "</div>" +
          "<div class='sb-info'>" +
            "<div class='sb-name'>" + c.name + starHtml + "</div>" +
            "<div class='sb-phone'>" + c.mobile + "</div>" +
            (c.email ? "<div class='sb-email'>" + c.email + "</div>" : "") +
          "</div>" +
        "</div>";
    }
  }
}

function renderMainPanel(list) {
  var panel = document.getElementById("contactList");
  panel.innerHTML = "";

  if (list.length == 0) {
    panel.innerHTML = "<div class='empty-msg'><p>No contacts found.</p></div>";
    return;
  }

  // show favourites at the top
  var favList = [];
  for (var i = 0; i < list.length; i++) {
    if (list[i].fav) favList.push(list[i]);
  }

  if (favList.length > 0) {
    var favHtml = "<div class='group-box'><div class='group-title'><span class='fav-icon'>&#9733;</span> Favourites</div>";
    for (var i = 0; i < favList.length; i++) {
      favHtml += buildCardHtml(favList[i]);
    }
    panel.innerHTML += favHtml + "</div>";
  }

  // group the rest alphabetically
  var others = [];
  for (var i = 0; i < list.length; i++) {
    if (!list[i].fav) others.push(list[i]);
  }

  var groups  = groupByLetter(others);
  var letters = Object.keys(groups).sort(function(a, b) {
    return sortOrder == "asc" ? a.localeCompare(b) : b.localeCompare(a);
  });

  for (var i = 0; i < letters.length; i++) {
    var l    = letters[i];
    var html = "<div class='group-box'><div class='group-title'>" + l + "</div>";
    for (var j = 0; j < groups[l].length; j++) {
      html += buildCardHtml(groups[l][j]);
    }
    panel.innerHTML += html + "</div>";
  }
}

function buildCardHtml(c) {
  var bg       = getColor(c.name);
  var starHtml = c.fav ? "<span class='card-fav-star'>&#9733;</span>" : "";
  var subText  = c.email ? c.email : c.mobile;
  var emailRow = c.email ? "<div class='phone-email'>" + c.email + "</div>" : "";

  return (
    "<div class='contact-card'>" +
      "<div class='card-avatar' style='background:" + bg + "'>" + c.name[0] + "</div>" +

      "<div class='card-info'>" +
        "<div class='card-name'>" + c.name + "</div>" +
        "<div class='card-sub'>" + starHtml + svgEmail + " " + subText + "</div>" +
      "</div>" +

      "<div class='card-phone-col'>" +
        "<div class='phone-row'>" +
          "<span class='phone-number'>" + c.mobile + "</span>" +
          "<span class='phone-circle'>" + svgPhone + "</span>" +
        "</div>" +
        emailRow +
      "</div>" +

      "<div class='card-actions'>" +
        "<button onclick='editContact(" + c.id + ")' title='Edit'>" + svgEdit + "</button>" +
        "<button class='del-btn' onclick='deleteContact(" + c.id + ")' title='Delete'>" + svgDelete + "</button>" +
      "</div>" +
    "</div>"
  );
}

// run on page load
renderAll();
