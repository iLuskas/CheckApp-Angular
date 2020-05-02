import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { ProductsRead2DataSource } from './products-read2-datasource';
import { Product } from '../product.model';
import { ProductService } from '../product.service';

@Component({
  selector: 'app-products-read2',
  templateUrl: './products-read2.component.html',
  styleUrls: ['./products-read2.component.css']
})
export class ProductsRead2Component implements AfterViewInit, OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<Product>;
  dataSource: ProductsRead2DataSource;

  products: Product[];
  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['id', 'name', 'price'];

  constructor(private productService: ProductService){}

  ngOnInit() {
    this.dataSource = new ProductsRead2DataSource();
    this.readProducts();
  }

  readProducts() {
    this.productService.read().subscribe(
      (products: Product[]) =>{
        this.products = products;
        this.dataSource.data = this.products;
        console.log(this.products);
      }
    );
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
  }
}
