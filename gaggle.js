GResult = function(resultData){
  this.title = resultData.title;
  this.url = resultData.unescapedUrl;
  this.domain = resultData.visibleUrl;
};
    
Gaggle = {
  results : [],
  expectedPages : 0,
  
  processSearchResultsPage : function(data){
    Gaggle.moreResultsUrl = data.responseData.cursor.moreResultsUrl;
    for (i = 0; i < data.responseData.results.length; i++){
      Gaggle.results.push(new GResult(data.responseData.results[i]));      
    };
  },
  
  submitQuery : function(q, callback, type, p){
    var currentPage = p || 0;
    var queryType = type || "web";
    var rootUrl = "http://ajax.googleapis.com/ajax/services/search/"+queryType+"?v=1.0&start="+currentPage+"&q=";
    $.getJSON(rootUrl + q + "&callback=?",function(data){
      if(data.responseData){
        Gaggle.expectedPages = Math.ceil(data.responseData.cursor.estimatedResultCount / 4);
        Gaggle.processSearchResultsPage(data);
      } else {
        Gaggle.reachedMax = true;
        callback(Gaggle.results);
        Gaggle.reachedMax = false;
        
        // reset
        Gaggle.results = [];
        Gaggle.expectedPages = 0;
        return false;
      }
      
      if(currentPage + 1 < Gaggle.expectedPages){
        Gaggle.submitQuery(q, callback, queryType, (currentPage + 1));
      }
      else{
        callback(Gaggle.results);
        // reset
        Gaggle.results = [];
        Gaggle.expectedPages = 0;
      }
      return false;
    });
    return false;
  }
};