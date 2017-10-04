define(["knockout", "jquery", "bootstrap", "text!./variant.html"], function(ko, jquery, bootstrap, variantTemplate){

    // assiging jquery import
    var $ = jquery;
    // KO view model
    // where is route being pass to this constructor?
    function variantViewModel(route) {

      // immediate function fires off an auth check to API upon initial load of index.html, for example if
      // user tries to load [your frontend base url]/#login directly or from bookmark.
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
              //location = "[your frontend base url]/#login"
              window.location.href = "[your frontend base url]/#login"
              window.location.reload(true);
            } else {
              console.log("There was a problem with the request....");
              console.log(xhr.responseText);
            }
          }
        }
      }
    ) ();

      var self = this;
      self.accessionidsArray = ko.observableArray();
      self.chromosomesArray = ko.observableArray();
      self.selectedaccessionidOB = ko.observable();
      self.selectedchromosomeidOB = ko.observable();
      self.selectedChoice = ko.observable();
      self.selectedParams = ko.observable();
      // for refine search sub dropdown
      self.platformlabels = ko.observable();
      var searchQuery = {};
      self.resultsArray = ko.observableArray();

      $(document).ready(function(e){

        $("#noresultsalert").hide();
        $("#loadingBtn").hide();
        $("#nextBtn").hide();
        $("#prevBtn").hide();

        var accessions = [ {accessionId: "NC_012920.1"}, {accessionId: "NC_000001.10"}, {accessionId: "NC_000002.11"}, {accessionId: "NC_000003.11"}, {accessionId: "NC_000004.11"}, {accessionId: "NC_000005.9"}, {accessionId: "NC_000006.11"}, {accessionId: "NC_000007.13"}, {accessionId: "NC_000008.10"}, {accessionId: "NC_000009.11"}, {accessionId: "NC_000010.10"}, {accessionId: "NC_000011.9"}, {accessionId: "NC_000012.11"}, {accessionId: "NC_000013.10"}, {accessionId: "NC_000014.8"}, {accessionId: "NC_000015.9"}, {accessionId: "NC_000016.9"}, {accessionId: "NC_000017.10"}, {accessionId: "NC_000018.9"}, {accessionId: "NC_000019.9"}, {accessionId: "NC_000020.10"}, {accessionId: "NC_000021.8"}, {accessionId: "NC_000022.10"}, {accessionId: "NC_000023.10"}, {accessionId: "NC_000024.9"} ];

        self.accessionidsArray(accessions);

        var chromosomes = [ {chromosomeID: 1}, {chromosomeID: 2}, {chromosomeID: 3}, {chromosomeID: 4}, {chromosomeID: 5}, {chromosomeID: 6}, {chromosomeID: 7}, {chromosomeID: 8}, {chromosomeID: 9}, {chromosomeID: 10}, {chromosomeID: 11}, {chromosomeID: 12}, {chromosomeID: 13}, {chromosomeID: 14}, {chromosomeID: 15}, {chromosomeID: 16}, {chromosomeID: 17}, {chromosomeID: 18}, {chromosomeID: 19}, {chromosomeID: 20}, {chromosomeID: 21}, {chromosomeID: 22}, {chromosomeID: 'X'}, {chromosomeID: 'Y'} ];

        self.chromosomesArray(chromosomes);

        var labels = [ {label: "ILMN_550"}, {label: "ILMN_550Qv1_CUSTOMv2"}, {label: "ILMN_550v3"}, {label: "ILMN_550v3_CUSTOMv1"}, {label: "ILMN_CUSTOMv1"}, {label: "ILMN_CUSTOMv4"}, {label: "ILMN_OMNIEXv3_CUSTOMv3"} ]

        self.platformlabels(labels);

        // grabbing dropdown menu items by class
        var selectedaccessionid = document.querySelectorAll('.selectedaccessionid');
        var selectedchromosomeid = document.querySelectorAll('.selectedchromosomeid');
        var selectedlabel = document.querySelectorAll('.selectedlabel');

        // adding event listeners to dropdown menu items
        for (var i = 0; i < selectedaccessionid.length; i++ ) {
            selectedaccessionid[i].addEventListener('click', function(e) {
                $("#nextBtn").hide();
                $("#prevBtn").hide();
                // removes the initial-hide class from this element so it appears, it is initially hidden in css.css
                document.getElementById("searchInterface").classList.remove("initial-hide");
                document.getElementById("genenamesearchfield").style.display = "none";
                self.resultsArray([]);
                self.selectedChoice(this.text);
                searchQuery = {};
                searchQuery["accession_id"] = this.text;
            });
        }

        for (var i = 0; i < selectedchromosomeid.length; i++ ) {
            selectedchromosomeid[i].addEventListener('click', function(e) {
                $("#nextBtn").hide();
                $("#prevBtn").hide();
                document.getElementById("searchInterface").classList.remove("initial-hide");
                document.getElementById("genenamesearchfield").style.display = "none";
                self.resultsArray([]);
                self.selectedChoice("selected chromosome: " + this.text);
                searchQuery = {};
                searchQuery["chromosome_id"] = this.text;
                console.log(searchQuery);
            });
        }

        //gene name addEventListener
        document.getElementById("genenamebtn").addEventListener('click', function(e) {
            $("#nextBtn").hide();
            $("#prevBtn").hide();
            self.resultsArray([]);
            self.selectedChoice("");
            document.getElementById("searchInterface").classList.remove("initial-hide");
            document.getElementById("genenamesearchfield").style.display = "";
        });

        // extra params
        var additionalParam = '';
        for (var i = 0; i < selectedlabel.length; i++ ) {
          selectedlabel[i].addEventListener('click', function(e) {
            self.selectedParams("Selected Param: " + this.text);
            additionalParam = this.text;
            // currently just configured for platform_label, building query string param
            // also not configured for concatenating multiple platform_label queries
            additionalParam = "&platform_label=" + additionalParam;
          });
        }

        // for platform label sub-dropdown menu
        $('.dropdown-submenu a.test').on("click", function(e){
          $(this).next('ul').toggle();
          e.stopPropagation();
          e.preventDefault();
        });

        // search button handler
        $("#searchBtn").click(function(e) {
          $("#searchBtn").hide();
          $("#loadingBtn").show();
          $("#noresultsalert").hide();
          self.resultsArray([]);

          console.log(searchQuery);

          if (document.getElementById("genenamefield").value !== '') {
            console.log("test input form")
            console.log(document.getElementById("genenamefield").value)
            searchQuery = {'gene_name': document.getElementById("genenamefield").value}
            sendVariantQuery(searchQuery)
          } else {
            console.log(searchQuery);
            sendVariantQuery(searchQuery);
          }
        });

        // clear button handler
        $("#clearBtn").click(function(e) {
          //clearing observables
          $("#noresultsalert").hide ();
          self.resultsArray([]);
          self.selectedChoice(null);
          self.selectedParams(null);
          searchQuery = {};
        });


    //}); // end of doc ready

    var modalServerResponse = '';

    //var variantsResponse;

    function sendVariantQuery(searchQuery) {

      console.log("sendVariantQuery called....");
      console.log(searchQuery);

      var xhr = new XMLHttpRequest();

      if (searchQuery['accession_id']) {
        console.log("Searching for accession_id....")
        var url = "[your API base url]/23andMe/api/v1.0/variant/?accession_id=" + searchQuery['accession_id'];
      } else if (searchQuery['chromosome_id']) {
        console.log("Searching for chromosome_id...")
        var url = "[your API base url]/23andMe/api/v1.0/variant/?chromosome_id=" + searchQuery['chromosome_id'];
      } else if (searchQuery["gene_name"]) {
        var url = "[your API base url]/23andMe/api/v1.0/variant/?gene_name=" + searchQuery['gene_name'];
      } else {
        return "error: param";
      }

      if (additionalParam !== '') {
        var url = url + additionalParam;
      }

      xhr.open("GET",  url, true);
      xhr.withCredentials = true;
      xhr.onreadystatechange = serverAlerts;
      xhr.send();

      function serverAlerts() {
        if (xhr.readyState === XMLHttpRequest.DONE) {

          $("#searchBtn").show();
          $("#loadingBtn").hide();

          if (xhr.status === 200) {
            // store search query results
            variantsResponse = JSON.parse(xhr.response);

            // sending to add results prop callback for UI display
            addResultProp(variantsResponse);

            // checking for no results
            if (variantsResponse["data"].length == 0) {
              $("#noresultsalert").show();
            } //else {
              // parse response
              //parseVariants(variantsResponse);
            //}
          } else if (xhr.status == 401) {
            location = "[your frontend base url]/#login";
          } else {
            $("#noresultsalert").show();
            console.log("There was a problem with the request....");
            console.log(xhr.responseText);
          }
        }
      }

    }; //end of ajax function


    function addResultProp(variantsResponse) {
      for (var i = 0; i < variantsResponse["data"].length; i++) {
        variantsResponse["data"][i]["resultsNumber"] = "result #" + (i + 1);
      }
      // after adding to results number property, now passing to results handler
      resultsHandler(variantsResponse);
    }


    // initial results loading handler callback
    function resultsHandler(variantsResponse) {
      console.log("variantsResponse length: " + variantsResponse["data"].length);
      if (variantsResponse["data"].length <= 10) {
        console.log("less than 10")
        self.resultsArray(variantsResponse["data"]);
      } else {
        // we slice
        console.log("slicing variantsResponse...")
        self.resultsArray(variantsResponse["data"].slice(0,10));
        $("#nextBtn").show();
      }
    }

   var current_page = 1;
   var startSlice = 0;
   var endSlice = 10;

   // click handlers for next and prev
   document.getElementById("nextBtn").addEventListener('click', function(e) {
     e.preventDefault();
     console.log("nextBtn clicked: " + this);

     current_page = current_page + 1;
     startSlice = startSlice + 10;
     endSlice = endSlice + 10;

     console.log(startSlice, endSlice);
     console.log(variantsResponse["data"].slice(startSlice, endSlice));

     self.resultsArray(variantsResponse["data"].slice(startSlice, endSlice));
     $("#prevBtn").show();


   });

   document.getElementById("prevBtn").addEventListener('click', function(e) {
     e.preventDefault();
     console.log("prevBtn clicked: " + this);
     current_page = current_page - 1;
     startSlice = startSlice - 10;
     endSlice = endSlice - 10;
     if (current_page === 1) {
       document.getElementById("prevBtn").style.display = 'none';
     }
     self.resultsArray(variantsResponse["data"].slice(startSlice, endSlice));
   });


    }); // end of doc ready

    } // end of viewmodel

    return { viewModel: variantViewModel, template: variantTemplate };

});
