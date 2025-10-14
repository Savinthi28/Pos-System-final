$(document).ready(() => {
  $("#home-page").show();
  //   $("#home-page").show()

  $(".nav-link, .navbar-brand").click(function (e) {
    e.preventDefault();

    $(".nav-link").removeClass("active");
    $(this).addClass("active");

    $(".page").hide();

    const target = $(this).data("target");

    // $("#" + target).show()
    $(`#${target}`).fadeIn(1000);
  });
});
