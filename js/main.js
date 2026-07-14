var contactNameInput = document.getElementById("fullName");
var contactNumberInput = document.getElementById("phoneNumber");
var contactEmailInput = document.getElementById("emailAddress");
var contactAddressInput = document.getElementById("Address");
var contactGroupInput = document.getElementById("Group");
var contactNotesInput = document.getElementById("Notes");
var contactImageInput = document.getElementById("change-photo");

var contactFavInput = document.getElementById("fav");
var contactEmargInput = document.getElementById("emarg");

var addBtn = document.getElementById("addBtn");

var contactsContainer = document.getElementById("contacts");
var favoriteContainer = document.getElementById("favorite");
var emergencyContainer = document.getElementById("emarj");

var totalCounter = document.getElementById("total");
var favoriteCounter = document.getElementById("favorite-count");
var emergencyCounter = document.getElementById("Emar-count");

var searchInput = document.getElementById("searcInput");

var contacts = [];

var currentIndex = -1;

var imageSource = "images/contact-image.jpg";

if(localStorage.getItem("contacts")!=null){

    // contacts=JSON.parse(localStorage.getItem("contacts"));

    var storedContacts = JSON.parse(localStorage.getItem("contacts"));

if(Array.isArray(storedContacts)){

    contacts = storedContacts;

}else{

    contacts = [];

}

    displayContacts();

    displayFavorite();

    displayEmergency();

    updateCounters();

}

addBtn.addEventListener("click",function(){

    if(validateInputs()==false){
        clearInputs()
        return;

    }

    if(currentIndex==-1){

        addContact();

    }

    else{

        updateContact();

    }

});



function clearInputs(){

    contactNameInput.value="";

    contactNumberInput.value="";

    contactEmailInput.value="";

    contactAddressInput.value="";

    contactGroupInput.selectedIndex=0;

    contactNotesInput.value="";

    contactFavInput.checked=false;

    contactEmargInput.checked=false;

    contactImageInput.value="";

    imageSource="images/contact-image.jpg";

}

function validateInputs(){

    var phoneRegex=/^01[0125][0-9]{8}$/;

    var emailRegex=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if(contactNameInput.value.trim()==""){

        Swal.fire("Name Required");

        return false;

    }

    if(phoneRegex.test(contactNumberInput.value)==false){

        Swal.fire("Invalid Phone");

        return false;

    }

    if(contactEmailInput.value!=""){

        if(emailRegex.test(contactEmailInput.value)==false){

            Swal.fire("Invalid Email");

            return false;

        }

    }

    return true;

}

function addContact(){

    if(isPhoneExist(contactNumberInput.value, -1)){

        Swal.fire({

            icon:"error",

            title:"Phone Number Already Exists",

            text:"Please enter another phone number."

        });

        return;

    }

    var contact={

        name:contactNameInput.value,

        phone:contactNumberInput.value,

        email:contactEmailInput.value,

        address:contactAddressInput.value,

        group:contactGroupInput.value,

        notes:contactNotesInput.value,

        favorite:contactFavInput.checked,

        emergency:contactEmargInput.checked,

        image:imageSource

    };

    contacts.push(contact);

    saveData();

    displayContacts();

    displayFavorite();

    displayEmergency();

    updateCounters();

    clearInputs();

    Swal.fire({

        icon:"success",

        title:"Contact Added",

        timer:1200,

        showConfirmButton:false

    });

}

