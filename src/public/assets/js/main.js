// PRELOADER
$(window).ready(function () {
    setInterval(function () {
        $('body').addClass("animated")
    });

});

new WOW().init();
wow = new WOW({
    boxClass: 'wow', // default
    animateClass: 'animated', // default
    animateClass: 'animH', // default
    offset: 0, // default
    mobile: true, // default
    live: true // default
})
wow.init();


// All Sliader
$(document).ready(function () {
    "use strict";

    var mydir = $("html").attr("dir");

    if (mydir == 'rtl') {
        var isRTL = true
    }
    else {
        var isRTL = false
    }

    var mydirX = $("html").attr("dir");

    if (mydirX == 'rtl') {
        var isRTLX = false
    }
    else {
        var isRTLX = true
    }

    // Home Slider
    $('.home-slider').slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: true,
        infinite: false,
        autoplay: true,
        speed: 500,
        dots: true,
        rtl: isRTL,
    });

    // Services-slider    
    $('.services-slider').slick({
        slidesToShow: 3,
        slidesToScroll: 1,
        arrows: true,
        infinite: true,
        dots: true,
        focusOnSelect: true,
        rtl: isRTL,
        responsive: [
            {
                breakpoint: 992,
                settings: {
                    slidesToShow: 3,
                }
            },
            {
                breakpoint: 767,
                settings: {
                    slidesToShow: 2,
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                }
            },
        ]
    });

    // Clients-slider    
    $('.clients-slider').slick({
        slidesToShow: 8,
        slidesToScroll: 1,
        infinite: true,
        dots: false,
        arrows: true,
        centerMode: true,
        focusOnSelect: true,
        rtl: isRTL,
        responsive: [
            {
                breakpoint: 992,
                settings: {
                    slidesToShow: 4,
                    dots: true,
                    arrows: false,
                }
            },
            {
                breakpoint: 767,
                settings: {
                    slidesToShow: 3,
                    dots: true,
                    arrows: false,
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 2,
                    dots: true,
                    arrows: false,
                }
            },
        ]
    });

    // Single Project
    $('.slider-single-for').slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        fade: false,
        rtl: isRTL,
        infinite: false,
        asNavFor: '.slider-single-nav'
    });
    $('.slider-single-nav').slick({
        slidesToShow: 4,
        slidesToScroll: 1,
        arrows: false,
        infinite: false,
        asNavFor: '.slider-single-for',
        dots: false,
        focusOnSelect: true,
        rtl: isRTL,
        responsive: [{
            breakpoint: 992,
            settings: {
                slidesToShow: 4,
            }
        },
        {
            breakpoint: 767,
            settings: {
                slidesToShow: 3,
            }
        },
        {
            breakpoint: 480,
            settings: {
                slidesToShow: 3,
            }
        },
        ]
    });


    // Single Artical
    $('.slider-artical-for').slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        fade: false,
        rtl: isRTL,
        infinite: false,
        asNavFor: '.slider-artical-nav'
    });
    $('.slider-artical-nav').slick({
        slidesToShow: 9,
        slidesToScroll: 1,
        arrows: false,
        infinite: false,
        asNavFor: '.slider-artical-for',
        dots: false,
        focusOnSelect: true,
        rtl: isRTL,
        responsive: [{
            breakpoint: 992,
            settings: {
                slidesToShow: 9,
            }
        },
        {
            breakpoint: 767,
            settings: {
                slidesToShow: 6,
            }
        },
        {
            breakpoint: 480,
            settings: {
                slidesToShow: 3,
            }
        },
        ]
    });

    //Nav
    $(window).on("scroll", function () {
        if ($(window).scrollTop() > 50) {
            $(".sticky").addClass("active");
        } else {
            $(".sticky").removeClass("active");
        }
    });

    //Header Search
    if ($('#search-trigger-desktop').length) {
        $('#search-trigger-desktop').on('click', function () {
            $('.header-site-search').addClass('search-open');
        });
        $('#search-close').on('click', function () {
            $('.header-site-search').removeClass('search-open');
        });
    }


    // Mobile Menu
    if ($('.mobile-menu').length) {

        $('.mobile-menu .menu-box');

        var mobileMenuContent = $('.main-header .nav-outer .main-menu').html();
        $('.mobile-menu .menu-box .menu-outer').append(mobileMenuContent);
        $('.sticky-header .main-menu').append(mobileMenuContent);

        //Menu Toggle Btn
        $('.mobile-nav-toggler').on('click', function () {
            $('body').addClass('mobile-menu-visible');
        });

        //Menu Toggle Btn
        $('.mobile-menu .menu-backdrop,.mobile-menu .close-btn, .btn-mobile .btn').on('click', function () {
            $('body').removeClass('mobile-menu-visible');
        });
        $('.mobile-menu .menu-backdrop,.mobile-menu .close-btn').on('click', function () {
            $('body').removeClass('mobile-menu-visible');
        });

    }

    $(".mobile-menu .sub-menu").hide();
    $(".mobile-menu .menu-item-has-children > a").click(function (e) {
        // Close all open windows
        $(".sub-menu").stop().slideUp(300);
        // Toggle this window open/close
        $(this).next(".sub-menu").stop().animate({
            height: "toggle"
        });
        e.stopPropagation();
        e.preventDefault();
    });

    $(".title-filter").click(function (e) {
        // Close all open windows
        $(".sub-menu").stop().slideUp(300);
        // Toggle this window open/close
        $(this).next(".sub-menu").stop().animate({
            height: "toggle"
        });
        e.stopPropagation();
        e.preventDefault();
    });

    $(".sub-lang, .sub-currency").hide();
    $(".lang-menu").click(function (e) {
        $(".sub-lang").stop().slideUp(300);
        $(this).next(".sub-lang").stop().animate({
            height: "toggle"
        });
        e.stopPropagation();
        e.preventDefault();
    });

    $(".currency-menu").click(function (e) {
        $(".sub-currency").stop().slideUp(300);
        $(this).next(".sub-currency").stop().animate({
            height: "toggle"
        });
        e.stopPropagation();
        e.preventDefault();
    });


    //Header Search
    if ($('.search-box-outer').length) {
        $('.search-box-outer').on('click', function () {
            $('body').addClass('search-active');
        });
        $('.close-search').on('click', function () {
            $('body').removeClass('search-active');
        });
    }


    // FancyBox
    $('[data-fancybox="galleryPhoto"], [data-fancybox="galleryVideo"], [data-fancybox], [data-fancybox="galleryCircul"]').fancybox();

    //Odometer
    $(".counter-item").each(function () {
        $(this).isInViewport(function (status) {
            if (status === "entered") {
                for (var i = 0; i < document.querySelectorAll(".odometer").length; i++) {
                    var el = document.querySelectorAll('.odometer')[i];
                    el.innerHTML = el.getAttribute("data-odometer-final");
                }
            }
        });
    });

    // niceSelect
    $('select.niceSelect').niceSelect();

    // Datepicker
    $(".datepicker").datepicker({
        minDate: 0 
    });
    $(function () {
        var dateFormat = "mm/dd/yy",
            fromDate,
            toDate,
            selectingFrom = true;

        function getDates(startDate, endDate) {
            var dates = [],
                currentDate = startDate,
                addDays = function (days) {
                    var date = new Date(this.valueOf());
                    date.setDate(date.getDate() + days);
                    return date;
                };
            while (currentDate <= endDate) {
                dates.push(currentDate);
                currentDate = addDays.call(currentDate, 1);
            }
            return dates;
        }

        function highlightDates(date) {
            if (fromDate && toDate) {
                var dateRange = getDates(fromDate, toDate);
                for (var i = 0; i < dateRange.length; i++) {
                    if (date.getTime() === dateRange[i].getTime()) {
                        return [true, "ui-state-highlight"];
                    }
                }
            }
            return [true, ""];
        }

        function formatDate(date) {
            var d = new Date(date),
                month = '' + (d.getMonth() + 1),
                day = '' + d.getDate(),
                year = d.getFullYear();

            if (month.length < 2) month = '0' + month;
            if (day.length < 2) day = '0' + day;

            return [month, day, year].join('/');
        }

        $("#datepicker").datepicker({
            numberOfMonths: 2,
            onSelect: function (dateText, inst) {
                var date = $(this).datepicker("getDate");

                if (selectingFrom) {
                    fromDate = date;
                    toDate = null;
                    $(this).val(formatDate(fromDate) + " - ");
                    selectingFrom = false;
                    $("#saveDateRange").prop("disabled", true);
                    setTimeout(function () {
                        $("#datepicker").datepicker("show");
                    }, 10);
                } else {
                    toDate = date;
                    if (fromDate > toDate) {
                        var temp = fromDate;
                        fromDate = toDate;
                        toDate = temp;
                    }
                    $(this).val(formatDate(fromDate) + " - " + formatDate(toDate));
                    selectingFrom = true;
                    $("#saveDateRange").prop("disabled", false);
                }

                $(this).datepicker("refresh");
            },
            beforeShowDay: highlightDates
        }).on("click", function () {
            if (!fromDate || toDate) {
                selectingFrom = true;
                fromDate = toDate = null;
                $(this).val("");
                $(this).datepicker("refresh");
            }
        });
    });

    $('.file-upload').on('change', function (event) {
        var name = event.target.files[0].name;
        $('.file-name').text(name);
    })

});

