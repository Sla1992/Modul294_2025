<!DOCTYPE html>
<html lang="en">

<!-- Head Section -->

<head>

    <!-- Meta Tags -->
    <meta charset="UTF-8">

    <!-- Responsive Design Meta Tag -->
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Edit</title>

    <!-- Link to my external stylesheet -->
    <link rel="stylesheet" href="/view/stylesheets/style.css">
</head>

<!-- Body Section -->

<body>

    <!-- Page Wrapper, it is for the footer to stay at the bottom -->
    <div class="page-wrapper">

        <!-- Top Navigation Bar -->
        <nav class="top-nav">

            <!-- Logo Image, an inofficial Site for the Canton of Bern-->
            <img src="https://www.migration.sid.be.ch/content/dam/global/bilder/logo-be.svg" style="height: 3em;">
            <ul>

                <!-- Navigation Links -->
                <li>
                    <a href="/?page=index" class="<?= $page_name === 'index' ? 'selected' : '' ?>">Home</a>
                </li>
                <li>
                    <a href="/?page=products" <?php echo $page_name === "products" ? 'class="selected"' : ""; ?>>Products</a>
                </li>
                <li>
                    <a href="/?page=categories" <?php echo $page_name === "categories" ? 'class="selected"' : ""; ?>>Categories</a>
                </li>
                <li>
                    <a href="/?page=login" <?php echo $page_name === "login" ? 'class="selected"' : ""; ?>>Login</a>
                </li>
                <li>
                    <a href="/?page=logout" <?php echo $page_name === "logout" ? 'class="selected"' : ""; ?>>Log
                        Out</a>
                </li>
            </ul>
        </nav>