define(["knockout", "jquery", "bootstrap", "clipboardjs", "text!./accession.html"], function(ko, jquery, bootstrap, clipboard, accessionTemplate){

    // assiging jquery import to global variable
    var $ = jquery;
    // assiging 23andme js library

    // assigning clipboardjs import to global variable
    var clipboardjs = clipboard;
    // don't need to select with the event delegation approach because we only have one button
    new clipboardjs("#copyToClipboard");

    function accessionViewModel(route) {

      (function() {
        var xhr = new XMLHttpRequest();
        var url = "[your API base url]/testjwt/"
        //xhr.open("GET",  url, true);
        xhr.open("GET",  url);
        xhr.withCredentials = true;
        xhr.send();
        xhr.onreadystatechange = serverAlerts;
        function serverAlerts() {
          if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
              console.log(JSON.parse(xhr.response));
              document.getElementById("parentDiv").classList.remove("initial-hide");
            } else if (xhr.status === 401) {
              console.log(JSON.parse(xhr.response));
              // need to reload the resource of the assigned url, probably because of how the components are working, if you just do
              // location = someUrl, the js attached to the html won't work, so login button won't redirect to 23andme oauth
              //location = "https://23andmefrontend.com/#login"
              window.location.href = "https://23andmefrontend.com/#login"
              window.location.reload(true);
            } else {
              console.log("There was a problem with the request....");
              console.log(xhr.responseText);
            }
          }
        }
      }
    ) ();

      $(document).ready(function() {

        $("#viewRawServerResponse").hide();
        $("a.tooltipLink").tooltip();

      });

      // hide all the chromosome images upon page load
      $("#chromosomediv").hide();

      this.numberOfClicks = ko.observable(0);
      this.chromosomeImageId = ko.observable();
      this.chromosome = ko.observable();
      this.chromosome_id = ko.observable();
      this.chromosome_length = ko.observable();
      //for XY chromosome
      this.Xchromosome_id = ko.observable();
      this.Xchromosome_length = ko.observable();
      this.Ychromosome_id = ko.observable();
      this.Ychromosome_length = ko.observable();

      var self = this;
      self.rawServerResponse = ko.observable();

      incrementClickCounter = function(data, event) {
            var chromoImageId = event.target.id;
            this.chromosomeImageId(chromoImageId);
            // checking for chromosome 23 selection, in UI clicking on 23 image will display both X and Y data in modal
            if (chromoImageId == "chromosome_23") {
              // to get X object at index 22 in chromosomes array
              var chromObj = getChromData(22);
              this.Xchromosome_id(chromObj["id"]);
              this.Xchromosome_length(chromObj["length"]);
              // to get Y object at index 23 in chromosomes array
              var chromObj = getChromData(23);
              this.Ychromosome_id(chromObj["id"]);
              this.Ychromosome_length(chromObj["length"]);

            } else { //all other chromosomes
              var chromObj = getChromData(parseInt(chromoImageId.split("_")[1]) - 1);
              // using bracket notation to stay consistent
              this.chromosome(chromObj["chromosome"]);
              this.chromosome_id(chromObj["id"]);
              this.chromosome_length(chromObj["length"]);
            }
        }

      this.message = ko.observable('Welcome to 23andMeAPIProject!');

      var modalServerResponse = '';

      $("#testaccession").click(function() {

    		var xhr = new XMLHttpRequest();
        xhr.open("GET",  "[your API base url]/23andMe/api/v1.0/accession/", true);
        xhr.withCredentials = true;
        xhr.onreadystatechange = serverAlerts;
    	  xhr.send();

        var accessions;

    		function serverAlerts() {
    			if (xhr.readyState === XMLHttpRequest.DONE) {
    				if (xhr.status === 200) {
              accessions = JSON.parse(xhr.response);
              console.log(typeof(accessions));
              console.log("server response: " + accessions["data"]);

              parseAccessions(accessions);
              $("#chromosomediv").show();
              console.log("this is this: " + this);
              self.rawServerResponse(xhr.responseText);
              //document.getElementById("jsoninsert4").textContent = xhr.responseText;
    				} else if (xhr.status == 401) {
              location = "https://23andmefrontend.com/#login";
            } else {
    					console.log("There was a problem with the request....");
    					console.log(xhr.responseText);
    				}
    			}
    		}
    	});

    // array of chromosome objects
    var chromosomes = [];

    // parses server response that is JSON string into an object
    function parseAccessions(accessions) {
      for (var chromosome in accessions["data"]) {
        chromosomes.push(accessions["data"][chromosome])
      }
      $("#viewRawServerResponse").show();
    }

    // getting chromosome object in array using split id from image element user clicks
    function getChromData(imageElementId) {
      return chromosomes[imageElementId];
    }

    //console.log("this is a test");
    accessionViewModel.prototype.doSomething = function() {
        this.message('you invoked doSomething() on the viewmodel.');
    };

  }
    return { viewModel: accessionViewModel, template: accessionTemplate };


});