function isPhoneExist(phone, currentI){

    for(var i = 0; i < contacts.length; i++){

        if(contacts[i].phone == phone && i != currentI){
            clearInputs()
            return true;
        }
    }
    return false;

}
function saveData(){

    localStorage.setItem("contacts",JSON.stringify(contacts));

}
function displayContacts(){

    var cartona="";

    if(contacts.length==0){

        contactsContainer.innerHTML=
        '<div class="col-12">'+
        '<div class="alert alert-light text-center shadow rounded-4 p-5">'+
        '<i class="fa-solid fa-address-book fa-4x text-secondary mb-3"></i>'+
        '<h3>No Contacts Yet</h3>'+
        '<p class="text-secondary">Click Add Contact</p>'+
        '</div>'+
        '</div>';

        return;

    }

    for(var i=0;i<contacts.length;i++){

        cartona+=

        '<div class="contact-card col-12 col-sm-6 p-2">'+

        '<div class="inner shadow rounded-4 p-3">'+

        '<div class="d-flex gap-3 align-items-start">'+

        '<img src="'+contacts[i].image+'" class="rounded-4" style="width:70px;height:70px;object-fit:cover;">'+

        '<div class="flex-grow-1">'+

        '<h4 class="mb-1">'+contacts[i].name+'</h4>'+

        '<p class="m-0 text-secondary">'+contacts[i].phone+'</p>'+

        '<p class="m-0 text-secondary">'+contacts[i].email+'</p>'+

        '<p class="m-0 text-secondary">'+contacts[i].address+'</p>'+

        '<div class="mt-2">'+

        '<span class="badge bg-primary">'+contacts[i].group+'</span>'+

        '</div>'+

        '</div>'+

        '</div>';

        if(contacts[i].notes!=""){

            cartona+=

            '<div class="alert alert-light mt-3">'+

            contacts[i].notes+

            '</div>';

        }

        cartona+=

        '<div class="border-top pt-3 mt-3">'+

        '<div class="d-flex justify-content-between">'+

        '<div>'+

        '<a href="tel:'+contacts[i].phone+'" class="btn btn-success btn-sm me-1"><i class="fa-solid fa-phone"></i></a>';

        if(contacts[i].email!=""){

            cartona+=

            '<a href="mailto:'+contacts[i].email+'" class="btn btn-primary btn-sm"><i class="fa-solid fa-envelope"></i></a>';

        }

        cartona+=

        '</div>'+

        '<div>'+

        '<button class="btn btn-light me-1" onclick="toggleFavorite('+i+')">';

        if(contacts[i].favorite){

            cartona+='<i class="fa-solid fa-star text-warning"></i>';

        }

        else{

            cartona+='<i class="fa-regular fa-star"></i>';

        }

        cartona+='</button>';

        cartona+='<button class="btn btn-light me-1" onclick="toggleEmergency('+i+')">';

        if(contacts[i].emergency){

            cartona+='<i class="fa-solid fa-heart text-danger"></i>';

        }

        else{

            cartona+='<i class="fa-regular fa-heart"></i>';

        }

        cartona+='</button>';

        cartona+='<button class="btn btn-warning btn-sm me-1" onclick="editContact('+i+')"><i class="fa-solid fa-pen"></i></button>';

        cartona+='<button class="btn btn-danger btn-sm" onclick="deleteContact('+i+')"><i class="fa-solid fa-trash"></i></button>';

        cartona+=

        '</div>'+

        '</div>'+

        '</div>'+

        '</div>'+

        '</div>';

    }

    contactsContainer.innerHTML=cartona;

}


function displayFavorite(){

    var cartona="";

    for(var i=0;i<contacts.length;i++){

        if(contacts[i].favorite){

            cartona+=

            '<div class="p-2 col-6 col-xl-12">'+

            '<div class="contact p-2 d-flex align-items-center justify-content-between rounded-3">'+

            '<img src="'+contacts[i].image+'" class="rounded-2" width="40" height="40">'+

            '<div class="contact-info me-auto ms-2">'+

            '<h6 class="m-0">'+contacts[i].name+'</h6>'+

            '<p class="m-0">'+contacts[i].phone+'</p>'+

            '</div>'+

            '<a href="tel:'+contacts[i].phone+'" class="call-bg bg-success bg-opacity-25 rounded-2 d-flex align-items-center justify-content-center">'+

            '<i class="fa-solid fa-phone text-success"></i>'+

            '</a>'+

            '</div>'+

            '</div>';

        }

    }

    favoriteContainer.innerHTML=cartona;

}

function displayEmergency(){

    var cartona="";

    for(var i=0;i<contacts.length;i++){

        if(contacts[i].emergency){

            cartona+=

            '<div class="p-2 col-6 col-xl-12">'+

            '<div class="contact p-2 d-flex align-items-center justify-content-between rounded-3">'+

            '<img src="'+contacts[i].image+'" class="rounded-2" width="40" height="40">'+

            '<div class="contact-info me-auto ms-2">'+

            '<h6 class="m-0">'+contacts[i].name+'</h6>'+

            '<p class="m-0">'+contacts[i].phone+'</p>'+

            '</div>'+

            '<a href="tel:'+contacts[i].phone+'" class="call-bg bg-danger bg-opacity-25 rounded-2 d-flex align-items-center justify-content-center">'+

            '<i class="fa-solid fa-phone text-danger"></i>'+

            '</a>'+

            '</div>'+

            '</div>';

        }

    }

    emergencyContainer.innerHTML=cartona;

}

function updateCounters(){

    var fav=0;

    var emg=0;

    for(var i=0;i<contacts.length;i++){

        if(contacts[i].favorite){

            fav++;

        }

        if(contacts[i].emergency){

            emg++;

        }

    }

    totalCounter.innerHTML=contacts.length;

    favoriteCounter.innerHTML=fav;

    emergencyCounter.innerHTML=emg;

}

