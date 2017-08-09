$(document).ready(function(){
    $('ul>li').on("mouseenter",function(){
        $(this).css('background-color','grey');
    });

    $('ul>li').on("mouseleave",function(){
        $(this).css('background-color','transparent');
    });
})