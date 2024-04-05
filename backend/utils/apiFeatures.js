class APIFeatures{
     constructor(query,queryStr){
          this.query= query;
          this.queryStr= queryStr;
     }
     
     search(){
          const keyword= this.queryStr.keyword ? {
               name: {
                    $regex: this.queryStr.keyword,
                    $options: 'i'
               }

          } : {}
          // console.log(keyword);
          this.query= this.query.find({...keyword})
          return this;
     }
     filter(){
          const querycopy= { ...this.queryStr }
          // console.log(querycopy)

          //Removing fields from query
          const removeFields= ['keyword', 'limit', 'page']

          
          removeFields.forEach(el=>{
                         delete querycopy[el]
                    })
          
          // Advance filter for price, rating etc.
          let queryStr= JSON.stringify(querycopy)
          queryStr= queryStr.replace(/\b(gt|gte|lt|lte)\b/g, match =>`$${match}`)
          
          // console.log(queryStr);

          this.query= this.query.find(JSON.parse(queryStr));
          return this;
     }

     pagination(resPerPage) {
          const currentPage= Number(this.queryStr.page) || 1;
          const skip= (currentPage - 1) * resPerPage;

          this.query= this.query.limit(resPerPage).skip(skip);
          return this;
     }
}

module.exports= APIFeatures;