/*!
    This is the JavaScript file is associated with gallery-admin.html
     
    Description: This file contains all the scripts associated with the web page.
    portfolio website.
 */

(function ($) {

    // Open mobile menu
    $('#mobile-menu-open').click(function () {
        $('header, body').addClass('active');
    });

    // Close mobile menu
    $('#mobile-menu-close').click(function () {
        $('header, body').removeClass('active');
    });

})(jQuery);
var selectedImageId = null;

contextMenuHidden = function () {   //hide edit-images menu
    document.getElementById("contextMenu").style.display = "";
    document.getElementById("contextMenu").style.left = "";
    document.getElementById("contextMenu").style.top = "";
}

document.getElementById('editImageMenu').onclick = function () {
    document.getElementById('popupHead').innerHTML = "Edit";
    document.getElementById('popModal').style.display = "block";    
    document.getElementById("contextMenu").style.display = "";
    document.getElementById("contextMenu").style.left = "";
    document.getElementById("contextMenu").style.top = "";
    galleryObject.images.forEach(function (obj) {
        if (obj.id == selectedImageId) {
            document.getElementById('imageURLId').value = obj.imageUrl;
            document.getElementById('imageNameId').value = obj.imageName;
            document.getElementById('imageInfoId').value = obj.imageInformation;
            document.getElementById('imageUpdateDateId').value = obj.updateDate;
        }
    });
};

document.getElementById('deleteImageMenu').onclick = function () {
    var index = 0;
    contextMenuHidden();
    galleryObject.images.forEach(function (obj) {
        if (obj.id == selectedImageId) {
            galleryObject.images.splice(index, 1);
            storeJSONObject(galleryObject);
            renderImages();
            return;
        }
        index++;
    });
};

clearImageInputFields = function () {   
    document.getElementById('imageNameId').value = "";
    document.getElementById('imageURLId').value = "";
    document.getElementById('imageInfoId').value = "";
    document.getElementById('imageUpdateDateId').value = getCurrentDate_YYYYMMDD();
}
var popUpBoxFor = "";

function toggleAddModal() {
    var check = document.getElementById("popModal");
    document.getElementById('popupHead').innerHTML = "Add Image";
    clearImageInputFields();
    check.style.display = "block";
}

function toggleEditModal() {
    var check = document.getElementById("popModal");
}
getJSONObject = function () {
    return JSON.parse(localStorage.getItem('imagesLocalStorage'));
}
storeJSONObject = function (data) {
    localStorage.setItem('imagesLocalStorage', JSON.stringify(data));
}
function renderImages() {
    document.getElementById("galleryContainer").innerHTML = "";
    galleryObject = getJSONObject();
    console.log(galleryObject);
    galleryObject.images.forEach(function (obj) {
        addNewImage(obj.id, obj.imageUrl);
    });
}
document.getElementById('galleryContainer').onclick = function () {
    contextMenuHidden();
};

document.getElementById('galleryContainer').addEventListener('contextmenu', function (event) {
    if (event.target.tagName === 'IMG') {
        event.preventDefault();
        selectedImageId = event.target.id;
        document.getElementById("contextMenu").style.display = "block";
        document.getElementById("contextMenu").style.left = (event.pageX - 10) + "px";
        document.getElementById("contextMenu").style.top = (event.pageY - 10) + "px";
    }
}, false);
window.onclick = function (event) {
    if (event.target == document.getElementById('popModal')) {
        document.getElementById('popModal').style.display = "";
    }
    contextMenuHidden();
}

document.getElementsByClassName("popup-close")[0].onclick = function () {
    document.getElementById('popModal').style.display = "";
    clearValidationPromptField();
}
getCurrentDate_YYYYMMDD = function () {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1;
    var yyyy = today.getFullYear();
    if (dd < 10) {
        dd = '0' + dd;
    }
    if (mm < 10) {
        mm = '0' + mm;
    }
    return yyyy + '-' + mm + '-' + dd;
}
isDateValid = function () {
    var formDate = new Date(document.getElementById('imageUpdateDateId').value);
    var todayDate = new Date();
    if (formDate.getFullYear() < todayDate.getFullYear()) {
        return true;
    } else if (formDate.getMonth() < todayDate.getMonth()) {
        return true;
    } else if (formDate.getDate() <= todayDate.getDate()) {
        return true;
    } else {
        return false;
    }
}
clearValidationPromptField = function () {
    document.getElementById('invalidUrl').style.display = 'none';
    document.getElementById('nameCannotBeEmpty').style.display = 'none';
    document.getElementById('invalidDate').style.display = 'none';
}
getNewImageId = function () {
    var maxId = 0;
    galleryObject.images.forEach(function (obj) {
        if (maxId < parseInt(obj.id))
            maxId = parseInt(obj.id);
    });
    return maxId + 1;
}
validateImageInputFields = function () {
    clearValidationPromptField();
    var urlPattern = /^((http[s]?|ftp):\/)?\/?([^:\/\s]+)((\/\w+)*\/)([\w\-\.]+[^#?\s]+)(.*)?(#[\w\-]+)?$/;

    if (document.getElementById('imageNameId').value.trim() == '') {
        document.getElementById('nameCannotBeEmpty').style.display = 'block';
        return false;
    } else if (!urlPattern.test(document.getElementById('imageURLId').value)) {
        document.getElementById('invalidUrl').style.display = 'block';
        return false;
    } else if (!isDateValid()) {
        document.getElementById('invalidDate').style.display = 'block';
        return false;
    }

    if (document.getElementById('popupHead').innerHTML == "Edit") {
        galleryObject.images.forEach(function (obj) {
            if (obj.id == selectedImageId) {
                obj.imageUrl = document.getElementById('imageURLId').value;
                obj.imageName = document.getElementById('imageNameId').value;
                obj.imageInformation = document.getElementById('imageInfoId').value;
                obj.updateDate = document.getElementById('imageUpdateDateId').value;
            }
        });
    } else if (document.getElementById('popupHead').innerHTML == "Add Image") {
        var newImageId = getNewImageId() + "";
        var newImageUrl = document.getElementById('imageURLId').value;
        var newImageName = document.getElementById('imageNameId').value;
        var newImageInfo = document.getElementById('imageInfoId').value;
        var newImageUploadDate = document.getElementById('imageUpdateDateId').value;

        galleryObject.images.push({
            "id": newImageId,
            "imageUrl": newImageUrl,
            "imageInformation": newImageInfo,
            "imageName": newImageName,
            "updateDate": newImageUploadDate
        }); 
    }
    storeJSONObject(galleryObject);
        renderImages();
        document.getElementById('popModal').style.display = "none";
    clearValidationPromptField();
    return true;
}
var galleryObject, output;

$.getJSON("galleryImages.json", function (data) {
    if (getJSONObject() == null) {
        storeJSONObject(data);
    } else {
        galleryObject = getJSONObject();
    }
    renderImages();
});

function addNewImage(imageId, imageUrl) {
    var containerDiv = document.getElementById("galleryContainer");
    var galleryImage = document.createElement("img");
    galleryImage.setAttribute("src", imageUrl);
    galleryImage.setAttribute("id",imageId);
    galleryImage.setAttribute("class", "image-gallery");
    containerDiv.appendChild(galleryImage);
}

function popupSubmit() {
    validateImageInputFields();
}