// Scroll Up
$(window).scroll(function () {
    if ($(this).scrollTop() > 500) {
        $(".upPage").addClass("active");
    } else {
        $(".upPage").removeClass("active");
    }
});


document.addEventListener("DOMContentLoaded", function () {
    const oneWay = document.getElementById("oneWay");
    const roundTrip = document.getElementById("roundTrip");
    const returnDate = document.getElementById("to");

    // Event listener for radio buttons
    oneWay.addEventListener("change", function () {
        if (oneWay.checked) {
            returnDate.disabled = true;
        }
    });

    roundTrip.addEventListener("change", function () {
        if (roundTrip.checked) {
            returnDate.disabled = false;
        }
    });
});

// var buttonPlus = $(".qty-btn-plus");
// var buttonMinus = $(".qty-btn-minus");

// var incrementPlus = buttonPlus.click(function () {
//     var $n = $(this)
//         .parent(".qty-container")
//         .find(".input-qty");
//     $n.val(Number($n.val()) + 1);
// });

// var incrementMinus = buttonMinus.click(function () {
//     var $n = $(this)
//         .parent(".qty-container")
//         .find(".input-qty");
//     var amount = Number($n.val());
//     if (amount > 1) {
//         $n.val(amount - 1);
//     }
// });


document.getElementById('btn-one').addEventListener('click', function() {
    document.getElementById('stepone').style.display = 'none';
    document.getElementById('steptwo').style.display = 'block';
});


