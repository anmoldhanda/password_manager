// ====================== function to delete the table entry from the password manager form database ======================
const delete_tabledata_entry = (selected_entry) => {
  let tbodydata_arr = JSON.parse(localStorage.getItem("cGFzc3dvcmRtYW5hZ2VyX2Zvcm1kYXRhYmFzZQ=="));
  let updated_tbodydata_arr = tbodydata_arr.filter((entry)=>{
    // ====================== selected_entry parameter's value is a string whereas the parameters passed from the filter method which is giving array as result method is an object that's why we've to say that if there's key website then delete the particular element as per the user clicked on it ======================
    return entry.website !== selected_entry;
  })
  localStorage.setItem(btoa("passwordmanager_formdatabase"),JSON.stringify(updated_tbodydata_arr));
  show_passwordmanager_tabledatabase();
}

// ========================== convert the plain text password into encrypted format ==========================
const password_encryption = (password_text) => {
  let pass_str = "";
  for(let index=0;index<password_text.length; index++) {
    // ==================== pass_str is empty then updated this with it's existing value and added * into it ====================
    pass_str += "*";
  }
  return pass_str;
}

// ========================== function to fill the table data from the password manager form database ==========================
const show_passwordmanager_tabledatabase = () => {
  const tbody = document.getElementsByTagName("tbody")[0];
  let tbody_data = JSON.parse(localStorage.getItem("cGFzc3dvcmRtYW5hZ2VyX2Zvcm1kYXRhYmFzZQ=="));
  if(tbody_data == null || tbody_data.length === 0) {
    tbody.innerHTML = "<tr><td colspan='3' id='nodata-to-showtext'>No data to show</td></tr>";
  }
  else {
    // ================================= clear the table body and then add the new entry data without clearing it will show the previous entry's data as duplicated entry =================================
    tbody.innerHTML = "";
    tbody_data.forEach((tbody_item)=>{
      // =============================== deencrypted the encrypted data and printed to the DOM ===============================
      let populate_tbody_data = `
      <tr>
      <td>${atob(tbody_item.website)}</td>
      <td>${atob(tbody_item.emailid)}</td>
      <td>${password_encryption(tbody_item.password)}</td>
      <td><i class="fa-solid fa-trash delete-tableentry-icon" onclick="delete_tabledata_entry('${tbody_item.website}')" id="${atob(tbody_item.website)}"></i></td>
      </tr>`;
      // ================================= set the table body's innerhtml with it's existing html and add the populate tbody data which is table data from password manager database =================================
      tbody.innerHTML += populate_tbody_data;
    })
  }
}
show_passwordmanager_tabledatabase();

const input_website = document.getElementById("input-website");
const input_emailid = document.getElementById("input-emailid");
const input_password = document.getElementById("input-password");
let valid_input_website = false;
let valid_input_emailid = false;
let valid_input_password = false;

// =============================================== validate website name ===============================================
input_website.addEventListener("blur", () => {
  let input_website_field = input_website.value;
  if (input_website_field.trim().length == "") {
    console.log("invalid website name");
    input_website.classList.add("error-inputs");
    valid_input_website = false;
  } else {
    console.log("valid website name");
    input_website.classList.remove("error-inputs");
    valid_input_website = true;
  }
});

// ================================================ validate email adress ================================================
input_emailid.addEventListener("blur", () => {
  let validate_emailid = /^([\.\-a-zA-Z0-9]+)@([\.\-a-zA-Z0-9]+)\.([a-zA-Z]){1,29}$/;
  let input_email_field = input_emailid.value;
  if (validate_emailid.test(input_email_field)) {
    console.log("valid email id");
    input_emailid.classList.remove("error-inputs");
    valid_input_emailid = true;
  } else {
    console.log("invalid email id");
    input_emailid.classList.add("error-inputs");
    valid_input_emailid = false;
  }
});

// =============================================== validate password ===============================================
input_password.addEventListener("blur", () => {
  let validate_password = /^([a-zA-Z0-9]){8,29}$/;
  let input_password_field = input_password.value;
  if (validate_password.test(input_password_field)) {
    console.log("valid password");
    input_password.classList.remove("error-inputs");
    valid_input_password = true;
  } else {
    console.log("invalid password");
    input_password.classList.add("error-inputs");
    valid_input_password = false;
  }
});

// ========================== copies text when the user clicks on the copy icon using navigator api ==========================
const copypassword_icon = document.getElementById("copypassword-icon");
const copytext = (copiedtext)=> {
  navigator.clipboard.writeText(copiedtext).then(()=>{
    console.log("copied text is " + copiedtext);
  }).catch((error)=>{
    console.log(error);
  })
}
copypassword_icon.addEventListener("click",()=>{
  const passwordfield_tocopy = input_password.value;
  copytext(passwordfield_tocopy);
})

const save_passwords_form = document.querySelector(".save-passwords-form");
save_passwords_form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (valid_input_website && valid_input_emailid && valid_input_password) {
    console.log("you are good to go");
    let passwordmanager_formdatabase = JSON.parse(localStorage.getItem("cGFzc3dvcmRtYW5hZ2VyX2Zvcm1kYXRhYmFzZQ=="));
    console.log(passwordmanager_formdatabase);
    // ============================ if there is not stored any passwords in password manager then create a blank array and add objects into it as form data entry then save the form database into localstorage ============================
    if(passwordmanager_formdatabase == null) {
      let passwordmanager_database = [];
      let passwordmanager_entry = {
        website: btoa(input_website.value),
        emailid: btoa(input_emailid.value),
        password: btoa(input_password.value),
      }
      passwordmanager_database.push(passwordmanager_entry);
      // ================================= storing data in encrypted format so it won't be readable to client side =================================
      localStorage.setItem(btoa("passwordmanager_formdatabase"),JSON.stringify(passwordmanager_database));
    }
    else {
      // ============================ if there is already some passwords stored into the password manager then grab the existing form database entries and add new entries into the form databse and udpate the form database and then save the updated form database into localstorage ============================
      let passwordmanager_database = JSON.parse(localStorage.getItem("cGFzc3dvcmRtYW5hZ2VyX2Zvcm1kYXRhYmFzZQ=="));
      let passwordmanager_entry = {
        website: btoa(input_website.value),
        emailid: btoa(input_emailid.value),
        password: btoa(input_password.value),
      }
      passwordmanager_database.push(passwordmanager_entry);
      localStorage.setItem(btoa("passwordmanager_formdatabase"), JSON.stringify(passwordmanager_database));
    }
    show_passwordmanager_tabledatabase();
    save_passwords_form.reset();
  } else {
    console.log("form not submitted");
    save_passwords_form.reset();
  }
});