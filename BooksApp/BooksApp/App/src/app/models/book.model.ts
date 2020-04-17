export class Book {
    Id: number = null;
    BookAuthor: string = '';
    Author: { Id: number, Title: string } = { Id: null, Title: '' };
    BookName: string = '';
    Price: number;
    BookReview: string = '';
    Photo: { Description: string, Url: string } = { Description: '', Url: '' };
}