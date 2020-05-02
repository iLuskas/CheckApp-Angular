import { Component, OnInit } from '@angular/core';
import { Product } from '../product.model';
import { ProductService } from '../product.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-delete',
  templateUrl: './product-delete.component.html',
  styleUrls: ['./product-delete.component.css']
})
export class ProductDeleteComponent implements OnInit {

  product: Product = {
    name: "",
    price: null,
  };

  constructor(
    private productService: ProductService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.getProductById();
  }

  getProductById() {
    const id = this.route.snapshot.paramMap.get("id");
    this.productService.readById(id).subscribe((product: Product) => {
      this.product = product;
      console.log(this.product);
    });
  }

  deleteProduct(): void {
    const id = this.route.snapshot.paramMap.get("id");
    this.productService.delete(id).subscribe(() => {
      this.productService.showMessage("Produto removido com sucesso!");
      this.router.navigate(["/products"]);
    });
  }

  cancel(): void {
    this.router.navigate(["/products"]);
  }
}
