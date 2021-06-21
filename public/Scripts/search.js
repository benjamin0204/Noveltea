$(document).ready(function () {
  var item, tile, author, publisher, bookLink, bookImg;
  var outputList = document.getElementById("list-output");
  var bookUrl = "https://www.googleapis.com/books/v1/volumes?q=";
  var apiKey = "key=AIzaSyBQqZi7PUGzEyJc5dZdi28Bng0CCLaRtcY";
  var placeHldr = '<img src="https://via.placeholder.com/150">';
  var searchData;

  //listener for search button
  $("#search").click(function () {
    outputList.innerHTML = ""; //empty html output
    document.body.style.backgroundImage = "url('')";
    searchData = $("#search-box").val();
    //handling empty search input field
    if (searchData === "" || searchData === null) {
      displayError();
    } else {
      // console.log(searchData);
      // $.get("https://www.googleapis.com/books/v1/volumes?q="+searchData, getBookData()});
      $.ajax({
        url: bookUrl + searchData,
        dataType: "json",
        success: function (response) {
          // console.log(response);

          if (response.totalItems === 0) {
            alert("no result!.. try again");
          } else {
            $("#title").animate({ "margin-top": "5px" }, 1000); //search box animation
            $(".book-list").css("visibility", "visible");
            displayResults(response);
          }
        },
        error: function () {
          alert("Something went wrong.. <br>" + "Try again!");
        },
      });
    }
    $("#search-box").val(""); //clearn search box
  });

  /*
   * function to display result in index.html
   * @param response
   */

  function displayResults(response) {
    for (var i = 0; i < response.items.length; i += 2) {
      item = response.items[i];
      title1 = item.volumeInfo.title;
      sub1 = item.volumeInfo.subtitle;
      author1 = item.volumeInfo.authors;
      desc1 = item.volumeInfo.description;
      publisher1 = item.volumeInfo.publisher;
      pubdate1 = item.volumeInfo.publishedDate;
      bookLink1 = item.volumeInfo.previewLink;
      bookIsbn1 = item.volumeInfo.industryIdentifiers[0].identifier;

      if (item.volumeInfo.imageLinks.extraLarge) {
        bookImg1 = item.volumeInfo.imageLinks.extraLarge;
      } else if (item.volumeInfo.imageLinks.large) {
        bookImg1 = item.volumeInfo.imageLinks.large;
      } else if (item.volumeInfo.imageLinks.medium) {
        bookImg1 = item.volumeInfo.imageLinks.medium;
      } else if (item.volumeInfo.imageLinks.small) {
        bookImg1 = item.volumeInfo.imageLinks.small;
      } else if (item.volumeInfo.imageLinks.thumbnail) {
        bookImg1 = item.volumeInfo.imageLinks.thumbnail;
      } else if (item.volumeInfo.imageLinks.smallthumbnail) {
        bookImg1 = item.volumeInfo.imageLinks.smallthumbnail;
      } else {
        bookImg1 = placeHldr;
      }

      pagecount1 = item.volumeInfo.pageCount;
      genre1 = item.volumeInfo.categories;

      item2 = response.items[i + 1];
      title2 = item2.volumeInfo.title;
      sub2 = item2.volumeInfo.subtitle;
      author2 = item2.volumeInfo.authors;
      desc2 = item2.volumeInfo.description;
      publisher2 = item2.volumeInfo.publisher;
      pubdate2 = item2.volumeInfo.publishedDate;
      bookLink2 = item2.volumeInfo.previewLink;
      bookIsbn2 = item2.volumeInfo.industryIdentifiers[0].identifier;

      if (item2.volumeInfo.imageLinks.extraLarge) {
        bookImg2 = item2.volumeInfo.imageLinks.extraLarge;
      } else if (item2.volumeInfo.imageLinks.large) {
        bookImg2 = item2.volumeInfo.imageLinks.large;
      } else if (item2.volumeInfo.imageLinks.medium) {
        bookImg2 = item2.volumeInfo.imageLinks.medium;
      } else if (item2.volumeInfo.imageLinks.small) {
        bookImg2 = item2.volumeInfo.imageLinks.small;
      } else if (item2.volumeInfo.imageLinks.thumbnail) {
        bookImg2 = item2.volumeInfo.imageLinks.thumbnail;
      } else if (item2.volumeInfo.imageLinks.smallthumbnail) {
        bookImg2 = item2.volumeInfo.imageLinks.smallthumbnail;
      } else {
        bookImg2 = placeHldr;
      }

      pagecount2 = item2.volumeInfo.pageCount;
      genre2 = item2.volumeInfo.categories;

      // in production code, item.text should have the HTML entities escaped.
      outputList.innerHTML +=
        '<div class="row mt-4">' +
        formatOutput(
          title1,
          sub1,
          author1,
          desc1,
          publisher1,
          pubdate1,
          bookLink1,
          bookIsbn1,
          bookImg1,
          pagecount1,
          genre1
        ) +
        formatOutput(
          title2,
          sub2,
          author2,
          desc2,
          publisher2,
          pubdate2,
          bookLink2,
          bookIsbn2,
          bookImg2,
          pagecount2,
          genre2
        ) +
        "</div>";

      // console.log(outputList);
    }
  }

  /*
   * card element formatter using es6 backticks and templates (indivial card)
   * @param bookImg title author publisher bookLink
   * @return htmlCard
   * 
   * 
   * fields:
    title
    sub
    author
    desc
    publisher
    pubdate
    bookLink
    bookIsbn
    bookImg
    pagecount
    genre
   */
  function formatOutput(
    title,
    sub,
    author,
    desc,
    publisher,
    pubdate,
    bookLink,
    bookIsbn,
    bookImg,
    pagecount,
    genre
  ) {
    // console.log(title + ""+ author +" "+ publisher +" "+ bookLink+" "+ bookImg)
    var viewUrl = "book.html?isbn=" + bookIsbn; //constructing link for bookviewer
    var htmlCard = `<div class="col-lg-6">
    <form
    action="/books"
    method="POST"
    class="validated-form "
    novalidate
    enctype="multipart/form-data"
  >
  <div class="card" style="">
  <div class="row no-gutters">
  <div class="col-md-4">

  <input value='${bookImg}' class=" d-none form-control"type="text"id="image"name="book[image]"required/>
  <img src="${bookImg}" class="card-img" alt="...">
  </div>
  <div class="col-md-8">
  <div class="card-body">

  
  <input value='${title}' class=" d-none form-control"type="text"id="title"name="book[title]"required/>
  <h5 class="card-title">${title}</h5>

  <input value='${sub}' class=" d-none form-control"type="text"id="sub"name="book[sub]"/>
  <p class="card-title">${sub}</p>
  
  <input value='${author}' class=" d-none form-control"type="text"id="author"name="book[author]"required/>
  <p class="card-text">Author: ${author}</p>

  <input value='${publisher}' class="d-none form-control"type="text"id="publisher"name="book[publisher]"/>
  <p class="card-text">Publisher: ${publisher}</p>
  <input value='${pubdate}' class="d-none form-control"type="text"id="pubdate"name="book[pubDate]"/>
  
  <input value='${genre}' class="d-none form-control"type="text"id="genre"name="book[genre]"required/>
  <p class="card-text"> ${genre}</p>

  <input value='${desc}' class="d-none form-control"type="text"id="desc"name="book[desc]"/>

  <input value='${pagecount}' class="d-none form-control"type="text"id="pageCount"name="book[pagecount]"/>

  <input value='${bookIsbn}' class="d-none form-control"type="text"id="bookIsbn"name="book[bookIsbn]"/>
  <input value='${bookLink}' class="d-none form-control"type="text"id="bookLink"name="book[bookLink]"/>

  <a href='${bookLink}' target="_blank" class="btn btn-info">
  Preview
</a>
  <button type="submit" class="btn btn-success">
  Add book
</button>
  </div>
  </div>
  </div>
  </div>
  </form>
  </div>`;
    return htmlCard;
  }

  //handling error for empty search box
  function displayError() {
    alert("search term can not be empty!");
  }
});
