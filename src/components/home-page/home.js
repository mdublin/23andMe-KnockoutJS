define(["knockout", "jquery", "text!./home.html"], function(ko, jquery, homeTemplate) {

  var $ = jquery;

  function HomeViewModel(route) {
    var self = this;

    $(document).ready(function(e){

      testCall2();

      function testCall2() {
        console.log("testCall2() called");

        var xhr = new XMLHttpRequest();
        var url = "[your API base url]/testjwt/"
        xhr.open("GET",  url, true);
        // making credentialed request with httponly cookie to test if client is currently authorized
        xhr.withCredentials = true;
        xhr.send();

        xhr.onreadystatechange = serverAlerts;

        function serverAlerts() {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200){
                    document.getElementById("parentDiv").classList.remove("initial-hide");
                }
                if (xhr.status != 200) {
                    response = JSON.parse(xhr.response);
                    if (response["authorization_error"]) {
                        console.log(xhr.responseText);
                        location = "[your frontend base url]/#login";
                    } else {
                        console.log(xhr.responseText);
                    }
                } else {
                    console.log(xhr.responseText);
                }
            }
        }
      }; //end of ajax function
    });


    this.message = ko.observable('Welcome to 23andMeAPIProject!');
  }

  HomeViewModel.prototype.doSomething = function() {
    this.message('You invoked doSomething() on the viewmodel.');
  };

  return { viewModel: HomeViewModel, template: homeTemplate };

});
