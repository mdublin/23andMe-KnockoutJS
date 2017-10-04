define(["knockout", "bootstrap", "text!./logout.html"], function(ko, bootstrap, logoutTemplate) {

    function logoutView(route) {
        console.log("inside view model");

          (function() {
            var xhr = new XMLHttpRequest();
            var url = "[your API base url]/logout/";
            xhr.open("GET",  url);
            xhr.send();
            xhr.onreadystatechange = serverAlerts;
            function serverAlerts() {
              if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                  console.log("logged out");
                } else {
                  console.log("There was a problem with the request....");
                  console.log(xhr.responseText);
                }
              }
            }
          }
        ) ();
    }

    return { viewModel: logoutView, template: logoutTemplate };

});