searchInput.addEventListener("keyup",function(){

    var term=searchInput.value.toLowerCase();

    var cartona="";

    for(var i=0;i<contacts.length;i++){

        if(

            contacts[i].name.toLowerCase().indexOf(term)!=-1 ||

            contacts[i].phone.indexOf(term)!=-1 ||

            contacts[i].email.toLowerCase().indexOf(term)!=-1 ||

            contacts[i].address.toLowerCase().indexOf(term)!=-1

        ){
            cartona +=
'<div class="contact-card col-12 col-sm-6 p-2">'+
    '<div class="inner shadow rounded-4 p-3">'+

        '<div class="d-flex gap-3">'+
            '<img src="'+contacts[i].image+'" class="rounded-4" style="width:70px;height:70px;object-fit:cover;">'+

            '<div class="flex-grow-1">'+
                '<h4>'+contacts[i].name+'</h4>'+
                '<p>'+contacts[i].phone+'</p>'+
                '<p>'+contacts[i].email+'</p>'+
            '</div>'+
        '</div>'+

        '<div class="mt-3 d-flex gap-2">'+

            '<a href="tel:'+contacts[i].phone+'" class="btn btn-success btn-sm">'+
                '<i class="fa-solid fa-phone"></i> Call'+
            '</a>'+

            '<button onclick="editContact('+i+')" class="btn btn-warning btn-sm">'+
                '<i class="fa-solid fa-pen"></i> Edit'+
            '</button>'+

            '<button onclick="deleteContact('+i+')" class="btn btn-danger btn-sm">'+
                '<i class="fa-solid fa-trash"></i> Delete'+
            '</button>'+

        '</div>'+

    '</div>'+
'</div>';

        }

    }

    if(term==""){

        displayContacts();

    }

    else{

        contactsContainer.innerHTML=cartona;

    }

})


function deleteContact(index){

    Swal.fire({

        title:"Delete Contact?",

        text:"This contact will be deleted permanently.",

        icon:"warning",

        showCancelButton:true,

        confirmButtonColor:"#dc3545",

        cancelButtonColor:"#6c757d",

        confirmButtonText:"Delete"

    }).then(function(result){

        if(result.isConfirmed){

            contacts.splice(index,1);

            saveData();

            displayContacts();

            displayFavorite();

            displayEmergency();

            updateCounters();

            Swal.fire({

                icon:"success",

                title:"Deleted Successfully",

                timer:1200,

                showConfirmButton:false

            });

        }

    });

}

// function deleteContact(index){

//     if(confirm("Delete this contact?")){

//         contacts.splice(index,1);

//         saveData();

//         displayContacts();

//         displayFavorite();

//         displayEmergency();

//         updateCounters();

//         alert("Deleted Successfully");
//     }

// }
function editContact(index){

    currentIndex=index;

    contactNameInput.value=contacts[index].name;

    contactNumberInput.value=contacts[index].phone;

    contactEmailInput.value=contacts[index].email;

    contactAddressInput.value=contacts[index].address;

    contactGroupInput.value=contacts[index].group;

    contactNotesInput.value=contacts[index].notes;

    contactFavInput.checked=contacts[index].favorite;

    contactEmargInput.checked=contacts[index].emergency;

    imageSource=contacts[index].image;

    addBtn.innerHTML='<i class="fa-solid fa-check pe-2"></i>Update Contact';

    var modal=new bootstrap.Modal(document.getElementById("staticBackdrop"));

    modal.show();

}

function updateContact(){

    contacts[currentIndex].name=contactNameInput.value;

    contacts[currentIndex].phone=contactNumberInput.value;

    contacts[currentIndex].email=contactEmailInput.value;

    contacts[currentIndex].address=contactAddressInput.value;

    contacts[currentIndex].group=contactGroupInput.value;

    contacts[currentIndex].notes=contactNotesInput.value;

    contacts[currentIndex].favorite=contactFavInput.checked;

    contacts[currentIndex].emergency=contactEmargInput.checked;

    contacts[currentIndex].image=imageSource;

    saveData();

    displayContacts();

    displayFavorite();

    displayEmergency();

    updateCounters();

    clearInputs();

    currentIndex=-1;

    addBtn.innerHTML='<i class="fa-solid fa-check pe-2"></i>Save Contact';

    Swal.fire({

        icon:"success",

        title:"Updated Successfully",

        timer:1200,

        showConfirmButton:false

    });

}

function toggleFavorite(index){

    if(contacts[index].favorite){

        contacts[index].favorite=false;

    }

    else{

        contacts[index].favorite=true;

    }

    saveData();

    displayContacts();

    displayFavorite();

    updateCounters();

}

function toggleEmergency(index){

    if(contacts[index].emergency){

        contacts[index].emergency=false;

    }

    else{

        contacts[index].emergency=true;

    }

    saveData();

    displayContacts();

    displayEmergency();

    updateCounters();

}