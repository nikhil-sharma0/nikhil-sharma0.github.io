/*!
    This is the JavaScript file is associated with index.html

    Description: This file contains all the scripts associated with the web page.
    portfolio website.
*/

(function ($) {

    // Remove no-js class
    $('html').removeClass('no-js');

    // Animate to section when nav is clicked
    $('header a').click(function (e) {

        // Treat as normal link if no-scroll class
        if ($(this).hasClass('no-scroll')) return;

        var heading = $(this).attr('href');
        var scrollDistance = $(heading).offset().top;

        $('html, body').animate({
            scrollTop: scrollDistance + 'px'
        }, Math.abs(window.pageYOffset - $(heading).offset().top) / 1);

        // Hide the menu once clicked if mobile
        if ($('header').hasClass('active')) {
            $('header, body').removeClass('active');
        }
    });

    // Scroll to top
    $('#to-top').click(function () {
        $('html, body').animate({
            scrollTop: 0
        }, 500);
    });

    // Scroll to first element
    $('#lead-down span').click(function () {
        var scrollDistance = $('#lead').next().offset().top;
        $('html, body').animate({
            scrollTop: scrollDistance + 'px'
        }, 500);
    });

    // Open mobile menu
    $('#mobile-menu-open').click(function () {
        $('header, body').addClass('active');
    });

    // Close mobile menu
    $('#mobile-menu-close').click(function () {
        $('header, body').removeClass('active');
    });

    // Load additional projects
    $('#view-more-projects').click(function (e) {
        e.preventDefault();
        $(this).fadeOut(300, function () {
            $('#more-projects').fadeIn(300);
        });
    });

})(jQuery);

getJSONObject = function () {
    return JSON.parse(localStorage.getItem('imagesLocalStorage'));
}
var localStorageJSON = getJSONObject();
console.log(localStorageJSON);
if (localStorageJSON == null) {
    $.getJSON("galleryImages.json", function (data) {
        galleryObject = data;
        galleryObject.images.forEach(function (obj) {
            addNewImage(obj.imageUrl);
        });
    });
} else {
    galleryObject = localStorageJSON;   //updating from DOM to Gallery in index.html
    galleryObject.images.forEach(function (obj) {
        addNewImage(obj.imageUrl);
    });
}
var galleryObject, output;

function addNewImage(imageUrl) {    //adding image to "galleryContainer"
    var containerDiv = document.getElementById("galleryContainer");
    var galleryImage = document.createElement("img");
    galleryImage.setAttribute("src", imageUrl);
    galleryImage.setAttribute("class", "image-gallery");
    containerDiv.appendChild(galleryImage);
}