document.getElementById('btn-two').addEventListener('click', function() {
    document.getElementById('steptwo').style.display = 'none';
    document.getElementById('stepthree').style.display = 'block';
});

$(document).ready(function() {
    $("input.action").change(function() {
        var test = $(this).val();
        $(".show-hide").hide();
        $("#" + test).show();
        checkForm(); 
    });

    $(".form-control").on("input", function() {
        checkForm();
    });

    function checkForm() {
        var isFormValid = true;
        var visibleSection = $(".show-hide:visible");

        visibleSection.find(".form-control").each(function() {
            if ($(this).val().trim() === "") {
                isFormValid = false;
                return false; 
            }
        });

        $(".btn").prop("disabled", !isFormValid);
    }
});


// Price-h
document.addEventListener('DOMContentLoaded', () => {
    const selectedQty = parseInt(localStorage.getItem('selectedQty')) || 1;
    const checkboxesGroup1 = document.querySelectorAll('.chair-h input[type="checkbox"][name="radio"]');
    const checkboxesGroup2 = document.querySelectorAll('.chair-h input[type="checkbox"][name="radio2"]');
    const totalPriceElement = document.getElementById('totalPrice');

    let selectedChairs = [];

    function updateTotalPrice() {
        let totalPrice = 0;

        // حساب السعر بناءً على جميع العناصر المحددة
        document.querySelectorAll('.chair-h input[type="checkbox"]:checked').forEach(input => {
            totalPrice += parseFloat(input.getAttribute('data-price'));
        });

        totalPriceElement.textContent = `${totalPrice.toFixed(2)} EGP`;
    }

    function handleSelection(event) {
        const checkbox = event.target;

        if (checkbox.checked) {
            selectedChairs.push(checkbox);
        } else {
            selectedChairs = selectedChairs.filter(item => item !== checkbox);
        }

        // إذا تجاوز العدد المطلوب، يتم إلغاء تحديد الأقدم
        if (selectedChairs.length > selectedQty) {
            const removedChair = selectedChairs.shift();
            removedChair.checked = false;
        }

        updateTotalPrice();
    }

    // تطبيق الـ Event Listener على جميع الكراسي في المجموعتين
    [...checkboxesGroup1, ...checkboxesGroup2].forEach(input => {
        input.addEventListener('change', handleSelection);
    });

    // تحديث السعر عند تحميل الصفحة
    updateTotalPrice();
});
document.addEventListener('DOMContentLoaded', () => {
    const selectedQty = parseInt(localStorage.getItem('selectedQty')) || 1;

    // تحديد عناصر المجموعة الأولى
    const checkboxesGroup1 = document.querySelectorAll('.booking-bus-1 .chair-h input[type="checkbox"]');
    const totalPriceElementGroup1 = document.getElementById('totalPriceGroup1');
    let selectedChairsGroup1 = [];

    // تحديد عناصر المجموعة الثانية
    const checkboxesGroup2 = document.querySelectorAll('.booking-bus-2 .chair-h input[type="checkbox"]');
    const totalPriceElementGroup2 = document.getElementById('totalPriceGroup2');
    let selectedChairsGroup2 = [];

    // العنصر الذي سيتم عرض السعر الإجمالي فيه
    const totalPathElement = document.getElementById('totalPath');

    // دالة لتحديث السعر الإجمالي لكل مجموعة
    function updateTotalPrice(selectedChairs, totalPriceElement) {
        let totalPrice = 0;

        // حساب السعر بناءً على العناصر المحددة في المجموعة
        selectedChairs.forEach(checkbox => {
            totalPrice += parseFloat(checkbox.getAttribute('data-price'));
        });

        totalPriceElement.textContent = `${totalPrice.toFixed(2)} EGP`;
        updateTotalPath(); // تحديث السعر الإجمالي للمجموعتين
    }

    // دالة لتحديث السعر الإجمالي للمجموعتين
    function updateTotalPath() {
        const totalPriceGroup1 = parseFloat(totalPriceElementGroup1.textContent) || 0;
        const totalPriceGroup2 = parseFloat(totalPriceElementGroup2.textContent) || 0;
        const totalPrice = totalPriceGroup1 + totalPriceGroup2;

        totalPathElement.textContent = `${totalPrice.toFixed(2)} EGP`;
    }

    // دالة لإدارة التحديد في كل مجموعة
    function handleSelection(event, selectedChairs, totalPriceElement) {
        const checkbox = event.target;
        const chairElement = checkbox.closest('.chair-h'); // الحصول على العنصر الأب (chair-h)

        if (checkbox.checked) {
            selectedChairs.push(checkbox);
            chairElement.classList.add('selected'); // إضافة الكلاس "selected"
        } else {
            const index = selectedChairs.indexOf(checkbox);
            if (index !== -1) {
                selectedChairs.splice(index, 1); // إزالة العنصر من المصفوفة
                chairElement.classList.remove('selected'); // إزالة الكلاس "selected"
            }
        }

        // إذا تجاوز العدد المطلوب، يتم إلغاء تحديد الأقدم
        if (selectedChairs.length > selectedQty) {
            const removedChair = selectedChairs.shift();
            removedChair.checked = false;
            removedChair.closest('.chair-h').classList.remove('selected'); // إزالة الكلاس "selected"
        }

        updateTotalPrice(selectedChairs, totalPriceElement); // تحديث السعر الإجمالي للمجموعة
    }

    // تطبيق الـ Event Listener على جميع الكراسي في المجموعة الأولى
    checkboxesGroup1.forEach(input => {
        input.addEventListener('change', (event) => handleSelection(event, selectedChairsGroup1, totalPriceElementGroup1));
    });

    // تطبيق الـ Event Listener على جميع الكراسي في المجموعة الثانية
    checkboxesGroup2.forEach(input => {
        input.addEventListener('change', (event) => handleSelection(event, selectedChairsGroup2, totalPriceElementGroup2));
    });

    // تحديث السعر عند تحميل الصفحة
    updateTotalPrice(selectedChairsGroup1, totalPriceElementGroup1);
    updateTotalPrice(selectedChairsGroup2, totalPriceElementGroup2);
});