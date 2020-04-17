import { sp } from '@pnp/sp';
import { Injectable } from '@angular/core';
import '@pnp/sp/items';
import { Book } from '../models/book.model';
import { Subject, BehaviorSubject } from 'rxjs';
import { stringIsNullOrEmpty } from '@pnp/common';

@Injectable({
    providedIn: 'root'
})

export class BooksService {

    public booksSubject = new BehaviorSubject<any>('');
    currentBook = this.booksSubject.asObservable();

    constructor() {
        sp.setup({
            sp: {
                headers: {
                    Accept: 'application/json;odata=verbose',
                }
            },
        });
    }

    getBooks(listName: string) {
        if (!stringIsNullOrEmpty(listName)) {
            this.getAllBooks(listName).then((data: []) => {
                this.booksSubject.next(data);
            });
        }
    }

    private getAllBooks(listName: string) {
        const promise = new Promise((resolve, reject) => {
            sp.web.lists.getByTitle(listName).items
                .select('Id', 'Author/Id', 'BookAuthor', 'Author/Title', 'BookName', 'Price', 'BookReview', 'Photo/Url', 'Photo/Description')
                .expand('Author').getAll().then((items: any[]) => {
                    resolve(items);
                });
        });
        return promise;
    }

}
