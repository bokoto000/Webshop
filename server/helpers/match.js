module.exports= {
         getMatchJson: (query)=>{
          categories = ["Laptop","PC","Accessory","Monitor","Phone"];
        match={ page:0};
        match.higherPrice=1000000;
        match.lowerPrice = 0;
        match.orderBy='id';
        match.order="DESC";
        match.page=0;
        match.perPage=25;
        match.category="";
        if(query.page>0){
          match.page=0;
        }
        if(query.sort){
          if(query.sort=="cheapest"){
            match.orderBy='price';
            match.order="ASC";
          }
          if(query.sort=="priciest"){
            match.orderBy='price';
            match.order="DESC";
          }
          if(query.sort=="newest"){
            match.orderBy='id';
            match.order="DESC";
          }
          if(query.sort=="oldest"){
            match.orderBy='id';
            match.order="ASC";
          }
        }
        if(query.higherprice>0){
          match.higherPrice=query.higherprice;
        }
        if(query.lowerprice>0){
          match.lowerPrice=query.lowerprice;
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