Gaggle = function(){
  this.results = [];
  this.expectedPages = 0;
  
  search : function(q, p, callback){
    var currentPage = p;
    var rootUrl = "http://ajax.googleapis.com/ajax/services/search/web?v=1.0&start="+p+"&q=";
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
        Gaggle.search(q, (currentPage + 1), callback);
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