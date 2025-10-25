import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FirestoreService } from '../../core/services/firestore.service';

@Component({
    selector: 'app-categories',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './categories.component.html',
})
export class CategoriesComponent implements OnInit {
    categories: any[] = [];

    constructor(private fs: FirestoreService) { }

    ngOnInit(): void {
        this.fs.onCollectionSnapshot('demo_categories', (docs) => {
            this.categories = docs;
        });
    }

}
