package com.review.review_web_backend.services.product;
import com.review.review_web_backend.dtos.request.ProductRequestDTO;
import com.review.review_web_backend.dtos.response.CategorySimpleDTO;
import com.review.review_web_backend.dtos.response.ProductResponseDTO;
import com.review.review_web_backend.entities.*;
import com.review.review_web_backend.enums.Status;
import com.review.review_web_backend.repositories.ProductRepo;
import com.review.review_web_backend.repositories.CategoryRepo;
import com.review.review_web_backend.services.category.CategoryService;
import com.review.review_web_backend.utils.DateUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.Instant;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {
    private final ProductRepo productRepo;
    private final CategoryRepo categoryRepo;
    private final CategoryService categoryService;

    @Override
    public ProductResponseDTO createProduct(Integer categoryId, ProductRequestDTO request, User user) {
        Category category = categoryRepo.findById(categoryId).orElseThrow(() -> new RuntimeException("Category not found with id: " + categoryId));
        if (category.getManager().getId().equals(user.getId()) || user.getRole().getName().equals(Role.ADMIN)) {
            productRepo.save(Product.builder()
                    .productName(request.getProductName())
                    .avatar(request.getAvatar())
                    .description(request.getDescription())
                    .cost(request.getCost())
                    .price(request.getPrice())
                    .startDate(Instant.now())
                    .status(Status.ACTIVE)
                    .category(category)
                    .build());
            return ProductResponseDTO.builder()
                    .productName(request.getProductName())
                    .avatar(request.getAvatar())
                    .cost(request.getCost())
                    .price(request.getPrice())
                    .description(request.getDescription())
                    .build();
        } else {
            throw new RuntimeException("Only admin or editor can create products");
        }
    }

    @Override
    public List<ProductResponseDTO> getAllProducts() {
        List<Product> products = productRepo.findAll();

        return products.stream()
                .map(product -> ProductResponseDTO.builder()
                        .id(product.getId())
                        .productName(product.getProductName())
                        .avatar(product.getAvatar())
                        .cost(product.getCost())
                        .price(product.getPrice())
                        .description(product.getDescription())
                        .startDate(DateUtils.parseToLocalDate(product.getStartDate()))
                        .category(CategorySimpleDTO.builder()
                                .id(product.getCategory().getId())
                                .name(product.getCategory().getName())
                                .build())
                        .build())
                .toList();
    }


    @Override
    public ProductResponseDTO updateProduct(Long id, ProductRequestDTO request, User user) {
        Optional<Product> existingProduct = productRepo.findById(id);
        if (existingProduct.isPresent()) {
            Product product = existingProduct.get();
            if (user.getRole().getName().equals(Role.ADMIN) || user.getRole().getName().equals(Role.EDITOR)
                    && Objects.equals(product.getCategory().getManager().getId(), user.getId())) {
                product.setProductName(request.getProductName());
                product.setAvatar(request.getAvatar());
                product.setCost(request.getCost());
                product.setPrice(request.getPrice());
                product.setStartDate(Instant.now());
                product.setEndDate(DateUtils.parseToInstant(request.getEndDate()));
                product.setStatus(request.getStatus());
                product.setDescription(request.getDescription());
                productRepo.save(product);
                return ProductResponseDTO.builder()
                        .productName(product.getProductName())
                        .avatar(product.getAvatar())
                        .cost(product.getCost())
                        .price(product.getPrice())
                        .description(product.getDescription())
                        .build();
            } else {
                throw new RuntimeException("User doesn't have permission to update this product");
            }
        }
        throw new RuntimeException("Product not found with id :" + id);
    }

    @Override
    public void deleteProduct(Long id, User user) {
        Optional<Product> existingProduct = productRepo.findById(id);
        if (existingProduct.isPresent()) {
            Product product = existingProduct.get();
            if (user.getRole().getName().equals(Role.ADMIN) || user.getRole().getName().equals(Role.EDITOR)
                    && Objects.equals(product.getCategory().getManager().getId(), user.getId())) {
                productRepo.deleteById(id);
            } else {
                throw new RuntimeException("User doesn't have permission to delete this product");
            }
        } else {
            throw new RuntimeException("Product not found with id :" + id);
        }
    }

    @Override
    public ProductResponseDTO getProduct(Long id) {
        Product product = productRepo.findById(id).orElseThrow(() -> new RuntimeException("Product not found with id : " + id));
        return ProductResponseDTO.builder()
                .id(product.getId())
                .productName(product.getProductName())
                .avatar(product.getAvatar())
                .cost(product.getCost())
                .price(product.getPrice())
                .startDate(DateUtils.parseToLocalDate(product.getStartDate()))
                .description(product.getDescription())
                .category(CategorySimpleDTO.builder()
                        .id(product.getCategory().getId())
                        .name(product.getCategory().getName())
                        .build())
                .build();
    }

    @Override
    public List<ProductResponseDTO> getAllProductsByCategory(Integer categoryId) {
        List<Product> productList = productRepo.findAllByCategory_Id(Long.valueOf(categoryId));
        return productList.stream().map(product -> {

            return ProductResponseDTO.builder()
                    .id(product.getId())
                    .productName(product.getProductName())
                    .avatar(product.getAvatar())
                    .cost(product.getCost())
                    .price(product.getPrice())
                    .description(product.getDescription())
                    .startDate(DateUtils.parseToLocalDate(product.getStartDate()))
                    .build();
        }).toList();

    }

    @Override
    public List<ProductResponseDTO> getProductsByViewerRank(User viewer) {
        List<Category> accessibleCategories = categoryService.getCategoriesByViewerRank(viewer);
        List<Integer> categoryIds = accessibleCategories.stream()
                .map(Category::getId)
                .toList();
        List<Product> productList = productRepo.findByCategoryIdIn(categoryIds);
        return productList.stream().map(
                product -> ProductResponseDTO.builder()
                        .productName(product.getProductName())
                        .status(product.getStatus())
                        .description(product.getDescription())
                        .build()
        ).toList();
    }
}
