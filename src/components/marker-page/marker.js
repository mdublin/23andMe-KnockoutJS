define(["knockout", "jquery", "bootstrap", "text!./marker.html"], function(ko, jquery, bootstrap, markerTemplate){

    // assiging jquery import
    var $ = jquery;
    // assiging 23andme js library


    // KO view model
    // where is route being pass to this constructor?
    function markerViewModel(route) {

      (function() {
        var xhr = new XMLHttpRequest();
        var url = "[your API base url]/testjwt/";
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
              //location = "[your frontend base url]/#login"
              window.location.href = "[your frontend base url]/#login";
              window.location.reload(true);
            } else {
              console.log("There was a problem with the request....");
              console.log(xhr.responseText);
            }
          }
        }
      }
    ) ();


      $("#noresultsalert").hide();

      // initializing all tooltips on view
      $(function () {
        $('[data-toggle="tooltip"]').tooltip()
      });

      var param;

      $(document).ready(function(e){

        $(document).on('click', '.list-group-item', function(e) {
          var $this = $(this);
        });

        // catches selection from dropdown menu
        $('.search-panel .dropdown-menu').find('a').click(function(e) {
          e.preventDefault();
          // the value of this is the object created by passing the .seach-panel and .dropdown-menu
          // to the jquery selector
          param = $(this).attr("href").replace("#","");
          var concept = $(this).text();
          $('.search-panel span#search_concept').text(concept);
        });
      });

      // search button handler
      $("#searchBtn").click(function(e) {
        $("#noresultsalert").hide();
        self.KOMarkersResponseArray([]);
        self.KOMarkersResponseArray([]);
        var searchMarkerQuery = $("input[name=searchTerm]").val();
        if (searchMarkerQuery !== '') {
          // send search query and type of search to ajax call
          sendMarkerQuery(searchMarkerQuery, param);
        } else {
          alert("Please enter a search term.");
        }
      });

      // marker AJAX query

      var modalServerResponse = '';
      var markersResponse;

      function sendMarkerQuery(searchMarkerQuery, param) {

        console.log("this in the AJAX call: ");
        console.log(this); // this is reset to Window object when this ajax call is hit

        var xhr = new XMLHttpRequest();

        if (param == 'accession_id') {
          console.log("Searching for accession_id....")
          var url = "[your API base url]/23andMe/api/v1.0/marker/?accession_id=" + searchMarkerQuery;
        } else if ( param == 'gene_name') {
          console.log("Searching for gene_name...");
          var url = "[your API base url]/23andMe/api/v1.0/marker/?gene_name=" + searchMarkerQuery;
        } else {
          //return "param error: param + " param;
          return "error: param";

        }

        xhr.open("GET",  url, true);
        xhr.withCredentials = true;

        xhr.onreadystatechange = serverAlerts;

        // call ajax preflight request callback
        //beforeSend();
    	  xhr.send();

        //var markersResponse;

        function serverAlerts() {
    			if (xhr.readyState === XMLHttpRequest.DONE) {
    				if (xhr.status === 200) {
              // store search query results
              markersResponse = JSON.parse(xhr.response);
              // checking for no results
              if (markersResponse["data"].length === 0) {
                $("#noresultsalert").show();
              } else {
                // parse response
                parseMarkers(markersResponse, param);
              }
    				} else if (xhr.status === 401) {
              location = "[your frontend base url]/#login";
            } else {
    					console.log("There was a problem with the request....");
    					console.log(xhr.responseText);
    				}
    			}
    		}
      }; //end of ajax function


    // the very first time this viewmodel is called is when it is used as a constructor function
    // as part of the process of creating the viewmodel-as-object (tk exactly where and how, possibly via ko.components registration process in startup.js vs normally when you just pass a constructor function to ko.apply.bindings using new operator).
    //So initially, this == the viewmodel object that just got created. But very quickly, due to all the other code in here, such as the jquery selectors and ajax call, this becomes unbound from the viewmodel object and then this has the value of other objects, for example DOM elements or the global Window object. Essentially, this is equal to whatever object is in the current execution context.
    //That is why we need to save the first value of this that occurs during the initially activation of the constructor function that creates this view model to self, so that later, we can go back use the observables when we need to. The observables are after all properties of the viewmodel object, and thus, can only be accessed/are only defined in the context of the viewmodel.

    var self = this;

    self.KOMarkersResponseArray = ko.observableArray([]);
    self.KOMarkersResponseArray_geneName = ko.observableArray([]);
    self.KOMarkersResponseArray_accessionID = ko.observableArray([]);

    // array of chromosome objects
    var markersResults = [];

    // parses server response that is JSON string turned into an object
    function parseMarkers(markersResponse, param) {

      // callback to make string of platform labels inside variants object in markersResponse object
      // for display in popover
      function makePlatformLabelsString(platformlabelarray){
        var labelsString = "";
        for (var i in platformlabelarray) {
          labelsString += platformlabelarray[i] + " ";
        }
        return labelsString;
      }

        self.KOMarkersResponseArray([]);

        markersResults = [];

        for (var obj in markersResponse["data"]) {
          //self.KOMarkersResponseArray([]);
          var entry = {};
          var responseObj = markersResponse["data"][obj];
          console.log(responseObj);
          entry["id"] = markersResponse["data"][obj].id;
          entry["accession_id"] = markersResponse["data"][obj].accession_id;
          entry["start"] = markersResponse["data"][obj].start;
          entry["end"] = markersResponse["data"][obj].end;
          // for variants
          entry["allele_0"] = markersResponse["data"][obj].variants[0].allele;
          entry["allele_1"] = markersResponse["data"][obj].variants[1].allele;
          entry["platform_labels_string"] = makePlatformLabelsString(markersResponse["data"][obj].variants[0].platform_labels);

          markersResults.push(entry);
        }

        self.KOMarkersResponseArray(markersResults);

      // initializing Bootstrap popover elements after they've been rendered in DOM
      $('[data-toggle="popover"]').popover();

    }
    } // end of viewmodel

    return { viewModel: markerViewModel, template: markerTemplate };


});
