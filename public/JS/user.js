const model = document.querySelector(".bg-model");
const edit = document.querySelectorAll(".editMemory");
const id = document.querySelectorAll(".card-id");
const title = document.querySelectorAll(".card-title");
const message = document.querySelectorAll(".card-message");
const tag = document.querySelectorAll(".card-tag");
const year = document.querySelectorAll(".card-year");
const month = document.querySelectorAll(".card-month");
const date = document.querySelectorAll(".card-date");
const locate = document.querySelectorAll(".card-location");
const checkbox = document.querySelectorAll(".card-slider");
const photos = document.querySelectorAll(".photos");
const previewArr = [];
const thumbnail = () =>{
  for(let i=0;i<6;i++){
    $("#frames").append(`<li><div class="drop-area-thumbnail preview"></div></li>`);
  }
}
const Append = () => {
  $("#frames").html('');
  if($('.carousel-inner').length>0){
    while (document.querySelector('.carousel-inner').firstChild) {
      document.querySelector('.carousel-inner').lastChild.remove()
    }
  }

  $('.carousel-inner').append(`<div class="carousel-item active"><img src="${window.URL.createObjectURL(previewArr[0])}" />
  </div>`);

  for(let i=1;i<previewArr.length;i++){
    $('.carousel-inner').append(`<div class="carousel-item"><img src="${window.URL.createObjectURL(previewArr[i])}" />
    </div>`);
  }

  $("#frames").append(`<li data-target="#carouselExampleIndicators" data-slide-to="0" class="active"><div style="position: relative">
  <img src="${window.URL.createObjectURL(previewArr[0])}" class="drop-area-thumbnail" style="opacity: 1;" /><div class="previewClose">+</div></div></li>`);

  for(let i=1;i<previewArr.length;i++){
    $("#frames").append(`<li data-target="#carouselExampleIndicators" data-slide-to="${i}"><div style="position: relative">
    <img src="${window.URL.createObjectURL(previewArr[i])}" class="drop-area-thumbnail" style="opacity: 1;" /><div class="previewClose">+</div></div></li>`);
  }
  const previewClose = document.querySelectorAll(".previewClose");
  for (let i = 0; i < previewArr.length; i++) {
    previewClose[i].addEventListener("click", ((j) => {
      return function() {
        previewArr.splice(j, 1);
        if($('.carousel-inner').length>0){
          while (document.querySelector('.carousel-inner').firstChild) {
            document.querySelector('.carousel-inner').lastChild.remove()
          }
          $("#frames").empty();
          if(previewArr.length>0) 
            Append();
          else {
            thumbnail();
          }
        }
      }
    })(i))
  }
  if (previewArr.length < 6) {
    $("#frames").append(`<li><label for="drop-zone__input" class="custom-file"><div class="drop-area-thumbnail preview">+</div></label><input type="file" id="drop-zone__input" class="drop-zone__input" name="photo[]" /></li>`)
  }
}
$(document).ready(function() {
  $('.drop-zone').on('dragover', function() {
    $(".drop-zone").css('border-color', "#ea4c89");
    $(".fa-cloud-upload-alt").css('color', "#ea4c89");
    return false;
  });
  $('.drop-zone').on('dragleave', function() {
    $(".drop-zone").css('border-color', "#d9d9d9");
    $(".fa-cloud-upload-alt").css('color', "#d7d7da");
    return false;
  });
  $('.drop-zone').on('drop', function(e) {
    e.preventDefault();
    let image_list = e.originalEvent.dataTransfer.files;
    for (let i = 0; i < image_list.length && previewArr.length < 6; i++) {
      previewArr.push(image_list[i]);
    }
    Append();
  });
  $('#drop-zone__input').change(function() {
    for (let i = 0; i < $(this)[0].files.length && previewArr.length < 6; i++)
      previewArr.push(this.files[i]);
    Append();
  });
});
$('.drop-zone').mouseover(() => {
  $('.drop-zone').css("border-color", "#ea4c89");
  $('.fa-cloud-upload-alt').css("color", "#ea4c89");
});
$('.drop-zone').mouseout(() => {
  $('.drop-zone').css("border-color", "#d9d9d9");
  $('.fa-cloud-upload-alt').css("color", "#d7d7da");
});
$("#topUp").on("click", function() {
  $(window).scrollTop(0);
});
function emptyTheForm(){
  document.querySelector(".title").value = "";
  document.querySelector(".tag").value = "";
  document.querySelector(".message").value = "";
  document.querySelector(".year").value = "";
  document.querySelector(".month").value = "";
  document.querySelector(".date").value = "";
  document.querySelector(".location").value = "";
  document.querySelector(".checkBox").checked = false;
  while(previewArr.length>0){
    previewArr.pop();
  }
  $("#frames").empty();
  if($('.carousel-inner').length>0){
    while (document.querySelector('.carousel-inner').firstChild) {
      document.querySelector('.carousel-inner').lastChild.remove();
    }
  }
  thumbnail();
}
document.querySelectorAll(".primary-btn")[1].addEventListener("click", function() {
  emptyTheForm();
  $("#addEditForm").attr('action', '/memories/create');
  $("#addEditMemoryButton").html('Add a memory');
  $("#formHeading").html("Add a Memory");
  model.style.display = "flex";
});
document.getElementById("addMemory").addEventListener("click", function() {
  emptyTheForm();
  $("#addEditForm").attr('action', '/memories/create');
  $("#addEditMemoryButton").html('Add a memory');
  $("#formHeading").html("Add a Memory");
  model.style.display = "flex";
});
for (let i = 0; i < edit.length; i++) {
  edit[i].addEventListener("click", ((j) => {
    return function() {
      emptyTheForm();
      $("#addEditForm").attr('action', '/memories/update');
      $("#addEditMemoryButton").html('Update a memory');
      $("#formHeading").html("Edit a Memory");
      model.style.display = "flex";
      let stringTag = "";
      for (let k = 0; k < tag[j].innerHTML.length; k++) {
        if (tag[j].innerHTML[k] !== "#") {
          if (tag[j].innerHTML[k] === " ")
            stringTag += ",";
          else {
            stringTag += tag[j].innerHTML[k];
          }
        }
      }
      document.querySelector(".id").value = id[j].innerHTML;
      document.querySelector(".title").value = title[j].innerHTML;
      document.querySelector(".tag").value = stringTag;
      document.querySelector(".message").value = message[j].innerHTML;
      document.querySelector(".year").value = year[j].innerHTML;
      document.querySelector(".month").value = month[j].innerHTML;
      document.querySelector(".date").value = date[j].innerHTML;
      document.querySelector(".location").value = locate[j].innerHTML;
      if(checkbox[j].innerHTML === "true")
        document.querySelector('.checkBox').checked=true;
      else 
        document.querySelector('.checkBox').checked=false;
      // let photo = photos[j].value.split(',');
      // for(let value of photo)
      //   previewArr.push(value);
    }
  })(i))
}
$(document).ready(function() {
  $("#addEditForm").submit(function(e) {
    e.preventDefault();
    const fd = new FormData();
    const id = document.querySelector(".id").value;
    const title = document.querySelector(".title").value;
    const tag = document.querySelector(".tag").value;
    const message = document.querySelector(".message").value;
    const year = document.querySelector(".year").value;
    const month = document.querySelector(".month").value;
    const date = document.querySelector(".date").value;
    const location = document.querySelector(".location").value;
    const checkBox = document.querySelector(".checkBox").checked;
    const action = document.getElementById("addEditForm").getAttribute('action');
    fd.append("id", id);
    fd.append("title", title);
    fd.append("tags", tag); 
    fd.append("message", message);
    fd.append("location", location);
    fd.append("year", year);
    fd.append("month", month);
    fd.append("date", date);
    fd.append("checkbox", checkBox);
    for (let i = 0; i < previewArr.length; i++) {
      fd.append('photo[]', previewArr[i]);
    }
    $.ajax({
      type: 'POST',
      url: action,
      contentType: false,
      processData: false,
      data: fd,
      success: function(data) {
        console.log('Updation was successful.');
        model.style.display="none";
        window.location.reload();
      },
      error: function(data) {
        console.log('An error occurred.');
      }
    });
  });
});
$('.checkBox').on('click', () => {
  if(this.checked) this.checked=false;
  else this.checked=true;
});
$(".clear").on('click', () =>{
  emptyTheForm();
});
$('.close').on('click', () =>{
  model.style.display="none";
  emptyTheForm();
});
window.onclick = function(event) {
  if(event.target == model){
    model.style.display="none";
  }
}
window.addEventListener( "pageshow", function ( event ) {
  event.preventDefault();
  const historyTraversal = event.persisted || ( typeof window.performance != "undefined" && window.performance.navigation.type === 2 );
  if ( historyTraversal ) {
    // Handle page restore.
    window.location.reload();
  }
});