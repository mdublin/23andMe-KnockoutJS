define(['knockout', 'text!./nav-bar.html'], function(ko, template) {

  function NavBarViewModel(params) {

    authCheck();

    // This viewmodel doesn't do anything except pass through the 'route' parameter to the view.
    // You could remove this viewmodel entirely, and define 'nav-bar' as a template-only component.
    // But in most apps, you'll want some viewmodel logic to determine what navigation options appear.

    this.route = params.route;


    function viewsDisplay() {
        document.getElementById("1").classList.remove("initial-hide");
        //document.getElementById("4").classList.remove("initial-hide");
        document.getElementById("5").classList.remove("initial-hide");
        document.getElementById("6").classList.remove("initial-hide");
    }

    function viewsHide() {
        document.getElementById(1).style.display = 'none';
        document.getElementById(4).style.display = 'none';
        document.getElementById(5).style.display = 'none';
        document.getElementById(6).style.display = 'none';
    }

    function authCheck() {
      var xhr = new XMLHttpRequest();
      var url = "[your API base url]/testjwt/"
      xhr.open("GET",  url, true);
      xhr.withCredentials = true;
      xhr.send();
      xhr.onreadystatechange = serverAlerts;
      function serverAlerts() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
          if (xhr.status === 200) {
              // store search query results
              console.log(JSON.parse(xhr.response));
              document.getElementById("7").style.display = "none";
              document.getElementById("parentNavBarUl").classList.remove("initial-hide");
          } else if (xhr.status === 401) {
              console.log(JSON.parse(xhr.response));
              //viewsHide();
              document.getElementById("7").style.display = "";
          } else {
              console.log("There was a problem with the request....");
              console.log(xhr.responseText);
          }
        }
      }
    }; //end of ajax function


    // logout action hiding navbar, only revealing login tab
    document.getElementById("8").addEventListener('click', function() {
        viewsHide();
        document.getElementById("8").style.display = 'none';
        document.getElementById("7").style.display = '';
    });


  }

  return { viewModel: NavBarViewModel, template: template };
});
