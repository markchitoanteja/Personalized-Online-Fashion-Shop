<?php
$database = new Database();

$records_per_page = 9;
$page_count = get("page") && is_numeric(get("page")) ? (int)get("page") : 1;
$offset = ($page_count - 1) * $records_per_page;

$total_records = count($database->select_all('products'));
$total_pages = ceil($total_records / $records_per_page);

$sql = "SELECT * FROM products ORDER BY id DESC LIMIT ? OFFSET ?";
$data = $database->query($sql, [$records_per_page, $offset]);
?>

<!-- ***** Main Banner Area Start ***** -->
<div class="page-heading" id="top">
    <div class="container">
        <div class="row">
            <div class="col-lg-12">
                <div class="inner-content">
                    <h2>Discover Your Style</h2>
                    <span>Curated Fashion Selections Tailored Just for You</span>
                </div>
            </div>
        </div>
    </div>
</div>
<!-- ***** Main Banner Area End ***** -->

<!-- ***** Products Area Starts ***** -->
<section class="section" id="products">
    <div class="container">
        <div class="row">
            <div class="col-lg-12">
                <div class="section-heading">
                    <h2>Our Latest Products</h2>
                    <span>Check out all of our products.</span>
                </div>
            </div>
        </div>
    </div>
    <div class="container">
        <div class="row">
            <?php if ($data): ?>
                <?php foreach ($data as $row): ?>
                    <div class="col-lg-4">
                        <div class="item">
                            <div class="thumb">
                                <div class="hover-content">
                                    <ul>
                                        <li><a href="javascript:void(0)" class="view_product" product_id="<?= $row["id"] ?>"><i class="fa fa-eye"></i></a></li>
                                        <li><a href="javascript:void(0)"><i class="fa fa-shopping-cart"></i></a></li>
                                    </ul>
                                </div>
                                <img src="uploads/products/<?= $row["image"] ?>" alt="<?= $row["name"] ?>" style="aspect-ratio: 37 / 39; width: 100%; height: auto;">
                            </div>
                            <div class="down-content">
                                <div class="row">
                                    <div class="col-9">
                                        <h4 class="text-truncate" title="<?= $row["name"] ?>"><?= $row["name"] ?></h4>
                                    </div>
                                    <div class="col-3">
                                        <span class="float-right"><?= $row["category"] ?></span>
                                    </div>
                                </div>
                                <span>₱<?= number_format($row["price"], 2) ?></span>
                            </div>
                        </div>
                    </div>
                <?php endforeach ?>
            <?php endif ?>

            <?php if ($total_pages > 1): ?>
                <div class="col-lg-12">
                    <div class="pagination">
                        <ul>
                            <?php if ($page_count > 1): ?>
                                <li>
                                    <a href="?page=<?= $page_count - 1 ?>">&larr;</a>
                                </li>
                            <?php endif ?>

                            <?php for ($i = 1; $i <= $total_pages; $i++): ?>
                                <li class="<?= $page_count == $i ? "active" : null ?>">
                                    <a href="?page=<?= $i ?>"><?= $i ?></a>
                                </li>
                            <?php endfor ?>

                            <?php if ($page_count < $total_pages): ?>
                                <li>
                                    <a href="?page=<?= $page_count + 1 ?>">&rarr;</a>
                                </li>
                            <?php endif ?>
                        </ul>
                    </div>
                </div>
            <?php endif ?>
        </div>
    </div>
</section>
<!-- ***** Products Area Ends ***** -->

<?php include_once "../app/views/components/product_details_modal.php" ?>