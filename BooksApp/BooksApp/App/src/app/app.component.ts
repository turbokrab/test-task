import { Component, QueryList, ViewChildren, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { sp } from '@pnp/sp';
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/fields";
import "@pnp/sp/webs";
import "@pnp/sp/site-users/web";
import { BooksService } from './services/books.service';
import { MatDialog } from '@angular/material/dialog';
import { PopUpDialogComponent } from './pop-up-dialog/pop-up-dialog.component';
import { isNullOrUndefined, isObject } from 'util';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {

  @ViewChildren(MatPaginator) paginator = new QueryList<MatPaginator>();
  @ViewChildren(MatSort) sort = new QueryList<MatSort>();
  booksDataSource = new MatTableDataSource<any>();
  displayedColumnsBooks: string[] = ['Author', 'Book Name', 'Price', 'Book Review', 'Photo', 'Delete book'];
  preventSimpleClick: boolean;
  timer;

  bookList = 'BooksList';

  constructor(private booksService: BooksService, public dialog: MatDialog) {

  }

  async ngOnInit() {

    this.booksService.getBooks(this.bookList);

    this.booksService.booksSubject.subscribe((items: any[]) => {

      if (items.length > 0) {

        this.booksDataSource.data = items;
        this.booksDataSource.paginator = this.paginator.toArray()[0];
        this.booksDataSource.sort = this.sort.toArray()[0];
        this.booksDataSource.sortingDataAccessor = (item, property) => {

          switch (property) {
            case 'Author': return item['BookAuthor'];
            case 'Book Name': return item['BookName'];
            case 'Photo': return item[property].Description;
            case 'Book Review': return item['BookReview'];
            default: return item[property];
          }

        };

      } else {
        this.booksDataSource.data = [];
        this.booksDataSource.paginator = null;
        this.booksDataSource.sort = null;
      }
    });
  }

  addBook() {
    this.dialog.open(PopUpDialogComponent, {
      width: '600px',
      height: 'auto',
      data: {
        header: 'Add new book'
      }
    }).afterClosed().subscribe(async addedBook => {
      if (!isNullOrUndefined(addedBook)) {
        if (isObject(addedBook)) {
          sp.web.lists.getByTitle(this.bookList).items.add({
            Title: 'Added',
            AuthorId: (await sp.web.currentUser.get()).Id,
            BookAuthor: addedBook.BookAuthor,
            BookName: addedBook.BookName,
            Price: addedBook.Price,
            BookReview: addedBook.BookReview,
            Photo: { Url: addedBook.PhotoUrl, Description: addedBook.PhotoDescription }
          }).then(() => {
            this.booksService.getBooks(this.bookList);
          });
        }
      }
    });
  }

  deleteBook(Id: number) {
    if (!isNullOrUndefined(Id)) {
      sp.web.lists.getByTitle(this.bookList).items.getById(Id).delete().then(result => {
        this.booksService.getBooks(this.bookList);
      });
    }
  }

  updateBook(Id: number) {
    if (!isNullOrUndefined(Id)) {
      this.preventSimpleClick = true;
      clearTimeout(this.timer);
      this.dialog.open(PopUpDialogComponent, {
        width: '600px',
        data: {
          header: 'Update book info',
          bookInfo: this.booksDataSource.data.find(book => book.Id === Id)
        }
      }).afterClosed().subscribe(async updatedBook => {
        if (isObject(updatedBook)) {
          sp.web.lists.getByTitle(this.bookList).items.getById(Id).update({
            Title: 'Updated',
            BookAuthor: updatedBook.BookAuthor,
            AuthorId: (await sp.web.currentUser.get()).Id,
            BookName: updatedBook.BookName,
            Price: updatedBook.Price,
            BookReview: updatedBook.BookReview,
            Photo: { Url: updatedBook.PhotoUrl, Description: updatedBook.PhotoDescription }
          }).then(() => {
            this.booksService.getBooks(this.bookList);
          });
        }
      });
    }
  }

  singleClick() {
    this.timer = 0;
    this.preventSimpleClick = false;
    const delay = 200;

    this.timer = setTimeout(() => {
      if (!this.preventSimpleClick) {
        //  ...
      }
    }, delay);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.booksDataSource.filter = filterValue.trim().toLowerCase();
  }
}
