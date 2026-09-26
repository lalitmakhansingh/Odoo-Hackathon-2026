package com.stocksense.product;

import com.stocksense.common.ApiResponse;
import com.stocksense_backend.inventory.entity.Product;
import com.stocksense_backend.inventory.repository.ProductRepository;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductRepository productRepository;

    public ProductController(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Product>>> getAllProducts() {
        return ResponseEntity.ok(
                ApiResponse.success(productRepository.findAll(), "Products retrieved")
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Product>> getProductById(
            @PathVariable UUID id
    ) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with ID: " + id));

        return ResponseEntity.ok(
                ApiResponse.success(product, "Product details loaded")
        );
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Product>> createProduct(
            @Valid @RequestBody Product product
    ) {
        if (productRepository.existsBySku(product.getSku())) {
            throw new RuntimeException("SKU already exists: " + product.getSku());
        }

        return ResponseEntity.ok(
                ApiResponse.success(
                        productRepository.save(product),
                        "Product created successfully"
                )
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Product>> updateProduct(
            @PathVariable UUID id,
            @RequestBody Product req
    ) {
        Product existing = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        existing.setName(req.getName());
        existing.setCategory(req.getCategory());
        existing.setUnitOfMeasure(req.getUnitOfMeasure());
        existing.setDescription(req.getDescription());

        return ResponseEntity.ok(
                ApiResponse.success(
                        productRepository.save(existing),
                        "Product updated successfully"
                )
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteProduct(
            @PathVariable UUID id
    ) {
        productRepository.deleteById(id);

        return ResponseEntity.ok(
                ApiResponse.success(null, "Product deleted successfully")
        );
    }
}
