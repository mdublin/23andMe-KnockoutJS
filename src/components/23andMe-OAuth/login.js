define(["knockout", "jquery", "text!./login.html"], function(ko, jquery, loginTemplate){

    // assiging jquery import
    var $ = jquery;

    function loginViewModel(route) {

        $(document).ready(function(){
            $('#APIauth').click(function(event){
                window.location.href = "[your API base url]/23ndMeLoginRedirect";
            });
        });
    }

    return { viewModel: loginViewModel, template: loginTemplate};

});
