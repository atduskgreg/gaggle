jQuery.gaggle = {
  results : [],
  expectedPages : 0,
  
  gResult : function(resultData){
    this.title = resultData.title;
    this.url = resultData.unescapedUrl;
    this.domain = resultData.visibleUrl;
  },
  
  processSearchResultsPage : function(data){
    jQuery.gaggle.moreResultsUrl = data.responseData.cursor.moreResultsUrl;
    for (i = 0; i < data.responseData.results.length; i++){
      jQuery.gaggle.results.push(new jQuery.gaggle.gResult(data.responseData.results[i]));      
    };
  },
  
  q : function(query, callback, type, p){
    var currentPage = p || 0;
    var queryType = type || "web";
    var rootUrl = "http://ajax.googleapis.com/ajax/services/search/"+queryType+"?v=1.0&start="+currentPage+"&q=";
    $.getJSON(rootUrl + query + "&callback=?",function(data){
      if(data.responseData){
        jQuery.gaggle.expectedPages = Math.ceil(data.responseData.cursor.estimatedResultCount / 4);
        jQuery.gaggle.processSearchResultsPage(data);
      } else {
        jQuery.gaggle.reachedMax = true;
        callback(jQuery.gaggle.results);
        jQuery.gaggle.reachedMax = false;
        
        // reset
        jQuery.gaggle.results = [];
        jQuery.gaggle.expectedPages = 0;
        return false;
      }
      
      if(currentPage + 1 < jQuery.gaggle.expectedPages){
        jQuery.gaggle.q(query, callback, queryType, (currentPage + 1));
      }
      else{
        callback(jQuery.gaggle.results);
        // reset
        jQuery.gaggle.results = [];
        jQuery.gaggle.expectedPages = 0;
      }
      return false;
    });
    return false;
  }
};