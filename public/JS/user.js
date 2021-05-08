var close = document.querySelectorAll(".close");
var model = document.querySelectorAll(".bg-model");
var edit = document.querySelectorAll(".editMemory");
var id = document.querySelectorAll(".card-id");
var title = document.querySelectorAll(".card-title");
var message = document.querySelectorAll(".card-message");
var tag = document.querySelectorAll(".card-tag");
var year = document.querySelectorAll(".card-year");
var month = document.querySelectorAll(".card-month");
var date = document.querySelectorAll(".card-date");
var locate = document.querySelectorAll(".card-location");
var checkbox = document.querySelectorAll(".card-slider");
var cancel = document.querySelectorAll(".cancel");
var clear = document.querySelectorAll(".clear");
var dropZone = document.querySelectorAll(".drop-zone");
var cloud = document.querySelectorAll(".fa-cloud-upload-alt");
var previewArr = [];
$(document).ready(function() {
  $('.drop-zone').on('dragover', function() {
    dropZone[0].style.borderColor = "#ea4c89";
    cloud[0].style.color = "#ea4c89";
    dropZone[1].style.borderColor = "#ea4c89";
    cloud[1].style.color = "#ea4c89";
    return false;
  });
  $('.drop-zone').on('dragleave', function() {
    dropZone[0].style.borderColor = "#d9d9d9";
    cloud[0].style.color = "#d7d7da";
    dropZone[1].style.borderColor = "#d9d9d9";
    cloud[1].style.color = "#d7d7da";
    return false;
  });
  $('.drop-zone').on('drop', function(e) {
    e.preventDefault();
    var image_list = e.originalEvent.dataTransfer.files;
    for (var i = 0; i < image_list.length && i < 6; i++) {
      previewArr.push(image_list[i]);
    }
    $("#frames").html('');
    for (var i = 0; i < previewArr.length && i < 6; i++) {
      if (i === 0) {
        $(".drop-zone").append(`<div id="photo"><img src="${window.URL.createObjectURL(previewArr[0])}" /></div>`);
        $("#frames").append(`<li id="image${i}" data-target="#carouselExampleIndicators" data-slide-to="0" class="active">
        <div style="position: relative;"><img src="${window.URL.createObjectURL(previewArr[i])}" class="drop-area-thumbnail" style="opacity: 1;"/><div class="previewClose">+</div></div></li>`);
      } else {
        $("#frames").append(`<li id="image${i}" data-target="#carouselExampleIndicators" data-slide-to="${i}"><div style="position: relative"><img src="${window.URL.createObjectURL(previewArr[i])}" class="drop-area-thumbnail" style="opacity: 1;" />
        <div class="previewClose">+</div></div></li>`);
      }
    }
    if (previewArr.length < 6) {
      $("#frames").append(`<li><label for="drop-zone__input" class="custom-file"><div class="drop-area-thumbnail preview">+</div></label><input type="file" id="drop-zone__input" class="drop-zone__input" name="photo[]" /></li>`)
    }
    var previewClose = document.querySelectorAll(".previewClose");
    for (var i = 0; i < previewClose.length; i++) {
      previewClose[i].addEventListener("click", ((j) => {
        return function() {
          previewArr.splice(j, 1);
          $("#image" + j).remove();
          if (previewArr.length === 5) {
            $("#frames").append(`<li><label for="drop-zone__input" class="custom-file"><div class="drop-area-thumbnail preview">+</div></label><input type="file" id="drop-zone__input" class="drop-zone__input" name="photo[]" /></li>`)
          }
        }
      })(i))
    }
  });
  $('#drop-zone__input').change(function() {
    for (var i = 0; i < $(this)[0].files.length && i < 6; i++)
      previewArr.push(this.files[i]);
    $("#frames").html('');
    for (var i = 0; i < previewArr.length; i++) {
      if (i === 0) {
        $(".drop-zone").append(`<div id="photo"><img src="${window.URL.createObjectURL(previewArr[0])}" /></div>`);
        $("#frames").append(`<li id="image${i}" data-target="#carouselExampleIndicators" data-slide-to="0" class="active">
        <div style="position: relative;"><img src="${window.URL.createObjectURL(previewArr[i])}" class="drop-area-thumbnail" style="opacity: 1;"/><div class="previewClose">+</div></div></li>`);
      } else {
        $("#frames").append(`<li id="image${i}" data-target="#carouselExampleIndicators" data-slide-to="${i}"><div style="position: relative"><img src="${window.URL.createObjectURL(previewArr[i])}" class="drop-area-thumbnail" style="opacity: 1;" />
        <div class="previewClose">+</div></div></li>`);
      }
    }
    if (previewArr.length < 6) {
      $("#frames").append(`<li><label for="drop-zone__input" class="custom-file"><div class="drop-area-thumbnail preview">+</div></label><input type="file" id="drop-zone__input" class="drop-zone__input" name="photo[]" /></li>`)
    }
    var previewClose = document.querySelectorAll(".previewClose");
    for (var i = 0; i < previewClose.length; i++) {
      previewClose[i].addEventListener("click", ((j) => {
        return function() {
          previewArr.splice(j, 1);
          $("#image" + j).remove();
          if (previewArr.length === 5) {
            $("#frames").append(`<li><label for="drop-zone__input" class="custom-file"><div class="drop-area-thumbnail preview">+</div></label><input type="file" id="drop-zone__input" class="drop-zone__input" name="photo[]" /></li>`)
          }
        }
      })(i))
    }
  });
});
dropZone[0].addEventListener("mouseover", () => {
  dropZone[0].style.borderColor = "#ea4c89";
  cloud[0].style.color = "#ea4c89";
});
dropZone[0].addEventListener("mouseout", () => {
  dropZone[0].style.borderColor = "#d9d9d9";
  cloud[0].style.color = "#d7d7da";
});
dropZone[1].addEventListener("mouseover", () => {
  dropZone[1].style.borderColor = "#ea4c89";
  cloud[1].style.color = "#ea4c89";
});
dropZone[1].addEventListener("mouseout", () => {
  dropZone[1].style.borderColor = "#d9d9d9";
  cloud[1].style.color = "#d7d7da";
});
$(document).ready(function() {
  $("#memoryForm").submit(function(e) {
    e.preventDefault();
    var fd = new FormData();
    var title1 = document.querySelector(".title1").value;
    var tag1 = document.querySelector(".tag1").value;
    var message1 = document.querySelector(".message1").value;
    var year1 = document.querySelector(".year1").value;
    var month1 = document.querySelector(".month1").value;
    var date1 = document.querySelector(".date1").value;
    var location1 = document.querySelector(".location1").value;
    var checkBox1 = document.querySelector(".checkBox1").value;
    fd.append("title", title1);
    fd.append("tags", tag1);
    fd.append("message", message1);
    fd.append("location", location1);
    fd.append("year", year1);
    fd.append("month", month1);
    fd.append("date", date1);
    fd.append("checkbox", checkBox1);
    for (var i = 0; i < previewArr.length; i++) {
      fd.append('photo[]', previewArr[i]);
    }
    $.ajax({
      type: 'POST',
      url: '/memories/create',
      contentType: false,
      processData: false,
      data: fd,
      success: function(data) {
        console.log('Submission was successful.');
        model[0].style.display="none";
        window.location.reload();
      },
      error: function(data) {
        console.log('An error occurred.');
      }
    });
  });
});
window.addEventListener( "pageshow", function ( event ) {
  event.preventDefault();
  var historyTraversal = event.persisted || ( typeof window.performance != "undefined" && window.performance.navigation.type === 2 );
  if ( historyTraversal ) {
    // Handle page restore.
    window.location.reload();
  }
});
document.querySelector(".primary-btn").addEventListener("click", function() {
  model[0].style.display = "flex";
});
document.getElementById("addMemory").addEventListener("click", function() {
  model[0].style.display = "flex";
});
$("#topUp").on("click", function() {
  $(window).scrollTop(0);
});
for (var i = 0; i < clear.length; i++) {
  clear[i].addEventListener("click", ((j) => {
    return function() {
      document.querySelector(".title1").value = "";
      document.querySelector(".tag1").value = "";
      document.querySelector(".message1").value = "";
      document.querySelector(".year1").value = "";
      document.querySelector(".month1").value = "";
      document.querySelector(".date1").value = "";
      document.querySelector(".location1").value = "";
      document.querySelector(".checkBox1").checked = true;
    }
  })(i))
}
for (var i = 0; i < cancel.length; i++) {
  cancel[i].addEventListener("click", ((j) => {
    return function() {
      document.querySelector(".title").value = "";
      document.querySelector(".tag").value = "";
      document.querySelector(".message").value = "";
      document.querySelector(".year").value = "";
      document.querySelector(".month").value = "";
      document.querySelector(".date").value = "";
      document.querySelector(".location").value = "";
      document.querySelector(".checkBox").checked = true;
    }
  })(i))
}
for (var i = 0; i < edit.length; i++) {
  edit[i].addEventListener("click", ((j) => {
    return function() {
      model[1].style.display = "flex";
      var stringTag = "";
      for (var k = 0; k < tag[j].innerHTML.length; k++) {
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
      if (checkbox[j].innerHTML === "on") {
        document.querySelector(".checkBox").checked = true;
      } else {
        document.querySelector(".checkBox").checked = false;
      }
    }
  })(i))
}
for (var i = 0; i < close.length; i++) {
  close[i].addEventListener("click", function() {
    for (var j = 0; j < model.length; j++) {
      model[j].style.display = "none";
    }
  });
}
window.onclick = function(event) {
  for (var i = 0; i < model.length; i++) {
    if (event.target == model[i]) {
      model[i].style.display = "none";
    }
  }
}
