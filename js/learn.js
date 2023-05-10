$(function () {
    $("ul.learn-options li.learn-options-opt").click(function () {
        $("ul.learn-options li.learn-options-opt").toggleClass("active");
        $("div.dict-content").toggleClass("inactivee");
        $("div.quiz-content").toggleClass("inactivee");
    });
});
$(function () {
    $("ul.language-options li.language-options-opt").click(function () {
        $("ul.language-options li.language-options-opt").toggleClass("active");
        $("div.asl-content").toggleClass("inactivee");
        $("div.braille-content").toggleClass("inactivee");
    });
});

