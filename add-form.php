<?php $page_name = "add-form"; ?>
<?php include "view/header.php"; ?>

<h1>Zahlen addieren</h1>

<form id="add-form">
    <input type="number" name="fnumber" min="0" pattern=" 0+\.[0-9]*[1-9][0-9]*$" required>
    <input type="number" name="fnumber1" min="0" pattern=" 0+\.[0-9]*[1-9][0-9]*$" required>
    <input type="number" name="fnumber2" min="0" pattern=" 0+\.[0-9]*[1-9][0-9]*$" required>
    <input type="number" name="fnumber3" min="0" pattern=" 0+\.[0-9]*[1-9][0-9]*$" required>
    <button>Addieren</button>
    <p id="result"></p>
</form>

<script src="controller/add-form-controller.js"></script>

<?php include "view/footer.php"; ?>