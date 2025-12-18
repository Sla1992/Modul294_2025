<?php
// Logout Page
$page_name = "logout";

// Include header
require_once __DIR__ . "/header.php";
?>

<!-- Logout Message -->
<p style="text-align:center;">Du wirst abgemeldet…</p>

<!-- Include logout controller -->
<script src="../controller/logout-controller.js"></script>

<!-- Include footer -->
<?php require_once __DIR__ . "/footer.php"; ?>