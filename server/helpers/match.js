module.exports= {
         getMatchJson: (query)=>{
          categories = ["Laptop","PC","Accessory","Monitor","Phone"];
        match={filters:{}, sort:{}, page:0};
        match.filters.higherPrice=1000000;
        match.filters.lowerPrice = 0;
        match.sort.sortBy='id';
        match.sort.type="DESC";
        match.page=0;
        match.perPage=25;
        match.category="";
        console.log(query);
        if(query.page>0){
          match.page=0;
        }
        if(query.sort){
          if(query.sort=="cheapest"){
            match.sort.sortBy='price';
            match.sort.type="ASC";
          }
          if(query.sort=="priciest"){
            match.sort.sortBy='price';
            match.sort.type="DESC";
          }
          if(query.sort=="newest"){
            match.sort.sortBy='id';
            match.sort.type="DESC";
          }
          if(query.sort=="oldest"){
            match.sort.sortBy='id';
            match.sort.type="ASC";
          }
        }
        if(query.higherprice>0){
          match.filters.higherPrice=query.higherprice;
        }
        if(query.lowerprice>0){
          match.filters.lowerPrice=query.lowerprice;
        }
        if(query.page>0){
          match.page = query.page;
        }
        if(categories.includes(query.category))
        {
          match.category=`AND "producttags->tags"."name"='${query.category}'`;
        }
        return match;
    }
}