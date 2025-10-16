//Find all books in a specific genre
db.books.find({ genre: "Fantasy" })

//Find books published after a certain year
db.books.find({ publicationYear: { $gt: 2018 } })

//Find books by a specific author
db.books.find({ author: "J.K. Rowling" })

//Update the price of a specific book
db.books.updateOne({ title: "The Great Gatsby" }, { $set: { price: 10.99 } })

//Delete a book by its title
db.books.deleteOne({ title: "Old Book Title" })

//Task 3 
//Write a query to find books that are both in stock and published after 2010
db.books.find({ inStock: true, publicationYear: { $gt: 2010 } })

//Use projection to return only the title, author, and price fields in your queries
db.books.find({ genre: "Science Fiction" }, { title: 1, author: 1, price: 1, _id: 0 })  

//Implement sorting to display books by price (both ascending and descending)
db.books.find().sort({ price: 1 })  // Ascending
db.books.find().sort({ price: -1 }) // Descending

//Use the limit and skip methods to implement pagination (5 books per page)
db.books.find().skip(0).limit(5)  


//Aggregation pipeline
//Create an aggregation pipeline to calculate the average price of books by genre
db.books.aggregate([
  {
    $group: {
      _id: "$genre",                 // group by genre
      averagePrice: { $avg: "$price" } // calculate average price
    }
  },
  {
    $project: {
      _id: 0,
      genre: "$_id",
      averagePrice: { $round: ["$averagePrice", 2] } // optional: round to 2 decimal places
    }
  }
])



//Create an aggregation pipeline to find the author with the most books in the collection
db.books.aggregate([
  {
    $group: {
      _id: "$author",
      totalBooks: { $sum: 1 }
    }
  },
  {
    $sort: { totalBooks: -1 }  // sort by descending count
  },
  {
    $limit: 1                  // keep only the top author
  },
  {
    $project: {
      _id: 0,
      author: "$_id",
      totalBooks: 1
    }
  }
])



//Implement a pipeline that groups books by publication decade and counts them
db.books.aggregate([
  {
    $addFields: {
      decade: {
        $multiply: [
          { $floor: { $divide: ["$publicationYear", 10] } },
          10
        ]
      }
    }
  },
  {
    $group: {
      _id: "$decade",
      totalBooks: { $sum: 1 }
    }
  },
  {
    $sort: { _id: 1 } // sort decades ascending
  },
  {
    $project: {
      _id: 0,
      decade: { $concat: [{ $toString: "$_id" }, "s"] },
      totalBooks: 1
    }
  }
])


//Task 5
//Create an index on the title field for faster searches
db.books.createIndex({ title: 1 })


//Create a compound index on author and published_year
db.books.createIndex({ author: 1, published_year: -1 })



//Use the explain() method to demonstrate the performance improvement with your indexes
db.books.find({ title: "Things Fall Apart" }).explain("executionStats")

